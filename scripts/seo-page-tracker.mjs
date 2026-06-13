import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');
const CONTENT_DIR = path.resolve('src/content/seo-pages');
const OUT_DIR = path.resolve('seo');
const CSV_FILE = path.join(OUT_DIR, 'seo-page-tracker.csv');
const REPORT_FILE = path.join(OUT_DIR, 'seo-page-tracker.md');

const SERVICES = ['hochzeiten', 'beerdigungen', 'firmenfeiern', 'geburtstage', 'taufen', 'konzerte', 'unterricht'];
const LOCAL_SLUGS = new Set([
	'duesseldorf', 'erkrath', 'ratingen', 'koeln', 'essen', 'dortmund', 'duisburg', 'bochum',
	'wuppertal', 'leverkusen', 'oberhausen', 'krefeld', 'moenchengladbach', 'moers',
	'gelsenkirchen', 'bergisch-gladbach', 'solingen', 'remscheid', 'mettmann', 'hilden',
	'dormagen', 'neuss', 'meerbusch', 'haan', 'langenfeld', 'monheim-am-rhein', 'velbert',
	'wuelfrath', 'heiligenhaus', 'muelheim-an-der-ruhr', 'bottrop', 'herne', 'hagen',
	'aachen', 'bonn', 'muenster', 'bielefeld', 'paderborn', 'siegen', 'iserlohn', 'unna',
	'recklinghausen', 'rhein-kreis-neuss', 'kreis-mettmann', 'rheinland', 'ruhrgebiet',
	'rhein-ruhr', 'bergisches-land', 'nordrhein-westfalen',
]);

const STOPWORDS = new Set([
	'aber', 'alle', 'als', 'also', 'am', 'an', 'auch', 'auf', 'aus', 'bei', 'beim', 'bis',
	'das', 'dass', 'dem', 'den', 'der', 'des', 'die', 'dies', 'diese', 'dieser', 'ein',
	'eine', 'einem', 'einen', 'einer', 'eines', 'es', 'fuer', 'ganz', 'gern', 'hat',
	'hier', 'im', 'in', 'ist', 'mit', 'nach', 'nicht', 'noch', 'nur', 'ob', 'oder',
	'ohne', 'sehr', 'so', 'und', 'vom', 'von', 'vor', 'was', 'wenn', 'wie', 'wird',
	'zu', 'zum', 'zur',
]);

if (!existsSync(DIST)) {
	console.error('dist/client not found. Run npm run build:local first.');
	process.exit(1);
}

