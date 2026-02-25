// export function normBaseKraken(symbol: string) {
//   return KRAKEN_ALIASES[symbol.toUpperCase()] ?? symbol.toUpperCase();
// }

export const KRAKEN_ALIASES: Record<string, string> = {
  XBT: "BTC",

  XETH: "ETH",
  ETH: "ETH",

  XDG: "DOGE",
  DOGE: "DOGE",

  XXRP: "XRP",
  XRP: "XRP",

  XLTC: "LTC",
  LTC: "LTC",

  XADA: "ADA",
  ADA: "ADA",

  XDOT: "DOT",
  DOT: "DOT",

  XTRX: "TRX",
  TRX: "TRX",

  XLINK: "LINK",
  LINK: "LINK",

  XEOS: "EOS",
  EOS: "EOS",

  XATOM: "ATOM",
  ATOM: "ATOM",

  XSOL: "SOL",
  SOL: "SOL",

  XAVAX: "AVAX",
  AVAX: "AVAX",

  XMATIC: "MATIC",
  MATIC: "MATIC",
};
