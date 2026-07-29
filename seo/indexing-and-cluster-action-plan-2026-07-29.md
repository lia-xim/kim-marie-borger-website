# Indexierungs- und Cluster-Aktionsplan

Stand: 2026-07-29  
Quelle: aktueller Google-Search-Console-Snapshot aus dem Nutzerexport, Repository-Inventar und bekannte Anfrageorte.

## 1. Aktuelle Ausgangslage

| Kennzahl | Wert | Einordnung |
|---|---:|---|
| Indexierte URLs insgesamt | 466 | Aktueller GSC-Status, nicht mit Rankings oder Traffic gleichzusetzen |
| SEO-Detailseiten im Repository | 487 | 343 lokale Seiten, 144 Themenseiten |
| Indexierte SEO-Detailseiten | 431 | 307 lokale Seiten, 124 Themenseiten |
| Nicht indexierte SEO-Detailseiten | 56 | 36 lokale Seiten, 20 Themenseiten |
| Indexierungsquote SEO-Details | 88,5 % | Deutlich besser als der historische Juli-Snapshot |
| Gefunden, zurzeit nicht indexiert | 50 SEO-Seiten | Im Export ohne letztes Crawldatum |
| Gecrawlt, zurzeit nicht indexiert | 6 SEO-Seiten | Plus `/agb/` als siebte, nicht zum SEO-Inventar gehörende URL |

Die 431 indexierten SEO-Detailseiten widerlegen die Annahme, dass der Großteil des
generierten Inventars aktuell nicht indexiert sei. Indexierung allein beweist noch
keine gute Differenzierung. Sie erhöht aber das Migrationsrisiko: Eine indexierte oder
konvertierende URL wird nicht allein wegen sprachlicher Nähe entfernt.

Bekannte Anfragen kamen unter anderem aus Bottrop, Köln, Leichlingen, Soest,
Düsseldorf und Solingen. Lokale Seiten bleiben deshalb ein geschützter,
geschäftsrelevanter Bestand.

## 2. Verbindliche URL-Regeln

1. Behaltene und eigenständig positionierte URLs behalten einen Self-Canonical.
2. Ein Cross-Canonical ist kein Mittel, mehrere Synonymseiten parallel ranken zu
   lassen. Wird er akzeptiert, soll die alternative URL gerade nicht eigenständig
   ranken; wird die Seite als ausreichend anders bewertet, kann Google ihn ignorieren.
3. Bei wirklich identischer Suchaufgabe werden Inhalte in eine Gewinner-URL
   zusammengeführt. Erst danach folgen 301-Redirect, Entfernung aus Sitemap und
   internen Links.
4. `noindex` ist nur für nützliche Nutzerseiten ohne Suchrolle vorgesehen, nicht als
   Standardlösung für Synonyme.
5. Keine indexierte oder anfragewirksame URL wird ohne Abfrage-, Klick-, Link- und
   Conversion-Prüfung migriert.
6. Änderungen erfolgen familienweise in kleinen Kohorten, damit Auswirkungen
   messbar und rückrollbar bleiben.

## 3. Nicht indexierte SEO-Seiten

### Verteilung

| Bereich | Lokale Seiten | Themenseiten | Summe |
|---|---:|---:|---:|
| Beerdigungen | 5 | 5 | 10 |
| Firmenfeiern | 6 | 2 | 8 |
| Geburtstage | 4 | 0 | 4 |
| Hochzeiten | 8 | 8 | 16 |
| Konzerte | 6 | 3 | 9 |
| Taufen | 2 | 1 | 3 |
| Unterricht | 5 | 1 | 6 |
| **Summe** | **36** | **20** | **56** |

### Gecrawlt, zurzeit nicht indexiert

| URL | Typ | Erste Aktion |
|---|---|---|
| `/taufen/langenfeld/` | lokal | Behalten; Inhalts- und Linkqualität im lokalen Cluster prüfen |
| `/hochzeiten/viola-hochzeit/` | Thema | Instrumentenfamilie mit GSC-Abfragen vergleichen |
| `/firmenfeiern/ruhrgebiet/` | lokal | Konkreten Ort und regionale Anfrageführung stärken |
| `/hochzeiten/recklinghausen/` | lokal | Behalten; lokale Relevanz und interne Links prüfen |
| `/konzerte/monheim-am-rhein/` | lokal | Behalten; Angebotsfit und lokale Nachfrage prüfen |
| `/geburtstage/bonn/` | lokal | Behalten; Angebotsfit und interne Links prüfen |

### Gefunden, zurzeit nicht indexiert

Lokale URLs:

