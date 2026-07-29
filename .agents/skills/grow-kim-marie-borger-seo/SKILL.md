---
name: grow-kim-marie-borger-seo
description: Audit and grow the Kim Marie Borger Astro/Tina website with project-specific rules for truthful local SEO, service and topic clusters, Search Console indexing, human-first copy, internal links, schema, proof, conversion, authority, and release validation. Use for SEO strategy, keyword or page planning, local and topic page work, content rewrites, indexing diagnosis, structured data, image or video SEO, backlink and directory planning, GSC analysis, and SEO release checks in this repository.
---

# Grow Kim Marie Borger SEO

Use evidence to improve qualified booking inquiries, not page count or traffic in isolation. Keep technical eligibility, indexing, rankings, and conversions as separate proof levels.

## Start here

1. Work in the real checkout at `C:\Users\matth\Documents\KimMarieBorger\site`.
2. Read [references/strategy.md](references/strategy.md) before planning, prioritizing, or changing SEO.
3. Read [references/seo-knowledge.md](references/seo-knowledge.md) before using third-party SEO advice, transcripts, AI-search claims, link tactics, or content-generation tactics.
4. Read [references/audit-playbook.md](references/audit-playbook.md) before an audit, GSC diagnosis, large content pass, or production-readiness claim.
5. Inspect the current worktree and the actual source files. Treat dates, counts, rankings, GSC exports, portal status, and live HTTP as drift-prone.

## Evidence model

Label material conclusions:

- `Verified`: reproduced in current code, rendered output, live HTTP, current GSC/analytics, or current primary documentation.
- `Supported`: several credible signals agree, but causation is not proven.
- `Hypothesis`: plausible but not sufficiently verified.
- `Experiment`: bounded change with baseline, KPI, window, and rollback rule.
- `Rejected`: deceptive, policy-unsafe, factually unsupported, or unacceptable for the brand.

Prefer current Google documentation, current first-party measurements, rendered output, and repository evidence over practitioner anecdotes or SEO-tool scores.

## Site contract

Preserve this hierarchy unless evidence supports a deliberate migration:

1. `/` introduces Kim Marie Borger and routes to the seven real service pillars.
2. Service pillars are `/hochzeiten/`, `/beerdigungen/`, `/unterricht/`, `/firmenfeiern/`, `/geburtstage/`, `/taufen/`, and `/konzerte/`.
3. `/[service]/themen/` lists distinct buyer questions and use cases.
4. `/[service]/orte/` lists the location inventory.
5. `/[service]/[slug]/` serves either one distinct topic intent or one truthful local service intent.
6. `/ratgeber/` supports genuine planning questions without displacing commercial pages.
7. `/portfolio/` and `/ueber-mich/` provide inspectable proof.
8. `/anfragen/` is the primary conversion path.

Link by user journey: hub to selected children, child back to parent, content to relevant proof, and proof to service and inquiry. Avoid a complete sibling mesh or keyword-heavy link cloud as the only discovery path.

## Decision workflow

### 1. Define the outcome

State the target service, qualified audience, geography, conversion, and non-goals. Default to qualified inquiries and bookings, not raw sessions.

### 2. Refresh the evidence

- Inventory current canonical routes, status codes, index directives, sitemap membership, internal links, schema, visible copy, and proof assets.
- Use a fresh GSC export when indexing or page retention is in question.
- Join GSC page/query data with inquiry attribution before calling a page valuable or weak.
- Check live HTTP separately from local build output.

### 3. Assign one role and intent

Give each important URL one primary role:

- Brand/home hub
- Commercial service pillar
- Local service page
- Topic or use-case detail
- Support guide
- Portfolio or case-study proof
- Biography/entity proof
- Conversion, utility, or legal page

Flag competing intents, near-synonym pages, or pages that exist mainly because a keyword variant was available.

### 4. Choose one page action

Use `keep`, `strengthen`, `merge`, `redirect`, `noindex`, `remove`, or `test`.

- Prefer `strengthen` for a valid intent that lacks clarity, firsthand proof, or contextual links.
- Use `merge` when two pages satisfy the same user job.
- Redirect only to an intent-equivalent destination after a merge or move.
- Do not mass-prune from page count, fashion, or one crawl snapshot.
- Do not preserve a weak page merely because it is technically valid.

### 5. Implement the smallest defensible batch

Prioritize P1 commercial pages, pages with real impressions or inquiries, and pages where Kim can add firsthand substance. Do not create more local or topic URLs until the current review backlog and measurement baseline justify expansion.

### 6. Validate at the right proof level

Report these separately:

- Focused code and content checks
- Fresh static build and repository SEO QA
- Rendered or browser checks
- Live HTTP checks
- GSC/analytics outcome after the measurement window

## Non-negotiable content rules

- Never invent performances, venues, service locations, availability, prices, credentials, reviews, partners, or local offices.
- Model local reach through truthful `Service`/`Offer`/`areaServed` relationships, never fake city `LocalBusiness` entities.
- Write in Kim's direct, calm voice. Put the answer or booking decision early.
- Add real examples, process details, constraints, photos, audio, video, reviews, programs, and case studies with consent.
- Remove generator and editorial meta-language from public copy. Public pages must not discuss "this page", SEO differentiation, editorial boundaries, keyword targeting, or how headings and FAQs were varied.
- A landmark list is not local expertise. Local copy must help with a real booking decision such as travel feasibility, room, setup, timing, weather, coordination, repertoire, or lesson format.
- Use AI as a drafting assistant, then fact-check and manually edit.
- Do not use AI-detector scores, punctuation bans, word counts, or keyword density as release gates.
- Keep structured data consistent with visible, supported facts. Schema clarifies entities; it does not substitute for proof or guarantee rankings.

## Authority rules

- Prefer real relationships: music schools, ensembles, venues, planners, celebrants, funeral homes, event partners, publications, cultural organizations, and relevant directories.
- Reuse one real project or review across formats only while preserving the facts and attribution.
- Qualify paid or sponsored links correctly.
- Reject PBNs, mass guest-post anchors, force-indexing services, expired-domain abuse, fake consensus, review manipulation, doorway domains, and automated link spam.

## Updating the strategy

Update `references/strategy.md` when a material assumption changes:

- New GSC or analytics baseline
- A service or geographic scope is confirmed or withdrawn
- A page is merged, redirected, noindexed, or removed
- A content cohort is manually approved
- New proof, reviews, video, case studies, or partnerships become available
- An experiment completes

Record the date, evidence source, decision, result, and next review date. Preserve historical facts as dated snapshots rather than silently rewriting them as current.

