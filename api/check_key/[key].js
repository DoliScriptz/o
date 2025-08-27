let keyData = {
  key: "OJNJNA2S203S2QA!",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  used: false,
  owner: null
};

export default function handler(req, res) {
  const { key } = req.query;

  // Get client IP (Vercel passes through x-forwarded-for)
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  // Check if wrong key
  if (key !== keyData.key) {
    return res.status(404).json({ error: "Key not found" });
  }

  // Check if expired
  if (new Date() > keyData.expires) {
    return res.status(403).json({ error: "Key expired" });
  }

  // If already used by different client
  if (keyData.used && keyData.owner !== clientIp) {
    return res.status(403).json({ error: "Key already used by someone else" });
  }

  // Bind key to this client and validate
  keyData.used = true;
  keyData.owner = clientIp;

  return res.json({
    status: "valid",
    expires: keyData.expires,
    owner: clientIp
  });
}
