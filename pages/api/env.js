export default function handler(req, res) {
  const { key } = req.query;

  // Comma-separated whitelist, e.g. "RUNTIME_FOO,SERVER_SECRET"
  const allowed = (process.env.ALLOWED_RUNTIME_KEYS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const keys = Array.isArray(key) ? key : key ? [key] : allowed;

  const out = {};
  for (const k of keys) {
    if (!allowed.includes(k)) continue;
    // Never echo secrets blindly in production; this is for testing only.
    out[k] = process.env[k] ?? null;
  }

  res.status(200).json({ allowed, values: out });
}

