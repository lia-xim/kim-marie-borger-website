import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TRACKER_FILE = path.resolve('seo/seo-page-tracker.csv');
const CONTENT_DIR = path.resolve('src/content/seo-pages');
const REPORT_FILE = path.resolve('seo/local-evidence-hold-cohort-2026-07-29.md');
const STATUS = 'manual-local-hold-for-evidence-2026-07-29';
const EXPECTED_COHORT_SIZE = 72;
const NOTE = [
	'Local Evidence Hold 2026-07-29:',
	'Die URL bleibt indexierbar und selbstkanonisch, weil ohne aktuelle GSC- und Anfrage-Daten keine belastbare Zusammenlegung, Weiterleitung oder Deindexierung entschieden werden kann.',
	'Bis reale lokale Belege, bestätigtes Einsatzgebiet oder seitenspezifische Nachfrage vorliegen, werden keine zusätzlichen Ortsbehauptungen erfunden.',
].join(' ');

function parseCsv(source) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;

	for (let index = 0; index < source.length; index += 1) {
		const character = source[index];
		const next = source[index + 1];

		if (character === '"' && quoted && next === '"') {
			field += '"';
			index += 1;
		} else if (character === '"') {
			quoted = !quoted;
		} else if (character === ',' && !quoted) {
			row.push(field);
			field = '';
		} else if ((character === '\n' || character === '\r') && !quoted) {
			if (character === '\r' && next === '\n') index += 1;
			row.push(field);
			field = '';
			if (row.some((value) => value !== '')) rows.push(row);
			row = [];
		} else {
			field += character;
		}
	}

	if (field !== '' || row.length > 0) {
		row.push(field);
		rows.push(row);
	}

	const [headers, ...dataRows] = rows;
	return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

if (!existsSync(TRACKER_FILE)) {
	throw new Error(`Missing tracker input: ${TRACKER_FILE}`);
}

const cohort = parseCsv(readFileSync(TRACKER_FILE, 'utf8'))
	.filter((row) => row.page_kind === 'local' && row.risk === 'high')
	.sort((left, right) => left.service.localeCompare(right.service) || left.url.localeCompare(right.url));

if (cohort.length !== EXPECTED_COHORT_SIZE) {
	throw new Error(
		`Expected ${EXPECTED_COHORT_SIZE} high-risk local pages from the reviewed tracker snapshot, found ${cohort.length}. `
		+ 'Review the current cohort before changing editorial statuses.',
	);
}

for (const row of cohort) {
	const documentFile = path.join(CONTENT_DIR, row.service, `${row.slug}.json`);
	if (!existsSync(documentFile)) throw new Error(`Missing content document for ${row.url}: ${documentFile}`);

	const document = JSON.parse(readFileSync(documentFile, 'utf8'));
	document.status = STATUS;
	const existingNotes = String(document.editorNotes ?? '').trim();
	if (!existingNotes.includes('Local Evidence Hold 2026-07-29:')) {
		document.editorNotes = existingNotes ? `${existingNotes}\n\n${NOTE}` : NOTE;
	}
	writeFileSync(documentFile, `${JSON.stringify(document, null, 2)}\n`);
}

const byService = new Map();
for (const row of cohort) {
	byService.set(row.service, [...(byService.get(row.service) ?? []), row]);
}

const report = [
	'# Local Evidence Hold – 29.07.2026',
	'',
	`Status: **${cohort.length} lokale URLs bewusst gehalten, nicht künstlich umgeschrieben.**`,
	'',
	'## Entscheidung',
	'',
	'Diese Seiten bleiben vorerst indexierbar, in der Sitemap und mit Self-Canonical. Der technische Ähnlichkeits-Tracker bewertet sie als hohes Überschneidungsrisiko. Ohne aktuelle Suchanfragen, Landingpage-Leads und bestätigte lokale Belege wäre eine Zusammenlegung, Weiterleitung oder Deindexierung dennoch eine unbelegte Entscheidung.',
	'',
	'Der Status `manual-local-hold-for-evidence-2026-07-29` bedeutet daher nicht „fertig differenziert“, sondern „bewusst bis zu besserer Evidenz unverändert halten“. Öffentliche Ortsdetails werden nicht ergänzt, nur damit ein Ähnlichkeitswert sinkt.',
	'',
	'## Benötigte Evidenz für die nächste Entscheidung',
	'',
	'- GSC: Impressionen, Klicks, Suchanfragen und durchschnittliche Position je URL.',
	'- Anfragen: tatsächlich genannte Stadt sowie die Landingpage der Anfrage.',
	'- Geschäftlicher Rahmen: bestätigtes Einsatzgebiet, Anfahrtslogik und gegebenenfalls Mindestbedingungen.',
	'- Reale Belege: Auftritte, Fotos, Videos oder freigegebene Referenzen mit belastbarem Ortsbezug.',
	'',
	'## Entscheidungsregel',
	'',
	'- Relevante Nachfrage oder echte Leads: URL behalten und mit realen Belegen stärken.',
	'- Keine eigene Nachfrage, aber klare Überschneidung mit einer stärkeren URL: Merge und 301-Weiterleitung prüfen.',
	'- Suchintention unterscheidet sich, aber Beleg fehlt: erst Beleg sammeln, dann redaktionell ausbauen.',
	'- Keine Nachfrage und kein tragfähiger eigener Nutzen: aus Sitemap nehmen und konsolidieren; nicht pauschal aufgrund eines einzelnen Crawl-Status.',
	'',
	'## Kohorte',
	'',
	...Array.from(byService.entries()).flatMap(([service, rows]) => [
		`### ${service}`,
		'',
		...rows.map((row) => `- [${row.url}](${row.url}) – ${row.priority}; vorher: \`${row.editor_status}\`; ähnlichste URL: ${row.nearest_content_url} (${row.nearest_content_similarity})`),
		'',
	]),
	'## Ausführung',
	'',
	'Erzeugt aus dem geprüften Tracker-Snapshot mit:',
	'',
	'```bash',
	'npm run seo:classify-local-hold',
	'```',
	'',
].join('\n');

mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
writeFileSync(REPORT_FILE, report);

console.log(`Marked ${cohort.length} local pages as ${STATUS}.`);
console.log(`Wrote ${path.relative(process.cwd(), REPORT_FILE)}.`);
