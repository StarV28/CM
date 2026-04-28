import { getMatcherCoins } from "../../../domain/coins/services/MatcherService.js";
import { cache } from "../../../../../shared/utils/cache_nodes.js";
import type { TradingCoins, CmcCoinsTop } from "../type/ratingCoins.type.js";

//-------------------------------------------------------------------------------------//
export async function calcCoinRating(trCoins: TradingCoins[]) {
  try {
    let topCoins: CmcCoinsTop[];

    const cached = cache.get("tradingCoins");
    if (cached && Array.isArray(cached)) {
      topCoins = cached as CmcCoinsTop[];
    } else {
      const result = await getMatcherCoins();
      topCoins = result ?? [];
    }

    const topMap = new Map(topCoins.map((c) => [c.symbol.toUpperCase(), c]));

    const enriched = trCoins
      .map((coin) => {
        const top = topMap.get(coin.symbol.toUpperCase());
        if (!top) return null;

        const market_cap = coin.price_usd * (top.circulating_supply ?? 0);

        const exchangeCount = [
          top.binance,
          top.bybit,
          top.okx,
          top.kraken,
        ].filter(Boolean).length;

        if (exchangeCount < 2) return null;

        const exchangeFactor = Math.log1p(exchangeCount);

        return {
          ...coin,
          market_cap: market_cap * exchangeFactor,
          volume_24h: top.volume_24h ?? 0,
        };
      })
      .filter(
        (
          c,
        ): c is TradingCoins & {
          market_cap: number;
          volume_24h: number;
        } => c !== null && c.market_cap > 0 && c.volume_24h > 100_000,
      );

    enriched.sort((a, b) => b.market_cap - a.market_cap);

    const ratedCoins = enriched.map((coin, index) => ({
      symbol: coin.symbol,
      symbolsEx: coin.symbolsEx,
      price_usd: coin.price_usd,
      high24h: coin.high24h,
      low24h: coin.low24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      sources: coin.sources,
      market_cap: coin.market_cap,
      volume_24h: coin.volume_24h,
      rating: index + 1,
    }));

    return ratedCoins;
  } catch (err) {
    console.error("Error rating coins", (err as Error).message);
    throw err;
  }
}
