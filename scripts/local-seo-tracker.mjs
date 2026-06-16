import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');
const OUT_DIR = path.resolve('seo');
const CSV_FILE = path.join(OUT_DIR, 'local-page-tracker.csv');
const REPORT_FILE = path.join(OUT_DIR, 'local-page-tracker.md');

const SERVICE_CONFIG = {
	hochzeiten: {
		label: 'Hochzeit',
		intent: 'hochzeitsmusik',
		titlePrefix: 'Hochzeitsmusik',
		keywordPrefix: 'Hochzeitsmusik',
	},
	beerdigungen: {
		label: 'Trauerfeier',
		intent: 'trauermusik',
		titlePrefix: 'Trauermusik',
		keywordPrefix: 'Trauermusik',
	},
	firmenfeiern: {
		label: 'Firmenevent',
		intent: 'firmenevent-musik',
		titlePrefix: 'Firmenevent',
		keywordPrefix: 'Live Musik Firmenevent',
	},
	geburtstage: {
		label: 'Geburtstag',
		intent: 'geburtstagsmusik',
		titlePrefix: 'Live Musik Geburtstag',
		keywordPrefix: 'Live Musik Geburtstag',
	},
	taufen: {
		label: 'Taufe',
		intent: 'taufmusik',
		titlePrefix: 'Taufmusik',
		keywordPrefix: 'Taufmusik',
	},
	konzerte: {
		label: 'Konzert',
		intent: 'viola-konzert',
		titlePrefix: 'Viola Konzert',
		keywordPrefix: 'Viola Konzert',
	},
	unterricht: {
		label: 'Unterricht',
		intent: 'bratschenunterricht',
		titlePrefix: 'Bratschenunterricht',
		keywordPrefix: 'Bratschenunterricht',
	},
};

const SERVICE_PRIORITY = {
	hochzeiten: 3,
	beerdigungen: 3,
	unterricht: 3,
	firmenfeiern: 2,
	geburtstage: 1,
	taufen: 1,
	konzerte: 1,
};

const LOCATION_PRIORITY = {
	duesseldorf: 3,
	erkrath: 3,
	ratingen: 3,
	koeln: 3,
	essen: 3,
	dortmund: 3,
	neuss: 3,
	mettmann: 3,
	hilden: 3,
	'kreis-mettmann': 3,
	'rhein-kreis-neuss': 3,
	rheinland: 3,
	ruhrgebiet: 3,
	duisburg: 2,
	bochum: 2,
	wuppertal: 2,
	leverkusen: 2,
	krefeld: 2,
	moenchengladbach: 2,
	meerbusch: 2,
	haan: 2,
	langenfeld: 2,
	'monheim-am-rhein': 2,
	velbert: 2,
	'rhein-ruhr': 2,
	'bergisches-land': 2,
	'nordrhein-westfalen': 2,
};

const STOPWORDS = new Set([
	'aber',
	'alle',
	'allem',
	'allen',
	'aller',
	'alles',
	'als',
	'also',
	'am',
	'an',
	'andere',
	'auch',
	'auf',
	'aus',
	'bei',
	'beim',
	'bis',
	'da',
	'dabei',
	'damit',
	'dann',
	'das',
	'dass',
	'dein',
	'deine',
	'dem',
	'den',
	'der',
	'des',
	'die',
	'dies',
	'diese',
	'dieser',
	'dir',
	'doch',
	'dort',
	'du',
	'durch',
	'ein',
	'eine',
	'einem',
	'einen',
	'einer',
	'eines',
	'er',
	'es',
	'euch',
	'euer',
	'eure',
	'eurem',
	'euren',
	'eurer',
	'fuer',
	'ganz',
	'gern',
	'hat',
	'hier',
	'ich',
	'im',
	'in',
	'ist',
	'ja',
	'je',
	'jede',
	'jedem',
	'jeden',
	'jeder',
	'kann',
	'mit',
	'nach',
	'nicht',
	'noch',
	'nur',
	'ob',
	'oder',
	'ohne',
	'sehr',
	'sein',
	'so',
	'sowie',
	'und',
	'vom',
	'von',
	'vor',
	'was',
	'weil',
	'wenn',
	'wie',
	'wir',
	'wird',
	'zu',
	'zum',
	'zur',
]);

