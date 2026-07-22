import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TRACKER_FILE = path.resolve('seo/seo-page-tracker.csv');
const CONTENT_DIR = path.resolve('src/content/seo-pages');
const BATCH_NOTE = 'Low Copy Pass 2026-06-16: expand-copy-Seiten mit sichtbaren Detailabsaetzen und zusaetzlichen FAQ weiter ausgebaut.';
const FOLLOWUP_NOTE = 'Low Copy Follow-up 2026-06-16: verbliebene expand-copy-Seiten mit weiterem Fachkontext ergaenzt.';

function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = '';
	let quoted = false;
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const next = text[index + 1];
		if (quoted && char === '"' && next === '"') {
			cell += '"';
			index += 1;
		} else if (char === '"') {
			quoted = !quoted;
		} else if (!quoted && char === ',') {
			row.push(cell);
			cell = '';
		} else if (!quoted && (char === '\n' || char === '\r')) {
			if (char === '\r' && next === '\n') index += 1;
			row.push(cell);
			if (row.some((value) => value !== '')) rows.push(row);
			row = [];
			cell = '';
		} else {
			cell += char;
		}
	}
	if (cell || row.length) {
		row.push(cell);
		rows.push(row);
	}
	const [headers, ...data] = rows;
	return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function noteFor(doc, note = BATCH_NOTE) {
	const notes = String(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes, note])].join('\n\n');
}

function hash(value) {
	return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0);
}

function pick(key, values, offset = 0) {
	return values[(hash(key) + offset) % values.length];
}

function labelFromRow(row, doc) {
	return row.target_keyword || doc.targetKeyword || doc.seoTitle?.split('|')[0]?.trim() || row.slug;
}

function placeFromLabel(label, service) {
	const patterns = {
		beerdigungen: /^Trauermusik\s+/i,
		geburtstage: /^Live Musik Geburtstag\s+/i,
		hochzeiten: /^Hochzeitsmusik\s+/i,
		unterricht: /^Bratschenunterricht\s+/i,
	};
	return label.replace(patterns[service] ?? /^/, '').trim() || label;
}

function ensureSplit(doc, label) {
	return {
		eyebrow: 'Details',
		title: `${label}: Details zur Planung`,
		lede: '',
		paragraphs: [],
		...(doc.split ?? {}),
		paragraphs: Array.isArray(doc.split?.paragraphs) ? [...doc.split.paragraphs] : [],
	};
}

function addParagraphs(doc, label, paragraphs) {
	const split = ensureSplit(doc, label);
	const existing = new Set(split.paragraphs.map((paragraph) => paragraph.trim()));
	for (const paragraph of paragraphs) {
		if (paragraph && !existing.has(paragraph.trim())) {
			split.paragraphs.push(paragraph);
			existing.add(paragraph.trim());
		}
	}
	return { ...doc, split };
}

function addFaq(doc, title, additions) {
	const current = Array.isArray(doc.faq?.items) ? doc.faq.items : [];
	const seen = new Set(current.map((item) => String(item.question ?? '').toLowerCase()));
	const nextItems = [...current];
	for (const item of additions) {
		const key = String(item.question ?? '').toLowerCase();
		if (item.question && item.answer && !seen.has(key)) {
			nextItems.push(item);
			seen.add(key);
		}
	}
	return {
		...doc,
		faq: {
			eyebrow: doc.faq?.eyebrow ?? 'Gut zu wissen',
			title: doc.faq?.title ?? `FAQ zu ${title}`,
			items: nextItems,
		},
	};
}

function funeralLocalPatch(row, doc, label) {
	const place = placeFromLabel(label, 'beerdigungen');
	const focus = pick(row.slug, [
		'Raumklang, Wegstrecke und der erste ruhige Ton',
		'Kontaktperson, Treffpunkt und ein unauffaelliger Aufbau',
		'Wetteroption, Sitzordnung und die Frage, ob Musik auch draussen sinnvoll ist',
		'Ablauf der Worte, Auszug und ein moeglicher Moment am Grab',
	]);
	const tone = pick(row.slug, [
		'klar und schlicht',
		'tragend, aber nicht dramatisch',
		'persoenlich und bewusst zurueckgenommen',
		'ruhig genug fuer Worte und dennoch hoerbar',
	], 1);
	let next = addParagraphs(doc, label, [
		`Als zusaetzlichen Planungspunkt notiere ich bei Trauermusik in ${place} immer ${focus}. Dadurch wird die Musik nicht nur nach Stuecken ausgesucht, sondern nach ihrer Aufgabe im Ablauf: sammeln, halten, ueberleiten oder einen letzten Weg leise begleiten.`,
		`Fuer ${place} bespreche ich ausserdem, wie viel Naehe der Klang haben darf. Manche Familien wuenschen die Viola sehr nah am Sitzbereich, andere brauchen mehr Abstand. Diese Entscheidung veraendert Lautstaerke, Bogenfuehrung und die Auswahl der Stuecke deutlicher als man vorher denkt.`,
	]);
	next = addFaq(next, label, [
		{
			question: `Was macht Trauermusik in ${place} besonders planbar?`,
			answer: `Hilfreich ist eine klare Zuordnung: Welche Musik beginnt, welche Musik traegt eine stille Minute, welche Musik fuehrt hinaus? So bleibt der Ablauf in ${place} ${tone} und die Familie muss am Tag selbst weniger entscheiden.`,
		},
	]);
	return next;
}