- `/beerdigungen/bergisch-gladbach/`
- `/beerdigungen/duesseldorf/` (P1)
- `/beerdigungen/essen/`
- `/beerdigungen/hagen/`
- `/beerdigungen/herne/`
- `/firmenfeiern/herne/`
- `/firmenfeiern/oberhausen/`
- `/firmenfeiern/ratingen/`
- `/firmenfeiern/recklinghausen/`
- `/firmenfeiern/wuppertal/` (P1)
- `/geburtstage/bielefeld/`
- `/geburtstage/krefeld/`
- `/geburtstage/rhein-kreis-neuss/`
- `/hochzeiten/aachen/`
- `/hochzeiten/dormagen/`
- `/hochzeiten/duesseldorf/` (P1)
- `/hochzeiten/heiligenhaus/`
- `/hochzeiten/kreis-mettmann/`
- `/hochzeiten/mettmann/`
- `/hochzeiten/oberhausen/`
- `/konzerte/haan/`
- `/konzerte/heiligenhaus/`
- `/konzerte/moenchengladbach/`
- `/konzerte/oberhausen/`
- `/konzerte/remscheid/`
- `/taufen/ruhrgebiet/`
- `/unterricht/aachen/`
- `/unterricht/herne/`
- `/unterricht/neuss/`
- `/unterricht/nordrhein-westfalen/`
- `/unterricht/ratingen/`

Themenseiten:

| URL | Vorläufige Aktion | Begründung |
|---|---|---|
| `/beerdigungen/ave-maria-beerdigung/` | stärken | Eindeutige Stückfrage |
| `/beerdigungen/trauermusik-repertoire/` | stärken und Ratgeber-Abfragen vergleichen | Eigenständige Auswahlaufgabe, aber Guide-Überlappung |
| `/beerdigungen/musik-abschied/` | Merge-Kandidat | Breite Nähe zur Hauptleistung |
| `/beerdigungen/musik-bestattung/` | Merge-Kandidat | Synonymnähe zu Beerdigung/Trauerfeier |
| `/beerdigungen/musik-letzter-abschied/` | testen | Kann als Schlussmoment eigenständig sein |
| `/firmenfeiern/empfangsmusik-firmenevent/` | stärken | Klarer Einsatzpunkt |
| `/firmenfeiern/musik-firmenfeier/` | Merge-Kandidat | Sehr nahe an der Hauptleistung |
| `/hochzeiten/musik-brauteinzug/` | stärken | Klarer Moment im Ablauf |
| `/hochzeiten/musik-freie-trauung/` | stärken | Eigene Zeremonieform |
| `/hochzeiten/musik-ringtausch/` | testen | Mit Ja-Wort-/Zeremonie-Abfragen vergleichen |
| `/hochzeiten/musik-nach-ja-wort/` | testen | Mit Ringtausch und Auszug vergleichen |
| `/hochzeiten/dezente-hochzeitsmusik/` | testen | Stilfrage, braucht eigene Query-Signale |
| `/hochzeiten/geige-hochzeit/` | Instrumentenfamilie prüfen | Mit Viola/Streichmusik/Geigerin vergleichen |
| `/hochzeiten/streicherin-hochzeit/` | Instrumentenfamilie prüfen | Personen- und Besetzungsnähe |
| `/konzerte/musik-kulturabend/` | stärken | Eigenständiges Veranstaltungsformat |
| `/konzerte/klassische-musik-event/` | testen | Zwischen Konzert und Event positioniert |
| `/konzerte/bratschenkonzert/` | Instrumentenfamilie prüfen | Mit Viola-/Bratsche-Konzert vergleichen |
| `/taufen/musik-familienfeier-taufe/` | stärken | Eigenständige Phase nach Gottesdienst/Taufe |
| `/unterricht/musikunterricht-viola/` | Instrumentenfamilie prüfen | Mit Viola-Unterricht und Bratschenunterricht vergleichen |

## 4. Zielbild der Themencluster

Das Ziel ist keine harte Reduktion auf vier Seiten pro Leistung. Die geplante
Bandbreite schützt unterschiedliche Aufgaben, reduziert aber reine Synonyme.

| Cluster | Heute | Zielkorridor nach Datenauswertung | Hauptfamilien |
|---|---:|---:|---|
| Beerdigungen | 20 | 10–12 | Ablauf, Stücke, Grab, Stil, Musikerin/Buchung |
| Firmenfeiern | 20 | 10–12 | Anlass, Empfang/Dinner, Messe/Gala, Besetzung |
| Geburtstage | 16 | 8–10 | Feierformat, Überraschung/Geschenk, Klang/Besetzung |
| Hochzeiten | 42 | 18–24 | Zeremonie, einzelne Momente, Empfang/Dinner, Stil, Besetzung/Buchung |
| Konzerte | 10 | 6–8 | Format, Programm, Instrument, Event |
| Taufen | 19 | 10–12 | Gottesdienst, Familienfeier, Kommunion/Konfirmation, Stil, Besetzung |
| Unterricht | 17 | 8–10 | Instrument, Alter/Lernstand, Einstieg, Unterrichtsform |

Diese Korridore sind keine Freigabe zum Löschen. Sie sind die erwartbare Größenordnung,
wenn GSC-Abfragen zeigen, dass Synonymseiten dieselbe Aufgabe erfüllen.

