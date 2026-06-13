# Local SEO Seiten-Tracker

Generiert: 2026-06-13T12:49:31.888Z

Dieser Tracker bewertet die lokalen Seiten aus dem gerenderten HTML in `dist/client`. Die komplette Matrix liegt in `seo/local-page-tracker.csv`; diese Datei ist die Arbeitsgrundlage fuer Filter, Priorisierung und SEO-Software.

## Warum diese Metriken?

- Google findet und bewertet Seiten unter anderem ueber crawlbare interne Links und Anchor-Texte: <https://developers.google.com/search/docs/crawling-indexing/links-crawlable>
- Sitemaps helfen Google, wichtige URLs effizienter zu crawlen: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>
- Lokale Seiten brauchen eigenen, hilfreichen Hauptcontent, damit sie nicht wie reine Doorway- oder Massen-Seiten wirken: <https://developers.google.com/search/docs/essentials/spam-policies>

## Schwellenwerte

| Metrik | Gut | Warnung | Kritisch |
| --- | ---: | ---: | ---: |
| `nearest_same_service_similarity` | <= 0.54 | 0.55-0.63 | >= 0.64 |
| `similarity_to_base_service` | <= 0.55 | 0.56-0.82 | >= 0.83 |
| `content_score` | >= 65 | 45-64 | < 45 |
| `seo_score` | >= 85 | 75-84 | < 75 |

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| Lokale Seiten | 343 |
| High-Risk Aehnlichkeit | 32 |
| Medium-Risk Aehnlichkeit | 244 |
| Durchschnitt SEO-Score | 90 |
| Durchschnitt Content-Score | 61 |
| Durchschnitt Similarity Same Service | 58% |
| Durchschnitt Similarity Base Service | 11.3% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| improve-copy | 285 |
| priority-rewrite | 32 |
| ready | 26 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Same-Service Similarity | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 49 | 90 | 61 | 57.3% | 0 |
| firmenfeiern | 49 | 90 | 69 | 55.3% | 0 |
| geburtstage | 49 | 90 | 60 | 58.4% | 0 |
| hochzeiten | 49 | 90 | 59 | 62.1% | 0 |
| konzerte | 49 | 90 | 63 | 53.4% | 0 |
| taufen | 49 | 90 | 66 | 55.7% | 0 |
| unterricht | 49 | 90 | 51 | 63.9% | 32 |

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Same-Service Similarity | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | --- |
| P1 | priority-rewrite | high | [Bratschenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 50 | 65% | /unterricht/neuss/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 50 | 65% | /unterricht/erkrath/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Kreis Mettmann](https://kim-marie-borger.com/unterricht/kreis-mettmann/) | 50 | 64.6% | /unterricht/mettmann/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 50 | 64.6% | /unterricht/kreis-mettmann/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 50 | 64.4% | /unterricht/gelsenkirchen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 50 | 64.1% | /unterricht/krefeld/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Rheinland](https://kim-marie-borger.com/unterricht/rheinland/) | 50 | 64.1% | /unterricht/krefeld/ |
| P1 | improve-copy | medium | [Bratschenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 50 | 64% | /unterricht/unna/ |
| P1 | improve-copy | medium | [Bratschenunterricht Ruhrgebiet](https://kim-marie-borger.com/unterricht/ruhrgebiet/) | 50 | 64% | /unterricht/rheinland/ |
| P1 | improve-copy | medium | [Bratschenunterricht Düsseldorf](https://kim-marie-borger.com/unterricht/duesseldorf/) | 50 | 63.8% | /unterricht/krefeld/ |
| P1 | improve-copy | medium | [Bratschenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 50 | 63.8% | /unterricht/krefeld/ |
| P1 | improve-copy | medium | [Bratschenunterricht Köln](https://kim-marie-borger.com/unterricht/koeln/) | 50 | 63.8% | /unterricht/krefeld/ |
| P1 | improve-copy | medium | [Bratschenunterricht Rhein-Kreis Neuss](https://kim-marie-borger.com/unterricht/rhein-kreis-neuss/) | 50 | 62.5% | /unterricht/neuss/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 55 | 63.2% | /hochzeiten/kreis-mettmann/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 55 | 62.9% | /hochzeiten/neuss/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Kreis Mettmann](https://kim-marie-borger.com/hochzeiten/kreis-mettmann/) | 58 | 63.2% | /hochzeiten/mettmann/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Neuss](https://kim-marie-borger.com/hochzeiten/neuss/) | 58 | 62.9% | /hochzeiten/erkrath/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Rheinland](https://kim-marie-borger.com/hochzeiten/rheinland/) | 58 | 62.8% | /hochzeiten/langenfeld/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Essen](https://kim-marie-borger.com/hochzeiten/essen/) | 58 | 62.5% | /hochzeiten/gelsenkirchen/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 58 | 62.3% | /hochzeiten/krefeld/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Dortmund](https://kim-marie-borger.com/hochzeiten/dortmund/) | 58 | 62.2% | /hochzeiten/unna/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Ruhrgebiet](https://kim-marie-borger.com/hochzeiten/ruhrgebiet/) | 58 | 62.2% | /hochzeiten/rheinland/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Düsseldorf](https://kim-marie-borger.com/hochzeiten/duesseldorf/) | 58 | 62.1% | /hochzeiten/krefeld/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Hilden](https://kim-marie-borger.com/hochzeiten/hilden/) | 58 | 62.1% | /hochzeiten/krefeld/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Köln](https://kim-marie-borger.com/hochzeiten/koeln/) | 58 | 62.1% | /hochzeiten/krefeld/ |
| P1 | improve-copy | medium | [Trauermusik Kreis Mettmann](https://kim-marie-borger.com/beerdigungen/kreis-mettmann/) | 60 | 60.3% | /beerdigungen/mettmann/ |
| P1 | improve-copy | medium | [Trauermusik Mettmann](https://kim-marie-borger.com/beerdigungen/mettmann/) | 60 | 60.3% | /beerdigungen/kreis-mettmann/ |
| P1 | improve-copy | medium | [Trauermusik Neuss](https://kim-marie-borger.com/beerdigungen/neuss/) | 60 | 57.8% | /beerdigungen/rhein-kreis-neuss/ |
| P1 | improve-copy | medium | [Trauermusik Rhein-Kreis Neuss](https://kim-marie-borger.com/beerdigungen/rhein-kreis-neuss/) | 60 | 57.8% | /beerdigungen/neuss/ |
| P1 | improve-copy | medium | [Trauermusik Dortmund](https://kim-marie-borger.com/beerdigungen/dortmund/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Erkrath](https://kim-marie-borger.com/beerdigungen/erkrath/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Essen](https://kim-marie-borger.com/beerdigungen/essen/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Hilden](https://kim-marie-borger.com/beerdigungen/hilden/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Ratingen](https://kim-marie-borger.com/beerdigungen/ratingen/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Rheinland](https://kim-marie-borger.com/beerdigungen/rheinland/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Trauermusik Ruhrgebiet](https://kim-marie-borger.com/beerdigungen/ruhrgebiet/) | 60 | 57.4% | /beerdigungen/aachen/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Rhein-Kreis Neuss](https://kim-marie-borger.com/hochzeiten/rhein-kreis-neuss/) | 68 | 60.9% | /hochzeiten/neuss/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Bottrop](https://kim-marie-borger.com/unterricht/bottrop/) | 50 | 65.1% | /unterricht/muenster/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Münster](https://kim-marie-borger.com/unterricht/muenster/) | 50 | 65.1% | /unterricht/bottrop/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Bielefeld](https://kim-marie-borger.com/unterricht/bielefeld/) | 50 | 64.8% | /unterricht/paderborn/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Haan](https://kim-marie-borger.com/unterricht/haan/) | 50 | 64.8% | /unterricht/recklinghausen/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Paderborn](https://kim-marie-borger.com/unterricht/paderborn/) | 50 | 64.8% | /unterricht/bielefeld/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Recklinghausen](https://kim-marie-borger.com/unterricht/recklinghausen/) | 50 | 64.8% | /unterricht/haan/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Krefeld](https://kim-marie-borger.com/unterricht/krefeld/) | 50 | 64.7% | /unterricht/langenfeld/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Langenfeld](https://kim-marie-borger.com/unterricht/langenfeld/) | 50 | 64.7% | /unterricht/krefeld/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Wülfrath](https://kim-marie-borger.com/unterricht/wuelfrath/) | 50 | 64.7% | /unterricht/krefeld/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Meerbusch](https://kim-marie-borger.com/unterricht/meerbusch/) | 50 | 64.5% | /unterricht/krefeld/ |
| P2 | priority-rewrite | high | [Bratschenunterricht Gelsenkirchen](https://kim-marie-borger.com/unterricht/gelsenkirchen/) | 50 | 64.4% | /unterricht/essen/ |

## Spalten in der CSV

- `priority`: heuristische SEO-Prioritaet nach Leistung und Ort.
- `status`: Arbeitsstatus aus SEO-Score, Content-Score und Aehnlichkeitsrisiko.
- `cannibalization_risk`: eigenes Warnsignal fuer sehr aehnliche Seiten im selben Leistungscluster.
- `intent_cluster`: Suchintention, die diese URL besetzen soll.
- `seo_score`: technische Onpage-Basics wie Title, H1, Meta Description, Canonical, Schema, Sitemap und interne Links.
- `content_score`: Texttiefe, Ortsnennung, Abstand zur Basisleistung und Abstand zur aehnlichsten Seite im selben Cluster.
- `similarity_to_base_service`: Textaehnlichkeit zur Hauptleistungsseite.
- `nearest_same_service_similarity`: Textaehnlichkeit zur aehnlichsten lokalen Seite derselben Leistung.
- `nearest_same_location_similarity`: Textaehnlichkeit zu anderen Leistungen im selben Ort.

## Naechster Arbeitsschritt

Die High-Risk/P1-Seiten sollten zuerst eigene Textmodule bekommen: staerkerer lokaler Einstieg, andere Zwischenueberschriften, orts- und leistungsbezogene FAQ, konkrete Anlass-Momente und mehr semantische Keyword-Varianten. Bilder und Layout koennen weiter von der Hauptleistungsseite geerbt werden.