function funeralTopicPatch(row, doc, label) {
	const angle = pick(row.slug, [
		'den genauen Einsatz im Ablauf',
		'die passende Laenge des Stuecks',
		'den Unterschied zwischen bekanntem Lied und ruhiger Bearbeitung',
		'die Abstimmung mit Rede, Ritual oder letztem Weg',
	]);
	const contrast = pick(row.slug, [
		'als kurze Setzung',
		'als tragender Mittelteil',
		'als leiser Abschluss',
		'als persoenlicher Wunschmoment',
	], 1);
	let next = addParagraphs(doc, label, [
		`Bei ${label} pruefe ich zusaetzlich ${angle}. Gerade bei Trauerfeiern entscheidet nicht die reine Bekanntheit eines Titels, sondern ob die Melodie an der vorgesehenen Stelle wirklich Raum laesst und nicht gegen Worte oder Stille arbeitet.`,
		`So unterscheidet sich diese Seite von benachbarten Trauermusik-Themen: ${label} wird ${contrast} gedacht. Daraus ergeben sich andere Fragen zu Tonart, Tempo, Wiederholung, Position im Raum und dazu, ob ein Ausschnitt wuerdevoller ist als eine vollstaendige Fassung.`,
	]);
	next = addFaq(next, label, [
		{
			question: `Wie wird ${label} konkret vorbereitet?`,
			answer: `Ich klaere Anlass, Raum, Zeitpunkt und gewuenschte Wirkung. Danach entscheide ich, ob ${label} als einzelner Moment, als Uebergang oder als Teil einer kleinen Abfolge auf Solo-Viola am staerksten wirkt.`,
		},
	]);
	return next;
}

function birthdayPatch(row, doc, label) {
	const place = row.page_kind === 'local' ? placeFromLabel(label, 'geburtstage') : '';
	const phrase = place ? ` in ${place}` : '';
	const role = pick(row.slug, [
		'ein persoenliches Wunschlied',
		'ein kurzer Empfangsmoment',
		'eine musikalische Ueberraschung',
		'ein dezenter Rahmen fuer Essen und Gespräche',
	]);
	const practical = pick(row.slug, [
		'Startsignal, Blickrichtung und Laenge',
		'Raumgroesse, Gaestezahl und Pausen',
		'Ankunft, Diskretion und erste Melodie',
		'Timing zwischen Rede, Fotos und Essen',
	], 1);
	let next = addParagraphs(doc, label, [
		`Fuer ${label}${phrase && !label.includes(place) ? phrase : ''} plane ich zuerst die Rolle der Musik: ${role}. Danach entsteht die Stueckauswahl. So bleibt die Viola nicht austauschbare Unterhaltung, sondern ein Moment, der zur gefeierten Person und zur Situation passt.`,
		`Wichtig sind dabei ${practical}. Gerade bei Geburtstagen veraendert ein kleines Detail den ganzen Eindruck: ob die Musik sichtbar beginnt, ob sie nach wenigen Minuten wieder zuruecktritt oder ob sie den Uebergang zum Dinner ruhig mitnimmt.`,
	]);
	next = addFaq(next, label, [
		{
			question: `Wie persoenlich kann ${label} werden?`,
			answer: `Sehr persoenlich, wenn Wunschlied, Zeitpunkt und Rahmen zusammenpassen. Ich bespreche vorher, ob die Musik Geschenk, Begleitung oder Ueberraschung sein soll und wie deutlich sie im Raum stehen darf.`,
		},
		{
			question: 'Was verhindert, dass Geburtstagsmusik zu viel wird?',
			answer: 'Kurze Sets, klare Pausen und ein Anfang mit Aufgabe. Die Musik darf die Feier veredeln, soll aber Gratulationen, Gespraeche und Essen nicht ueberdecken.',
		},
	]);
	return next;
}

