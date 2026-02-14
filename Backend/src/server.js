// src/server.js
const app = require("./app");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// ✅ Bulletproof: ensure trust proxy is set on the actual running app instance
// (even if app.js also sets it, this guarantees it)
app.set("trust proxy", 1);

app.listen(PORT, HOST, () => {
  console.log("trust proxy =", app.get("trust proxy"));
  console.log(`Server running on http://${HOST}:${PORT}`);
});
