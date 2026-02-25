import ExchangesModel from "../../infrastructure/integrations/exchanges/exchangesApi.js";
import { syncRedis } from "../../infrastructure/storage/redis/redis.repository.js";
import type { Source } from "./ex.type.js";

//-------------------------------------------------------------------------------------//
export async function allEx(): Promise<void> {
  try {
    const [binance, coinbase, kraken] = await Promise.all([
      ExchangesModel.getBinanceEx(),
      ExchangesModel.getCoinbaseEx(),
      ExchangesModel.getKrakenEx(),
    ]);

    const values: Source[] = [
      { key: "binance", pair: "BTC/USDT", candles: binance },
      { key: "coinbase", pair: "BTC/USD", candles: coinbase },
      { key: "kraken", pair: "BTC/USD", candles: kraken },
    ];

    await syncRedis("market:exchange", values, 120);
  } catch (err) {
    console.error("Error getting data Exchanges", (err as Error)?.message);
    throw err;
  }
}
