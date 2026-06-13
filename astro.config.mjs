// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	// SITE_URL gewinnt; sonst die Produktions-Domain des Vercel-Projekts (passt
	// sich automatisch an, wenn eine eigene Domain verbunden wird), dann die
	// Deployment-URL (Previews), dann localhost (lokale Builds).
	site: process.env.SITE_URL
		|| (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
		|| (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4321'),
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
	integrations: [mdx(), sitemap(), tina()],
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
