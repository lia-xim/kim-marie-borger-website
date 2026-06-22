# Kim Marie Borger · Viola Website

[![CI](https://github.com/lia-xim/kim-marie-borger-website/actions/workflows/ci.yml/badge.svg)](https://github.com/lia-xim/kim-marie-borger-website/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Content License](https://img.shields.io/badge/content-restricted-lightgrey.svg)](CONTENT-LICENSE.md)

Public source repository for the website of violist Kim Marie Borger. The site
is built with Astro, TinaCMS, and Vercel, with self-hosted fonts, structured
content, SEO landing pages, and an optional Resend-backed contact endpoint.

**Live site:** [kim-marie-borger.vercel.app](https://kim-marie-borger.vercel.app)

![Website social preview](public/og-default.png)

## Repository Scope

This repository is public for transparency and maintainability. It is not a
starter template.

- Source code is MIT licensed.
- Website copy, images, generated media, audio, branding, and SEO research are
  not open licensed.
- Forks should replace all project-specific content and media before publishing.
- GitHub Pages is not used for production because the site depends on the
  Vercel adapter and an API route for the contact form.

See [LICENSE](LICENSE) and [CONTENT-LICENSE.md](CONTENT-LICENSE.md).

## Tech Stack

- Astro 6
- TinaCMS for visual editing and content schemas
- Vercel adapter for deployment and serverless contact endpoint
- MDX and JSON content collections
- Self-hosted Cormorant Garamond and Manrope fonts via `@fontsource`
- Sharp-based image tooling and ffmpeg-based audio preparation

## Quick Start

Requirements:

- Node.js `22.22.0` or newer
- npm

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Local URLs:

- Site: <http://localhost:4321>
- Tina editor: <http://localhost:4321/admin/index.html>

The site can build without Tina Cloud credentials by using the local content
mode:

```sh
npm run build:local
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro with TinaCMS editing enabled |
| `npm run build` | Production build with Tina Cloud credentials |
| `npm run build:local` | Production build from repository content, with `/admin` disabled |
| `npm run build:vercel` | Vercel build entrypoint; chooses cloud or local mode automatically |
| `npm run audit:prod` | Audit the production dependency surface |
| `npm run audit:seo` | Generate SEO/content diagnostics |
| `npm run qa:seo-pages` | Run SEO page island QA |
| `npm run optimize:images` | Prepare uploaded images for the web |
| `npm run optimize:audio` | Normalize master audio and export browser-ready MP3 files |

## Project Structure

```text
src/
  components/         Astro components and content blocks
  content/page/       Main editable pages as MDX
  content/seo-pages/  Local and topic SEO landing pages as JSON
  content/config/     Global site settings
  layouts/            Base page layout
  lib/                SEO, routing, image, and content helpers
  pages/              Routes and API endpoints
  scripts/            Browser scripts loaded by the site
public/
  uploads/            Published media assets
scripts/              Build, SEO, image, and audio tooling
tina/                 TinaCMS schema and collection config
seo/                  SEO research and tracking artifacts
```

## Content Model

Primary pages live in `src/content/page/*.mdx`. The visible page body is built
from ordered block data in frontmatter. Each editable block usually has two
files:

- `src/components/blocks/<Block>.astro`
- `src/components/blocks/<block>.template.ts`

The templates are registered in `tina/collections/page.ts`; the renderer is
wired through `src/components/blocks/Blocks.astro`.

SEO landing pages live in `src/content/seo-pages/<service>/<slug>.json` and
share route rendering through `src/pages/[service]/[location].astro`.

## Environment Variables

Use `.env.example` as the reference. Local secret files are ignored by Git.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SITE_URL` | Recommended | Canonicals, sitemap, and social metadata |
| `PUBLIC_TINA_CLIENT_ID` | For Tina Cloud | Enables cloud-backed visual editing |
| `TINA_TOKEN` | For Tina Cloud | Read token for Tina content APIs |
| `RESEND_API_KEY` | For contact form email delivery | Sends `/api/contact` mail |
| `CONTACT_TO_EMAIL` | For contact form email delivery | Recipient address |
| `CONTACT_FROM_EMAIL` | Recommended for email delivery | Verified sender address |

Without Resend configuration, the contact form falls back to direct email
instructions rather than failing hard.

## Editorial Workflows

### Connect Tina Cloud

1. Create a Tina Cloud project at <https://app.tina.io>.
2. Connect this GitHub repository on branch `main`.
3. Add `PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `SITE_URL` in Vercel.
4. Redeploy.
5. Open `<domain>/admin` and sign in through Tina Cloud.

Every Tina save creates a Git commit and triggers a deployment.

### Upload Large Photos

Tina uploads are wrapped by a client-side optimizer in `tina/media/optimized-upload.ts`.
JPEG, PNG, WebP, and AVIF files are resized to a maximum 2000 px long edge and
uploaded as WebP before they reach Tina/Git. The Media Manager shows a summary
toast after local optimization; Tina itself only exposes a coarse upload spinner,
not reliable per-file network progress.

`npm run optimize:images` remains the backstop for older or manually copied
files in `public/uploads`. It converts web-sized sources to WebP, rewrites
`/uploads/...` references in `src/`, and refreshes the image manifest. The
Vercel build runs this automatically before Tina/Astro read the content.

The media library still shows each uploaded photo once. Different display sizes
are generated at request time through Vercel Image Optimization from the single
source file and the `sizes` values in the Astro components.

### Add Real Audio Samples

1. Put local master audio files in `audio-src/`.
2. Run `npm run optimize:audio`.
3. Add the generated `/uploads/audio/<file>.mp3` path in the portfolio audio
   block.
4. Commit and deploy.

`audio-src/` is ignored because it may contain large master files.

## Quality Gates

Run these before publishing meaningful changes:

```sh
npm run audit:prod
npm run build:local
```

GitHub Actions runs the same production audit and local build on pushes and
pull requests to `main`.

Note: full `npm audit` may still report dev-tooling advisories inside TinaCMS,
Astro language tooling, or local editor dependencies. The production dependency
surface is intentionally checked with `npm run audit:prod`.

## Deployment

Production is intended to run on Vercel, not GitHub Pages. The Vercel build uses:

```sh
npm run build:vercel
```

`scripts/smart-build.mjs` enables Tina Cloud when the required environment
variables are present and falls back to local content builds otherwise.

## Known Launch Checks

- Impressum and Datenschutz pages are implemented, but final legal details
  should be reviewed before a custom-domain launch.
- Guest quote copy on the home/about pages is still marked as placeholder
  content.
- Portfolio audio currently uses synthetic sketches unless real audio files and
  optional video IDs are added.

## Security

Please report suspected vulnerabilities privately. See [SECURITY.md](SECURITY.md).

Secrets must stay in local `.env*` files or hosting-provider environment
variables. Never commit Tina tokens, Resend keys, Vercel tokens, or master audio
source files.
