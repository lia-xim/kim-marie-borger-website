/**
 * Audio-Pipeline für Hörproben: legt Master-Aufnahmen (WAV/AIFF/FLAC/MP3/M4A)
 * aus dem Ordner audio-src/ webfertig nach public/uploads/audio/ ab.
 *
 *  - Loudness-Normalisierung nach EBU R128 (-14 LUFS, True Peak -1 dB) —
 *    der Streaming-Standard: alle Stücke gleich laut, kein Clipping.
 *  - MP3 320 kbps, 44,1 kHz (transparent für Musik, läuft überall).
 *  - Dateinamen werden URL-tauglich gemacht (kleinbuchstaben, ascii).
 *
 * Usage:  npm run optimize:audio
 * Danach: Tracks im CMS anlegen mit Pfad /uploads/audio/<name>.mp3
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const SRC = path.resolve('audio-src');
const OUT = path.resolve('public/uploads/audio');

let files;
try {
	files = await readdir(SRC);
} catch {
	console.log(`Kein Ordner ${SRC} gefunden.\nLege ihn an und kopiere die Master-Aufnahmen hinein (WAV/AIFF/FLAC/MP3/M4A), dann erneut ausführen.`);
	process.exit(0);
}

await mkdir(OUT, { recursive: true });

const slugify = (name) => name
	.toLowerCase()
	.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
	.normalize('NFD').replace(/[̀-ͯ]/g, '')
	.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

let done = 0;
for (const file of files) {
	if (!/\.(wav|aiff?|flac|mp3|m4a|ogg)$/i.test(file)) continue;
	const base = slugify(path.parse(file).name);
	const outFile = path.join(OUT, `${base}.mp3`);
	console.log(`→ ${file}  ⇒  /uploads/audio/${base}.mp3`);
	execFileSync(ffmpegPath, [
		'-y', '-i', path.join(SRC, file),
		'-af', 'loudnorm=I=-14:TP=-1:LRA=11',
		'-ar', '44100',
		'-codec:a', 'libmp3lame', '-b:a', '320k',
		'-map_metadata', '-1', '-id3v2_version', '3',
		outFile,
	], { stdio: ['ignore', 'ignore', 'inherit'] });
	const size = (await stat(outFile)).size;
	console.log(`   ${(size / 1024 / 1024).toFixed(1)} MB`);
	done++;
}

console.log(done ? `\n${done} Datei(en) fertig. Im CMS als /uploads/audio/<name>.mp3 eintragen.` : 'Keine Audio-Dateien in audio-src/ gefunden.');
