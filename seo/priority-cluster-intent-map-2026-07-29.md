# Intent-Map für die drei Prioritätscluster

Stand: 29.07.2026  
Zweck: eine primäre Aufgabe pro URL festhalten, ohne vor der GSC-Auswertung
Redirects oder `noindex` zu beschließen.

## Unterricht

| Familie | Primäre URL oder Rolle | Abgrenzung | Vorläufige Aktion |
| --- | --- | --- | --- |
| Hauptleistung | `/unterricht/` | breites Angebot, Ablauf, Zielgruppen, Anfrage | behalten und messen |
| Geigenunterricht | `/unterricht/geigenunterricht/` | konkrete Leistung und Stundenaufbau | stärken |
| Einstieg Geige | `/unterricht/geige-lernen/` | Entscheidung vor dem Start, Instrument und erste Wochen | stärken |
| Erwachsene | `/unterricht/geigenunterricht-erwachsene/` | Wiedereinstieg und erwachsenengerechtes Lernen | behalten |
| Kinder | `/unterricht/geigenunterricht-kinder/` | Alter, Konzentration, Instrumentengröße und Elternrolle | behalten |
| Anfänger | `/unterricht/geigenunterricht-anfaenger/` | erster Unterricht ohne Vorkenntnisse | mit „Geige lernen“ anhand Abfragen vergleichen |
| Bratsche oder Viola | `/unterricht/bratschenunterricht/`, `/unterricht/viola-unterricht/`, `/unterricht/musikunterricht-viola/` | dasselbe Instrument, aber unterschiedliche Alltagssprache | Messfamilie; noch nicht migrieren |
| Bratsche lernen | `/unterricht/bratsche-lernen/`, `/unterricht/viola-lernen/` | Einstieg statt laufender Unterricht | Abfragen und Probestunden vergleichen |

## Beerdigungen und Abschied

| Familie | Primäre URL oder Rolle | Abgrenzung | Vorläufige Aktion |
| --- | --- | --- | --- |
| Hauptleistung | `/beerdigungen/` | breites Angebot, Ablauf und Anfrage | behalten und messen |
| Buchung | `/beerdigungen/trauermusik-buchen/` | Verfügbarkeit, Angaben und Preisrahmen | stärken |
| Allgemeine Leistungsbegriffe | `/beerdigungen/musik-beerdigung/`, `/beerdigungen/musik-trauerfeier/`, `/beerdigungen/musik-bestattung/` | wahrscheinlich hohe Query-Nähe | Messfamilie; Bestattung ist Merge-Kandidat |
| Freier Abschied | `/beerdigungen/musik-abschied/` | kleiner Kreis oder persönliches Ritual außerhalb eines festen Ablaufs | Merge-Kandidat mit Hauptleistung prüfen |
| Letzter Moment | `/beerdigungen/musik-letzter-abschied/` | Blumengruß, Auszug oder Grab als Schlussmoment | als eigenständigen Moment testen |
| Musik am Grab | `/beerdigungen/musik-am-grab/` | Außenmoment, Weg, Wetter und Startsignal | behalten |
| Repertoire | `/beerdigungen/trauermusik-repertoire/` | Stückauswahl mit Leistungsbezug | stärken und mit Ratgeber vergleichen |
| Einzelstücke | `/beerdigungen/ave-maria-beerdigung/`, `/beerdigungen/amazing-grace-beerdigung/` | Fassung, Eignung und Einsatzpunkt eines konkreten Stücks | behalten, wenn eigene Abfragen sichtbar sind |
| Instrumente und Personen | Viola-, Bratsche-, Geige- und Musikerinnen-Seiten | Instrument oder Anbietersuche | familienweise vergleichen |

## Hochzeiten

| Familie | Primäre URL oder Rolle | Abgrenzung | Vorläufige Aktion |
| --- | --- | --- | --- |
| Hauptleistung | `/hochzeiten/` | breites Angebot, Ablauf, Proof und Anfrage | behalten und messen |
| Buchung | `/hochzeiten/hochzeitsmusik-buchen/` | konkrete Anfrage, Verfügbarkeit und Preisrahmen | stärken |
| Gesamte Trauung | `/hochzeiten/musik-zur-trauung/`, `/hochzeiten/musik-hochzeitszeremonie/` | Musikbogen von Einzug bis Auszug | Abfragen vergleichen |
| Zeremonieformen | freie, kirchliche und standesamtliche Trauung | unterschiedliche Abläufe und Koordination | getrennt behalten |
| Einzug | `/hochzeiten/musik-brauteinzug/` | Weglänge, Tempo und Startsignal | stärken |
| Ring und Ja-Wort | `/hochzeiten/musik-ringtausch/`, `/hochzeiten/musik-ja-wort/`, `/hochzeiten/musik-nach-ja-wort/` | sehr nahe Momente innerhalb der Zeremonie | erste Messkohorte; keine Migration vor Queryvergleich |
| Auszug | `/hochzeiten/musik-auszug/` | Öffnung und Übergang nach der Zeremonie | getrennt testen |
| Empfang | `/hochzeiten/sektempfang/`, `/hochzeiten/musik-hochzeitsempfang/` | Ankommen, Gratulationen und Gespräche | Query-Nähe prüfen |
| Dinner | `/hochzeiten/musik-hochzeitsdinner/`, `/hochzeiten/dinnermusik-hochzeit/` | Hintergrundmusik während Essen und Reden | Messfamilie |
| Stil | dezent, elegant, emotional, romantisch, modern, klassisch | gewünschte Wirkung statt Ablaufmoment | nur mit eigenen Querygruppen behalten |
| Instrument und Besetzung | Geige, Viola, Bratsche, Streicherin, Musikerin | Instrumentenwort versus Solo-Besetzung | Messfamilie; Angebotstransparenz bewahren |

## Erste Messkohorte

Ausgewählt ist die Hochzeitsfamilie:

- `/hochzeiten/musik-ringtausch/`
- `/hochzeiten/musik-ja-wort/`
- `/hochzeiten/musik-nach-ja-wort/`

Vor einer Entscheidung werden für alle drei URLs gemeinsame und exklusive
Abfragen, Impressionen, Klicks, Positionen, interne Links und qualifizierte
Hochzeitsanfragen verglichen. Ohne diese Daten bleibt jede URL indexierbar und
behält ihren Self-Canonical.

