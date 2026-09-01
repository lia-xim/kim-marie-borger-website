# Contextter-Evidenz-Audit und SEO-Aktionsplan

Stand: 01.09.2026  
Workspace: `kim-marie-borger.com` (`ws_qb11y09uro0j`)  
Ziel: qualifizierte Anfragen und Buchungen fuer die sieben bestaetigten
Leistungscluster, nicht mehr Seiten oder Traffic um jeden Preis. Hochzeit und
Trauer/Beerdigung sind nach Betreiberentscheidung gemeinsame P1-Cluster;
Unterricht ist P2.

## 1. Sicherheits- und Quellenpruefung

Der MCP-Aufruf `seo_get_workspace_overview` wurde vor allen anderen Daten- und
Repository-Pruefungen ausgefuehrt. Domain und Workspace-ID stimmen exakt. Es
wurden keine Daten aus anderen Contextter-Workspaces verwendet.

| Contextter-Quelle | Aktueller Status | Einordnung |
| --- | --- | --- |
| Account und Nutzung | bereit | 1,66 EUR fuer sieben tatsaechlich gestartete Domain-/Wettbewerber-Providerabrufe; Keyword-Fehllauefe kosteten 0,00 EUR |
| Keyword-Datenbank | keine Daten | Keine gespeicherten Keywords |
| Keyword-Recherche und Metriken | blockiert | Zwei fruehere Research- und zwei Metrikversuche wurden vor Providerstart mit `KEYWORD_RESEARCH_SOURCE_RESERVATION_INVALID` beziehungsweise `KEYWORD_DATA_SOURCE_RESERVATION_INVALID` abgewiesen. Der unabhaengige Retry vom 01.09.2026 endete bereits bei der Research-Annahme mit `CTX-AGP-500-INTERNAL_ERROR` / `CTX-INF-001`, ohne Operation oder Kosten |
| Domain-Uebersicht | frisch | Snapshot `snap_i3ruixca5vow` fuer Domain, Deutschland und Deutsch |
| Search Performance | nicht verfuegbar | Kein gespeicherter GSC-Snapshot |
| Rank Tracking | nicht konfiguriert | Null Schedules und null Runs |
| Site Audit | nicht konfiguriert | Keine aktive Audit-Site |
| Backlinks | frisch | Snapshot `snap_3bzt7bx4w3k9`, 12 Backlinks und 11 verweisende Domains |
| Wettbewerber | teilweise frisch | Fuenf fachlich passende Domains wurden erhoben; Vergleich abgeschlossen, aber null Keyword-Ergebniszeilen gespeichert |
| Opportunity Engine | nicht verfuegbar | Stored Analyse liefert `PROJECTION_MANIFEST_INCOMPLETE`; Refresh-Scope ist nicht erteilt |

Der Account steht auf `approval_required`; automatische Paid-Ausfuehrung ist
deaktiviert. Der Betreiber hat zwei zeitlich begrenzte Mandate von je 5,00 EUR
freigegeben. Der aktuelle Task-Cost-Breakdown weist 1,66 EUR aus. Davon sind
0,22 EUR dem eigenen Ranking-Snapshot, 0,31 EUR dem eigenen Backlink-Snapshot
und 1,13 EUR den fuenf Wettbewerber-Snapshots zuzuordnen. Die Keyword-Laeufe
erreichten den Provider nicht und wurden vollstaendig freigegeben. Das
10-EUR-Limit wurde damit klar eingehalten.

