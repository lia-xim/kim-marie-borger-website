# Local SEO Seiten-Tracker

Generiert: 2026-06-16T20:45:55.965Z

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
| Lokale Seiten | 480 |
| High-Risk Content-Aehnlichkeit | 0 |
| Medium-Risk Content-Aehnlichkeit | 0 |
| Durchschnitt SEO-Score | 100 |
| Durchschnitt Content-Score | 95 |
| Durchschnitt Shingle Similarity Same Service | 48.6% |
| Durchschnitt Template Similarity Same Service | 87.8% |
| Durchschnitt Location-Masked Template Similarity | 90.5% |
| Durchschnitt Similarity Base Service | 1.1% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| ready | 480 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 69 | 100 | 84 | 50.4% | 90.3% | 93.7% | 0 |
| firmenfeiern | 69 | 100 | 100 | 45.5% | 82.5% | 84.9% | 0 |
| geburtstage | 65 | 100 | 95 | 49.8% | 89.3% | 92.1% | 0 |
| hochzeiten | 91 | 100 | 94 | 48.7% | 88.2% | 90.7% | 0 |
| konzerte | 59 | 100 | 100 | 46.6% | 86.5% | 89.5% | 0 |
| taufen | 68 | 99 | 97 | 49.3% | 88.3% | 90.4% | 0 |
| unterricht | 59 | 100 | 95 | 50% | 89.5% | 92.5% | 0 |

## High-Risk Content-Paare