function walk(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

function routeFromFile(file) {
	return `/${path.relative(DIST, file).replace(/\\/g, '/').replace(/index.html$/, '')}`;
}

function decodeHtml(value) {
	return String(value ?? '')
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function stripHtml(value) {
	return decodeHtml(value)
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<head[\s\S]*?<\/head>/gi, ' ')
		.replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
		.replace(/<section\b(?=[^>]*\blocal-seo-links\b)[\s\S]*$/i, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function attr(tag, name) {
	const match = tag.match(new RegExp(`\\s${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i'));
	return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function normalizeText(value) {
	return decodeHtml(value)
		.toLowerCase()
		.replace(/ß/g, 'ss')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&/g, ' und ')
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function tokens(value) {
	return normalizeText(value)
		.split(' ')
		.filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function shingleSet(sourceTokens, size = 5) {
	if (sourceTokens.length <= size) return new Set(sourceTokens);
	const shingles = new Set();
	for (let index = 0; index <= sourceTokens.length - size; index += 1) {
		shingles.add(sourceTokens.slice(index, index + size).join(' '));
	}
	return shingles;
}

function jaccard(a, b) {
	if (!a.size && !b.size) return 1;
	if (!a.size || !b.size) return 0;
	const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
	let overlap = 0;
	for (const item of smaller) if (larger.has(item)) overlap += 1;
	return overlap / (a.size + b.size - overlap);
}

function tokenProfile(sourceTokens) {
	const counts = new Map();
	for (const token of sourceTokens) counts.set(token, (counts.get(token) ?? 0) + 1);
	return { counts, total: sourceTokens.length };
}

function tokenDice(a, b) {
	if (!a.total && !b.total) return 1;
	if (!a.total || !b.total) return 0;
	let overlap = 0;
	const [smaller, larger] = a.counts.size <= b.counts.size ? [a.counts, b.counts] : [b.counts, a.counts];
	for (const [token, count] of smaller) overlap += Math.min(count, larger.get(token) ?? 0);
	return (2 * overlap) / (a.total + b.total);
}

function csvEscape(value) {
	const text = value === null || value === undefined ? '' : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

function normalizePath(href) {
	if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return '';
	try {
		const url = new URL(href, 'https://kim-marie-borger.com');
		if (url.origin !== 'https://kim-marie-borger.com') return '';
		return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
	} catch {
		return '';
	}
}

function linksFromHtml(html) {
	return [...html.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)]
		.map((match) => normalizePath(match[1] ?? match[2] ?? match[3] ?? ''))
		.filter(Boolean);
}

function faqCount(html) {
	return [...html.matchAll(/<details\b/gi)].length;
}

function imageAltStats(html) {
	const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => ({
		src: attr(match[0], 'src'),
		alt: attr(match[0], 'alt'),
		decorative: /aria-hidden=(?:"true"|'true'|true)/i.test(match[0])
			|| /role=(?:"presentation"|'presentation'|presentation)/i.test(match[0]),
	}));
	const contentImages = images.filter((image) => image.src && image.src.includes('/uploads/') && !image.decorative);
	return {
		imageCount: contentImages.length,
		emptyAltCount: contentImages.filter((image) => !image.alt).length,
		uniqueAltCount: new Set(contentImages.map((image) => image.alt).filter(Boolean)).size,
	};
}

function readOverride(service, slug) {
	const file = path.join(CONTENT_DIR, service, `${slug}.json`);
	if (!existsSync(file)) return { exists: false, data: null, file };
	try {
		return { exists: true, data: JSON.parse(readFileSync(file, 'utf8')), file };
	} catch {
		return { exists: true, data: null, file };
	}
}

function formatPercent(value) {
	return `${Math.round(value * 1000) / 10}%`;
}

function average(values) {
	return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function groupBy(values, keyFn) {
	const groups = new Map();
	for (const value of values) {
		const key = keyFn(value);
		groups.set(key, [...(groups.get(key) ?? []), value]);
	}
	return groups;
}

const htmlFiles = walk(DIST).filter((file) => file.endsWith('index.html') && !file.includes(`${path.sep}admin${path.sep}`));
const htmlByRoute = new Map(htmlFiles.map((file) => [routeFromFile(file), readFileSync(file, 'utf8')]));
const sitemapXml = walk(DIST).filter((file) => /sitemap-\d+\.xml$/.test(file)).map((file) => readFileSync(file, 'utf8')).join('\n');
const sitemapPaths = new Set([...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => normalizePath(match[1])));

const linksByRoute = new Map([...htmlByRoute.entries()].map(([route, html]) => [route, linksFromHtml(html)]));
const incomingByRoute = new Map();
for (const [source, links] of linksByRoute) {
	for (const link of links) {
		if (link !== source) incomingByRoute.set(link, (incomingByRoute.get(link) ?? 0) + 1);
	}
}

const rows = [...htmlByRoute.entries()]
	.filter(([route]) => {
		const parts = route.split('/').filter(Boolean);
		return parts.length === 2 && SERVICES.includes(parts[0]);
	})
	.map(([route, html]) => {
		const [, service, slug] = route.match(/^\/([^/]+)\/([^/]+)\/$/);
		const pageKind = LOCAL_SLUGS.has(slug) ? 'local' : 'topic';
		const override = readOverride(service, slug);
		const title = stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
		const description = attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '', 'content');
		const h1 = stripHtml(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
		const contentText = stripHtml(html);
		const sourceTokens = tokens(contentText);
		const keyword = override.data?.targetKeyword || title.split('|')[0].trim();
		const keywordTokens = tokens(keyword);
		const imageStats = imageAltStats(html);
		const parentLinks = linksByRoute.get(`/${service}/`) ?? [];
		return {
			service,
			slug,
			pageKind,
			route,
			url: `https://kim-marie-borger.com${route}`,
			targetKeyword: keyword,
			priority: override.data?.priority ?? '',
			editorStatus: override.data?.status ?? '',
			cmsOverride: override.exists,
			cmsOverrideEnabled: override.data?.enabled !== false,
			title,
			titleChars: title.length,
			descriptionChars: description.length,
			h1,
			wordCount: normalizeText(contentText).split(' ').filter(Boolean).length,
			uniqueWordCount: new Set(sourceTokens).size,
			faqCount: faqCount(html),
			imageCount: imageStats.imageCount,
			emptyAltCount: imageStats.emptyAltCount,
			uniqueAltCount: imageStats.uniqueAltCount,
			incomingInternalLinks: incomingByRoute.get(route) ?? 0,
			linkedFromParent: parentLinks.includes(route),
			sitemapIncluded: sitemapPaths.has(route),
			shingles: shingleSet(sourceTokens),
			templateProfile: tokenProfile(sourceTokens),
			keywordProfile: tokenProfile(keywordTokens),
			nearestContentRoute: '',
			nearestContentSimilarity: 0,
			nearestTemplateRoute: '',
			nearestTemplateSimilarity: 0,
			nearestKeywordRoute: '',
			nearestKeywordSimilarity: 0,
			risk: 'unknown',
			action: 'review',
		};
	})
	.sort((a, b) => a.service.localeCompare(b.service) || a.pageKind.localeCompare(b.pageKind) || a.slug.localeCompare(b.slug));

for (const row of rows) {
	for (const other of rows) {
		if (other.route === row.route || other.service !== row.service || other.pageKind !== row.pageKind) continue;
		const contentSimilarity = jaccard(row.shingles, other.shingles);
		const templateSimilarity = tokenDice(row.templateProfile, other.templateProfile);
		const keywordSimilarity = tokenDice(row.keywordProfile, other.keywordProfile);
		if (contentSimilarity > row.nearestContentSimilarity) {
			row.nearestContentSimilarity = contentSimilarity;
			row.nearestContentRoute = other.route;
		}
		if (templateSimilarity > row.nearestTemplateSimilarity) {
			row.nearestTemplateSimilarity = templateSimilarity;
			row.nearestTemplateRoute = other.route;
		}
		if (keywordSimilarity > row.nearestKeywordSimilarity) {
			row.nearestKeywordSimilarity = keywordSimilarity;
			row.nearestKeywordRoute = other.route;
		}
	}
	if (row.nearestTemplateSimilarity >= 0.93 || (row.nearestKeywordSimilarity >= 0.82 && row.nearestContentSimilarity >= 0.55)) row.risk = 'high';
	else if (row.nearestTemplateSimilarity >= 0.86 || row.nearestKeywordSimilarity >= 0.72) row.risk = 'medium';
	else row.risk = 'low';

	if (!row.cmsOverride) row.action = 'create-cms-doc';
	else if (row.risk === 'high') row.action = 'rewrite-differentiate';
	else if (row.faqCount < 3) row.action = 'add-faq';
	else if (row.emptyAltCount > 0 || row.uniqueAltCount < Math.min(2, row.imageCount)) row.action = 'improve-image-alts';
	else if (row.wordCount < 650) row.action = 'expand-copy';
	else row.action = 'ok';
}

mkdirSync(OUT_DIR, { recursive: true });

const columns = [
	'service', 'page_kind', 'priority', 'risk', 'action', 'editor_status', 'cms_override',
	'cms_override_enabled', 'slug', 'target_keyword', 'url', 'word_count', 'unique_word_count',
	'faq_count', 'image_count', 'empty_alt_count', 'unique_alt_count', 'incoming_internal_links',
	'linked_from_parent', 'sitemap_included', 'title_chars', 'description_chars',
	'nearest_keyword_url', 'nearest_keyword_similarity', 'nearest_content_url',
	'nearest_content_similarity', 'nearest_template_url', 'nearest_template_similarity', 'title', 'h1',
];

writeFileSync(
	CSV_FILE,
	`${columns.join(',')}\n${rows.map((row) => columns.map((column) => csvEscape({
		service: row.service,
		page_kind: row.pageKind,
		priority: row.priority,
		risk: row.risk,
		action: row.action,
		editor_status: row.editorStatus,
		cms_override: row.cmsOverride,
		cms_override_enabled: row.cmsOverrideEnabled,
		slug: row.slug,
		target_keyword: row.targetKeyword,
		url: row.url,
		word_count: row.wordCount,
		unique_word_count: row.uniqueWordCount,
		faq_count: row.faqCount,
		image_count: row.imageCount,
		empty_alt_count: row.emptyAltCount,
		unique_alt_count: row.uniqueAltCount,
		incoming_internal_links: row.incomingInternalLinks,
		linked_from_parent: row.linkedFromParent,
		sitemap_included: row.sitemapIncluded,
		title_chars: row.titleChars,
		description_chars: row.descriptionChars,
		nearest_keyword_url: row.nearestKeywordRoute ? `https://kim-marie-borger.com${row.nearestKeywordRoute}` : '',
		nearest_keyword_similarity: Number(row.nearestKeywordSimilarity.toFixed(4)),
		nearest_content_url: row.nearestContentRoute ? `https://kim-marie-borger.com${row.nearestContentRoute}` : '',
		nearest_content_similarity: Number(row.nearestContentSimilarity.toFixed(4)),
		nearest_template_url: row.nearestTemplateRoute ? `https://kim-marie-borger.com${row.nearestTemplateRoute}` : '',
		nearest_template_similarity: Number(row.nearestTemplateSimilarity.toFixed(4)),
		title: row.title,
		h1: row.h1,
	}[column])).join(',')).join('\n')}\n`,
);

const byKind = [...groupBy(rows, (row) => row.pageKind).entries()];
const byAction = [...groupBy(rows, (row) => row.action).entries()].sort(([a], [b]) => a.localeCompare(b));
const byRisk = [...groupBy(rows, (row) => row.risk).entries()].sort(([a], [b]) => a.localeCompare(b));
const backlog = rows
	.filter((row) => row.action !== 'ok')
	.sort((a, b) => {
		const risk = { high: 0, medium: 1, low: 2 };
		const kind = { topic: 0, local: 1 };
		return risk[a.risk] - risk[b.risk]
			|| kind[a.pageKind] - kind[b.pageKind]
			|| b.nearestKeywordSimilarity - a.nearestKeywordSimilarity
			|| b.nearestTemplateSimilarity - a.nearestTemplateSimilarity;
	})
	.slice(0, 80);

const report = `# SEO Page Tracker

