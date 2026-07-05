import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/seo-pages');
const PAGE_DIR = path.resolve('src/content/page');
const BASE_URL = 'https://kim-marie-borger.com';
const PRIORITY_RANK = { P1: 0, P2: 1, P3: 2 };
const PRIORITY_SCORE = { P1: 30, P2: 20, P3: 10 };
const AUTO_PHRASES = [
	'verandert den ton der seite',
	'ubungen, pausen oder kontaktangaben',
	'redaktionell bleibt diese seite',
	'diese seite unterscheidet sich',
	'diese seite trennt',
	'der kern von',
	'nicht zu allgemein bleiben',
];

const args = new Map(
	process.argv.slice(2)
		.filter((arg) => arg.startsWith('--'))
		.map((arg) => {
			const [key, ...value] = arg.slice(2).split('=');
			return [key, value.join('=') || 'true'];
		}),
);

const gscFile = args.get('gsc-file') ?? process.env.GSC_FILE ?? '';

if (!gscFile || !existsSync(gscFile)) {
	console.error('Usage: npm run audit:gsc-indexing -- --gsc-file="C:/path/to/search-console-export.txt"');
	process.exit(1);
}

function normalizeRoute(value) {
	if (!value) return '';
	try {
		const url = value.startsWith('http') ? new URL(value) : new URL(value, BASE_URL);
		if (url.hostname !== 'kim-marie-borger.com') return '';
		if (url.pathname === '/') return '/';
		return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
	} catch {
		return '';
	}
}

