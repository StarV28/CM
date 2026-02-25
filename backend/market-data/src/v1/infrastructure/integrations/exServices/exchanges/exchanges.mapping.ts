import { getBinanceSpotUsdtMarkets } from "./binance/binance.mapping.js";
import { getBybitSpotUsdtMarkets } from "./bybit/bybit.mapping.js";
import { getOkxSpotUsdtMarkets } from "./okx/okx.mapping.js";
import { getKrakenSpotUsdtMarkets } from "./kraken/kraken.mapper.js";
import { KRAKEN_ALIASES } from "./kraken/kraken.alias.js";
import { BINANCE_ALIASES } from "./binance/binance.alias.js";
import { BYBIT_ALIASES } from "./bybit/buybit.alias.js";
import { OKX_ALIASES } from "./okx/okx.alias.js";
import type { ExchangePair, CommonSymbol } from "../types/exchangesMapp.js";

//-------------------------------------------------------------------------------------//
async function toMap(pairsOrPromise: ExchangePair[] | Promise<ExchangePair[]>) {
  const map = new Map<string, ExchangePair>();
  const pairs = await pairsOrPromise;
  for (const p of pairs) {
    if (!p.base_asset || !p.quote_asset || !p.exchange_symbol) continue;

    function normalizeExchangeBase(exchange: string, symbol: string): string {
      const s = symbol.toUpperCase();
      switch (exchange) {
        case "kraken":
          return KRAKEN_ALIASES[s] ?? s;
        case "binance":
          return BINANCE_ALIASES[s] ?? s;
        case "bybit":
          return BYBIT_ALIASES[s] ?? s;
        case "okx":
          return OKX_ALIASES[s] ?? s;
        default:
          return s;
      }
    }

    // const key = `${base}_${p.exchange_symbol}`;
    // map.set(key, { ...p, base_asset: base });

    const base = normalizeExchangeBase(p.exchange, p.base_asset);
    map.set(`${base}_${p.quote_asset}`, { ...p, base_asset: base });
  }
  return map;
}

const binanceMap = await toMap(getBinanceSpotUsdtMarkets());
const bybitMap = await toMap(getBybitSpotUsdtMarkets());
const okxMap = await toMap(getOkxSpotUsdtMarkets());
const krakenMap = await toMap(getKrakenSpotUsdtMarkets());

const allKeys = new Set([
  ...binanceMap.keys(),
  ...bybitMap.keys(),
  ...okxMap.keys(),
  ...krakenMap.keys(),
]);

export const commonSymbols = (): CommonSymbol[] => {
  const result: CommonSymbol[] = [];

  for (const key of allKeys) {
    const binanceSym = binanceMap.get(key)?.exchange_symbol;
    const bybitSym = bybitMap.get(key)?.exchange_symbol;
    const okxSym = okxMap.get(key)?.exchange_symbol;
    const krakenSym = krakenMap.get(key)?.exchange_symbol;

    if (binanceSym || bybitSym || okxSym || krakenSym) {
      const [base_asset, quote_asset] = key.split("_");
      result.push({
        base_asset,
        quote_asset,
        symbols: {
          binance: binanceSym,
          bybit: bybitSym,
          okx: okxSym,
          kraken: krakenSym,
        },
      });
    }
  }

  return result;
};
