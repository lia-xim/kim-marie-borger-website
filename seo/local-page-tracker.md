# Local SEO Seiten-Tracker

Generiert: 2026-06-16T19:11:23.802Z

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
| Lokale Seiten | 480 |
| High-Risk Aehnlichkeit | 298 |
| Medium-Risk Aehnlichkeit | 172 |
| Durchschnitt SEO-Score | 100 |
| Durchschnitt Content-Score | 76 |
| Durchschnitt Shingle Similarity Same Service | 50.1% |
| Durchschnitt Template Similarity Same Service | 88.1% |
| Durchschnitt Location-Masked Template Similarity | 90.7% |
| Durchschnitt Similarity Base Service | 1.1% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| improve-copy | 172 |
| priority-rewrite | 209 |
| ready | 99 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 69 | 100 | 71 | 57% | 89.9% | 92.6% | 64 |
| firmenfeiern | 69 | 100 | 86 | 45.5% | 82.5% | 84.9% | 0 |
| geburtstage | 65 | 100 | 73 | 51.4% | 90.7% | 93.4% | 63 |
| hochzeiten | 91 | 100 | 75 | 49.2% | 88.2% | 90.7% | 70 |
| konzerte | 59 | 100 | 79 | 46.6% | 86.5% | 89.5% | 5 |
| taufen | 68 | 99 | 77 | 49.3% | 88.3% | 90.4% | 43 |
| unterricht | 59 | 100 | 73 | 51.9% | 90.9% | 93.9% | 53 |

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| P1 | priority-rewrite | high | [Trauermusik Mettmann](https://kim-marie-borger.com/beerdigungen/mettmann/) | 68 | 90% | 92.7% | /beerdigungen/remscheid/ |
| P1 | priority-rewrite | high | [Trauermusik Ratingen](https://kim-marie-borger.com/beerdigungen/ratingen/) | 68 | 89.8% | 92.5% | /beerdigungen/langenfeld/ |
| P1 | priority-rewrite | high | [Trauermusik Hilden](https://kim-marie-borger.com/beerdigungen/hilden/) | 68 | 90% | 92.5% | /beerdigungen/langenfeld/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Rhein-Kreis Neuss](https://kim-marie-borger.com/unterricht/rhein-kreis-neuss/) | 72 | 90.3% | 95.8% | /unterricht/langenfeld/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Kreis Mettmann](https://kim-marie-borger.com/unterricht/kreis-mettmann/) | 72 | 89.4% | 95.6% | /unterricht/nordrhein-westfalen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Neuss](https://kim-marie-borger.com/unterricht/neuss/) | 72 | 92.4% | 95.5% | /unterricht/wuelfrath/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Düsseldorf](https://kim-marie-borger.com/unterricht/duesseldorf/) | 72 | 92.8% | 95.5% | /unterricht/rhein-kreis-neuss/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Erkrath](https://kim-marie-borger.com/unterricht/erkrath/) | 72 | 92.4% | 95.2% | /unterricht/koeln/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Köln](https://kim-marie-borger.com/unterricht/koeln/) | 72 | 92.4% | 95.2% | /unterricht/erkrath/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Essen](https://kim-marie-borger.com/unterricht/essen/) | 72 | 92.4% | 95.1% | /unterricht/unna/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Ratingen](https://kim-marie-borger.com/unterricht/ratingen/) | 72 | 92.3% | 95% | /unterricht/iserlohn/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Mettmann](https://kim-marie-borger.com/unterricht/mettmann/) | 72 | 91.3% | 94.3% | /unterricht/ratingen/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Dortmund](https://kim-marie-borger.com/unterricht/dortmund/) | 72 | 91.4% | 94.3% | /unterricht/krefeld/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Ruhrgebiet](https://kim-marie-borger.com/unterricht/ruhrgebiet/) | 72 | 91.2% | 94.1% | /unterricht/duisburg/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Hilden](https://kim-marie-borger.com/unterricht/hilden/) | 72 | 90.3% | 94% | /unterricht/muelheim-an-der-ruhr/ |
| P1 | priority-rewrite | high | [Bratschenunterricht Rheinland](https://kim-marie-borger.com/unterricht/rheinland/) | 72 | 90.3% | 93.3% | /unterricht/dortmund/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Hilden](https://kim-marie-borger.com/hochzeiten/hilden/) | 72 | 90.4% | 93.3% | /hochzeiten/oberhausen/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Neuss](https://kim-marie-borger.com/hochzeiten/neuss/) | 72 | 90.5% | 93.2% | /hochzeiten/wuelfrath/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Erkrath](https://kim-marie-borger.com/hochzeiten/erkrath/) | 72 | 90.5% | 93.1% | /hochzeiten/krefeld/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Ratingen](https://kim-marie-borger.com/hochzeiten/ratingen/) | 72 | 90.2% | 92.9% | /hochzeiten/haan/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Dortmund](https://kim-marie-borger.com/hochzeiten/dortmund/) | 72 | 90.2% | 92.8% | /hochzeiten/koeln/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Köln](https://kim-marie-borger.com/hochzeiten/koeln/) | 72 | 90.2% | 92.8% | /hochzeiten/dortmund/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Mettmann](https://kim-marie-borger.com/hochzeiten/mettmann/) | 72 | 90% | 92.8% | /hochzeiten/hilden/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Düsseldorf](https://kim-marie-borger.com/hochzeiten/duesseldorf/) | 72 | 90.4% | 92.7% | /hochzeiten/mettmann/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Essen](https://kim-marie-borger.com/hochzeiten/essen/) | 72 | 90% | 92.7% | /hochzeiten/unna/ |
| P1 | priority-rewrite | high | [Trauermusik Neuss](https://kim-marie-borger.com/beerdigungen/neuss/) | 72 | 89.4% | 92.3% | /beerdigungen/unna/ |
| P1 | priority-rewrite | high | [Trauermusik Essen](https://kim-marie-borger.com/beerdigungen/essen/) | 74 | 89.4% | 91.9% | /beerdigungen/wuelfrath/ |
| P1 | priority-rewrite | high | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 74 | 89.3% | 91.7% | /beerdigungen/bonn/ |
| P1 | priority-rewrite | high | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 74 | 89.1% | 91.5% | /beerdigungen/leverkusen/ |
| P1 | priority-rewrite | high | [Trauermusik Erkrath](https://kim-marie-borger.com/beerdigungen/erkrath/) | 74 | 89.1% | 91.5% | /beerdigungen/krefeld/ |
| P1 | priority-rewrite | high | [Trauermusik Rheinland](https://kim-marie-borger.com/beerdigungen/rheinland/) | 74 | 88.6% | 90.7% | /beerdigungen/ruhrgebiet/ |
| P1 | priority-rewrite | high | [Trauermusik Ruhrgebiet](https://kim-marie-borger.com/beerdigungen/ruhrgebiet/) | 74 | 88.6% | 90.7% | /beerdigungen/rheinland/ |
| P1 | priority-rewrite | high | [Trauermusik Dortmund](https://kim-marie-borger.com/beerdigungen/dortmund/) | 74 | 88.2% | 90.5% | /beerdigungen/duisburg/ |
| P1 | priority-rewrite | high | [Hochzeitsmusik Rheinland](https://kim-marie-borger.com/hochzeiten/rheinland/) | 78 | 89.3% | 92% | /hochzeiten/paderborn/ |
| P1 | improve-copy | medium | [Trauermusik Kreis Mettmann](https://kim-marie-borger.com/beerdigungen/kreis-mettmann/) | 74 | 86.5% | 90.7% | /beerdigungen/bergisches-land/ |
| P1 | improve-copy | medium | [Trauermusik Rhein-Kreis Neuss](https://kim-marie-borger.com/beerdigungen/rhein-kreis-neuss/) | 78 | 85.7% | 91.1% | /beerdigungen/langenfeld/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Kreis Mettmann](https://kim-marie-borger.com/hochzeiten/kreis-mettmann/) | 78 | 86.8% | 90.8% | /hochzeiten/nordrhein-westfalen/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Ruhrgebiet](https://kim-marie-borger.com/hochzeiten/ruhrgebiet/) | 78 | 87.7% | 90.2% | /hochzeiten/rheinland/ |
| P1 | improve-copy | medium | [Hochzeitsmusik Rhein-Kreis Neuss](https://kim-marie-borger.com/hochzeiten/rhein-kreis-neuss/) | 78 | 84.3% | 89.2% | /hochzeiten/velbert/ |
| P2 | priority-rewrite | high | [Trauermusik Musik Trauerfeier](https://kim-marie-borger.com/beerdigungen/musik-trauerfeier/) | 68 | 91.8% | 95.1% | /beerdigungen/viola-beerdigung/ |
| P2 | priority-rewrite | high | [Trauermusik Viola Beerdigung](https://kim-marie-borger.com/beerdigungen/viola-beerdigung/) | 68 | 91.5% | 95.1% | /beerdigungen/musik-trauerfeier/ |
| P2 | priority-rewrite | high | [Trauermusik Musik Letzter Abschied](https://kim-marie-borger.com/beerdigungen/musik-letzter-abschied/) | 68 | 91.8% | 94.9% | /beerdigungen/viola-beerdigung/ |
| P2 | priority-rewrite | high | [Trauermusik amazing Grace Beerdigung](https://kim-marie-borger.com/beerdigungen/amazing-grace-beerdigung/) | 68 | 91.1% | 94.6% | /beerdigungen/moderne-trauermusik/ |
| P2 | priority-rewrite | high | [Trauermusik Moderne Trauermusik](https://kim-marie-borger.com/beerdigungen/moderne-trauermusik/) | 68 | 90.9% | 94.6% | /beerdigungen/amazing-grace-beerdigung/ |
| P2 | priority-rewrite | high | [Trauermusik Musik Bestattung](https://kim-marie-borger.com/beerdigungen/musik-bestattung/) | 68 | 91.8% | 94.5% | /beerdigungen/moderne-trauermusik/ |
| P2 | priority-rewrite | high | [Trauermusik Live Musik Beerdigung](https://kim-marie-borger.com/beerdigungen/live-musik-beerdigung/) | 68 | 91.8% | 94.5% | /beerdigungen/moderne-trauermusik/ |
| P2 | priority-rewrite | high | [Trauermusik Buchen](https://kim-marie-borger.com/beerdigungen/trauermusik-buchen/) | 68 | 92.5% | 94.5% | /beerdigungen/trauermusik-repertoire/ |
| P2 | priority-rewrite | high | [Trauermusik Repertoire](https://kim-marie-borger.com/beerdigungen/trauermusik-repertoire/) | 68 | 92.5% | 94.5% | /beerdigungen/trauermusik-buchen/ |
| P2 | priority-rewrite | high | [Trauermusik Musikerin Trauerfeier](https://kim-marie-borger.com/beerdigungen/musikerin-trauerfeier/) | 68 | 92.2% | 94.3% | /beerdigungen/trauermusik-buchen/ |
| P2 | priority-rewrite | high | [Trauermusik Live Musik Trauerfeier](https://kim-marie-borger.com/beerdigungen/live-musik-trauerfeier/) | 68 | 91.8% | 94.2% | /beerdigungen/musik-abschied/ |

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
