import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STATUS = 'rewritten-batch-2-review-needed';
const BATCH_NOTE = 'Batch 2: Trauer-Topicseiten mit eigener Suchintention, eigenen Abschnitten, eigenen FAQs und eigener Kontaktcopy differenziert. Fachlich im CMS final prüfen.';

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
	const next = {
		...doc,
		...patch,
		status: STATUS,
		editorNotes: noteFor(doc),
	};
	if (patch.imageAltBase && Array.isArray(doc.imageAlts)) {
		next.imageAlts = doc.imageAlts.map((item, index) => ({
			...item,
			alt: `${patch.imageAltBase} ${index + 1}`,
		}));
	}
	delete next.imageAltBase;
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

update('beerdigungen', 'musik-trauerfeier', {
	targetKeyword: 'Musik Trauerfeier',
	seoTitle: 'Musik Trauerfeier | Viola für Abschiedsworte & Stille',
	seoDescription: 'Musik zur Trauerfeier: Live-Viola für Beginn, Erinnerung, Kerzenmoment und Auszug. Ruhig abgestimmt mit Familie, Rednerin oder Bestattungshaus.',
	hero: {
		eyebrow: 'Trauerfeier',
		title: 'Musik für die Trauerfeier, die Worte nicht ersetzt, sondern trägt.',
		lead: 'Bei einer Trauerfeier entsteht Musik zwischen Ansprache, Erinnerung und Stille. Die Viola begleitet diese Übergänge behutsam: als Anfang, als Atemraum nach Worten oder als leiser Auszug.',
		badge: 'Für die Zeremonie des Abschieds',
	},
	elegy: {
		quote: 'In einer Trauerfeier braucht Musik einen Platz zwischen Wort, Erinnerung und Schweigen.',
		passages: [
			{
				strong: 'Der Suchintent',
				text: 'Wer nach Musik für eine Trauerfeier sucht, plant meist die Zeremonie selbst: Beginn, Erinnerungsworte, Kerzenmoment, Auszug oder eine stille Unterbrechung, wenn Sprache nicht ausreicht.',
			},
			{
				strong: 'Musikalische Aufgabe',
				text: 'Die Musik steht nicht wie ein Programmpunkt im Vordergrund. Sie rahmt die Feier, nimmt Spannung aus dem Raum und lässt Angehörigen Zeit, ohne den Ablauf schwerer zu machen.',
			},
			{
				strong: 'Abstimmung',
				text: 'Ich kläre die Einsätze mit Rednerin, Pfarrerin, Bestattungshaus oder Familie. Dadurch bleibt die Trauerfeier ruhig geführt und die Musik beginnt erst dort, wo sie wirklich gebraucht wird.',
			},
		],
	},
	solemn: {
		eyebrow: 'Ablauf',
		title: 'Wo Musik in der Trauerfeier sinnvoll wirkt.',
		lead: 'Für diesen Suchbegriff geht es um die Dramaturgie der Feier selbst, nicht nur um eine Liedliste.',
		cards: [
			{
				rom: 'Beginn',
				title: 'Ankommen lassen',
				poet: 'Ein ruhiges erstes Stück hilft, den Raum zu sammeln, bevor die ersten Worte gesprochen werden.',
				list: ['Einzug in die Halle', 'Kerze oder Foto', 'erster stiller Moment'],
			},
			{
				rom: 'Zwischenraum',
				title: 'Worte nachklingen lassen',
				poet: 'Nach einer Rede kann ein kurzer musikalischer Atemzug stärker wirken als ein weiterer Text.',
				list: ['nach der Ansprache', 'nach Fürbitten', 'vor dem Auszug'],
			},
		],
		listLabel: 'Mögliche Einsatzpunkte',
		list: ['Beginn der Trauerfeier', 'nach persönlichen Erinnerungen', 'Kerzen- oder Blumenmoment', 'Auszug aus der Trauerhalle'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Musik bei der Trauerfeier',
		items: [
			{
				question: 'Wie viele Musikstücke passen in eine Trauerfeier?',
				answer: 'Häufig reichen zwei bis vier Einsätze. Entscheidend ist nicht die Anzahl, sondern ob die Musik an den richtigen Stellen Raum schafft.',
				open: true,
			},
			{
				question: 'Spielst du während der Trauerrede?',
				answer: 'In der Regel nicht unter gesprochenen Worten. Sinnvoller ist Musik davor, danach oder als Übergang, damit Sprache und Musik sich nicht gegenseitig überdecken.',
			},
			{
				question: 'Kann die Trauerrednerin die Einsätze mit dir abstimmen?',
				answer: 'Ja. Ich stimme mich direkt mit Rednerin, Pfarrer, Bestatterin oder Familie ab, damit Beginn und Ende der Musik eindeutig sind.',
			},
			{
				question: 'Sind moderne Lieder in einer Trauerfeier möglich?',
				answer: 'Ja, wenn die Melodie auf Solo-Viola tragfähig ist. Ich prüfe, welcher Ausschnitt würdevoll wirkt und zur Feier passt.',
			},
		],
	},
	contact: {
		eyebrow: 'Trauerfeier planen',
		title: 'Soll die Trauerfeier musikalisch gerahmt werden?',
		lead: 'Schreib mir, welche Momente in der Feier vorgesehen sind. Ich helfe dir, passende musikalische Einsätze ruhig und sicher zu planen.',
		checklist: ['Beginn', 'Erinnerungsworte', 'Auszug'],
		formEyebrow: 'Ablauf senden',
		formTitle: 'Musik zur Trauerfeier anfragen',
		formSuccess: 'Danke - ich melde mich mit einem behutsamen Vorschlag für die Musik zur Trauerfeier.',
	},
	imageAltBase: 'Live-Viola als Musik für eine Trauerfeier',
});

update('beerdigungen', 'musik-beerdigung', {
	targetKeyword: 'Musik Beerdigung',
	seoTitle: 'Musik Beerdigung | Viola für Trauerhalle, Kirche & Grab',
	seoDescription: 'Musik zur Beerdigung mit Solo-Viola: Trauerhalle, Kirche, Auszug oder Gang zum Grab ruhig begleiten und mit dem Bestattungshaus abstimmen.',
	hero: {
		eyebrow: 'Beerdigung',
		title: 'Musik zur Beerdigung, ruhig geplant vom ersten Lied bis zum Gang zum Grab.',
		lead: 'Eine Beerdigung hat oft mehrere Stationen: Trauerhalle oder Kirche, Abschiedsworte, Auszug, manchmal der Weg zum Grab. Die Musik wird so geplant, dass sie den Tag trägt, ohne ihn zu überladen.',
		badge: 'Für Zeremonie und Weg',
	},
	elegy: {
		quote: 'Bei einer Beerdigung zählt nicht nur welches Lied, sondern wann es den Tag hält.',
		passages: [
			{
				strong: 'Der Rahmen',
				text: 'Diese Seite richtet sich an Menschen, die Musik für eine konkrete Beerdigung suchen. Der Fokus liegt auf Ablauf, Ort, Würde und verlässlicher Abstimmung mit dem Bestattungshaus.',
			},
			{
				strong: 'Mehr als ein Raum',
				text: 'Anders als bei einer reinen Trauerfeier kann die Beerdigung auch den Auszug, den Weg nach draußen oder einen Moment am Grab umfassen. Dafür muss die Musik praktisch und musikalisch anders geplant werden.',
			},
			{
				strong: 'Ruhige Organisation',
				text: 'Ich kläre Ankunft, Platzierung, Einsätze und Wunschmusik vorab. Angehörige müssen am Tag selbst nicht erklären, wann etwas beginnen soll.',
			},
		],
	},
	solemn: {
		eyebrow: 'Stationen',
		title: 'Musik zur Beerdigung folgt dem tatsächlichen Ablauf.',
		lead: 'Ob Trauerhalle, Kirche oder Grab: Jede Station braucht eine andere musikalische Zurückhaltung.',
		cards: [
			{
				rom: 'Innen',
				title: 'Trauerhalle oder Kirche',
				poet: 'Hier kann Musik die Feier eröffnen, eine Ansprache nachklingen lassen oder den Auszug ruhig führen.',
				list: ['Eröffnungsstück', 'nach der Rede', 'Auszug'],
			},
			{
				rom: 'Draußen',
				title: 'Weg oder Grab',
				poet: 'Am Grab wirkt Musik oft kürzer, schlichter und unmittelbarer. Wetter, Weg und Akustik werden mitgedacht.',
				list: ['Gang zum Grab', 'letzter Blumengruß', 'stiller Abschluss'],
			},
		],
		listLabel: 'Typische Momente einer Beerdigung',
		list: ['Ankommen in der Trauerhalle', 'Musik nach der Ansprache', 'Auszug aus Kirche oder Halle', 'kurzer Moment am Grab'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Musik bei einer Beerdigung',
		items: [
			{
				question: 'Was ist der Unterschied zu Musik für eine Trauerfeier?',
				answer: 'Die Trauerfeier meint meist die Zeremonie. Bei Musik zur Beerdigung denke ich zusätzlich an Auszug, Weg zum Grab und praktische Abläufe vor Ort.',
				open: true,
			},
			{
				question: 'Kannst du auch am Grab spielen?',
				answer: 'Ja, wenn die Bedingungen es zulassen. Wir klären vorher Ort, Wetter, Dauer und ob ein sehr kurzer musikalischer Moment sinnvoll ist.',
			},
			{
				question: 'Stimmst du dich mit dem Bestattungshaus ab?',
				answer: 'Ja. Ich kann direkt mit dem Bestattungshaus klären, wann ich da bin, wo ich spiele und welche Einsätze vorgesehen sind.',
			},
			{
				question: 'Wie kurzfristig ist Musik zur Beerdigung möglich?',
				answer: 'Oft auch kurzfristig. Schreib mir Datum, Ort und ungefähre Uhrzeit, dann prüfe ich schnell, ob ich den Termin möglich machen kann.',
			},
		],
	},
	contact: {
		eyebrow: 'Beerdigung anfragen',
		title: 'Soll die Beerdigung mit Viola begleitet werden?',
		lead: 'Sende Datum, Ort und ob Musik nur in der Trauerhalle oder auch am Grab gewünscht ist. Ich antworte mit einer ruhigen, realistischen Einschätzung.',
		checklist: ['Trauerhalle', 'Kirche', 'Grab'],
		formEyebrow: 'Termin prüfen',
		formTitle: 'Musik zur Beerdigung anfragen',
		formSuccess: 'Danke - ich prüfe den Termin und melde mich mit einem Vorschlag für die Beerdigung.',
	},
	imageAltBase: 'Solo-Viola für Musik bei einer Beerdigung',
});

update('beerdigungen', 'musik-abschied', {
	targetKeyword: 'Musik Abschied',
	seoTitle: 'Musik Abschied | Persönliche Viola für stille Momente',
	seoDescription: 'Musik für einen Abschied: Solo-Viola für persönliche Erinnerungen, freie Abschiedsfeiern, stille Rituale und kleine Trauermomente.',
	hero: {
		eyebrow: 'Abschied',
		title: 'Musik für einen Abschied, der persönlich bleiben darf.',
		lead: 'Nicht jeder Abschied folgt einer klassischen Beerdigung. Manchmal geht es um eine freie Feier, einen kleinen Kreis, ein Lieblingslied oder einen Moment, der sehr persönlich gehalten werden soll.',
		badge: 'Für persönliche Erinnerungsmomente',
	},
	elegy: {
		quote: 'Abschiedsmusik darf leise sein und trotzdem einen Raum verändern.',
		passages: [
			{
				strong: 'Breiter Suchintent',
				text: 'Musik Abschied ist bewusst offener als Musik Trauerfeier oder Musik Beerdigung. Die Suche kann eine freie Abschiedsfeier, ein Ritual, eine private Erinnerung oder einen stillen Moment meinen.',
			},
			{
				strong: 'Persönliche Ebene',
				text: 'Hier zählt oft weniger die klassische Form als die Verbindung zu einem Menschen. Ein Lieblingslied, eine ruhige Melodie oder ein einzelner Klang kann eine Erinnerung klarer tragen als viele Worte.',
			},
			{
				strong: 'Flexible Form',
				text: 'Die Musik kann in einer Trauerhalle, Kirche, einem kleinen Raum oder bei einer freien Feier stattfinden. Wichtig ist, dass der Rahmen behutsam und nicht schematisch geplant wird.',
			},
		],
	},
	solemn: {
		eyebrow: 'Formen',
		title: 'Abschiedsmusik muss nicht immer einem festen Ablauf folgen.',
		lead: 'Diese Seite ist für persönliche Abschiedsformen gedacht, die etwas freier geplant werden.',
		cards: [
			{
				rom: 'Frei',
				title: 'Persönliche Feier',
				poet: 'Wenn der Ablauf nicht kirchlich oder klassisch ist, kann Musik verbindend wirken, ohne eine feste Liturgie zu brauchen.',
				list: ['freie Rede', 'Foto-Moment', 'Lieblingslied'],
			},
			{
				rom: 'Still',
				title: 'Kleiner Kreis',
				poet: 'In kleinen Gruppen braucht Musik besonders viel Zurückhaltung. Die Viola kann nah klingen, ohne den Raum zu füllen.',
				list: ['Familienkreis', 'private Erinnerung', 'leiser Abschluss'],
			},
		],
		listLabel: 'Mögliche Abschiedsmomente',
		list: ['Lieblingslied als Viola-Fassung', 'Musik nach persönlichen Worten', 'Kerzen- oder Blumenritual', 'stiller Abschluss im kleinen Kreis'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik für einen Abschied',
		items: [
			{
				question: 'Ist diese Seite auch für freie Abschiedsfeiern gedacht?',
				answer: 'Ja. Gerade wenn der Ablauf frei gestaltet ist, kann Musik helfen, Übergänge und stille Momente würdevoll zu halten.',
				open: true,
			},
			{
				question: 'Kann ein sehr persönliches Lied gespielt werden?',
				answer: 'Oft ja. Ich prüfe, ob sich das Lied auf Solo-Viola übertragen lässt und welcher Ausschnitt für den Abschied passend ist.',
			},
			{
				question: 'Geht Abschiedsmusik auch in kleiner Runde?',
				answer: 'Ja. Dann plane ich die Musik besonders reduziert, damit sie nicht zu groß für den Raum wirkt.',
			},
			{
				question: 'Worin unterscheidet sich Musik Abschied von Musik letzter Abschied?',
				answer: 'Musik Abschied ist breiter und persönlicher gedacht. Musik letzter Abschied meint stärker den finalen Moment am Ende der Feier oder am Grab.',
			},
		],
	},
	contact: {
		eyebrow: 'Persönlichen Abschied planen',
		title: 'Soll ein persönlicher Abschied Musik bekommen?',
		lead: 'Erzähl mir kurz, welche Form des Abschieds geplant ist und ob es ein Lied oder eine Erinnerung gibt, die wichtig ist.',
		checklist: ['freie Feier', 'Lieblingslied', 'kleiner Kreis'],
		formEyebrow: 'Rahmen schildern',
		formTitle: 'Musik für den Abschied anfragen',
		formSuccess: 'Danke - ich melde mich mit einer behutsamen Idee für euren Abschied.',
	},
	imageAltBase: 'Persönliche Abschiedsmusik mit Solo-Viola',
});

update('beerdigungen', 'musik-letzter-abschied', {
	targetKeyword: 'Musik letzter Abschied',
	seoTitle: 'Musik letzter Abschied | Viola für den stillen Abschluss',
	seoDescription: 'Musik für den letzten Abschied: Solo-Viola für Auszug, Gang zum Grab, Blumengruß oder den stillen Abschluss einer Trauerfeier.',
	hero: {
		eyebrow: 'Letzter Abschied',
		title: 'Musik für den letzten Abschied, wenn der Moment nicht länger erklärbar ist.',
		lead: 'Der letzte Abschied ist oft der kürzeste und schwerste Moment: der Auszug, der Gang zum Grab, der Blumengruß oder die letzte Stille. Musik darf hier nicht erklären, sondern halten.',
		badge: 'Für den finalen Moment',
	},
	elegy: {
		quote: 'Am Ende einer Abschiedsfeier muss Musik besonders schlicht bleiben.',
		passages: [
			{
				strong: 'Enger Moment',
				text: 'Diese Seite ist enger gemeint als Musik Abschied. Es geht um den letzten Abschnitt: wenn die Feier endet, Menschen aufstehen, der Sarg hinausgetragen wird oder am Grab der letzte Gruß stattfindet.',
			},
			{
				strong: 'Weniger ist mehr',
				text: 'Für den letzten Abschied sind kurze, klare Melodien oft stärker als lange Stücke. Der Klang soll den Moment nicht vergrößern, sondern ihn würdevoll abschließen.',
			},
			{
				strong: 'Sichere Zeichen',
				text: 'Gerade am Ende ist Timing wichtig. Ich stimme vorher ab, wann die Musik beginnt, wann sie enden soll und wie flexibel sie auf Wege, Stille oder Blumengruß reagieren muss.',
			},
		],
	},
	solemn: {
		eyebrow: 'Abschluss',
		title: 'Der letzte Abschied braucht klare, kurze Musikmomente.',
		lead: 'Hier steht nicht die gesamte Feier im Mittelpunkt, sondern der Moment, in dem Menschen endgültig loslassen.',
		cards: [
			{
				rom: 'Auszug',
				title: 'Wenn der Raum sich bewegt',
				poet: 'Beim Auszug kann Musik den Übergang halten, ohne die Schwere künstlich zu steigern.',
				list: ['Auszug aus der Halle', 'Gang aus der Kirche', 'stiller Weg'],
			},
			{
				rom: 'Grab',
				title: 'Wenn alles still wird',
				poet: 'Am Grab wirkt ein kurzer musikalischer Satz oft stärker als ein ganzes Stück.',
				list: ['Blumengruß', 'letzte Geste', 'kurzer Abschluss'],
			},
		],
		listLabel: 'Geeignete Schlussmomente',
		list: ['Auszug aus der Trauerhalle', 'Weg zum Grab', 'Blumengruß', 'letzte stille Minute'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zur Musik für den letzten Abschied',
		items: [
			{
				question: 'Kann Musik direkt am Grab gespielt werden?',
				answer: 'Ja, wenn Ort, Wetter und Ablauf es zulassen. Oft ist dort ein kurzer, sehr reduzierter Einsatz am passendsten.',
				open: true,
			},
			{
				question: 'Wie lang sollte Musik für den letzten Abschied sein?',
				answer: 'Meist reichen wenige Minuten oder sogar ein kurzer Ausschnitt. Der Moment soll nicht verlängert, sondern gehalten werden.',
			},
			{
				question: 'Was passt besser: klassisch oder modern?',
				answer: 'Beides kann passen. Wichtig ist, dass die Melodie schlicht bleibt und nicht wie ein großer Konzertmoment wirkt.',
			},
			{
				question: 'Worin unterscheidet sich das von Musik Beerdigung?',
				answer: 'Musik Beerdigung umfasst den ganzen Ablauf. Diese Seite konzentriert sich auf den finalen Abschied am Ende der Feier oder am Grab.',
			},
		],
	},
	contact: {
		eyebrow: 'Letzten Moment abstimmen',
		title: 'Soll der letzte Abschied musikalisch getragen werden?',
		lead: 'Schreib mir, ob es um Auszug, Gang zum Grab oder einen Blumengruß geht. Ich schlage dir eine kurze, passende musikalische Form vor.',
		checklist: ['Auszug', 'Grab', 'Blumengruß'],
		formEyebrow: 'Moment beschreiben',
		formTitle: 'Musik letzter Abschied anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag für den letzten Abschied.',
	},
	imageAltBase: 'Solo-Viola für den letzten Abschied',
});

update('beerdigungen', 'live-musik-trauerfeier', {
	targetKeyword: 'Live Musik Trauerfeier',
	seoTitle: 'Live Musik Trauerfeier | Viola statt Aufnahme',
	seoDescription: 'Live-Musik zur Trauerfeier mit Solo-Viola: flexibel, leise und direkt auf Worte, Pausen, Raum und Ablauf abgestimmt.',
	hero: {
		eyebrow: 'Live-Musik',
		title: 'Live-Musik zur Trauerfeier, die auf den Raum reagiert.',
		lead: 'Eine Aufnahme läuft ab. Live-Musik hört zu: auf die Länge einer Rede, auf einen stillen Moment, auf Schritte im Raum. Genau darin liegt der Unterschied bei einer Trauerfeier.',
		badge: 'Live gespielt, behutsam geführt',
	},
	elegy: {
		quote: 'Live-Musik kann warten, atmen und im richtigen Moment enden.',
		passages: [
			{
				strong: 'Warum live?',
				text: 'Wer Live-Musik für eine Trauerfeier sucht, möchte meist keine anonyme Hintergrundmusik. Die Musik soll präsent sein, aber nicht auftreten: sie soll auf den Raum reagieren.',
			},
			{
				strong: 'Flexibilität',
				text: 'Wenn eine Rede länger dauert, wenn Angehörige noch einen Moment brauchen oder wenn der Auszug langsamer beginnt, kann live gespielte Viola den Ablauf weich aufnehmen.',
			},
			{
				strong: 'Klangfarbe',
				text: 'Die Viola liegt nah an der menschlichen Stimme. Dadurch wirkt sie live besonders direkt, warm und persönlich, ohne technische Anlage im Mittelpunkt.',
			},
		],
	},
	solemn: {
		eyebrow: 'Live-Wirkung',
		title: 'Live-Musik verändert die Trauerfeier anders als eine Playlist.',
		lead: 'Der Mehrwert liegt nicht in Lautstärke, sondern in Reaktion und Timing.',
		cards: [
			{
				rom: 'Timing',
				title: 'Im richtigen Augenblick',
				poet: 'Die Musik kann später beginnen, früher enden oder eine Pause halten, wenn der Moment es verlangt.',
				list: ['nach Worten', 'vor dem Auszug', 'bei stiller Unruhe'],
			},
			{
				rom: 'Nähe',
				title: 'Ohne technische Distanz',
				poet: 'Ein akustisches Instrument wirkt unmittelbar und braucht oft weniger Erklärung als eine Tonaufnahme.',
				list: ['Solo-Viola', 'ruhiger Klang', 'direkte Präsenz'],
			},
		],
		listLabel: 'Live-Musik eignet sich besonders für',
		list: ['Beginn der Feier', 'Übergänge nach Reden', 'Wunschlied als Solo-Version', 'Auszug aus der Trauerhalle'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Live-Musik bei der Trauerfeier',
		items: [
			{
				question: 'Warum Live-Musik statt Musik vom Band?',
				answer: 'Live-Musik kann auf Pausen, Wege und Emotionen reagieren. Sie endet nicht mechanisch, sondern passend zum Moment.',
				open: true,
			},
			{
				question: 'Braucht Solo-Viola Technik?',
				answer: 'In vielen Trauerhallen, Kirchen und kleinen Räumen nicht. Bei größeren Räumen oder draußen klären wir vorher, ob Verstärkung sinnvoll ist.',
			},
			{
				question: 'Kannst du ein Stück verlängern oder kürzen?',
				answer: 'Ja. Genau das ist ein Vorteil von Live-Musik: Ich kann musikalisch reagieren, ohne dass es abrupt wirkt.',
			},
			{
				question: 'Ist Live-Musik zu auffällig für eine Trauerfeier?',
				answer: 'Nein, wenn sie passend geplant ist. Die Viola kann sehr zurückhaltend spielen und bleibt dadurch Teil der Feier, nicht Mittelpunkt.',
			},
		],
	},
	contact: {
		eyebrow: 'Live-Musik planen',
		title: 'Soll die Trauerfeier live begleitet werden?',
		lead: 'Sende mir Ablauf, Ort und Wunschmomente. Ich prüfe, wie Live-Viola den Raum tragen kann, ohne zu viel zu werden.',
		checklist: ['Live-Viola', 'Trauerhalle', 'Wunschlied'],
		formEyebrow: 'Live-Anfrage',
		formTitle: 'Live Musik Trauerfeier anfragen',
		formSuccess: 'Danke - ich melde mich mit einer Idee für live gespielte Musik zur Trauerfeier.',
	},
	imageAltBase: 'Live gespielte Viola bei einer Trauerfeier',
});

update('beerdigungen', 'live-musik-beerdigung', {
	targetKeyword: 'Live Musik Beerdigung',
	seoTitle: 'Live Musik Beerdigung | Viola vor Ort für Abschied & Grab',
	seoDescription: 'Live-Musik zur Beerdigung: Solo-Viola vor Ort für Trauerhalle, Kirche, Auszug oder Grab. Verlässlich abgestimmt und ruhig gespielt.',
	hero: {
		eyebrow: 'Live-Musik zur Beerdigung',
		title: 'Live-Musik zur Beerdigung, verlässlich vor Ort und behutsam gespielt.',
		lead: 'Bei einer Beerdigung muss Live-Musik nicht nur schön klingen, sondern zuverlässig funktionieren: rechtzeitig vor Ort, passend platziert, klar abgestimmt und sensibel für den Ablauf.',
		badge: 'Vor Ort gespielt',
	},
	elegy: {
		quote: 'Live-Musik zur Beerdigung braucht musikalische Ruhe und organisatorische Sicherheit.',
		passages: [
			{
				strong: 'Konkreter Anlass',
				text: 'Diese Seite ist praktischer gedacht als Live Musik Trauerfeier. Es geht um den gesamten Beerdigungstermin mit Ort, Uhrzeit, Bestattungshaus, möglichen Wegen und manchmal Musik am Grab.',
			},
			{
				strong: 'Vor Ort',
				text: 'Ich bin rechtzeitig da, stimme mich mit den Verantwortlichen ab und spiele dort, wo der Klang würdevoll und der Ablauf sicher bleibt.',
			},
			{
				strong: 'Flexibel und schlicht',
				text: 'Live-Viola kann ein Stück kürzen, einen Auszug länger begleiten oder am Grab sehr reduziert bleiben. So passt die Musik zum tatsächlichen Geschehen.',
			},
		],
	},
	solemn: {
		eyebrow: 'Organisation',
		title: 'Live-Musik zur Beerdigung wird praktisch mitgedacht.',
		lead: 'Die musikalische Wirkung hängt stark davon ab, wo und wann gespielt wird.',
		cards: [
			{
				rom: 'Absprache',
				title: 'Mit dem Bestattungshaus',
				poet: 'Ankunft, Platz, Einsätze und besondere Wege können direkt mit dem Bestattungshaus oder der Trauerleitung geklärt werden.',
				list: ['Termin', 'Ort', 'Ablaufzeichen'],
			},
			{
				rom: 'Ort',
				title: 'Halle, Kirche oder Grab',
				poet: 'Live-Musik muss zur Akustik passen. Drinnen ist anderes möglich als draußen am Grab oder auf dem Weg.',
				list: ['akustisch', 'gegebenenfalls verstärkt', 'wetterabhängig'],
			},
		],
		listLabel: 'Wichtige Angaben für die Anfrage',
		list: ['Datum und Uhrzeit', 'Trauerhalle, Kirche oder Friedhof', 'gewünschte Musikmomente', 'Kontakt zum Bestattungshaus'],
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Live-Musik bei einer Beerdigung',
		items: [
			{
				question: 'Kann Live-Musik kurzfristig für eine Beerdigung angefragt werden?',
				answer: 'Ja, oft ist das möglich. Sende mir Datum, Ort und Uhrzeit, dann prüfe ich die Verfügbarkeit schnell.',
				open: true,
			},
			{
				question: 'Spielst du auch draußen am Grab?',
				answer: 'Grundsätzlich ja. Wir klären vorher Wetter, Dauer, Akustik und ob ein kurzer Einsatz vor Ort sinnvoll ist.',
			},
			{
				question: 'Wer stimmt die Einsätze am Tag selbst ab?',
				answer: 'Das kann ich direkt mit Bestattungshaus, Pfarrerin, Redner oder Trauerleitung klären, damit Angehörige entlastet sind.',
			},
			{
				question: 'Was unterscheidet diese Seite von Live Musik Trauerfeier?',
				answer: 'Live Musik Trauerfeier fokussiert die Zeremonie. Live Musik Beerdigung denkt zusätzlich Ort, Wege, Grab und die praktische Organisation des Beerdigungstags mit.',
			},
		],
	},
	contact: {
		eyebrow: 'Termin prüfen',
		title: 'Soll die Beerdigung live mit Viola begleitet werden?',
		lead: 'Schreib mir Datum, Ort und ob Musik in der Halle, Kirche oder am Grab gewünscht ist. Ich melde mich mit einer klaren Einschätzung.',
		checklist: ['Termin', 'Friedhof', 'Bestattungshaus'],
		formEyebrow: 'Verfügbarkeit',
		formTitle: 'Live Musik Beerdigung anfragen',
		formSuccess: 'Danke - ich prüfe den Termin und melde mich zur Live-Musik für die Beerdigung.',
	},
	imageAltBase: 'Live-Musik mit Solo-Viola bei einer Beerdigung',
});

console.log('Rewrote 6 funeral SEO topic pages in batch 2.');
