// import getPool from "../../../../../db/connect_MySQL.js";
import { topData } from "./cmc_services/top.data.js";
import { quotesData } from "./cmc_services/qoutes.data.js";
import { commonSymbols } from "../../../infrastructure/integrations/exServices/exchanges/exchanges.mapping.js";
// import { createTradingCoins } from "../../../infrastructure/tables/trading_coins.table.js";
import { cache } from "../../../../../shared/utils/cache_nodes.js";
import type { TradingCoin } from "../type/matche.types.js";
//-------------------------------------------------------------------------------------//

export async function getMatcherCoins() {
  try {
    // const pool = await getPool();

    const cached = cache.get<TradingCoin[]>("tradingCoins");
    if (cached) {
      return cached;
    }

    const top_coins = await topData();
    //---------------------------------------//

    const price_coins = await quotesData();
    const quotes = new Map<number, { volume_24h: number }>();

    Object.values(price_coins).forEach((c) => {
      quotes.set(c.cmc_id, {
        volume_24h: c.volume_24h,
      });
    });
    //---------------------------------------//

    const exchangeMap = new Map();

    for (const s of commonSymbols()) {
      if (s.quote_asset !== "USDT") continue;

      const base = s.base_asset.toUpperCase();

      exchangeMap.set(base, {
        base_asset: base,
        quote_asset: s.quote_asset,
        symbols: {
          binance: s.symbols?.binance ?? null,
          bybit: s.symbols?.bybit ?? null,
          okx: s.symbols?.okx ?? null,
          kraken: s.symbols?.kraken ?? null,
        },
      });
    }

    const coins: TradingCoin[] = Object.values(top_coins).flatMap((c) => {
      const ex = exchangeMap.get(c.symbol.toUpperCase());
      if (!ex) return [];

      const quote = quotes.get(c.cmc_id);

      return [
        {
          cmc_id: c.cmc_id,
          symbol: c.symbol,
          slug: c.slug,
          name: c.name,
          volume_24h: quote?.volume_24h ?? 0,
          circulating_supply: c.circulating_supply,
          total_supply: c.total_supply,
          max_supply: c.max_supply,

          binance: ex.symbols.binance,
          bybit: ex.symbols.bybit,
          okx: ex.symbols.okx,
          kraken: ex.symbols.kraken,
        },
      ];
    });
    cache.set("tradingCoins", coins, 900);

    return coins;
  } catch (err) {
    console.error("Error make trading coins ", (err as Error)?.message);
    throw err;
  }
}

//---------------------------------------//

//---------------------------------------//
// const [rows] = await pool.query(`SHOW TABLES LIKE 'trading_coins'`);
// if (!rows || (Array.isArray(rows) && rows.length <= 0)) {
//   await createTradingCoins();
// }

//---------------------------------------//
// const sql = `
//     INSERT INTO trading_coins (
//       cmc_id, symbol, slug, name, volume_24h,circulating_supply, total_supply, max_supply, binance, bybit, okx, kraken
//     ) VALUES ?
//   ON DUPLICATE KEY UPDATE
//       symbol = VALUES(symbol),
//       slug = VALUES(slug),
//       name = VALUES(name),
//       volume_24h = VALUES(volume_24h),
//       circulating_supply = VALUES(circulating_supply),
//       total_supply = VALUES(total_supply),
//       max_supply = VALUES(max_supply),
//       binance = VALUES(binance),
//       bybit = VALUES(bybit),
//       okx = VALUES(okx),
//       kraken = VALUES(kraken);
//   `;

// if (coins.length > 0) {
//   const values = coins.map((c) => [
//     c.cmc_id,
//     c.symbol,
//     c.slug,
//     c.name,
//     c.volume_24h,
//     c.circulating_supply,
//     c.total_supply,
//     c.max_supply,
//     c.symbols.binance,
//     c.symbols.bybit,
//     c.symbols.okx,
//     c.symbols.kraken,
//   ]);

//   await pool.query(sql, [values]);
// }

//---------------------------------------//
// const trCoinsObj = coins.map((c) => ({
//   cmc_id: c.cmc_id,
//   symbol: c.symbol,
//   slug: c.slug,
//   name: c.name,
//   volume_24h: c.volume_24h,
//   circulating_supply: c.circulating_supply,
//   total_supply: c.total_supply,
//   max_supply: c.max_supply,
//   binance: c.symbols.binance,
//   bybit: c.symbols.bybit,
//   okx: c.symbols.okx,
//   kraken: c.symbols.kraken,
// }));
