/**
 * Vercel build entry. Picks the right Tina build mode automatically:
 *  - PUBLIC_TINA_CLIENT_ID + TINA_TOKEN set -> cloud build: /admin works in
 *    production, editors log in via Tina Cloud.
 *  - otherwise                             -> local-content build: the site
 *    deploys fully from the repo content; /admin is not functional yet.
 */
import { execSync } from 'node:child_process';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';

// Prepare freshly uploaded CMS images before Tina/Astro read the content.
execSync('node scripts/optimize-images.mjs', { stdio: 'inherit', shell: true });

// Update the image manifest before the Astro build so freshly uploaded CMS
// images have width/height/srcset metadata.
execSync('node scripts/image-manifest.mjs', { stdio: 'inherit', shell: true });

const hasCloud = Boolean(process.env.PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);

const cloudCmd = 'npx tinacms build --content=local && npx astro build';

console.log(`[smart-build] Tina mode: ${hasCloud ? 'CLOUD (admin enabled)' : 'LOCAL (set PUBLIC_TINA_CLIENT_ID + TINA_TOKEN to enable /admin)'}`);

function buildStaticSiteWithAdminMaintenance() {
	console.log('[smart-build] Building static site from repo content and replacing /admin with a maintenance page.');
	execSync('npx tinacms build --local --skip-cloud-checks -c "node scripts/write-admin-maintenance.mjs && npx astro build"', { stdio: 'inherit', shell: true });
}

if (!hasCloud) {
	buildStaticSiteWithAdminMaintenance();
	process.exit(0);
}

async function getTinaCloudStatus() {
	try {
		const headers = { 'Content-Type': 'application/json' };
		if (process.env.TINA_TOKEN) headers['X-API-KEY'] = process.env.TINA_TOKEN;
		const response = await fetch(`https://content.tinajs.io/db/${process.env.PUBLIC_TINA_CLIENT_ID}/status/${branch}`, {
			headers,
			cache: 'no-cache',
		});
		return await response.json();
	} catch (error) {
		console.log(`[smart-build] Could not read Tina Cloud status before build: ${error.message}`);
		return null;
	}
}

// Tina Cloud indexes schema commits asynchronously. While the branch is stuck in
// a failed index state, do not publish a broken CMS admin. Deploy the public site
// from repo content and show a clear /admin maintenance page instead.
const ATTEMPTS = 2;
const cloudStatus = await getTinaCloudStatus();

if (cloudStatus?.status === 'failed') {
	console.log(`[smart-build] Tina Cloud branch '${branch}' is failed before build: ${cloudStatus.error ?? 'unknown error'}`);
	buildStaticSiteWithAdminMaintenance();
	process.exit(0);
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
	try {
		execSync(cloudCmd, { stdio: 'inherit', shell: true });
		break;
	} catch (err) {
		if (attempt === ATTEMPTS) {
			console.log('[smart-build] Tina Cloud check is still failing. Falling back to static site deploy with /admin maintenance page.');
			buildStaticSiteWithAdminMaintenance();
			break;
		}
		console.log(`[smart-build] Versuch ${attempt} fehlgeschlagen - warte 60 s auf Tina-Cloud-Indexierung und versuche erneut ...`);
		await sleep(60_000);
	}
}
