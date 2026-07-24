#!/usr/bin/env node
// Meldet neue, geaenderte und geloeschte Seiten per IndexNow an die
// teilnehmenden Suchmaschinen (Bing, Yandex, Seznam, Naver, Yep, ...) —
// ein einziger POST an api.indexnow.org verteilt die URLs an alle.
// DuckDuckGo und Ecosia bedienen sich aus dem Bing-Index und profitieren mit.
// Google unterstuetzt IndexNow nicht und liest stattdessen die Sitemap.
//
// Modi:
//   --all              alle URLs der Live-Sitemap melden (Erst-Submission)
//   --state <datei>    nur Aenderungen seit dem in der State-Datei gemerkten
//                      Commit melden; ohne brauchbaren State: Voll-Submission.
//                      Nach Erfolg wird der aktuelle Commit dort vermerkt.
//   --from <sha>       expliziter Diff-Startpunkt (statt State-Datei)
//   --dry-run          nur anzeigen, was gemeldet wuerde — nichts senden
//
// Laeuft ohne npm-Dependencies (Node >= 18: fetch ist eingebaut). Wird von
// .github/workflows/indexnow.yml nach jedem Production-Deployment aufgerufen.

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = (process.env.SITE_URL || 'https://kim-marie-borger.com').replace(/\/$/, '');
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_POST = 10000;
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FULL = args.includes('--all');
const STATE_FILE = argValue('--state');
const FROM_ARG = argValue('--from');

/** @param {string} flag */
function argValue(flag) {
	const i = args.indexOf(flag);
	return i >= 0 ? args[i + 1] : undefined;
}

/** Der IndexNow-Key liegt als <key>.txt in public/ — Dateiname = Key. */
function findKey() {
	const candidate = readdirSync(new URL('../public', import.meta.url))
		.find((name) => /^[0-9a-f]{16,64}\.txt$/.test(name));
	if (!candidate) throw new Error('Kein IndexNow-Key (public/<hex>.txt) gefunden.');
	return candidate.replace(/\.txt$/, '');
}

