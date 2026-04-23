import { getBinanceTicker } from "./exchanges/binance/binance.js";
import { getBybitTicker } from "./exchanges/bybit/bybit.js";
import { getOkxTicker } from "./exchanges/okx/okx.js";
import type { RawTicker } from "../cmc/types/rawTicker.js";
import type { CollectCoins } from "./types/exchangesMapp.js";
import { getKrakenTicker } from "./exchanges/kraken/kraken.js";

//-------------------------------------------------------------------------------------//
export async function collectTickers(
  symbols: CollectCoins,
): Promise<RawTicker[]> {
  const promises: Promise<RawTicker>[] = [];

  if (symbols.binance) promises.push(getBinanceTicker(symbols.binance));
  if (symbols.bybit) promises.push(getBybitTicker(symbols.bybit));
  if (symbols.okx) promises.push(getOkxTicker(symbols.okx));
  if (symbols.kraken) promises.push(getKrakenTicker(symbols.kraken));

  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (r): r is PromiseFulfilledResult<RawTicker> => r.status === "fulfilled",
    )
    .map((r) => r.value);
}
