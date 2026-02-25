export function formatNumber(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined) return "-";

  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "-";

  // большие числа — с сокращением
  if (Math.abs(num) >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  }

  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  }

  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  }

  if (Math.abs(num) >= 1_000) {
    return num.toLocaleString("en-US");
  }

  // цены и мелкие значения
  return num < 1 ? num.toPrecision(4) : num.toFixed(2);
}
