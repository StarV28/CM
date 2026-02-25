type CmcUrls = {
  website?: string[];
  explorer?: string[];
};

type CmcPlatform = {
  id: number | string;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
};

export type RawCmcMetadata = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  description?: string;
  logo?: string;
  urls?: CmcUrls;
  platform?: CmcPlatform;
  date_added?: string;
  date_launched?: string;
  infinite_supply?: boolean;
};
//---------------------------------------//
export type NormalizedCoinMeta = {
  id: number;
  name: string;
  symbol: string;
  slug: string;

  logo: string | null;
  description?: string;

  website?: string | null;
  explorer?: string;

  platform?: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    tokenAddress: string;
  };

  infinite: boolean;

  addedAt?: string;
  launchedAt?: string;
};
//--------Fin data-------------------------------//
export type RawCmcFinData = {
  price?: number;
  volume_24h?: number;
  volume_change_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  percent_change_60d?: number;
  percent_change_90d?: number;
  market_cap?: number;
  market_cap_dominance?: number | null;
  fully_diluted_market_cap?: number;
  tvl?: number | null;
  last_updated?: string;
};

export type NormalizedCoinFin = {
  cmc_id: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  fully_diluted_market_cap: number;
};
//-----listing Data----------------------------------//

export type NormalizedCoinListings = {
  id: number;
  symbol: string;
  slug: string;
  name: string;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
};
