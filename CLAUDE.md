# Signal Boss — Claude Code Guide

## What this project is

A React single-page application (Vite + JSX) for futures trading signals. Deployed on Vercel. Auth via Clerk. Live signal data from a VPS.

---

## CRITICAL — READ BEFORE TOUCHING ANYTHING

**Do not remove, rename, or restructure any existing feature without an explicit instruction to do so.**

The following features MUST remain intact at all times. If you find them missing, restore them — do not assume they were intentionally removed:

| Feature | Location |
|---|---|
| Backtest tab | Dashboard sidebar nav + `activeTab==="backtest"` content block |
| Public Backtests page | `PublicBacktests` component + `page==="backtests"` route |
| Backtests nav link | Top nav, visible on landing and backtests pages |
| "What 90% Miss" nav link | Top nav → `/market_driver.html` |
| "Master the Basics" nav link | Top nav → `/basics.html` |
| VRB Levels tab | Dashboard — label must say VRB, not ORB |
| Risk Calculator | `/calc` route → `StandaloneCalc` → `PropCalc` — no email gate |
| Ticker tape | Fixed below nav in `AppInner`, not inside `LandingPage` |
| Affiliate tracking | `?ref=` captured in localStorage, passed to Stripe metadata |
| Contact form | Routes to `/api/contact`, not Formspree |

**If a Claude session removed any of the above, it was an error. The user did not ask for it.**

---

## Authoritative source of truth

**`src/App.jsx` is the only file that defines the React app.**

Do not use any HTML file as a reference for what the app should look like, what tabs exist, or what features are present. Those files are separate marketing assets and will not reflect the current state of the app.

---

## File map

### React app (the product)
| File | Purpose |
|---|---|
| `src/App.jsx` | Entire React application — all pages, tabs, components |
| `src/main.jsx` | React entry point |
| `index.html` | Vite HTML shell |
| `public/history.json` | Static trade history data for the History tab |

### Static marketing pages (standalone HTML, no build step)
These files are served directly by Vercel from `public/`. They have their own self-contained styles. Do **not** edit them unless explicitly asked.

| File | Purpose |
|---|---|
| `public/landing.html` | Main marketing landing page |
| `public/landing_es.html` | Spanish version of the landing page |
| `public/today.html` | Same as landing.html — different OG meta tags for social sharing |
| `public/twoday.html` | Same as landing.html — different OG meta tags for social sharing |
| `public/market_driver.html` | Lead magnet: "The Signal 90% of Traders Ignore" — long-form editorial |
| `public/basics.html` | Foundation guide: "Master the Basics" |
| `public/signalboss-latimax.html` | Co-branded Spanish landing page for Latimax affiliate |

### Video animations (standalone, NOT part of the React build)
Loaded by the HTML files below via Babel standalone. `animations.jsx` is NOT a React component and is not processed by Vite.

| File | Purpose |
|---|---|
| `public/videos/01_signal_fires.html` | Animation: signal fires demo |
| `public/videos/02_backtest_reveal.html` | Animation: backtest reveal (used by SignalFiresPlayer) |
| `public/videos/02_signal_fires.html` | Animation: signal fires SHORT demo |
| `public/videos/03_signal_fires.html` | Animation: multi-market demo |
| `public/videos/animations.jsx` | Shared animation utilities for the HTML files above |
| `public/videos/colors_and_type.css` | Shared CSS for video animations |

### API (Vercel serverless functions)
| File | Purpose |
|---|---|
| `api/clerk-webhook.js` | Clerk new-user signup webhook |
| `api/contact.js` | Contact form handler (uses Resend → info@signalboss.net) |
| `api/create-checkout-session.js` | Stripe checkout — auto-applies affiliate coupons |
| `api/webhook.js` | Stripe webhook — grants Clerk access + notifies affiliates |

---

## Routing (vercel.json)

```
/vps/*        →  proxied to VPS at 45.76.228.5:4242 (live signal data)
/api/*        →  serverless functions
filesystem    →  public/ files served directly (landing.html, etc.)
/*            →  index.html (React app)
```

---

## Terminology — do not revert

The system trades **Volatility Range Breakouts (VRB)** — not Opening Range Breakouts (ORB). All user-facing labels must say VRB. The internal data type keys (`VOLATILITY_ORB`, `ORB`) in history.json and App.jsx logic may remain as-is; only display labels matter.

---

## Affiliates

| Affiliate | Ref param | Coupon | Email |
|---|---|---|---|
| Alberto / Latimax | `?ref=latimax` | LATIMAX25 (25% off first month) | alberto13777@gmail.com |
| Juanita | `?ref=jmm` | — | TBD |

---

## Standing rules

- **Only modify what was explicitly requested.** No cleanup, refactoring, or "while I'm in here" changes.
- **Do not remove any existing tab, page, nav link, or feature** unless the user explicitly says to remove it.
- **Do not restore removed features** that the user intentionally deleted — but the features in the table above are permanent.
- **Do not add new tabs, features, or sections** without being asked.
- **Do not modify marketing copy** in the public HTML files unless asked.
- **Do not change design tokens** (colors, fonts, spacing) unless asked.
- **Do not add comments** unless the reason for the code is genuinely non-obvious.
- **`public/history.json`** — edit only when explicitly asked to add or update trade history.
- **`.env`** — never commit. It is gitignored. It contains Clerk, Stripe, and other API keys.
- **`public/videos/animations.jsx`** — do not treat as a React component or attempt to integrate it into the build.

---

## Live data flow

Signals fire from the VPS → Vercel proxies `/vps/*` → React app polls for updates. The `.env` file contains all credentials. The app works without the VPS in dev mode (falls back to static data).
