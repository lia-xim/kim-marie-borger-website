import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STATUS = 'rewritten-batch-3-review-needed';
const BATCH_NOTE = 'Batch 3: Firmenfeier-Topicseiten mit eigenem Business-Intent, eigenen Ablaufpunkten, FAQs, Kontaktcopy und Bildbeschreibungen differenziert. Fachlich im CMS final pruefen.';

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
	[/Staerk/g, 'Stärk'], [/staerk/g, 'stärk'],
	[/Naech/g, 'Näch'], [/naech/g, 'näch'],
	[/Naehe/g, 'Nähe'], [/naehe/g, 'nähe'],
	[/Anlaess/g, 'Anläss'], [/anlaess/g, 'anläss'],
	[/Menue/g, 'Menü'], [/menue/g, 'menü'],
	[/Gaeng/g, 'Gäng'], [/gaeng/g, 'gäng'],
	[/Praez/g, 'Präz'], [/praez/g, 'präz'],
	[/Praes/g, 'Präs'], [/praes/g, 'präs'],
	[/Repraes/g, 'Repräs'], [/repraes/g, 'repräs'],
	[/Laerm/g, 'Lärm'], [/laerm/g, 'lärm'],
	[/Buehn/g, 'Bühn'], [/buehn/g, 'bühn'],
	[/Ueb/g, 'Üb'], [/ueb/g, 'üb'],
	[/Aeus/g, 'Äuß'], [/aeus/g, 'äuß'],
	[/Regulaer/g, 'Regulär'], [/regulaer/g, 'regulär'],
	[/Haeuf/g, 'Häuf'], [/haeuf/g, 'häuf'],
	[/Hauef/g, 'Häuf'], [/hauef/g, 'häuf'],
	[/Raeum/g, 'Räum'], [/raeum/g, 'räum'],
	[/Zufaell/g, 'Zufäll'], [/zufaell/g, 'zufäll'],
	[/Boeg/g, 'Bög'], [/boeg/g, 'bög'],
	[/Laess/g, 'Läss'], [/laess/g, 'läss'],
	[/Fuell/g, 'Füll'], [/fuell/g, 'füll'],
	[/Begruess/g, 'Begrüß'], [/begruess/g, 'begrüß'],
	[/Stoer/g, 'Stör'], [/stoer/g, 'stör'],
	[/Zaeh/g, 'Zähl'], [/zaeh/g, 'zähl'],
	[/Verstaend/g, 'Verständ'], [/verstaend/g, 'verständ'],
	[/Empfaeng/g, 'Empfäng'], [/empfaeng/g, 'empfäng'],
	[/Empfae/g, 'Empfä'], [/empfae/g, 'empfä'],
	[/Redebeitraeg/g, 'Redebeiträg'], [/redebeitraeg/g, 'redebeiträg'],
	[/Gewaehl/g, 'Gewähl'], [/gewaehl/g, 'gewähl'],
	[/Jubilae/g, 'Jubilä'], [/jubilae/g, 'jubilä'],
	[/Schaetz/g, 'Schätz'], [/schaetz/g, 'schätz'],
	[/Foerm/g, 'Förm'], [/foerm/g, 'förm'],
	[/Haeng/g, 'Häng'], [/haeng/g, 'häng'],
	[/Wuerd/g, 'Würd'], [/wuerd/g, 'würd'],
	[/Draeng/g, 'Dräng'], [/draeng/g, 'dräng'],
	[/Flaech/g, 'Fläch'], [/flaech/g, 'fläch'],
	[/Verlaess/g, 'Verläss'], [/verlaess/g, 'verläss'],
	[/Staend/g, 'Ständ'], [/staend/g, 'ständ'],
	[/Unterstuetz/g, 'Unterstütz'], [/unterstuetz/g, 'unterstütz'],
	[/Saetz/g, 'Sätz'], [/saetz/g, 'sätz'],
	[/Lueck/g, 'Lück'], [/lueck/g, 'lück'],
	[/Brueck/g, 'Brück'], [/brueck/g, 'brück'],
	[/Kuenst/g, 'Künst'], [/kuenst/g, 'künst'],
	[/Muess/g, 'Müss'], [/muess/g, 'müss'],
	[/Waere/g, 'Wäre'], [/waere/g, 'wäre'],
	[/Flexibilitaet/g, 'Flexibilität'], [/flexibilitaet/g, 'flexibilität'],
	[/taet/g, 'tät'],
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