/** @param {string[]} gitArgs */
function git(gitArgs) {
	return execFileSync('git', gitArgs, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
}

/** @param {string} url */
async function fetchText(url) {
	const res = await fetch(url, { redirect: 'follow' });
	if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
	return res.text();
}

/** @param {string} xml */
function extractLocs(xml) {
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
		.map((m) => m[1].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
}

/** Alle Seiten-URLs aus der Live-Sitemap (Index -> Chunks -> URLs). */
async function fetchSitemapUrls() {
	const index = await fetchText(`${SITE}/sitemap-index.xml`);
	const chunkUrls = extractLocs(index);
	const urls = [];
	for (const chunkUrl of chunkUrls) {
		urls.push(...extractLocs(await fetchText(chunkUrl)));
	}
	return urls;
}

/**
 * Mappt eine geaenderte Repo-Datei auf betroffene Routen.
 * @param {string} file
 * @returns {{routes?: string[], ratgeber?: boolean, full?: boolean}}
 */
function routesForFile(file) {
	const page = file.match(/^src\/content\/page\/([^/]+)\.mdx$/);
	if (page) return { routes: [page[1] === 'home' ? '/' : `/${page[1]}/`] };

	const seoPage = file.match(/^src\/content\/seo-pages\/([^/]+)\/([^/]+)\.json$/);
	if (seoPage) return { routes: [`/${seoPage[1]}/${seoPage[2]}/`] };

	// Der komplette Ratgeber rendert aus dieser einen Quelldatei.
	if (file === 'src/lib/ratgeber.ts') return { ratgeber: true };

	// Layouts, Komponenten, Seiten-Templates, globale Config, Redirects:
	// potenziell auf jeder Seite sichtbar -> alles melden.
	if (file.startsWith('src/') || file === 'astro.config.mjs' || file === 'vercel.json') {
		return { full: true };
	}

	// Build-Tooling, CI, Doku, Assets usw. aendern den indexierten Inhalt nicht.
	return {};
}

/**
 * @param {string} from
 * @param {string} to
 * @param {string[]} sitemapUrls
 */
function urlsForDiff(from, to, sitemapUrls) {
	const changedFiles = git(['diff', '--name-only', '--no-renames', `${from}..${to}`])
		.split('\n').map((l) => l.trim()).filter(Boolean);
	const routes = new Set();
	for (const file of changedFiles) {
		const mapped = routesForFile(file);
		if (mapped.full) {
			console.log(`Strukturelle Aenderung (${file}) -> alle Seiten werden gemeldet.`);
			return sitemapUrls;
		}
		if (mapped.ratgeber) {
			for (const url of sitemapUrls) {
				if (new URL(url).pathname.startsWith('/ratgeber')) routes.add(new URL(url).pathname);
			}
		}
		for (const route of mapped.routes ?? []) routes.add(route);
	}
	return [...routes].map((route) => `${SITE}${route}`);
}

/**
 * @param {string} key
 * @param {string[]} urls
 */
async function submit(key, urls) {
	for (let i = 0; i < urls.length; i += MAX_URLS_PER_POST) {
		const chunk = urls.slice(i, i + MAX_URLS_PER_POST);
		// Direkt nach einem Deployment mit frischem Key antwortet IndexNow mit
		// 403 SiteVerificationNotCompleted, bis es die Key-Datei asynchron
		// verifiziert hat — darum begrenzt wiederholen statt sofort aufgeben.
		for (let attempt = 1; ; attempt++) {
			const res = await fetch(INDEXNOW_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				body: JSON.stringify({
					host: new URL(SITE).host,
					key,
					keyLocation: `${SITE}/${key}.txt`,
					urlList: chunk,
				}),
			});
			// 200 OK und 202 Accepted (Key wird spaeter validiert) sind Erfolg.
			if (res.status === 200 || res.status === 202) {
				console.log(`IndexNow: ${chunk.length} URL(s) gemeldet (HTTP ${res.status}).`);
				break;
			}
			const body = (await res.text()).slice(0, 500);
			if (res.status === 403 && attempt < 4) {
				console.log(`IndexNow: HTTP 403 (Key-Verifikation steht noch aus) — neuer Versuch in 90 s (${attempt}/3): ${body}`);
				await new Promise((resolve) => setTimeout(resolve, 90_000));
				continue;
			}
			throw new Error(`IndexNow antwortete HTTP ${res.status}: ${body}`);
		}
	}
}

const key = findKey();
const head = git(['rev-parse', 'HEAD']);
const sitemapUrls = await fetchSitemapUrls();
console.log(`Sitemap: ${sitemapUrls.length} URLs auf ${SITE}.`);

/** @type {string[]} */
let urls;
let mode = 'diff';
let from = FROM_ARG;

if (!FULL && !from && STATE_FILE) {
	try {
		from = JSON.parse(readFileSync(STATE_FILE, 'utf8')).lastSubmittedSha;
	} catch {
		console.log('Keine brauchbare State-Datei — Voll-Submission.');
	}
}

if (FULL || !from) {
	urls = sitemapUrls;
	mode = 'voll';
} else if (from === head) {
	urls = [];
	console.log('Kein neuer Commit seit der letzten Submission — nichts zu melden.');
} else {
	try {
		urls = urlsForDiff(from, head, sitemapUrls);
		console.log(`Diff ${from.slice(0, 8)}..${head.slice(0, 8)}: ${urls.length} betroffene URL(s).`);
	} catch {
		// z. B. State-SHA nach Force-Push/History-Rewrite unbekannt
		console.log(`Commit ${from.slice(0, 8)} nicht in der Historie — Voll-Submission.`);
		urls = sitemapUrls;
		mode = 'voll';
	}
}

if (urls.length === 0) {
	console.log('Nichts zu melden.');
} else if (DRY_RUN) {
	console.log(`[dry-run] Wuerde ${urls.length} URL(s) melden (Modus: ${mode}):`);
	for (const url of urls.slice(0, 25)) console.log(`  ${url}`);
	if (urls.length > 25) console.log(`  ... und ${urls.length - 25} weitere`);
} else {
	await submit(key, urls);
}

if (STATE_FILE && !DRY_RUN) {
	writeFileSync(STATE_FILE, JSON.stringify({ lastSubmittedSha: head }, null, '\t') + '\n');
	console.log(`State aktualisiert: ${STATE_FILE} -> ${head.slice(0, 8)}`);
}
