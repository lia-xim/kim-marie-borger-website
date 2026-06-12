/**
 * Vercel build entry. Picks the right Tina build mode automatically:
 *  - PUBLIC_TINA_CLIENT_ID + TINA_TOKEN set  → cloud build: /admin works in
 *    production, editors log in via Tina Cloud.
 *  - otherwise                               → local-content build: the site
 *    deploys fully from the repo content; /admin is not functional yet.
 * So connecting the CMS later is just: set the two env vars and redeploy.
 */
import { execSync } from 'node:child_process';

// Bild-Manifest (Maße für width/height/srcset) vor dem Build aktualisieren,
// damit auch frisch über das CMS hochgeladene Bilder erfasst sind.
execSync('node scripts/image-manifest.mjs', { stdio: 'inherit', shell: true });

const hasCloud = Boolean(process.env.PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);

const cmd = hasCloud
	? 'npx tinacms build --content=local && npx astro build'
	: 'npx tinacms build --local --skip-cloud-checks -c "npx astro build"';

console.log(`[smart-build] Tina mode: ${hasCloud ? 'CLOUD (admin enabled)' : 'LOCAL (set PUBLIC_TINA_CLIENT_ID + TINA_TOKEN to enable /admin)'}`);
execSync(cmd, { stdio: 'inherit', shell: true });
