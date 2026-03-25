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
  price: number;
  change24h: number;
  volume: number;
};

type Data = {
  [symbol: string]: CoinData | string[];
  topCoins: string[];
};

export type AnalyticsResponse = {
  main: AnalyticArticle | null;
  previous: AnalyticArticle[];
};
