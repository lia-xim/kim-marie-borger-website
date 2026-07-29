# Local SEO Seiten-Tracker

Generiert: 2026-07-29T19:35:51.891Z

Dieser Tracker bewertet die lokalen Seiten aus dem gerenderten HTML in `dist/client`. Die komplette Matrix liegt in `seo/local-page-tracker.csv`; diese Datei ist die Arbeitsgrundlage fuer Filter, Priorisierung und SEO-Software.

## Warum diese Metriken?

- Google findet und bewertet Seiten unter anderem ueber crawlbare interne Links und Anchor-Texte: <https://developers.google.com/search/docs/crawling-indexing/links-crawlable>
- Sitemaps helfen Google, wichtige URLs effizienter zu crawlen: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>
- Lokale Seiten brauchen eigenen, hilfreichen Hauptcontent, damit sie nicht wie reine Doorway- oder Massen-Seiten wirken: <https://developers.google.com/search/docs/essentials/spam-policies>

## Schwellenwerte

| Metrik | Gut | Warnung | Kritisch |
| --- | ---: | ---: | ---: |
| `nearest_same_service_shingle_similarity` | <= 0.54 | 0.55-0.67 | >= 0.68 |
| `nearest_same_service_template_similarity` | Monitoring | kein direkter Risiko-Ausloeser | gemeinsamer Aufbau erwartet |
| `nearest_same_service_location_masked_template_similarity` | Monitoring | verstaerkt Risiko bei hoher Content-Naehe | kein direkter Risiko-Ausloeser |
| `similarity_to_base_service` | <= 0.55 | 0.56-0.82 | >= 0.83 |
| `content_score` | >= 65 | 45-64 | < 45 |
| `seo_score` | >= 85 | 75-84 | < 75 |

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| Lokale Seiten | 343 |
| High-Risk Content-Aehnlichkeit | 155 |
| Medium-Risk Content-Aehnlichkeit | 130 |
| Durchschnitt SEO-Score | 93 |
| Durchschnitt Content-Score | 84 |
| Durchschnitt Shingle Similarity Same Service | 60% |
| Durchschnitt Template Similarity Same Service | 93.7% |
| Durchschnitt Location-Masked Template Similarity | 96.5% |
| Durchschnitt Similarity Base Service | 2.1% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| improve-copy | 130 |
| priority-rewrite | 83 |
| ready | 130 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 49 | 93 | 81 | 60.9% | 93.4% | 96.2% | 23 |
| firmenfeiern | 49 | 93 | 84 | 60.6% | 93.9% | 96.4% | 17 |
| geburtstage | 49 | 93 | 84 | 60.7% | 93.9% | 96.6% | 27 |
| hochzeiten | 49 | 93 | 83 | 61.3% | 93.6% | 96.3% | 35 |
| konzerte | 49 | 93 | 87 | 58.4% | 93.4% | 96.4% | 13 |
| taufen | 49 | 93 | 84 | 60.8% | 93.8% | 96.4% | 27 |
| unterricht | 49 | 93 | 86 | 57% | 94% | 97.5% | 13 |

## High-Risk Content-Paare