Beim unabhaengigen Retry war der gemeinsame Keyword-Grant
`agr_9wts99ziqw0t` fuer `action.keyword-research.run` und
`action.keyword-data.refresh` aktiv und genehmigt. Das Mandat
`bmd_bdmg274amrk0` zeigte 5,00 EUR Maximum, 0,00 EUR reserviert, 0,00 EUR
abgerechnet und 5,00 EUR Rest. Der tiefe Research-Aufruf fuer Deutschland und
Deutsch verwendete den festen Idempotenzschluessel
`kim-marie-seo-2026-09-01-keyword-research-independent-retry-v1` und zehn Seeds
aus Trauer, Hochzeit und Unterricht. Contextter antwortete ohne Operation-ID,
Quote oder Providerstart mit `CTX-AGP-500-INTERNAL_ERROR`, Supportcode
`CTX-INF-001`, `retryable: false`. Die anschliessende Account- und
Mandatspruefung blieb unveraendert bei 1,66 EUR Task-Kosten, null Holds und null
Keyword-Abrechnung.

Eine neue, eng taskgebundene Freigabe wurde als `arq_nm8azzud6o9e` fuer genau
die beiden Keyword-Capabilities und maximal 5,00 EUR angefordert. Solange sie
nicht `approved` ist, erfolgt kein weiterer Paid-Retry. Der Metrikjob wird
ausserdem strikt erst nach einem erfolgreichen Research-Lauf gestartet.

## 2. Evidence-Register

| Label | Evidenz | Schlussfolgerung |
| --- | --- | --- |
| Verified | Live am 31.08.2026: Startseite, Unterricht, Beerdigungen, Hochzeiten, Portfolio und Anfrage liefern HTTP 200, Self-Canonical, `index,follow` und JSON-LD | Technische Eligibility der Stichprobe ist gegeben; Ranking und Indexierung sind damit nicht bewiesen |
| Verified | Live-Sitemap: 29 Kern-, 487 SEO- und 7 Ratgeber-URLs; robots.txt erlaubt den oeffentlichen Bereich und sperrt Admin, Tina-Island und API | Discovery-Infrastruktur ist vorhanden |
| Verified | Repository: 487 SEO-Dokumente, 343 lokal und 144 thematisch; sieben Pfeiler und alle vorgesehenen Hubs existieren | Die Architektur ist vollstaendig, aber sehr gross im Verhaeltnis zum Proof-Bestand |
| Verified | Prioritaetsinventar: Trauer 69 Seiten (49 lokal, 20 thematisch), Hochzeit 91 (49 lokal, 42 thematisch), Unterricht 66 (49 lokal, 17 thematisch) | Ohne eigenstaendige, frisch belegte Suchintention sind weitere Seiten derzeit nicht gerechtfertigt |
| Verified | Vor dem freigegebenen Refresh hatte Contextter keine gespeicherten Domain-, Keyword-, GSC-, Ranking-, Audit-, Backlink-, Wettbewerber- oder Opportunity-Daten | Der Refresh schliesst Domain-, Backlink- und Wettbewerber-Aggregate teilweise; Keyword-, GSC-, Audit- und Conversion-Luecken bleiben |
| Verified | Frischer Contextter-Domain-Snapshot: genau ein erkanntes organisches Keyword und eine erkannte Zielseite | Die aktuelle organische Sichtbarkeit ist extrem schmal; aus dem Snapshot ist keine P1-Sichtbarkeit fuer Hochzeit oder Trauer ableitbar |
| Verified | `geigenunterricht koeln`: Position 19, Suchvolumen 90, Schwierigkeit 0; Ziel `/unterricht/koeln/` | Unterricht hat als einziges Cluster einen frischen Rankingbeleg. Die URL wird bewahrt und nicht mit einer neuen Seite kannibalisiert |
| Verified | Backlink-Snapshot: 12 Links, 11 Domains, Authority Rank 0, Spam Score 53; nur `theperfectwedding.de` und `bridebook.com` sind im Sample unmittelbar thematisch anschlussfaehig | Authority ist schwach und das Sample ueberwiegend nicht fachlich relevant; keine Linkzahl als Erfolgsbeweis verwenden |
| Verified | Vergleichs-Snapshots: `gold-violin.com` 19 organische Keywords/134 Referring Domains, `daniela-geige.de` 5/91, `stefano-sicolo.de` 1/33; `grabgeiger.de` und `martindergeiger.de` ohne gespeicherte Rankingzeilen | Einzelne Wettbewerber besitzen mehr Domainabdeckung, aber Contextter lieferte keine belastbare Wettbewerber-Keywordliste. Keine fremden Keywords erfinden oder kopieren |
| Verified | Der Vergleich der fuenf fachlich passenden Wettbewerber wurde als abgeschlossen gespeichert, Ergebnisliste jedoch mit null Zeilen | Wettbewerberauswahl ist belegt, Ranking-Gaps bleiben `NOT PROVEN` |
| Verified | Keyword-Recherche und Metrikrefresh scheiterten wiederholt vor Providerstart und kosteten 0,00 EUR | Frische Volumen-, Intent-, SERP- und Difficulty-Daten bleiben technisch blockiert; das datierte Repository-Set wird nur als `Supported` genutzt |
| Verified | Unabhaengiger Research-Retry vom 01.09.2026: aktiver 5-EUR-Grant und leeres Mandat, danach `CTX-AGP-500-INTERNAL_ERROR` / `CTX-INF-001`, keine Operation, Quote, Reservierung oder Abrechnung | Der Blocker liegt weiterhin vor dem Providerstart; ein Metriklauf waere ohne Research-Candidates weder seriell noch fachlich zulaessig |
| Supported | Datiertes Repository-Keywordset vom 13.06.2026: `Trauermusik` 1.600, `Musik Beerdigung` 1.000, `Musik fuer Beerdigung` 1.000, `Hochzeitsmusik` 1.000, `Musik Hochzeit` 590, `Musik fuer Hochzeit` 590, `Geigenunterricht` 1.600 und `Geige lernen` 720 | Nachfrage ist gestuetzt, aber die Werte sind nicht frisch und nahe Varianten duerfen nicht als einzigartige Nachfrage addiert werden |
| Supported | GSC-Snapshot vom 29.07.2026: 431/487 SEO-Details indexiert, 56 nicht indexiert | Kein Anlass fuer Massenpruning; Snapshot ist nicht aktuell genug fuer URL-Migrationen |
| Verified | Inquiry-Attribution-CSV ist leer; Offsite-Tracker listet zehn Profile als `unverified` | Conversion- und Authority-Wirkung sind nicht messbar |
| Verified | Portfolio enthaelt fuenf reale Audio-Dateien, ein sichtbares Google-Testimonial und Profil-/Instagram-Wege | Verwendbarer Proof ist vorhanden, aber nicht servicebreit genug fuer 487 Detailseiten |
| Verified | Unterrichts-JSON-LD behauptete Online-Unterricht und nur 45 Minuten; sichtbar sind 45 oder 60 Minuten, Online-Unterricht ist nicht bestaetigt | Unsupported Schema musste entfernt werden |
| Rejected | Erfundene Orte, Auftritte, Rezensionen, Preise, Referenzen sowie Massen-Ortsvarianten | Widerspricht Projekt-Truth, Google-Spamregeln und Markenrisiko |

