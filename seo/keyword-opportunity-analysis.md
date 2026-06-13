# Keyword Opportunity Mapping

Stand: 2026-06-13

Quelle: `seo/keyword-research-2026-06-13.csv` mit 179 Keyword-Zeilen. Diese Datei ersetzt die vorher falsch kopierten Keyworddaten.

Ziel: pro Suchintention genau eine Ziel-URL. Synonyme und nahe Varianten werden in `cannibalization_group` zusammengefuehrt, damit wir keine Seiten gegeneinander optimieren.

## Gesamtbild

| Cluster | Keywords | Rohvolumen | Zielbares Volumen | Avg CPC |
| --- | ---: | ---: | ---: | ---: |
| Unterricht | 57 | 6210 | 6210 | 1.45 EUR |
| Beerdigung / Trauerfeier | 17 | 5540 | 5540 | 1.32 EUR |
| Geburtstag / private Feier | 16 | 5130 | 260 | 1.64 EUR |
| Hochzeit | 58 | 4340 | 4340 | 1.82 EUR |
| Firmenfeier / Business Event | 13 | 600 | 600 | 3.53 EUR |
| Konzert / Kultur Event | 10 | 190 | 190 | 0.89 EUR |
| Taufe | 8 | 130 | 130 | 0.53 EUR |

## SERP-/Intent-Fit

Die Matrix wertet nicht mehr nur Volumen. Fuer jedes Keyword gibt es `intent_fit` und `seo_action`.

- `target`: Suchintention passt zu einer Buchungs-/Leistungsseite.
- `target-support-page`: Informational, aber relevant als unterstuetzende Seite mit Buchungsbruecke.
- `confirm-offer`: passt nur, wenn das Angebot fachlich wirklich existiert.
- `support-only`: nur natuerlich mitnehmen, keine eigene Zielseite.
- `exclude`: nicht aktiv targeten.

Beim SERP-Beispiel `geburtstagsstaendchen` dominieren YouTube, Kurzvideos, Liedideen, Spotify/Pinterest und Produkte. Das ist kein sauberer Intent fuer "Live-Musikerin fuer Geburtstag buchen" und wird deshalb ausgeschlossen.

## Wichtigste Intent-Gruppen

