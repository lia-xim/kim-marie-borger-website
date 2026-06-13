# Local SEO Seiten-Tracker

Generiert: 2026-06-13T12:57:16.065Z

Dieser Tracker bewertet die lokalen Seiten aus dem gerenderten HTML in `dist/client`. Die komplette Matrix liegt in `seo/local-page-tracker.csv`; diese Datei ist die Arbeitsgrundlage fuer Filter, Priorisierung und SEO-Software.

## Warum diese Metriken?

- Google findet und bewertet Seiten unter anderem ueber crawlbare interne Links und Anchor-Texte: <https://developers.google.com/search/docs/crawling-indexing/links-crawlable>
- Sitemaps helfen Google, wichtige URLs effizienter zu crawlen: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>
- Lokale Seiten brauchen eigenen, hilfreichen Hauptcontent, damit sie nicht wie reine Doorway- oder Massen-Seiten wirken: <https://developers.google.com/search/docs/essentials/spam-policies>

## Schwellenwerte

| Metrik | Gut | Warnung | Kritisch |
| --- | ---: | ---: | ---: |
| `nearest_same_service_shingle_similarity` | <= 0.54 | 0.55-0.63 | >= 0.64 |
| `nearest_same_service_template_similarity` | <= 0.79 | 0.80-0.87 | >= 0.88 |
| `nearest_same_service_location_masked_template_similarity` | <= 0.85 | 0.86-0.92 | >= 0.93 |
| `similarity_to_base_service` | <= 0.55 | 0.56-0.82 | >= 0.83 |
| `content_score` | >= 65 | 45-64 | < 45 |
| `seo_score` | >= 85 | 75-84 | < 75 |

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| Lokale Seiten | 343 |
| High-Risk Aehnlichkeit | 343 |
| Medium-Risk Aehnlichkeit | 0 |
| Durchschnitt SEO-Score | 90 |
| Durchschnitt Content-Score | 50 |
| Durchschnitt Shingle Similarity Same Service | 58% |
| Durchschnitt Template Similarity Same Service | 95% |
| Durchschnitt Location-Masked Template Similarity | 98.8% |
| Durchschnitt Similarity Base Service | 11.3% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| improve-copy | 100 |
| priority-rewrite | 213 |
| rewrite-needed | 30 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 49 | 90 | 50 | 57.3% | 95.5% | 99.9% | 49 |
| firmenfeiern | 49 | 90 | 50 | 55.3% | 94.6% | 98.7% | 49 |
| geburtstage | 49 | 90 | 50 | 58.4% | 94.8% | 98.6% | 49 |
| hochzeiten | 49 | 90 | 57 | 62.1% | 95.7% | 99.1% | 49 |
| konzerte | 49 | 90 | 43 | 53.4% | 94% | 98.3% | 49 |
| taufen | 49 | 90 | 50 | 55.7% | 94.6% | 98.5% | 49 |
| unterricht | 49 | 90 | 50 | 63.9% | 95.5% | 98.7% | 49 |

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| P1 | priority-rewrite | high | [Trauermusik Dortmund](https://kim-marie-borger.com/beerdigungen/dortmund/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Erkrath](https://kim-marie-borger.com/beerdigungen/erkrath/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Essen](https://kim-marie-borger.com/beerdigungen/essen/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Hilden](https://kim-marie-borger.com/beerdigungen/hilden/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Kreis Mettmann](https://kim-marie-borger.com/beerdigungen/kreis-mettmann/) | 50 | 94.2% | 100% | /beerdigungen/bergisches-land/ |
| P1 | priority-rewrite | high | [Trauermusik Mettmann](https://kim-marie-borger.com/beerdigungen/mettmann/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Neuss](https://kim-marie-borger.com/beerdigungen/neuss/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Ratingen](https://kim-marie-borger.com/beerdigungen/ratingen/) | 50 | 95.9% | 100% | /beerdigungen/aachen/ |
| P1 | priority-rewrite | high | [Trauermusik Rhein-Kreis Neuss](https://kim-marie-borger.com/beerdigungen/rhein-kreis-neuss/) | 50 | 94.2% | 100% | /beerdigungen/bergisches-land/ |
| P1 | priority-rewrite | high | [Trauermusik Rheinland](https://kim-marie-borger.com/beerdigungen/rheinland/) | 50 | 95.9% | 100% | /beerdigungen/bergisches-land/ |
| P1 | priority-rewrite | high | [Trauermusik Ruhrgebiet](https://kim-marie-borger.com/beerdigungen/ruhrgebiet/) | 50 | 95.9% | 100% | /beerdigungen/bergisches-land/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Rheinland](https://kim-marie-borger.com/unterricht/rheinland/) | 50 | 95.1% | 99.5% | /unterricht/bergisches-land/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 50 | 95.9% | 99% | /unterricht/moers/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 50 | 96.1% | 98.9% | /unterricht/leverkusen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Ruhrgebiet](https://kim-marie-borger.com/unterricht/ruhrgebiet/) | 50 | 95.1% | 98.8% | /unterricht/rheinland/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Kreis Mettmann](https://kim-marie-borger.com/unterricht/kreis-mettmann/) | 50 | 94.2% | 98.8% | /unterricht/rheinland/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 50 | 96.2% | 98.7% | /unterricht/leverkusen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 50 | 96.2% | 98.7% | /unterricht/neuss/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Rhein-Kreis Neuss](https://kim-marie-borger.com/unterricht/rhein-kreis-neuss/) | 50 | 94% | 98.7% | /unterricht/kreis-mettmann/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 50 | 96% | 98.7% | /unterricht/muenster/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Köln](https://kim-marie-borger.com/unterricht/koeln/) | 50 | 95.9% | 98.5% | /unterricht/aachen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 50 | 95.7% | 98.4% | /unterricht/gelsenkirchen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 50 | 95.7% | 98.3% | /unterricht/langenfeld/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Düsseldorf](https://kim-marie-borger.com/unterricht/duesseldorf/) | 50 | 95.9% | 98.3% | /unterricht/bielefeld/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 55 | 96.1% | 99.3% | /hochzeiten/moers/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 55 | 96.3% | 99.1% | /hochzeiten/neuss/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Rheinland](https://kim-marie-borger.com/hochzeiten/rheinland/) | 58 | 95.5% | 99.7% | /hochzeiten/bergisches-land/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Neuss](https://kim-marie-borger.com/hochzeiten/neuss/) | 58 | 96.2% | 99.2% | /hochzeiten/leverkusen/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Ruhrgebiet](https://kim-marie-borger.com/hochzeiten/ruhrgebiet/) | 58 | 95.5% | 99.2% | /hochzeiten/rheinland/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Kreis Mettmann](https://kim-marie-borger.com/hochzeiten/kreis-mettmann/) | 58 | 94.4% | 99.2% | /hochzeiten/rheinland/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Hilden](https://kim-marie-borger.com/hochzeiten/hilden/) | 58 | 96.3% | 99.1% | /hochzeiten/leverkusen/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Rhein-Kreis Neuss](https://kim-marie-borger.com/hochzeiten/rhein-kreis-neuss/) | 58 | 94.3% | 99.1% | /hochzeiten/kreis-mettmann/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 58 | 96.2% | 99.1% | /hochzeiten/muenster/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Köln](https://kim-marie-borger.com/hochzeiten/koeln/) | 58 | 96.1% | 99% | /hochzeiten/aachen/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Essen](https://kim-marie-borger.com/hochzeiten/essen/) | 58 | 96% | 98.9% | /hochzeiten/gelsenkirchen/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Dortmund](https://kim-marie-borger.com/hochzeiten/dortmund/) | 58 | 96% | 98.9% | /hochzeiten/langenfeld/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Düsseldorf](https://kim-marie-borger.com/hochzeiten/duesseldorf/) | 58 | 96.1% | 98.9% | /hochzeiten/bielefeld/ |
| P2 | priority-rewrite | high | [Viola Konzert Rheinland](https://kim-marie-borger.com/konzerte/rheinland/) | 42 | 93.4% | 99.4% | /konzerte/bergisches-land/ |
| P2 | priority-rewrite | high | [Viola Konzert Mettmann](https://kim-marie-borger.com/konzerte/mettmann/) | 42 | 94.4% | 98.8% | /konzerte/moers/ |
| P2 | priority-rewrite | high | [Viola Konzert Neuss](https://kim-marie-borger.com/konzerte/neuss/) | 42 | 94.6% | 98.6% | /konzerte/leverkusen/ |
| P2 | priority-rewrite | high | [Viola Konzert Ruhrgebiet](https://kim-marie-borger.com/konzerte/ruhrgebiet/) | 42 | 93.4% | 98.6% | /konzerte/rheinland/ |
| P2 | priority-rewrite | high | [Viola Konzert Hilden](https://kim-marie-borger.com/konzerte/hilden/) | 42 | 94.8% | 98.4% | /konzerte/leverkusen/ |
| P2 | priority-rewrite | high | [Viola Konzert Erkrath](https://kim-marie-borger.com/konzerte/erkrath/) | 42 | 94.8% | 98.3% | /konzerte/neuss/ |
| P2 | priority-rewrite | high | [Viola Konzert Ratingen](https://kim-marie-borger.com/konzerte/ratingen/) | 42 | 94.6% | 98.3% | /konzerte/muenster/ |
| P2 | priority-rewrite | high | [Viola Konzert Köln](https://kim-marie-borger.com/konzerte/koeln/) | 42 | 94.4% | 98.1% | /konzerte/aachen/ |
| P2 | priority-rewrite | high | [Viola Konzert Essen](https://kim-marie-borger.com/konzerte/essen/) | 42 | 94.2% | 97.9% | /konzerte/gelsenkirchen/ |
| P2 | priority-rewrite | high | [Viola Konzert Dortmund](https://kim-marie-borger.com/konzerte/dortmund/) | 42 | 94.2% | 97.9% | /konzerte/langenfeld/ |
| P2 | priority-rewrite | high | [Viola Konzert Düsseldorf](https://kim-marie-borger.com/konzerte/duesseldorf/) | 42 | 94.4% | 97.9% | /konzerte/bielefeld/ |

## Spalten in der CSV

- `priority`: heuristische SEO-Prioritaet nach Leistung und Ort.
- `status`: Arbeitsstatus aus SEO-Score, Content-Score und Aehnlichkeitsrisiko.
- `cannibalization_risk`: eigenes Warnsignal fuer sehr aehnliche Seiten im selben Leistungscluster.
- `intent_cluster`: Suchintention, die diese URL besetzen soll.
- `seo_score`: technische Onpage-Basics wie Title, H1, Meta Description, Canonical, Schema, Sitemap und interne Links.
- `content_score`: Texttiefe, Ortsnennung, Abstand zur Basisleistung und Abstand zur aehnlichsten Seite im selben Cluster.
- `similarity_to_base_service`: Textaehnlichkeit zur Hauptleistungsseite.
- `nearest_same_service_shingle_similarity`: 5-Wort-Shingle-Aehnlichkeit. Reagiert stark auf einzelne geaenderte Ortswoerter und unterschaetzt deshalb Template-Gleichheit.
- `nearest_same_service_template_similarity`: Token-Overlap im selben Leistungscluster. Dieser Wert zeigt besser, wie viel Textvorlage wiederverwendet wird.
- `nearest_same_service_location_masked_template_similarity`: Token-Overlap, nachdem bekannte Ortsnamen zu einem Platzhalter normalisiert wurden. Dieser Wert prueft am haertesten, ob Seiten nur durch Ortsbezug auseinanderfallen.
- `nearest_same_location_similarity`: Textaehnlichkeit zu anderen Leistungen im selben Ort.

## Naechster Arbeitsschritt

Die High-Risk/P1-Seiten sollten zuerst eigene Textmodule bekommen: staerkerer lokaler Einstieg, andere Zwischenueberschriften, orts- und leistungsbezogene FAQ, konkrete Anlass-Momente und mehr semantische Keyword-Varianten. Bilder und Layout koennen weiter von der Hauptleistungsseite geerbt werden.
