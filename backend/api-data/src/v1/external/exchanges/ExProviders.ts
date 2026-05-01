import axios from "axios";

//-------------------------------------------------------------------------------------//

interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
type ResData = [number, string, string, string, string, string, string];
//-------------------------------------------------------------------------------------//

export default class ExProviders {
  //---------------------------------------//
  static async getBinanceEx(pair: string) {
    try {
      const params = { symbol: pair, interval: "1m", limit: 100 };
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
        (err as Error)?.message,
      );
      return [];
    }
  }
  //--------------------------------------------------//
  static async getBybitEx(symbol: string): Promise<Kline[]> {
    try {
      const url = "https://api.bybit.com/v5/market/kline";

      const { data } = await axios.get(url, {
        params: {
          category: "linear",
          symbol,
          interval: "1",
          limit: 100,
        },
      });

      const list = data?.result?.list ?? [];

      const formatted: Kline[] = list.map((c: string[]) => ({
        time: Number(c[0]),
        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4]),
        volume: Number(c[5]),
      }));

      return formatted.sort((a, b) => a.time - b.time);
    } catch (err) {
      console.error(
        "❌ Error getting data exchange Bybit",
        (err as Error).message,
      );
      return [];
    }
  }

  //--------------------------------------------------//
  static async getOkxEx(symbol: string): Promise<Kline[]> {
    try {
      const url = "https://www.okx.com/api/v5/market/candles";

      const { data } = await axios.get(url, {
        params: {
          instId: symbol,
          bar: "1m",
          limit: 100,
        },
      });

      const list = data?.data ?? [];

      const formatted: Kline[] = list.map((c: string[]) => ({
        time: Number(c[0]),
        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4]),
        volume: Number(c[5]),
      }));

      return formatted.sort((a, b) => a.time - b.time);
    } catch (err) {
      console.error(
        "❌ Error getting data exchange OKX",
        (err as Error).message,
      );
      return [];
    }
  }
  //---------------------------------------//
  static async getKrakenEx(symbol: string): Promise<Kline[]> {
    try {
      const params = { pair: symbol, interval: 1 };
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
        (err as Error)?.message,
      );
      return [];
    }
  }
}
