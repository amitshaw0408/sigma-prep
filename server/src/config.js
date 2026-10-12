import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const need = (k) => {
  const v = process.env[k];
  if (!v)
    throw new Error(
      `Missing environment variable ${k}. Copy server/.env.example to server/.env and fill it in.`,
    );
  return v;
};

export const cfg = {
  port: Number(process.env.PORT) || 5000,
  prod: process.env.NODE_ENV === "production",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongo: need("MONGODB_URI"),
  jwt: need("JWT_SECRET"),
  adminId: need("ADMIN_ID").trim().toLowerCase(),
  adminHash: need("ADMIN_PASSWORD_HASH"),
  cloud: {
    cloud_name: need("CLOUDINARY_CLOUD_NAME"),
    api_key: need("CLOUDINARY_API_KEY"),
    api_secret: need("CLOUDINARY_API_SECRET"),
    secure: true,
  },
};
if (cfg.jwt.length < 32)
  throw new Error("JWT_SECRET must be at least 32 characters long.");
