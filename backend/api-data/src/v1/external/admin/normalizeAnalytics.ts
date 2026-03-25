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
  const coinTopOne = coins[0];
  const coinTopTwo = coins[1];
  const topCoinsSlug = coins.map((coin) => coin.symbol);

  const analyticData = {
    title: "Analytics Page",
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
      [coinTopOne.symbol]: {
        price: coinTopOne.price_usd,
        change24h: coinTopOne.volume_change_24h,
        volume: Number(coinTopOne.total_supply),
      },
      [coinTopTwo.symbol]: {
        price: coinTopTwo.price_usd,
        change24h: coinTopTwo.volume_change_24h,
        volume: Number(coinTopTwo.total_supply),
      },
      topCoins: topCoinsSlug,
    },
    language: locale,
    createdAt: date,
  };

  return analyticData;
}
