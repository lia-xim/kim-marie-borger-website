import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STATUS = 'rewritten-batch-1-review-needed';
const BATCH_NOTE = 'Batch 1: redaktionell gegen den nächsten Keyword-/Intent-Nachbarn differenziert. Fachlich im CMS final prüfen.';

const COPY_REPLACEMENTS = [
	[/Fuer/g, 'Für'], [/fuer/g, 'für'],
	[/Dafuer/g, 'Dafür'], [/dafuer/g, 'dafür'],
	[/Ueber/g, 'Über'], [/ueber/g, 'über'],
	[/Moecht/g, 'Möcht'], [/moecht/g, 'möcht'],
	[/Moeg/g, 'Mög'], [/moeg/g, 'mög'],
	[/Koenn/g, 'Könn'], [/koenn/g, 'könn'],
	[/Pruef/g, 'Prüf'], [/pruef/g, 'prüf'],
	[/Klaer/g, 'Klär'], [/klaer/g, 'klär'],
	[/Spuer/g, 'Spür'], [/spuer/g, 'spür'],
	[/Waehr/g, 'Währ'], [/waehr/g, 'währ'],
	[/Waerm/g, 'Wärm'], [/waerm/g, 'wärm'],
	[/Hoer/g, 'Hör'], [/hoer/g, 'hör'],
	[/Fuehl/g, 'Fühl'], [/fuehl/g, 'fühl'],
	[/Fuehr/g, 'Führ'], [/fuehr/g, 'führ'],
	[/Fueg/g, 'Füg'], [/fueg/g, 'füg'],
	[/Zurueck/g, 'Zurück'], [/zurueck/g, 'zurück'],
	[/Stueck/g, 'Stück'], [/stueck/g, 'stück'],
	[/Gaest/g, 'Gäst'], [/gaest/g, 'gäst'],
	[/Gespraech/g, 'Gespräch'], [/gespraech/g, 'gespräch'],
	[/Atmosphaere/g, 'Atmosphäre'], [/atmosphaere/g, 'atmosphäre'],
	[/Persoen/g, 'Persön'], [/persoen/g, 'persön'],
	[/Frueh/g, 'Früh'], [/frueh/g, 'früh'],
	[/Groess/g, 'Größ'], [/groess/g, 'größ'],
	[/Gross/g, 'Groß'], [/gross/g, 'groß'],
	[/Oeff/g, 'Öff'], [/oeff/g, 'öff'],
	[/Loes/g, 'Lös'], [/loes/g, 'lös'],
	[/Verlaeng/g, 'Verläng'], [/verlaeng/g, 'verläng'],
	[/Laeng/g, 'Läng'], [/laeng/g, 'läng'],
	[/Kuerz/g, 'Kürz'], [/kuerz/g, 'kürz'],
	[/Beruehr/g, 'Berühr'], [/beruehr/g, 'berühr'],
	[/Natuer/g, 'Natür'], [/natuer/g, 'natür'],
	[/Einsaetz/g, 'Einsätz'], [/einsaetz/g, 'einsätz'],
	[/Faell/g, 'Fäll'], [/faell/g, 'fäll'],
	[/Anschliess/g, 'Anschließ'], [/anschliess/g, 'anschließ'],
	[/Wuensch/g, 'Wünsch'], [/wuensch/g, 'wünsch'],
	[/Spaet/g, 'Spät'], [/spaet/g, 'spät'],
	[/Einschaetz/g, 'Einschätz'], [/einschaetz/g, 'einschätz'],
	[/Erzaehl/g, 'Erzähl'], [/erzaehl/g, 'erzähl'],
	[/Laechel/g, 'Lächel'], [/laechel/g, 'lächel'],
	[/Staerk/g, 'Stärk'], [/staerk/g, 'stärk'],
	[/Naech/g, 'Näch'], [/naech/g, 'näch'],
	[/Naehe/g, 'Nähe'], [/naehe/g, 'nähe'],
];

