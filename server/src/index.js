import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { cfg } from "./config.js";
import routes from "./routes.js";

const app = express();

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Render/Railway/Nginx so rate limiting sees the real IP
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
        "upgrade-insecure-requests": null,
      },
    },
  }),
);
app.use(cors({ origin: cfg.clientOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use(
  "/api/admin/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts. Try again in a few minutes." },
  }),
);
app.use("/api", routes);
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

// If the built React site (client/dist) sits next to the server, serve it too. When the website is hosted separately (e.g. on Vercel) this is skipped.
const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../client/dist",
);
if (cfg.prod && fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const client = err.name === "MulterError" || /^Only JPG/.test(err.message);
  if (!client) console.error(err);
  res
    .status(client ? 400 : 500)
    .json({
      error: client ? err.message : "Something went wrong. Please try again.",
    });
});

mongoose
  .connect(cfg.mongo)
  .then(() =>
    app.listen(cfg.port, () =>
      console.log(`Sigma Prep server running on http://localhost:${cfg.port}`),
    ),
  )
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });
