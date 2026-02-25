import axios from "axios";
import { ExchangePair } from "../../types/exchangesMapp.js";

interface KrakenAssetPair {
  altname: string;
  status?: string;
  wsname?: string;
}

interface KrakenResponse {
  result: Record<string, KrakenAssetPair>;
}

const QUOTES = ["USDT"];

export async function getKrakenSpotUsdtMarkets(): Promise<ExchangePair[]> {
  const { data } = await axios.get<KrakenResponse>(
    "https://api.kraken.com/0/public/AssetPairs"
  );

  return Object.values(data.result)
    .filter(
      (pair) =>
        pair.altname &&
        pair.status === "online" &&
        pair.wsname &&
        QUOTES.some((q) => pair.altname.toUpperCase().endsWith(q))
    )
    .map((pair) => {
      const altname = pair.altname!.toUpperCase();
      const quote = QUOTES.find((q) => altname.endsWith(q))!;
      const base = altname.slice(0, -quote.length);

      return {
        exchange: "kraken",
        base_asset: base,
        quote_asset: quote,
        exchange_symbol: altname,
      };
    });
}