function normalizeText(value) {
	return String(value ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.toLowerCase();
}

function wordCount(value) {
	return (String(value ?? '').match(/[A-Za-zÄÖÜäöüß0-9]+/g) ?? []).length;
}

function readJson(file) {
	return JSON.parse(readFileSync(file, 'utf8'));
}

function loadSeoDocs() {
	const docs = new Map();
	if (!existsSync(CONTENT_DIR)) return docs;

	for (const service of readdirSync(CONTENT_DIR)) {
		const serviceDir = path.join(CONTENT_DIR, service);
		for (const fileName of readdirSync(serviceDir).filter((file) => file.endsWith('.json'))) {
			const file = path.join(serviceDir, fileName);
			const doc = readJson(file);
			const route = normalizeRoute(doc.route);
			if (!route) continue;
			const text = JSON.stringify(doc);
			const normalized = normalizeText(text);
			const autoPhraseHits = AUTO_PHRASES.filter((phrase) => normalized.includes(phrase));
			docs.set(route, {
				route,
				file,
				service: doc.serviceSlug,
				pageKind: doc.pageKind,
				pageSlug: doc.pageSlug,
				priority: doc.priority ?? 'P3',
				status: doc.status ?? '',
				enabled: doc.enabled !== false,
				words: wordCount(text),
				autoPhraseHits,
				title: doc.seoTitle ?? '',
			});
		}
	}

	return docs;
}

function loadStaticRoutes() {
	const routes = new Set(['/']);
	if (existsSync(PAGE_DIR)) {
		for (const fileName of readdirSync(PAGE_DIR).filter((file) => file.endsWith('.mdx'))) {
			const slug = fileName.replace(/\.mdx$/, '');
			routes.add(slug === 'home' ? '/' : `/${slug}/`);
		}
	}
	for (const service of readdirSync(CONTENT_DIR).filter((name) => !name.startsWith('.'))) {
		routes.add(`/${service}/orte/`);
		routes.add(`/${service}/themen/`);
	}
	routes.add('/ratgeber/');
	return routes;
}

function parseGscText(file) {
	const lines = readFileSync(file, 'utf8')
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
	const firstTitle = lines.find((line) => !line.startsWith('http')) ?? 'Search Console export';
	const entries = [];

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		if (!/^https?:\/\/kim-marie-borger\.com\//i.test(line)) continue;
		const route = normalizeRoute(line);
		const crawled = /^https?:\/\//i.test(lines[index + 1] ?? '') ? '' : (lines[index + 1] ?? '');
		entries.push({
			url: line,
			route,
			crawled,
			neverCrawled: /nicht zutreffend/i.test(crawled),
		});
	}

	return { issueTitle: firstTitle, entries };
}

function classifyRoute(route, docs, staticRoutes) {
	if (docs.has(route)) return 'seo-detail';
	if (staticRoutes.has(route)) return 'static-or-hub';
	return 'unknown';
}

function groupCount(rows, keyFn) {
	const counts = new Map();
	for (const row of rows) {
		const key = keyFn(row) || '(none)';
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function attentionScore(entry, doc) {
	if (!doc) return entry.neverCrawled ? 1 : 80;
	const priority = PRIORITY_SCORE[doc.priority] ?? 5;
	const review = /review-needed|risk/i.test(doc.status) ? 10 : 0;
	const auto = doc.autoPhraseHits.length * 12;
	const crawled = entry.neverCrawled ? 0 : 100;
	const lowCopy = doc.words < 950 ? 8 : 0;
	return crawled + priority + review + auto + lowCopy;
}

function printTable(rows, columns) {
	for (const row of rows) {
		console.log(columns.map((column) => String(row[column] ?? '')).join('\t'));
	}
}

const docs = loadSeoDocs();
const staticRoutes = loadStaticRoutes();
const { issueTitle, entries } = parseGscText(gscFile);
const uniqueEntries = [...new Map(entries.map((entry) => [entry.route, entry])).values()];
const enriched = uniqueEntries.map((entry) => {
	const doc = docs.get(entry.route);
	const type = classifyRoute(entry.route, docs, staticRoutes);
	return {
		...entry,
		type,
		doc,
		service: doc?.service ?? entry.route.split('/').filter(Boolean)[0] ?? '/',
		priority: doc?.priority ?? '',
		status: doc?.status ?? '',
		pageKind: doc?.pageKind ?? '',
		words: doc?.words ?? '',
		autoPhraseHits: doc?.autoPhraseHits.length ?? 0,
		score: attentionScore(entry, doc),
	};
});

const known = enriched.filter((row) => row.type !== 'unknown');
const seoDetails = enriched.filter((row) => row.type === 'seo-detail');
const neverCrawled = enriched.filter((row) => row.neverCrawled);
const crawled = enriched.filter((row) => !row.neverCrawled);

console.log('GSC indexing audit');
console.log(`- source: ${gscFile}`);
console.log(`- issue: ${issueTitle}`);
console.log(`- URLs: ${uniqueEntries.length}`);
console.log(`- known local routes: ${known.length}/${uniqueEntries.length}`);
console.log(`- SEO detail pages: ${seoDetails.length}`);
console.log(`- never crawled: ${neverCrawled.length}`);
console.log(`- crawled with date/status: ${crawled.length}`);

console.log('\nBy service');
printTable(
	groupCount(enriched, (row) => row.service).map(([service, count]) => ({ service, count })),
	['service', 'count'],
);

console.log('\nBy type');
printTable(
	groupCount(enriched, (row) => row.type).map(([type, count]) => ({ type, count })),
	['type', 'count'],
);

console.log('\nSEO detail priorities');
printTable(
	groupCount(seoDetails, (row) => row.priority)
		.sort((a, b) => (PRIORITY_RANK[a[0]] ?? 9) - (PRIORITY_RANK[b[0]] ?? 9))
		.map(([priority, count]) => ({ priority, count })),
	['priority', 'count'],
);

console.log('\nHighest-attention URLs');
const attentionRows = [...enriched]
	.sort((a, b) => b.score - a.score || (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9) || a.route.localeCompare(b.route))
	.slice(0, Number(args.get('limit') ?? 40))
	.map((row) => ({
		route: row.route,
		type: row.type,
		priority: row.priority,
		pageKind: row.pageKind,
		words: row.words,
		autoPhraseHits: row.autoPhraseHits,
		crawled: row.crawled || 'n/a',
		status: row.status,
	}));
printTable(attentionRows, ['route', 'type', 'priority', 'pageKind', 'words', 'autoPhraseHits', 'crawled', 'status']);

const autoPhraseRows = seoDetails
	.filter((row) => row.doc?.autoPhraseHits.length)
	.sort((a, b) => b.doc.autoPhraseHits.length - a.doc.autoPhraseHits.length || a.route.localeCompare(b.route))
	.slice(0, 20);

if (autoPhraseRows.length > 0) {
	console.log('\nAutomatic-phrase cleanup candidates');
	for (const row of autoPhraseRows) {
		console.log(`${row.route}\t${row.doc.autoPhraseHits.join(', ')}`);
	}
}
