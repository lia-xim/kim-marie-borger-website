# Winter-SEO 2026/27: Analyse und Umsetzung

Stand: 10.11.2026
Quellen: GSC-Export „Leistung“ und „Abdeckung“ vom 10.11.2026 (letzte 3 Monate, Web), Crawl Foundry Workspace `ws_qb11y09uro0j` (Keyword-Metriken DE `kdr_83kwco9tsjfa`, Recherche `krr_faf20y333zb4`, Kosten gesamt 0,35 €).

## 1. Befund aus der Search Console

| Kennzahl | Wert | Einordnung |
| --- | --- | --- |
| Klicks / Impressionen (3 Monate) | 146 / ca. 4.000 | Verified |
| Impressionen pro Tag | ca. 33 bis 19.10. → ca. 95 ab 20.10. | Supported: Folge der Oktober-Erweiterung |
| CTR | ca. 6 % → ca. 1,5 % | Viele neue Impressionen auf Position 10–30 |
| Durchschnittsposition | ca. 11 | stabil |
| Indexiert / nicht indexiert | 496 / 49 (34 „gecrawlt, nicht indexiert“, 12 „gefunden“, 3 Weiterleitung) | Nicht indexiert steigt seit 19.09. |
| Mobil vs. Desktop | Mobil CTR 4,3 % Pos. 9,3; Desktop CTR 2,4 % Pos. 15,9 | Verified |

Seiten mit vielen Impressionen und wenig Klicks:

| Seite | Impr. | Pos. | Maßnahme |
| --- | ---: | ---: | --- |
| /ratgeber/bratsche-geige-unterschied/ | 746 | 10,3 | Titel/Beschreibung mit direkter Antwort (Viola/Violine-Varianten) |
| /unterricht/koeln/ | 345 | 17,0 | Inhalt bereits stark → Off-Page (Google-Profil, Verzeichnisse) |
| /ratgeber/musik-firmenevent-ablauf/ | 263 | 26,1 | Titel auf „Firmenfeier organisieren“, Abschnitt Weihnachtsfeier/Neujahrsempfang |
| /ueber-mich/ | 180 | 4,1 | Markensuche, keine Aktion |
| /hochzeiten/duesseldorf/ | 157 | 15,5 | Saisonal nachrangig, Frühjahr prüfen |
| /geburtstage/ | 86 | 4,8 | Titel auf „Musikerin Geburtstag / runde Geburtstage“ |

Winter-Lücke: Es gab keine Seite zu Weihnachtsfeier, Advent oder Trauerfeier im Winter. „weihnachtsfeier dinnermusik“ rankte auf Position 88.

## 2. Suchvolumen (Crawl Foundry, DE, monatlich)

| Keyword | Volumen | Zielseite |
| --- | ---: | --- |
| lieder beerdigung | 8.100 | /ratgeber/trauermusik-repertoire/ (neu ausgerichtet) |
| trauermusik | 1.300 | /beerdigungen/ |
| musiker (für) beerdigung | 1.000 | /beerdigungen/, /beerdigungen/trauermusik-buchen/ |
| musik trauerfeier / musik (für) beerdigung | je 1.000 | /beerdigungen/musik-trauerfeier/, /beerdigungen/musik-beerdigung/ |
| adventskonzert | 1.000 | /konzerte/adventskonzert/ (neu) |
| trauermusik instrumental | 880 | /beerdigungen/instrumentalmusik-trauerfeier/ |
| geige lernen erwachsene | 210 | /unterricht/geigenunterricht-erwachsene/ |
| musiker geburtstag | 140 | /geburtstage/ |
| musik für beerdigung mutter | 140 | Ratgeber Lieder (FAQ/Abschnitt) |
| musik firmenfeier | 140 | /firmenfeiern/ |
| klassische trauermusik | 90 | /beerdigungen/klassische-musik-beerdigung/ |
| musik zum 70 geburtstag | 70 | /geburtstage/ (Winter-Abschnitt) |
| silvester live musik | 50 | keine Seite (kein passendes Angebot bestätigt) |
| weihnachtsfeier musik / musiker weihnachtsfeier | je 40 (CPC bis 7 $) | /firmenfeiern/musik-weihnachtsfeier/ (neu) |

