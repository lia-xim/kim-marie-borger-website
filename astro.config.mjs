// @ts-check
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import vercel from '@astrojs/vercel';
import { addMissingLinkTitles } from './scripts/lib/link-title-postprocess.mjs';
import { buildGitLastmodMap } from './scripts/lib/git-lastmod.mjs';

/** @typedef {import('@astrojs/sitemap').SitemapItem} SitemapItem */

const CORE_SERVICE_SLUGS = new Set([
	'hochzeiten',
	'beerdigungen',
	'firmenfeiern',
	'geburtstage',
	'taufen',
	'konzerte',
	'unterricht',
]);

/** Kernmaerkte: verdienen mehr Sitemap-Gewicht als der lange Ortsschwanz. */
const PRIORITY_LOCATIONS = new Set([
	'duesseldorf',
	'koeln',
	'wuppertal',
	'essen',
	'erkrath',
	'mettmann',
	'haan',
	'hilden',
	'velbert',
	'wuelfrath',
]);

const DEFAULT_SITEMAP_LASTMOD = new Date('2026-07-05T00:00:00.000Z').toISOString();

// lastmod kommt aus der Git-Historie, NICHT aus Datei-mtimes: Vercel klont
// das Repo bei jedem Build frisch, dadurch truegen sonst alle 500+ Seiten
// die Build-Zeit als lastmod. Vollstaendig ist die Map nur mit kompletter
// Historie — auf Vercel ist dafuer VERCEL_DEEP_CLONE=true gesetzt.
const GIT_LASTMOD = buildGitLastmodMap(fileURLToPath(new URL('.', import.meta.url)));

/** @param {string} relativePath */
function fileLastmod(relativePath) {
	return GIT_LASTMOD.get(relativePath.replace(/^\.\//, '')) ?? DEFAULT_SITEMAP_LASTMOD;
}

/** @param {SitemapItem} item */
function routeParts(item) {
	const { pathname } = new URL(item.url);
	return pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
}

/** @param {string[]} parts */
function seoPageSourcePath(parts) {
	if (parts.length !== 2 || !CORE_SERVICE_SLUGS.has(parts[0])) return '';
	if (parts[1] === 'orte' || parts[1] === 'themen') return '';
	return `./src/content/seo-pages/${parts[0]}/${parts[1]}.json`;
}

/** @param {SitemapItem} item */
function sitemapLastmod(item) {
	const parts = routeParts(item);
	if (parts.length === 0) return fileLastmod('./src/content/page/home.mdx');
	if (parts[0] === 'ratgeber') return fileLastmod('./src/lib/ratgeber.ts');
	if (parts.length === 1) return fileLastmod(`./src/content/page/${parts[0]}.mdx`);
	if (parts.length === 2 && CORE_SERVICE_SLUGS.has(parts[0])) {
		if (parts[1] === 'orte') return fileLastmod('./src/pages/[service]/orte.astro');
		if (parts[1] === 'themen') return fileLastmod('./src/pages/[service]/themen.astro');
		return fileLastmod(seoPageSourcePath(parts));
	}
	return DEFAULT_SITEMAP_LASTMOD;
}

/** @param {SitemapItem} item */
function sitemapPriority(item) {
	const parts = routeParts(item);
	if (parts.length === 0) return 1;
	if (parts.length === 1 && CORE_SERVICE_SLUGS.has(parts[0])) return 0.9;
	if (parts.length === 1) return ['impressum', 'datenschutz', 'agb'].includes(parts[0]) ? 0.2 : 0.7;
	if (parts[0] === 'ratgeber') return parts.length === 1 ? 0.7 : 0.62;
	if (parts.length === 2 && CORE_SERVICE_SLUGS.has(parts[0])) {
		// Die Hub-Seiten sind reine Linklisten (~230 Woerter) und duerfen nicht
		// hoeher priorisiert sein als die Detailseiten, auf die sie verweisen.
		if (parts[1] === 'orte' || parts[1] === 'themen') return 0.5;
		return PRIORITY_LOCATIONS.has(parts[1]) ? 0.7 : 0.58;
	}
	return 0.5;
}

/**
 * @param {SitemapItem} item
 * @returns {import('sitemap').EnumChangefreq}
 */
function sitemapChangefreq(item) {
	const parts = routeParts(item);
	if (parts.length <= 1) return ChangeFreqEnum.WEEKLY;
	if (parts[0] === 'ratgeber') return ChangeFreqEnum.MONTHLY;
	if (parts.length === 2 && CORE_SERVICE_SLUGS.has(parts[0])) {
		return parts[1] === 'orte' || parts[1] === 'themen' ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY;
	}
	return ChangeFreqEnum.MONTHLY;
}

/**
 * @param {SitemapItem} item
 * @returns {SitemapItem}
 */
function serializeSitemapItem(item) {
	return {
		...item,
		lastmod: sitemapLastmod(item),
		changefreq: sitemapChangefreq(item),
		priority: sitemapPriority(item),
	};
}

/** @param {SitemapItem} item */
function isSeoDetailItem(item) {
	return Boolean(seoPageSourcePath(routeParts(item)));
}

/** @param {SitemapItem} item */
function isCoreOrHubItem(item) {
	const parts = routeParts(item);
	if (parts[0] === 'ratgeber') return false;
	return parts.length <= 1 || (parts.length === 2 && CORE_SERVICE_SLUGS.has(parts[0]) && ['orte', 'themen'].includes(parts[1]));
}

/** @param {SitemapItem} item */
function isGuideItem(item) {
	return routeParts(item)[0] === 'ratgeber';
}

/** @returns {import('astro').AstroIntegration} */
const sitemapXmlAlias = () => ({
	name: 'sitemap-xml-alias',
	hooks: {
		'astro:build:done': async ({ dir, logger }) => {
			await copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir));
			logger.info('Created /sitemap.xml from /sitemap-index.xml for search engines');
		},
	},
});

