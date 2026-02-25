export interface CmcListingsResponse {
  data: CmcListingCoin[];
}

export interface CmcListingCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  quote: {
    [currency: string]: {
      price: number;
      volume_24h: number;
      volume_7d?: number;
      volume_30d?: number;
      market_cap: number;
      percent_change_1h?: number;
      percent_change_24h?: number;
      percent_change_7d?: number;
    };
  };
}
export interface CmcSymbolRow {
  cmc_id: number;
  symbol: string;
  slug: string;
  name: string;
  cmc_rank?: number;
  market_cap?: number;
  volume_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
}

export interface CmcMetadata {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  description?: string;
  logo?: string;
  urls?: {
    website?: string[];
    whitepaper?: string[];
    twitter?: string[];
    reddit?: string[];
    github?: string[];
  };
  tags?: string[];
  platform?: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  date_added?: string;
}

export type MetadataMap = Record<number, CmcMetadata>;

export interface CmcQuote {
  price?: number;
  volume_24h?: number;
  market_cap?: number;
  market_cap_change_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
  percent_change_30d?: number;
  ath_price?: number;
  ath_change_percentage?: number;
  ath_date?: string;
  atl_price?: number;
  atl_change_percentage?: number;
  atl_date?: string;
}

export type QuoteMap = Record<number, CmcQuote>;