| Prioritaet | Aktion | Intent-Gruppe | Zielbares Volumen | Rohvolumen | Ziel-URL | Entscheidung | Beispielkeywords |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| P1 | confirm-offer | unterricht:geigenunterricht | 5370 | 5370 | https://kim-marie-borger.com/unterricht/geigenunterricht/ | requires-offer-confirmation | geige unterricht (1600); geigenunterricht (1600); geige lernen (720); geigenunterricht in der nähe (480) |
| P1 | target | beerdigungen:trauermusik | 4970 | 4970 | https://kim-marie-borger.com/beerdigungen/ | optimize-existing-main-page | trauermusik (1600); musik beerdigung (1000); musik für beerdigung (1000); musik für trauerfeier (880) |
| P1 | target | hochzeiten:hochzeitsmusik | 3140 | 3140 | https://kim-marie-borger.com/hochzeiten/ | optimize-existing-main-page | hochzeitsmusik (1000); musik für hochzeit (590); musik hochzeit (590); live musik hochzeit (260) |
| P3 | target-support-page | beerdigungen:trauermusik-repertoire | 570 | 570 | https://kim-marie-borger.com/beerdigungen/trauermusik-repertoire/ | planned-topic-page | klassische musik beerdigung (140); instrumentalmusik beerdigung (110); klassische musik trauerfeier (110); amazing grace beerdigung (70) |
| P2 | target | firmenfeiern:musik-firmenfeier | 420 | 420 | https://kim-marie-borger.com/firmenfeiern/ | optimize-existing-main-page | musik firmenfeier (170); musik für firmenfeier (170); live musik firmenfeier (30); musik firmenevent (30) |
| P3 | target-support-page | hochzeiten:musik-zur-trauung | 350 | 350 | https://kim-marie-borger.com/hochzeiten/musik-zur-trauung/ | planned-topic-page | musik für trauung (170); musik zur trauung (170); live musik trauung (10) |
| P3 | target-support-page | hochzeiten:musik-standesamt-hochzeit | 260 | 260 | https://kim-marie-borger.com/hochzeiten/musik-standesamt/ | planned-topic-page | musik für standesamtliche trauung (140); musik standesamt hochzeit (110); instrumentalmusik standesamt (10) |
| P1 | confirm-offer | unterricht:unterricht-koeln | 180 | 180 | https://kim-marie-borger.com/unterricht/koeln/ | requires-offer-confirmation | geigenunterricht köln (90); violinunterricht köln (50); bratschenunterricht köln (10); geige lernen köln (10) |
| P2 | target | geburtstage:private-feier | 170 | 170 | https://kim-marie-borger.com/geburtstage/private-feier/ | planned-topic-page | musik für private feier (140); musik familienfeier (10); musik für familienfeier (10); musik für gartenfest (10) |
| P1 | confirm-offer | unterricht:unterricht-duesseldorf | 170 | 170 | https://kim-marie-borger.com/unterricht/duesseldorf/ | requires-offer-confirmation | geige unterricht düsseldorf (70); geigenunterricht düsseldorf (70); bratschenunterricht düsseldorf (10); geige lernen düsseldorf (10) |
| P2 | target | konzerte:viola-konzert | 140 | 140 | https://kim-marie-borger.com/konzerte/ | optimize-existing-main-page | viola konzert (90); bratschenkonzert (20); bratsche konzert (10); viola event (10) |
| P2 | target | hochzeiten:musik-hochzeitsfeier | 120 | 120 | https://kim-marie-borger.com/hochzeiten/hochzeitsfeier/ | planned-topic-page | musik für hochzeitsfeier (70); hintergrundmusik hochzeit (40); dinnermusik hochzeit (10) |
| P3 | target | unterricht:bratschenunterricht | 110 | 110 | https://kim-marie-borger.com/unterricht/ | optimize-existing-main-page | bratsche lernen (40); bratschenunterricht (30); bratsche lernen erwachsene (10); bratsche unterricht (10) |
| P2 | target | firmenfeiern:musik-messe | 90 | 90 | https://kim-marie-borger.com/firmenfeiern/musik-messe/ | planned-topic-page | musik messe (90) |
| P3 | target | taufen:taufmusik | 90 | 90 | https://kim-marie-borger.com/taufen/ | optimize-existing-main-page | musik für taufe (40); musik taufe (20); taufmusik (20); klassische musik taufe (10) |
| P3 | mixed-target-support | geburtstage:geburtstagsmusik | 80 | 1180 | https://kim-marie-borger.com/geburtstage/ | support-only-no-target-page | geburtstagsmusik (880); musik geburtstag (170); musik für geburtstag (50); viola geburtstag (30) |
| P3 | target | hochzeiten:musik-freie-trauung | 80 | 80 | https://kim-marie-borger.com/hochzeiten/musik-freie-trauung/ | planned-topic-page | musik freie trauung (40); musik für freie trauung (40) |
| P2 | target | hochzeiten:musik-kirchliche-trauung | 80 | 80 | https://kim-marie-borger.com/hochzeiten/musik-kirchliche-trauung/ | planned-topic-page | musik für kirchliche trauung (40); musik kirchliche trauung (40) |
| P2 | confirm-offer | unterricht:unterricht-dortmund | 50 | 50 | https://kim-marie-borger.com/unterricht/dortmund/ | requires-offer-confirmation | geigenunterricht dortmund (40); geigenunterricht in dortmund (10) |
| P2 | confirm-offer | unterricht:unterricht-essen | 50 | 50 | https://kim-marie-borger.com/unterricht/essen/ | requires-offer-confirmation | geigenunterricht essen (40); geigenunterricht in essen (10) |
| P3 | target-support-page | hochzeiten:musik-auszug-hochzeit | 40 | 40 | https://kim-marie-borger.com/hochzeiten/musik-auszug/ | planned-topic-page | auszug hochzeit musik (40) |
| P2 | confirm-offer | unterricht:unterricht-aachen | 40 | 40 | https://kim-marie-borger.com/unterricht/aachen/ | requires-offer-confirmation | geigenunterricht aachen (40) |
| P2 | confirm-offer | unterricht:unterricht-ratingen | 40 | 40 | https://kim-marie-borger.com/unterricht/ratingen/ | requires-offer-confirmation | geigenunterricht ratingen (30); violinunterricht ratingen (10) |
| P3 | target | firmenfeiern:musik-gala | 40 | 40 | https://kim-marie-borger.com/firmenfeiern/musik-gala/ | planned-topic-page | musik gala (30); musik für gala (10) |
| P3 | target | hochzeiten:hochzeiten-essen | 40 | 40 | https://kim-marie-borger.com/hochzeiten/essen/ | map-to-existing-local-page | musik hochzeit essen (20); hochzeitsmusik essen (10); musik für hochzeit essen (10) |
| P3 | target-support-page | hochzeiten:musik-brauteinzug | 40 | 40 | https://kim-marie-borger.com/hochzeiten/musik-brauteinzug/ | planned-topic-page | einzug braut musik (10); musik brauteinzug (10); musik einzug braut (10); musik zum einzug (10) |
| P3 | target | hochzeiten:hochzeiten-nordrhein-westfalen | 40 | 40 | https://kim-marie-borger.com/hochzeiten/nordrhein-westfalen/ | map-to-region-page | hochzeitsmusik nrw (10); live musik hochzeit nrw (10); live-musik hochzeit nrw (10); musik hochzeit nrw (10) |
| P3 | target | firmenfeiern:firmenfeiern-koeln | 30 | 30 | https://kim-marie-borger.com/firmenfeiern/koeln/ | map-to-existing-local-page | musik gala köln (20); musik messe köln (10) |
| P3 | target | hochzeiten:hochzeiten-koeln | 30 | 30 | https://kim-marie-borger.com/hochzeiten/koeln/ | map-to-existing-local-page | hochzeitsmusik köln (10); musik für hochzeit köln (10); musik hochzeit köln (10) |
| P3 | target | konzerte:live-musik-konzert | 30 | 30 | https://kim-marie-borger.com/konzerte/ | optimize-existing-main-page | klassische musik event (10); live musik event (10); live musik konzert (10) |

