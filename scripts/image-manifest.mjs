/**
 * Liest die Maße aller Bilder in public/uploads und schreibt sie nach
 * src/lib/image-manifest.json. Die <Img>-Komponente nutzt sie für
 * width/height-Attribute (CLS) und um srcset-Breiten zu begrenzen.
 * Läuft automatisch im Vercel-Build (smart-build.mjs); das committete
 * Manifest dient als Fallback für lokale Dev-Server.
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/uploads');
const OUT = path.resolve('src/lib/image-manifest.json');

const files = await readdir(DIR, { recursive: true });
const manifest = {};

for (const file of files) {
	if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
	try {
		const meta = await sharp(path.join(DIR, file)).metadata();
		const key = file.split(path.sep).join('/');
		manifest[key] = { width: meta.width, height: meta.height };
	} catch {
		// nicht lesbare Datei überspringen
	}
}

await writeFile(OUT, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`image-manifest.json: ${Object.keys(manifest).length} Einträge`);
