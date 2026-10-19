# OmniThynk website

Built to Think. Trained to Evolve.

Static front end + two serverless functions on Vercel, with a Supabase database for settings, quote requests, admins and shareable designs. Every push to `main` deploys automatically.

| Path | What it is |
|---|---|
| `index.html`, `assets/site.css`, `assets/site.js` | The public site |
| `assets/mockup.js`, `assets/templates.js` | Design engine + ~25 instant business templates for the live demo |
| `concept.html` | Shared design page (`/concept?c=ID`), used by Share and the phone QR code |
| `admin.html`, `assets/admin.js` | Admin dashboard (`/admin`): quote requests, contact email, pricing/timelines, admins |
| `api/quote.js` | Saves a quote request and emails it (via FormSubmit) to the address set in Admin |
| `api/ai.js` | Optional AI personalization through Vercel AI Gateway (needs a card on the Vercel account) |
| `api/_config.js` | Public Supabase URL + anon key (access is enforced by row-level security) |

## Admin
- Sign in at `/admin` with an admin email; a one-time link is emailed (no password).
- Admin emails live in the `admins` table and can be managed from the Admins tab.
- Supabase → Authentication → URL Configuration must list the site URL (and `/admin`) as allowed redirect URLs.

## Before launch on omnithynk.com
- Remove `<meta name="robots" content="noindex">` from `index.html`.
- Update `og:url` / `og:image` to `https://www.omnithynk.com`.
- Add `https://www.omnithynk.com/admin` to Supabase allowed redirect URLs.
