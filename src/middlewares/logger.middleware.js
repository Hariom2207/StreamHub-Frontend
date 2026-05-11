export const logRequest  = (cfg) => {
  if (import.meta.env.DEV) console.log(`[API ▶] ${cfg.method?.toUpperCase()} ${cfg.url}`)
  return cfg
}

export const logResponse = (res) => {
  if (import.meta.env.DEV) console.log(`[API ✓] ${res.status} ${res.config?.url}`)
  return res
}