## 3. Getrennte Bewertung

### Technische Eligibility

`Verified`: Live-Stichprobe, robots.txt, Sitemap, Canonicals, Index-Direktiven und
JSON-LD sind erreichbar. Nach der Charge bestanden `npm run check` mit 0
Fehlern, Warnungen und Hinweisen, der frische lokale Tina/Astro-Build, die
487/487-SEO-Seiten-QA sowie der SEO-Audit mit 0 Fehlern und 0 Warnungen auf 524
HTML-Seiten. Eligibility ist nicht gleich Indexierung.

### Indexierung

`Supported, nicht aktuell verifiziert`: Der letzte Repository-GSC-Snapshot vom
29.07.2026 weist 431 indexierte SEO-Details aus. Contextter hat am 31.08.2026
keinen GSC-Snapshot. Keine URL wird auf dieser Basis entfernt, noindexed oder
umgeleitet.

### Suchnachfrage und Rankings

`Verified/Supported`: Der frische Domain-Snapshot belegt nur
`geigenunterricht koeln` auf Position 19 bei Volumen 90. Das Keywordset vom
13.06.2026 stuetzt weiterhin breitere Nachfrage fuer Unterricht, Trauer und
Hochzeit, ist aber nicht frisch. Die Arbeitsprioritaet folgt der
Betreiberentscheidung: Hochzeit und Trauer P1, Unterricht P2. Geburtstage
enthalten ausserdem viel mediale oder Song-Intention; diese Nachfrage darf
nicht pauschal als buchungsnah gelten.

