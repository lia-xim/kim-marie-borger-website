import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { relativePath, resolveStaticOutputDirOrExit, staticOutputArg, walkFiles } from './lib/static-output.mjs';

const CONTENT_DIR = path.resolve('src/content/seo-pages');
const PREVIEW_CONTENT_TYPE = 'application/x-tina-preview+json';

const args = new Map(
	process.argv.slice(2)
		.filter((arg) => arg.startsWith('--'))
		.map((arg) => {
			const [key, ...value] = arg.slice(2).split('=');
			return [key, value.join('=') || 'true'];
		}),
);

const baseUrl = normalizeBaseUrl(args.get('base-url') ?? process.env.SEO_QA_BASE_URL ?? '');
const failOnMissingHttp = args.get('require-http') === 'true';
const output = resolveStaticOutputDirOrExit({ requestedDir: args.get('static-dir') ?? args.get('static-output') ?? staticOutputArg() });

if (!existsSync(CONTENT_DIR)) {
	console.error('src/content/seo-pages not found.');
	process.exit(1);
}

function normalizeBaseUrl(value) {
	if (!value) return '';
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function normalizeRoute(value) {
	if (!value) return '';
	if (/^https?:\/\//i.test(value)) {
		try {
			return normalizeRoute(new URL(value).pathname);
		} catch {
			return '';
		}
	}
	const route = value.startsWith('/') ? value : `/${value}`;
	return route.endsWith('/') ? route : `${route}/`;
}

function readJson(file) {
	try {
		return JSON.parse(readFileSync(file, 'utf8'));
	} catch (error) {
		throw new Error(`${file}: ${error.message}`);
	}
}

function routeFile(route) {
	const relative = route.replace(/^\/|\/$/g, '');
	return path.join(output.root, relative, 'index.html');
}

function sitemapPaths() {
	const xml = walkFiles(output.root)
		.filter((file) => /sitemap.*\.xml$/i.test(path.basename(file)))
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');
	return new Set(
		[...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
			.map((match) => normalizeRoute(match[1]))
			.filter((route) => route && !/\/sitemap(?:-\d+|-index)?\.xml\/?$/i.test(route)),
	);
}

function endpointFor(doc) {
	const params = new URLSearchParams({
		pageKind: doc.pageKind,
		serviceSlug: doc.serviceSlug,
		pageSlug: doc.pageSlug,
	});
	return `${baseUrl}/tina-island/seoPage/?${params.toString()}`;
}

function decodeHtml(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
}

function visibleText(html) {
	return decodeHtml(html)
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeText(value) {
	return visibleText(String(value ?? '')).toLowerCase();
}

function countMatches(value, pattern) {
	return [...value.matchAll(pattern)].length;
}

function expectedHeroText(doc) {
	return normalizeText(doc.hero?.title ?? doc.targetKeyword ?? doc.seoTitle ?? '');
}

function containsExpectedHero(html, doc) {
	const expected = expectedHeroText(doc);
	if (!expected) return false;
	return normalizeText(html).includes(expected);
}

function addVisibleFieldRequirement(requirements, htmlText, path, value) {
	const text = normalizeText(value ?? '');
	if (text.length < 8) return;
	if (/\.(kicker|time|rom)$/.test(path)) return;
	if (htmlText.includes(text)) requirements.add(path);
}

function expectedSeoFieldPaths(doc, html) {
	const htmlText = normalizeText(html);
	const requirements = new Set();
	const usesSplit = doc.serviceSlug !== 'beerdigungen';
	const usesFocus = doc.serviceSlug !== 'beerdigungen';
	const usesElegy = doc.serviceSlug === 'beerdigungen';
	const usesSolemn = doc.serviceSlug === 'beerdigungen';

	for (const field of ['eyebrow', 'title', 'lead', 'badge']) {
		addVisibleFieldRequirement(requirements, htmlText, `seoPage.hero.${field}`, doc.hero?.[field]);
	}

	if (usesSplit) {
		const splitSections = (doc.split?.sections ?? []).filter(Boolean);
		if (splitSections.length > 0) {
			for (const [sectionIndex, section] of splitSections.entries()) {
				for (const field of ['eyebrow', 'title', 'lede']) {
					addVisibleFieldRequirement(requirements, htmlText, `seoPage.split.sections.${sectionIndex}.${field}`, section?.[field]);
				}
				for (const [paragraphIndex, value] of (section?.paragraphs ?? []).entries()) {
					addVisibleFieldRequirement(requirements, htmlText, `seoPage.split.sections.${sectionIndex}.paragraphs.${paragraphIndex}`, value);
				}
			}
			addVisibleFieldRequirement(requirements, htmlText, 'seoPage.split.seal', doc.split?.seal);
		} else {
			for (const field of ['eyebrow', 'title', 'lede', 'seal']) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.split.${field}`, doc.split?.[field]);
			}
			for (const [index, value] of (doc.split?.paragraphs ?? []).entries()) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.split.paragraphs.${index}`, value);
			}
		}
	}

	if (usesFocus) {
		for (const field of ['eyebrow', 'title', 'lead', 'heading', 'subtitle', 'footnote']) {
			addVisibleFieldRequirement(requirements, htmlText, `seoPage.focus.${field}`, doc.focus?.[field]);
		}
		for (const [index, item] of (doc.focus?.items ?? []).entries()) {
			for (const field of ['time', 'kicker', 'title', 'text', 'detail', 'piece']) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.focus.items.${index}.${field}`, item?.[field]);
			}
		}
	}

	if (usesElegy) {
		addVisibleFieldRequirement(requirements, htmlText, 'seoPage.elegy.quote', doc.elegy?.quote);
		for (const [index, item] of (doc.elegy?.passages ?? []).entries()) {
			for (const field of ['strong', 'text']) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.elegy.passages.${index}.${field}`, item?.[field]);
			}
		}
	}

	if (usesSolemn) {
		for (const field of ['eyebrow', 'title', 'lead', 'listLabel']) {
			addVisibleFieldRequirement(requirements, htmlText, `seoPage.solemn.${field}`, doc.solemn?.[field]);
		}
		for (const [index, value] of (doc.solemn?.list ?? []).entries()) {
			addVisibleFieldRequirement(requirements, htmlText, `seoPage.solemn.list.${index}`, value);
		}
		for (const [cardIndex, card] of (doc.solemn?.cards ?? []).entries()) {
			for (const field of ['rom', 'title', 'poet', 'linkLabel']) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.solemn.cards.${cardIndex}.${field}`, card?.[field]);
			}
			for (const [listIndex, value] of (card?.list ?? []).entries()) {
				addVisibleFieldRequirement(requirements, htmlText, `seoPage.solemn.cards.${cardIndex}.list.${listIndex}`, value);
			}
		}
	}

	for (const field of ['eyebrow', 'title']) {
		addVisibleFieldRequirement(requirements, htmlText, `seoPage.faq.${field}`, doc.faq?.[field]);
	}
	for (const [index, item] of (doc.faq?.items ?? []).entries()) {
		for (const field of ['question', 'answer']) {
			addVisibleFieldRequirement(requirements, htmlText, `seoPage.faq.items.${index}.${field}`, item?.[field]);
		}
	}

	for (const field of ['eyebrow', 'title', 'lead', 'formEyebrow', 'formTitle', 'formSuccess']) {
		addVisibleFieldRequirement(requirements, htmlText, `seoPage.contact.${field}`, doc.contact?.[field]);
	}
	for (const [index, value] of (doc.contact?.checklist ?? []).entries()) {
		addVisibleFieldRequirement(requirements, htmlText, `seoPage.contact.checklist.${index}`, value);
	}

	return [...requirements];
}

function missingSeoFieldPaths(doc, html) {
	const required = expectedSeoFieldPaths(doc, html);
	return required.filter((fieldPath) => !html.includes(`---${fieldPath}`));
}

function seoPageIslandMarkers(html) {
	return [...html.matchAll(/data-tina-island="([^"]*\/tina-island\/seoPage\/[^"]*)"/g)]
		.map((match) => decodeHtml(match[1]));
}

async function fetchText(url, options = {}) {
	const response = await fetch(url, {
		...options,
		signal: AbortSignal.timeout(20_000),
	});
	const text = await response.text();
	return { response, text };
}

function formatFailure(failure) {
	const route = failure.route || '(no route)';
	const file = failure.file ? ` [${relativePath(failure.file)}]` : '';
	const status = failure.status ? ` status=${failure.status}` : '';
	return `- ${failure.type} ${route}${status}: ${failure.message}${file}`;
}

const docs = walkFiles(CONTENT_DIR)
	.filter((file) => file.endsWith('.json'))
	.sort()
	.map((file) => ({ file, doc: readJson(file) }));

const paths = sitemapPaths();
const failures = [];
const summary = {
	docs: docs.length,
	cmsDocs: 0,
	routeHtml: 0,
	sitemap: 0,
	seoPageMarker: 0,
	seoFieldCoverage: 0,
	longSplitChunking: 0,
	httpRoute: 0,
	httpEndpoint: 0,
	httpPrimary: 0,
	failures: 0,
};

for (const { file, doc } of docs) {
	const route = normalizeRoute(doc.route);
	const expectedFile = routeFile(route);
	const basicFieldsOk = doc.pageKind && doc.serviceSlug && doc.pageSlug && route && doc.enabled !== false;
	if (basicFieldsOk) summary.cmsDocs += 1;
	else failures.push({ type: 'cms-doc', route, file, message: 'missing required SEO-page fields or disabled override' });

	if (paths.has(route)) summary.sitemap += 1;
	else failures.push({ type: 'sitemap', route, file, message: 'route missing from sitemap' });

	if (existsSync(expectedFile)) {
		const html = readFileSync(expectedFile, 'utf8');
		const markers = seoPageIslandMarkers(html);
		const expectedEndpoint = endpointFor(doc).replace(baseUrl, '');
		const pageMarkerOk = markers.includes(expectedEndpoint)
			&& html.includes('data-tina-island-primary')
			&& html.includes('<main')
			&& containsExpectedHero(html, doc);
		summary.routeHtml += 1;
		if (pageMarkerOk) summary.seoPageMarker += 1;
		else failures.push({ type: 'static-route', route, file, message: 'route exists but missing primary seoPage Tina island marker or expected hero text' });

		const missingFields = missingSeoFieldPaths(doc, html);
		if (missingFields.length === 0) summary.seoFieldCoverage += 1;
		else failures.push({ type: 'static-tina-fields', route, file, message: `visible SEO text missing Tina field paths: ${missingFields.slice(0, 8).join(', ')}` });

		const splitCount = doc.split?.paragraphs?.length ?? 0;
		const splitSectionCount = doc.split?.sections?.length ?? 0;
		const splitChunked = splitSectionCount > 0
			? splitSectionCount <= 4 && html.includes('split-section')
			: splitCount <= 5 || html.includes('split-more');
		if (splitChunked) summary.longSplitChunking += 1;
		else failures.push({ type: 'static-split-layout', route, file, message: `split has ${splitSectionCount || splitCount} text units but no supported continuation layout` });
	} else {
		failures.push({ type: 'static-route', route, file, message: `route HTML not found in ${relativePath(output.root)}` });
	}

	if (!baseUrl) continue;

	try {
		const publicUrl = `${baseUrl}${route}`;
		const { response, text } = await fetchText(publicUrl);
		const ok = response.status === 200
			&& text.includes('<main')
			&& seoPageIslandMarkers(text).includes(endpointFor(doc).replace(baseUrl, ''))
			&& containsExpectedHero(text, doc);
		if (ok) summary.httpRoute += 1;
		else failures.push({ type: 'http-route', route, file, status: response.status, message: 'public route did not render expected seoPage island marker and hero text' });
	} catch (error) {
		failures.push({ type: 'http-route', route, file, message: error.message });
	}

	try {
		const { response, text } = await fetchText(endpointFor(doc), {
			method: 'POST',
			headers: {
				'content-type': PREVIEW_CONTENT_TYPE,
				'X-Tina-Prime': '1',
			},
			body: '{}',
		});
		const sectionCount = countMatches(text, /<section\b/gi);
		const emptySeoOverrideBlocks = /data-tina-field="[^"]*seoPage\.(hero|split|focus|faq)"[^>]*><\/div>/i.test(text);
		const endpointOk = response.status === 200
			&& text.includes('data-tina-form')
			&& text.includes('seoPage')
			&& text.includes('<main')
			&& text.includes('<h1')
			&& sectionCount >= 3
			&& !emptySeoOverrideBlocks
			&& containsExpectedHero(text, doc);
		const primaryOk = text.includes('data-tina-primary');
		if (endpointOk) summary.httpEndpoint += 1;
		if (primaryOk) summary.httpPrimary += 1;
		if (!endpointOk || !primaryOk) {
			failures.push({
				type: 'http-endpoint',
				route,
				file,
				status: response.status,
				message: `endpointOk=${endpointOk}; primaryOk=${primaryOk}; sections=${sectionCount}; emptySeoOverrideBlocks=${emptySeoOverrideBlocks}`,
			});
		}
	} catch (error) {
		failures.push({ type: 'http-endpoint', route, file, message: error.message });
	}
}

summary.failures = failures.length;

console.log('SEO page Tina QA');
console.log(`- static output: ${output.relative} (${output.htmlCount} HTML files, ${output.sitemapCount} sitemap files)`);
console.log(`- docs: ${summary.docs}`);
console.log(`- CMS docs enabled/complete: ${summary.cmsDocs}/${summary.docs}`);
console.log(`- static route HTML: ${summary.routeHtml}/${summary.docs}`);
console.log(`- sitemap coverage: ${summary.sitemap}/${summary.docs}`);
console.log(`- static seoPage island markers: ${summary.seoPageMarker}/${summary.docs}`);
console.log(`- static visible SEO fields editable: ${summary.seoFieldCoverage}/${summary.docs}`);
console.log(`- static long split text chunking: ${summary.longSplitChunking}/${summary.docs}`);
if (baseUrl) {
	console.log(`- HTTP public routes: ${summary.httpRoute}/${summary.docs}`);
	console.log(`- HTTP Tina island endpoints: ${summary.httpEndpoint}/${summary.docs}`);
	console.log(`- HTTP primary form payloads: ${summary.httpPrimary}/${summary.docs}`);
} else {
	console.log('- HTTP checks skipped: pass --base-url=http://127.0.0.1:4323 or set SEO_QA_BASE_URL.');
}
console.log(`- failures: ${summary.failures}`);

if (failOnMissingHttp && !baseUrl) {
	console.error('HTTP checks are required, but no --base-url/SEO_QA_BASE_URL was provided.');
	process.exit(1);
}

if (failures.length > 0) {
	console.log('\nFailure samples:');
	for (const failure of failures.slice(0, 20)) {
		console.log(formatFailure(failure));
	}
	process.exit(1);
}
