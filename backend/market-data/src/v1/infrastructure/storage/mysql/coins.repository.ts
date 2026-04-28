import getPool from "../../../../../db/connect_MySQL.js";
import type { TradingCoinView } from "../../../domain/coins/type/buildTrCoins.types.js";
// import { createCoinsCmcTable } from "../../../infrastructure/tables/coins.table.js";

//-------------------------------------------------------------------------------------//

export async function syncCoins(coins: TradingCoinView[]) {
  if (!coins.length) return;
  const pool = await getPool();

  //---------------------------------------//

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const values = coins.map((c) => [
      c.cmc_id,
      c.symbol,
      c.name,
      c.slug,
      c.logo,

      c.price_usd,
      c.high24h,
      c.low24h,
      c.market_cap,
      c.market_cap_change_percentage_24h,
      c.rating,

      c.circulating_supply,
      c.total_supply,
      c.max_supply,

      c.volume_24h,
      c.volume_change_24h,
      c.percent_change_24h,
      c.percent_change_7d,
      c.percent_change_30d,
      c.fully_diluted_market_cap,

      c.description,
      c.website,
      c.explorer,

      c.symbolsEx.symbolBinance,
      c.symbolsEx.symbolBybit,
      c.symbolsEx.symbolOkx,
      c.symbolsEx.symbolKraken,

      c.binance,
      c.bybit,
      c.okx,
      c.kraken,

      c.added_at ?? null,
    ]);
    await conn.query(
      `
      INSERT INTO coins (
        cmc_id, symbol, name, slug, logo,
        price_usd, high_24h, low_24h,
        market_cap, market_cap_change_percentage_24h, rating,
        circulating_supply, total_supply, max_supply,
        volume_24h, volume_change_24h,
        percent_change_24h, percent_change_7d, percent_change_30d,
        fully_diluted_market_cap,
        description, website, explorer,symbolBinance, symbolBybit, symbolOkx, symbolKraken, binance, bybit, okx, kraken,
        added_at
      )
      VALUES ?
      ON DUPLICATE KEY UPDATE
        price_usd = VALUES(price_usd),
        high_24h = VALUES(high_24h),
        low_24h = VALUES(low_24h),
        market_cap = VALUES(market_cap),
        market_cap_change_percentage_24h = VALUES(market_cap_change_percentage_24h),
        rating = VALUES(rating),

        circulating_supply = VALUES(circulating_supply),
        total_supply = VALUES(total_supply),
        max_supply = VALUES(max_supply),

        volume_24h = VALUES(volume_24h),
        volume_change_24h = VALUES(volume_change_24h),
        percent_change_24h = VALUES(percent_change_24h),
        percent_change_7d = VALUES(percent_change_7d),
        percent_change_30d = VALUES(percent_change_30d),

        fully_diluted_market_cap = VALUES(fully_diluted_market_cap),

        description = VALUES(description),
        website = VALUES(website),
        explorer = VALUES(explorer),

        symbolBinance = VALUES(symbolBinance),
        symbolBybit = VALUES(symbolBybit),
        symbolOkx = VALUES(symbolOkx),
        symbolKraken = VALUES(symbolKraken),

        binance = VALUES(binance),
        bybit = VALUES(bybit),
        okx = VALUES(okx),
        kraken = VALUES(kraken),

        updated_at = CURRENT_TIMESTAMP
      `,
      [values],
    );

    const cmcIds = coins.map((c) => c.cmc_id);

    if (cmcIds.length) {
      await conn.query(`DELETE FROM coins WHERE cmc_id NOT IN (?)`, [cmcIds]);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