function normalizeGermanCopy(value) {
	if (typeof value === 'string') {
		return COPY_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
	}
	if (Array.isArray(value)) {
		return value.map(normalizeGermanCopy);
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeGermanCopy(entry)]));
	}
	return value;
}

function fileFor(service, slug) {
	return path.join(ROOT, 'src/content/seo-pages', service, `${slug}.json`);
}

function update(service, slug, patch) {
	const file = fileFor(service, slug);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const normalizedPatch = normalizeGermanCopy(patch);
	const noteParts = normalizeGermanCopy(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	const notes = [...new Set([...noteParts.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
	const next = {
		...doc,
		...normalizedPatch,
		status: STATUS,
		editorNotes: notes,
	};
	if (normalizedPatch.imageAltBase && Array.isArray(doc.imageAlts)) {
		next.imageAlts = doc.imageAlts.map((item, index) => ({
			...item,
			alt: `${normalizedPatch.imageAltBase} ${index + 1}`,
		}));
	}
	delete next.imageAltBase;
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

update('hochzeiten', 'musik-ja-wort', {
	targetKeyword: 'Musik zum Ja-Wort',
	seoTitle: 'Musik zum Ja-Wort | Live-Viola fuer den stillen Moment',
	seoDescription: 'Musik zum Ja-Wort: Live-Viola fuer den Moment direkt am Versprechen. Ruhig, nah und exakt auf Ablauf, Worte und Stille abgestimmt.',
	hero: {
		eyebrow: 'Hochzeit - Ja-Wort',
		title: 'Musik zum Ja-Wort, wenn der Raum fuer einen Augenblick stillsteht.',
		lead: 'Beim Ja-Wort braucht Musik keinen grossen Auftritt. Sie darf Spannung halten, Worte ausklingen lassen und den Moment zwischen Frage, Antwort und erstem Laecheln behutsam tragen.',
		badge: 'Fuer den Moment des Versprechens',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Nicht Auszug, nicht Empfang: das Ja-Wort ist ein eigener musikalischer Moment.',
		lede: 'Wer nach Musik zum Ja-Wort sucht, meint meistens keinen kompletten Hochzeitsablauf, sondern diesen kurzen, empfindlichen Augenblick. Dafuer muss die Musik anders geplant werden: weniger Laenge, mehr Atem, klare Einsaetze.',
		paragraphs: [
			'Die Viola eignet sich hier besonders, weil ihr Klang warm und menschlich wirkt. Ein kurzes Motiv, ein ruhiger Einsatz nach dem Ja oder eine leise Fortfuehrung waehrend eines Rituals kann den Moment staerken, ohne ihn zu ueberdecken.',
			'Gemeinsam klaeren wir, ob die Musik direkt vor dem Ja-Wort, unmittelbar danach oder waehrend eines anschliessenden Rituals erklingen soll. So bleibt der Ablauf sicher und die Musik fuehlt sich nicht zufaellig platziert an.',
		],
	},
	focus: {
		eyebrow: 'Planung',
		title: 'Drei Fragen entscheiden ueber die Musik zum Ja-Wort.',
		lead: 'Fuer diesen Suchintent zaehlt vor allem Timing: Die Musik muss den Moment beruehren und trotzdem der Zeremonie Raum lassen.',
		items: [
			{ kicker: 'Vorher', title: 'Spannung halten', text: 'Ein sehr ruhiges Motiv kann die Sekunden vor dem Versprechen sammeln, ohne dramatisch zu werden.' },
			{ kicker: 'Danach', title: 'Antwort ausklingen lassen', text: 'Nach dem Ja-Wort darf die Musik kurz oeffnen, bevor Applaus oder naechste Worte einsetzen.' },
			{ kicker: 'Ritual', title: 'Ring oder Kerze begleiten', text: 'Wenn ein Ritual folgt, kann die Viola den Uebergang weich verbinden.' },
			{ kicker: 'Abstimmung', title: 'Zeichen vereinbaren', text: 'Ich stimme Einsatz und Ende mit Traurednerin, Standesamt oder Kirche ab, damit nichts in die Worte faellt.' },
		],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Musik beim Ja-Wort',
		items: [
			{ question: 'Spielt Musik direkt waehrend des Ja-Worts?', answer: 'Meistens nicht unter den Worten selbst. Sinnvoller ist ein kurzer Einsatz direkt davor, direkt danach oder waehrend eines Rituals wie Ringtausch oder Kerzenmoment.', open: true },
			{ question: 'Wie lang sollte Musik zum Ja-Wort sein?', answer: 'Oft reichen 30 bis 90 Sekunden. Der Moment ist stark, weil er kurz ist. Die Musik sollte ihn nicht verlaengern, sondern bewusst rahmen.' },
			{ question: 'Kann unser Lied an dieser Stelle gespielt werden?', answer: 'Ja, wenn es musikalisch reduzierbar ist. Gerade bei persoenlichen Liedern pruefe ich, welcher Ausschnitt fuer Solo-Viola am besten wirkt.' },
			{ question: 'Worin unterscheidet sich diese Seite von Musik nach dem Ja-Wort?', answer: 'Hier geht es um den Moment am Versprechen selbst. Musik nach dem Ja-Wort ist heller, offener und oft naeher am Applaus oder Uebergang zum Auszug.' },
		],
	},
	contact: {
		eyebrow: 'Ja-Wort planen',
		title: 'Soll das Ja-Wort musikalisch gehalten werden?',
		lead: 'Schreib mir kurz, wie eure Zeremonie ablaeuft. Ich schlage dir einen ruhigen Einsatz fuer den Moment des Versprechens vor.',
		checklist: ['Ja-Wort', 'Ringritual', 'kurzer Einsatz'],
		formEyebrow: 'Timing klaeren',
		formTitle: 'Musik fuer das Ja-Wort anfragen',
		formSuccess: 'Danke - ich melde mich mit einer Idee fuer den passenden Einsatz rund um euer Ja-Wort.',
	},
	imageAltBase: 'Live-Viola zur Hochzeit fuer den Moment des Ja-Worts',
});

update('hochzeiten', 'musik-nach-ja-wort', {
	targetKeyword: 'Musik nach dem Ja-Wort',
	seoTitle: 'Musik nach dem Ja-Wort | Live-Viola nach dem Versprechen',
	seoDescription: 'Musik nach dem Ja-Wort: Live-Viola fuer Applaus, erstes Aufatmen und den Uebergang nach dem Versprechen.',
	hero: {
		eyebrow: 'Hochzeit - nach dem Ja',
		title: 'Musik nach dem Ja-Wort, wenn aus Spannung Freude wird.',
		lead: 'Nach dem Ja-Wort veraendert sich die Energie im Raum. Die Musik darf diesen Wechsel hoerbar machen: vom stillen Versprechen hin zu Applaus, Blickkontakt und erstem Aufatmen.',
		badge: 'Fuer Applaus und Uebergang',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Nach dem Ja-Wort braucht Musik mehr Oeffnung als vorher.',
		lede: 'Diese Seite ist nicht fuer den stillen Sekundenbruchteil des Versprechens gedacht, sondern fuer den Moment danach. Die Musik darf waermer, heller und etwas bewegter werden, ohne schon wie Auszugsmusik zu wirken.',
		paragraphs: [
			'Ein kurzes Stueck nach dem Ja-Wort kann Applaus aufnehmen, Fotos und Blicke begleiten oder den Weg zum Ringtausch beziehungsweise zur Unterschrift verbinden. Entscheidend ist, dass es nicht zu frueh in Jubel kippt.',
			'Mit der Viola entsteht ein Klang, der Freude zeigt und trotzdem elegant bleibt. So kann die Zeremonie weiteratmen, bevor der festliche Auszug oder der naechste Programmpunkt beginnt.',
		],
	},
	focus: {
		eyebrow: 'Ablauf',
		title: 'Der Moment nach dem Ja-Wort hat eigene Aufgaben.',
		lead: 'Die Musik nimmt die Emotion auf und fuehrt sie in den naechsten Schritt der Zeremonie.',
		items: [
			{ kicker: 'Aufatmen', title: 'Stille loesen', text: 'Direkt nach dem Ja darf die Musik Spannung in Waerme verwandeln.' },
			{ kicker: 'Applaus', title: 'Reaktion tragen', text: 'Wenn Gaeste klatschen, bleibt die Viola flexibel und passt sich der Dauer an.' },
			{ kicker: 'Uebergang', title: 'Naechsten Schritt verbinden', text: 'Ringtausch, Unterschrift oder Auszug koennen musikalisch vorbereitet werden.' },
			{ kicker: 'Dynamik', title: 'Nicht zu frueh feiern', text: 'Der Klang bleibt festlich, aber noch nicht so gross wie beim Auszug.' },
		],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Musik nach dem Ja-Wort',
		items: [
			{ question: 'Wann beginnt Musik nach dem Ja-Wort?', answer: 'Meist direkt nachdem beide geantwortet haben oder nachdem die Traurednerin den Moment freigibt. Das genaue Zeichen wird vorab abgestimmt.', open: true },
			{ question: 'Ist das schon die Auszugsmusik?', answer: 'Nicht unbedingt. Musik nach dem Ja-Wort ist oft kuerzer und emotionaler. Auszugsmusik ist meist groesser, heller und klar als Abschluss gesetzt.' },
			{ question: 'Kann die Musik Applaus ueberbruecken?', answer: 'Ja. Ich kann flexibel laenger oder kuerzer spielen und das Stueck so fuehren, dass es nicht gegen Applaus arbeitet.' },
			{ question: 'Welches Stueck passt nach dem Ja-Wort?', answer: 'Gut passen warme, klare Melodien mit leichter Bewegung. Je nach Paar kann das klassisch, modern oder ein kurzer Ausschnitt aus einem Wunschlied sein.' },
		],
	},
	contact: {
		eyebrow: 'Nach dem Ja-Wort',
		title: 'Der erste Moment danach soll Musik bekommen?',
		lead: 'Erzaehl mir, was nach eurem Ja-Wort passiert. Daraus entwickeln wir einen musikalischen Uebergang, der sich natuerlich anfuehlt.',
		checklist: ['Applaus', 'Uebergang', 'Wunschlied-Auszug'],
		formEyebrow: 'Ablauf senden',
		formTitle: 'Musik nach dem Ja-Wort anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag fuer den Moment direkt nach eurem Ja-Wort.',
	},
	imageAltBase: 'Live-Viola nach dem Ja-Wort bei einer Hochzeit',
});

update('hochzeiten', 'live-musik-hochzeit', {
	targetKeyword: 'Live Musik Hochzeit',
	seoTitle: 'Live Musik Hochzeit | Viola fuer Trauung, Empfang und Dinner',
	seoDescription: 'Live Musik Hochzeit: warme Solo-Viola fuer Trauung, Empfang und Dinner. Inspiration fuer Paare, die echte Musik statt Playlist suchen.',
	hero: {
		eyebrow: 'Hochzeit - Live-Musik',
		title: 'Live Musik zur Hochzeit, die nicht nach Programm klingt.',
		lead: 'Diese Seite ist fuer Paare, die erst spueren wollen, welche Rolle Live-Musik an ihrem Tag spielen kann: emotional in der Trauung, leicht beim Empfang, ruhig beim Dinner.',
		badge: 'Inspiration fuer euren Hochzeitstag',
	},
	split: {
		eyebrow: 'Einordnung',
		title: 'Live-Musik ist mehr als ein gebuchter Slot.',
		lede: 'Bei einer Hochzeit veraendert Live-Musik den Raum. Sie reagiert auf Wege, Blicke, Applaus und Pausen. Genau darin unterscheidet sie sich von einer Playlist oder einem festen Playback.',
		paragraphs: [
			'Die Viola kann sehr nah und leise klingen, aber auch festlich genug, um einen Einzug oder Auszug zu tragen. Dadurch eignet sie sich fuer Paare, die keinen Showmoment suchen, sondern eine musikalische Atmosphaere mit Haltung.',
			'Wenn ihr noch nicht wisst, ob Musik nur zur Trauung oder auch zum Empfang passen koennte, ist diese Seite der richtige Startpunkt. Fuer konkrete Buchung, Zeiten und Anfrage gibt es die Seite Live Musik Hochzeit buchen.',
		],
	},
	focus: {
		eyebrow: 'Moeglichkeiten',
		title: 'Wo Live-Musik bei einer Hochzeit wirken kann.',
		lead: 'Jeder Abschnitt braucht einen anderen musikalischen Ton.',
		items: [
			{ kicker: 'Trauung', title: 'Emotion sichtbar machen', text: 'Einzug, Ringtausch und Auszug bekommen einen eigenen Klang, ohne die Worte zu verdecken.' },
			{ kicker: 'Empfang', title: 'Ankommen erleichtern', text: 'Dezente Musik schafft Atmosphaere, waehrend Gaeste gratulieren und ins Gespraech kommen.' },
			{ kicker: 'Dinner', title: 'Ruhig begleiten', text: 'Beim Essen bleibt die Musik zurueckhaltend und gibt dem Raum trotzdem Festlichkeit.' },
			{ kicker: 'Wunschlied', title: 'Persoenlichkeit einbauen', text: 'Ein Lieblingslied kann als Viola-Fassung an einer Stelle erscheinen, die wirklich Bedeutung hat.' },
		],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Live Musik bei der Hochzeit',
		items: [
			{ question: 'Wann lohnt sich Live Musik bei einer Hochzeit besonders?', answer: 'Besonders stark wirkt sie bei Momenten, in denen Gaeste aufmerksam sind: Einzug, Ringtausch, Auszug, Sektempfang oder ein ruhiger Dinnerbeginn.', open: true },
			{ question: 'Ist Solo-Viola laut genug?', answer: 'Fuer Trauung, Standesamt, Kirche und kleinere bis mittlere Empfaenge passt Solo-Viola sehr gut. Bei groesseren Situationen wird die konkrete Akustik vorab besprochen.' },
			{ question: 'Unterscheidet sich diese Seite von Live Musik Hochzeit buchen?', answer: 'Ja. Hier geht es um Inspiration und Einsatzmoeglichkeiten. Die Buchungsseite erklaert Ablauf, Anfrage, Timing und Planung konkreter.' },
			{ question: 'Kann Live-Musik modern sein?', answer: 'Ja. Viele moderne Songs lassen sich als ruhige Viola-Version spielen, wenn Melodie und Charakter zum Instrument passen.' },
		],
	},
	contact: {
		eyebrow: 'Idee finden',
		title: 'Welche Rolle soll Live-Musik bei eurer Hochzeit haben?',
		lead: 'Schreib mir, ob ihr Musik fuer Trauung, Empfang oder Dinner sucht. Ich helfe euch, die passende Form zu finden.',
		checklist: ['Trauung', 'Empfang', 'Dinner'],
		formEyebrow: 'Anlass beschreiben',
		formTitle: 'Live Musik zur Hochzeit anfragen',
		formSuccess: 'Danke - ich melde mich mit einer ersten Idee fuer Live-Musik an eurem Hochzeitstag.',
	},
	imageAltBase: 'Live-Musik mit Viola fuer eine Hochzeit',
});

update('hochzeiten', 'live-musik-hochzeit-buchen', {
	targetKeyword: 'Live Musik Hochzeit buchen',
	seoTitle: 'Live Musik Hochzeit buchen | Ablauf, Timing und Wunschmusik',
	seoDescription: 'Live Musik Hochzeit buchen: Anfrage, Ablauf, Dauer, Wunschmusik und Timing fuer Trauung, Empfang oder Dinner persoenlich klaeren.',
	hero: {
		eyebrow: 'Hochzeit - Buchung',
		title: 'Live Musik zur Hochzeit buchen, ohne dass der Ablauf wackelt.',
		lead: 'Hier geht es konkret um Anfrage, Verfuegbarkeit, Einsatzzeiten und Abstimmung. So wird aus einer Musikidee ein sicher geplanter Teil eures Hochzeitstags.',
		badge: 'Planung und Anfrage',
	},
	split: {
		eyebrow: 'Buchungsintention',
		title: 'Wer buchen will, braucht Klarheit statt nur Inspiration.',
		lede: 'Bei Live Musik Hochzeit buchen steht nicht mehr die Frage im Vordergrund, ob Live-Musik passt. Entscheidend sind Datum, Ort, Dauer, Ablauf, Wunschmusik und die Koordination mit Standesamt, Kirche, Traurednerin oder Location.',
		paragraphs: [
			'Nach eurer Anfrage klaeren wir zuerst, welche Momente musikalisch begleitet werden sollen. Daraus ergibt sich, ob ein kurzer Einsatz zur Trauung reicht oder ob Empfang und Dinner ebenfalls sinnvoll sind.',
			'Ihr bekommt eine realistische Einschaetzung, welche Stuecke funktionieren, wie lang die Musik sein sollte und welche organisatorischen Details vor Ort wichtig sind. So ist am Hochzeitstag klar, wann die Musik beginnt und endet.',
		],
	},
	focus: {
		eyebrow: 'Buchungsablauf',
		title: 'So wird die Live-Musik planbar.',
		lead: 'Die Buchung ist am einfachsten, wenn die wichtigsten Eckdaten frueh zusammenkommen.',
		items: [
			{ kicker: '1', title: 'Datum und Ort pruefen', text: 'Zuerst klaeren wir Verfuegbarkeit, Location und ungefaehren Zeitrahmen.' },
			{ kicker: '2', title: 'Momente festlegen', text: 'Einzug, Ringtausch, Auszug, Empfang oder Dinner werden als eigene Einsaetze geplant.' },
			{ kicker: '3', title: 'Repertoire abstimmen', text: 'Wunschlieder und Stilrichtung werden auf Solo-Viola und Ablauf geprueft.' },
			{ kicker: '4', title: 'Final koordinieren', text: 'Kurz vor der Hochzeit werden Signale, Ansprechpartner und Timing sauber festgelegt.' },
		],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Buchung von Live-Musik zur Hochzeit',
		items: [
			{ question: 'Welche Angaben brauchst du fuer eine Anfrage?', answer: 'Hilfreich sind Datum, Ort, Art der Trauung, ungefaehre Uhrzeit und die Momente, fuer die ihr Musik wuenscht.', open: true },
			{ question: 'Wie frueh sollte man Live Musik zur Hochzeit buchen?', answer: 'Fuer beliebte Samstage in der Saison moeglichst frueh. Kurzfristige Anfragen koennen trotzdem funktionieren, wenn der Termin frei ist.' },
			{ question: 'Kann man erst anfragen und spaeter Stuecke festlegen?', answer: 'Ja. Die Buchung kann auf Basis des Rahmens erfolgen. Die genaue Stueckauswahl wird danach in Ruhe abgestimmt.' },
			{ question: 'Was unterscheidet die Buchungsseite von Live Musik Hochzeit?', answer: 'Diese Seite beantwortet konkrete Planungs- und Anfragefragen. Die allgemeine Live-Musik-Seite hilft eher bei Inspiration und Einsatzideen.' },
		],
	},
	contact: {
		eyebrow: 'Verfuegbarkeit pruefen',
		title: 'Moechtet ihr Live-Musik verbindlich planen?',
		lead: 'Sende Datum, Ort und die geplanten Musikmomente. Ich pruefe, was sinnvoll ist und ob euer Termin frei ist.',
		checklist: ['Datum', 'Ort', 'Musikmomente'],
		formEyebrow: 'Buchung starten',
		formTitle: 'Live Musik Hochzeit buchen',
		formSuccess: 'Danke - ich pruefe eure Angaben und melde mich mit den naechsten Schritten zur Buchung.',
	},
	imageAltBase: 'Live-Musik zur Hochzeit buchen mit Solo-Viola',
});

console.log('Rewrote 4 SEO topic pages in batch 1.');