### Query-zu-Seite-Zuordnung und Kannibalisierung

`Verified`: Die einzige frische Query-Zuordnung bleibt
`geigenunterricht koeln` -> `/unterricht/koeln/`, Position 19. Die Quellseiten
belegen daneben eigenstaendige Soll-Rollen fuer `/unterricht/geigenunterricht/`,
`/unterricht/geige-lernen/`, `/beerdigungen/musik-beerdigung/`,
`/beerdigungen/musik-trauerfeier/`, `/hochzeiten/live-musik-hochzeit/`,
`/hochzeiten/musik-zur-trauung/` und `/hochzeiten/musik-standesamt/`. Das ist
eine redaktionelle Zuordnung, kein Rankingbeleg.

`Hypothesis`: Reale Ueberlappungsfamilien bestehen weiterhin bei
Ringtausch/Ja-Wort/Nach-Ja-Wort, Musik zur/waehrend der Trauung,
Trauermusik/Beerdigung/Bestattung sowie Bratschenunterricht/Bratsche
Unterricht/Viola Unterricht. Ohne Page-x-Query-Export und qualifizierte
Anfragen bleibt jede Zusammenlegung unbewiesen. Die erste Messkohorte bleibt
Ringtausch, Ja-Wort und Musik nach dem Ja-Wort.

`Not proven`: Der gespeicherte Wettbewerbervergleich
`cmp_bmbejkzbh1zi` wurde am 01.09.2026 erneut gelesen. Er ist `completed`, die
Ergebnisprojektion bleibt aber `empty` mit `availableResultCount: 0`. Es gibt
daher weiterhin keine konkrete fremde Query, die einer eigenen Seite als Gap
zugeordnet werden duerfte.

### Lokale und servicebezogene Intention

`Supported`: NRW ist bestaetigtes Einsatzgebiet; 49 Gebiete werden als
`areaServed`, nie als Niederlassungen modelliert. 72 stark aehnliche lokale
Seiten bleiben `hold-for-evidence`. Neue Ortsseiten sind gesperrt, bis
Query-, Anfrage-, Service-Area- oder Proof-Evidenz vorliegt.

### Interne Links

`Verified`: Header, Footer, Hubs und Service-Discovery machen Kern- und
Detailseiten erreichbar. Der Nachholbedarf liegt nicht bei Linkmenge, sondern
bei kontextuellen Wegen von Leistung zu Proof und Anfrage. In dieser Charge
werden genau zwei solche Wege auf Prioritaetspfeilern ergaenzt.

### Proof und Vertrauen

`Verified`: Profil, fuenf Audioaufnahmen und eine attribuierte Rueckmeldung sind
sichtbar. Eigenes Live-Video, drei freigegebene Fallgeschichten und breitere
servicebezogene Rezensionen fehlen weiterhin. Ohne Rechte- und Faktenfreigabe
werden sie nicht simuliert.

### Conversion

`Not proven`: Die Anfrage ist erreichbar und technisch vorbereitet, aber der
Attribution-Tracker enthaelt keine Zeile. Qualifizierte Leads, Buchungen und
Wert je Landingpage oder Cluster sind unbekannt.

### Contentqualitaet

