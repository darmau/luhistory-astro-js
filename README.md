# LuHistory.com — Astro + Sanity Frontend

This repository powers [LuHistory.com](https://luhistory.com), the official site for art historian and curator Lü Peng. The site showcases decades of scholarship through six content pillars—About, Exhibitions, Publications, Collection, On Artists, and Teaching—plus frequent news updates. Content editors work in Sanity CMS, while Astro renders type-safe pages with a mix of server components and client-only React widgets for sliders, galleries, and lightboxes.

## Highlights

- Hero, news, and section teasers are hydrated directly from Sanity document types such as `homepage`, `article`, `book`, `exhibition`, and `caseStudy`.
- Dynamic routes (`/book/detail/[slug]`, `/exhibition/detail/[slug]`, `/collection/*`, `/on-artists/*`, etc.) provide deep dives with pagination helpers in `src/functions`.
- Tailwind CSS v4 (via the Vite plugin) handles layout and theming, paired with custom serif/sans typography defined in `Layout.astro`.
- React-only islands power the exhibition carousel (Swiper), hover previews, and lightbox galleries without shipping JavaScript to the rest of the page.
- Sitemap generation, link prefetching are configured globally for SEO and performance.
- TypeScript definitions in `src/types` mirror the Sanity schema to keep GROQ queries safe and predictable.

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Astro 5](https://astro.build) with `@astrojs/react`, `@astrojs/sitemap`, and prefetching enabled |
| CMS | [Sanity](https://www.sanity.io/) dataset via `@sanity/astro` |
| Styling | Tailwind CSS v4 plugin + custom fonts loaded in `Layout.astro` |
| UI | Astro components plus React islands (Swiper, Yet-Another-React-Lightbox, custom hover previews) |
| Tooling | pnpm, TypeScript, ESLint, Vitest, Sharp image service |

## Project Structure

```text
├── public/               # Static assets served as-is
├── src/
│   ├── assets/           # Icons and imagery used by components
│   ├── components/       # Section components + React widgets
│   ├── data/             # Helper data maps (e.g., archive categories)
│   ├── functions/        # Pagination and utility helpers
│   ├── layouts/          # Site-wide shell (Navbar, Footer, fonts, GA)
│   ├── pages/            # Astro routes, including dynamic segments
│   ├── styles/           # Tailwind entry point
│   └── types/            # Shared TypeScript contracts for Sanity queries
├── dist/                 # Production build output
├── astro.config.mjs      # Astro + Sanity + Tailwind configuration
└── package.json
```

## Getting Started

1. **Install prerequisites**: Node.js 20+ and [pnpm](https://pnpm.io) (the repo already includes a `pnpm-lock.yaml`).
2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment** (optional unless you require private Sanity data) by creating `.env` as shown above.
4. **Start a dev server**:

   ```bash
   pnpm dev
   ```

   Astro serves the site at `http://localhost:4321` with hot reloading.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Astro in development mode |
| `pnpm build` | Produce a production build in `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint across `.astro`, `.ts`, and `.tsx` files |
| `pnpm test` / `pnpm test:watch` | Run or watch the Vitest suite |
| `pnpm astro ...` | Access the Astro CLI (e.g., `pnpm astro check`) |

## Deployment

The site is deployed to **Cloudflare Workers** using [static assets](https://developers.cloudflare.com/workers/static-assets/). The build is fully pre-rendered, so the Worker is assets-only — there is no server entrypoint (`main`) and no runtime Sanity access.

Configuration lives in `wrangler.jsonc`:

- `assets.directory` points at Astro's `dist/` output.
- `html_handling: "auto-trailing-slash"` matches Astro's directory-style routes (`/about` → `dist/about/index.html`).
- `not_found_handling: "404-page"` serves `dist/404.html` for unmatched paths.

| Command | Description |
| --- | --- |
| `pnpm cf:dev` | Build, then serve the Worker locally via `wrangler dev` |
| `pnpm cf:deploy` | Build, then deploy with `wrangler deploy` |

Steps:

1. Authenticate once with `pnpm exec wrangler login` (or set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in CI).
2. Run `pnpm cf:deploy`. Sanity content is fetched at build time, so any Sanity token must be present in the **build** environment, not in Worker secrets.
3. Verify that `/sitemap-index.xml` is reachable and that a bad URL renders the 404 page.

To deploy from CI or the Cloudflare dashboard's Git integration, use build command `pnpm build`, deploy command `pnpm exec wrangler deploy`, and output directory `dist`.

## Conventions & Next Steps

- Keep GROQ queries colocated with the component/page that consumes them for clarity.
- When adding new Sanity fields, mirror the shape in `src/types` before using it in Astro.
- Prefer Astro components for static sections and reach for React islands only when you need client interactivity.
- Use the Tailwind entry file `src/styles/tailwind.css` for global tokens or additions that should ship site-wide.

Questions or ideas? Create an issue, open a discussion, or reach out at `info@luhistory.com`.