## Was sich gegenueber der falschen Kopie aendert

- Geburtstag wirkt im Rohvolumen gross, aber `geburtstagsstaendchen` ist nach SERP-Pruefung ein falscher Medien-/Song-Intent und kein P1-Ziel.
- Unterricht bleibt sehr stark, aber der sichtbare Markt sucht ueberwiegend nach `Geigenunterricht`, `Geige Unterricht`, `Geige lernen` und `Violinunterricht`.
- Trauer ist ein grosser Hauptcluster: `Trauermusik`, `Musik fuer Beerdigung`, `Musik fuer Trauerfeier`.
- Hochzeit ist nicht nur lokal wichtig, sondern vor allem als Head- und Moment-Cluster: `Hochzeitsmusik`, `Musik Hochzeit`, `Live Musik Hochzeit`, `Musik zur Trauung`, `Standesamt`.
- Lokale Stadtkeywords bleiben wertvoll, sind aber nicht der groesste Teil des Suchvolumens.

## P1-Zielrichtungen

- unterricht:geigenunterricht: https://kim-marie-borger.com/unterricht/geigenunterricht/ (5370 Volumen)
- beerdigungen:trauermusik: https://kim-marie-borger.com/beerdigungen/ (4970 Volumen)
- hochzeiten:hochzeitsmusik: https://kim-marie-borger.com/hochzeiten/ (3140 Volumen)
- unterricht:unterricht-koeln: https://kim-marie-borger.com/unterricht/koeln/ (180 Volumen)
- unterricht:unterricht-duesseldorf: https://kim-marie-borger.com/unterricht/duesseldorf/ (170 Volumen)

## Fachliche Freigabe benoetigt

