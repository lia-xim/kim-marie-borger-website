# Kim Marie Borger · Viola — Website

Astro 6 + TinaCMS (visuelles Editing) + Vercel. Migriert aus dem statischen
HTML-Design-Export (`../`-Verzeichnis), pixelgenau auf Basis von `kmb.css`.

## Open Source

Der Quellcode ist öffentlich und unter MIT lizenziert. Inhalte, Fotos,
generierte Bilder, Audio, Branding und SEO-Recherche sind davon ausgenommen und
bleiben bei Kim Marie Borger bzw. den jeweiligen Rechteinhabern. Details:
`LICENSE` und `CONTENT-LICENSE.md`.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Dev-Server + Tina-Editor: http://localhost:4321 · Editor: http://localhost:4321/admin/index.html |
| `npm run build` | Produktions-Build mit Tina Cloud (braucht Env-Variablen) |
| `npm run build:local` | Produktions-Build ohne Cloud (Inhalte aus dem Repo, /admin aus) |
| `npm run build:vercel` | Wird von Vercel genutzt — wählt automatisch Cloud/Local je nach Env |
| `npm run audit:prod` | Security-Audit der produktiven Dependency-Kette |
| `npm run optimize:images` | Neue Bilder in `public/uploads` webtauglich verkleinern |

## Architektur

- **Inhalte**: `src/content/page/*.mdx` (eine Datei pro Seite, YAML-Blöcke) und
  `src/content/config/config.json` (global: Marke, Kontakt-Box, Footer, SEO).
  Inhalte leben im Repo — Tina committet Änderungen nach Git.
- **Blöcke**: `src/components/blocks/` — pro Block ein Tina-Schema
  (`*.template.ts`) + eine Astro-Komponente. Registriert in
  `tina/collections/page.ts` und `Blocks.astro`.
- **Visuelles Editing**: `@tinacms/astro` (React-frei). Islands in
  `src/lib/islands.ts`, Route `src/pages/tina-island/[name].ts`.
  Klick-Ziele via `data-tina-field`. Scroll-Animationen werden im Edit-Modus
  automatisch deaktiviert (`TINA_EDIT` in `src/scripts/kmb.js`).
- **Design**: `src/styles/kmb.css` ist die 1:1 übernommene Design-Quelle —
  nicht umschreiben. Fonts self-hosted via @fontsource (DSGVO).
- **Kontaktformular**: POST `/api/contact` (Vercel Function) → Resend.

## Tina Cloud verbinden (einmalig, ~10 Minuten)

1. Repo auf GitHub pushen (falls noch nicht geschehen).
2. Auf https://app.tina.io kostenloses Konto anlegen → **New Project** →
   GitHub-Repo auswählen (Branch `main`).
3. Im Tina-Dashboard kopieren: **Client ID** und einen **Content Token (Read Only)**.
4. In Vercel → Project → Settings → Environment Variables eintragen:
   - `PUBLIC_TINA_CLIENT_ID` = Client ID
   - `TINA_TOKEN` = Token
   - `SITE_URL` = finale Domain (z. B. `https://www.kim-marie-borger.de`)
5. Neu deployen. Ab dann: **`<domain>/admin`** öffnen, mit Tina Cloud einloggen,
   visuell editieren. Jede Speicherung = Git-Commit = automatisches Deployment
   (~1–2 Min bis live).
6. Editorin einladen: app.tina.io → Project → Collaborators (Free-Plan: 2 User).

## Echte Hörproben einbinden (Audio)

1. Master-Aufnahmen (WAV/AIFF/FLAC — beste verfügbare Qualität) in den Ordner
   `audio-src/` legen (liegt im Repo-Root, wird nicht committet).
2. `npm run optimize:audio` — normalisiert die Lautheit nach Streaming-Standard
   (EBU R128, −14 LUFS, True Peak −1 dB) und erzeugt MP3 320 kbps in
   `public/uploads/audio/`. 320 kbps ist für Musik praktisch transparent und
   läuft in jedem Browser; eine 4-Minuten-Aufnahme ≈ 9–10 MB.
