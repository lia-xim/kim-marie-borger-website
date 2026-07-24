// Liefert pro Datei das Datum des letzten Commits, der sie geaendert hat.
// Hintergrund: Datei-mtimes sind auf Vercel wertlos — jeder Build klont das
// Repo frisch, wodurch ALLE Dateien die Build-Zeit als mtime tragen und die
// Sitemap bei jedem Deploy komplett "aktualisiert" aussieht. Suchmaschinen
// stufen ein derart rotierendes lastmod als unglaubwuerdig ein.
//
// Ein einzelner `git log`-Durchlauf ueber die gesamte Historie ist deutlich
// schneller als ein `git log -1 -- <datei>` pro Sitemap-Eintrag (500+ Seiten).

import { execFileSync } from 'node:child_process';

const COMMIT_MARKER = String.fromCharCode(0);

/**
 * @param {string} [repoRoot] Arbeitsverzeichnis fuer git (Default: cwd).
 * @returns {Map<string, string>} repo-relativer Pfad -> ISO-Datum (UTC) des letzten Commits
 */
export function buildGitLastmodMap(repoRoot) {
	/** @type {Map<string, string>} */
	const map = new Map();
	let output = '';
	try {
		// %x00 markiert Commit-Zeilen, damit Dateipfade nie damit kollidieren.
		output = execFileSync(
			'git',
			['-c', 'core.quotepath=false', 'log', '--format=%x00%cI', '--name-only', '--no-renames'],
			{ cwd: repoRoot, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
		);
	} catch (error) {
		console.warn(`[git-lastmod] git log fehlgeschlagen (${/** @type {Error} */ (error).message.split('\n')[0]}) — Sitemap faellt auf das Default-lastmod zurueck.`);
		return map;
	}

	let currentDate = '';
	for (const line of output.split('\n')) {
		if (line.startsWith(COMMIT_MARKER)) {
			currentDate = new Date(line.slice(1).trim()).toISOString();
			continue;
		}
		const file = line.trim();
		// git log listet Commits neueste zuerst — der erste Treffer pro Datei
		// ist also der juengste Commit, der sie angefasst hat.
		if (file && currentDate && !map.has(file)) map.set(file, currentDate);
	}

	try {
		const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: repoRoot, encoding: 'utf8' }).trim();
		if (shallow === 'true') {
			console.warn('[git-lastmod] Shallow Clone erkannt — aeltere Dateien fehlen in der Historie und erhalten das Default-lastmod. Auf Vercel VERCEL_DEEP_CLONE=true setzen.');
		}
	} catch {
		// rein informativ — Fehler hier sind egal
	}

	return map;
}
