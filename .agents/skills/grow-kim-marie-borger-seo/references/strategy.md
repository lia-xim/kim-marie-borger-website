# SEO strategy for kim-marie-borger.com

Updated: 2026-07-29

## Contents

1. Direction and business outcome
2. Evidence register
3. Current strengths
4. Current blockers and gaps
5. Target architecture
6. Page-action matrix
7. Prioritized roadmap
8. Experiment backlog
9. Measurement plan
10. Risk register
11. Open decisions

## 1. Direction and business outcome

Develop the site from a technically complete large page inventory into a trusted, proof-rich musician and teacher brand that earns qualified inquiries.

Primary outcome:

- Qualified inquiries and bookings for live viola, violin/viola teaching, and suitable ensemble formats.

Priority commercial clusters:

1. Teaching
2. Funeral and memorial music
3. Wedding music
4. Corporate events
5. Birthdays and private celebrations
6. Baptisms and family ceremonies
7. Concert and cultural formats

Geographic model:

- Real person and service brand based in NRW.
- Local pages describe truthful service availability and planning, not local branches.
- The homepage currently states nationwide availability; each inquiry still needs practical travel and date confirmation.

Non-goals:

- Maximizing the number of indexable URLs
- Publishing generic traffic articles unrelated to booking decisions
- Creating fake local entities or venue experience
- Chasing AI-search visibility with special files, fake mentions, or schema inflation
- Promising indexing or rankings

## 2. Evidence register

### Verified current repository evidence

| Evidence | Current result | Implication |
| --- | --- | --- |
| Fresh `npm run check` | 0 errors, 0 warnings, 0 hints | Astro/TypeScript eligibility is healthy. |
| Fresh isolated local Tina/Astro build | Successful on 2026-07-29 | The current checkout builds. |
| Fresh `npm run qa:seo-pages:dist` and `:vercel` | 487/487 CMS docs, routes, sitemap entries, Tina markers, visible editable fields, and long-text checks; 0 failures in both outputs | Generated-page plumbing is complete in local and Vercel-static output. |
| Fresh `npm run audit:seo:dist` and `:vercel` | 0 errors and 0 warnings across 524 rendered HTML pages in both outputs | Current automated technical/on-page rules pass. |
| Rendered output | 525 HTML files and 5 sitemap files; audit excludes one non-index target from its page total | Static output and sitemap generation are present. |
| SEO document inventory | 487 documents: 343 local and 144 topic | Page scale is high for a young specialist brand. |
| Current GSC index snapshot | 466 indexed URLs in total; 431/487 SEO detail pages indexed, including 307/343 local and 124/144 topic pages | The SEO estate is largely indexed. Indexation alone does not prove differentiation, but it makes blanket pruning or migration unjustified. |
| Current GSC non-indexed snapshot | 56 SEO detail pages: 50 discovered/not indexed and 6 crawled/not indexed; `/agb/` is a seventh crawled/non-indexed non-SEO URL | Prioritize the six crawled URLs and the three non-indexed P1 local URLs; do not treat all non-indexed states as the same problem. |
| Priority inventory | 23 P1, 232 P2, 232 P3 | The current estate is not concentrated on a small high-value set. |
| Editorial status | 23 P1 documents and 25 unique indexing/intent-cohort documents have current manual decisions; 361 documents still carry `review-needed`, while 78 carry an older `manual-priority-local` status without the current measurement contract | Technical QA and older batch status must not be reported as current editorial approval. |
| Fresh similarity trackers | 487 detail rows and 343 local rows; strict tracker flags 82 High-Risk details, consisting of 72 non-P1 local pages and 10 teaching topic pages. The local tracker rates the 21 P1 local pages as 18 low and 3 medium, none high | The priority cohort is materially differentiated; the remaining scaled estate still needs evidence-led cohort work. |
| Visible copy remediation | Public operator/generator language and known grammar, encoding, casing, and ASCII-umlaut artifacts were removed from affected SEO documents and hubs; deterministic cleanup reports zero pending files and rendered lint reports zero errors and warnings | The remediated content is released; broad editorial usefulness still requires cohort review. |
| Production release | Full HTTP QA passed on `dpl_3RkDDwWimddeB9TBDXBcokzFmfRF`; the current commit-bound `main` deployment is Ready and aliased to the apex and `www` domains | The committed 2026-07-29 SEO batch is public. |
| Full live SEO-page QA | 487/487 public SEO routes, 487/487 Tina island endpoints, and 487/487 primary form payloads passed against `https://kim-marie-borger.com` | Live route, CMS, and attribution plumbing match the tested release. |
| Live copy and surface sample | Home, three priority pillars, a priority local page, the Ave Maria page, a teaching topic page, sitemap, robots, and `/admin/` returned 200; sampled pages used self-canonicals and contained none of the banned generator phrases | The previously observed public copy failure is remediated on the live release. |
| Rendered href graph | No orphan candidate among 501 service detail and hub routes; minimum five incoming href mentions | Reachability is good, but this does not prove contextual link quality. |
| Main service structure | Seven service pillars, service-specific topic/location hubs, six Ratgeber guides, portfolio, biography, and inquiry route | The intended hierarchy exists. |
| Proof assets in CMS | Detailed biography, five audio tracks, one visible Google testimonial, and an Instagram link | There is a useful proof base, but it is not yet broad enough for 487 SEO pages. |
| Portfolio video block | No embedded video source is configured; the block sends visitors to Instagram | Video proof on the owned site remains incomplete. |
| Schema architecture | Person-first/service-first helpers and no intended fake local business model | Preserve this truthful entity design. |

