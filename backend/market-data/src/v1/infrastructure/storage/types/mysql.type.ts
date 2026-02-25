export type TopCmcCoin = {
  cmc_id: number;
  symbol: string;
  slug: string;
  name: string;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
};

export type TopCmcCoins = TopCmcCoin[];

export type CmcQuotesData = {
  cmc_id: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  fully_diluted_market_cap: number;
  ath_price?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl_price?: number;
  atl_change_percentage?: number;
  atl_date?: string;
};

export type CmcMetadata = {
  cmc_id: number;
  name: string;
  symbol: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  explorer: string | null;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    tokenAddress: string;
  };
  infinite: boolean;
  addedAt: string;
  launchedAt: string;
};