/** @returns {import('astro').AstroIntegration} */
const linkTitleAttributes = () => ({
	name: 'link-title-attributes',
	hooks: {
		'astro:build:done': ({ dir, logger }) => {
			addMissingLinkTitles({ dir, logger });
		},
	},
});

// https://astro.build/config
export default defineConfig({
	// SITE_URL gewinnt; sonst die Produktions-Domain des Vercel-Projekts (passt
	// sich automatisch an, wenn eine eigene Domain verbunden wird), dann die
	// Deployment-URL (Previews), dann die echte Domain fuer lokale SEO-Audits.
	site: process.env.SITE_URL
		|| (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
		|| (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://kim-marie-borger.com'),
	trailingSlash: 'always',
	output: 'static',
	adapter: vercel({
		// Aktiviert /_vercel/image für die <Img>-Komponente (AVIF/WebP,
		// responsive Breiten). sizes muss zu IMAGE_SIZES in src/lib/img.ts passen.
		imagesConfig: {
			sizes: [320, 480, 640, 800, 960, 1280, 1600, 2000],
			formats: ['image/avif', 'image/webp'],
			domains: [],
			minimumCacheTTL: 2678400,
		},
	}),
	integrations: [
		mdx(),
		sitemap({
			xslURL: '/sitemap.xsl',
			serialize: serializeSitemapItem,
			chunks: {
				core: (item) => isCoreOrHubItem(item) ? item : undefined,
				seo: (item) => isSeoDetailItem(item) ? item : undefined,
				ratgeber: (item) => isGuideItem(item) ? item : undefined,
			},
		}),
		sitemapXmlAlias(),
		linkTitleAttributes(),
		tina(),
	],
	build: {
		// Das eine gemeinsame Stylesheet (~33 KB) blockierte das Rendering
		// ~450 ms; inline spart den Roundtrip auf dem kritischen Pfad.
		inlineStylesheets: 'always',
	},
	// Tina Cloud rewrites CMS image src to assets.tina.io; let Astro
	// fetch those URLs at build time so <Image> can transcode + resize them.
	image: {
		layout: 'constrained',
		remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
	},
	vite: {
		plugins: [tinaAdminDevRedirect()],
		ssr: {
			noExternal: ['@tinacms/astro', '@tinacms/bridge'],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
						warning.exporter === 'tinacms/dist/client') {
						return;
					}
					warn(warning);
				}
			}
		}
	}
});