if (!existsSync(DIST)) {
	console.error('dist/client not found. Run npm run build:local first.');
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

function routeFromFile(file) {
	return `/${path.relative(DIST, file).replace(/\\/g, '/').replace(/index.html$/, '').replace(/^404.html$/, '404')}`;
}

function decodeHtml(value) {
	return value
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

function normalizePath(href) {
	if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return '';
	try {
		const url = new URL(href, 'https://kim-marie-borger.com');
		if (url.origin !== 'https://kim-marie-borger.com') return '';
		if (/\.[a-z0-9]+$/i.test(url.pathname)) return url.pathname;
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

function tokensForSimilarity(value) {
	return normalizeText(value)
		.split(' ')
		.filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function shingleSet(tokens, size = 5) {
	if (tokens.length <= size) return new Set(tokens);
	const shingles = new Set();
	for (let index = 0; index <= tokens.length - size; index += 1) {
		shingles.add(tokens.slice(index, index + size).join(' '));
	}
	return shingles;
}

function tokensForTemplateOverlap(normalizedText) {
	return normalizedText
		.split(' ')
		.filter((token) => token.length >= 2);
}

function tokenCounts(tokens) {
	const counts = new Map();
	for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
	return counts;
}

function tokenDice(a, b) {
	if (!a.total && !b.total) return 1;
	if (!a.total || !b.total) return 0;
	let overlap = 0;
	const [smaller, larger] = a.counts.size <= b.counts.size ? [a.counts, b.counts] : [b.counts, a.counts];
	for (const [token, count] of smaller) {
		overlap += Math.min(count, larger.get(token) ?? 0);
	}
	return (2 * overlap) / (a.total + b.total);
}

function tokenProfile(tokens) {
	return {
		counts: tokenCounts(tokens),
		total: tokens.length,
	};
}

function jaccard(a, b) {
	if (!a.size && !b.size) return 1;
	if (!a.size || !b.size) return 0;
	const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
	let overlap = 0;
	for (const item of smaller) {
		if (larger.has(item)) overlap += 1;
	}
	return overlap / (a.size + b.size - overlap);
}

function maskAliases(normalizedText, aliases) {
	let masked = ` ${normalizedText} `;
	for (const alias of aliases) {
		if (!alias) continue;
		masked = masked.replace(new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'g'), ' ort ');
	}
	return masked.replace(/\s+/g, ' ').trim();
}

function extractBodyForContent(html) {
	return html
		.replace(/<head[\s\S]*?<\/head>/i, ' ')
		.replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
		.replace(/<section\b(?=[^>]*\bid=["']kontakt["'])[\s\S]*?<\/section>/gi, ' ')
		.replace(/<section\b(?=[^>]*\blocal-seo-links\b)[\s\S]*$/i, ' ');
}

function jsonLdTypes(html) {
	const types = [];
	const blocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
	for (const [, json] of blocks) {
		try {
			collectTypes(JSON.parse(decodeHtml(json)), types);
		} catch {
			types.push('INVALID_JSON_LD');
		}
	}
	return [...new Set(types)].sort();
}

function collectTypes(value, types) {
	if (!value || typeof value !== 'object') return;
	if (Array.isArray(value)) {
		for (const item of value) collectTypes(item, types);
		return;
	}
	if (value['@type']) {
		if (Array.isArray(value['@type'])) types.push(...value['@type']);
		else types.push(value['@type']);
	}
	for (const nested of Object.values(value)) collectTypes(nested, types);
}

function csvEscape(value) {
	const text = value === null || value === undefined ? '' : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

function inferLocationName(serviceSlug, titleLead, h1, locationSlug) {
	const config = SERVICE_CONFIG[serviceSlug];
	const candidates = [
		titleLead.replace(new RegExp(`^${escapeRegExp(config.titlePrefix)}\\s+`, 'i'), ''),
		titleLead.replace(new RegExp(`^${escapeRegExp(config.keywordPrefix)}\\s+`, 'i'), ''),
		h1.match(/\bin\s+(.+?)(?:\s+fuer|\s+für|\s+mit|\s*$|\.)/i)?.[1] ?? '',
		h1.match(/\bim\s+(.+?)(?:\s+fuer|\s+für|\s+mit|\s*$|\.)/i)?.[1] ?? '',
		h1.match(/\bin der Region\s+(.+?)(?:\s+fuer|\s+für|\s+mit|\s*$|\.)/i)?.[1] ?? '',
	].map((candidate) => candidate.trim().replace(/[.]+$/, ''));

	return candidates.find((candidate) => candidate && candidate.length <= 32) ?? slugToLabel(locationSlug);
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugToLabel(slug) {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function countOccurrences(haystack, needle) {
	if (!needle) return 0;
	const escaped = escapeRegExp(needle);
	return [...haystack.matchAll(new RegExp(`\\b${escaped}\\b`, 'g'))].length;
}

function locationAliases(locationName, locationSlug) {
	const aliases = new Set([normalizeText(locationName), normalizeText(locationSlug.replace(/-/g, ' '))]);
	const slugWords = locationSlug.replace(/-/g, ' ');
	aliases.add(normalizeText(slugWords.replace(/ue/g, 'u').replace(/oe/g, 'o').replace(/ae/g, 'a')));
	aliases.add(normalizeText(locationName.replace(/\bBergisches\b/i, 'Bergischen')));
	return [...aliases].filter(Boolean);
}

function priorityFor(serviceSlug, locationSlug) {
	const serviceScore = SERVICE_PRIORITY[serviceSlug] ?? 1;
	const locationScore = LOCATION_PRIORITY[locationSlug] ?? 1;
	const score = serviceScore + locationScore;
	if (score >= 6) return 'P1';
	if (score >= 4) return 'P2';
	return 'P3';
}

function scoreBasics(metric) {
	let score = 0;
	if (metric.titleLength >= 30 && metric.titleLength <= 68) score += 12;
	else if (metric.titleLength > 0) score += 6;
	if (metric.descriptionLength >= 80 && metric.descriptionLength <= 170) score += 12;
	else if (metric.descriptionLength > 0) score += 6;
	if (metric.h1Count === 1) score += 10;
	if (metric.titleHasLocation) score += 8;
	if (metric.h1HasLocation) score += 8;
	if (metric.descriptionHasLocation) score += 8;
	if (metric.canonicalPathOk) score += 10;
	if (metric.robotsIndexable) score += 6;
	if (metric.sitemapIncluded) score += 8;
	if (metric.hasServiceSchema) score += 8;
	if (metric.hasFaqSchema) score += 5;
	if (metric.linkedFromParent) score += 8;
	if (metric.incomingInternalLinks >= 2) score += 5;
	return Math.min(100, score);
}

function scoreContent(metric) {
	let score = 0;
	if (metric.wordCount >= 900) score += 20;
	else if (metric.wordCount >= 650) score += 16;
	else if (metric.wordCount >= 450) score += 10;
	else if (metric.wordCount >= 250) score += 5;

	if (metric.locationMentions >= 7) score += 20;
	else if (metric.locationMentions >= 4) score += 14;
	else if (metric.locationMentions >= 2) score += 8;

	if (metric.baseSimilarity <= 0.55) score += 20;
	else if (metric.baseSimilarity <= 0.7) score += 14;
	else if (metric.baseSimilarity <= 0.82) score += 8;
	else score += 2;

	if (metric.nearestSameServiceSimilarity <= 0.48) score += 30;
	else if (metric.nearestSameServiceSimilarity <= 0.56) score += 22;
	else if (metric.nearestSameServiceSimilarity <= 0.64) score += 12;
	else score += 3;

	if (metric.nearestSameServiceLocationMaskedTemplateSimilarity <= 0.86) score += 10;
	else if (metric.nearestSameServiceLocationMaskedTemplateSimilarity <= 0.92) score += 6;
	else score += 2;

	if (metric.uniqueWordCount >= 260) score += 10;
	else if (metric.uniqueWordCount >= 180) score += 6;
	else if (metric.uniqueWordCount >= 120) score += 3;

	return Math.min(100, score);
}

function riskFor(metric) {
	if (
		metric.nearestSameServiceSimilarity >= 0.68
		|| (metric.nearestSameServiceSimilarity >= 0.62 && metric.nearestSameServiceLocationMaskedTemplateSimilarity >= 0.94)
	) {
		return 'high';
	}
	if (
		metric.nearestSameServiceSimilarity >= 0.58
		|| (metric.nearestSameServiceSimilarity >= 0.54 && metric.nearestSameServiceLocationMaskedTemplateSimilarity >= 0.9)
	) {
		return 'medium';
	}
	return 'low';
}

function statusFor(metric) {
	if (metric.seoScore < 75) return 'fix-seo';
	if (metric.priority !== 'P3' && metric.cannibalizationRisk === 'high') return 'priority-rewrite';
	if (metric.contentScore < 45) return 'rewrite-needed';
	if (metric.contentScore < 65 || metric.cannibalizationRisk === 'medium') return 'improve-copy';
	return 'ready';
}

function formatPercent(value) {
	return `${Math.round(value * 1000) / 10}%`;
}

function average(values) {
	if (!values.length) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function groupBy(values, keyFn) {
	const groups = new Map();
	for (const value of values) {
		const key = keyFn(value);
		groups.set(key, [...(groups.get(key) ?? []), value]);
	}
	return groups;
}

const htmlFiles = walk(DIST)
	.filter((file) => file.endsWith('.html'))
	.filter((file) => !file.includes(`${path.sep}admin${path.sep}`));

const htmlByRoute = new Map();
for (const file of htmlFiles) {
	htmlByRoute.set(routeFromFile(file), readFileSync(file, 'utf8'));
}

const sitemapXml = existsSync(path.join(DIST, 'sitemap-0.xml'))
	? readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8')
	: '';
const sitemapPaths = new Set(
	[...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)]
		.map((match) => normalizePath(match[1])),
);

const linksByRoute = new Map();
for (const [route, html] of htmlByRoute) {
	linksByRoute.set(route, linksFromHtml(html));
}

const incomingByRoute = new Map();
for (const [sourceRoute, links] of linksByRoute) {
	for (const link of links) {
		if (link === sourceRoute) continue;
		incomingByRoute.set(link, (incomingByRoute.get(link) ?? 0) + 1);
	}
}

const basePages = new Map();
for (const serviceSlug of Object.keys(SERVICE_CONFIG)) {
	const route = `/${serviceSlug}/`;
	const html = htmlByRoute.get(route) ?? '';
	const text = stripHtml(extractBodyForContent(html));
	basePages.set(serviceSlug, {
		route,
		text,
		shingles: shingleSet(tokensForSimilarity(text)),
	});
}

const localRoutePattern = new RegExp(`^/(${Object.keys(SERVICE_CONFIG).join('|')})/([^/]+)/$`);
const rows = [...htmlByRoute.entries()]
	.filter(([route]) => localRoutePattern.test(route))
	.map(([route, html]) => {
		const [, serviceSlug, locationSlug] = route.match(localRoutePattern);
		const config = SERVICE_CONFIG[serviceSlug];
		const title = stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
		const titleLead = title.split('|')[0].trim();
		const description = attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
		const canonical = attr(html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0] ?? '', 'href') ?? '';
		const robots = attr(html.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
		const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripHtml(match[1]));
		const h1 = h1s[0] ?? '';
		const contentHtml = extractBodyForContent(html);
		const contentText = stripHtml(contentHtml);
		const tokens = tokensForSimilarity(contentText);
		const normalizedContent = normalizeText(contentText);
		const normalizedTitle = normalizeText(title);
		const normalizedH1 = normalizeText(h1);
		const normalizedDescription = normalizeText(description);
		const locationName = inferLocationName(serviceSlug, titleLead, h1, locationSlug);
		const aliases = locationAliases(locationName, locationSlug);
		const locationMentions = aliases.reduce((sum, alias) => sum + countOccurrences(normalizedContent, alias), 0);
		const serviceKeyword = normalizeText(config.keywordPrefix);
		const linkTargets = linksByRoute.get(route) ?? [];
		const localLinkCount = linkTargets.filter((link) => localRoutePattern.test(link)).length;
		const canonicalPath = normalizePath(canonical);
		const types = jsonLdTypes(html);

		return {
			service: serviceSlug,
			serviceLabel: config.label,
			intentCluster: config.intent,
			location: locationName,
			locationSlug,
			route,
			url: `https://kim-marie-borger.com${route}`,
			priority: priorityFor(serviceSlug, locationSlug),
			targetKeyword: `${config.keywordPrefix} ${locationName}`,
			title,
			titleLength: title.length,
			description,
			descriptionLength: description.length,
			h1,
			h1Count: h1s.length,
			wordCount: normalizeText(contentText).split(' ').filter(Boolean).length,
			uniqueWordCount: new Set(tokens).size,
			locationMentions,
			serviceKeywordMentions: countOccurrences(normalizedContent, serviceKeyword),
			titleHasLocation: aliases.some((alias) => normalizedTitle.includes(alias)),
			h1HasLocation: aliases.some((alias) => normalizedH1.includes(alias)),
			descriptionHasLocation: aliases.some((alias) => normalizedDescription.includes(alias)),
			bodyHasLocation: aliases.some((alias) => normalizedContent.includes(alias)),
			canonical,
			canonicalPathOk: canonicalPath === route,
			robotsIndexable: /index/i.test(robots) && !/noindex/i.test(robots),
			sitemapIncluded: sitemapPaths.has(route),
			jsonLdTypes: types.join('|'),
			hasServiceSchema: types.includes('Service'),
			hasFaqSchema: types.includes('FAQPage'),
			internalLinks: linkTargets.filter((link) => link.startsWith('/')).length,
			localLinks: localLinkCount,
			incomingInternalLinks: incomingByRoute.get(route) ?? 0,
			linkedFromParent: (linksByRoute.get(`/${serviceSlug}/`) ?? []).includes(route),
			normalizedContent,
			shingles: shingleSet(tokens),
			templateProfile: tokenProfile(tokensForTemplateOverlap(normalizedContent)),
			locationMaskedTemplateProfile: null,
			baseSimilarity: jaccard(shingleSet(tokens), basePages.get(serviceSlug)?.shingles ?? new Set()),
			nearestSameServiceRoute: '',
			nearestSameServiceSimilarity: 0,
			nearestSameServiceTemplateRoute: '',
			nearestSameServiceTemplateSimilarity: 0,
			nearestSameServiceLocationMaskedTemplateRoute: '',
			nearestSameServiceLocationMaskedTemplateSimilarity: 0,
			nearestSameLocationRoute: '',
			nearestSameLocationSimilarity: 0,
			seoScore: 0,
			contentScore: 0,
			cannibalizationRisk: 'unknown',
			status: 'unknown',
		};
	})
	.sort((a, b) => a.service.localeCompare(b.service) || a.locationSlug.localeCompare(b.locationSlug));

const allLocationAliases = [...new Set(rows.flatMap((row) => locationAliases(row.location, row.locationSlug)))]
	.sort((a, b) => b.length - a.length);

for (const row of rows) {
	const maskedContent = maskAliases(row.normalizedContent, allLocationAliases);
	row.locationMaskedTemplateProfile = tokenProfile(tokensForTemplateOverlap(maskedContent));
}

for (const row of rows) {
	let nearestService = { route: '', similarity: 0 };
	let nearestServiceTemplate = { route: '', similarity: 0 };
	let nearestServiceMaskedTemplate = { route: '', similarity: 0 };
	let nearestLocation = { route: '', similarity: 0 };
	for (const other of rows) {
		if (other.route === row.route) continue;
		const similarity = jaccard(row.shingles, other.shingles);
		const templateSimilarity = tokenDice(row.templateProfile, other.templateProfile);
		const maskedTemplateSimilarity = tokenDice(row.locationMaskedTemplateProfile, other.locationMaskedTemplateProfile);
		if (other.service === row.service && similarity > nearestService.similarity) {
			nearestService = { route: other.route, similarity };
		}
		if (other.service === row.service && templateSimilarity > nearestServiceTemplate.similarity) {
			nearestServiceTemplate = { route: other.route, similarity: templateSimilarity };
		}
		if (other.service === row.service && maskedTemplateSimilarity > nearestServiceMaskedTemplate.similarity) {
			nearestServiceMaskedTemplate = { route: other.route, similarity: maskedTemplateSimilarity };
		}
		if (other.locationSlug === row.locationSlug && similarity > nearestLocation.similarity) {
			nearestLocation = { route: other.route, similarity };
		}
	}
	row.nearestSameServiceRoute = nearestService.route;
	row.nearestSameServiceSimilarity = nearestService.similarity;
	row.nearestSameServiceTemplateRoute = nearestServiceTemplate.route;
	row.nearestSameServiceTemplateSimilarity = nearestServiceTemplate.similarity;
	row.nearestSameServiceLocationMaskedTemplateRoute = nearestServiceMaskedTemplate.route;
	row.nearestSameServiceLocationMaskedTemplateSimilarity = nearestServiceMaskedTemplate.similarity;
	row.nearestSameLocationRoute = nearestLocation.route;
	row.nearestSameLocationSimilarity = nearestLocation.similarity;
	row.seoScore = scoreBasics(row);
	row.contentScore = scoreContent(row);
	row.cannibalizationRisk = riskFor(row);
	row.status = statusFor(row);
}

mkdirSync(OUT_DIR, { recursive: true });

const csvColumns = [
	'priority',
	'status',
	'cannibalization_risk',
	'service',
	'intent_cluster',
	'location',
	'location_slug',
	'target_keyword',
	'url',
	'seo_score',
	'content_score',
	'word_count',
	'unique_word_count',
	'location_mentions',
	'service_keyword_mentions',
	'title',
	'title_chars',
	'title_has_location',
	'h1',
	'h1_count',
	'h1_has_location',
	'meta_description_chars',
	'description_has_location',
	'body_has_location',
	'canonical_path_ok',
	'robots_indexable',
	'sitemap_included',
	'has_service_schema',
	'has_faq_schema',
	'internal_links',
	'local_links',
	'incoming_internal_links',
	'linked_from_parent',
	'similarity_to_base_service',
	'nearest_same_service_url',
	'nearest_same_service_shingle_similarity',
	'nearest_same_service_template_url',
	'nearest_same_service_template_similarity',
	'nearest_same_service_location_masked_template_url',
	'nearest_same_service_location_masked_template_similarity',
	'nearest_same_location_url',
	'nearest_same_location_similarity',
	'json_ld_types',
];

const csvRows = rows.map((row) => ({
	priority: row.priority,
	status: row.status,
	cannibalization_risk: row.cannibalizationRisk,
	service: row.service,
	intent_cluster: row.intentCluster,
	location: row.location,
	location_slug: row.locationSlug,
	target_keyword: row.targetKeyword,
	url: row.url,
	seo_score: row.seoScore,
	content_score: row.contentScore,
	word_count: row.wordCount,
	unique_word_count: row.uniqueWordCount,
	location_mentions: row.locationMentions,
	service_keyword_mentions: row.serviceKeywordMentions,
	title: row.title,
	title_chars: row.titleLength,
	title_has_location: row.titleHasLocation,
	h1: row.h1,
	h1_count: row.h1Count,
	h1_has_location: row.h1HasLocation,
	meta_description_chars: row.descriptionLength,
	description_has_location: row.descriptionHasLocation,
	body_has_location: row.bodyHasLocation,
	canonical_path_ok: row.canonicalPathOk,
	robots_indexable: row.robotsIndexable,
	sitemap_included: row.sitemapIncluded,
	has_service_schema: row.hasServiceSchema,
	has_faq_schema: row.hasFaqSchema,
	internal_links: row.internalLinks,
	local_links: row.localLinks,
	incoming_internal_links: row.incomingInternalLinks,
	linked_from_parent: row.linkedFromParent,
	similarity_to_base_service: Number(row.baseSimilarity.toFixed(4)),
	nearest_same_service_url: row.nearestSameServiceRoute ? `https://kim-marie-borger.com${row.nearestSameServiceRoute}` : '',
	nearest_same_service_shingle_similarity: Number(row.nearestSameServiceSimilarity.toFixed(4)),
	nearest_same_service_template_url: row.nearestSameServiceTemplateRoute ? `https://kim-marie-borger.com${row.nearestSameServiceTemplateRoute}` : '',
	nearest_same_service_template_similarity: Number(row.nearestSameServiceTemplateSimilarity.toFixed(4)),
	nearest_same_service_location_masked_template_url: row.nearestSameServiceLocationMaskedTemplateRoute ? `https://kim-marie-borger.com${row.nearestSameServiceLocationMaskedTemplateRoute}` : '',
	nearest_same_service_location_masked_template_similarity: Number(row.nearestSameServiceLocationMaskedTemplateSimilarity.toFixed(4)),
	nearest_same_location_url: row.nearestSameLocationRoute ? `https://kim-marie-borger.com${row.nearestSameLocationRoute}` : '',
	nearest_same_location_similarity: Number(row.nearestSameLocationSimilarity.toFixed(4)),
	json_ld_types: row.jsonLdTypes,
}));

writeFileSync(
	CSV_FILE,
	`${csvColumns.join(',')}\n${csvRows.map((row) => csvColumns.map((column) => csvEscape(row[column])).join(',')).join('\n')}\n`,
);

const byService = [...groupBy(rows, (row) => row.service).entries()]
	.sort(([a], [b]) => a.localeCompare(b));
const byStatus = [...groupBy(rows, (row) => row.status).entries()]
	.sort(([a], [b]) => a.localeCompare(b));
const highRiskRows = rows.filter((row) => row.cannibalizationRisk === 'high');
const mediumRiskRows = rows.filter((row) => row.cannibalizationRisk === 'medium');
const highRiskPairs = [...highRiskRows]
	.sort((a, b) => b.nearestSameServiceSimilarity - a.nearestSameServiceSimilarity)
	.slice(0, 20);
const priorityBacklog = [...rows]
	.sort((a, b) => {
		const priorityOrder = { P1: 0, P2: 1, P3: 2 };
		const riskOrder = { high: 0, medium: 1, low: 2 };
		return priorityOrder[a.priority] - priorityOrder[b.priority]
			|| riskOrder[a.cannibalizationRisk] - riskOrder[b.cannibalizationRisk]
			|| a.contentScore - b.contentScore
			|| b.nearestSameServiceLocationMaskedTemplateSimilarity - a.nearestSameServiceLocationMaskedTemplateSimilarity;
	})
	.slice(0, 50);

const report = `# Local SEO Seiten-Tracker

Generiert: ${new Date().toISOString()}

Dieser Tracker bewertet die lokalen Seiten aus dem gerenderten HTML in \`dist/client\`. Die komplette Matrix liegt in \`${path.relative(process.cwd(), CSV_FILE).replace(/\\/g, '/')}\`; diese Datei ist die Arbeitsgrundlage fuer Filter, Priorisierung und SEO-Software.

## Warum diese Metriken?

- Google findet und bewertet Seiten unter anderem ueber crawlbare interne Links und Anchor-Texte: <https://developers.google.com/search/docs/crawling-indexing/links-crawlable>
- Sitemaps helfen Google, wichtige URLs effizienter zu crawlen: <https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview>
- Lokale Seiten brauchen eigenen, hilfreichen Hauptcontent, damit sie nicht wie reine Doorway- oder Massen-Seiten wirken: <https://developers.google.com/search/docs/essentials/spam-policies>

## Schwellenwerte

| Metrik | Gut | Warnung | Kritisch |
| --- | ---: | ---: | ---: |
| \`nearest_same_service_shingle_similarity\` | <= 0.54 | 0.55-0.67 | >= 0.68 |
| \`nearest_same_service_template_similarity\` | Monitoring | kein direkter Risiko-Ausloeser | gemeinsamer Aufbau erwartet |
| \`nearest_same_service_location_masked_template_similarity\` | Monitoring | verstaerkt Risiko bei hoher Content-Naehe | kein direkter Risiko-Ausloeser |
| \`similarity_to_base_service\` | <= 0.55 | 0.56-0.82 | >= 0.83 |
| \`content_score\` | >= 65 | 45-64 | < 45 |
| \`seo_score\` | >= 85 | 75-84 | < 75 |

## Gesamtstatus

| Kennzahl | Wert |
| --- | ---: |
| Lokale Seiten | ${rows.length} |
| High-Risk Content-Aehnlichkeit | ${highRiskRows.length} |
| Medium-Risk Content-Aehnlichkeit | ${mediumRiskRows.length} |
| Durchschnitt SEO-Score | ${Math.round(average(rows.map((row) => row.seoScore)))} |
| Durchschnitt Content-Score | ${Math.round(average(rows.map((row) => row.contentScore)))} |
| Durchschnitt Shingle Similarity Same Service | ${formatPercent(average(rows.map((row) => row.nearestSameServiceSimilarity)))} |
| Durchschnitt Template Similarity Same Service | ${formatPercent(average(rows.map((row) => row.nearestSameServiceTemplateSimilarity)))} |
| Durchschnitt Location-Masked Template Similarity | ${formatPercent(average(rows.map((row) => row.nearestSameServiceLocationMaskedTemplateSimilarity)))} |
| Durchschnitt Similarity Base Service | ${formatPercent(average(rows.map((row) => row.baseSimilarity)))} |

## Status-Verteilung

| Status | Seiten |
| --- | ---: |
${byStatus.map(([status, group]) => `| ${status} | ${group.length} |`).join('\n')}

## Service-Cluster

| Service | Seiten | Avg SEO | Avg Content | Avg Shingle | Avg Template | Avg Masked Template | High Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${byService.map(([service, group]) => {
	const high = group.filter((row) => row.cannibalizationRisk === 'high').length;
	return `| ${service} | ${group.length} | ${Math.round(average(group.map((row) => row.seoScore)))} | ${Math.round(average(group.map((row) => row.contentScore)))} | ${formatPercent(average(group.map((row) => row.nearestSameServiceSimilarity)))} | ${formatPercent(average(group.map((row) => row.nearestSameServiceTemplateSimilarity)))} | ${formatPercent(average(group.map((row) => row.nearestSameServiceLocationMaskedTemplateSimilarity)))} | ${high} |`;
}).join('\n')}

## High-Risk Content-Paare

${highRiskPairs.length ? `| Seite | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | ---: | ---: | ---: | --- |
${highRiskPairs.map((row) => `| [${row.targetKeyword}](${row.url}) | ${formatPercent(row.nearestSameServiceSimilarity)} | ${formatPercent(row.nearestSameServiceTemplateSimilarity)} | ${formatPercent(row.nearestSameServiceLocationMaskedTemplateSimilarity)} | ${row.nearestSameServiceRoute || '-'} |`).join('\n')}` : 'Keine High-Risk Content-Paare gefunden.'}

## Priorisierter Rewrite-Backlog

| Prio | Status | Risiko | Seite | Content | Shingle | Template | Masked Template | Naechste aehnliche Seite |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
${priorityBacklog.map((row) => `| ${row.priority} | ${row.status} | ${row.cannibalizationRisk} | [${row.targetKeyword}](${row.url}) | ${row.contentScore} | ${formatPercent(row.nearestSameServiceSimilarity)} | ${formatPercent(row.nearestSameServiceTemplateSimilarity)} | ${formatPercent(row.nearestSameServiceLocationMaskedTemplateSimilarity)} | ${row.nearestSameServiceLocationMaskedTemplateRoute || '-'} |`).join('\n')}

## Spalten in der CSV

- \`priority\`: heuristische SEO-Prioritaet nach Leistung und Ort.
- \`status\`: Arbeitsstatus aus SEO-Score, Content-Score und Aehnlichkeitsrisiko.
- \`cannibalization_risk\`: eigenes Warnsignal fuer sehr aehnliche Seiten im selben Leistungscluster.
- \`intent_cluster\`: Suchintention, die diese URL besetzen soll.
- \`seo_score\`: technische Onpage-Basics wie Title, H1, Meta Description, Canonical, Schema, Sitemap und interne Links.
- \`content_score\`: Texttiefe, Ortsnennung, Abstand zur Basisleistung und Abstand zur aehnlichsten Seite im selben Cluster.
- \`similarity_to_base_service\`: Textaehnlichkeit zur Hauptleistungsseite.
- \`nearest_same_service_shingle_similarity\`: 5-Wort-Shingle-Aehnlichkeit. Dieser Wert ist der primaere Ausloeser fuer Content-Kannibalisierung, weil er echte Satz- und Absatznaehe misst.
- \`nearest_same_service_template_similarity\`: Token-Overlap im selben Leistungscluster. Dieser Wert bleibt sichtbar, loest aber kein Risiko allein aus, weil Layout, Bilder und Grundstruktur bewusst von der Hauptleistungsseite geerbt werden.
- \`nearest_same_service_location_masked_template_similarity\`: Token-Overlap, nachdem bekannte Ortsnamen zu einem Platzhalter normalisiert wurden. Dieser Wert verstaerkt ein Risiko nur, wenn auch die Content-Aehnlichkeit hoch ist.
- \`nearest_same_location_similarity\`: Textaehnlichkeit zu anderen Leistungen im selben Ort.

## Naechster Arbeitsschritt

Die High-/Medium-Risk-Seiten und P1-Seiten mit \`improve-copy\` sollten zuerst eigene Textmodule bekommen: staerkerer lokaler Einstieg, andere Zwischenueberschriften, orts- und leistungsbezogene FAQ, konkrete Anlass-Momente und mehr semantische Keyword-Varianten. Bilder und Layout koennen weiter von der Hauptleistungsseite geerbt werden.
`;

writeFileSync(REPORT_FILE, report);

console.log(`Local SEO tracker written:`);
console.log(`- ${path.relative(process.cwd(), CSV_FILE).replace(/\\/g, '/')}`);
console.log(`- ${path.relative(process.cwd(), REPORT_FILE).replace(/\\/g, '/')}`);
console.log(`Pages: ${rows.length}`);
console.log(`High risk: ${highRiskRows.length}`);
console.log(`Medium risk: ${mediumRiskRows.length}`);
console.log(`Average SEO score: ${Math.round(average(rows.map((row) => row.seoScore)))}`);
console.log(`Average content score: ${Math.round(average(rows.map((row) => row.contentScore)))}`);
console.log(`Average template similarity: ${formatPercent(average(rows.map((row) => row.nearestSameServiceTemplateSimilarity)))}`);
console.log(`Average location-masked template similarity: ${formatPercent(average(rows.map((row) => row.nearestSameServiceLocationMaskedTemplateSimilarity)))}`);
