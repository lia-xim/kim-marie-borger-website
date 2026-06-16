# Local SEO Seiten-Tracker

Generiert: 2026-06-16T19:57:33.622Z

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
| High-Risk Content-Aehnlichkeit | 4 |
| Medium-Risk Content-Aehnlichkeit | 74 |
| Durchschnitt SEO-Score | 100 |
| Durchschnitt Content-Score | 95 |
| Durchschnitt Shingle Similarity Same Service | 50.1% |
| Durchschnitt Template Similarity Same Service | 88.1% |
| Durchschnitt Location-Masked Template Similarity | 90.7% |
| Durchschnitt Similarity Base Service | 1.1% |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
| improve-copy | 74 |
| priority-rewrite | 4 |
| ready | 402 |

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 69 | 100 | 88 | 57% | 89.9% | 92.6% | 4 |
| firmenfeiern | 69 | 100 | 100 | 45.5% | 82.5% | 84.9% | 0 |
| geburtstage | 65 | 100 | 94 | 51.4% | 90.7% | 93.4% | 0 |
| hochzeiten | 91 | 100 | 96 | 49.2% | 88.2% | 90.7% | 0 |
| konzerte | 59 | 100 | 100 | 46.6% | 86.5% | 89.5% | 0 |
| taufen | 68 | 99 | 97 | 49.3% | 88.3% | 90.4% | 0 |
| unterricht | 59 | 100 | 94 | 51.9% | 90.9% | 93.9% | 0 |

## High-Risk Content-Paare

