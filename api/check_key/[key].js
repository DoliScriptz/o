let keyData = {
  key: "7F2A91BC44DE0E1F",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  used: false,
  owner: null
};

export default function handler(req, res) {
  const { key } = req.query;

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  if (key !== keyData.key) {
    return res.status(404).json({ error: "Key not found" });
  }
  if (new Date() > keyData.expires) {
    return res.status(403).json({ error: "Key expired" });
  }
  if (keyData.used && keyData.owner !== clientIp) {
    return res.status(403).json({ error: "Key already used by someone else" });
  }

  keyData.used = true;
  keyData.owner = clientIp;

  return res.json({
    status: "valid",
    expires: keyData.expires,
    owner: clientIp
  });
}