### Supported planning evidence

The dated keyword study at `seo/keyword-opportunity-analysis.md` contains 179 rows and suggests the strongest relevant demand is teaching, funeral music, and wedding music. The figures are third-party tool estimates from 2026-06-13, not current Google measurements. Use them to order research, not to prove demand or revenue.

| Cluster | Tool snapshot targetable volume | Use |
| --- | ---: | --- |
| Teaching | 6,210 | Validate query-to-offer fit and travel feasibility first. |
| Funeral / memorial | 5,540 | Strengthen the main commercial page and repertoire decisions. |
| Wedding | 4,340 | Strengthen the main commercial page and moment-specific decisions. |
| Corporate events | 600 | Focus on qualified event formats and B2B proof. |
| Birthday / private celebration | 260 targetable of 5,130 raw | Avoid song/media intent such as birthday serenade queries. |
| Concert / culture | 190 | Treat as a focused proof and cultural-booking cluster. |
| Baptism | 130 | Keep small and specific. |

The current 2026-07-29 GSC snapshot contains 466 indexed URLs. Repository matching
shows 431 indexed SEO detail pages out of 487: 307/343 local pages and 124/144 topic
pages. Another 56 SEO detail pages are not indexed: 50 are "Discovered - currently
not indexed" and six are "Crawled - currently not indexed". The complete URL
classification and action rules are recorded in
`seo/indexing-and-cluster-action-plan-2026-07-29.md`. The German business-facing
target architecture, measurement model, staged roadmap, and rollback rules are
maintained in `seo/future-seo-strategy-2026-2027.md`.

This current snapshot supersedes the historical 2026-07-05 export that classified
458 known local URLs as discovered/not indexed. Neither snapshot includes the
page-query/conversion join required for actual cannibalization or migration
decisions.

### Practitioner learnings

The three supplied transcripts support:

- Contextual internal links from strong parent pages to narrower pages
- Bottom-of-funnel service and decision content
- Real proof, reviews, images, video, partners, and case studies
- Concise, direct copy edited into the author's real voice
- Measuring qualified leads and sales

They do not verify:

- URL republishing as a universal indexing fix
- Schema as a direct ranking factor
- Force indexing, PBNs, exact-match satellite domains, fake consensus, or review manipulation
- AI-detector scores or punctuation rules as quality gates

See `seo-knowledge.md` for adoption and rejection rules.

## 3. Current strengths

### Technical foundation

- Canonicals, index directives, robots rules, sitemap chunking, and static generation are implemented.
- Sitemap chunks separate core, SEO, and Ratgeber URLs.
- Generated documents are Tina-editable and have route/sitemap coverage.
- SEO and schema utilities are centralized in `src/lib/seo.ts`, `src/lib/schema.ts`, `src/lib/local-seo.ts`, `src/lib/topic-seo.ts`, and `src/lib/seo-overrides.ts`.
- Automated checks cover titles, descriptions, canonicals, internal links, legacy URLs, JSON-LD, sitemap coverage, and generated-page CMS completeness.

