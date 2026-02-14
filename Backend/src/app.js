// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");
const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { requestId } = require("./middleware/requestId");
const { sanitize } = require("./middleware/sanitize");

const app = express();

// Connect DB
connectDB();

// ✅ Fly / reverse proxies: trust the first proxy hop
// (kept here too; server.js also sets it as a guarantee)
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Middleware
app.use(helmet());

// ✅ CORS (keep open by default; tighten origins if needed later)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(requestId);
app.use(sanitize);

// ✅ Rate limit (Fly-safe; prevents hard-crash on X-Forwarded-For validation)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs

  standardHeaders: true,
  legacyHeaders: false,

  // IMPORTANT: avoid 500 crash if proxy headers are present
  // (supports express-rate-limit v7+; if your version doesn't support this, see note below)
  validate: { xForwardedForHeader: false },

  // optional: custom response
  handler: (req, res /*, next */) => {
    return res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

app.use(limiter);

// Routes
app.use("/api", routes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

module.exports = app;
