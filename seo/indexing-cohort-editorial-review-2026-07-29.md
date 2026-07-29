# Redaktions- und Intentprüfung der Indexierungskohorte

Stand: 29.07.2026  
Review: 30.09.2026, sofern der Crawl bis 05.08.2026 bestätigt ist

## Ergebnis

Die sechs in der Search Console als gecrawlt, aber nicht indexiert gemeldeten
SEO-URLs sowie die 20 dort nicht indexierten Themenseiten wurden als eine
gemeinsame Kohorte geprüft. Da `/hochzeiten/viola-hochzeit/` zu beiden Gruppen
gehört, umfasst die Kohorte 25 eindeutige URLs.

Alle 25 Einstiege wurden manuell geprüft. Die Seiten mit einer belastbar
eigenständigen Aufgabe wurden gestärkt. Nahe Synonyme und
Instrumentenbezeichnungen bleiben ohne Redirect und mit Self-Canonical bestehen,
bis Abfragen, Klicks und Anfragen verglichen werden können.

## Entscheidungen

| URL | Rolle | Aktion | Begründung | KPI |
| --- | --- | --- | --- | --- |
| `/taufen/langenfeld/` | lokale Leistungsseite | stärken | klare Anfrage für Taufe oder Familienfeier | Indexierung, passende lokale Abfragen, qualifizierte Anfrage |
| `/firmenfeiern/ruhrgebiet/` | regionale Leistungsseite | stärken | eigenständiger B2B- und Reiseplanungsrahmen | Indexierung, B2B-Anfragen |
| `/hochzeiten/recklinghausen/` | lokale Leistungsseite | stärken | konkrete Hochzeitsanfrage und Ablaufplanung | Indexierung, lokale Hochzeitsanfragen |
| `/konzerte/monheim-am-rhein/` | lokale Leistungsseite | stärken | Kultur- und Konzertformat mit eigenem Käuferjob | Indexierung, Kulturanfragen |
| `/geburtstage/bonn/` | lokale Leistungsseite | stärken | Überraschung, Empfang oder Dinner als klare Aufgabe | Indexierung, private Anfragen |
| `/beerdigungen/ave-maria-beerdigung/` | Stückentscheidung | stärken | eindeutige Frage nach Fassung und Einsatzpunkt | Stückabfragen, qualifizierte Traueranfragen |
| `/beerdigungen/trauermusik-repertoire/` | Auswahlhilfe mit Leistungsbezug | stärken, mit Ratgeber vergleichen | eigenständige Repertoireentscheidung, mögliche Guide-Nähe | eindeutige Abfragen, assistierte Anfragen |
| `/beerdigungen/musik-abschied/` | breiter Abschiedsrahmen | Merge-Kandidat | Nähe zu Hauptleistung und freien Abschiedsformaten | Query-Überschneidung, Anfragen |
| `/beerdigungen/musik-bestattung/` | formaler Bestattungsablauf | Merge-Kandidat | starke Synonymnähe zu Musik für Beerdigung | Query-Überschneidung, Anfragen |
| `/beerdigungen/musik-letzter-abschied/` | letzter Musikmoment | testen | kann als Schlussmoment eigenständig sein | eigene Momentabfragen |
| `/firmenfeiern/empfangsmusik-firmenevent/` | Empfangsmusik | stärken | klarer Einsatzpunkt und Lautstärkeentscheidung | Empfangsabfragen, B2B-Anfragen |
| `/firmenfeiern/musik-firmenfeier/` | breite Firmenfeier | Merge-Kandidat | starke Nähe zur Leistungsseite | Query-Überschneidung, B2B-Anfragen |
| `/hochzeiten/musik-brauteinzug/` | Einzug | stärken | eindeutiger Ablaufmoment | Einzugsabfragen, Hochzeitsanfragen |
| `/hochzeiten/musik-freie-trauung/` | Zeremonieform | stärken | eigener Ablauf und eigene Koordination | Abfragen zur freien Trauung |
| `/hochzeiten/musik-ringtausch/` | Ringtausch | testen | mögliche Nähe zu Ja-Wort und Ritualmusik | eigene Momentabfragen |
| `/hochzeiten/musik-nach-ja-wort/` | Moment nach dem Versprechen | testen | mögliche Nähe zu Ringtausch und Auszug | eigene Momentabfragen |
| `/hochzeiten/dezente-hochzeitsmusik/` | Stil und Lautstärke | testen | eigenständig nur bei klaren Stilabfragen | Stilabfragen, Empfangsanfragen |
| `/hochzeiten/geige-hochzeit/` | Instrumentenfamilie | vergleichen | Kim bietet primär Viola; Query kann allgemeinen Streicherklang meinen | Geige- versus Viola-Abfragen |
| `/hochzeiten/viola-hochzeit/` | Instrumentenfamilie | vergleichen | eigenes Instrument, aber Nähe zu Bratsche und Streicherin | Viola-Abfragen, Hochzeitsanfragen |
| `/hochzeiten/streicherin-hochzeit/` | Besetzungsentscheidung | vergleichen | kann Solobesetzung statt Instrument meinen | Besetzungsabfragen |
| `/konzerte/musik-kulturabend/` | Kulturformat | stärken | Musik verbindet Text, Gespräch, Kunst oder Moderation | Kulturanfragen, Formatabfragen |
| `/konzerte/klassische-musik-event/` | Stil und Veranstaltungsform | testen | liegt zwischen Konzert und Eventbegleitung | eindeutige Eventabfragen |
| `/konzerte/bratschenkonzert/` | Instrumentenfamilie | vergleichen | sprachliche Nähe zu Viola-Konzert | Bratsche- versus Viola-Abfragen |
| `/taufen/musik-familienfeier-taufe/` | Feier nach Taufe | stärken | eigener Zeitpunkt außerhalb des Gottesdienstes | Familienfeier-Abfragen, Taufanfragen |
| `/unterricht/musikunterricht-viola/` | Instrumentenunterricht | vergleichen | Viola und Bratsche bezeichnen dasselbe Instrument | eigene Querygruppe, Probestunden |

## Mess- und Migrationsregel

- Eigentümer der Auswertung: SEO/Entwicklung.
- Fachliche und geschäftliche Bewertung: Kim.
- Kein Cross-Canonical und keine URL-Migration in dieser Kohorte.
- Erst nach bestätigtem Crawl und mindestens sechs bis acht Wochen werden
  Seite-Abfrage-Überschneidung, Klicks und qualifizierte Anfragen verglichen.
- Eine Zusammenführung umfasst immer Gewinnerinhalt, 301-Redirect, Sitemap,
  interne Links und einen dokumentierten Rückrollplan.

