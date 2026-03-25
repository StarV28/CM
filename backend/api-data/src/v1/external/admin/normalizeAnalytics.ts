import type { Coins } from "../../../types/coins.type.js";

//---------------------------------------//

export function normalizeAnalytics(
  text: string,
  locale: string,
  coins: Coins[],
) {
  if (coins.length < 2) {
    throw new Error("Not enough coins data");
  }
  const date = new Date().toISOString().slice(0, 10);
  const topCoinsSlug = coins.map((coin) => coin.symbol);

  const dataCoins = coins.map((coin) => ({
    symbol: coin.symbol,
    price: coin.price_usd,
    change24h: coin.volume_change_24h,
    volume: Number(coin.total_supply),
  }));

  const analyticData = {
    title: "Analytical article on cryptocurrency",
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Daily Crypto Market Analysis",
      author: { "@type": "Person", name: "WPSLab" },
      datePublished: date,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://wpslab.app/analytics",
      },
    },
    text: text,
    data: {
      coins: dataCoins,
      topCoins: topCoinsSlug,
    },
    language: locale,
    createdAt: date,
  };

  return analyticData;
}
