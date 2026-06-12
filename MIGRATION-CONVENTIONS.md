# Migration-Konventionen (für Subagenten)

Ziel: Die statischen HTML-Seiten aus `C:\Users\matth\Documents\KimMarieBorger\` werden 1:1 (pixelgenau, gleiche CSS-Klassen) in dieses Astro+TinaCMS-Projekt migriert. Inhalte werden in Tina-Blöcke modelliert, damit die Kundin Texte und Bilder visuell editieren kann.

## Quellen
- Extrahierte Inhalte: `C:\Users\matth\Documents\KimMarieBorger\_extract\content-extract.json` (pro Seite: Sektionen mit Typ + Feldern; Custom-Sektionen mit `rawHtml`).
- Original-HTML bei Unklarheiten: `C:\Users\matth\Documents\KimMarieBorger\<seite>.html` — das Original ist die Wahrheit.
- CSS (nur lesen, NIE ändern): `site/src/styles/kmb.css`.

## Harte Regeln
1. **Gemeinsame Dateien NICHT anfassen**: `Blocks.astro`, `tina/collections/page.ts`, `tina/config.ts`, `Base.astro`, `Header.astro`, `Footer.astro`, `kmb.css`, `kmb.js`, `data.ts`, `islands.ts`. Die Imports/Switch-Cases für eure Blöcke existieren bereits.
2. Jeder Agent bearbeitet NUR seine zugewiesenen Block-Dateien (`<name>.template.ts` + `<PascalName>.astro` in `src/components/blocks/`) und seine Seiten-Content-Dateien (`src/content/page/<slug>.mdx`). Die Dateien existieren als Stubs — vollständig überschreiben.
3. **CSS-Klassen und Markup-Struktur exakt aus dem Original/rawHtml übernehmen** — inklusive `reveal`/`d1`/`d2`-Klassen, Inline-Styles, SVGs (vollständig!), `loading="lazy" decoding="async"` auf Bildern. Keine eigenen Klassen oder Styles erfinden.
4. Bildpfade: Original `xyz.jpg` → `/uploads/xyz.jpg` (alle Bilder liegen schon in `public/uploads/`).
5. Interne Links: `xyz.html` → `/xyz`; `kim-marie-borger-viola.html` und `index-v2.html` → `/`.
6. Header/Nav/Footer/Kontakt-Sektion NICHT migrieren — global gelöst. Für die Kontakt-Sektion gibt es den Block `contactCard` (Felder: `bg`: 'none'|'paper2', optional `anchorId`).

## Template-Konventionen (`<name>.template.ts`)
- Export: `export const <name>BlockSchema: Template = { name: '<name>', label: '<Deutsches Label>', fields: [...] }`
- Deutsche Labels, `ui: { component: 'textarea' }` für längere Texte, Listen mit `ui: { itemProps: (item) => ({ label: item?.title ?? '…' }) }`.
- Bilder immer als Objekt: `{ type: 'object', name: 'image', fields: [{ type: 'image', name: 'src' }, { type: 'string', name: 'alt' }] }`.
- Texte mit beabsichtigten Zeilenumbrüchen (`<br>`) als ein Feld mit `\n` im Inhalt; Komponente rendert `\n` → `<br>`.
- Feldnamen: camelCase, GraphQL-kompatibel (keine Bindestriche).
- Inline-Auszeichnungen in Texten (z. B. `<b>Titel</b> Resttext`) in getrennte Felder zerlegen (z. B. `strong` + `text`), NICHT als HTML-String speichern.

## Komponenten-Konventionen (`<PascalName>.astro`)
```astro
---
import { tinaField } from '@tinacms/astro/tina-field';

const { data } = Astro.props;
const items = (data.items ?? []).filter((i: unknown) => i !== null);
---
<section class="…exakt wie Original…">
	…
</section>
```
- Kein Props-Interface, `data` untypisiert verwenden (Tina-Typen werden später generiert).
- `data-tina-field={tinaField(data, 'feldname')}` auf JEDEM Text-Element und Bild; bei Listenelementen `data-tina-field={tinaField(item)}` auf dem Element-Wrapper.
- Mehrzeilige Titel: `{(data.title ?? '').split('\n').map((line, i) => (<Fragment>{i > 0 && <br />}{line}</Fragment>))}`
- Optionale Felder mit `{data.x && …}` absichern.
- Referenz-Beispiele ansehen: `Cards.astro`, `Solemn.astro`, `Split.astro`, `Timeline.astro` + zugehörige Templates.

## Content-Konventionen (`src/content/page/<slug>.mdx`)
- Nur YAML-Frontmatter, kein Body. Aufbau wie `home.mdx` / `hochzeiten.mdx` (Referenz ansehen!).
- Pflichtfelder: `seoTitle` (aus `<title>`), `seoDescription` (aus Meta-Description), `bodyClass` (nur wenn das Original eine body-Klasse hat, z. B. `page-taufe`).
- `blocks:`-Liste in Original-Reihenfolge; jedes Item endet mit `_template: <name>`.
- Mehrzeilige Strings: `|-` (Umbrüche erhalten) oder `>-` (Fließtext). Typografische Zeichen („ “ — ’ · …) exakt erhalten.
- Vorhandene Shared-Blöcke nutzen, wo die Extraktion sie ausweist: `heroPage`, `split`, `statement`, `cards`, `solemn`, `collage`, `faq`, `timeline`, `setlist`, `contactCard`, `quote`. Deren Felder stehen in den jeweiligen `*.template.ts`.
- `split`-Varianten: `figureClass` (z. B. `circle`, `cut`, `sharp`, `soft-corner`), `aspect` (z. B. `4/5`, `3/4`), `imageFirst`, `secondImage` (twin), `lede`, `seal`, `ctas`.
- FAQ: erste Frage im Original hat meist `open` → `open: true`.

## Abnahme pro Seite
- Alle Sektionen des Originals (außer Nav/Footer/Kontakt) sind als Blöcke in der .mdx abgebildet, Reihenfolge stimmt, `contactCard` an der richtigen Position mit richtigem `bg`.
- Jeder sichtbare Text/jedes Bild ist über Tina editierbar (Feld vorhanden, tinaField gesetzt).
- Keine TypeScript-/Astro-Syntaxfehler (`(item: any)` für map-Parameter verwenden, damit kein implizites any).