`Supported`: Die drei Hauptpfeiler beantworten Leistung, Ablauf und Grenzen
frueh. Auf zentralen Themenunterseiten wurde das Zielkeyword jedoch teilweise
18- bis 24-mal wie ein Satzbaustein wiederholt. Das ist kein Keyword-Mangel,
sondern ein Qualitaetsproblem. Risiko bleibt ausserdem in der skalierten
lokalen Flaeche und in Synonymfamilien.
Google warnt aktuell vor massenproduzierten Seiten ohne individuelle Sorgfalt
und vor aehnlichen Regions-/Stadtseiten, die nur in denselben Funnel fuehren.

## 4. URL- und Seitenaktionsmatrix

| URL oder Kohorte | Rolle | Aktion jetzt | Begruendung | KPI / naechste Evidenz |
| --- | --- | --- | --- | --- |
| `/` | Marken- und Servicehub | keep | Klare sieben Pfeiler und Conversion-Wege | qualifizierte Serviceklicks und Anfragen |
| `/unterricht/` | P2-kommerzieller Pfeiler | strengthen selektiv | Hohe unterstuetzte Nachfrage; Profilbeleg bisher nur global verlinkt | Profilklicks, Probestunden, gestartete Unterrichtsverhaeltnisse |
| `/beerdigungen/` | sensibler P1-Pfeiler | strengthen, measure | Direkter Ablauf, Proof-Link und Anfrageweg vorhanden; hoechste Betreiberprioritaet | qualifizierte Traueranfragen |
| `/beerdigungen/trauermusik-buchen/` | buchungsnahe P1-Themenseite | strengthen | Eigenstaendiger Anfragejob, aber mechanische Keyword-Wiederholung | qualifizierte Anfragen, exklusive Queries, Formstarts |
| `/beerdigungen/musik-beerdigung/` | P1-Ablaufseite | strengthen umgesetzt | Datiert gestuetzte Nachfrage, keine frische P1-Sichtbarkeit, zuvor 25 mechanische Exact-Match-Nennungen | Indexierung, exklusive Queries, qualifizierte Anfragen |
| `/beerdigungen/musik-trauerfeier/` | P1-Zeremonieseite | strengthen umgesetzt | Eigenstaendiger Zeremonie-Intent, zuvor 24 mechanische Exact-Match-Nennungen | Indexierung, exklusive Queries, qualifizierte Anfragen |
| `/hochzeiten/` | P1-kommerzieller Pfeiler | strengthen | Hohe unterstuetzte Nachfrage; Audio-Proof sollte kontextuell erreichbar sein | Audio-Engagement und qualifizierte Hochzeitsanfragen |
| `/hochzeiten/hochzeitsmusik-buchen/` | buchungsnahe P1-Themenseite | strengthen | Eigenstaendiger Anfragejob, aber mechanische Keyword-Wiederholung | qualifizierte Anfragen, exklusive Queries, Formstarts |
| `/hochzeiten/musik-waehrend-trauung/` | informationsnahe Hochzeitsseite | keep, title fix | Eigener Ablauf-Intent; offensichtlicher Grossschreibungsfehler im Title | exklusive Queries und Klickrate |
| `/hochzeiten/musik-zur-trauung/` | P1-Zeremonieseite | strengthen umgesetzt | Datiert gestuetzte Nachfrage und eigener Einzug-/Ring-/Auszug-Job | CTR, exklusive Queries, qualifizierte Anfragen |
| `/hochzeiten/live-musik-hochzeit/` | P1-Liveformatseite | strengthen umgesetzt | Datiert gestuetzte Nachfrage und von Buchungsseite getrennter Konzept-Intent | CTR, exklusive Queries, assistierte Anfragen |
| `/hochzeiten/musik-standesamt/` | P1-Standesamtseite | strengthen umgesetzt | Eigenstaendiges kurzes Zeitfenster und klarer Zeremonie-Intent | CTR, Standesamt-Anfragen |
| `/firmenfeiern/` | B2B-Pfeiler | test | Eigenstaendiger Intent, aber keine aktuelle Nachfrage- oder Conversionmessung | B2B-Abfragen und qualifizierte Leads |
| `/geburtstage/`, `/taufen/`, `/konzerte/` | fokussierte Pfeiler | keep, test | Reale Angebote, kleinere oder gemischte Nachfrage | clusterreine Queries und qualifizierte Anfragen |
| `/portfolio/` | Proof | strengthen nach Faktenfreigabe | Audio und eine Stimme vorhanden; Live-Video/Fallbeispiele fehlen | Plays, Video, assistierte Anfragen |
| `/ueber-mich/` | Personen-/Expertise-Proof | keep | Sichtbare Ausbildung und Unterrichtspraxis | assistierte Probestunden und Brand Queries |
| 14 `/orte/`- und `/themen/`-Hubs | Discovery | keep | Sinnvolle browsebare Hierarchie | Crawl und relevante Child-Klicks |
| 72 lokale High-Risk-Seiten | lokaler Long Tail | test / evidence hold | Aehnlichkeit hoch, aber keine aktuelle Query-/Conversionbasis | GSC, Inquiry, Service-Area, Proof |
| Ringtausch/Ja-Wort/Nach-Ja-Wort | Themenfamilie | test | Hohe Intentnaehe, aber keine Query-Verteilung | exklusive Queries, Klicks, Anfragen |
| breite Trauermusik-Synonyme | Themenfamilie | merge candidate | Nahe zur Hauptleistung | Intentgleichheit und Gewinner-URL beweisen |
| Bratsche/Viola-Unterricht | Themenfamilie | test | Alltagssprache kann verschiedene Queries tragen | Query- und Probestundenvergleich |
| Redirects | Migration | keine Freigabe | Keine aktuelle Intent-, Link- und Conversionevidenz | erst nach dokumentiertem Merge |
| Noindex | Nutzseite ohne Suchrolle | keine Freigabe | Keine solche Seite aktuell eindeutig bewiesen | konkrete Nutzerrolle ohne Suchrolle |
| Remove | entbehrliche Seite | keine Freigabe | Page Count ist kein Beweis | null Nutzen, null Nachfrage, null Links und kein Ersatz |
| Neue Seiten | Expansion | aktuell keine | In den drei Prioritaetsclustern bestehen bereits 62 Themenseiten; neue Suchintention ist ohne frische Recherche nicht bewiesen | nur nach eigenstaendiger Query-/SERP- und Faktenevidenz |

