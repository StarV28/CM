export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ResData = [number, string, string, string, string, string, string];
