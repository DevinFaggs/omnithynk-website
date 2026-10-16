# OmniThynk website

Built to Think. Trained to Evolve.

Static site (plain HTML/CSS/JS, no build step). Hosted on Vercel; every push to `main` deploys automatically.

| File | Purpose |
|---|---|
| `index.html` | The whole site: markup, styles and scripts |
| `logo.png` | White OmniThynk logo used in the header and footer |
| `og.png` | 1200×630 social preview image for Facebook / LinkedIn |
| `favicon.png`, `apple-touch-icon.png` | Browser and home-screen icons |

## Before launch on omnithynk.com
- Remove `<meta name="robots" content="noindex">` from `index.html`.
- Set `og:image` / `twitter:image` to the absolute URL `https://www.omnithynk.com/og.png` and add `og:url`.
- Replace placeholders: prices, headshots, case studies, social links.
- Connect the AI concierge and generators to a server-side AI endpoint (they show "coming soon" until then).
