# SEO audit and validation playbook

## Contents

1. Scope and proof boundaries
2. Preflight
3. Repository inventory
4. Build and technical validation
5. Content-quality audit
6. GSC and conversion audit
7. Live verification
8. Reporting and strategy updates

## 1. Scope and proof boundaries

Report four different states:

1. `Code-green`: source checks pass.
2. `Rendered-green`: a fresh build, SEO audit, and generated-page QA pass.
3. `Live-green`: production HTTP and rendered samples match the intended release.
4. `Outcome-supported`: current GSC, analytics, and qualified conversions support the SEO conclusion.

Never call the site "SEO-finished" from the first three alone.

## 2. Preflight

Use the real checkout:

```powershell
Set-Location -LiteralPath 'C:\Users\matth\Documents\KimMarieBorger\site'
git status --short --branch
```

Preserve unrelated worktree changes. Do not regenerate or rewrite hundreds of content documents before confirming the intended cohort.

Check for active Tina/Astro processes before a final build. Another project can occupy Tina's default datalayer port 9000.

```powershell
Get-NetTCPConnection -LocalPort 9000 -State Listen -ErrorAction SilentlyContinue
```

Resolve the owning process before acting. Do not kill another repository's dev server merely to make this build pass.

## 3. Repository inventory

Important sources:

- `src/content/page/*.mdx`: core pages
- `src/content/seo-pages/<service>/*.json`: local and topic overrides
- `src/lib/local-seo.ts`: service/location inventory and local-page composition
- `src/lib/topic-seo.ts`: topic inventory and topic-page composition
- `src/lib/seo-overrides.ts`: CMS override model
- `src/lib/seo.ts` and `src/lib/schema.ts`: shared SEO and entity graph
- `src/pages/[service]/[location].astro`: generated route
- `src/pages/[service]/orte.astro`: location hub
- `src/pages/[service]/themen.astro`: topic hub
- `src/components/LocalLinks.astro`, `TopicLinks.astro`, `RatgeberLinks.astro`: hierarchy
- `astro.config.mjs`: sitemap and build behavior
- `scripts/seo-audit.mjs`: rendered technical audit
- `scripts/seo-page-island-qa.mjs`: 487-document generated-page gate
- `scripts/gsc-indexing-audit.mjs`: pasted GSC export classifier
- `seo/keyword-opportunity-analysis.md`: dated keyword/intent plan
- `seo/*tracker*`: generated similarity and page-state snapshots

Inventory current documents rather than copying old counts:

```powershell
Get-ChildItem -LiteralPath 'src\content\seo-pages' -Recurse -Filter '*.json' |
  ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json } |
  Group-Object pageKind, serviceSlug |
  Select-Object Name, Count
```

## 4. Build and technical validation

Run sequentially so one process does not delete or replace output while another audit reads it:

```powershell
npm run check
npm run build:local
npm run qa:seo-pages
npm run audit:seo
git diff --check
```

If Tina port 9000 belongs to another process, verify two free ports and run an isolated build:

```powershell
npx tinacms build --local --skip-cloud-checks --noTelemetry --datalayer-port 9010 --port 4011 -c "astro build"
```

Do not hardcode those alternate ports without checking availability.

Interpretation:

- A green audit proves the configured rules passed on the selected static output.
- It does not prove indexing, rankings, editorial quality, or conversions.
- Note whether the audit read `dist/client` or `.vercel/output/static`.

## 5. Content-quality audit

The current automated audit does not catch all public generator language. Search the source and rendered output for:

```powershell
rg -n -i "Diese Seite|redaktionell|klare Abgrenzung zu|Dadurch behalten Überschrift|nicht wie helle Violine formulieren|ausführlich genug für SEO|nicht zu allgemein" src/content/seo-pages src/pages
```

Review every hit in visible context. Do not replace phrases mechanically with synonyms; rewrite the section around the real customer decision.

For each reviewed page, verify:

- One primary intent
- Offer/service truth
- Useful answer in the first screen
- No editorial or SEO-operator language
- No invented venue or local performance claim
- Real decision details
- Relevant parent, proof, and inquiry links
- Distinct query need, not merely distinct wording
- CMS status updated only after manual review

Sample at least:

- All changed P1 pages
- One local and one topic page per affected service
- One far-away and one near location for teaching
- One sensitive funeral page
- One hub page
- Portfolio/proof when media changes

## 6. GSC and conversion audit

Use a fresh export. The classifier expects pasted Search Console issue text:

```powershell
npm run audit:gsc-indexing -- --gsc-file="C:\path\to\current-gsc-export.txt"
```

Separate:

- Discovered, not indexed
- Crawled, not indexed
- Duplicate/canonical states
- Soft 404 or redirect
- Indexed with impressions
- Indexed without impressions

Build a page-action table with:

- URL and role
- Primary intent/query
- GSC state and last crawl
- Impressions, clicks, CTR, and position
- Inquiry and booking evidence
- Links/referrals
- Content/proof assessment
- Overlap
- Action, owner, KPI, and review date

Do not merge or remove a page without checking intent equivalence and business value.

## 7. Live verification

After a release, sample:

- `/`
- `/sitemap.xml`
- One core service
- Every changed P1 route
- One changed local page per service
- One changed topic page per service
- `/portfolio/`, `/ueber-mich/`, or `/anfragen/` when affected
- `/admin/` after Tina schema/content-model changes

Check:

- HTTP status and redirects
- Title, canonical, robots, and JSON-LD
- Visible text and media
- Internal links and inquiry path
- No generator/editorial language
- Mobile interaction when layout or navigation changed

Separate live code deployment from later GSC outcomes.

## 8. Reporting and strategy updates

Lead with blockers and findings. Then report:

1. Evidence and date
2. What changed
3. Proof level reached
4. What is still unverified
5. Measurement window
6. Next decision

Update `strategy.md` when a material decision or baseline changes. Keep older snapshots dated so the repository preserves what was learned rather than presenting historical results as current.