function noteFor(doc) {
	const notes = (doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
}

function update(service, slug, patch) {
	const file = fileFor(service, slug);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const normalizedPatch = normalizeGermanCopy(patch);
	const next = {
		...doc,
		...normalizedPatch,
		status: STATUS,
		editorNotes: noteFor(doc),
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

function expand(service, slug, expansion) {
	const file = fileFor(service, slug);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const normalizedExpansion = normalizeGermanCopy(expansion);
	const next = {
		...doc,
		split: {
			...doc.split,
			paragraphs: [...(doc.split?.paragraphs ?? []), ...(normalizedExpansion.paragraphs ?? [])],
		},
		faq: {
			...doc.faq,
			items: [...(doc.faq?.items ?? []), ...(normalizedExpansion.faqItems ?? [])],
		},
		editorNotes: noteFor(doc),
		status: STATUS,
	};
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

update('firmenfeiern', 'dinnermusik-firmenevent', {
	targetKeyword: 'Dinnermusik Firmenevent',
	seoTitle: 'Dinnermusik Firmenevent | Live-Viola fuer Gala & Kundenessen',
	seoDescription: 'Dinnermusik fuer Firmenevents: dezente Live-Viola fuer Gala, Kundenessen und Business-Dinner. Ruhig dosiert zwischen Gaengen, Reden und Gespraechen.',
	hero: {
		eyebrow: 'Business Dinner',
		title: 'Dinnermusik fuer Firmenevents, die den Abend fuehrt, ohne ihn zu beschallen.',
		lead: 'Beim Business-Dinner sollen Gaeste essen, zuhoeren und miteinander sprechen koennen. Die Viola setzt warme musikalische Boegen zwischen Aperitif, Gaengen und Reden, ohne den Tisch zu dominieren.',
		badge: 'Fuer Gala, Kundenessen und Dinner',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Dinnermusik ist kein Empfang und kein Showblock.',
		lede: 'Wer nach Dinnermusik fuer ein Firmenevent sucht, plant meist einen sitzenden Abend: Menue, Toasts, kurze Reden und viele leise Gespraeche. Die Musik muss genau diese Dramaturgie respektieren.',
		paragraphs: [
			'Ich plane die Sets so, dass sie zwischen den Gaengen tragen und waehrend wichtiger Worte zuruecktreten. Dadurch entsteht ein hochwertiger Rahmen, der den Abend ruhiger und feierlicher wirken laesst.',
			'Stilistisch ist ein Bogen von klassisch bis modern moeglich. Entscheidend ist nicht die groesste Aufmerksamkeit, sondern ein Klang, der zum Raum, zur Tischordnung und zum Anlass passt.',
			'Auf Wunsch stimme ich mich mit Location, Eventagentur oder interner Organisation ab, damit Aufbau, Pausen, Lautstaerke und Rechnung klar geregelt sind.',
		],
	},
	focus: {
		eyebrow: 'Dinner-Ablauf',
		title: 'So wird Dinnermusik in den Abend eingebunden.',
		lead: 'Die Musik folgt dem Service und den Redebeitraegen. Dadurch klingt der Abend bewusst geplant statt zufaellig unterlegt.',
		items: [
			{ time: 'Aperitif', kicker: 'Ankommen', title: 'Ruhiger Einstieg vor dem Dinner', text: 'Ein leichtes erstes Set nimmt Unruhe aus dem Raum, waehrend Gaeste ihren Platz finden oder noch im Foyer sind.' },
			{ time: 'Zwischen Gaengen', kicker: 'Service', title: 'Musik in den Pausen', text: 'Kurze Sets zwischen den Gaengen fuellen Wartezeiten, ohne Gespraeche am Tisch zu ueberlagern.' },
			{ time: 'Nach Reden', kicker: 'Worte', title: 'Reden nachklingen lassen', text: 'Nach einem Toast oder einer Ehrung kann ein Stueck Spannung loesen und den naechsten Teil des Abends oeffnen.' },
			{ time: 'Ausklang', kicker: 'Ende', title: 'Eleganter Abschluss', text: 'Zum Ende des Dinners bleibt die Musik waermer und reduzierter als ein Party-Start, damit der Uebergang stimmig bleibt.' },
		],
		footnote: 'Zeitpunkte sind beispielhaft. Der genaue Ablauf richtet sich nach Menue, Reden und Raum.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Dinnermusik beim Firmenevent',
		items: [
			{ question: 'Spielst du waehrend der Reden?', answer: 'In der Regel nicht. Dinnermusik wirkt am besten vor oder nach Redebeitraegen, damit Sprache und Musik nicht konkurrieren.', open: true },
			{ question: 'Wie lange sollte Dinnermusik dauern?', answer: 'Hauefig sind mehrere kurze Sets sinnvoller als ein langer Block. So bleibt die Musik nah am Service und wirkt nicht wie Dauerbeschallung.' },
			{ question: 'Ist die Viola laut genug fuer einen Dinnerraum?', answer: 'Ja, fuer viele Dinnerraeume akustisch oder mit dezenter Verstaerkung. Die Lautstaerke wird so gewaehlt, dass Tischgespraeche moeglich bleiben.' },
			{ question: 'Kann das Repertoire zum Unternehmen passen?', answer: 'Ja. Ich kann den Charakter des Abends aufnehmen: klassisch-repraesentativ, modern, warm, festlich oder sehr zurueckhaltend.' },
		],
	},
	contact: {
		eyebrow: 'Dinner planen',
		title: 'Soll euer Business-Dinner musikalisch begleitet werden?',
		lead: 'Schick mir Ablauf, Raumgroesse, geplante Reden und den zeitlichen Rahmen. Ich schlage dir eine passende Struktur fuer die Dinnermusik vor.',
		checklist: ['Dinner', 'Reden', 'Gala/Kundenessen'],
		formEyebrow: 'Ablauf senden',
		formTitle: 'Dinnermusik fuer Firmenevent anfragen',
		formSuccess: 'Danke - ich melde mich mit einer passenden Idee fuer eure Dinnermusik.',
	},
	imageAltBase: 'Live-Viola als Dinnermusik fuer ein Firmenevent',
});

update('firmenfeiern', 'empfangsmusik-firmenevent', {
	targetKeyword: 'Empfangsmusik Firmenevent',
	seoTitle: 'Empfangsmusik Firmenevent | Live-Viola fuer Ankommen & Begruessung',
	seoDescription: 'Empfangsmusik fuer Firmenevents: Live-Viola fuer Check-in, Foyer, ersten Drink und Begruessung. Hochwertig, gespraechsfreundlich und planbar.',
	hero: {
		eyebrow: 'Empfang',
		title: 'Empfangsmusik fuer Firmenevents, die den ersten Eindruck sofort ordnet.',
		lead: 'Beim Empfang entscheidet sich, wie sich ein Event anfuehlt: wartend, hektisch oder willkommen. Live-Viola gibt dem Ankommen einen ruhigen, hochwertigen Klang, waehrend Check-in und erste Gespraeche laufen.',
		badge: 'Fuer Foyer, Check-in und Begruessung',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Empfangsmusik beginnt, bevor das Programm beginnt.',
		lede: 'Diese Seite ist fuer den Moment gedacht, in dem Gaeste eintreffen, Namensschilder holen, den ersten Drink nehmen und noch nicht im eigentlichen Programm sind.',
		paragraphs: [
			'Die Musik muss einladend wirken, ohne Aufmerksamkeit von Organisation, Akkreditierung oder Begruessung abzuziehen. Genau deshalb plane ich Empfangsmusik in klaren, flexiblen Sets.',
			'Je nach Event kann der Klang elegant, leicht, klassisch oder modern sein. Wichtig ist, dass der Raum sofort gepflegt wirkt und gleichzeitig jede Unterhaltung moeglich bleibt.',
			'Wenn es einen offiziellen Start gibt, endet die Musik rechtzeitig oder fuehrt bewusst in die Begruessung hinein. Solche Zeichen stimme ich vorab mit dem Ablaufteam ab.',
		],
	},
	focus: {
		eyebrow: 'Empfangsphase',
		title: 'Die Musik folgt dem Weg der Gaeste.',
		lead: 'Empfangsmusik braucht andere Schwerpunkte als Dinner- oder Networking-Musik: Sie rahmt Ankunft, Orientierung und den ersten Eindruck.',
		items: [
			{ time: 'Check-in', kicker: 'Start', title: 'Wartezeit freundlich fuellen', text: 'Waere der Empfang sonst still oder unruhig, schafft die Viola direkt eine wertige Atmosphaere.' },
			{ time: 'Foyer', kicker: 'Raum', title: 'Orientierung geben', text: 'Musik signalisiert: Hier beginnt das Event. Sie bleibt dabei so dezent, dass Ansprachen am Empfang moeglich sind.' },
			{ time: 'Erster Drink', kicker: 'Begegnung', title: 'Gespraeche leicht machen', text: 'Ein warmes, bewegtes Repertoire verhindert Leerlauf, ohne sich vor die ersten Kontakte zu schieben.' },
			{ time: 'Begruessung', kicker: 'Uebergang', title: 'Das Programm oeffnen', text: 'Zum offiziellen Start kann die Musik auslaufen oder einen kurzen, klaren Auftakt setzen.' },
		],
		footnote: 'Empfangsmusik kann einzeln gebucht oder mit Dinner, Networking oder einem Programmpunkt kombiniert werden.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Empfangsmusik beim Firmenevent',
		items: [
			{ question: 'Wann beginnt Empfangsmusik bei einem Firmenevent?', answer: 'Meist kurz bevor die ersten Gaeste eintreffen. So ist der Raum bereits musikalisch gefasst, wenn der Empfang startet.', open: true },
			{ question: 'Stoert Live-Musik den Check-in?', answer: 'Nein, wenn sie richtig platziert und dosiert ist. Ich achte darauf, dass Namen, Akkreditierung und Hinweise gut verstanden werden.' },
			{ question: 'Kann die Musik den offiziellen Beginn begleiten?', answer: 'Ja. Wir koennen ein klares Ende, ein kurzes Auftaktstueck oder einen weichen Uebergang in die Begruessung planen.' },
			{ question: 'Ist Empfangsmusik auch fuer kleine Firmenempfaenge geeignet?', answer: 'Ja. Gerade kleinere Empfaenge profitieren von einem warmen, unaufdringlichen Klang, der nicht nach Playlist wirkt.' },
		],
	},
	contact: {
		eyebrow: 'Empfang planen',
		title: 'Soll der erste Eindruck musikalisch sitzen?',
		lead: 'Schick mir Beginn, Gaestezahl, Empfangsort und ob es eine offizielle Begruessung gibt. Ich plane daraus eine passende Empfangsmusik.',
		checklist: ['Check-in', 'Foyer', 'Begruessung'],
		formEyebrow: 'Empfang senden',
		formTitle: 'Empfangsmusik fuer Firmenevent anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag fuer euren Empfang.',
	},
	imageAltBase: 'Live-Viola als Empfangsmusik fuer ein Firmenevent',
});

update('firmenfeiern', 'hintergrundmusik-firmenevent', {
	targetKeyword: 'Hintergrundmusik Firmenevent',
	seoTitle: 'Hintergrundmusik Firmenevent | Dezente Live-Viola fuer Gespraeche',
	seoDescription: 'Hintergrundmusik fuer Firmenevents: Live-Viola als dezenter Klangrahmen fuer Empfang, Dinner und Gespraeche. Kontrollierte Lautstaerke statt Dauerbeschallung.',
	hero: {
		eyebrow: 'Hintergrundmusik',
		title: 'Hintergrundmusik fuer Firmenevents, die praesenter ist als eine Playlist und leiser als ein Programmpunkt.',
		lead: 'Gute Hintergrundmusik wird nicht ignoriert, aber sie draengt sich auch nicht vor. Die Viola schafft einen warmen Rahmen, in dem sich Gaeste unterhalten, bewegen und konzentrieren koennen.',
		badge: 'Fuer Gespraeche und Atmosphaere',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Bei Hintergrundmusik ist Zurueckhaltung die eigentliche Leistung.',
		lede: 'Wer Hintergrundmusik fuer ein Firmenevent sucht, will meist keine Show, sondern eine kontrollierbare Atmosphaere: edel, ruhig, gut dosiert und verlaesslich im Ablauf.',
		paragraphs: [
			'Ich plane Hintergrundmusik nach Raum, Akustik und Gespraechssituation. In manchen Raeumen reicht der akustische Klang, in anderen ist eine dezente Verstaerkung sinnvoll.',
			'Die Stuecke werden so gewaehlt, dass sie Verbindung schaffen, aber nicht staendig Aufmerksamkeit fordern. Dadurch bleibt das Event hochwertig, ohne den Charakter eines Konzerts zu bekommen.',
			'Gerade bei Business-Events ist die Frage nicht nur, was gespielt wird, sondern wann Pausen besser sind. Auch diese Pausen gehoeren zur musikalischen Planung.',
		],
	},
	focus: {
		eyebrow: 'Akustik',
		title: 'Hintergrundmusik wird am Raum gemessen.',
		lead: 'Die wichtigsten Entscheidungen entstehen vor Ort oder in der Ablaufplanung: Abstand, Lautstaerke, Set-Laenge und Pausen.',
		items: [
			{ time: 'Raum', kicker: 'Akustik', title: 'Klang ohne Hall-Druck', text: 'Ich achte darauf, dass die Viola den Raum waermt und nicht in halligen Flaechen zu dominant wird.' },
			{ time: 'Gespraeche', kicker: 'Abstand', title: 'Unterhaltung bleibt moeglich', text: 'Die Positionierung wird so gewaehlt, dass Gaeste sprechen koennen, ohne gegen Musik anzureden.' },
			{ time: 'Sets', kicker: 'Dauer', title: 'Kurze Einheiten statt Dauerloop', text: 'Mehrere Sets mit Pausen wirken oft hochwertiger und entlasten die Aufmerksamkeit der Gaeste.' },
			{ time: 'Pausen', kicker: 'Ruhe', title: 'Stille bewusst zulassen', text: 'Zwischen Programmteilen kann eine Pause wertvoller sein als Musik. Das wird im Ablauf mitgedacht.' },
		],
		footnote: 'Hintergrundmusik eignet sich besonders fuer Empfang, Dinner, Networking und dezente Wartezeiten.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Hintergrundmusik beim Firmenevent',
		items: [
			{ question: 'Ist Live-Viola wirklich Hintergrundmusik?', answer: 'Ja, wenn sie entsprechend geplant wird. Die Viola kann sehr dezent eingesetzt werden und bleibt trotzdem hochwertiger als eine zufaellige Playlist.', open: true },
			{ question: 'Kann die Lautstaerke angepasst werden?', answer: 'Ja. Ich passe Spielweise, Position und bei Bedarf dezente Verstaerkung an die Akustik des Raums an.' },
			{ question: 'Wie unterscheidet sich das von Dinnermusik?', answer: 'Dinnermusik ist staerker am Menue und an Reden orientiert. Hintergrundmusik ist breiter gedacht: Empfang, Bewegung, Wartezonen und Gespraechsinseln.' },
			{ question: 'Kann Hintergrundmusik auch modern sein?', answer: 'Ja. Moderne Melodien funktionieren gut, solange sie nicht zu stark nach Aufmerksamkeit verlangen und zum Anlass passen.' },
		],
	},
	contact: {
		eyebrow: 'Atmosphaere planen',
		title: 'Soll euer Event einen dezenten Live-Klang bekommen?',
		lead: 'Schick mir Raum, Gaestezahl und Ablaufpunkte. Ich gebe dir eine realistische Einschaetzung, wie Hintergrundmusik dort sinnvoll funktioniert.',
		checklist: ['Raumakustik', 'Gespraeche', 'dezente Sets'],
		formEyebrow: 'Rahmen klaeren',
		formTitle: 'Hintergrundmusik fuer Firmenevent anfragen',
		formSuccess: 'Danke - ich melde mich mit einer passenden Idee fuer dezente Hintergrundmusik.',
	},
	imageAltBase: 'Dezente Live-Viola als Hintergrundmusik fuer ein Firmenevent',
});

update('firmenfeiern', 'musik-firmenfeier', {
	targetKeyword: 'Musik Firmenfeier',
	seoTitle: 'Musik Firmenfeier | Live-Viola fuer Teamabend & Jubilaeum',
	seoDescription: 'Musik fuer Firmenfeiern: Live-Viola fuer Sommerfest, Weihnachtsfeier, Teamabend oder Jubilaeum. Festlich, persoenlich und gespraechsfreundlich.',
	hero: {
		eyebrow: 'Firmenfeier',
		title: 'Musik fuer Firmenfeiern, die Wert schaetzt, ohne steif zu wirken.',
		lead: 'Eine Firmenfeier ist naeher am Team als am Konferenzprogramm. Die Musik darf festlich sein, aber menschlich bleiben: fuer Ankommen, Ehrungen, Dinner oder einen besonderen Moment im Abend.',
		badge: 'Fuer Teamabend, Sommerfest und Jubilaeum',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Eine Firmenfeier braucht einen anderen Ton als ein Business-Event.',
		lede: 'Hier geht es um Mitarbeitende, gemeinsame Jahre, Dank, Sommerfest, Weihnachtsfeier oder Jubilaeum. Musik muss nicht nur repraesentieren, sondern eine angenehme gemeinsame Stimmung schaffen.',
		paragraphs: [
			'Live-Viola passt gut, wenn die Feier hochwertig wirken soll, aber keine laute Showbuehne braucht. Sie kann den Start oeffnen, ein Dinner begleiten oder Ehrungen einen feierlichen Rahmen geben.',
			'Ich stimme Repertoire und Einsatz mit dem Charakter der Firma ab: klassisch, modern, warm, festlich oder bewusst locker. So entsteht kein austauschbarer Event-Sound.',
			'Organisatorisch bleibt es einfach: klare Zeitfenster, kurze Abstimmung, passende Lautstaerke und eine regulaere Rechnung fuer die Buchhaltung.',
		],
	},
	focus: {
		eyebrow: 'Feiermomente',
		title: 'Musik fuer Firmenfeiern kann mehrere Aufgaben uebernehmen.',
		lead: 'Der passende Einsatz haengt davon ab, ob die Feier eher Dank, Begegnung, Jubilaeum oder Jahresabschluss ist.',
		items: [
			{ time: 'Beginn', kicker: 'Ankommen', title: 'Der Abend startet weicher', text: 'Beim Eintreffen entsteht sofort Atmosphaere, ohne dass schon ein Programmpunkt beginnt.' },
			{ time: 'Ehrung', kicker: 'Dank', title: 'Meilensteine feierlich rahmen', text: 'Ein kurzes Stueck kann Auszeichnungen, Jubilaeen oder Dankesworte wuerdevoll verbinden.' },
			{ time: 'Dinner', kicker: 'Tisch', title: 'Essen angenehm begleiten', text: 'Dezente Musik gibt dem Dinner Waerme und bleibt leise genug fuer Kolleg:innen-Gespraeche.' },
			{ time: 'Uebergang', kicker: 'Abend', title: 'In den lockeren Teil fuehren', text: 'Zum Abschluss eines Sets kann die Musik den offiziellen Teil loslassen, ohne Party-Musik ersetzen zu wollen.' },
		],
		footnote: 'Geeignet fuer Weihnachtsfeier, Sommerfest, Teamabend, Jubilaeum und interne Empfaenge.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik fuer Firmenfeiern',
		items: [
			{ question: 'Passt Live-Viola zu einer lockeren Firmenfeier?', answer: 'Ja, wenn das Repertoire passend gewaehlt wird. Die Musik kann warm und modern wirken, ohne die Feier foermlich zu machen.', open: true },
			{ question: 'Kann Musik eine Ehrung begleiten?', answer: 'Ja. Ein kurzes Stueck vor oder nach einer Ehrung macht den Moment feierlicher, ohne die Worte zu verdecken.' },
			{ question: 'Ist das auch fuer Weihnachtsfeiern geeignet?', answer: 'Ja. Neben klassischer Musik sind auch winterliche oder moderne Stuecke moeglich, je nachdem wie traditionell der Abend sein soll.' },
			{ question: 'Wie viel Planung braucht eine Firmenfeier?', answer: 'Meist reichen Datum, Ort, Gaestezahl, Ablauf und gewuenschte Stimmung. Danach kann ich passende Sets vorschlagen.' },
		],
	},
	contact: {
		eyebrow: 'Firmenfeier planen',
		title: 'Soll eure Firmenfeier einen besonderen Live-Moment bekommen?',
		lead: 'Schreib mir, ob es um Teamabend, Weihnachtsfeier, Sommerfest oder Jubilaeum geht. Ich schlage dir passende Einsatzpunkte vor.',
		checklist: ['Teamabend', 'Ehrung', 'Dinner'],
		formEyebrow: 'Feier anfragen',
		formTitle: 'Musik fuer Firmenfeier anfragen',
		formSuccess: 'Danke - ich melde mich mit einem passenden Vorschlag fuer eure Firmenfeier.',
	},
	imageAltBase: 'Live-Viola als Musik fuer eine Firmenfeier',
});

update('firmenfeiern', 'musik-firmenempfang', {
	targetKeyword: 'Musik Firmenempfang',
	seoTitle: 'Musik Firmenempfang | Live-Viola fuer offizielle Gaeste',
	seoDescription: 'Musik fuer Firmenempfaenge: Live-Viola fuer offizielle Gaeste, Foyer, Begruessung und kurze Uebergaenge. Repraesentativ und dezent.',
	hero: {
		eyebrow: 'Firmenempfang',
		title: 'Musik fuer den Firmenempfang, wenn der erste Eindruck repraesentativ sein soll.',
		lead: 'Ein Firmenempfang wirkt nach innen und nach aussen. Live-Viola gibt dem Raum sofort Haltung: fuer offizielle Gaeste, Partner, Presse, Team oder geladene Kund:innen.',
		badge: 'Fuer offizielle Empfaenge',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Der Firmenempfang ist offizieller als ein lockerer Empfang.',
		lede: 'Bei Musik fuer einen Firmenempfang geht es nicht nur um Ankommen, sondern um Wirkung: wertig, ruhig, verlaesslich und passend zum Unternehmen.',
		paragraphs: [
			'Ich plane die Musik so, dass sie das Eintreffen begleitet, Wartezeiten fuellt und den Uebergang zur Begruessung sauber vorbereitet. Der Klang bleibt dezent, aber bewusst gesetzt.',
			'Gerade bei offiziellen Gaesten ist ein kontrollierter Live-Klang wirkungsvoller als Hintergrund-Playlist oder zufaellige Beschallung. Die Viola kann repraesentativ klingen, ohne den Raum zu uebernehmen.',
			'Wenn es ein Grusswort, einen Fotomoment oder eine kurze Praesentation gibt, werden Anfang und Ende der Musik im Ablauf eindeutig festgelegt.',
		],
	},
	focus: {
		eyebrow: 'Empfangsdramaturgie',
		title: 'Ein Firmenempfang braucht klare musikalische Zeichen.',
		lead: 'Die Musik orientiert sich an Gaesteankunft, Begruessung und offizieller Wirkung.',
		items: [
			{ time: 'Ankunft', kicker: 'Eintreffen', title: 'Gaeste in den Raum holen', text: 'Ein ruhiges Set nimmt dem Beginn die Leere und macht den Empfang sofort wertiger.' },
			{ time: 'Foyer', kicker: 'Warten', title: 'Wartezeit repraesentativ halten', text: 'Wenn sich Gruppen sammeln oder Namen geprueft werden, bleibt die Atmosphaere gepflegt.' },
			{ time: 'Grusswort', kicker: 'Zeichen', title: 'Begruessung vorbereiten', text: 'Die Musik kann kontrolliert enden oder den offiziellen Start mit einem kurzen Abschluss markieren.' },
			{ time: 'Uebergang', kicker: 'Weiter', title: 'Zum Dinner oder Programm fuehren', text: 'Nach dem Empfang kann ein zweites Set den Weg in den naechsten Raum oder Programmpunkt begleiten.' },
		],
		footnote: 'Der Firmenempfang kann einzeln stehen oder Teil einer Eröffnung, Gala oder Jubiläumsfeier sein.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik beim Firmenempfang',
		items: [
			{ question: 'Was unterscheidet Firmenempfang von Empfangsmusik allgemein?', answer: 'Beim Firmenempfang ist die repraesentative Wirkung staerker. Die Musik wird deshalb formeller, kontrollierter und naeher an Begruessung oder Programm geplant.', open: true },
			{ question: 'Kannst du vor einem Grusswort spielen?', answer: 'Ja. Ich kann den Empfang musikalisch sammeln und rechtzeitig enden, damit die Begruessung klar beginnt.' },
			{ question: 'Eignet sich das fuer offizielle Gaeste?', answer: 'Ja. Solo-Viola wirkt hochwertig und persoenlich, ohne die Situation kuenstlich aufzublasen.' },
			{ question: 'Kann die Musik mit Corporate Eventagentur abgestimmt werden?', answer: 'Ja. Ich stimme Zeiten, Aufbau, Position und Zeichen gern direkt mit der Eventagentur oder internen Organisation ab.' },
		],
	},
	contact: {
		eyebrow: 'Firmenempfang planen',
		title: 'Soll euer Firmenempfang musikalisch repraesentativ wirken?',
		lead: 'Schick mir Anlass, Gaesteprofil, Ablauf und ob ein Grusswort geplant ist. Ich entwickle daraus eine passende musikalische Empfangsstruktur.',
		checklist: ['offizielle Gaeste', 'Grusswort', 'Foyer'],
		formEyebrow: 'Empfang pruefen',
		formTitle: 'Musik fuer Firmenempfang anfragen',
		formSuccess: 'Danke - ich melde mich mit einer Idee fuer euren Firmenempfang.',
	},
	imageAltBase: 'Live-Viola als Musik fuer einen offiziellen Firmenempfang',
});

update('firmenfeiern', 'musik-kundenempfang', {
	targetKeyword: 'Musik Kundenempfang',
	seoTitle: 'Musik Kundenempfang | Live-Viola fuer Kund:innen & Partner',
	seoDescription: 'Musik fuer Kundenempfang: Live-Viola fuer Kund:innen, Partner, Wartebereiche und Begruessung. Vertrauensvoll, hochwertig und gespraechsfreundlich.',
	hero: {
		eyebrow: 'Kundenempfang',
		title: 'Musik fuer den Kundenempfang, die willkommen heisst statt Aufmerksamkeit zu erzwingen.',
		lead: 'Beim Kundenempfang zaehlt die Stimmung vor dem ersten Gespraech. Die Viola schafft einen gepflegten Rahmen fuer Kund:innen, Partner und Gaeste, ohne Beratung oder Smalltalk zu stoeren.',
		badge: 'Fuer Kund:innen, Partner und Gaeste',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Ein Kundenempfang braucht Vertrauen, nicht Lautstaerke.',
		lede: 'Diese Seite ist fuer Unternehmen gedacht, die Kund:innen oder Partner empfangen und dabei einen ruhigen, hochwertigen ersten Eindruck schaffen moechten.',
		paragraphs: [
			'Die Musik kann Wartezeiten weicher machen, den Raum aufwerten und den Start von Gespraechen erleichtern. Sie bleibt bewusst zurueckhaltend, damit Beratungen, Begruessungen oder Praesentationen funktionieren.',
			'Je nach Marke und Anlass kann der Klang klassisch, modern oder sehr reduziert sein. Entscheidend ist, dass die Musik nicht nach Unterhaltung nebenbei klingt, sondern nach bewusstem Empfang.',
			'Ich klaere vorab, ob es eher um Lounge, Foyer, Showroom, Kanzlei, Praxis, Messeabend oder einen Empfang im Unternehmen geht.',
		],
	},
	focus: {
		eyebrow: 'Kundenreise',
		title: 'Die Musik begleitet den Weg vom Ankommen zum Gespraech.',
		lead: 'Beim Kundenempfang steht nicht das Eventprogramm im Mittelpunkt, sondern das Gefuehl von Sorgfalt und Willkommen.',
		items: [
			{ time: 'Willkommen', kicker: 'Erster Blick', title: 'Der Raum wirkt vorbereitet', text: 'Live-Musik zeigt unmittelbar, dass der Empfang bewusst gestaltet ist.' },
			{ time: 'Wartezeit', kicker: 'Ruhe', title: 'Warten fuehlt sich kuerzer an', text: 'Ein dezenter Klang entspannt die Minuten, bevor Gespraeche, Beratung oder Praesentation beginnen.' },
			{ time: 'Gespraech', kicker: 'Kontakt', title: 'Smalltalk bleibt leicht', text: 'Die Musik bleibt so dosiert, dass Kund:innen nicht gegen den Raum sprechen muessen.' },
			{ time: 'Abschluss', kicker: 'Nachklang', title: 'Der Empfang endet gepflegt', text: 'Ein kurzes Set zum Ausklang laesst Begegnungen runder wirken, ohne einen grossen Schlussakkord zu brauchen.' },
		],
		footnote: 'Besonders passend fuer Showroom, Kanzlei, Praxis, Messeabend, Partnerempfang oder exklusive Kundentermine.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik beim Kundenempfang',
		items: [
			{ question: 'Stoert Live-Musik Beratungsgespraeche?', answer: 'Nein, wenn sie dezent geplant ist. Ich achte auf Position, Dynamik und Pausen, damit Gespraeche klar verstaendlich bleiben.', open: true },
			{ question: 'Passt das auch fuer kleine Kundenempfaenge?', answer: 'Ja. Gerade in kleineren Raeumen wirkt Solo-Viola persoenlich und hochwertig, ohne viel Technik oder Buehne zu brauchen.' },
			{ question: 'Kann die Musik zur Marke passen?', answer: 'Ja. Wir koennen den Charakter abstimmen: klassisch, modern, ruhig, offen oder besonders reduziert.' },
			{ question: 'Wie kurzfristig laesst sich ein Kundenempfang planen?', answer: 'Wenn Termin und Ablauf feststehen, ist die musikalische Planung oft schnell moeglich. Wichtig sind Raum, Dauer und gewuenschte Stimmung.' },
		],
	},
	contact: {
		eyebrow: 'Kundenempfang planen',
		title: 'Soll euer Kundenempfang persoenlicher klingen?',
		lead: 'Schick mir Anlass, Branche, Raum und Zeitfenster. Ich melde mich mit einer Idee, die zum Kundenkontakt passt.',
		checklist: ['Kund:innen', 'Wartezeit', 'Showroom/Foyer'],
		formEyebrow: 'Empfang anfragen',
		formTitle: 'Musik fuer Kundenempfang anfragen',
		formSuccess: 'Danke - ich melde mich mit einem passenden Vorschlag fuer euren Kundenempfang.',
	},
	imageAltBase: 'Live-Viola als Musik fuer einen Kundenempfang',
});

update('firmenfeiern', 'musik-business-event', {
	targetKeyword: 'Musik Business Event',
	seoTitle: 'Musik Business Event | Live-Viola fuer Agenda & Uebergaenge',
	seoDescription: 'Musik fuer Business Events: Live-Viola fuer Opening, Pausen, Speaker-Wechsel, Award oder Closing. Praezise geplant und gespraechsfreundlich.',
	hero: {
		eyebrow: 'Business Event',
		title: 'Musik fuer Business Events, die die Agenda verbindet statt sie zu unterbrechen.',
		lead: 'Ein Business Event hat Timing: Opening, Panels, Pausen, Speaker-Wechsel, Award, Closing. Die Viola kann diese Uebergaenge praezise rahmen und dem Programm einen hochwertigen Live-Klang geben.',
		badge: 'Fuer Agenda, Pausen und Closing',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Beim Business Event zaehlt der Ablauf mehr als der einzelne Song.',
		lede: 'Wer Musik fuer ein Business Event sucht, braucht meist keine allgemeine Hintergrundmusik, sondern planbare musikalische Einsaetze zwischen Programmpunkten.',
		paragraphs: [
			'Ich denke Musik hier als Teil der Regie: ein kurzer Auftakt, ein Klang fuer den Raumwechsel, ein ruhiges Set in der Pause oder ein markierter Abschluss nach dem letzten Wort.',
			'Der Vorteil der Solo-Viola liegt in der Flexibilitaet. Sie braucht wenig Platz, kann akustisch oder dezent verstaerkt spielen und wirkt hochwertig, ohne wie Entertainment neben der Agenda zu stehen.',
			'Vorab klaeren wir Ablaufplan, Raum, technische Situation und Zeichen. Dadurch bleibt am Veranstaltungstag wenig dem Zufall ueberlassen.',
		],
	},
	focus: {
		eyebrow: 'Agenda',
		title: 'Musik kann Business-Programme sauber verbinden.',
		lead: 'Diese Seite unterscheidet sich bewusst von Networking-Musik: Im Mittelpunkt steht die Struktur des Programms.',
		items: [
			{ time: 'Opening', kicker: 'Start', title: 'Das Programm konzentriert beginnen', text: 'Ein kurzes musikalisches Signal sammelt den Raum, bevor Moderation oder Keynote starten.' },
			{ time: 'Wechsel', kicker: 'Regie', title: 'Speaker-Wechsel ueberbruecken', text: 'Kurze Einsaetze verhindern harte Luecken und geben Technik oder Moderation Luft.' },
			{ time: 'Pause', kicker: 'Lounge', title: 'Pausen hochwertig halten', text: 'Zwischen Agenda-Teilen darf Musik lockern, ohne das Event in Empfangsatmosphaere aufzulösen.' },
			{ time: 'Closing', kicker: 'Ende', title: 'Den Abschluss bewusst setzen', text: 'Nach Award, Dank oder letztem Vortrag kann ein kurzer musikalischer Nachklang den Rahmen schliessen.' },
		],
		footnote: 'Ideal fuer Konferenzen, Kundentage, interne Business-Formate, Awards und gesetzte Unternehmensveranstaltungen.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik fuer Business Events',
		items: [
			{ question: 'Kann Musik in eine feste Agenda eingebunden werden?', answer: 'Ja. Ich arbeite mit Ablaufplan, Zeiten und klaren Zeichen, damit Musik Uebergaenge verbindet und keine Programmpunkte stoert.', open: true },
			{ question: 'Ist das eher Hintergrundmusik oder Programmmusik?', answer: 'Beides ist moeglich. Bei Business Events geht es oft um kurze, praezise Einsaetze plus dezente Pausenmusik.' },
			{ question: 'Braucht die Viola viel Technik?', answer: 'Meist wenig. Je nach Raum spiele ich akustisch oder mit dezenter Verstaerkung. Das klaeren wir vorab mit der Location oder Technik.' },
			{ question: 'Kannst du mit Eventagentur oder Regie zusammenarbeiten?', answer: 'Ja. Ich kann Ablauf, Aufbau und Einsaetze direkt mit Agentur, Technik oder interner Projektleitung abstimmen.' },
		],
	},
	contact: {
		eyebrow: 'Business Event planen',
		title: 'Soll die Agenda musikalisch verbunden werden?',
		lead: 'Schick mir Ablaufplan, Raum, Gaestezahl und die gewuenschten Einsatzpunkte. Ich entwickle daraus eine klare musikalische Struktur.',
		checklist: ['Opening', 'Speaker-Wechsel', 'Closing'],
		formEyebrow: 'Agenda senden',
		formTitle: 'Musik fuer Business Event anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag fuer euer Business Event.',
	},
	imageAltBase: 'Live-Viola als Musik fuer ein Business Event',
});

update('firmenfeiern', 'musik-networking-event', {
	targetKeyword: 'Musik Networking Event',
	seoTitle: 'Musik Networking Event | Live-Viola fuer Gespraeche & Pausen',
	seoDescription: 'Musik fuer Networking Events: Live-Viola fuer Gespraechsinseln, Warm-up, Pausen und Ausklang. Dezent, beweglich und nicht konkurrierend.',
	hero: {
		eyebrow: 'Networking',
		title: 'Musik fuer Networking Events, die Gespraeche leichter macht.',
		lead: 'Bei einem Networking Event ist nicht die Buehne der Mittelpunkt, sondern die Begegnung. Live-Viola schafft Atmosphaere, waehrend Menschen ankommen, sich vorstellen, weiterziehen und ins Gespraech kommen.',
		badge: 'Fuer Gespraeche, Pausen und Ausklang',
	},
	split: {
		eyebrow: 'Suchintention',
		title: 'Networking-Musik darf nie zur akustischen Konkurrenz werden.',
		lede: 'Diese Seite unterscheidet sich bewusst von Musik fuer Business Events mit Agenda. Beim Networking zaehlt, dass Musik Bewegung und Kontakt unterstuetzt, ohne Gespraeche zu besetzen.',
		paragraphs: [
			'Ich spiele in Sets, die sich dem Raum anpassen: etwas praesenter beim Warm-up, ruhiger in Gespraechsphasen, klarer beim Ausklang. So bleibt die Musik lebendig, aber kontrolliert.',
			'Die Viola eignet sich, weil sie warm und persoenlich klingt, ohne den Druck einer Band oder einer lauten Anlage aufzubauen. Gerade fuer kleinere bis mittlere Networking-Formate kann das sehr passend sein.',
			'Vorab klaeren wir, ob es kurze Impulse, Tischwechsel, Pausen oder offene Lounge-Situationen gibt. Daraus entsteht die musikalische Dramaturgie.',
		],
	},
	focus: {
		eyebrow: 'Gespraechsfluss',
		title: 'Musik beim Networking richtet sich nach Bewegung im Raum.',
		lead: 'Der Erfolg liegt darin, Kontakte zu ermoeglichen. Die Musik unterstuetzt Rhythmus, Pausen und Raumgefuehl.',
		items: [
			{ time: 'Warm-up', kicker: 'Ankommen', title: 'Erste Kontakte erleichtern', text: 'Ein leichtes Set nimmt dem Beginn die Steifheit und gibt Gaesten einen gemeinsamen Raum.' },
			{ time: 'Gesprächsinseln', kicker: 'Kontakt', title: 'Unterhaltungen nicht verdecken', text: 'Die Dynamik bleibt so niedrig, dass Namen, Branchen und erste Saetze gut verstanden werden.' },
			{ time: 'Wechsel', kicker: 'Bewegung', title: 'Tisch- oder Gruppenwechsel begleiten', text: 'Kurze musikalische Boegen helfen, neue Gespraeche natuerlich zu starten.' },
			{ time: 'Ausklang', kicker: 'Ende', title: 'Offen auslaufen lassen', text: 'Zum Abschluss kann die Musik waermer werden und den Raum zusammenhalten, waehrend Kontakte weiterlaufen.' },
		],
		footnote: 'Geeignet fuer Netzwerkabende, Alumni-Events, Kunden-Lounges, Branchenabende und Partnerformate.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik fuer Networking Events',
		items: [
			{ question: 'Stoert Live-Musik beim Netzwerken?', answer: 'Nein, wenn sie bewusst fuer Gespraeche geplant wird. Ich halte Dynamik, Position und Set-Laenge so, dass Kontakte leichter statt schwerer werden.', open: true },
			{ question: 'Was unterscheidet Networking-Musik von Business-Event-Musik?', answer: 'Business-Event-Musik folgt haeufig einer Agenda. Networking-Musik folgt dem Raum: Ankommen, Gespraechsinseln, Bewegung und Ausklang.' },
			{ question: 'Kann die Musik auch nur in Pausen spielen?', answer: 'Ja. Gerade bei Networking-Formaten sind gezielte Sets in Pausen oder Wechselmomenten oft wirkungsvoller als durchgehende Musik.' },
			{ question: 'Passt Viola zu modernen Networking-Formaten?', answer: 'Ja. Mit passendem Repertoire wirkt die Viola warm, modern und hochwertig, ohne nach klassischem Konzert zu klingen.' },
		],
	},
	contact: {
		eyebrow: 'Networking planen',
		title: 'Soll euer Networking Event einen ruhigen Live-Rahmen bekommen?',
		lead: 'Schick mir Format, Gaestezahl, Raum und ob es feste Wechsel oder offene Gespraechsphasen gibt. Ich plane die Musik passend zum Austausch.',
		checklist: ['Warm-up', 'Gespraeche', 'Ausklang'],
		formEyebrow: 'Format senden',
		formTitle: 'Musik fuer Networking Event anfragen',
		formSuccess: 'Danke - ich melde mich mit einer passenden Idee fuer euer Networking Event.',
	},
	imageAltBase: 'Live-Viola als Musik fuer ein Networking Event',
});

expand('firmenfeiern', 'dinnermusik-firmenevent', {
	paragraphs: [
		'Für die Planung ist besonders wichtig, ob die Musik im selben Raum wie der Service stattfindet oder ob Aperitif, Dinner und Ausklang räumlich getrennt sind. Daraus ergeben sich Position, Set-Länge und die Frage, ob ein sehr dezenter technischer Aufbau sinnvoll ist.',
		'Ich vermeide beim Dinner bewusst Stücke, die zu viel Aufmerksamkeit auf sich ziehen. Stattdessen entsteht ein Repertoire, das Gespräche trägt, Pausen zwischen Gängen füllt und den Abend hochwertig wirken lässt, ohne den Ablauf schwerer zu machen.',
		'Wenn das Dinner Teil einer größeren Gala ist, kann die Musik außerdem den Unterschied zwischen offiziellem Programm und persönlicher Tischatmosphäre markieren. Gerade dieser Wechsel macht Dinnermusik für Firmenevents eigenständig.',
	],
	faqItems: [
		{ question: 'Kann Dinnermusik mit einem Gala-Programm kombiniert werden?', answer: 'Ja. Die Musik kann vor dem Programm, zwischen Gängen oder nach einzelnen Redebeiträgen liegen. Wichtig ist, dass Gala-Moderation und Musik klare eigene Zeitfenster bekommen.' },
	],
});

expand('firmenfeiern', 'empfangsmusik-firmenevent', {
	paragraphs: [
		'Empfangsmusik funktioniert besonders gut, wenn der Raum noch nicht komplett gefüllt ist. Die Musik verhindert, dass frühe Gäste in eine stille oder organisatorisch unruhige Situation kommen, und gibt dem Start sofort eine bewusst gestaltete Atmosphäre.',
		'Anders als reine Hintergrundmusik ist Empfangsmusik zeitlich klarer begrenzt. Sie beginnt vor dem offiziellen Programm, begleitet das Eintreffen und endet so, dass Moderation, Begrüßung oder Raumwechsel eindeutig wahrgenommen werden.',
		'Bei größeren Empfängen denke ich auch Laufwege, Eingangssituation und Ansprechpartner am Empfang mit. Die Viola soll dort hörbar sein, wo sie willkommen heißt, aber nicht dort dominieren, wo organisatorische Informationen wichtig sind.',
	],
	faqItems: [
		{ question: 'Kann Empfangsmusik auch draußen beginnen?', answer: 'Ja, wenn Wetter, Schatten und ein geschützter Platz passen. Oft ist es sinnvoller, nah am Eingang oder im Foyer zu spielen, damit die Musik den tatsächlichen Ankunftspunkt begleitet.' },
	],
});

expand('firmenfeiern', 'hintergrundmusik-firmenevent', {
	paragraphs: [
		'Für Hintergrundmusik ist die räumliche Situation entscheidend. Ein hoher Raum, harte Flächen oder viele parallele Gespräche verändern, wie präsent ein Instrument wahrgenommen wird. Deshalb plane ich nicht nur Repertoire, sondern auch Position und Pausen.',
		'Eine gute Hintergrundmusik muss auch aushalten, dass sie zeitweise nicht im Mittelpunkt steht. Genau darin liegt der Unterschied zu einem Konzert: Die Musik verbessert die Atmosphäre, ohne den Anlass in eine Bühnensituation zu verwandeln.',
		'Wenn der Ablauf mehrere Phasen hat, kann die Hintergrundmusik kleine Farbwechsel bekommen: heller beim Empfang, ruhiger beim Dinner, reduzierter bei konzentrierten Gesprächen. So bleibt die Seite klar vom Networking- und Dinner-Intent getrennt.',
	],
	faqItems: [
		{ question: 'Kann Hintergrundmusik komplett ohne Moderation laufen?', answer: 'Ja. Wir legen vorher Set-Zeiten, Pausen und gewünschte Stimmung fest. Am Event selbst kann die Musik dann sehr selbstständig im Hintergrund funktionieren.' },
	],
});

expand('firmenfeiern', 'musik-firmenfeier', {
	paragraphs: [
		'Bei einer Firmenfeier spielt die emotionale Ebene eine größere Rolle als bei vielen externen Business-Formaten. Menschen feiern gemeinsam, werden geehrt, stoßen an oder erleben einen Jahresabschluss. Die Musik darf deshalb persönlicher wirken.',
		'Ich achte darauf, dass die Viola nicht zu distanziert klingt. Ein internes Fest braucht keinen kühlen Empfangston, sondern eine Mischung aus Wertschätzung, Leichtigkeit und einem Klang, der Kolleg:innen miteinander in Kontakt bringt.',
		'Wenn es mehrere Programmpunkte gibt, kann die Musik als roter Faden dienen: beim Ankommen, vor einer Rede, nach einer Ehrung oder während des Dinners. Dadurch wirkt die Feier zusammenhängender, ohne zusätzliche Moderation zu brauchen.',
	],
	faqItems: [
		{ question: 'Kann die Musik auch auf die Unternehmenskultur abgestimmt werden?', answer: 'Ja. Ein junges Team braucht oft einen anderen Ton als ein festliches Jubiläum. Ich stimme Stil, Länge und Dynamik auf Anlass und Unternehmenskultur ab.' },
	],
});

expand('firmenfeiern', 'musik-firmenempfang', {
	paragraphs: [
		'Beim Firmenempfang ist der Anlass häufig offizieller: Ein neuer Standort, ein Jubiläum, ein Empfang für Partner oder ein Termin mit geladenen Gästen. Die Musik muss deshalb nicht nur schön sein, sondern Haltung zeigen.',
		'Ich plane Firmenempfänge mit Blick auf Protokoll und Aufmerksamkeit. Wenn wichtige Personen begrüßt werden, Fotos entstehen oder ein kurzer offizieller Teil folgt, darf Musik nicht zufällig enden, sondern braucht ein klares Zeichen.',
		'Gleichzeitig soll der Empfang nicht zu streng wirken. Die Viola kann den repräsentativen Rahmen weicher machen und den Raum menschlicher klingen lassen, ohne den offiziellen Charakter zu verlieren.',
	],
	faqItems: [
		{ question: 'Passt Musik zum Firmenempfang auch vor Presse oder Partnern?', answer: 'Ja. Live-Viola wirkt hochwertig und kontrolliert. Gerade bei offiziellen Gästen ist ein ruhiger Live-Klang oft passender als eine beliebige Hintergrund-Playlist.' },
	],
});

expand('firmenfeiern', 'musik-kundenempfang', {
	paragraphs: [
		'Ein Kundenempfang ist oft näher am Vertrauen als an der Show. Gäste sollen sich willkommen fühlen, aber gleichzeitig verstehen, dass der Termin professionell vorbereitet ist. Genau diese Balance kann Live-Musik sehr fein unterstützen.',
		'Ich unterscheide dabei zwischen offenem Empfang und konkretem Kundentermin. Im offenen Rahmen darf die Musik etwas mehr Raum geben; bei Beratung, Produktgespräch oder Präsentation bleibt sie deutlich zurückhaltender oder pausiert bewusst.',
		'Gerade in Showrooms, Praxen, Kanzleien oder hochwertigen Empfangsbereichen kann ein Solo-Instrument viel bewirken, weil es persönlich klingt und trotzdem wenig Fläche braucht. Der Raum wirkt vorbereitet, ohne technisch überladen zu sein.',
	],
	faqItems: [
		{ question: 'Kann Musik im Kundenempfang auch nur für ein kurzes Zeitfenster gebucht werden?', answer: 'Ja. Für exklusive Kundentermine oder einen Empfang vor einer Präsentation reichen oft gezielte kurze Sets, die den wichtigsten Moment rahmen.' },
	],
});

expand('firmenfeiern', 'musik-business-event', {
	paragraphs: [
		'Business Events haben oft eine klare Dramaturgie, aber nicht immer genug Wärme zwischen den Programmpunkten. Musik kann diese Zwischenräume schließen: nicht als Ablenkung, sondern als Regieelement, das Aufmerksamkeit sammelt.',
		'Ich frage deshalb nicht nur nach gewünschter Musik, sondern nach Ablaufplan, Moderation, Technik, Raumwechseln und möglichen Wartezeiten. Daraus entsteht ein Einsatzplan, der sich in die Veranstaltung einfügt.',
		'Wenn es Awards, Panels oder Keynotes gibt, kann ein kurzer musikalischer Rahmen die Wertigkeit erhöhen. Gleichzeitig bleiben die Einsätze so kompakt, dass das Event nicht seinen sachlichen Charakter verliert.',
	],
	faqItems: [
		{ question: 'Kann Musik bei einem Business Event sehr punktuell eingesetzt werden?', answer: 'Ja. Gerade kurze Einsätze für Opening, Speaker-Wechsel oder Closing sind sinnvoll, wenn die Agenda im Vordergrund bleiben soll.' },
	],
});

expand('firmenfeiern', 'musik-networking-event', {
	paragraphs: [
		'Networking lebt von kleinen Schwellen: jemanden ansprechen, eine Gruppe wechseln, ein Gespräch beenden, einen neuen Kontakt aufnehmen. Musik kann diese Schwellen weicher machen, wenn sie nicht zu viel Aufmerksamkeit fordert.',
		'Ich plane Networking-Musik deshalb beweglicher als klassische Empfangsmusik. Je nachdem, ob Menschen stehen, sitzen, rotieren oder frei durch den Raum gehen, verändert sich auch die musikalische Dichte.',
		'Besonders sinnvoll sind klare Pausen. Wenn ein Raum viele Stimmen trägt, kann Stille zwischen den Sets helfen, bevor die Musik wieder einen neuen Impuls setzt. So bleibt Networking-Musik unterstützend statt anstrengend.',
	],
	faqItems: [
		{ question: 'Kann die Musik auf wechselnde Gesprächsphasen reagieren?', answer: 'Ja. Ich kann Sets kürzer, ruhiger oder präsenter gestalten, wenn sich die Gesprächsdichte im Raum verändert.' },
	],
});

expand('firmenfeiern', 'empfangsmusik-firmenevent', {
	paragraphs: [
		'Wenn der Empfang später in Dinner, Vortrag oder Networking übergeht, kann die Musik diesen Übergang vorbereiten: erst offen und leicht, dann etwas fokussierter und schließlich klar beendet. So merken Gäste intuitiv, dass die nächste Phase beginnt.',
	],
});

expand('firmenfeiern', 'hintergrundmusik-firmenevent', {
	paragraphs: [
		'Für Veranstalter:innen ist außerdem wichtig, dass Hintergrundmusik planbar bleibt. Deshalb bespreche ich im Vorfeld, wann Musik wirklich gebraucht wird, wann sie zurücktreten soll und welche Bereiche des Raums musikalisch sinnvoll erreichbar sind.',
	],
});

expand('firmenfeiern', 'musik-firmenfeier', {
	paragraphs: [
		'Bei sehr gemischten Teams kann ein breites Repertoire sinnvoll sein: vertraute Melodien, moderne ruhige Stücke und ein paar festliche Klassiker. So fühlt sich die Musik nicht nach einer einzigen Zielgruppe an, sondern nach einem gemeinsamen Abend.',
	],
});

expand('firmenfeiern', 'musik-firmenempfang', {
	paragraphs: [
		'Wenn mehrere Gästetypen zusammenkommen, etwa Geschäftsführung, Mitarbeitende, Partner und externe Gäste, kann die Musik den gemeinsamen Nenner bilden. Sie wirkt verbindend, ohne zu privat oder zu unterhaltend zu werden.',
	],
});

expand('firmenfeiern', 'musik-kundenempfang', {
	paragraphs: [
		'Wenn Kund:innen warten, ist die gefühlte Zeit oft wichtiger als die tatsächliche Dauer. Ein ruhiger Live-Klang nimmt dem Warten den Druck und sorgt dafür, dass der erste Kontakt entspannter beginnt.',
	],
});

expand('firmenfeiern', 'musik-business-event', {
	paragraphs: [
		'Für Veranstaltungsleitungen ist besonders hilfreich, dass musikalische Einsätze vorher exakt benannt werden können. So lassen sich Technik, Moderation und Timing sauber koordinieren, ohne dass am Veranstaltungstag spontan entschieden werden muss.',
	],
});

expand('firmenfeiern', 'musik-networking-event', {
	paragraphs: [
		'Wenn das Networking Teil eines größeren Tagesprogramms ist, kann die Musik bewusst anders klingen als die Agenda-Phasen. Dadurch entsteht ein erkennbarer Wechsel: weniger Bühne, mehr Begegnung, aber weiterhin ein hochwertiger Rahmen.',
	],
});
