# LuHistory.com — Astro + Sanity Frontend

This repository powers [LuHistory.com](https://luhistory.com), the official site for art historian and curator Lü Peng. The site showcases decades of scholarship through six content pillars—About, Exhibitions, Publications, Collection, On Artists, and Teaching—plus frequent news updates. Content editors work in Sanity CMS, while Astro renders type-safe pages with a mix of server components and client-only React widgets for sliders, galleries, and lightboxes.

## Highlights

- Hero, news, and section teasers are hydrated directly from Sanity document types such as `homepage`, `article`, `book`, `exhibition`, and `caseStudy`.
- Dynamic routes (`/book/detail/[slug]`, `/exhibition/detail/[slug]`, `/collection/*`, `/on-artists/*`, etc.) provide deep dives with pagination helpers in `src/functions`.
- Tailwind CSS v4 (via the Vite plugin) handles layout and theming, paired with custom serif/sans typography defined in `Layout.astro`.
- React-only islands power the exhibition carousel (Swiper), hover previews, and lightbox galleries without shipping JavaScript to the rest of the page.
- Sitemap generation, link prefetching, and Google Analytics (G‑F393GEHV22) are configured globally for SEO and performance.
- TypeScript definitions in `src/types` mirror the Sanity schema to keep GROQ queries safe and predictable.

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | [Astro 5](https://astro.build) with `@astrojs/react`, `@astrojs/sitemap`, and prefetching enabled |
| CMS | [Sanity](https://www.sanity.io/) dataset `aemgaomh/production` via `@sanity/astro` |
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

## Content & Data Flow

1. Editors manage content in Sanity using document types that map to the TypeScript definitions under `src/types`.
2. Each Astro page/component imports `sanityClient` (declared in `src/env.d.ts`) to run GROQ queries server-side.
3. Responses are narrowed to the UI needs (e.g., `HomepageRecord`, `BookSummary`, `TeachingEntry`) before rendering.
4. Interactive experiences that require state (sliders, lightboxes) are implemented as React components and loaded with `client:only="react"`.

If you need to access private datasets or preview drafts locally, add a read token and related values to an `.env` file:

```bash
SANITY_API_TOKEN=your_read_token
SANITY_PROJECT_ID=aemgaomh
SANITY_DATASET=production
SANITY_API_VERSION=2022-03-07
```

Then update `astro.config.mjs` to read from `import.meta.env` instead of the hard-coded values.

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

1. Run `pnpm build` to generate the static site and any server output expected by your hosting provider.
2. Deploy the `dist/` directory to your static host (Netlify, Vercel, S3, etc.). Make sure the Sanity token (if used) is configured as an environment variable in the hosting platform.
3. Verify that `/sitemap-index.xml` is reachable and that analytics events fire in GA.

## Conventions & Next Steps

- Keep GROQ queries colocated with the component/page that consumes them for clarity.
- When adding new Sanity fields, mirror the shape in `src/types` before using it in Astro.
- Prefer Astro components for static sections and reach for React islands only when you need client interactivity.
- Use the Tailwind entry file `src/styles/tailwind.css` for global tokens or additions that should ship site-wide.

Questions or ideas? Create an issue, open a discussion, or reach out at `info@luhistory.com`.