### Information architecture

- Main service pillars are easy to reach from the homepage.
- Every service has topic and location hubs.
- Detail routes link back into service, topic, local, guide, and inquiry surfaces.
- The Ratgeber is intentionally small and commercially connected.

### Brand and conversion

- The site identifies a real musician with a detailed biography and visible credentials.
- The core offer is clear: solo viola, suitable ensemble formats, and violin/viola teaching.
- The inquiry flow is context-aware and low friction.
- The portfolio contains five real audio samples and a direct review source.

## 4. Current blockers and gaps

### P0: Public copy cleanup pending release and live verification

The largest immediate quality problem is not missing metadata. It is copy that talks about the page-generation process instead of the customer's decision.

Examples include:

- "Diese Seite ..."
- "redaktionell ..."
- "Die klare Abgrenzung zu ... lautet ..."
- "Dadurch behalten Überschrift, Beispiele, Kontaktfragen und FAQ eine eigene Richtung."
- "Typische Orte und Routen liegen zum Beispiel im Umfeld ..."
- "nicht wie helle Violine formulieren"
- Hub copy such as "ausführlich genug für SEO"

Why it matters:

- It breaks trust and sounds machine-produced.
- It consumes space without helping a booking decision.
- It reveals keyword/cannibalization instructions to users.
- It makes otherwise distinct pages feel like one scaled system.
- Existing automated audits are green while missing this editorial failure.

Decision and current status:

- Freeze net-new SEO URL creation.
- The 2026-07-29 worktree removes known public operator phrases across the affected inventory, replaces subject-matter mistakes on teaching pages, and normalizes known grammar, encoding, casing, and ASCII-umlaut artifacts.
- Rendered content-quality lint now rejects the known phrase and encoding families so the failure cannot silently return.
- Do not describe this as live-fixed until it is released and verified on production.
- Continue manual usefulness and voice review by commercial priority; absence of banned phrases is not editorial approval.

### P0: Query and conversion baseline is still incomplete

The current index-status snapshot is now available, but page/query performance and a
landing-page-to-inquiry dataset are not in scope.

Why it matters:

- Technical eligibility cannot show which pages are indexed, visible, cannibalizing, or converting.
- Page retention and consolidation decisions would be guesswork.
- Page-count and similarity scores can hide zero-demand pages.

Decision:

- Export GSC Pages and Queries together for at least the last 90 days and compare with the previous 90 days when available; retain Search appearance, Countries, Devices, and image/video filters for diagnosis.
- Join landing page and hidden inquiry source fields to qualified inquiries and bookings.
- Use the known inquiry locations, including Bottrop, Cologne, Leichlingen, Soest, Düsseldorf, and Solingen, as evidence that local demand is real, while avoiding unsupported URL-level attribution.
- Establish cluster baselines before consolidation or the next content expansion.

### P1: The URL estate is larger than the proof estate

There are 487 SEO detail documents, but the owned-site proof surface currently consists mainly of a biography, five audio samples, one visible testimonial, and Instagram.

Why it matters:

- Hundreds of location and topic pages reuse the same brand proof.
- Pages can be technically unique while still lacking difficult-to-fake substance.
- The scale increases doorway, scaled-content, crawl-priority, and cannibalization exposure.

Decision:

- Build proof before more variants: real case studies, approved event images, short live video, repertoire examples, programs, partner references, and additional attributable reviews.
- Route proof to the service pages it supports.

### P1: Local usefulness is uneven

The 96 manually curated priority-local documents are a stronger cohort. Many other local pages rely on generic landmarks and repeated planning language.

Why it matters:

- Mentioning a city or landmark is not firsthand local experience.
- Similar regional pages may funnel users to the same generic offer.
- Travel feasibility and service availability can differ by teaching versus events.

Decision:

- Confirm geographic service reality by cluster.
- Preserve the current local estate by default because 307/343 local pages are indexed and local search has generated qualified inquiries.
- Strengthen high-value and non-indexed local pages with real decision details.
- Merge or noindex a local page only when current queries, service fit, links, and inquiry evidence justify it; do not apply a blanket geographic reduction.

