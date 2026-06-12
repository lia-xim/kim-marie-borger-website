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
	output: 'static',
	adapter: vercel(),
	integrations: [mdx(), sitemap(), tina()],
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
