import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const STATIC_OUTPUT_CANDIDATES = [
	{ label: 'Astro dist/client', dir: 'dist/client' },
	{ label: 'Vercel .vercel/output/static', dir: '.vercel/output/static' },
];

export function staticOutputArg(args = process.argv.slice(2)) {
	for (const arg of args) {
		if (arg.startsWith('--static-dir=')) return arg.slice('--static-dir='.length);
		if (arg.startsWith('--static-output=')) return arg.slice('--static-output='.length);
	}
	return '';
}

export function walkFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walkFiles(full) : [full];
	});
}

export function routeFromHtmlFile(root, file) {
	return `/${path.relative(root, file).replace(/\\/g, '/').replace(/index.html$/, '').replace(/^404.html$/, '404')}`;
}

export function relativePath(file) {
	return path.relative(process.cwd(), file).replace(/\\/g, '/');
}

export function resolveStaticOutputDir({ requestedDir = '', env = process.env } = {}) {
	const explicitDir = requestedDir || env.SEO_STATIC_OUTPUT_DIR || env.KMB_STATIC_OUTPUT_DIR || '';
	if (explicitDir) {
		const output = inspectStaticOutput(explicitDir, 'configured static output');
		if (!output.exists) {
			throw new Error(`Static output not found: ${output.relative}. Run npx astro build or choose an existing --static-dir.`);
		}
		if (!output.hasHtml) {
			throw new Error(`Static output has no HTML files: ${output.relative}.`);
		}
		if (!output.hasSitemap) {
			throw new Error(`Static output has no sitemap XML files: ${output.relative}. The build output is likely incomplete.`);
		}
		return output;
	}

	const outputs = STATIC_OUTPUT_CANDIDATES
		.map((candidate) => inspectStaticOutput(candidate.dir, candidate.label))
		.filter((output) => output.exists && output.hasHtml && output.hasSitemap);

	if (outputs.length === 0) {
		const checked = STATIC_OUTPUT_CANDIDATES.map((candidate) => `- ${candidate.dir}`).join('\n');
		throw new Error(`No complete Astro/Vercel static output found. Run npx astro build or npm run build:local.\nChecked for HTML and sitemap XML in:\n${checked}`);
	}

	return outputs.sort((a, b) => b.updatedMs - a.updatedMs || a.order - b.order)[0];
}

export function resolveStaticOutputDirOrExit(options) {
	try {
		return resolveStaticOutputDir(options);
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

function inspectStaticOutput(dir, label) {
	const root = path.resolve(dir);
	const relative = relativePath(root);
	const order = STATIC_OUTPUT_CANDIDATES.findIndex((candidate) => path.resolve(candidate.dir) === root);
	const exists = existsSync(root) && statSync(root).isDirectory();

	if (!exists) {
		return {
			label,
			root,
			relative,
			order: order === -1 ? STATIC_OUTPUT_CANDIDATES.length : order,
			exists: false,
			hasHtml: false,
			hasSitemap: false,
			htmlCount: 0,
			sitemapCount: 0,
			updatedMs: 0,
		};
	}

	const files = walkFiles(root);
	const htmlCount = files.filter((file) => file.endsWith('.html')).length;
	const sitemapCount = files.filter((file) => /sitemap.*\.xml$/i.test(path.basename(file))).length;
	const updatedMs = Math.max(statSync(root).mtimeMs, ...files.map((file) => statSync(file).mtimeMs));

	return {
		label,
		root,
		relative,
		order: order === -1 ? STATIC_OUTPUT_CANDIDATES.length : order,
		exists: true,
		hasHtml: htmlCount > 0,
		hasSitemap: sitemapCount > 0,
		htmlCount,
		sitemapCount,
		updatedMs,
	};
}
