import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');
const MAX_ISSUE_GROUPS_TO_PRINT = 40;

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

function relPage(file) {
	return `/${path.relative(DIST, file).replace(/\\/g, '/').replace(/index.html$/, '').replace(/^404.html$/, '404')}`;
}

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

const issues = [];
const htmlFiles = walk(DIST)
	.filter((file) => file.endsWith('.html'))
	.filter((file) => !file.includes(`${path.sep}admin${path.sep}`));

const canonicalUrls = new Map();

for (const file of htmlFiles.sort()) {
	const page = relPage(file);
	const html = readFileSync(file, 'utf8');
	const is404 = page === '/404';
	const title = stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
	const description = attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
	const canonical = attr(html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0] ?? '', 'href') ?? '';
	const robots = attr(html.match(/<meta\s+name=["']robots["'][^>]*>/i)?.[0] ?? '', 'content') ?? '';
	const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripHtml(match[1]));
	const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
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
	if (!is404 && h1s.length !== 1) issues.push(['error', page, `expected exactly one h1, found ${h1s.length}`]);

	for (const tag of imageTags) {
		const hasAlt = attr(tag, 'alt') !== undefined;
		const alt = attr(tag, 'alt') ?? '';
		const hidden = /aria-hidden=["']true["']/i.test(tag);
		if (!hasAlt) issues.push(['error', page, `image without alt: ${tag.slice(0, 90)}...`]);
		if (hasAlt && alt.trim() === '' && !hidden) {
			issues.push(['warn', page, `empty alt on non-hidden image: ${tag.slice(0, 90)}...`]);
		}
	}

	if (/<a\b[^>]*href=["'][^"']+\.html(?:[#?][^"']*)?["']/i.test(html)) {
		issues.push(['error', page, 'contains link to legacy .html URL']);
	}

	for (const [, json] of jsonLdBlocks) {
		try {
			JSON.parse(decodeHtml(json));
		} catch {
			issues.push(['error', page, 'invalid JSON-LD']);
		}
	}

	if (/\[(?:VORNAME|NACHNAME|MONAT|JAHR|OPTIONAL|HINWEIS)\b|Platzhalter|echtes Gästezitat folgt/i.test(stripHtml(html))) {
		issues.push(['warn', page, 'visible placeholder text remains']);
	}
}

for (const [canonical, pages] of canonicalUrls.entries()) {
	if (pages.length > 1) {
		issues.push(['error', pages.join(', '), `duplicate canonical URL: ${canonical}`]);
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

console.log(`\nSEO audit: ${errors.length} errors, ${warnings.length} warnings across ${htmlFiles.length} HTML pages.`);

if (errors.length > 0) process.exit(1);
