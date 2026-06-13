import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist/client');
const OUT_DIR = path.resolve('src/content/seo-pages');
const OVERWRITE = process.argv.includes('--overwrite');

const SERVICES = new Set(['hochzeiten', 'beerdigungen', 'firmenfeiern', 'geburtstage', 'taufen', 'konzerte', 'unterricht']);
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

const SERVICE_KEYWORDS = {
	hochzeiten: 'Hochzeitsmusik',
	beerdigungen: 'Trauermusik',
	firmenfeiern: 'Live Musik Firmenevent',
	geburtstage: 'Live Musik Geburtstag',
	taufen: 'Taufmusik',
	konzerte: 'Viola Konzert',
	unterricht: 'Bratschenunterricht',
};

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
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function attr(tag, name) {
	const match = tag.match(new RegExp(`\\s${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i'));
	return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function firstText(html, pattern) {
	const match = html.match(pattern);
	return match ? stripHtml(match[1]) : '';
}

function titleFromHtml(html) {
	return firstText(html, /<title>([\s\S]*?)<\/title>/i);
}

function descriptionFromHtml(html) {
	const tag = html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '';
	return attr(tag, 'content');
}

function extractHero(html) {
	const h1 = firstText(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
	const h1Index = html.search(/<h1\b/i);
	const afterH1 = h1Index >= 0 ? html.slice(h1Index, h1Index + 2500) : html;
	return {
		title: h1,
		lead: firstText(afterH1, /<p\b[^>]*class=["'][^"']*\blead\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
	};
}

function extractSplit(html) {
	const start = html.search(/<div\b[^>]*class=["'][^"']*\bcopy\b/i);
	if (start < 0) return undefined;
	const segment = html.slice(start, html.indexOf('</section>', start) > start ? html.indexOf('</section>', start) : start + 5000);
	const paragraphs = [...segment.matchAll(/<p\b[^>]*class=["'][^"']*\blead\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)]
		.map((match) => stripHtml(match[1]))
		.filter(Boolean)
		.slice(0, 4);
	return cleanObject({
		eyebrow: firstText(segment, /<p\b[^>]*class=["'][^"']*\beyebrow\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
		title: firstText(segment, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i),
		lede: firstText(segment, /<p\b[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
		paragraphs,
	});
}

function extractFocus(html) {
	const start = html.search(/<ol\b[^>]*class=["'][^"']*\btimeline\b/i);
	if (start < 0) return undefined;
	const sectionStart = html.lastIndexOf('<section', start);
	const section = html.slice(sectionStart >= 0 ? sectionStart : start, html.indexOf('</section>', start) > start ? html.indexOf('</section>', start) : start + 7000);
	const items = [...section.matchAll(/<li\b[\s\S]*?<\/li>/gi)]
		.map((match) => {
			const li = match[0];
			return cleanObject({
				kicker: firstText(li, /<span\b[^>]*class=["'][^"']*\btl-k\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
				title: firstText(li, /<h3\b[^>]*>([\s\S]*?)<\/h3>/i),
				text: firstText(li, /<p\b[^>]*>([\s\S]*?)<\/p>/i),
				piece: firstText(li, /<span\b[^>]*class=["'][^"']*\btl-piece\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
			});
		})
		.filter((item) => item.title || item.text);
	return cleanObject({
		eyebrow: firstText(section, /<p\b[^>]*class=["'][^"']*\beyebrow\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
		title: firstText(section, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i),
		lead: firstText(section, /<p\b[^>]*class=["'][^"']*\blead\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
		items,
	});
}

function extractFaq(html) {
	const details = [...html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/gi)]
		.map((match) => {
			const body = match[2];
			const question = firstText(body, /<summary\b[^>]*>([\s\S]*?)<\/summary>/i).replace(/\+$/, '').trim();
			const answer = firstText(body, /<p\b[^>]*>([\s\S]*?)<\/p>/i);
			return cleanObject({ question, answer, open: /\bopen\b/i.test(match[1]) || undefined });
		})
		.filter((item) => item.question && item.answer);
	if (!details.length) return undefined;
	const faqIndex = html.search(/<div\b[^>]*class=["'][^"']*\bfaq\b/i);
	const sectionStart = faqIndex >= 0 ? html.lastIndexOf('<section', faqIndex) : -1;
	const section = sectionStart >= 0 ? html.slice(sectionStart, faqIndex + 3000) : html;
	return cleanObject({
		eyebrow: firstText(section, /<p\b[^>]*class=["'][^"']*\beyebrow\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i),
		title: firstText(section, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i),
		items: details,
	});
}

function extractImageAlts(html) {
	const seen = new Set();
	return [...html.matchAll(/<img\b[^>]*>/gi)]
		.map((match) => {
			const tag = match[0];
			const src = attr(tag, 'src');
			const alt = attr(tag, 'alt');
			return { src, alt };
		})
		.filter((item) => item.src && item.src.startsWith('/uploads/') && !seen.has(item.src) && seen.add(item.src))
		.slice(0, 12);
}

function slugToLabel(slug) {
	return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function targetKeyword(pageKind, serviceSlug, pageSlug, title, heroTitle) {
	if (pageKind === 'local') {
		const titleLead = title.split('|')[0].replace(/\s+-\s+.*$/, '').trim();
		return titleLead || `${SERVICE_KEYWORDS[serviceSlug] ?? serviceSlug} ${slugToLabel(pageSlug)}`;
	}
	const titleLead = title.split('|')[0].trim();
	return titleLead || heroTitle || slugToLabel(pageSlug);
}

function contactFor(doc) {
	return {
		eyebrow: 'Anfrage',
		title: `${doc.targetKeyword} anfragen`,
		lead: `Schreib mir kurz, was du planst. Ich melde mich persoenlich mit einer passenden Idee fuer ${doc.targetKeyword}.`,
		checklist: [doc.targetKeyword, 'Wunschmusik', 'Termin & Ort'],
		formEyebrow: 'Direkt anfragen',
		formTitle: `Passt ${doc.targetKeyword} zu deinem Anlass?`,
		formSuccess: 'Vielen Dank - deine Anfrage ist angekommen. Ich melde mich persoenlich bei dir.',
	};
}

function cleanObject(value) {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => {
			if (Array.isArray(item)) return item.length > 0;
			return item !== undefined && item !== null && item !== '';
		}),
	);
}

function seoRouteFiles() {
	return walk(DIST)
		.filter((file) => file.endsWith('index.html'))
		.map((file) => ({ file, route: routeFromFile(file) }))
		.filter(({ route }) => {
			const parts = route.split('/').filter(Boolean);
			return parts.length === 2 && SERVICES.has(parts[0]);
		});
}

let created = 0;
let kept = 0;

for (const { file, route } of seoRouteFiles()) {
	const [, serviceSlug, pageSlug] = route.match(/^\/([^/]+)\/([^/]+)\/$/) ?? [];
	if (!serviceSlug || !pageSlug) continue;
	const pageKind = LOCAL_SLUGS.has(pageSlug) ? 'local' : 'topic';
	const html = readFileSync(file, 'utf8');
	const title = titleFromHtml(html);
	const description = descriptionFromHtml(html);
	const hero = extractHero(html);
	const doc = cleanObject({
		pageKind,
		serviceSlug,
		pageSlug,
		route,
		targetKeyword: targetKeyword(pageKind, serviceSlug, pageSlug, title, hero.title),
		intentCluster: pageKind === 'local' ? `${serviceSlug}:local` : `${serviceSlug}:topic`,
		priority: pageKind === 'topic' ? 'P2' : 'P3',
		status: 'seeded-needs-editorial-rewrite',
		enabled: true,
		seoTitle: title,
		seoDescription: description,
		hero,
		split: extractSplit(html),
		focus: extractFocus(html),
		faq: extractFaq(html),
		contact: undefined,
		imageAlts: extractImageAlts(html),
		editorNotes: 'Automatisch aus dem aktuellen Build geseedet. Bitte redaktionell pruefen, staerker differenzieren und bei wichtigen Seiten als ready markieren.',
	});
	doc.contact = contactFor(doc);

	const outDir = path.join(OUT_DIR, serviceSlug);
	const outFile = path.join(outDir, `${pageSlug}.json`);
	if (existsSync(outFile) && !OVERWRITE) {
		kept += 1;
		continue;
	}
	mkdirSync(outDir, { recursive: true });
	writeFileSync(outFile, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
	created += 1;
}

console.log(`SEO page override sync complete. created=${created} kept=${kept} overwrite=${OVERWRITE}`);
