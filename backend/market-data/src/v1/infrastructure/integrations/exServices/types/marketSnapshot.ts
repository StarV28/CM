import { SymbolsEx } from "../../../../shared/types/coins.type.js";
//---------------------------------------//

export interface MarketSnapshot {
  symbol: string;

  symbolsEx: SymbolsEx;

  price_usd: number;
  high24h: number;
  low24h: number;

  volume24h: number;
  market_cap_change_percentage_24h: number;

  sources: string[];
  sourceCount: number;

  timestamp: string;
}