## 5. Ratgeber versus Themenseite

Fünf Ratgeber überschneiden sich mit kommerziellen Themenseiten. Beide URL-Typen sind
aktuell indexiert. Deshalb gilt zunächst:

- Ratgeber: Checkliste, Entscheidungshilfe oder Ablaufhilfe vor einer Buchung.
- Themenseite: konkrete Live-Viola-Leistung, Eignung, Ablauf und Anfrage.
- Hauptleistung: breiteste kommerzielle Zielseite des Clusters.

Die Snippets und Überschriften der fünf Ratgeber werden in diesem Durchgang auf
Checkliste/Entscheidungshilfe ausgerichtet. Nach sechs bis acht Wochen wird pro
URL-Paar geprüft:

1. Bedienen beide dieselben Abfragen?
2. Erhält eine URL fast alle Impressionen/Klicks?
3. Gibt es assistierte oder direkte Anfragen?
4. Ist die Informationsaufgabe ohne zweite URL vollständig lösbar?

Erst bei gleicher Suchaufgabe werden Inhalte zusammengeführt und die schwächere URL
per 301 auf die intentgleiche Gewinner-URL weitergeleitet.

## 6. Reihenfolge

### Sofort

- [x] Sichtbare Generator-, Redaktions- und SEO-Sprache im lokalen Arbeitsstand
  entfernen.
- [x] Bekannte Grammatik-, Kodierungs- und Umlaut-Transkriptionsfehler
  automatisiert bereinigen und durch Audit-Regeln absichern.
- [x] Fachfremde Eventtexte auf Unterrichtsseiten ersetzen.
- [x] Leistungseinstiege mit kuratierten, unterschiedlichen Aufgaben statt
  Keyword-Volumen sortieren.
- [x] Themenhubs nach Nutzeraufgaben gruppieren.
- [x] Ratgeber-Snippets auf Checkliste/Entscheidungshilfe ausrichten.
- [x] Alle 23 P1-Seiten einzeln redaktionell finalisieren und dokumentieren.
- [x] Unterricht, Beerdigungen und Hochzeiten ohne datenlose Ortspriorisierung
  stärken und kontextuelle Entscheidungslinks ergänzen.
- [x] Wiederkehrende Orts-, Listen- und Bildplatzhalter in der restlichen
  SEO-Fläche bereinigen und im Audit sperren.
- [x] Die sechs gecrawlten SEO-URLs sowie die 20 nicht indexierten Themenseiten
  als 25 eindeutige URLs redaktionell und nach Intent prüfen.
- [x] Merge-, Test- und Instrumentenfamilien ohne vorschnelle Migration im
  Kohortenprotokoll markieren.
- [x] P1-Messvertrag, Anfrageattributions-CSV und Offsite-Status-Tracker
  anlegen.
- [x] Trackerfehler beheben: 14 `/orte/`- und `/themen/`-Hubs nicht mehr als
  Detailseiten zählen, aktuelle Sitemap-Chunks erkennen und CMS-Priorität
  übernehmen.
- [x] Tracker gegen den frischen Build neu erzeugen: 487 Detailseiten,
  487 CMS-Dokumente und 487 Sitemap-Treffer.
- [x] Änderungen veröffentlichen und anschließend auf der Hauptdomain
  verifizieren: vollständiger Prüflauf auf
  `dpl_3RkDDwWimddeB9TBDXBcokzFmfRF`; der aktuelle commitgebundene
  `main`-Stand ist `READY`. 487/487 öffentliche SEO-Routen, Tina-Endpunkte
  und Formular-Payloads bestanden.

### Nach dem nächsten Crawl

- GSC-Seiten- und Abfrageexport für mindestens 90 Tage ziehen.
- Anfrageorte und Anfragequelle in einer einfachen URL-Zuordnung ergänzen.
- [x] Die drei nicht indexierten P1-Ortsseiten redaktionell zuerst prüfen.
- [x] Die 20 nicht indexierten Themenseiten nach `stärken`, `testen`,
  `Merge-Kandidat` und `Instrumentenfamilie` klassifizieren.
- Query-, Klick- und Anfragewerte für die klassifizierten Familien ergänzen.

### Kontrollierte Konsolidierung

- Höchstens eine Synonymfamilie beziehungsweise drei bis fünf URLs pro Release.
- Gewinner-URL mit allen nützlichen Inhalten stärken.
- 301-Redirects, Sitemap und interne Links gemeinsam ändern.
- Vorher/Nachher für Impressionen, Klicks, Rankings und qualifizierte Anfragen
  dokumentieren.
- Nach zwei, sechs und zwölf Wochen prüfen; bei messbarem Schaden und fehlender
  Policy-Notwendigkeit Rückrolloption bewerten.

Die langfristige Zielarchitektur, Messlogik und Roadmap stehen in der
[Zukunftsstrategie SEO 2026–2027](./future-seo-strategy-2026-2027.md).
