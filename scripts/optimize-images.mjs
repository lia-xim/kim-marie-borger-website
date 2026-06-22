/**
 * Optimizes CMS media in public/uploads for production:
 * - converts JPEG/PNG source uploads to WebP
 * - resizes large photos to a 2000 px long edge
 * - rewrites /uploads/*.jpg|png references in src/ to the generated .webp path
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --dry-run
 *   node scripts/optimize-images.mjs --keep-originals
 */
import { readdir, readFile, writeFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const keepOriginals = args.has('--keep-originals');

const UPLOAD_DIR = path.resolve('public/uploads');
const SOURCE_DIR = path.resolve('src');
const MAX_IMAGE_EDGE = 2000;
const WEBP_QUALITY = 78;
const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const TEXT_EXTENSIONS = new Set(['.astro', '.json', '.md', '.mdx', '.ts', '.tsx', '.js', '.jsx']);

const uploads = await walk(UPLOAD_DIR);
const rewritten = new Map();
let savedTotal = 0;
let processed = 0;

for (const rel of uploads) {
	const ext = path.extname(rel).toLowerCase();
	if (!RASTER_EXTENSIONS.has(ext)) continue;

	const full = path.join(UPLOAD_DIR, rel);
	const before = (await stat(full)).size;
	const input = await readFile(full);
	const meta = await sharp(input, { failOn: 'none' }).metadata();
	const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_IMAGE_EDGE;
	const img = sharp(input, { failOn: 'none' }).rotate();
	const out = await img
		.resize({ width: MAX_IMAGE_EDGE, height: MAX_IMAGE_EDGE, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: WEBP_QUALITY, effort: 5, smartSubsample: true })
		.toBuffer();

	const webpRel = replaceExtension(rel, '.webp');
	const webpFull = path.join(UPLOAD_DIR, webpRel);
	const targetFull = ext === '.webp' ? full : webpFull;

	const shouldWrite = ext === '.webp' ? out.length < before : out.length < before || needsResize;
	if (!shouldWrite) {
		console.log(`${rel}: already optimal (${formatBytes(before)})`);
		continue;
	}

	processed++;
	savedTotal += Math.max(0, before - out.length);
	console.log(`${rel}: ${formatBytes(before)} -> ${formatBytes(out.length)}${ext === '.webp' ? '' : ` (${webpRel})`}`);

	if (!dryRun) {
		await writeFile(targetFull, out);
		if (ext !== '.webp') {
			rewritten.set(`/uploads/${toPosix(rel)}`, `/uploads/${toPosix(webpRel)}`);
			if (!keepOriginals) await rm(full);
		}
	}
}

if (!dryRun && rewritten.size > 0) {
	const changedFiles = await rewriteSourceReferences(rewritten);
	console.log(`References rewritten: ${changedFiles}`);
}

console.log(`\nImages processed: ${processed}`);
console.log(`Total saved: ${formatBytes(savedTotal)}`);

if (!dryRun) {
	await writeAppleTouchIcon();
	await import('./image-manifest.mjs');
} else {
	console.log('Dry run: no files were written.');
}

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			for (const child of await walk(full)) {
				files.push(path.join(entry.name, child));
			}
		} else if (entry.isFile()) {
			files.push(entry.name);
		}
	}
	return files;
}

async function rewriteSourceReferences(map) {
	const files = await walk(SOURCE_DIR);
	let changed = 0;

	for (const rel of files) {
		if (!TEXT_EXTENSIONS.has(path.extname(rel).toLowerCase())) continue;

		const full = path.join(SOURCE_DIR, rel);
		const before = await readFile(full, 'utf8');
		let after = before;
		for (const [from, to] of map) {
			after = after.split(from).join(to);
		}

		if (after !== before) {
			await writeFile(full, after);
			changed++;
		}
	}

	return changed;
}

async function writeAppleTouchIcon() {
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
}

function replaceExtension(file, nextExt) {
	return file.replace(/\.[^.]+$/, nextExt);
}

function toPosix(file) {
	return file.split(path.sep).join('/');
}

function formatBytes(bytes) {
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
