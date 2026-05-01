export default class ExAdaptSymbol {
  //---------------------------------------//
  static getAdaptBinance(symbol: string) {
    return symbol;
  }
  //---------------------------------------//
  static getAdaptBybit(symbol: string) {
    return symbol;
  }
  //---------------------------------------//
  static getAdaptOkx(symbol: string) {
    const clearSymbol = symbol.endsWith("USDT") ? symbol.slice(0, -4) : symbol;
    return `${clearSymbol}-USDT-SWAP`;
  }
  static getAdaptKraken(symbol: string) {
    const clearSymbol = symbol.endsWith("USDT") ? symbol.slice(0, -4) : symbol;
    return `${clearSymbol}ZUSD`;
  }
}