### Arbeitslisten fuer die Query-zu-Seite-Zuordnung

Die Zahlen stammen aus dem datierten Repository-Export vom 13.06.2026 und sind
deshalb `Supported`, nicht frisch verifiziert. Nahe Varianten werden nicht
addiert.

| Liste | Keywordfamilie | gestuetztes Volumen | Gewinner-/Test-URL | Entscheidung |
| --- | --- | ---: | --- | --- |
| P1 Trauer und Beerdigung | Trauermusik | 1.600 | `/beerdigungen/` | Pillar behalten |
| P1 Trauer und Beerdigung | Musik Beerdigung / Musik fuer Beerdigung | 1.000 / 1.000 | `/beerdigungen/musik-beerdigung/` | eine URL fuer beide Sprachvarianten |
| P1 Trauer und Beerdigung | Musik fuer Trauerfeier / Musik Trauerfeier | 880 / 260 | `/beerdigungen/musik-trauerfeier/` | eine URL fuer den Zeremonie-Intent |
| P1 Hochzeit und Trauung | Hochzeitsmusik | 1.000 | `/hochzeiten/` | Pillar behalten |
| P1 Hochzeit und Trauung | Musik Hochzeit / Musik fuer Hochzeit | 590 / 590 | `/hochzeiten/` und kontrollierter Vergleich mit Liveformat | keine neue Synonymseite |
| P1 Hochzeit und Trauung | Live Musik Hochzeit | 260 | `/hochzeiten/live-musik-hochzeit/` | eigenstaendigen Liveformat-Job testen |
| P1 Hochzeit und Trauung | Musik zur Trauung | 170 | `/hochzeiten/musik-zur-trauung/` | Zeremonieablauf staerken |
| P1 Hochzeit und Trauung | Musik Standesamt / Hochzeitsmusik Standesamt | 140 / 110 | `/hochzeiten/musik-standesamt/` | eine Standesamt-URL |
| P2 Unterricht | Geigenunterricht | 1.600 | `/unterricht/geigenunterricht/` | bereits redaktionell final; keep |
| P2 Unterricht | Geige lernen | 720 | `/unterricht/geige-lernen/` | bereits redaktionell final; keep |
| P2 Unterricht | Geigenunterricht in der Naehe | 480 | bestehende lokale Kohorte | keine neuen Ortsvarianten |
| P2 Unterricht | Geigenunterricht Koeln | 90 frisch | `/unterricht/koeln/` | Position 19 schuetzen und messen |