### P1: Topic overlap and cannibalization risk

The 144 topic pages include near-synonyms and generated "clear differentiation" copy. All topic pages need a one-intent review.

Decision:

- Map each topic to one user job and one parent service.
- Use task-based hub groups instead of raw priority/volume link clouds.
- Treat the target corridors in `seo/indexing-and-cluster-action-plan-2026-07-29.md` as a review range, not a deletion quota.
- Merge pages that differ only by wording only after page/query and conversion comparison.
- Preserve narrow pages only when the SERP/user decision is genuinely distinct.
- Keep Ratgeber informational questions separate from commercial detail intent.
- Keep self-canonicals while a page has a distinct search role. For an equivalent synonym family, merge useful content into one winner, then use a 301 and update sitemap/internal links; do not use cross-canonicals to keep several synonym pages ranking.

### P1: Owned-site video and case studies are missing

The current portfolio has useful audio but no embedded live video and no dedicated case-study page type.

Decision:

- Add only real, approved media.
- Start with three proof stories: one wedding, one funeral/memorial or sensitive ceremony where consent is appropriate, and one lesson or corporate/cultural example.
- Each proof story should cover situation, constraints, musical decision, format, outcome, media, and related service.

### P2: Link reachability is good; editorial relevance still needs review

The rendered graph has no obvious orphans, but many links are generated clouds and hub lists.

Decision:

- Preserve hub discovery.
- Add contextual links from high-authority main pages and proof stories to a small curated set of next steps.
- Avoid linking every location to every sibling service merely to increase counts.

### P2: Off-site authority execution is unknown

`C:\Users\matth\Documents\KimMarieBorger\PORTAL_EINTRAEGE_NRW.md` contains a strong directory plan, but the repository does not prove which profiles are live, accurate, or producing inquiries.

Decision:

- Track profile URL, status, category, NAP/entity consistency, media completeness, referral sessions, inquiries, bookings, cost, and last review date.
- Prioritize Google Business Profile and a small number of relevant music, wedding, teaching, and event platforms.
- Remove low-quality directory work from the roadmap.

## 5. Target architecture

```text
Home
├── Service pillar
│   ├── 3-6 curated commercial/topic decisions
│   ├── selected P1 local pages
│   ├── relevant Ratgeber guides
│   ├── real case studies / portfolio proof
│   └── inquiry
├── Portfolio / proof
│   ├── audio
│   ├── video
│   ├── reviews
│   └── case studies linked back to services
├── About / entity proof
└── Inquiry

Complete inventories remain available through:
- /[service]/themen/
- /[service]/orte/
```

The main service page should curate the strongest next steps. Full inventories should not dominate the customer journey.

## 6. Page-action matrix

| Surface | Role | Action | Reason | KPI |
| --- | --- | --- | --- | --- |
| `/` | Brand and service hub | Keep, strengthen proof | Clear offer and routing already exist; add stronger real proof as it becomes available | Qualified service clicks and inquiries |
| `/leistungen/` | Service collection | Keep, strengthen comparison | Help users choose the right format and route to proof | Service-path completion |
| `/ueber-mich/` | Person/entity proof | Keep | Detailed visible biography supports trust; maintain factual verification | Assisted inquiries, branded queries |
| `/portfolio/` | Portfolio proof | Strengthen | Five audio samples are useful; embedded video, broader reviews, and case studies are missing | Audio plays, video views, assisted inquiries |
| `/anfragen/` | Conversion | Keep, measure | Low-friction context-aware form exists | Qualified inquiry and booking rate |
| `/hochzeiten/` | P1 commercial pillar | Strengthen | High supported demand and strong media potential | Qualified wedding inquiries |
| `/beerdigungen/` | P1 commercial pillar | Strengthen | High supported demand and sensitive decision intent | Qualified memorial inquiries |
| `/unterricht/` | P1 commercial pillar | Strengthen and confirm delivery scope by city | Highest tool-estimated demand; service is visibly offered | Trial lessons and retained students |
| `/firmenfeiern/` | P2 commercial pillar | Strengthen with B2B proof | Smaller volume, potentially valuable leads | Qualified corporate inquiries |
| `/geburtstage/`, `/taufen/`, `/konzerte/` | Focused commercial pillars | Keep, test | Real offers with smaller or mixed demand | Qualified cluster inquiries |
| 14 topic/location hubs | Discovery hubs | Keep task-based curation; measure | Public SEO/meta language is removed in the current worktree and topic hubs are grouped by customer task | Child discovery and crawl |
| 21 P1 local and 2 P1 topic documents | Priority detail cohort | Strengthen first | Highest planned value, still requires current GSC and editorial review | Indexation, impressions, qualified conversions |
| 322 non-P1 local documents | Local long tail | Preserve and test by evidence cohort | 307/343 local pages are indexed and local demand has produced inquiries; generic locality still creates quality risk | Indexed canonicals, local queries, inquiries |
| 142 non-P1 topic documents | Use-case long tail | Review, merge or strengthen in small families | Near-synonym risk remains even after removing generator language | Unique query set, cannibalization, conversions |
| 6 Ratgeber guides | Support content | Keep as checklists and decision aids; compare overlapping queries | Five guide snippets are separated from the commercial topic role in the current worktree | Assisted conversions and relevant queries |
| New case studies | Proof | Create only from real work | Proof gap is more important than more keyword variants | Assisted conversions and earned mentions |

