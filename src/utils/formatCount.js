// KYA KAAM KARTA HAI:
//   Large numbers ko readable banata hai.
//   EXAMPLE:
//   formatCount(1500)    → "1.5K"
//   formatCount(2300000) → "2.3M"
// ============================================================

export const formatCount = (n = 0) => {
  if (!n || isNaN(n)) return '0'
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}