function weddingPatch(row, doc, label) {
	let next = addParagraphs(doc, label, [
		`Bei ${label} ist die wichtigste Frage, ob Musik wirklich im Hintergrund bleiben soll oder ob sie einen sichtbaren Uebergang markiert. Ich plane deshalb Lautstaerke, Setlaenge und Pausen so, dass Gespraeche, Service, Gratulationen und Fotos ihren Platz behalten.`,
	]);
	next = addFaq(next, label, [
		{
			question: `Wann ist ${label} sinnvoller als eine Playlist?`,
			answer: 'Live-Viola reagiert flexibler auf Raum und Ablauf. Besonders bei Empfang, Dinner oder Wartezeiten entsteht ein hochwertiger Rahmen, ohne dass die Musik wie ein eigener Programmpunkt wirken muss.',
		},
	]);
	return next;
}

function teachingPatch(row, doc, label) {
	const adult = row.slug.includes('erwachsene');
	let next = addParagraphs(doc, label, adult ? [
		'Fuer erwachsene Lernende ist die erste Frage selten nur technisch. Wichtig sind Zeitfenster, Koerpergefuehl, Vorerfahrung und die Frage, welche Musik wirklich motiviert. Daraus entsteht ein Uebeplan, der auch neben Beruf, Familie oder unregelmaessigen Wochen funktioniert.',
		'Ich arbeite im Erwachsenenunterricht mit kleinen, nachvollziehbaren Schritten: Klang hoeren, Bewegung spueren, Ursache verstehen und erst dann die naechste Aufgabe ergaenzen. So bleibt Bratsche lernen konkret und wird nicht zu einer Sammlung abstrakter Korrekturen.',
	] : [
		'Allgemeiner Bratschenunterricht braucht ein Fundament, das fuer verschiedene Altersgruppen funktioniert. Haltung, Bogen, linke Hand, Rhythmus und Notenlesen werden deshalb nicht isoliert behandelt, sondern immer wieder mit kleinen musikalischen Aufgaben verbunden.',
		'Wenn Kinder, Jugendliche oder Erwachsene starten, veraendert sich die Sprache des Unterrichts, aber nicht das Ziel: ein entspannter Koerper, ein tragender Ton und ein Uebeweg, der zu Hause wirklich machbar bleibt.',
	]);
	next = addFaq(next, label, adult ? [
		{
			question: 'Wie viel Uebezeit brauchen Erwachsene realistisch?',
			answer: 'Lieber regelmaessige kurze Einheiten als seltene lange Bloecke. Schon klare 15 bis 20 Minuten mit einer konkreten Aufgabe koennen viel bewirken, wenn der Unterricht die Prioritaeten gut sortiert.',
		},
		{
			question: 'Kann ich auch mit alten Unsicherheiten wieder anfangen?',
			answer: 'Ja. Wir pruefen, was noch traegt, und bauen Bewegungen neu auf, die Spannung, Frust oder klangliche Grenzen erzeugen.',
		},
	] : [
		{
			question: 'Wie wird der Unterricht an unterschiedliche Altersgruppen angepasst?',
			answer: 'Kinder brauchen andere Bilder und kuerzere Aufgaben als Erwachsene. Die technischen Ziele bleiben aehnlich, aber Tempo, Material und Uebeplan werden persoenlich angepasst.',
		},
		{
			question: 'Was ist am Anfang wichtiger: Noten oder Klang?',
			answer: 'Beides gehoert zusammen. Klang motiviert, Noten geben Orientierung. Im Unterricht werden beide Bereiche so verbunden, dass Musik nicht nur Theorie bleibt.',
		},
	]);
	return next;
}

