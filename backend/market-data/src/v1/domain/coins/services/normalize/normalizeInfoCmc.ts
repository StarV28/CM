import type {
  NormalizedCoinMeta,
  RawCmcMetadata,
} from "../../type/normalize.type.js";

//-------------------------------------------------------------------------------------//

export function normalizeCoinMeta(
  raw: RawCmcMetadata
): NormalizedCoinMeta | null {
  if (!raw || typeof raw !== "object") return null;

  const {
    id,
    name,
    symbol,
    slug,
    description,
    logo,
    urls,
    platform,
    date_added,
    date_launched,
    infinite_supply,
  } = raw;

  return {
    id,
    name,
    symbol,
    slug,

    description,
    logo: logo ?? null,

    website: urls?.website?.[0] ?? null,
    explorer: urls?.explorer?.[0],

    platform: platform
      ? {
          id: Number(platform.id),
          name: platform.name,
          symbol: platform.symbol,
          slug: platform.slug,
          tokenAddress: platform.token_address,
        }
      : undefined,

    infinite: infinite_supply ?? false,

    addedAt: date_added?.slice(0, 19).replace("T", " "),
    launchedAt: date_launched?.slice(0, 19).replace("T", " "),
  };
}