3. Im CMS (Portfolio → Hörproben-Block) beim jeweiligen Stück den Pfad
   eintragen: `/uploads/audio/<name>.mp3`. Tracks ohne Pfad spielen weiterhin
   die synthetische Klangskizze.
4. Committen/deployen — die Dauer wird automatisch aus der Datei gelesen,
   wenn das Feld leer bleibt. Audio wird mit den `/uploads`-Cache-Headern
   ausgeliefert und per `preload="metadata"` erst bei Klick geladen.

## Kontaktformular scharf schalten

1. Konto auf https://resend.com (Free: 100 Mails/Tag), Domain verifizieren.
2. Vercel-Env-Variablen: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `CONTACT_FROM_EMAIL` (z. B. `Website <anfrage@kim-marie-borger.de>`).
3. Ohne Konfiguration zeigt das Formular automatisch einen Hinweis auf die
   direkte E-Mail-Adresse — es bricht nie hart.

## SEO

Automatisch: Sitemap (`/sitemap-index.xml`), `robots.txt`, Canonical-URLs,
OG/Twitter-Meta (Bild = Hero der Seite), JSON-LD (Person + WebSite global,
FAQPage auf Seiten mit FAQ-Block), `og:locale de_DE`. Pro Seite pflegbar:
`seoTitle` + `seoDescription` in Tina („Seiten“-Collection).

## Security

- Keine echten Secrets committen. `.env.example` dokumentiert die nötigen
  Variablen; lokale Vercel- und dotenv-Dateien sind per `.gitignore`
  ausgeschlossen.
- Vor Veröffentlichungen `npm run build:local` und `npm run audit:prod`
  ausführen.
- Dependabot ist für npm-Abhängigkeiten aktiv. Der volle `npm audit` kann
  zusätzlich dev-only Meldungen aus lokalen CMS-/Language-Server-Tools zeigen;
  produktive Abhängigkeiten sollen mit `npm run audit:prod` sauber bleiben.
- Falls `npm run audit:prod` eine `esbuild`-Meldung über Astro/Vite/Tina zeigt:
  zuerst auf neue Astro/Vite/Tina-Versionen aktualisieren und den Build prüfen.
  Ein pauschales Override auf `esbuild@0.28.x` bricht aktuell den Tina-Build.

## Troubleshooting: Build-Fehler „local GraphQL schema doesn't match remote“

Nach einer Schema-Änderung (Felder in `*.template.ts` / `tina/collections/*`)
muss `tina/tina-lock.json` mit committet werden — und das Lock wird **nur von
`npm run dev` regeneriert**, nicht von `tinacms build`. Workflow also: Schema
ändern → einmal `npm run dev` starten (3 Sekunden reichen) → Lock-Änderung mit
committen. Der Vercel-Build retried zusätzlich automatisch (smart-build),
falls Tina Cloud den neuen Commit noch nicht fertig indexiert hat.

## Troubleshooting: Deployment „BLOCKED“ (COMMIT_AUTHOR_REQUIRED)

Vercel (Pro/Team) blockiert Deployments, deren Git-Commit-Autor keinem
GitHub-User mit Projektzugriff zugeordnet werden kann — das Deployment hängt
dann scheinbar ewig in der Queue (CLI zeigt „UNKNOWN“; die API verrät
`readyState: BLOCKED`). Deshalb ist der Commit-Autor in diesem Repo lokal auf
die GitHub-noreply-Adresse des Accounts gesetzt (`git config user.email`).
Falls später Tina-Cloud-Commits blockiert werden: im Vercel-Dashboard das
blockierte Deployment öffnen (zeigt den Grund) und die Autor-E-Mail dem Team
hinzufügen bzw. in Tina Cloud die Commit-E-Mail auf eine zugeordnete Adresse
stellen.

## Offene Punkte (bewusst)

- **Impressum & Datenschutz** sind technisch hinterlegt, müssen vor Live-Gang
  aber final rechtlich geprüft und ggf. um vollständige Angaben ergänzt werden.
- Gästezitat auf Start/Über-mich ist als Platzhalter markiert.
- Portfolio: Audio-Player spielt synthetische Klangskizzen (wie im Original);
  echte Aufnahmen + YouTube-ID können später ergänzt werden.