function followupPatch(row, doc, label) {
	if (row.service === 'unterricht') {
		const adult = row.slug.includes('erwachsene');
		let next = addParagraphs(doc, label, adult ? [
			'Im naechsten Schritt geht es bei Erwachsenen oft um Selbstkorrektur: Wie erkenne ich, ob der Bogen wirklich ruhig laeuft, ob die linke Hand greift statt drueckt und ob eine Uebung gerade hilft oder nur Wiederholung erzeugt? Diese Fragen werden im Unterricht bewusst mitgeuebt.',
			'Gerade fuer Erwachsene ist auch der Umgang mit Frust wichtig. Kleine Tonleitern, kurze Stuecke und gezielte Wiederholungen werden so dosiert, dass Fortschritt hoerbar wird, ohne dass jede Stunde wie eine Pruefung wirkt.',
		] : [
			'Nach den ersten Grundlagen wird der Unterricht feiner: Wir achten darauf, ob ein Ton nur irgendwie entsteht oder ob Bogenrichtung, Kontaktstelle und linke Hand zusammenarbeiten. Diese Unterscheidung hilft, spaeter musikalischer und sicherer zu spielen.',
			'Zum Unterricht gehoert auch, wie zu Hause geuebt wird. Kurze Aufgaben mit klarem Ziel sind wertvoller als langes Durchspielen ohne Aufmerksamkeit. Deshalb endet jede Stunde mit einer konkreten Idee fuer die naechsten Tage.',
		]);
		next = addFaq(next, label, adult ? [
			{
				question: 'Wie bleibt Bratschenunterricht fuer Erwachsene langfristig motivierend?',
				answer: 'Durch klare Etappen: ein technischer Schwerpunkt, ein musikalisches Ziel und kleine Aufgaben fuer zu Hause. So bleibt Fortschritt sichtbar, auch wenn nicht jede Woche gleich viel Uebezeit da ist.',
			},
		] : [
			{
				question: 'Wie wird aus Technik Musik?',
				answer: 'Technik wird sofort in kleine Melodien, Rhythmen oder Stuecke eingebunden. So bleibt sie kein Selbstzweck, sondern ein Werkzeug fuer besseren Klang und mehr Sicherheit.',
			},
		]);
		return next;
	}
	if (row.service === 'beerdigungen') {
		const detail = pick(row.slug, [
			'der Abstand zwischen Musikerin, Familie und Redner:in',
			'die Frage, ob ein Stueck ausklingen oder direkt in den naechsten Schritt fuehren soll',
			'die Balance zwischen Wiedererkennung und stiller Zurueckhaltung',
			'der Moment, an dem Musik wirklich entlastet statt den Ablauf nur zu fuellen',
		]);
		let next = addParagraphs(doc, label, [
			`Als fachlichen Zusatz klaere ich bei ${label} auch ${detail}. Dadurch bekommt die Seite mehr als eine Repertoire-Antwort: Sie beschreibt, wie Musik in einer Trauersituation praktisch, klanglich und menschlich eingesetzt wird.`,
		]);
		next = addFaq(next, label, [
			{
				question: `Welche Entscheidung ist bei ${label} oft wichtiger als die Stueckauswahl?`,
				answer: 'Die genaue Aufgabe der Musik. Ein Stueck kann sammeln, eine Rede nachklingen lassen, einen Weg begleiten oder einen Abschluss halten. Erst daraus entsteht die passende musikalische Form.',
			},
		]);
		return next;
	}
	return addParagraphs(doc, label, [
		`Zusaetzlich wurde ${label} um einen weiteren redaktionellen Kontext ergaenzt, damit die Seite genug sichtbare Tiefe hat und im Themencluster nicht nur formal, sondern auch inhaltlich klarer abgegrenzt ist.`,
	]);
}

function patchDoc(row, doc) {
	const label = labelFromRow(row, doc);
	const notes = String(doc.editorNotes ?? '');
	if (notes.includes(FOLLOWUP_NOTE)) return { doc, changed: false };
	if (notes.includes(BATCH_NOTE)) {
		const next = followupPatch(row, doc, label);
		return {
			doc: {
				...next,
				editorNotes: noteFor(next, FOLLOWUP_NOTE),
			},
			changed: true,
		};
	}
	let next = doc;
	if (row.service === 'beerdigungen' && row.page_kind === 'local') next = funeralLocalPatch(row, doc, label);
	else if (row.service === 'beerdigungen') next = funeralTopicPatch(row, doc, label);
	else if (row.service === 'geburtstage') next = birthdayPatch(row, doc, label);
	else if (row.service === 'hochzeiten') next = weddingPatch(row, doc, label);
	else if (row.service === 'unterricht') next = teachingPatch(row, doc, label);
	else next = addParagraphs(doc, label, [`${label} wurde zusaetzlich um konkrete Planungsdetails erweitert, damit die Seite mehr sichtbaren redaktionellen Inhalt und eine klarere Abgrenzung im jeweiligen Themencluster bekommt.`]);
	return {
		doc: {
			...next,
			editorNotes: noteFor(next, BATCH_NOTE),
		},
		changed: true,
	};
}

if (!existsSync(TRACKER_FILE)) {
	console.error('Missing seo/seo-page-tracker.csv. Run npm run tracker:seo-pages first.');
	process.exit(1);
}

const rows = parseCsv(readFileSync(TRACKER_FILE, 'utf8'))
	.filter((row) => row.action === 'expand-copy')
	.sort((a, b) => a.service.localeCompare(b.service) || a.slug.localeCompare(b.slug));

const results = rows.map((row) => {
	const file = path.join(CONTENT_DIR, row.service, `${row.slug}.json`);
	if (!existsSync(file)) return { ok: false, row, file, reason: 'missing file' };
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const patched = patchDoc(row, doc);
	if (patched.changed) writeFileSync(file, `${JSON.stringify(patched.doc, null, 2)}\n`, 'utf8');
	return { ok: true, changed: patched.changed, row, file };
});

console.log('Low-copy expansion complete');
console.log(`- tracker rows: ${rows.length}`);
console.log(`- changed docs: ${results.filter((result) => result.changed).length}`);
console.log(`- skipped docs: ${results.filter((result) => result.ok && !result.changed).length}`);
console.log(`- failed docs: ${results.filter((result) => !result.ok).length}`);
