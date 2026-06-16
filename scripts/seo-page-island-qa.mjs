import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');
const CONTENT_DIR = path.resolve('src/content/seo-pages');
const DEFAULT_ORIGIN = 'https://kim-marie-borger.com';
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

if (!existsSync(DIST)) {
	console.error('dist/client not found. Run npm run build:local first.');
	process.exit(1);
}

if (!existsSync(CONTENT_DIR)) {
	console.error('src/content/seo-pages not found.');
	process.exit(1);
}

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
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
	return path.join(DIST, relative, 'index.html');
}

function sitemapPaths() {
	const xml = walk(DIST)
		.filter((file) => /^sitemap-\d+\.xml$/.test(path.basename(file)))
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');
	return new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => normalizeRoute(match[1])));
}

function endpointFor(doc) {
	const params = new URLSearchParams({
		pageKind: doc.pageKind,
		serviceSlug: doc.serviceSlug,
		pageSlug: doc.pageSlug,
	});
	return `${baseUrl}/tina-island/seoPage/?${params.toString()}`;
}

async function fetchText(url, options = {}) {
	const response = await fetch(url, {
		...options,
		signal: AbortSignal.timeout(20_000),
	});
	const text = await response.text();
	return { response, text };
}

const docs = walk(CONTENT_DIR)
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
		const marker = `data-tina-island="/tina-island/seoPage/`;
		const pageMarkerOk = html.includes(marker)
			&& html.includes('data-tina-island-primary')
			&& html.includes('<main');
		summary.routeHtml += 1;
		if (pageMarkerOk) summary.seoPageMarker += 1;
		else failures.push({ type: 'static-route', route, file, message: 'route exists but missing primary seoPage Tina island marker' });
	} else {
		failures.push({ type: 'static-route', route, file, message: 'route HTML not found in dist/client' });
	}

	if (!baseUrl) continue;

	try {
		const publicUrl = `${baseUrl}${route}`;
		const { response, text } = await fetchText(publicUrl);
		const ok = response.status === 200
			&& text.includes('<main')
			&& text.includes('data-tina-island="/tina-island/seoPage/');
		if (ok) summary.httpRoute += 1;
		else failures.push({ type: 'http-route', route, file, status: response.status, message: 'public route did not render expected seoPage island marker' });
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
		const endpointOk = response.status === 200
			&& text.includes('data-tina-form')
			&& text.includes('seoPage');
		const primaryOk = text.includes('data-tina-primary');
		if (endpointOk) summary.httpEndpoint += 1;
		if (primaryOk) summary.httpPrimary += 1;
		if (!endpointOk || !primaryOk) {
			failures.push({
				type: 'http-endpoint',
				route,
				file,
				status: response.status,
				message: `endpointOk=${endpointOk}; primaryOk=${primaryOk}`,
			});
		}
	} catch (error) {
		failures.push({ type: 'http-endpoint', route, file, message: error.message });
	}
}

summary.failures = failures.length;

console.log('SEO page Tina QA');
console.log(`- docs: ${summary.docs}`);
console.log(`- CMS docs enabled/complete: ${summary.cmsDocs}/${summary.docs}`);
console.log(`- static route HTML: ${summary.routeHtml}/${summary.docs}`);
console.log(`- sitemap coverage: ${summary.sitemap}/${summary.docs}`);
console.log(`- static seoPage island markers: ${summary.seoPageMarker}/${summary.docs}`);
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
		console.log(`- ${failure.type} ${failure.route}: ${failure.message}${failure.status ? ` (${failure.status})` : ''}`);
	}
	process.exit(1);
}
