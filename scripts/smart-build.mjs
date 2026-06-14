/**
 * Vercel build entry. Picks the right Tina build mode automatically:
 *  - PUBLIC_TINA_CLIENT_ID + TINA_TOKEN set -> cloud build: /admin works in
 *    production, editors log in via Tina Cloud.
 *  - otherwise                             -> local-content build: the site
 *    deploys fully from the repo content; /admin is not functional yet.
 */
import { execSync } from 'node:child_process';

// Update the image manifest before the Astro build so freshly uploaded CMS
// images have width/height/srcset metadata.
execSync('node scripts/image-manifest.mjs', { stdio: 'inherit', shell: true });

const hasCloud = Boolean(process.env.PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);

const localCmd = 'npx tinacms build --local --skip-cloud-checks -c "npx astro build"';
const cloudCmd = 'npx tinacms build --content=local && npx astro build';
const cmd = hasCloud ? cloudCmd : localCmd;

console.log(`[smart-build] Tina mode: ${hasCloud ? 'CLOUD (admin enabled)' : 'LOCAL (set PUBLIC_TINA_CLIENT_ID + TINA_TOKEN to enable /admin)'}`);

// Tina Cloud indexes schema commits asynchronously. Deploying /admin with
// --skip-cloud-checks can publish a UI that talks to a different GraphQL schema
// and then shows "GraphQL Schema Mismatch". In cloud mode, wait longer and fail
// the deploy instead of publishing a broken CMS admin.
const ATTEMPTS = hasCloud ? 6 : 1;

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
	try {
		execSync(cmd, { stdio: 'inherit', shell: true });
		break;
	} catch (err) {
		if (attempt === ATTEMPTS) {
			throw err;
		}
		console.log(`[smart-build] Versuch ${attempt} fehlgeschlagen - warte 60 s auf Tina-Cloud-Indexierung und versuche erneut ...`);
		execSync(process.platform === 'win32' ? 'timeout /t 60 /nobreak >nul' : 'sleep 60', { stdio: 'ignore', shell: true });
	}
}
