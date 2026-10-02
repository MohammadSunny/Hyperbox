# Hyperobox — website

Static, dependency-free marketing site for Hyperobox (hands-off B2B growth systems). Upload the contents of this repo to `public_html/` on Hostinger.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The page: semantic HTML, full meta/Open Graph/Twitter tags, Schema.org JSON-LD (Organization, WebSite, ProfessionalService + offers, HowTo, FAQPage) |
| `css/style.css` | Futuristic dark design system (glassmorphism, aurora background, 3D "hyper box" hero) |
| `js/main.js` | Vanilla JS: mobile menu, scroll reveal, counters, hero particle network, Cal.com booking fallback |
| `llms.txt` | Plain-language summary for AI assistants (ChatGPT, Claude, Perplexity, Gemini) |
| `robots.txt` | Allows search engines and AI crawlers; points to the sitemap |
| `sitemap.xml` | Sitemap — update `<lastmod>` when content changes |
| `.htaccess` | HTTPS + non-www redirect, gzip, caching, security headers, custom 404 |
| `404.html` | Branded not-found page |
| `favicon.svg`, `site.webmanifest`, `assets/` | Icons and the 1200×630 social share image |

## Editing tips

- Content lives in `index.html`. If you change an FAQ answer, update the matching `FAQPage` entry in the JSON-LD block in `<head>` and in `llms.txt` too — Google requires structured data to match visible text.
- Colors and spacing are CSS variables at the top of `css/style.css`.
- Booking buttons use Cal.com (`mohammadsunny/30min`). They link to cal.com directly, so they still work if the embed script fails.
- The canonical domain is set to `https://hyperobox.com/`. If the live domain is different, search-and-replace it across `index.html`, `robots.txt`, `sitemap.xml` and `llms.txt`.

## After deploying

1. Submit `https://hyperobox.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
2. Validate structured data at https://search.google.com/test/rich-results.
3. Check the share preview at https://www.opengraph.xyz/.

## Local preview

```bash
npx serve .
```
