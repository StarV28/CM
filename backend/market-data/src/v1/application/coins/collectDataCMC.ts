import SyncTopCoinsFull from "../../infrastructure/integrations/cmc/cmc.service.js";
import getPool from "../../../../db/connect_MySQL.js";
import { normalizeCoinMeta } from "../../domain/coins/services/normalize/normalizeInfoCmc.js";
import { normalizedCoinFin } from "../../domain/coins/services/normalize/normalizeFinDataCmc.js";
import { NormalizedCoinListings } from "../../domain/coins/services/normalize/normalizeListingData.js";
import { saveTop500coins } from "../../infrastructure/storage/mysql/listings_coins.repository.js";
// import { createCmcQuotes } from "../../infrastructure/tables/cmcQuotes.table.js";
import { saveCmcQuotes } from "../../infrastructure/storage/mysql/qoutes_coinsCmc.repository.js";
import { createCmcMetadata } from "../../infrastructure/tables/cmcMetadata.js";
import { saveMetadataCmc } from "../../infrastructure/storage/mysql/metadata_coinsCmc.repository.js";
import type {
  NormalizedCoinMeta,
  NormalizedCoinFin,
} from "../../domain/coins/type/normalize.type.js";
//-------------------------------------------------------------------------------------//
const pool = await getPool();

export default class CollectDataCMC {
  //---------------------------------------//
  static async fetchCMCTopCoins() {
    const data = await SyncTopCoinsFull.syncTopCoins();
    const result = Object.values(data ?? [])
      .map(NormalizedCoinListings)
      .filter((c): c is NonNullable<typeof c> => c !== null);
    await saveTop500coins(result);
  }
  //---------------------------------------//
  static async fetchCMCFinData() {
    const data = await SyncTopCoinsFull.pricesDataCmc();
    const result = Object.entries(data).map(([cmc_id, raw]) =>
      normalizedCoinFin(Number(cmc_id), raw),
    );

    // const [rows] = await pool.query(`SHOW TABLES LIKE 'cmc_quotes'`);
    // if (!rows || (Array.isArray(rows) && rows.length <= 0)) {
    //   await createCmcQuotes();
    // }
    const filteredResult = result.filter(
      (c): c is NormalizedCoinFin => c !== null,
    );
    await saveCmcQuotes(filteredResult);
  }

  //---------------------------------------//
  static async fetchCMCMetaData() {
    const data = await SyncTopCoinsFull.metadataInfo();
    const result = Object.values(data)
      .map(normalizeCoinMeta)
      .filter((c): c is NormalizedCoinMeta => c !== null);

    const [rows] = await pool.query(`SHOW TABLES LIKE 'cmc_metadata'`);
    if (!rows || (Array.isArray(rows) && rows.length <= 0)) {
      await createCmcMetadata();
    }

    await saveMetadataCmc(result);
    return result;
  }
  //---------------------------------------//
  // static async fetchCMCTopSymbols() {
  //   const res = await SyncTopCoinsFull.topTradCoins();
  //   return res;
  // }
}