### Contextter-Listen

Die drei vorgesehenen Listen heissen `P1 Trauer & Beerdigung`, `P1 Hochzeit &
Trauung` und `P2 Geigen- & Bratschenunterricht`. Sie wurden nicht aus dem
datierten Repository-Set angelegt: Der Auftrag bindet sie an erfolgreiche
frische Research-Candidates, und ein solcher Candidate-Satz existiert noch
nicht. Nach einem erfolgreichen Research-Lauf werden nur passende Candidates
importiert, die drei Listen angelegt und erst danach die vollstaendigen
Metrikpakete seriell fuer diese Keywords abgerufen.

## 5. Implementierte kleinste Charge

1. `/unterricht/` erhaelt einen kontextuellen Weg zur sichtbaren Ausbildung und
   Unterrichtspraxis auf `/ueber-mich/`.
2. `/hochzeiten/` erhaelt einen kontextuellen Weg zu den vorhandenen
   Viola-Hoerproben auf `/portfolio/`.
3. Das Course-JSON-LD behaelt nur belegte Kurs-, Provider- und Lerninhalte.
   Nicht bestaetigter Online-Unterricht, eine unvollstaendige 45-Minuten-Angabe
   und pauschale CourseInstance-Orte werden entfernt.
4. `/beerdigungen/trauermusik-buchen/` wird von mechanischen 24 auf sieben
   exakte Zielkeyword-Nennungen reduziert. Fragen, Ablaufcopy und Kontakttexte
   sprechen wieder ueber echte Entscheidungen statt ueber das Keyword selbst.
5. `/hochzeiten/hochzeitsmusik-buchen/` wird von 18 auf sieben exakte
   Zielkeyword-Nennungen reduziert; die Buchungs-, Timing- und Wunschliedfragen
   bleiben erhalten.
6. `/hochzeiten/musik-waehrend-trauung/` erhaelt einen grammatisch korrekten
   Title und eine korrigierte Kontaktueberschrift.
7. `/beerdigungen/musik-beerdigung/` erhaelt einen natuerlichen Title, eine
   konkrete Description, einen sensiblen H1 und nur noch zwei rohe
   Exact-Match-Nennungen statt 25.
8. `/beerdigungen/musik-trauerfeier/` trennt den Zeremonie-Intent sprachlich
   klarer von der gesamten Beerdigung und reduziert 24 auf zwei rohe
   Exact-Match-Nennungen.
9. `/hochzeiten/musik-zur-trauung/` beantwortet Einzug, Ringmoment und Auszug
   bereits in Title, Description und erstem Screen.
10. `/hochzeiten/live-musik-hochzeit/` spricht natuerlich ueber Live-Musik statt
    die ungrammatische Keywordfolge zu wiederholen; Exact Match sinkt von 13
    auf drei.
11. `/hochzeiten/musik-standesamt/` fokussiert das knappe Zeitfenster im
    Standesamt; Exact Match sinkt von 17 auf zwei.

Fokussierter Render-Proof: `/unterricht/`, `/unterricht/duesseldorf/` und
`/hochzeiten/` enthalten die erwarteten JSON-LD-Bloecke. `Course` bleibt als
wahrheitsgetreue Inhaltsbeschreibung erhalten; `courseMode`, `courseWorkload`
und `online` kommen nicht mehr vor. Beide neuen CTA-Texte und Ziele sind im
statischen HTML vorhanden.

