import type { Kline } from "../../infrastructure/integrations/exchanges/ex.type.js";

export interface Source {
  key: string;
  pair: string;
  candles: Kline[];
}
