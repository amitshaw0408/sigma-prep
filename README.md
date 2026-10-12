# Sigma Prep — React + Express + MongoDB + Cloudinary

Students browse course folders and are sent to your Telegram to enroll. You manage **courses, reviews and images from the admin panel** — no code changes needed.

```
client/   React + Vite website
server/   Express API  (MongoDB via Mongoose, images on Cloudinary, JWT admin login)
```

## 1. One-time setup
You need Node 18.11+, a free **MongoDB Atlas** database and a free **Cloudinary** account.

1. **MongoDB Atlas** → create a free cluster → *Database Access*: add a user → *Network Access*: allow your IP (or 0.0.0.0/0 for hosting) → *Connect → Drivers*: copy the connection string and put a database name before the `?`, e.g. `.../sigmaprep?retryWrites=true...`
2. **Cloudinary** → Dashboard → copy *Cloud name*, *API Key*, *API Secret*.
3. Install everything:
   ```bash
   npm run install:all
   ```
4. Create the server settings file:
   ```bash
   cp server/.env.example server/.env
   ```
   Fill in `server/.env`:
   - `MONGODB_URI`, `CLOUDINARY_*` from steps 1–2
   - `JWT_SECRET` — run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste the result
   - `ADMIN_ID` — your admin ID (not case sensitive)
   - `ADMIN_PASSWORD_HASH` — run `npm --prefix server run hash -- "your-strong-password"` and paste the output **inside single quotes**
5. Load the starter courses and sample reviews (only needed once, into an empty database):
   ```bash
   npm run seed
   ```

## 2. Run it (development)
Two terminals:
```bash
npm run dev:server   # API on http://localhost:5000
npm run dev:client   # website on http://localhost:5173
```

## 3. Admin panel
Click the **logo 3 times quickly** → sign in with your `ADMIN_ID` / password. You can add, edit and delete **courses** (with image upload), set **folder images**, and add/edit/delete **reviews**. Changes are saved in MongoDB and appear on the site immediately. Images are uploaded to Cloudinary (resized, max 5 MB).

The 10 seeded reviews are **samples** (labelled "Sample review" on the site). Delete them in the admin panel and add real ones.

Your Telegram / Instagram links, FAQ text and roadmap steps are in `client/src/data/siteConfig.js` (replace `YOUR_TELEGRAM_USERNAME` and `YOUR_INSTAGRAM_USERNAME`).

## 4. Deploy (one service)
In production the Express server also serves the built website, so you deploy one app (e.g. Render, Railway, Fly.io, a VPS):
```bash
npm run install:all && npm run build     # build command
NODE_ENV=production npm start            # start command
```
Set the same variables as `server/.env` in your host's environment settings, plus `NODE_ENV=production`. Use HTTPS (hosts like Render provide it).
If you host the website and API on different domains, set `VITE_API_URL` in `client/.env` (see `client/.env.example`) and `CLIENT_ORIGIN`-based CORS for your site URL.

## Security notes
- The password is stored only as a **bcrypt hash** on the server; login returns a **JWT** (12 h). All write routes require it; `/api/admin/login` is rate limited (10 tries / 15 min).
- Inputs are whitelisted and length-limited, uploads are limited to JPG/PNG/WebP/GIF ≤ 5 MB, and `helmet` security headers are on.
- Never commit `server/.env`. Use a long unique password and rotate `JWT_SECRET` if it leaks (this logs everyone out).

## API (for reference)
Public: `GET /api/courses`, `/api/reviews`, `/api/folders`.
Admin (Bearer token): `POST /api/admin/login`, `POST|PUT|DELETE /api/courses[/:id]` (multipart: JSON in `data` + optional `image`), `POST|PUT|DELETE /api/reviews[/:id]`, `PUT|DELETE /api/folders` (cover image per category).
