const express = require("express");
const app = express();

let keyData = {
  key: "OJWSD99DDXND12!",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
  used: false,
  owner: null
};

app.get("/", (req, res) => {
  res.send("API is running on Vercel!");
});

app.get("/check_key/:key", (req, res) => {
  const { key } = req.params;
  const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (key !== keyData.key) {
    return res.status(404).json({ error: "Key not found" });
  }

  if (new Date() > new Date(keyData.expires)) {
    return res.status(403).json({ error: "Key expired" });
  }
  if (keyData.used) {
    if (keyData.owner === clientIp) {
      return res.json({
        status: "valid",
        expires: keyData.expires,
        owner: clientIp
      });
    } else {
      return res.status(403).json({ error: "Key already used by someone else" });
    }
  }

  keyData.used = true;
  keyData.owner = clientIp;

  return res.json({
    status: "valid",
    expires: keyData.expires,
    owner: clientIp
  });
});

module.exports = app;
