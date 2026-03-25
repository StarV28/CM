export type AnalyticArticle = {
  title: string;
  schema: Schema;
  text: string;
  data: Data;
  language: string;
  createdAt: string;
};

type Schema = {
  "@context": string;
  "@type": string;
  headline: string;
  author: {
    "@type": string;
    name: string;
  };
  datePublished: string;
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
};

type CoinData = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
};

type Data = {
  coins: CoinData[];
  topCoins: string[];
};

export interface AnalyticsResponse {
  articles: Articles | null;
}

export type Articles = {
  main: AnalyticArticle;
  previous: AnalyticArticle[];
};
