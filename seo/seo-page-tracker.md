# SEO Page Tracker

Generiert: 2026-06-14T19:31:14.593Z

Dieser Tracker prueft lokale Seiten und Topic-Seiten gemeinsam. Ziel ist, Seiten zu finden, die technisch existieren, aber noch zu aehnlich, zu duenn, nicht sauber im CMS gepflegt oder bei Keywords zu nah an anderen Seiten sind.

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| SEO-Seiten gesamt | 480 |
| local | 343 |
| topic | 137 |
| CMS-Dokumente vorhanden | 480 |
| Durchschnitt Keyword-Nahe | 60% |
| Durchschnitt Content-Aehnlichkeit | 50.3% |
| Durchschnitt Template-Aehnlichkeit | 85.7% |

## Fortschritt nach Kategorie

| Kategorie | Gesamt | Umgeschrieben | Fortschritt | High | Medium | Low |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| beerdigungen | 69 | 69 | 100% | 0 | 0 | 69 |
| firmenfeiern | 69 | 69 | 100% | 0 | 0 | 69 |
| geburtstage | 65 | 65 | 100% | 0 | 0 | 65 |
| hochzeiten | 91 | 91 | 100% | 0 | 0 | 91 |
| konzerte | 59 | 59 | 100% | 0 | 0 | 59 |
| taufen | 68 | 68 | 100% | 0 | 0 | 68 |
| unterricht | 59 | 59 | 100% | 0 | 0 | 59 |

## Risk

| Risiko | Seiten |
| --- | ---: |
| low | 480 |

## Actions

| Aktion | Seiten |
| --- | ---: |
| ok | 480 |

## Priorisierter Backlog

| Risiko | Aktion | Typ | Seite | Keyword-Nahe | Content | Template | Naechste Keyword-Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |


## Interpretation

- `nearest_keyword_similarity` zeigt, ob zwei Zielkeywords im selben Leistungscluster sehr nah beieinanderliegen.
- `nearest_content_similarity` zeigt, ob gerenderte Seiten im Fliesstext sehr aehnlich sind.
- `nearest_template_similarity` bleibt als Monitoringwert erhalten, loest aber allein kein Risiko aus, weil Aufbau und Bilder pro Leistungscluster bewusst gleich bleiben.
- `risk` bewertet deshalb vor allem die Kombination aus gerenderter Content-Aehnlichkeit und Keyword-Naehe.
- `cms_override` muss fuer jede SEO-Seite true sein, damit die Seite im Tina CMS redaktionell gepflegt werden kann.
- `action = rewrite-differentiate` ist der wichtigste Status fuer die redaktionelle Arbeit.
