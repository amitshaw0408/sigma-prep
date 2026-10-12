import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cfg } from "./config.js";

export const login = async (req, res) => {
  const { id = "", password = "" } = req.body || {};
  // Always run bcrypt so response time doesn't reveal whether the ID was right.
  const pwOk = await bcrypt.compare(String(password).trim(), cfg.adminHash);
  const idOk = String(id).trim().toLowerCase() === cfg.adminId;
  if (!(idOk && pwOk))
    return res.status(401).json({ error: "Incorrect ID or password." });
  res.json({
    token: jwt.sign({ role: "admin" }, cfg.jwt, { expiresIn: "12h" }),
  });
};

export const requireAdmin = (req, res, next) => {
  const t = (req.headers.authorization || "").replace(/^Bearer /, "");
  try {
    jwt.verify(t, cfg.jwt);
    next();
  } catch {
    res.status(401).json({ error: "Please log in again." });
  }
};
