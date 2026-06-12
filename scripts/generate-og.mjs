/**
 * Erzeugt das dedizierte Share-Bild (Open Graph, 1200×630) nach
 * public/og-default.png — Papierton, Fermate, Name + Claim im Design-Stil.
 * Einmalig ausführen (Ergebnis wird committet): node scripts/generate-og.mjs
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
	<rect width="1200" height="630" fill="#F4EEE2"/>
	<rect width="1200" height="10" y="0" fill="#B28A4A" opacity="0.85"/>
	<g transform="translate(556,128) scale(2)">
		<path d="M2 26 C7 6, 37 6, 42 26" stroke="#B28A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
		<circle cx="22" cy="22" r="3.6" fill="#B28A4A"/>
	</g>
	<text x="600" y="345" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="96" fill="#272019" letter-spacing="1">Kim Marie Borger</text>
	<text x="600" y="425" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="26" fill="#8A7A64" letter-spacing="7">VIOLA · LIVE-MUSIK FÜR BESONDERE MOMENTE</text>
	<line x1="480" y1="490" x2="720" y2="490" stroke="#B28A4A" stroke-width="2"/>
	<text x="600" y="545" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="20" fill="#A4937C" letter-spacing="3">Hochzeiten · Trauerfeiern · Taufen · Konzerte · Unterricht</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile('public/og-default.png', png);
console.log(`public/og-default.png geschrieben (${(png.length / 1024).toFixed(0)} KB)`);
