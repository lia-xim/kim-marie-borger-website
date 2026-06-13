# Keyword Opportunity Mapping

Stand: 2026-06-13

Diese Analyse mappt die gelieferten Keyworddaten auf Zielseiten. Ziel ist nicht, fuer jedes Keyword eine eigene URL zu bauen, sondern pro Suchintention genau eine starke Zielseite zu haben. Varianten wie "musik hochzeit essen" und "hochzeitsmusik essen" gehoeren auf dieselbe URL.

## Wichtigster Befund

Die Daten zeigen zwei relevante Cluster:

1. Hochzeit lokal: kleine Volumina, aber klare lokale Suchintention und teils starke Trends/CPC.
2. Unterricht/Geigenunterricht: groesster messbarer Block, aber fachlich zu pruefen, weil die Seite aktuell vor allem Bratschenunterricht/Viola-Unterricht positioniert.

Trauer, Taufe, Geburtstag und viele andere Begriffe haben in der gelieferten Datenbank kein messbares Volumen. Diese Seiten koennen weiter existieren, sollten aber nachrangig optimiert werden.

## Keine Kannibalisierung bauen

| Keywordgruppe | Zielseite | Entscheidung |
| --- | --- | --- |
| `musik hochzeit koeln`, `hochzeitsmusik koeln` | `/hochzeiten/koeln/` | Eine lokale Hochzeitsseite, keine zweite Keyword-URL |
| `hochzeitsmusik essen`, `musik hochzeit essen` | `/hochzeiten/essen/` | Zusammenlegen, weil gleicher Intent |
| `hochzeitsmusik nrw`, `musik hochzeit nrw`, `live musik hochzeit nrw` | `/hochzeiten/nordrhein-westfalen/` | Eine starke NRW-Regionalseite; Text muss "NRW" explizit verwenden |
| `geige lernen [ort]`, `geigenunterricht [ort]` | `/unterricht/[ort]/` | Eine Unterrichtsseite pro Ort, falls Geige wirklich angeboten wird |
| `musik messe koeln` | `/firmenfeiern/koeln/` | Erst als Messe-Abschnitt auf Firmenfeier Koeln, spaeter ggf. eigene Messe-Seite |

## Prioritaeten

### P1: Sofort in den lokalen Texten abbilden

- `/hochzeiten/koeln/` fuer `musik hochzeit köln`
- `/hochzeiten/essen/` fuer `hochzeitsmusik essen` und `musik hochzeit essen`
- `/hochzeiten/muenster/` fuer `hochzeitsmusik münster`
- `/hochzeiten/nordrhein-westfalen/` fuer `hochzeitsmusik nrw`, `musik hochzeit nrw`, `live musik hochzeit nrw`
- `/unterricht/ratingen/` fuer `geigenunterricht ratingen`
- `/unterricht/duisburg/` fuer `geigenunterricht duisburg`
- `/unterricht/bochum/` fuer `geigenunterricht bochum`
- `/unterricht/duesseldorf/` fuer `geige lernen düsseldorf`
- `/unterricht/koeln/` fuer `geige lernen köln`

### P2: Danach optimieren

- `/hochzeiten/aachen/`
- `/hochzeiten/bielefeld/`
- `/firmenfeiern/koeln/` mit Abschnitt "Musik fuer Messe Koeln"
- `/unterricht/leverkusen/`
- `/unterricht/krefeld/`
- `/unterricht/bergisch-gladbach/`
- `/unterricht/solingen/`
- `/unterricht/neuss/`
- `/unterricht/herne/`
- weitere Unterrichtsorte mit Volumen 10

### P3: Niedriger priorisieren

- `/unterricht/muelheim-an-der-ruhr/`, weil die Daten in der Stichprobe stark fallend sind.
- Lokale Seiten ohne messbares Keywordvolumen bleiben als Flaechenabdeckung bestehen, werden aber nicht zuerst handoptimiert.

## Fachliche Entscheidung: Geige vs. Bratsche/Viola

Die Keyworddaten sprechen stark fuer "Geigenunterricht" und "Geige lernen". Die aktuelle Website positioniert Unterricht aber primaer als Bratschenunterricht/Viola lernen.

Vor der Textoptimierung muss klar sein:

- Bietet Kim Marie tatsaechlich Geigenunterricht an?
- Oder soll die Seite nur erklaeren, warum Suchende nach Geige auch Viola/Bratsche entdecken koennen?

Wenn Geigenunterricht angeboten wird, sollten die Unterrichtsseiten textlich auf "Geigen- und Bratschenunterricht" erweitert werden. Wenn nicht, sollten wir nicht aggressiv auf "Geigenunterricht" optimieren, weil das Suchversprechen sonst nicht sauber ist.

## Content-Anforderungen pro Zielseite

Jede priorisierte lokale Seite braucht mehr als Ortsname-Austausch:

- eigener Einstieg mit Keyword und Ort
- 2-3 lokale oder intentbezogene Abschnitte
- FAQ mit Keywordvarianten
- semantische Varianten im Text, z. B. `musik hochzeit essen`, `hochzeitsmusik essen`, `live musik hochzeit`
- klare CTA fuer Anfrage/Probestunde
- interne Links zu Nachbarorten und verwandten Leistungen

## Naechster Umsetzungsschritt

Die Keyworddaten sollten in die lokale Textlogik einfliessen. Erste technische Aufgabe:

1. Keyword-Opportunity-Daten in den Local-SEO-Generator aufnehmen.
2. P1-Seiten mit eigenen Textprofilen versehen.
3. Unterrichtsseiten erst nach fachlicher Freigabe auf `Geigenunterricht` erweitern.
4. Danach Tracker neu laufen lassen und Zielwert setzen: Location-masked Template Similarity fuer P1-Seiten unter 85%.