Keine URL, kein Canonical, keine Index-Direktive und keine Sitemap wird in
dieser Charge geaendert. Es entstehen keine neuen Seiten.

Der unabhaengige Retry liefert keine neue belastbare Content-, Link- oder
Schema-Evidenz. Deshalb bleibt es bei dieser vorhandenen Charge; es wurde keine
weitere oeffentliche Seite veraendert.

## 6. 30-/60-/90-Tage-Roadmap

### Tage 1-30

- Contextter/GSC-Verbindung oder aktuellen 90-Tage-Page-x-Query-Export
  bereitstellen; Vorperiode vergleichbar erfassen.
- Inquiry-Attribution ab jetzt mit Landingpage, Service, Qualitaet und Outcome
  fuellen.
- Contextters Keyword-Admission reparieren: Neben den beiden
  `SOURCE_RESERVATION_INVALID`-Fehlern muss nun `CTX-INF-001` vor
  Operationserstellung reproduzierbar aufgeloest werden. Danach Research und
  Metriken mit denselben Idempotenzschluesseln strikt seriell ausfuehren, die
  drei benannten Listen nur aus erfolgreichen Candidates anlegen und bis dahin
  keine frischen Volumina behaupten.
- Die fuenf geaenderten P1-Seiten nach bestaetigtem Crawl mindestens sechs bis
  acht Wochen als Kohorte beobachten.
- Sechs zuletzt gecrawlte/nicht indexierte URLs und drei P1-Ortsseiten erneut
  nach aktuellem GSC-Stand pruefen.
- Alle zehn Offsite-Kandidaten als live, falsch, doppelt oder nicht vorhanden
  verifizieren; keine Massenverzeichnisse.

### Tage 31-60

- Die drei Prioritaetspfeiler mit freigegebenem servicebezogenem Proof staerken.
- Erste drei Rechte-/Faktenpakete aus dem Proof-Intake umsetzen: Hochzeit,
  sensibler Abschied oder sachlicher Prozessbeleg, Unterricht.
- Nur die hoechste messbare lokale Kohorte redaktionell bearbeiten; keine
  Aehnlichkeitskosmetik fuer alle 72 Hold-Seiten.
- Kontextuelle Links von Proof zur passenden Leistung und Anfrage ergaenzen.

### Tage 61-90

- Nach bestaetigtem Crawl und mindestens sechs bis acht Wochen die erste
  Synonymfamilie auswerten.
- Nur bei nachgewiesener Intentgleichheit Inhalte in eine Gewinner-URL mergen,
  dann 301, Sitemap und interne Links gemeinsam aendern.
- Reale Partner-/Verzeichnisnennungen nach Referral, qualifizierten Anfragen
  und Buchungen bewerten.
- Gewinner aus Proof-, Link- und Contentkohorten ausweiten; Verlierer mit
  dokumentierter Rueckrollregel stoppen.

## 7. Mess- und Freigabepunkte

- Technisch: Build, SEO-Audit, 487er CMS-/Route-/Sitemap-QA und Schema-Pruefung.
- Suche: indexierte Canonicals, Page-x-Query, Impressionen, Klicks, CTR und
  Position je vergleichbarem Zeitraum.
- Business: qualifizierte Anfrage, Buchung, Unterrichtsstart und geschaetzter
  Wert je Landingpage.
- Proof: Audio-/Video-Engagement und assistierte Anfrage.
- Authority: echte referring domains, Referral-Sessions und qualifizierte
  Anfragen; keine DR-/TF-Zahl als Erfolgsbeweis.

Ohne aktuellen GSC-/Conversion-Join bleiben Rankings, Kannibalisierung und
wirtschaftliche Gewinner `NOT PROVEN`. Das blockiert keine wahrheitswahrende
Content-, Link- oder Schema-Reparatur, aber jede URL-Migration.
