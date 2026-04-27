import { RawTicker } from "../cmc/types/rawTicker.js";
import { MarketSnapshot } from "./types/marketSnapshot.js";

export function aggregateTickers(tickers: RawTicker[]): MarketSnapshot | null {
  if (!tickers.length) return null;
  const symbol = tickers[0].symbol;
  // console.log("tickers-----------", tickers);
  let priceSum = 0;
  let volumeSum = 0;
  let changeSum = 0;
  let changeCount = 0;

  let symbolBinance: string | null = null;
  let symbolBybit: string | null = null;
  let symbolOkx: string | null = null;
  let symbolKraken: string | null = null;

  let high = -Infinity;
  let low = Infinity;

  for (const t of tickers) {
    priceSum += t.price;
    volumeSum += t.volume24h;

    if (t.change24hPercent !== null) {
      changeSum += t.change24hPercent ?? 0;
      changeCount++;
    }

    if (t.high24h > high) high = t.high24h;
    if (t.low24h < low) low = t.low24h;

    switch (t.exchange) {
      case "binance":
        symbolBinance = t.symbol;
        break;
      case "bybit":
        symbolBybit = t.symbol;
        break;
      case "okx":
        symbolOkx = t.symbol;
        break;
      case "kraken":
        symbolKraken = t.symbol;
        break;
    }
  }
  return {
    symbol,
    symbolBinance,
    symbolBybit,
    symbolOkx,
    symbolKraken,
    price_usd: priceSum / tickers.length,
    high24h: high,
    low24h: low,
    volume24h: volumeSum,
    market_cap_change_percentage_24h: changeCount
      ? changeSum / changeCount
      : changeSum / tickers.length,
    sources: tickers.map((t) => t.exchange),
    sourceCount: tickers.length,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
}
