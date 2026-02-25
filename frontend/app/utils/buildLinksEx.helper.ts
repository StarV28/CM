import type { ExchangeName } from "../../types/coin";
//---------------------------------------//
const BINANCE_ID = import.meta.env.binance_ref;

//---------------------------------------//

export function buildTradeUrl(exchange: ExchangeName, symbol: string) {
  const pair = `${symbol}_USDT`;

  switch (exchange) {
    case "Binance":
      return `https://www.binance.com/en/trade/${pair}?ref=${BINANCE_ID}`;

    case "Bybit":
      return `https://www.bybit.com/trade/usdt/${symbol}USDT?ref=BYBIT_ID`;

    case "OKX":
      return `https://www.okx.com/trade-spot/${symbol}-usdt?ref=OKX_ID`;

    case "Kraken":
      return `https://www.kraken.com/`;

    default:
      return "#";
  }
}