No bulk redirect, noindex, or removal is approved by this matrix alone. Current GSC, analytics, links, inquiries, and intent equivalence are required first.

## 7. Prioritized roadmap

### Days 1-30: establish truth and remove the clearest quality failures

1. Retain the current index-status baseline and add page/query plus inquiry/conversion data.
2. Release and live-verify the locally completed content-quality audit, public-copy cleanup, task-based hubs, and guide differentiation.
3. Review the 23 P1 documents manually for one intent, real service fit, useful booking decisions, and natural voice.
4. Review the six crawled/not-indexed SEO URLs and three discovered/not-indexed P1 local URLs first.
5. Refresh the generated trackers so their counts and dates match 487 documents.
6. Produce a page/query cannibalization report by service.
7. Confirm the current status of Google Business Profile and the first ten priority directories.
8. Record baseline metrics before changing titles, URLs, or index directives.

Exit criteria:

- Current GSC page/query and conversion baseline exists.
- Zero banned generator/editorial phrases in P1 and hub copy.
- Every P1 URL has a role, primary intent, action, owner, KPI, and review date.

Execution status on 2026-07-29: items 2-5 are complete and live. Items 1 and
6-8 still require current GSC/query data, verified directory ownership/status, or
a recorded pre-change business baseline.

### Days 31-60: strengthen the commercial core and proof

1. Strengthen `/unterricht/`, `/beerdigungen/`, and `/hochzeiten/` with direct decision answers and relevant proof.
2. Rewrite the highest-impression or highest-opportunity local cohort with real planning value.
3. Create the first three real proof stories with approved media and attribution.
4. Add owned-site live video to the portfolio and relevant service pages.
5. Expand visible reviews only with real source attribution and consent.
6. Replace generic link clouds on priority journeys with contextual links.
7. Complete and measure the highest-value accurate directory profiles.

Exit criteria:

- Three priority pillars have service-specific proof.
- Priority local pages no longer rely on decorative locality.
- The owned site contains real video.
- Inquiry attribution distinguishes service and landing-page cohort.

### Days 61-90: consolidate, earn authority, and scale only winners

1. Evaluate the first cohorts after confirmed crawl and an adequate measurement window.
2. Merge or noindex overlapping/unsupported pages only with evidence and an intent-equivalent plan.
3. Extend successful proof and content patterns to the next cohort.
4. Pursue real partner mentions from relevant planners, schools, ensembles, venues, celebrants, funeral professionals, cultural organizations, and publications.
5. Measure image/video search and improve filenames, captions, landing-page context, and preferred images.
6. Recheck AI-feature visibility as ordinary search visibility; do not add special AI markup.

Exit criteria:

- The next URL/content batch is justified by measured results.
- Weak pages have explicit actions rather than indefinite "review-needed" status.
- Authority work is tied to real relationships and referral or search outcomes.

