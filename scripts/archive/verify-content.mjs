/**
 * Faithfulness check: every visible text fragment of the original HTML pages
 * must appear in the corresponding built page. Reports missing fragments.
 * Usage: node scripts/verify-content.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ORIG = path.resolve('..');
const BUILT = path.resolve('dist/client');

const PAGES = [
	['index-v2.html', 'index.html'],
	['hochzeiten.html', 'hochzeiten/index.html'],
	['beerdigungen.html', 'beerdigungen/index.html'],
	['geburtstage.html', 'geburtstage/index.html'],
	['taufen.html', 'taufen/index.html'],
	['konzerte.html', 'konzerte/index.html'],
	['firmenfeiern.html', 'firmenfeiern/index.html'],
	['unterricht.html', 'unterricht/index.html'],
	['anfragen.html', 'anfragen/index.html'],
	['leistungen.html', 'leistungen/index.html'],
	['portfolio.html', 'portfolio/index.html'],
	['ueber-mich.html', 'ueber-mich/index.html'],
];

const decode = (s) => s
	.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
	.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

function textFragments(html) {
	const noScript = html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ');
	return [...noScript.matchAll(/>([^<>]+)</g)]
		.map((m) => decode(m[1]).replace(/\s+/g, ' ').trim())
		.filter((t) => t.length >= 8 && /[A-Za-zÄÖÜäöüß]/.test(t));
}

const normalize = (s) => decode(s).replace(/\s+/g, ' ').toLowerCase();

let totalMissing = 0;
for (const [orig, built] of PAGES) {
	const origHtml = await readFile(path.join(ORIG, orig), 'utf8');
	const builtHtml = await readFile(path.join(BUILT, built), 'utf8');
	const builtNorm = normalize(builtHtml);
	const missing = [...new Set(textFragments(origHtml))]
		.filter((frag) => !builtNorm.includes(frag.toLowerCase()));
	if (missing.length) {
		totalMissing += missing.length;
		console.log(`\n--- ${orig} → ${built}: ${missing.length} fehlende Fragmente`);
		missing.forEach((m) => console.log(`   · ${m}`));
	} else {
		console.log(`OK  ${orig}`);
	}
}
console.log(totalMissing === 0 ? '\nAlle Seiten inhaltlich vollständig.' : `\n${totalMissing} Fragmente fehlen insgesamt.`);
