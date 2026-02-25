import axios from "axios";
import type { Kline, ResData } from "./ex.type.js";

//-------------------------------------------------------------------------------------//
export default class ExchangesModel {
  //---Binance----------------------------------------------------------------------------------//

  static async getBinanceEx() {
    try {
      const params = { symbol: "BTCUSDT", interval: "1m", limit: 100 };
      const url = "https://api.binance.com/api/v3/klines";

      const res = await axios.get(url, { params });

      const formatted: Kline[] = (res.data as ResData[]).map((c: ResData) => ({
        time: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
      }));

      formatted.sort((a, b) => a.time - b.time);

      return formatted;
    } catch (err) {
      console.error(
        "❌ Error getting data exchange Binance",
        (err as Error)?.message
      );
      return [];
    }
  }
  //------Coinbase-------------------------------------------------------------------------------//
  static async getCoinbaseEx(): Promise<Kline[]> {
    try {
      const params = { granularity: 60 };
      const url = "https://api.exchange.coinbase.com/products/BTC-USD/candles";

      const res = await axios.get(url, { params });

      const formatted: Kline[] = res.data.map((c: ResData) => ({
        time: c[0] * 1000,
        open: parseFloat(c[3]),
        high: parseFloat(c[2]),
        low: parseFloat(c[1]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
      }));

      formatted.sort((a, b) => a.time - b.time);

      return formatted;
    } catch (err) {
      console.error(
        "❌ Error getting data exchange Coinbase",
        (err as Error)?.message
      );
      return [];
    }
  }
  //-----Kraken--------------------------------------------------------------------------------//
  static async getKrakenEx(): Promise<Kline[]> {
    try {
      const params = { pair: "XXBTZUSD", interval: 1 };
      const url = "https://api.kraken.com/0/public/OHLC";

      const res = await axios.get(url, { params });

      const pairKey = Object.keys(res.data.result).find((k) => k !== "last");
      const data = pairKey ? res.data.result[pairKey] : [];

      const formatted: Kline[] = data.map((c: ResData) => ({
        time: c[0] * 1000, // ms
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[6]),
      }));
      return formatted;
    } catch (err) {
      console.error(
        "❌ Error getting data exchange Kraken",
        (err as Error)?.message
      );
      return [];
    }
  }
}
