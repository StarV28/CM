import axios from "axios";
import config from "../../../../../config/index.js";
import getPool from "../../../../../db/connect_MySQL.js";
import { cache } from "../../../../../shared/utils/cache_nodes.js";
import type {
  CmcSymbolRow,
  CmcMetadata,
  MetadataMap,
  CmcQuote,
  QuoteMap,
  CmcListingsResponse,
} from "./types/cmc.type.js";
import type { RowDataPacket } from "mysql2";
// import { createCMCIdTable } from "../../tables/cmcID.table.js";
//-------------------------------------------------------------------------------------//
const BATCH_SIZE = 100;
const pool = await getPool();
const keyCmc = config.apiKeyCmc;
//-------------------------------------------------------------------------------------//
export default class SyncTopCoinsFull {
  //---------------------------------------//
  static async syncTopCoins(top: number = 500) {
    // const pool = await getPool();
    const keyCmc = config.apiKeyCmc;

    try {
      const { data } = await axios.get<CmcListingsResponse>(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
        {
          headers: { "X-CMC_PRO_API_KEY": keyCmc },
          params: {
            start: 1,
            limit: top,
            convert: "USD",
          },
        },
      );

      if (!data?.data?.length) {
        console.warn("CMC: there are no top coins");
        return;
      }

      // const [rows] = await pool.query(`SHOW TABLES LIKE 'cmc_symbol'`);
      // if (!rows || (Array.isArray(rows) && rows.length <= 0)) {
      //   await createCMCIdTable();
      // }

      return data.data;
    } catch (err) {
      console.error("CMC sync error:", err);
      throw err;
    }
  }
  //---------------------------------------//

  static async topCmcCoins(top: number = 500): Promise<CmcSymbolRow[]> {
    try {
      const cached = cache.get("topCMCCoins");
      cache.del("topCMCCoins");
      if (Array.isArray(cached)) return cached as CmcSymbolRow[];
      const [rows] = await pool.query<RowDataPacket[] & CmcSymbolRow[]>(
        "SELECT * FROM cmc_symbol",
        [top],
      );
      return rows;
    } catch (err) {
      console.error(
        "Error getting data CMC from tables",
        (err as Error)?.message,
      );
      throw err;
    }
  }
  //---------------------------------------//
  // static async topTradCoins() {
  //   try {
  //     const cached = cache.get("tradingCoins");
  //     if (cached && Array.isArray(cached)) return cached;

  //     const [rows] = await pool.query<RowDataPacket[]>(
  //       "SELECT * FROM trading_coins"
  //     );
  //     return rows;
  //   } catch (err) {
  //     console.error("Error getting trading top coins", (err as Error)?.message);
  //   }
  // }

  //---------------------------------------//

  static async getTopCoinsIds(): Promise<number[]> {
    try {
      const cached = cache.get("tradingCoins");
      if (cached && Array.isArray(cached)) {
        return cached.map((c) => c.cmc_id);
      }
      const [rows] = await pool.query<(RowDataPacket[] & { cmc_id: number })[]>(
        "SELECT cmc_id FROM cmc_symbol",
      );

      const iDs = rows.map((c) => c.cmc_id);
      return iDs;
    } catch (err) {
      console.error(
        "Error getting Ids from top coins ",
        (err as Error)?.message,
      );
      throw err;
    }
  }
  //---------------------------------------//
  static async metadataInfo(): Promise<MetadataMap> {
    try {
      const coinsIds = await this.getTopCoinsIds();

      const metadataMap: Record<number, CmcMetadata> = {};

      for (let i = 0; i < coinsIds.length; i += BATCH_SIZE) {
        const batchIds = coinsIds.slice(i, i + BATCH_SIZE);
        const { data: infoData } = await axios.get<{ data: MetadataMap }>(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info",
          {
            headers: { "X-CMC_PRO_API_KEY": keyCmc },
            params: { id: batchIds.join(",") },
          },
        );

        Object.values(infoData.data).forEach((coin) => {
          metadataMap[coin.id] = coin;
        });
      }
      return metadataMap;
    } catch (err) {
      console.error(
        "Error getting Metadata CMC Info ",
        (err as Error)?.message,
      );
      throw err;
    }
  }
  //---------------------------------------//
  static async pricesDataCmc() {
    try {
      const coinsIds = await this.getTopCoinsIds();

      const quoteMap: QuoteMap = {};

      for (let i = 0; i < coinsIds.length; i += BATCH_SIZE) {
        const batchIds = coinsIds.slice(i, i + BATCH_SIZE);
        const { data: quoteData } = await axios.get<{
          data: Record<number, { id: number; quote: { USD: CmcQuote } }>;
        }>(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
          {
            headers: { "X-CMC_PRO_API_KEY": keyCmc },
            params: { id: batchIds.join(","), convert: "USD" },
          },
        );

        Object.values(quoteData.data).forEach((coin) => {
          quoteMap[coin.id] = coin.quote.USD;
        });
      }

      return quoteMap;
    } catch (err) {
      console.error(
        "Error getting Prices data from CMC ",
        (err as Error)?.message,
      );
      throw err;
    }
  }
}
