// KYA KAAM KARTA HAI:
//   Backend seconds mein duration bhejta hai.
//   Yeh function usse readable format mein convert karta hai.
//
// EXAMPLE:
//   formatDuration(65)    → "1:05"
//   formatDuration(3661)  → "1:01:01"
//   formatDuration(0)     → "0:00"
// ============================================================

export const formatDuration = (seconds = 0) => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const totalSecs = Math.floor(seconds)
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = totalSecs % 60

  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')

  if (h > 0) return `${h}:${mm}:${ss}`
  return `${m}:${ss}`
}