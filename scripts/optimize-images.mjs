/**
 * One-time/source-image optimizer for public/uploads.
 * Photos arrive straight from camera/design export (6–10 MB); the site serves
 * them as-is (public/ is not processed by astro:assets), so they must be
 * web-sized at the source. Overwrites in place only when the result is smaller.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/uploads');
const MAX_JPG_WIDTH = 2000;
const MAX_PNG_WIDTH = 1600;

const files = await readdir(DIR);
let savedTotal = 0;

for (const file of files) {
	const full = path.join(DIR, file);
	const ext = path.extname(file).toLowerCase();
	if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

	const before = (await stat(full)).size;
	const input = await readFile(full);
	const img = sharp(input, { failOn: 'none' }).rotate(); // bake EXIF orientation

	let out;
	if (ext === '.png') {
		out = await img
			.resize({ width: MAX_PNG_WIDTH, withoutEnlargement: true })
			.png({ compressionLevel: 9, palette: true, quality: 90 })
			.toBuffer();
	} else {
		out = await img
			.resize({ width: MAX_JPG_WIDTH, withoutEnlargement: true })
			.jpeg({ quality: 78, progressive: true, mozjpeg: true })
			.toBuffer();
	}

	if (out.length < before) {
		await writeFile(full, out);
		savedTotal += before - out.length;
		console.log(`${file}: ${(before / 1024).toFixed(0)} KB -> ${(out.length / 1024).toFixed(0)} KB`);
	} else {
		console.log(`${file}: already optimal (${(before / 1024).toFixed(0)} KB)`);
	}
}

console.log(`\nTotal saved: ${(savedTotal / 1024 / 1024).toFixed(1)} MB`);

// Apple touch icon from the fermata favicon
const svg = Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
		<rect width="180" height="180" fill="#F4EEE2"/>
		<g transform="translate(34,52)">
			<path d="M5 62 C17 14, 95 14, 107 62" stroke="#B28A4A" stroke-width="9" fill="none" stroke-linecap="round"/>
			<circle cx="56" cy="54" r="12" fill="#B28A4A"/>
		</g>
	</svg>`,
);
await writeFile(path.resolve('public/apple-touch-icon.png'), await sharp(svg).resize(180, 180).png().toBuffer());
console.log('apple-touch-icon.png written');