| Seite | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | ---: | ---: | ---: | --- |
| [Trauermusik Musik Abschied](https://kim-marie-borger.com/beerdigungen/musik-abschied/) | 64.6% | 91.8% | 94.2% | /beerdigungen/musik-am-grab/ |
| [Trauermusik Musik am Grab](https://kim-marie-borger.com/beerdigungen/musik-am-grab/) | 64.6% | 91.8% | 94.2% | /beerdigungen/musik-abschied/ |
| [Trauermusik Musikerin Trauerfeier](https://kim-marie-borger.com/beerdigungen/musikerin-trauerfeier/) | 63.7% | 92.2% | 94.3% | /beerdigungen/instrumentalmusik-trauerfeier/ |
| [Trauermusik Trauermusikerin](https://kim-marie-borger.com/beerdigungen/trauermusikerin/) | 62.4% | 91.5% | 94.2% | /beerdigungen/musikerin-trauerfeier/ |

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| P1 | improve-copy | medium | [Trauermusik Mettmann](https://kim-marie-borger.com/beerdigungen/mettmann/) | 90 | 55.7% | 90% | 92.7% | /beerdigungen/remscheid/ |
| P1 | improve-copy | medium | [Trauermusik Ratingen](https://kim-marie-borger.com/beerdigungen/ratingen/) | 90 | 56% | 89.8% | 92.5% | /beerdigungen/langenfeld/ |
| P1 | improve-copy | medium | [Trauermusik Hilden](https://kim-marie-borger.com/beerdigungen/hilden/) | 90 | 55.1% | 90% | 92.5% | /beerdigungen/langenfeld/ |
| P1 | improve-copy | medium | [Trauermusik Neuss](https://kim-marie-borger.com/beerdigungen/neuss/) | 94 | 54.7% | 89.4% | 92.3% | /beerdigungen/unna/ |
| P1 | improve-copy | medium | [Trauermusik Essen](https://kim-marie-borger.com/beerdigungen/essen/) | 94 | 54% | 89.4% | 91.9% | /beerdigungen/wuelfrath/ |
| P1 | improve-copy | medium | [Trauermusik Köln](https://kim-marie-borger.com/beerdigungen/koeln/) | 94 | 55.2% | 89.3% | 91.7% | /beerdigungen/bonn/ |
| P1 | improve-copy | medium | [Trauermusik Düsseldorf](https://kim-marie-borger.com/beerdigungen/duesseldorf/) | 94 | 55.3% | 89.1% | 91.5% | /beerdigungen/leverkusen/ |
| P1 | improve-copy | medium | [Trauermusik Erkrath](https://kim-marie-borger.com/beerdigungen/erkrath/) | 94 | 55.3% | 89.1% | 91.5% | /beerdigungen/krefeld/ |
| P1 | improve-copy | medium | [Trauermusik Kreis Mettmann](https://kim-marie-borger.com/beerdigungen/kreis-mettmann/) | 94 | 54.4% | 86.5% | 90.7% | /beerdigungen/bergisches-land/ |
| P1 | improve-copy | medium | [Trauermusik Rheinland](https://kim-marie-borger.com/beerdigungen/rheinland/) | 94 | 54.9% | 88.6% | 90.7% | /beerdigungen/ruhrgebiet/ |
| P1 | improve-copy | medium | [Trauermusik Ruhrgebiet](https://kim-marie-borger.com/beerdigungen/ruhrgebiet/) | 94 | 54.9% | 88.6% | 90.7% | /beerdigungen/rheinland/ |
| P1 | improve-copy | medium | [Trauermusik Dortmund](https://kim-marie-borger.com/beerdigungen/dortmund/) | 94 | 55.1% | 88.2% | 90.5% | /beerdigungen/duisburg/ |
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
| P1 | ready | low | [Trauermusik Rhein-Kreis Neuss](https://kim-marie-borger.com/beerdigungen/rhein-kreis-neuss/) | 98 | 53.4% | 85.7% | 91.1% | /beerdigungen/langenfeld/ |
| P1 | ready | low | [Hochzeitsmusik Kreis Mettmann](https://kim-marie-borger.com/hochzeiten/kreis-mettmann/) | 98 | 48.1% | 86.8% | 90.8% | /hochzeiten/nordrhein-westfalen/ |
| P1 | ready | low | [Hochzeitsmusik Ruhrgebiet](https://kim-marie-borger.com/hochzeiten/ruhrgebiet/) | 98 | 50.2% | 87.7% | 90.2% | /hochzeiten/rheinland/ |
| P1 | ready | low | [Hochzeitsmusik Rhein-Kreis Neuss](https://kim-marie-borger.com/hochzeiten/rhein-kreis-neuss/) | 100 | 45.3% | 84.3% | 89.2% | /hochzeiten/velbert/ |
| P2 | priority-rewrite | high | [Trauermusik Musik Abschied](https://kim-marie-borger.com/beerdigungen/musik-abschied/) | 71 | 64.6% | 91.8% | 94.2% | /beerdigungen/live-musik-trauerfeier/ |
| P2 | priority-rewrite | high | [Trauermusik Musik am Grab](https://kim-marie-borger.com/beerdigungen/musik-am-grab/) | 71 | 64.6% | 91.8% | 94.2% | /beerdigungen/musik-abschied/ |
| P2 | priority-rewrite | high | [Trauermusik Musikerin Trauerfeier](https://kim-marie-borger.com/beerdigungen/musikerin-trauerfeier/) | 80 | 63.7% | 92.2% | 94.3% | /beerdigungen/trauermusik-buchen/ |
| P2 | priority-rewrite | high | [Trauermusik Trauermusikerin](https://kim-marie-borger.com/beerdigungen/trauermusikerin/) | 80 | 62.4% | 91.5% | 94.2% | /beerdigungen/musikerin-trauerfeier/ |
| P2 | improve-copy | medium | [Trauermusik Musik Trauerfeier](https://kim-marie-borger.com/beerdigungen/musik-trauerfeier/) | 80 | 61.2% | 91.8% | 95.1% | /beerdigungen/viola-beerdigung/ |
| P2 | improve-copy | medium | [Trauermusik Viola Beerdigung](https://kim-marie-borger.com/beerdigungen/viola-beerdigung/) | 80 | 60.5% | 91.5% | 95.1% | /beerdigungen/musik-trauerfeier/ |
| P2 | improve-copy | medium | [Trauermusik Musik Letzter Abschied](https://kim-marie-borger.com/beerdigungen/musik-letzter-abschied/) | 80 | 61.2% | 91.8% | 94.9% | /beerdigungen/viola-beerdigung/ |
| P2 | improve-copy | medium | [Trauermusik amazing Grace Beerdigung](https://kim-marie-borger.com/beerdigungen/amazing-grace-beerdigung/) | 80 | 60.1% | 91.1% | 94.6% | /beerdigungen/moderne-trauermusik/ |
| P2 | improve-copy | medium | [Trauermusik Moderne Trauermusik](https://kim-marie-borger.com/beerdigungen/moderne-trauermusik/) | 80 | 61.2% | 90.9% | 94.6% | /beerdigungen/amazing-grace-beerdigung/ |
| P2 | improve-copy | medium | [Trauermusik Musik Bestattung](https://kim-marie-borger.com/beerdigungen/musik-bestattung/) | 80 | 61.2% | 91.8% | 94.5% | /beerdigungen/moderne-trauermusik/ |
| P2 | improve-copy | medium | [Trauermusik Live Musik Beerdigung](https://kim-marie-borger.com/beerdigungen/live-musik-beerdigung/) | 80 | 60.1% | 91.8% | 94.5% | /beerdigungen/moderne-trauermusik/ |

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
