import type { NormalizedCoinListings } from "../../type/normalize.type.js";

export function NormalizedCoinListings(raw: NormalizedCoinListings) {
  try {
    if (!raw || typeof raw !== "object") return null;
    const {
      id,
      symbol,
      slug,
      name,
      circulating_supply,
      total_supply,
      max_supply,
    } = raw;

    return {
      cmc_id: id,
      symbol,
      slug,
      name,
      circulating_supply,
      total_supply,
      max_supply,
    };
  } catch (err) {
    console.error(
      "Error normalized listings cmc data",
      (err as Error)?.message
    );
    throw err;
  }
}