Für 70./80. Geburtstag und Neujahrsempfang lieferte Crawl Foundry kaum oder kein Volumen. Daher gibt es dafür keine eigenen URLs, sondern Abschnitte auf den bestehenden Hauptseiten.

## 3. Umsetzung

Neue URLs (2):
- `/firmenfeiern/musik-weihnachtsfeier/` (P1, Saison Nov–Dez)
- `/konzerte/adventskonzert/` (P1, Saison Nov–Dez)

Inhaltlich ausgebaut:
- `/ratgeber/trauermusik-repertoire/`: komplett neu geschrieben als „Lieder für die Beerdigung“ (klassisch, kirchlich, modern, nach Moment im Ablauf, für Mutter/Vater/Oma/Opa, Advent/Weihnachten, live vs. Band), 6 FAQ. URL unverändert.
- `/beerdigungen/`: Titel „Trauermusik live – Musikerin für Beerdigung & Trauerfeier“, Region NRW, Winter-Abschnitt (Feiertage, Frost am Grab, Weihnachtslied), 3 neue FAQ.
- `/geburtstage/`: Titel auf runde Geburtstage, Winter-Abschnitt (drinnen, Generationen, Advent), 2 neue FAQ.
- `/firmenfeiern/`: Titel mit Weihnachtsfeier, Neujahrsempfang im Jahreskalender, Link und FAQ zur Weihnachtsfeier.
- `/konzerte/`: Titel und Link zum Adventskonzert.
- `/`: neuer Block „Jetzt im Winter“ mit Links auf alle Winterseiten; Meta-Beschreibung mit Region.
- `/hochzeiten/`: Abschnitt „Im Winter planen, im Sommer heiraten“ (Buchung für 2027), FAQ Winterhochzeit.
- `/unterricht/`: FAQ zum Einstieg im neuen Jahr (Probestunde jederzeit).
- `/taufen/`: FAQ zur Taufe in der Advents- und Weihnachtszeit.
- `/beerdigungen/musik-am-grab/`: Winterhinweise (Frost, Feuchtigkeit, Alternative Halle) und neue FAQ.
- Titel/Beschreibungen: trauermusik-buchen, instrumentalmusik-trauerfeier, musik-beerdigung, klassische-musik-beerdigung, Ratgeber Trauermusik-Kosten (doppelte Lead-/Summary-Texte ersetzt), Ratgeber Viola/Violine, Ratgeber Firmenevent.

Technik:
- Winter-Abschnitte auf Hauptseiten tragen `anchorId: hub-extra-winter` und werden dadurch nicht auf die rund 70 Unterseiten pro Leistung vererbt (kein Duplicate Content).
- Neue Themen in `FEATURED_TOPIC_SLUGS` und Navigationsgruppen aufgenommen (Hub-Verlinkung).
- Prüfung 10.11.2026: Build ok, `audit:seo:dist` 0 Fehler, `qa:seo-pages:dist` 489/489 ohne Fehler.

## 4. Offene Punkte

1. Durch Kim prüfen: genannte Weihnachts- und Trauerstücke (Beispiele, keine Repertoire-Zusage).
2. GSC: URL-Liste „Gecrawlt – zurzeit nicht indexiert“ (34) exportieren; danach gezielt stärken, zusammenführen oder auf noindex setzen.
3. Nach dem Deploy: beide neuen URLs in der GSC zur Indexierung einreichen (IndexNow läuft automatisch).
4. Off-Page: Google-Unternehmensprofil (Kategorie und Leistung „Trauermusik“, Winterbeiträge, Fotos), Kontakt zu Bestattungshäusern in Düsseldorf/Köln/Kreis Mettmann (`/fuer-bestattungshaeuser/` als Ziel).
5. Messung: 6–8 Wochen nach dem Crawl Impressionen, CTR und Anfragen für die Trauer-Seiten und die zwei neuen URLs mit diesem Stand vergleichen. Saisonseiten im Januar nicht abschalten, sondern ab Oktober 2027 erneut prüfen.