Keine High-Risk Content-Paare gefunden.

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| P1 | ready | low | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 80 | 52.6% | 92.5% | 96.1% | /beerdigungen/leverkusen/ |
| P1 | ready | low | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 80 | 52% | 92.5% | 96% | /beerdigungen/bonn/ |
| P1 | ready | low | [Trauermusik Mettmann](https://kim-marie-borger.com/beerdigungen/mettmann/) | 80 | 52.1% | 92.1% | 95.8% | /beerdigungen/remscheid/ |
| P1 | ready | low | [Trauermusik Essen](https://kim-marie-borger.com/beerdigungen/essen/) | 80 | 52.7% | 92.2% | 95.8% | /beerdigungen/moers/ |
| P1 | ready | low | [Trauermusik Erkrath](https://kim-marie-borger.com/beerdigungen/erkrath/) | 80 | 52.7% | 92.2% | 95.7% | /beerdigungen/dormagen/ |
| P1 | ready | low | [Trauermusik Ratingen](https://kim-marie-borger.com/beerdigungen/ratingen/) | 80 | 52.3% | 92.1% | 95.7% | /beerdigungen/leverkusen/ |
| P1 | ready | low | [Trauermusik Neuss](https://kim-marie-borger.com/beerdigungen/neuss/) | 80 | 52.5% | 92% | 95.6% | /beerdigungen/bottrop/ |
| P1 | ready | low | [Trauermusik Dortmund](https://kim-marie-borger.com/beerdigungen/dortmund/) | 80 | 51.7% | 92% | 95.5% | /beerdigungen/bonn/ |
| P1 | ready | low | [Trauermusik Hilden](https://kim-marie-borger.com/beerdigungen/hilden/) | 80 | 51.7% | 91.9% | 95.4% | /beerdigungen/langenfeld/ |
| P1 | ready | low | [Trauermusik Rheinland](https://kim-marie-borger.com/beerdigungen/rheinland/) | 80 | 52% | 91.6% | 94.9% | /beerdigungen/ruhrgebiet/ |
| P1 | ready | low | [Trauermusik Ruhrgebiet](https://kim-marie-borger.com/beerdigungen/ruhrgebiet/) | 80 | 51.8% | 91.6% | 94.9% | /beerdigungen/rheinland/ |
| P1 | ready | low | [Trauermusik Kreis Mettmann](https://kim-marie-borger.com/beerdigungen/kreis-mettmann/) | 80 | 48% | 86.8% | 94.8% | /beerdigungen/nordrhein-westfalen/ |
| P1 | ready | low | [Bratschenunterricht Rhein-Kreis Neuss](https://kim-marie-borger.com/unterricht/rhein-kreis-neuss/) | 94 | 50.2% | 90.3% | 95.8% | /unterricht/langenfeld/ |
| P1 | ready | low | [Bratschenunterricht Kreis Mettmann](https://kim-marie-borger.com/unterricht/kreis-mettmann/) | 94 | 49.7% | 89.4% | 95.6% | /unterricht/nordrhein-westfalen/ |
| P1 | ready | low | [Bratschenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 94 | 52.7% | 92.4% | 95.5% | /unterricht/wuelfrath/ |
| P1 | ready | low | [Bratschenunterricht Düsseldorf](https://kim-marie-borger.com/unterricht/duesseldorf/) | 94 | 52.9% | 92.8% | 95.5% | /unterricht/rhein-kreis-neuss/ |
| P1 | ready | low | [Bratschenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 94 | 53.2% | 92.4% | 95.2% | /unterricht/koeln/ |
| P1 | ready | low | [Bratschenunterricht Köln](https://kim-marie-borger.com/unterricht/koeln/) | 94 | 52.7% | 92.4% | 95.2% | /unterricht/erkrath/ |
| P1 | ready | low | [Bratschenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 94 | 53% | 92.4% | 95.1% | /unterricht/unna/ |
| P1 | ready | low | [Bratschenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 94 | 52.4% | 92.3% | 95% | /unterricht/iserlohn/ |
| P1 | ready | low | [Bratschenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 94 | 51% | 91.3% | 94.3% | /unterricht/ratingen/ |
| P1 | ready | low | [Bratschenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 94 | 52.3% | 91.4% | 94.3% | /unterricht/krefeld/ |
| P1 | ready | low | [Bratschenunterricht Ruhrgebiet](https://kim-marie-borger.com/unterricht/ruhrgebiet/) | 94 | 51.7% | 91.2% | 94.1% | /unterricht/duisburg/ |
| P1 | ready | low | [Bratschenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 94 | 50.6% | 90.3% | 94% | /unterricht/muelheim-an-der-ruhr/ |
| P1 | ready | low | [Bratschenunterricht Rheinland](https://kim-marie-borger.com/unterricht/rheinland/) | 94 | 51.3% | 90.3% | 93.3% | /unterricht/dortmund/ |
| P1 | ready | low | [Hochzeitsmusik Hilden](https://kim-marie-borger.com/hochzeiten/hilden/) | 94 | 50.2% | 90.4% | 93.3% | /hochzeiten/oberhausen/ |
| P1 | ready | low | [Hochzeitsmusik Neuss](https://kim-marie-borger.com/hochzeiten/neuss/) | 94 | 50.8% | 90.5% | 93.2% | /hochzeiten/wuelfrath/ |
| P1 | ready | low | [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 94 | 51.2% | 90.5% | 93.1% | /hochzeiten/krefeld/ |
| P1 | ready | low | [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 94 | 50.7% | 90.2% | 92.9% | /hochzeiten/haan/ |
| P1 | ready | low | [Hochzeitsmusik Dortmund](https://kim-marie-borger.com/hochzeiten/dortmund/) | 94 | 50.4% | 90.2% | 92.8% | /hochzeiten/koeln/ |
| P1 | ready | low | [Hochzeitsmusik Köln](https://kim-marie-borger.com/hochzeiten/koeln/) | 94 | 50.6% | 90.2% | 92.8% | /hochzeiten/dortmund/ |
| P1 | ready | low | [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 94 | 50.7% | 90% | 92.8% | /hochzeiten/hilden/ |
| P1 | ready | low | [Hochzeitsmusik Düsseldorf](https://kim-marie-borger.com/hochzeiten/duesseldorf/) | 94 | 50.2% | 90.4% | 92.7% | /hochzeiten/mettmann/ |
| P1 | ready | low | [Hochzeitsmusik Essen](https://kim-marie-borger.com/hochzeiten/essen/) | 94 | 50.7% | 90% | 92.7% | /hochzeiten/unna/ |
| P1 | ready | low | [Hochzeitsmusik Rheinland](https://kim-marie-borger.com/hochzeiten/rheinland/) | 98 | 50% | 89.3% | 92% | /hochzeiten/paderborn/ |
| P1 | ready | low | [Hochzeitsmusik Kreis Mettmann](https://kim-marie-borger.com/hochzeiten/kreis-mettmann/) | 98 | 48.1% | 86.8% | 90.8% | /hochzeiten/nordrhein-westfalen/ |
| P1 | ready | low | [Hochzeitsmusik Ruhrgebiet](https://kim-marie-borger.com/hochzeiten/ruhrgebiet/) | 98 | 50.2% | 87.7% | 90.2% | /hochzeiten/rheinland/ |
| P1 | ready | low | [Trauermusik Rhein-Kreis Neuss](https://kim-marie-borger.com/beerdigungen/rhein-kreis-neuss/) | 98 | 53.4% | 84.8% | 88.9% | /beerdigungen/rhein-ruhr/ |
| P1 | ready | low | [Hochzeitsmusik Rhein-Kreis Neuss](https://kim-marie-borger.com/hochzeiten/rhein-kreis-neuss/) | 100 | 45.3% | 84.3% | 89.2% | /hochzeiten/velbert/ |
| P2 | ready | low | [Trauermusik Bonn](https://kim-marie-borger.com/beerdigungen/bonn/) | 80 | 53.3% | 92.6% | 96.1% | /beerdigungen/dormagen/ |
| P2 | ready | low | [Trauermusik Dormagen](https://kim-marie-borger.com/beerdigungen/dormagen/) | 80 | 53.3% | 92.6% | 96.1% | /beerdigungen/bonn/ |
| P2 | ready | low | [Trauermusik Leverkusen](https://kim-marie-borger.com/beerdigungen/leverkusen/) | 80 | 52.5% | 92.5% | 96.1% | /beerdigungen/duesseldorf/ |
| P2 | ready | low | [Trauermusik Hagen](https://kim-marie-borger.com/beerdigungen/hagen/) | 80 | 52.1% | 92.4% | 96% | /beerdigungen/muenster/ |
| P2 | ready | low | [Trauermusik Münster](https://kim-marie-borger.com/beerdigungen/muenster/) | 80 | 52.3% | 92.4% | 96% | /beerdigungen/hagen/ |
| P2 | ready | low | [Trauermusik Siegen](https://kim-marie-borger.com/beerdigungen/siegen/) | 80 | 52.3% | 92.4% | 95.9% | /beerdigungen/muenster/ |
| P2 | ready | low | [Trauermusik Iserlohn](https://kim-marie-borger.com/beerdigungen/iserlohn/) | 80 | 52.6% | 92.4% | 95.9% | /beerdigungen/remscheid/ |
| P2 | ready | low | [Trauermusik Remscheid](https://kim-marie-borger.com/beerdigungen/remscheid/) | 80 | 52.4% | 92.4% | 95.9% | /beerdigungen/iserlohn/ |
| P2 | ready | low | [Trauermusik Wuppertal](https://kim-marie-borger.com/beerdigungen/wuppertal/) | 80 | 52.4% | 92.4% | 95.9% | /beerdigungen/remscheid/ |
| P2 | ready | low | [Trauermusik Moers](https://kim-marie-borger.com/beerdigungen/moers/) | 80 | 52.8% | 92.2% | 95.8% | /beerdigungen/essen/ |
| P2 | ready | low | [Trauermusik Bottrop](https://kim-marie-borger.com/beerdigungen/bottrop/) | 80 | 52.5% | 92% | 95.6% | /beerdigungen/neuss/ |

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