Generiert: ${new Date().toISOString()}

Dieser Tracker prueft lokale Seiten und Topic-Seiten gemeinsam. Ziel ist, Seiten zu finden, die technisch existieren, aber noch zu aehnlich, zu duenn, nicht sauber im CMS gepflegt oder bei Keywords zu nah an anderen Seiten sind.

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| SEO-Seiten gesamt | ${rows.length} |
${byKind.map(([kind, group]) => `| ${kind} | ${group.length} |`).join('\n')}
| CMS-Dokumente vorhanden | ${rows.filter((row) => row.cmsOverride).length} |
| Durchschnitt Keyword-Nahe | ${formatPercent(average(rows.map((row) => row.nearestKeywordSimilarity)))} |
| Durchschnitt Content-Aehnlichkeit | ${formatPercent(average(rows.map((row) => row.nearestContentSimilarity)))} |
| Durchschnitt Template-Aehnlichkeit | ${formatPercent(average(rows.map((row) => row.nearestTemplateSimilarity)))} |

## Risk

| Risiko | Seiten |
| --- | ---: |
${byRisk.map(([risk, group]) => `| ${risk} | ${group.length} |`).join('\n')}

## Actions

| Aktion | Seiten |
| --- | ---: |
${byAction.map(([action, group]) => `| ${action} | ${group.length} |`).join('\n')}

