import type {
  RawCmcFinData,
  NormalizedCoinFin,
} from "../../type/normalize.type.js";

//-------------------------------------------------------------------------------------//
export function normalizedCoinFin(
  cmc_id: number,
  raw: RawCmcFinData
): NormalizedCoinFin | null {
  if (!raw || typeof raw !== "object" || !raw?.volume_24h) return null;

  const {
    volume_24h,
    volume_change_24h,
    percent_change_24h,
    percent_change_7d,
    percent_change_30d,
    fully_diluted_market_cap,
  } = raw;

  return {
    cmc_id,
    volume_24h,
    volume_change_24h: volume_change_24h ?? 0,
    percent_change_24h: percent_change_24h ?? 0,
    percent_change_7d: percent_change_7d ?? 0,
    percent_change_30d: percent_change_30d ?? 0,
    fully_diluted_market_cap: fully_diluted_market_cap ?? 0,
  };
}