## 8. Experiment backlog

| Experiment | Baseline | Change | KPI | Window | Rollback |
| --- | --- | --- | --- | --- | --- |
| Human rewrite cohort | P1 pages with current GSC data | Remove meta-copy; add real decision detail | Indexed pages, impressions, qualified inquiries | 6-8 weeks after crawl | Restore only if measurable harm and no policy issue |
| Proof module on three pillars | Current assisted conversion | Add real case study/review/media module | Inquiry rate and service-path completion | 4-8 weeks | Remove module if it harms comprehension or speed |
| Owned live video | Portfolio without embedded video | Add approved short live performance | Plays, engagement, assisted inquiries, video visibility | 8 weeks | Replace or reposition if unused |
| Contextual internal links | Current hub/link-cloud path | Add curated in-copy parent/proof links | Discovery, crawl, assisted conversions | 6-8 weeks | Revert links that distract or produce no value |
| Title/answer-first test | Stable page with impressions | Clarify primary decision in title and first screen | CTR and qualified conversions | 4-6 weeks | Restore title if CTR and conversions decline materially |
| URL repositioning | Persistently weak page with verified intent and links | Only as a controlled migration, never routine | Indexation, ranking, conversions | 8-12 weeks | Redirect back only with a documented recovery plan |

## 9. Measurement plan

### Weekly operational checks

- Build, audit, and QA status
- Live status/canonical sample
- New broken links, noindex, or sitemap drift
- New public generator/editorial phrases
- Inquiry delivery and source attribution

### Monthly search and business review

- Valid indexed canonical URLs by page type and service
- Discovered-not-indexed versus crawled-not-indexed
- Impressions, clicks, CTR, and position by service, intent, city, and page kind
- Query-to-page overlap and cannibalization
- Branded versus non-branded queries
- Image and video search impressions/clicks
- Qualified inquiries, booked work, lessons started, and estimated value by landing page
- Referral sessions, inquiries, and backlinks from directories/partners

### Page decision rule

Do not judge a changed page before:

1. Google has crawled the changed canonical.
2. The change has a recorded baseline.
3. The observation window matches query volume; use at least 6-8 weeks for most cohorts and longer for seasonal/low-volume pages.
4. Search data is combined with business value and proof availability.

## 10. Risk register

| Risk | Severity | Current signal | Control |
| --- | --- | --- | --- |
| Scaled-content or doorway exposure | High | 487 SEO docs; removed meta-copy does not by itself establish unique value | Freeze expansion, review cohorts, strengthen or consolidate from evidence |
| Trust loss from AI/editorial language | Medium residual | Release, full live SEO-page QA, sampled phrase checks, and rendered audit are clean; non-priority cohorts still need editorial review | Keep content lint and approve future cohorts manually |
| Cannibalization | High | 144 topic pages and many near-synonyms | One intent per URL, GSC query mapping, merge when equivalent |
| Unsupported locality | High | Generic landmarks and shared structure | Truthful availability, practical detail, no fake experience |
| Unsupported facts or schema | High | Large CMS surface | Visible-source verification and person/service-first schema |
| URL migration loss | High | Large current inventory | No move without traffic, links, conversions, equivalence, and rollback |
| Weak proof-to-page ratio | Medium-high | Five audio tracks, one visible review, no embedded video | Case studies, real reviews, images, video, programs |
| Link spam or review manipulation | High | Practitioner transcripts contain risky tactics | Follow rejection rules in `seo-knowledge.md` |
| Vanity reporting | Medium | Technical QA can appear "done" | Report eligibility, indexing, ranking, and conversion separately |
| Tracker or research drift | Medium | Trackers are fresh on 2026-07-29; GSC/query and directory evidence can still age | Regenerate and date every snapshot; record source windows |

## 11. Open decisions

Require user or business confirmation when implementation depends on:

- Exact teaching locations, online availability, travel limits, lesson duration, and current prices
- Which local event areas are actively served and under what travel conditions
- Consent and rights for reviews, client names, event images, audio, and video
- Which biography credentials may link to external verification
- Current Google Business Profile ownership and directory profile status
- Access to GSC, analytics, inquiry, and booking data
- Whether a weak page should merge, noindex, or remain for a real customer journey
