import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { relativePath, resolveStaticOutputDirOrExit, routeFromHtmlFile, staticOutputArg, walkFiles } from './lib/static-output.mjs';

const MAX_ISSUE_GROUPS_TO_PRINT = 40;
const output = resolveStaticOutputDirOrExit({ requestedDir: staticOutputArg() });

function decodeHtml(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

function stripHtml(value) {
	return decodeHtml(value)
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function attr(tag, name) {
	const match = tag.match(new RegExp(`\\s${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i'));
	if (!match) return undefined;
	return match[1] ?? match[2] ?? match[3] ?? '';
}

function shorten(value, max = 140) {
	const text = String(value ?? '').replace(/\s+/g, ' ').trim();
	return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

const REQUIRED_ID_TYPES = new Set([
	'Article',
	'BreadcrumbList',
	'CollectionPage',
	'ContactPage',
	'FAQPage',
	'ItemList',
	'Offer',
	'OfferCatalog',
	'Person',
	'ProfilePage',
	'Service',
	'WebPage',
	'WebSite',
]);
const CORE_SERVICE_SLUGS = new Set([
	'hochzeiten',
	'beerdigungen',
	'geburtstage',
	'taufen',
	'konzerte',
	'firmenfeiern',
	'unterricht',
]);
const PUBLIC_OPERATOR_PATTERNS = [
	[/\b(?:redaktionell|Suchintention|Suchbegriff|Suchintent|Keyword|Cluster|Abgrenzung)\b/i, 'visible SEO/editorial operator language'],
	[/\b(?:Der Planungsfrage|ein eigener Planungsfrage)\b/i, 'visible replacement artifact'],
	[/\bfür SEO\b/i, 'visible copy addresses SEO instead of the customer'],
	[/\b(?:Diese Seiten?|So bleibt die Seite|Andere Seiten)\b/i, 'visible copy talks about the page system'],
	[/kurzer Akzent, ein längerer Bogen, ein Technikfokus/i, 'visible stretched-template phrase'],
	[/\bbraucht (?:eine eigene Entscheidung|einen eigenen Schwerpunkt|eine eigene musikalische Planung)\b/i, 'visible generator-style differentiation phrase'],
	[/\b(?:Variante der Hauptleistung|verwandte Anfragen wie|allgemeine Musikfloskel)\b/i, 'visible generator-style comparison phrase'],
	[/\bTypische Orte und Routen liegen zum Beispiel\b/i, 'visible decorative locality template'],
	[/\bDie lokalen Marker\b/i, 'visible locality-generator language'],
	[/\bNicht der Ortsname macht sie relevant\b/i, 'visible editorial locality explanation'],
	[/\bsteht hier für konkrete Orte und Wege zwischen\b/i, 'visible location-template framing'],
	[/\bWenn Zeremonie, Fotos und Empfang an zwei Orten\b/i, 'visible cross-service event template'],
	[/\banschliessende\b/i, 'visible German orthography error'],
	[/\b(?:suchen Musik für|nicht wirkt hier als|wird hier praktisch eingeordnet)\b/i, 'visible generated grammar artifact'],
	[/\b(?:Als fachlichen Zusatz kläre ich|Hier geht es gezielt um)\b/i, 'visible generated filler phrase'],
	[/\b(?:Einsch\?tzung|Traürfeier|Traürmusik)\b/i, 'visible encoding artifact'],
	[/\bAnfäNger\b/, 'visible casing artifact'],
	[/\b(?:Fuer|Koerper\p{L}*|Uebe\p{L}*|Stueck\p{L}*|Uebergang|frueh|wuenscht|beruehrt)\b/iu, 'visible ASCII umlaut transcription'],
];
const TEACHING_EVENT_COPY =
	/\b(?:private Feiern|Unternehmensumfeld|Einlass|Ladepunkt|Wartezeit|Ortswechsel|Spielort|Vorspielen vor Ort|besondere Technik|Aufbauplatz)\b/i;
const LOCAL_BUSINESS_TYPES = new Set(['LocalBusiness', 'ProfessionalService']);
const PHYSICAL_LOCATION_FIELDS = ['address', 'geo', 'openingHours', 'openingHoursSpecification'];

function asArray(value) {
	if (Array.isArray(value)) return value;
	return value ? [value] : [];
}

function jsonLdTypes(node) {
	return asArray(node?.['@type']).filter((value) => typeof value === 'string');
}

function stableJson(value) {
	if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
	if (value && typeof value === 'object') {
		return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
	}
	return JSON.stringify(value);
}

function collectSchemaNodes(value, nodes = []) {
	if (!value || typeof value !== 'object') return nodes;
	if (Array.isArray(value)) {
		for (const item of value) collectSchemaNodes(item, nodes);
		return nodes;
	}
	if (value['@type'] || value['@id']) nodes.push(value);
	for (const child of Object.values(value)) collectSchemaNodes(child, nodes);
	return nodes;
}

function refIds(value, ids = []) {
	if (!value || typeof value !== 'object') return ids;
	if (Array.isArray(value)) {
		for (const item of value) refIds(item, ids);
		return ids;
	}
	if (typeof value['@id'] === 'string') ids.push(value['@id']);
	for (const child of Object.values(value)) refIds(child, ids);
	return ids;
}

function hasCoreServiceId(id) {
	try {
		const url = new URL(id);
		const slug = url.pathname.replace(/^\/|\/$/g, '');
		return url.hash === '#service' && CORE_SERVICE_SLUGS.has(slug);
	} catch {
		return false;
	}
}

function recordSchemaDefinition(page, node) {
	if (!node?.['@id'] || !node?.['@type']) return;
	const id = node['@id'];
	const signature = stableJson(node);
	const existing = schemaDefinitions.get(id);
	if (!existing) {
		schemaDefinitions.set(id, { signature, pages: [page], conflicts: [] });
		return;
	}
	existing.pages.push(page);
	if (existing.signature !== signature && existing.conflicts.length < 4) {
		existing.conflicts.push(page);
	}
}

function auditJsonLdNode(page, node) {
	const types = jsonLdTypes(node);
	const id = typeof node['@id'] === 'string' ? node['@id'] : '';

	if (types.some((type) => REQUIRED_ID_TYPES.has(type)) && !id) {
		issues.push(['error', page, `schema ${types.join('|')} is missing stable @id`]);
	}

	if (id) {
		try {
			const url = new URL(id);
			if (url.hostname === 'localhost') issues.push(['error', page, `schema @id uses localhost: ${id}`]);
		} catch {
			issues.push(['error', page, `schema @id is not an absolute URL: ${id}`]);
		}
	}

	if (types.some((type) => LOCAL_BUSINESS_TYPES.has(type))) {
		issues.push(['error', page, `LocalBusiness-like schema type is not allowed here: ${types.join('|')}`]);
	}

	for (const field of PHYSICAL_LOCATION_FIELDS) {
		if (Object.hasOwn(node, field)) {
			issues.push(['error', page, `schema contains unverified physical-location field: ${field}`]);
		}
	}

	if (types.includes('Person') && id && !id.endsWith('/#person')) {
		issues.push(['error', page, `Person schema uses unexpected @id: ${id}`]);
	}

	if (types.includes('WebSite') && id && !id.endsWith('/#website')) {
		issues.push(['error', page, `WebSite schema uses unexpected @id: ${id}`]);
	}

	if (types.includes('Service') && id && !hasCoreServiceId(id)) {
		issues.push(['error', page, `Service schema must use a core service @id, got: ${id}`]);
	}

	if (types.includes('Offer')) {
		const itemIds = refIds(node.itemOffered);
		if (!itemIds.some(hasCoreServiceId)) {
			issues.push(['error', page, 'Offer schema must reference a core Service via itemOffered']);
		}
	}

	if (node.sameAs) {
		for (const sameAs of asArray(node.sameAs)) {
			try {
				const url = new URL(sameAs);
				if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol');
			} catch {
				issues.push(['error', page, `sameAs must be an absolute HTTP(S) URL: ${sameAs}`]);
			}
		}
	}

	recordSchemaDefinition(page, node);
}

function internalPageRouteFromHref(href, page) {
	const value = decodeHtml(href).trim();
	if (!value || value.startsWith('#')) return '';
	if (/^(?:mailto|tel|javascript|data):/i.test(value)) return '';

	let url;
	try {
		url = new URL(value, `https://local.test${page.endsWith('/') ? page : `${page}/`}`);
	} catch {
		return '';
	}

	if (url.origin !== 'https://local.test') return '';
	if (/^\/(?:api|admin|_astro|uploads)\b/i.test(url.pathname)) return '';
	if (/\.[a-z0-9]{2,8}$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return '';

	if (url.pathname === '/') return '/';
	if (/\.html$/i.test(url.pathname)) return url.pathname;
	return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
}

function vercelNoindexHeaderOk(headers, source) {
	const entry = headers.find((item) => item?.source === source);
	return (entry?.headers ?? []).some((header) => {
		return String(header?.key ?? '').toLowerCase() === 'x-robots-tag'
			&& /noindex/i.test(String(header?.value ?? ''));
	});
}

const issues = [];
const schemaDefinitions = new Map();
const htmlFiles = walkFiles(output.root)
	.filter((file) => file.endsWith('.html'))
	.filter((file) => !file.includes(`${path.sep}admin${path.sep}`));
const htmlRoutes = new Set(htmlFiles.map((file) => routeFromHtmlFile(output.root, file)));
const inboundLinks = new Map([...htmlRoutes].map((route) => [route, new Set()]));

const canonicalUrls = new Map();
const robotsByPage = new Map();

console.log(`Using static output: ${output.relative} (${output.htmlCount} HTML files, ${output.sitemapCount} sitemap files)`);

for (const file of htmlFiles) {
	const route = routeFromHtmlFile(output.root, file);
	const html = readFileSync(file, 'utf8');
	robotsByPage.set(route, attr(html.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0] ?? '', 'content') ?? '');
}

for (const file of htmlFiles.sort()) {
	const page = routeFromHtmlFile(output.root, file);
	const html = readFileSync(file, 'utf8');
	const visibleText = stripHtml(html);
	const is404 = page === '/404';
	const title = stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
	const description = attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
	const canonical = attr(html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0] ?? '', 'href') ?? '';
	const robots = attr(html.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
	robotsByPage.set(page, robots);
	const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripHtml(match[1]));
	const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
	const linkTags = [...html.matchAll(/<a\b[^>]*href\s*=\s*["'][^"']+["'][^>]*>/gi)].map((match) => match[0]);
	const linkHrefs = linkTags.map((tag) => attr(tag, 'href') ?? '');
	const jsonLdBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

	if (!title) issues.push(['error', page, 'missing <title>']);
	else if (title.length > 68) issues.push(['warn', page, `long title (${title.length} chars)`]);
	else if (title.length < 18 && !is404) issues.push(['warn', page, `short title (${title.length} chars)`]);

	if (!description) issues.push(['error', page, 'missing meta description']);
	else if (description.length > 170) issues.push(['warn', page, `long meta description (${description.length} chars)`]);
	else if (description.length < 50 && !is404) issues.push(['warn', page, `short meta description (${description.length} chars)`]);

	if (!canonical) {
		issues.push(['error', page, 'missing canonical URL']);
	} else {
		canonicalUrls.set(canonical, [...(canonicalUrls.get(canonical) ?? []), page]);
		try {
			const url = new URL(canonical);
			if (url.hostname === 'localhost') issues.push(['warn', page, 'canonical URL uses localhost']);
			if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
				issues.push(['error', page, `canonical URL is missing trailing slash: ${url.pathname}`]);
			}
		} catch {
			issues.push(['error', page, `invalid canonical URL: ${canonical}`]);
		}
	}

	if (!robots) issues.push(['warn', page, 'missing robots meta tag']);
	if (is404 && !/noindex/i.test(robots)) issues.push(['error', page, '404 page is missing noindex']);
	if (!is404 && /noindex/i.test(robots)) issues.push(['error', page, 'indexable page has noindex robots meta']);
	if (!is404 && h1s.length !== 1) issues.push(['error', page, `expected exactly one h1, found ${h1s.length}`]);

	if (!is404) {
		for (const [pattern, message] of PUBLIC_OPERATOR_PATTERNS) {
			if (pattern.test(visibleText)) issues.push(['error', page, message]);
		}
	}
	if (/^\/unterricht\/[^/]+\/$/.test(page) && TEACHING_EVENT_COPY.test(visibleText)) {
		issues.push(['error', page, 'teaching page contains event-only planning language']);
	}

	for (const tag of imageTags) {
		const hasAlt = attr(tag, 'alt') !== undefined;
		const alt = attr(tag, 'alt') ?? '';
		const hidden = /aria-hidden=["']true["']/i.test(tag);
		if (!hasAlt) issues.push(['error', page, `image without alt: ${tag.slice(0, 90)}...`]);
		if (hasAlt && alt.trim() === '' && !hidden) {
			issues.push(['warn', page, `empty alt on non-hidden image: ${tag.slice(0, 90)}...`]);
		}
	}

	for (const tag of linkTags) {
		if (!attr(tag, 'title')?.trim()) {
			issues.push(['error', page, `link without title attribute: ${tag.slice(0, 90)}...`]);
		}
	}

	if (/<a\b[^>]*href=["'][^"']+\.html(?:[#?][^"']*)?["']/i.test(html)) {
		issues.push(['error', page, 'contains link to legacy .html URL']);
	}

	for (const href of linkHrefs) {
		const linkedRoute = internalPageRouteFromHref(href, page);
		if (linkedRoute && /\.html$/i.test(linkedRoute)) continue;
		if (linkedRoute && !htmlRoutes.has(linkedRoute)) {
			issues.push(['error', page, `broken internal page link: ${shorten(href, 90)}`]);
		}
		if (linkedRoute && htmlRoutes.has(linkedRoute) && /noindex/i.test(robotsByPage.get(linkedRoute) ?? '')) {
			issues.push(['error', page, `links to noindex page: ${linkedRoute}`]);
		}
		if (linkedRoute && htmlRoutes.has(linkedRoute) && linkedRoute !== page) {
			inboundLinks.get(linkedRoute)?.add(page);
		}
	}

	for (const [index, [, json]] of jsonLdBlocks.entries()) {
		try {
			const parsed = JSON.parse(decodeHtml(json));
			for (const node of collectSchemaNodes(parsed)) {
				auditJsonLdNode(page, node);
			}
		} catch (error) {
			issues.push(['error', page, `invalid JSON-LD block ${index + 1}: ${shorten(error.message, 90)}`]);
		}
	}

	if (/\[(?:VORNAME|NACHNAME|MONAT|JAHR|OPTIONAL|HINWEIS)\b|Platzhalter|echtes Gästezitat folgt/i.test(visibleText)) {
		issues.push(['warn', page, 'visible placeholder text remains']);
	}
}

if (existsSync('vercel.json')) {
	try {
		const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
		const headers = Array.isArray(vercel.headers) ? vercel.headers : [];
		for (const source of ['/admin/(.*)', '/tina-island/(.*)', '/api/(.*)']) {
			if (!vercelNoindexHeaderOk(headers, source)) {
				issues.push(['error', 'vercel.json', `missing X-Robots-Tag noindex header for ${source}`]);
			}
		}
	} catch (error) {
		issues.push(['error', 'vercel.json', `cannot parse vercel.json: ${shorten(error.message, 90)}`]);
	}
}

for (const [canonical, pages] of canonicalUrls.entries()) {
	if (pages.length > 1) {
		issues.push(['error', pages.join(', '), `duplicate canonical URL: ${canonical}`]);
	}
}

for (const route of [...htmlRoutes].sort()) {
	if (route === '/' || route === '/404') continue;
	if (/noindex/i.test(robotsByPage.get(route) ?? '')) continue;
	if ((inboundLinks.get(route)?.size ?? 0) === 0) {
		issues.push(['error', route, 'indexable page has no visible internal inbound link']);
	}
}

for (const [id, entry] of schemaDefinitions.entries()) {
	if (entry.conflicts.length > 0) {
		const pages = [entry.pages[0], ...entry.conflicts].filter(Boolean).join(', ');
		issues.push(['error', pages, `schema @id has inconsistent definitions across pages: ${id}`]);
	}
}

const errors = issues.filter(([level]) => level === 'error');
const warnings = issues.filter(([level]) => level === 'warn');

const levelOrder = { error: 0, warn: 1 };
const groupedIssues = [...issues.reduce((groups, [level, page, message]) => {
	const key = `${level}\0${message}`;
	const group = groups.get(key) ?? { level, message, pages: [] };
	group.pages.push(page);
	groups.set(key, group);
	return groups;
}, new Map()).values()].sort((a, b) => {
	return levelOrder[a.level] - levelOrder[b.level]
		|| b.pages.length - a.pages.length
		|| a.message.localeCompare(b.message);
});

for (const { level, message, pages } of groupedIssues.slice(0, MAX_ISSUE_GROUPS_TO_PRINT)) {
	const examples = pages.slice(0, 4).join(', ');
	const suffix = pages.length > 4 ? ', ...' : '';
	console.log(`${level.toUpperCase().padEnd(5)} x${String(pages.length).padStart(3)} ${message} (${examples}${suffix})`);
}
if (groupedIssues.length > MAX_ISSUE_GROUPS_TO_PRINT) {
	console.log(`... ${groupedIssues.length - MAX_ISSUE_GROUPS_TO_PRINT} more issue groups hidden`);
}

console.log(`\nSEO audit: ${errors.length} errors, ${warnings.length} warnings across ${htmlFiles.length} HTML pages from ${relativePath(output.root)}.`);

if (errors.length > 0) process.exit(1);