| Seite | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | ---: | ---: | ---: | --- |
| [Geigenunterricht Duisburg](https://kim-marie-borger.com/unterricht/duisburg/) | 67.4% | 96.6% | 99% | /unterricht/moenchengladbach/ |
| [Geigenunterricht Mönchengladbach](https://kim-marie-borger.com/unterricht/moenchengladbach/) | 67.4% | 97% | 99.4% | /unterricht/duisburg/ |
| [Geigenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 67.4% | 97.2% | 99.6% | /unterricht/ratingen/ |
| [Geigenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 67.4% | 97.2% | 99.6% | /unterricht/essen/ |
| [Geigenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 67.3% | 96.6% | 99% | /unterricht/duisburg/ |
| [Geigenunterricht Remscheid](https://kim-marie-borger.com/unterricht/remscheid/) | 67.3% | 96.8% | 99.2% | /unterricht/duisburg/ |
| [Geigenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 67.2% | 97% | 99.4% | /unterricht/duisburg/ |
| [Geigenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 67.2% | 96.9% | 99.3% | /unterricht/duisburg/ |
| [Geigenunterricht Leverkusen](https://kim-marie-borger.com/unterricht/leverkusen/) | 67.1% | 96.6% | 99.2% | /unterricht/ratingen/ |
| [Geigenunterricht Bochum](https://kim-marie-borger.com/unterricht/bochum/) | 67.1% | 96.5% | 98.9% | /unterricht/duisburg/ |
| [Geigenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 66.9% | 96.6% | 99% | /unterricht/duisburg/ |
| [Geigenunterricht Solingen](https://kim-marie-borger.com/unterricht/solingen/) | 66.9% | 96.7% | 99.1% | /unterricht/duisburg/ |
| [Geigenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 66.8% | 96.7% | 99.2% | /unterricht/duisburg/ |
| [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 66.6% | 93.3% | 96% | /hochzeiten/solingen/ |
| [Hochzeitsmusik Solingen](https://kim-marie-borger.com/hochzeiten/solingen/) | 66.6% | 93.7% | 95.7% | /hochzeiten/mettmann/ |
| [Hochzeitsmusik Leverkusen](https://kim-marie-borger.com/hochzeiten/leverkusen/) | 66.5% | 93.3% | 96% | /hochzeiten/solingen/ |
| [Hochzeitsmusik Hilden](https://kim-marie-borger.com/hochzeiten/hilden/) | 66.3% | 93.8% | 95.8% | /hochzeiten/ratingen/ |
| [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 66.3% | 95.2% | 97.2% | /hochzeiten/hilden/ |
| [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 66% | 94% | 96.1% | /hochzeiten/remscheid/ |
| [Hochzeitsmusik Remscheid](https://kim-marie-borger.com/hochzeiten/remscheid/) | 66% | 93.7% | 95.7% | /hochzeiten/erkrath/ |

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| P1 | improve-copy | medium | [Geigenunterricht Düsseldorf](https://kim-marie-borger.com/unterricht/duesseldorf/) | 86 | 56% | 90.9% | 92.7% | /unterricht/wuppertal/ |
| P1 | improve-copy | medium | [Geigenunterricht Köln](https://kim-marie-borger.com/unterricht/koeln/) | 86 | 56% | 90.4% | 92.3% | /unterricht/duesseldorf/ |
| P1 | improve-copy | medium | [Geigenunterricht Wuppertal](https://kim-marie-borger.com/unterricht/wuppertal/) | 90 | 55.8% | 90.9% | 92.7% | /unterricht/duesseldorf/ |
| P1 | ready | low | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 90 | 51.3% | 85.8% | 87.9% | /beerdigungen/duesseldorf/ |
| P1 | ready | low | [Live Musik Geburtstag Köln](https://kim-marie-borger.com/geburtstage/koeln/) | 94 | 53.8% | 88% | 89.8% | /geburtstage/wuppertal/ |
| P1 | ready | low | [Viola Konzert Köln](https://kim-marie-borger.com/konzerte/koeln/) | 94 | 51.7% | 87.8% | 89.2% | /konzerte/wuppertal/ |
| P1 | ready | low | [Viola Konzert Wuppertal](https://kim-marie-borger.com/konzerte/wuppertal/) | 94 | 51.7% | 87.8% | 89.2% | /konzerte/koeln/ |
| P1 | ready | low | [Viola Konzert Düsseldorf](https://kim-marie-borger.com/konzerte/duesseldorf/) | 94 | 50.8% | 87% | 88.6% | /konzerte/wuppertal/ |
| P1 | ready | low | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 94 | 53.3% | 86.1% | 88.1% | /beerdigungen/wuppertal/ |
| P1 | ready | low | [Trauermusik Wuppertal](https://kim-marie-borger.com/beerdigungen/wuppertal/) | 94 | 53.3% | 86.1% | 88.1% | /beerdigungen/duesseldorf/ |
| P1 | ready | low | [Taufmusik Köln](https://kim-marie-borger.com/taufen/koeln/) | 98 | 52.6% | 88.7% | 90.1% | /taufen/wuppertal/ |
| P1 | ready | low | [Taufmusik Wuppertal](https://kim-marie-borger.com/taufen/wuppertal/) | 98 | 52.6% | 88.7% | 90.1% | /taufen/koeln/ |
| P1 | ready | low | [Live Musik Geburtstag Wuppertal](https://kim-marie-borger.com/geburtstage/wuppertal/) | 98 | 53.8% | 88% | 89.8% | /geburtstage/koeln/ |
| P1 | ready | low | [Live Musik Firmenevent Köln](https://kim-marie-borger.com/firmenfeiern/koeln/) | 98 | 53.4% | 88.3% | 89.6% | /firmenfeiern/wuppertal/ |
| P1 | ready | low | [Live Musik Firmenevent Wuppertal](https://kim-marie-borger.com/firmenfeiern/wuppertal/) | 98 | 53.4% | 88.3% | 89.6% | /firmenfeiern/koeln/ |
| P1 | ready | low | [Live Musik Geburtstag Düsseldorf](https://kim-marie-borger.com/geburtstage/duesseldorf/) | 98 | 52.5% | 87.4% | 89.1% | /geburtstage/wuppertal/ |
| P1 | ready | low | [Taufmusik Düsseldorf](https://kim-marie-borger.com/taufen/duesseldorf/) | 98 | 52.6% | 87.7% | 89.1% | /taufen/wuppertal/ |
| P1 | ready | low | [Live Musik Firmenevent Düsseldorf](https://kim-marie-borger.com/firmenfeiern/duesseldorf/) | 98 | 53.1% | 87.6% | 88.7% | /firmenfeiern/koeln/ |
| P1 | ready | low | [Hochzeitsmusik Düsseldorf](https://kim-marie-borger.com/hochzeiten/duesseldorf/) | 100 | 47.5% | 84.9% | 86.2% | /hochzeiten/koeln/ |
| P1 | ready | low | [Hochzeitsmusik Köln](https://kim-marie-borger.com/hochzeiten/koeln/) | 100 | 47.1% | 84.9% | 86.2% | /hochzeiten/duesseldorf/ |
| P1 | ready | low | [Hochzeitsmusik Wuppertal](https://kim-marie-borger.com/hochzeiten/wuppertal/) | 100 | 47.5% | 84.5% | 85.9% | /hochzeiten/koeln/ |
| P2 | priority-rewrite | high | [Geigenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 67 | 67.4% | 97.2% | 99.6% | /unterricht/ratingen/ |
| P2 | priority-rewrite | high | [Geigenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 67 | 67.4% | 97.2% | 99.6% | /unterricht/essen/ |
| P2 | priority-rewrite | high | [Geigenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 67 | 67.2% | 97% | 99.4% | /unterricht/moenchengladbach/ |
| P2 | priority-rewrite | high | [Geigenunterricht Mönchengladbach](https://kim-marie-borger.com/unterricht/moenchengladbach/) | 67 | 67.4% | 97% | 99.4% | /unterricht/erkrath/ |
| P2 | priority-rewrite | high | [Geigenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 67 | 67.2% | 96.9% | 99.3% | /unterricht/ratingen/ |
| P2 | priority-rewrite | high | [Geigenunterricht Remscheid](https://kim-marie-borger.com/unterricht/remscheid/) | 67 | 67.3% | 96.8% | 99.2% | /unterricht/moenchengladbach/ |
| P2 | priority-rewrite | high | [Geigenunterricht Leverkusen](https://kim-marie-borger.com/unterricht/leverkusen/) | 67 | 67.1% | 96.6% | 99.2% | /unterricht/neuss/ |
| P2 | priority-rewrite | high | [Geigenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 67 | 66.8% | 96.7% | 99.2% | /unterricht/leverkusen/ |
| P2 | priority-rewrite | high | [Geigenunterricht Solingen](https://kim-marie-borger.com/unterricht/solingen/) | 67 | 66.9% | 96.7% | 99.1% | /unterricht/remscheid/ |
| P2 | priority-rewrite | high | [Geigenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 67 | 66.9% | 96.6% | 99% | /unterricht/ratingen/ |
| P2 | priority-rewrite | high | [Geigenunterricht Duisburg](https://kim-marie-borger.com/unterricht/duisburg/) | 67 | 67.4% | 96.6% | 99% | /unterricht/erkrath/ |
| P2 | priority-rewrite | high | [Geigenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 67 | 67.3% | 96.6% | 99% | /unterricht/moenchengladbach/ |
| P2 | priority-rewrite | high | [Geigenunterricht Bochum](https://kim-marie-borger.com/unterricht/bochum/) | 67 | 67.1% | 96.5% | 98.9% | /unterricht/essen/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Mönchengladbach](https://kim-marie-borger.com/geburtstage/moenchengladbach/) | 75 | 64.2% | 95.1% | 97.2% | /geburtstage/ratingen/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Ratingen](https://kim-marie-borger.com/geburtstage/ratingen/) | 75 | 64.7% | 95.1% | 97.2% | /geburtstage/moenchengladbach/ |
| P2 | priority-rewrite | high | [Hochzeitsmusik Mönchengladbach](https://kim-marie-borger.com/hochzeiten/moenchengladbach/) | 75 | 65.4% | 95.2% | 97.2% | /hochzeiten/ratingen/ |
| P2 | priority-rewrite | high | [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 75 | 66.3% | 95.2% | 97.2% | /hochzeiten/moenchengladbach/ |
| P2 | priority-rewrite | high | [Taufmusik Mönchengladbach](https://kim-marie-borger.com/taufen/moenchengladbach/) | 75 | 64.3% | 95.2% | 97.2% | /taufen/ratingen/ |
| P2 | priority-rewrite | high | [Taufmusik Ratingen](https://kim-marie-borger.com/taufen/ratingen/) | 75 | 65.2% | 95.2% | 97.2% | /taufen/moenchengladbach/ |
| P2 | priority-rewrite | high | [Live Musik Firmenevent Mönchengladbach](https://kim-marie-borger.com/firmenfeiern/moenchengladbach/) | 75 | 64.5% | 95.2% | 97% | /firmenfeiern/ratingen/ |
| P2 | priority-rewrite | high | [Live Musik Firmenevent Ratingen](https://kim-marie-borger.com/firmenfeiern/ratingen/) | 75 | 65.3% | 95.2% | 97% | /firmenfeiern/moenchengladbach/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Leverkusen](https://kim-marie-borger.com/geburtstage/leverkusen/) | 75 | 64.7% | 93.5% | 96.2% | /geburtstage/mettmann/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Mettmann](https://kim-marie-borger.com/geburtstage/mettmann/) | 75 | 64.6% | 93.5% | 96.2% | /geburtstage/leverkusen/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Erkrath](https://kim-marie-borger.com/geburtstage/erkrath/) | 75 | 64.4% | 94% | 96.1% | /geburtstage/hilden/ |
| P2 | priority-rewrite | high | [Live Musik Geburtstag Hilden](https://kim-marie-borger.com/geburtstage/hilden/) | 75 | 64.7% | 94% | 96.1% | /geburtstage/erkrath/ |
| P2 | priority-rewrite | high | [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 75 | 66% | 94% | 96.1% | /hochzeiten/ratingen/ |
| P2 | priority-rewrite | high | [Hochzeitsmusik Leverkusen](https://kim-marie-borger.com/hochzeiten/leverkusen/) | 75 | 66.5% | 93.3% | 96% | /hochzeiten/mettmann/ |
| P2 | priority-rewrite | high | [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 75 | 66.6% | 93.3% | 96% | /hochzeiten/leverkusen/ |
| P2 | priority-rewrite | high | [Live Musik Firmenevent Erkrath](https://kim-marie-borger.com/firmenfeiern/erkrath/) | 75 | 65.1% | 94% | 96% | /firmenfeiern/ratingen/ |

## Spalten in der CSV

- `priority`: heuristische SEO-Prioritaet nach Leistung und Ort.
- `status`: Arbeitsstatus aus SEO-Score, Content-Score und Aehnlichkeitsrisiko.
- `cannibalization_risk`: eigenes Warnsignal fuer sehr aehnliche Seiten im selben Leistungscluster.
- `intent_cluster`: Suchintention, die diese URL besetzen soll.
- `seo_score`: technische Onpage-Basics wie Title, H1, Meta Description, Canonical, Schema, Sitemap und interne Links.
- `content_score`: Texttiefe, Ortsnennung, Abstand zur Basisleistung und Abstand zur aehnlichsten Seite im selben Cluster.
- `similarity_to_base_service`: Textaehnlichkeit zur Hauptleistungsseite.
- `nearest_same_service_shingle_similarity`: 5-Wort-Shingle-Aehnlichkeit. Dieser Wert ist der primaere Ausloeser fuer Content-Kannibalisierung, weil er echte Satz- und Absatznaehe misst.
- `nearest_same_service_template_similarity`: Token-Overlap im selben Leistungscluster. Dieser Wert bleibt sichtbar, loest aber kein Risiko allein aus, weil Layout, Bilder und Grundstruktur bewusst von der Hauptleistungsseite geerbt werden.
- `nearest_same_service_location_masked_template_similarity`: Token-Overlap, nachdem bekannte Ortsnamen zu einem Platzhalter normalisiert wurden. Dieser Wert verstaerkt ein Risiko nur, wenn auch die Content-Aehnlichkeit hoch ist.
- `nearest_same_location_similarity`: Textaehnlichkeit zu anderen Leistungen im selben Ort.

## Naechster Arbeitsschritt

Die High-/Medium-Risk-Seiten und P1-Seiten mit `improve-copy` sollten zuerst eigene Textmodule bekommen: staerkerer lokaler Einstieg, andere Zwischenueberschriften, orts- und leistungsbezogene FAQ, konkrete Anlass-Momente und mehr semantische Keyword-Varianten. Bilder und Layout koennen weiter von der Hauptleistungsseite geerbt werden.
