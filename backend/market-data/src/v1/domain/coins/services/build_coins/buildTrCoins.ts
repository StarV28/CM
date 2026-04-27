import { getMatcherCoins } from "../MatcherService.js";
import { topData } from "../cmc_services/top.data.js";
import { quotesData } from "../cmc_services/qoutes.data.js";
import { marketData } from "../cmc_services/market.data.js";
import { exOrchestrator } from "../../../../infrastructure/integrations/exServices/exOrchestrator.js";
import type {
  TradingCoinView,
  CmcTopCoin,
  CmcQuoteCoin,
  CmcMarketCoin,
  ExData,
} from "../../type/buildTrCoins.types.js";
import NodeCache from "node-cache";
import { cacheRedisServer } from "../../../../../../utils/cacheRedisServer.js";

//-------------------------------------------------------------------------------------//
const priceCache = new NodeCache({ stdTTL: 45 });

export async function buildTradingCoins(): Promise<TradingCoinView[]> {
  try {
    const cacheKeyTrCoins = "buildTrCoins";
    const cachedTrCoins =
      await cacheRedisServer.get<TradingCoinView[]>(cacheKeyTrCoins);
    if (cachedTrCoins) return cachedTrCoins;

    const tradingCoins = await getMatcherCoins();
    const [topDataCmc, quotesCmc, marketCmc, exData] = await Promise.all([
      topData(),
      quotesData(),
      marketData(),
      exOrchestrator(),
    ]);
    console.log("exOrchestartor--------", exData[0]);
    const topMap = new Map<number, CmcTopCoin>();
    Object.values(topDataCmc).forEach((c) => topMap.set(c.cmc_id, c));

    const quotesMap = new Map<number, CmcQuoteCoin>();
    Object.values(quotesCmc).forEach((c) => quotesMap.set(c.cmc_id, c));

    const marketMap = new Map<number, CmcMarketCoin>();
    Object.values(marketCmc).forEach((c) => marketMap.set(c.cmc_id, c));

    const exMap = new Map<string, ExData>();
    Object.values(exData).forEach((c) => exMap.set(c.symbol.toUpperCase(), c));

    const result: TradingCoinView[] = [];

    for (const coin of tradingCoins) {
      const top = topMap.get(coin.cmc_id);
      const quote = quotesMap.get(coin.cmc_id);
      const market = marketMap.get(coin.cmc_id);
      const ex = exMap.get(coin.symbol);

      const exSources = ex?.sources ?? [];
      const exBinance = exSources.includes("binance") ? "binance" : null;
      const exBybit = exSources.includes("bybit") ? "bybit" : null;
      const exOkx = exSources.includes("okx") ? "okx" : null;
      const exKraken = exSources.includes("kraken") ? "kraken" : null;
      const symbolBinance = ex?.symbolBinance ?? null;
      const symbolBybit = ex?.symbolBybit ?? null;
      const symbolOkx = ex?.symbolOkx ?? null;
      const symbolKraken = ex?.symbolKraken ?? null;

      if (!top || !quote || !market || !ex) continue;

      //---------------------------------------//

      const cacheKey = `coin:${coin.cmc_id}`;
      const lastPrice = priceCache.has(cacheKey)
        ? priceCache.get<number>(cacheKey)!
        : ex.price_usd;

      const priceDiff = ex.price_usd - lastPrice;
      const changed = priceCache.has(cacheKey) && priceDiff !== 0;

      priceCache.set(cacheKey, ex.price_usd);

      result.push({
        cmc_id: coin.cmc_id,
        symbol: top.symbol,
        name: top.name,
        slug: top.slug,
        logo: market.logo,

        price_usd: ex.price_usd,
        high24h: ex.high24h,
        low24h: ex.low24h,
        market_cap: ex.market_cap,
        market_cap_change_percentage_24h: ex.market_cap_change_percentage_24h,
        rating: ex.rating,

        circulating_supply: top.circulating_supply,
        total_supply: top.total_supply,
        max_supply: top.max_supply,

        volume_24h: quote.volume_24h,
        volume_change_24h: quote.volume_change_24h,
        percent_change_24h: quote.percent_change_24h,
        percent_change_7d: quote.percent_change_7d,
        percent_change_30d: quote.percent_change_30d,
        fully_diluted_market_cap: quote.fully_diluted_market_cap,

        description: market?.description,
        website: market.website,
        explorer: market.explorer,

        symbolBinance: symbolBinance,
        symbolBybit: symbolBybit,
        symbolOkx: symbolOkx,
        symbolKraken: symbolKraken,

        binance: exBinance,
        bybit: exBybit,
        okx: exOkx,
        kraken: exKraken,

        added_at: market.added_at,

        priceDiff: priceDiff,
        changed: changed,
      });
    }
    await cacheRedisServer.set(cacheKeyTrCoins, result, 25);
    return result;
  } catch (err) {
    console.error("Error collect trading coins", (err as Error).message);
    throw err;
  }
}