- unterricht:geigenunterricht: https://kim-marie-borger.com/unterricht/geigenunterricht/ (5370 Volumen)
- unterricht:unterricht-koeln: https://kim-marie-borger.com/unterricht/koeln/ (180 Volumen)
- unterricht:unterricht-duesseldorf: https://kim-marie-borger.com/unterricht/duesseldorf/ (170 Volumen)
- unterricht:unterricht-dortmund: https://kim-marie-borger.com/unterricht/dortmund/ (50 Volumen)
- unterricht:unterricht-essen: https://kim-marie-borger.com/unterricht/essen/ (50 Volumen)
- unterricht:unterricht-aachen: https://kim-marie-borger.com/unterricht/aachen/ (40 Volumen)
- unterricht:unterricht-ratingen: https://kim-marie-borger.com/unterricht/ratingen/ (40 Volumen)
- unterricht:unterricht-bochum: https://kim-marie-borger.com/unterricht/bochum/ (20 Volumen)
- unterricht:unterricht-duisburg: https://kim-marie-borger.com/unterricht/duisburg/ (20 Volumen)
- unterricht:unterricht-wuppertal: https://kim-marie-borger.com/unterricht/wuppertal/ (20 Volumen)
- unterricht:unterricht-bergisch-gladbach: https://kim-marie-borger.com/unterricht/bergisch-gladbach/ (10 Volumen)
- unterricht:unterricht-gelsenkirchen: https://kim-marie-borger.com/unterricht/gelsenkirchen/ (10 Volumen)
- unterricht:unterricht-hagen: https://kim-marie-borger.com/unterricht/hagen/ (10 Volumen)
- unterricht:unterricht-herne: https://kim-marie-borger.com/unterricht/herne/ (10 Volumen)
- unterricht:unterricht-krefeld: https://kim-marie-borger.com/unterricht/krefeld/ (10 Volumen)
- unterricht:unterricht-leverkusen: https://kim-marie-borger.com/unterricht/leverkusen/ (10 Volumen)
- unterricht:unterricht-moers: https://kim-marie-borger.com/unterricht/moers/ (10 Volumen)
- unterricht:unterricht-moenchengladbach: https://kim-marie-borger.com/unterricht/moenchengladbach/ (10 Volumen)
- unterricht:unterricht-muelheim-an-der-ruhr: https://kim-marie-borger.com/unterricht/muelheim-an-der-ruhr/ (10 Volumen)
- unterricht:unterricht-neuss: https://kim-marie-borger.com/unterricht/neuss/ (10 Volumen)
- unterricht:unterricht-oberhausen: https://kim-marie-borger.com/unterricht/oberhausen/ (10 Volumen)
- unterricht:unterricht-remscheid: https://kim-marie-borger.com/unterricht/remscheid/ (10 Volumen)
- unterricht:unterricht-solingen: https://kim-marie-borger.com/unterricht/solingen/ (10 Volumen)
- unterricht:unterricht-velbert: https://kim-marie-borger.com/unterricht/velbert/ (10 Volumen)

Die Geigen-/Violin-Keywords duerfen nur aggressiv optimiert werden, wenn Kim Marie tatsaechlich Geigenunterricht beziehungsweise Violinunterricht anbietet. Falls nicht, sollte die Website eher auf Bratsche/Viola fokussieren und die Geigenbegriffe nur erklaerend aufnehmen.

## Nicht aktiv targeten / nur supporten

- geburtstage:geburtstagsstaendchen: exclude, 3770 Rohvolumen, 0 zielbar. Beispiele: geburtstagsständchen, ständchen geburtstag

## Empfohlene neue Themen-/Intent-Seiten

- beerdigungen:trauermusik-repertoire: https://kim-marie-borger.com/beerdigungen/trauermusik-repertoire/ (570 Volumen)
- hochzeiten:musik-zur-trauung: https://kim-marie-borger.com/hochzeiten/musik-zur-trauung/ (350 Volumen)
- hochzeiten:musik-standesamt-hochzeit: https://kim-marie-borger.com/hochzeiten/musik-standesamt/ (260 Volumen)
- geburtstage:private-feier: https://kim-marie-borger.com/geburtstage/private-feier/ (170 Volumen)
- hochzeiten:musik-hochzeitsfeier: https://kim-marie-borger.com/hochzeiten/hochzeitsfeier/ (120 Volumen)
- firmenfeiern:musik-messe: https://kim-marie-borger.com/firmenfeiern/musik-messe/ (90 Volumen)
- hochzeiten:musik-freie-trauung: https://kim-marie-borger.com/hochzeiten/musik-freie-trauung/ (80 Volumen)
- hochzeiten:musik-kirchliche-trauung: https://kim-marie-borger.com/hochzeiten/musik-kirchliche-trauung/ (80 Volumen)
- hochzeiten:musik-auszug-hochzeit: https://kim-marie-borger.com/hochzeiten/musik-auszug/ (40 Volumen)
- firmenfeiern:musik-gala: https://kim-marie-borger.com/firmenfeiern/musik-gala/ (40 Volumen)
- hochzeiten:musik-brauteinzug: https://kim-marie-borger.com/hochzeiten/musik-brauteinzug/ (40 Volumen)
- hochzeiten:musik-sektempfang-hochzeit: https://kim-marie-borger.com/hochzeiten/sektempfang/ (10 Volumen)

## Naechste Umsetzung

1. Fachlich klaeren: Geigenunterricht ja/nein.
2. P1-Hauptcluster textlich umbauen: Trauermusik, Hochzeitsmusik und - falls freigegeben - Geigenunterricht.
3. Fuer P1-Intent-Seiten eigene Textprofile bauen, damit der Local-SEO-Tracker nicht mehr 95-99% Template-Gleichheit meldet.
4. Geburtstag nicht ueber `Geburtstagsstaendchen` targeten, sondern nur ueber echte Live-Musik-/private-Feier-Intents.
5. Lokale Seiten danach anhand der Stadtkeywords und der P1-Hauptintenttexte ausbauen.