## Priorisierter Backlog

| Risiko | Aktion | Typ | Seite | Keyword-Nahe | Content | Template | Naechste Keyword-Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
${backlog.map((row) => `| ${row.risk} | ${row.action} | ${row.pageKind} | [${row.targetKeyword}](${row.url}) | ${formatPercent(row.nearestKeywordSimilarity)} | ${formatPercent(row.nearestContentSimilarity)} | ${formatPercent(row.nearestTemplateSimilarity)} | ${row.nearestKeywordRoute || '-'} |`).join('\n')}

## Interpretation

- \`nearest_keyword_similarity\` zeigt, ob zwei Zielkeywords im selben Leistungscluster sehr nah beieinanderliegen.
- \`nearest_content_similarity\` zeigt, ob gerenderte Seiten im Fliesstext sehr aehnlich sind.
- \`nearest_template_similarity\` ist strenger gegen Vorlagen-Duplizierung und reagiert weniger auf einzelne andere Woerter.
- \`cms_override\` muss fuer jede SEO-Seite true sein, damit die Seite im Tina CMS redaktionell gepflegt werden kann.
- \`action = rewrite-differentiate\` ist der wichtigste Status fuer die redaktionelle Arbeit.
`;

writeFileSync(REPORT_FILE, report);

console.log(`SEO page tracker written:`);
console.log(`- ${path.relative(process.cwd(), CSV_FILE).replace(/\\/g, '/')}`);
console.log(`- ${path.relative(process.cwd(), REPORT_FILE).replace(/\\/g, '/')}`);
console.log(`Rows: ${rows.length}`);
console.log(`CMS docs: ${rows.filter((row) => row.cmsOverride).length}`);
console.log(`High risk: ${rows.filter((row) => row.risk === 'high').length}`);
