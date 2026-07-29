# No-GSC-Deploy-Bereitschaft – 29.07.2026

Status: **lokal geprüft, noch nicht veröffentlicht**

## Ohne neue GSC-Daten umgesetzt

- Die zehn zuvor im strengen Tracker auffälligen Unterrichts-Themenseiten wurden
  manuell nach eigener Nutzeraufgabe, eigenem Aufbau, eigenen FAQs und passender
  Anfrage differenziert.
- Die 72 verbleibenden strengen High-Risk-Ortsseiten wurden nicht künstlich mit
  austauschbaren Ortsdetails umgeschrieben. Sie besitzen jetzt einen expliziten
  Evidenz-Hold und bleiben bis zu einer belastbaren Entscheidung indexierbar,
  in der Sitemap und selbstkanonisch.
- Der Detailseiten-Tracker unterscheidet nun zwischen `hold-for-evidence` und
  tatsächlicher redaktioneller Fertigstellung.
- Die öffentliche Copy-Bereinigung meldet null ausstehende Dateien.
- Der lokale Tina/Astro-Build sowie der lokale und Vercel-statische SEO-Output
  wurden frisch erzeugt.
- Strategie, Kohortenbericht und nächster Messschritt wurden aktualisiert.

## Frische Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| `npm run check` | 0 Fehler, 0 Warnungen, 0 Hinweise |
| `npm run build:local` | erfolgreich |
| `npm run qa:seo-pages:dist` | 487/487 Dokumente, Routen, Sitemap-Einträge und Tina-Marker; 0 Fehler |
| `npm run qa:seo-pages:vercel` | 487/487 Dokumente, Routen, Sitemap-Einträge und Tina-Marker; 0 Fehler |
| `npm run audit:seo:dist` | 0 Fehler, 0 Warnungen auf 524 HTML-Seiten |
| `npm run audit:seo:vercel` | 0 Fehler, 0 Warnungen auf 524 HTML-Seiten |
| `npm run tracker:seo-pages` | 487 Zeilen; 72 High Risk, alle `hold-for-evidence` |
| `npm run tracker:local-seo` | 343 Ortsseiten; 155 High, 130 Medium, 58 Low nach der breiteren lokalen Metrik |
| `npm run seo:clean-public-copy -- --dry-run` | 0 ausstehende Dateien |

## Bewusst nicht ohne neue Evidenz verändert

- keine 301-Weiterleitungen, Cross-Canonicals, `noindex`-Entscheidungen oder
  Sitemap-Entfernungen,
- keine Ortsseiten-Priorisierung nach vermuteter Wirtschaftlichkeit,
- keine erfundenen Venue-, Auftritts-, Reisegebiets- oder Verfügbarkeitsaussagen,
- keine neuen Fallbeispiele, Rezensionen, Videos oder Ortsbelege ohne reale
  Assets, Einwilligung und Nutzungsrechte,
- keine Ranking- oder Indexierungsbehauptung für diesen noch unveröffentlichten
  Batch.

## Noch benötigte externe Inputs

1. GSC Pages und Queries für 90 Tage sowie den Vergleichszeitraum.
2. Landingpage-Zuordnung tatsächlicher Anfragen und Buchungen.
3. Bestätigtes Einsatzgebiet und geschäftliche Bedingungen je Leistungsart.
4. Freigegebene Fotos, Videos, Referenzen, Rezensionen und Fallbeispiele.

Erst diese Daten rechtfertigen Gewinner-URLs, kleine Redirect-Kohorten oder eine
Priorisierung einzelner Orte.
