import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TRACKER_FILE = path.resolve('seo/local-page-tracker.csv');
const CONTENT_DIR = path.resolve('src/content/seo-pages');
const STATUS = 'risk-pass-2026-06-16-review-needed';
const BATCH_NOTE = 'Risk Pass 2026-06-16: High- und Medium-Risk-Seiten aus dem Local-SEO-Tracker mit sichtbaren eigenen Textmodulen, FAQ und Kontaktcopy weiter differenziert.';

const LOCAL_SLUGS = new Set([
	'duesseldorf', 'erkrath', 'ratingen', 'koeln', 'essen', 'dortmund', 'duisburg', 'bochum',
	'wuppertal', 'leverkusen', 'oberhausen', 'krefeld', 'moenchengladbach', 'moers',
	'gelsenkirchen', 'bergisch-gladbach', 'solingen', 'remscheid', 'mettmann', 'hilden',
	'dormagen', 'neuss', 'meerbusch', 'haan', 'langenfeld', 'monheim-am-rhein', 'velbert',
	'wuelfrath', 'heiligenhaus', 'muelheim-an-der-ruhr', 'bottrop', 'herne', 'hagen',
	'aachen', 'bonn', 'muenster', 'bielefeld', 'paderborn', 'siegen', 'iserlohn', 'unna',
	'recklinghausen', 'rhein-kreis-neuss', 'kreis-mettmann', 'rheinland', 'ruhrgebiet',
	'rhein-ruhr', 'bergisches-land', 'nordrhein-westfalen',
]);

const LOCATION_LABELS = {
	aachen: 'Aachen',
	'bergisches-land': 'Bergisches Land',
	'bergisch-gladbach': 'Bergisch Gladbach',
	bielefeld: 'Bielefeld',
	bochum: 'Bochum',
	bonn: 'Bonn',
	bottrop: 'Bottrop',
	dormagen: 'Dormagen',
	dortmund: 'Dortmund',
	duesseldorf: 'Düsseldorf',
	duisburg: 'Duisburg',
	erkrath: 'Erkrath',
	essen: 'Essen',
	gelsenkirchen: 'Gelsenkirchen',
	haan: 'Haan',
	hagen: 'Hagen',
	heiligenhaus: 'Heiligenhaus',
	herne: 'Herne',
	hilden: 'Hilden',
	iserlohn: 'Iserlohn',
	koeln: 'Köln',
	krefeld: 'Krefeld',
	'kreis-mettmann': 'Kreis Mettmann',
	langenfeld: 'Langenfeld',
	leverkusen: 'Leverkusen',
	meerbusch: 'Meerbusch',
	mettmann: 'Mettmann',
	moenchengladbach: 'Mönchengladbach',
	moers: 'Moers',
	'monheim-am-rhein': 'Monheim am Rhein',
	'muelheim-an-der-ruhr': 'Mülheim an der Ruhr',
	muenster: 'Münster',
	neuss: 'Neuss',
	'nordrhein-westfalen': 'Nordrhein-Westfalen',
	oberhausen: 'Oberhausen',
	paderborn: 'Paderborn',
	ratingen: 'Ratingen',
	recklinghausen: 'Recklinghausen',
	remscheid: 'Remscheid',
	'rhein-kreis-neuss': 'Rhein-Kreis Neuss',
	rheinland: 'Rheinland',
	'rhein-ruhr': 'Rhein-Ruhr',
	ruhrgebiet: 'Ruhrgebiet',
	siegen: 'Siegen',
	solingen: 'Solingen',
	unna: 'Unna',
	velbert: 'Velbert',
	wuelfrath: 'Wülfrath',
	wuppertal: 'Wuppertal',
};

const LOCAL_TEXTURES = {
	aachen: ['historische Räume', 'Innenstadtwege', 'Anreise aus dem Dreiländereck', 'ruhige Zeitpuffer'],
	'bergisches-land': ['Höhenlagen', 'Kapellen und Höfe', 'Wetterwechsel', 'geschützte Außenplätze'],
	'bergisch-gladbach': ['Bensberg und Refrath', 'Köln-Nähe', 'bergische Ränder', 'kurze Ortswechsel'],
	bielefeld: ['weitere Anreise', 'Teutoburger-Wald-Nähe', 'klare Zeitfenster', 'ruhige Vorbereitung'],
	bochum: ['urbane Trauerorte', 'direkte Familienrunden', 'Ruhrgebietswege', 'eindeutige Startsignale'],
	bonn: ['Rheinlage', 'Kirchenräume', 'Südstadt und Siebengebirge', 'Wechsel zwischen Orten'],
	bottrop: ['familiäre Abschiede', 'westliches Ruhrgebiet', 'kleine Räume', 'schlanke Planung'],
	dormagen: ['Rheinlage', 'Zons und Knechtsteden', 'Wege zwischen Köln und Düsseldorf', 'ruhige Übergänge'],
	dortmund: ['größere Anlagen', 'Hörde und Innenstadt', 'östliches Ruhrgebiet', 'klare Treffpunkte'],
	duesseldorf: ['Innenstadtverkehr', 'Rheinnähe', 'Benrath und Kaiserswerth', 'präzise Ladewege'],
	duisburg: ['Rhein und Innenhafen', 'linksrheinische Wege', 'größere Stadtteile', 'Parkmöglichkeiten'],
	erkrath: ['Neandertalnähe', 'Hochdahl', 'kurze Wege nach Düsseldorf', 'persönliche Räume'],
	essen: ['Baldeneysee-Nähe', 'Stadtwald und Rüttenscheid', 'große Stadtwege', 'ruhige Puffer'],
	gelsenkirchen: ['Buer und Ückendorf', 'familiäre Abschiede', 'Ruhrgebietsnähe', 'verlässliches Timing'],
	haan: ['Gartenstadt-Charakter', 'kleine Säle', 'Nähe zu Düsseldorf und Wuppertal', 'diskrete Vorbereitung'],
	hagen: ['Volme und Hohenlimburg', 'Sauerlandrand', 'Außenmomente', 'Wetteroptionen'],
	heiligenhaus: ['ruhige Wohnlagen', 'Nähe zu Ratingen und Velbert', 'kleine Kapellen', 'unkomplizierte Zugänge'],
	herne: ['Wanne und Eickel', 'zentrale Ruhrgebietslage', 'kurze Abschiede', 'punktgenaue Einsätze'],
	hilden: ['Nähe zu Düsseldorf, Solingen und Langenfeld', 'kurze Wege', 'Stadtpark-Umfeld', 'klare Ablaufnotizen'],
	iserlohn: ['Sauerlandnähe', 'Letmathe', 'Familienbezug', 'weitere Wege'],
	koeln: ['Veedel und Rheinlage', 'Melaten und Kirchen', 'dichte Stadtwege', 'genaue Parkabsprachen'],
	krefeld: ['Stadtwald und Uerdingen', 'Niederrhein', 'ruhige Friedhöfe', 'präzise Raumgröße'],
	'kreis-mettmann': ['mehrere Städte', 'Erkrath, Hilden, Ratingen und Velbert', 'regionale Anfahrt', 'Stadtgrenzen'],
	langenfeld: ['Wege zwischen Düsseldorf und Leverkusen', 'kompakte Abläufe', 'Familienkreise', 'klare Schlussmomente'],
	leverkusen: ['Opladen und Schlebusch', 'Rheinlage', 'Köln-Nähe', 'konkrete Stadtteilwege'],
	meerbusch: ['Büderich und Osterath', 'Rheinwiesen', 'private Abschiede', 'dezente Klangnähe'],
	mettmann: ['Neandertalnähe', 'Altstadt und kleine Hallen', 'Kreis-Mettmann-Wege', 'diskrete Wunschmusik'],
	moenchengladbach: ['Rheydt und Wickrath', 'linker Niederrhein', 'mehrere Generationen', 'größere Stadtwege'],
	moers: ['Niederrhein', 'Schlossnähe', 'Außenmomente', 'stabiler Platz für das Instrument'],
	'monheim-am-rhein': ['Rheinpromenade', 'Baumberg', 'Wetter am Wasser', 'ruhige Nachmittage'],
	'muelheim-an-der-ruhr': ['Ruhrtal und Saarn', 'grüne Stadtnähe', 'Wege am Wasser', 'Parken und Aufbauplatz'],
	muenster: ['Altstadt und Aasee', 'helle Kirchenräume', 'weitere Anreise', 'kultivierte Ruhe'],
	neuss: ['Rheinlage', 'Quirinus-Nähe', 'Düsseldorf-Nähe', 'genauer Treffpunkt'],
	'nordrhein-westfalen': ['Rheinland, Ruhrgebiet und Bergisches Land', 'größere Anfahrtsplanung', 'unterschiedliche Raumtypen', 'regionale Abstimmung'],
	oberhausen: ['Sterkrade und Alt-Oberhausen', 'westliches Ruhrgebiet', 'ruhiger Beginn', 'große Wege'],
	paderborn: ['Ostwestfalen', 'Schloss-Neuhaus-Nähe', 'längere Anfahrt', 'sinnvolle Einsatzdauer'],
	ratingen: ['Lintorf und Hösel', 'Nähe zu Düsseldorf', 'grünere Trauerorte', 'klare Wunschmomente'],
	recklinghausen: ['Rand des Ruhrgebiets', 'Altstadt und Hochlar', 'gesprächiger Nachklang', 'Parken und Raumzugang'],
	remscheid: ['bergische Höhen', 'Lennep', 'Treppen und Wetter', 'robuste Platzwahl'],
	'rhein-kreis-neuss': ['Neuss, Meerbusch und Dormagen', 'Rheinorte', 'Angehörige aus mehreren Städten', 'flexible Fahrzeit'],
	rheinland: ['Rheinstädte', 'offene Abschiedsformen', 'persönlicher Nachklang', 'individuelle Fahrzeit'],
	'rhein-ruhr': ['dichte Stadtwege', 'Düsseldorf, Köln, Essen und Dortmund', 'realistische Puffer', 'mehrere Richtungen'],
	ruhrgebiet: ['direkte Familienkultur', 'viele Städte nah beieinander', 'lebendige Räume', 'klare Lautstärke'],
	siegen: ['Siegerland', 'grüne Orte', 'weitere Anfahrt', 'bewusstes Zeitfenster'],
	solingen: ['Gräfrath und Ohligs', 'bergische Wege', 'handgemachte Abschiede', 'Wetter und Zugang'],
	unna: ['Hellweg und Ruhrgebietsnähe', 'Angehörige aus mehreren Richtungen', 'Nachmittagsabschiede', 'ruhiger Aufbau'],
	velbert: ['Neviges und Langenberg', 'Steigungen und Wege', 'Bergisches Land und Ruhrgebiet', 'flexible Räume'],
	wuelfrath: ['kleine Stadtwege', 'bergische Nähe', 'intime Räume', 'überschaubare Kreise'],
	wuppertal: ['Elberfeld und Barmen', 'Höhenlagen', 'Treppen und Hangwege', 'Wetteroptionen'],
};

const FUNERAL_TOPIC_DETAILS = {
	'amazing-grace-beerdigung': ['Amazing Grace', 'Hoffnungslied', 'bekannte Melodie, behutsam gekürzt', 'Kirche, Trauerhalle oder Auszug', 'Wiedererkennung ohne Pathos'],
	'ave-maria-beerdigung': ['Ave Maria', 'klassischer Abschied', 'ruhige Fassung und passende Tonart', 'Kirche, Kapelle oder stiller Mittelteil', 'würdevoll, aber nicht schwerer als nötig'],
	'bratsche-beerdigung': ['Bratsche zur Beerdigung', 'Klangfarbe', 'warmer Mittelregister-Klang', 'Trauerhalle, Kirche oder Grab', 'nah an der menschlichen Stimme'],
	'geige-beerdigung': ['Geige zur Beerdigung', 'Suchbegriff Geige', 'transparent als warme Solo-Viola eingeordnet', 'Trauerfeier oder Beisetzung', 'Streichklang statt falsches Instrumentenversprechen'],
	'instrumentalmusik-trauerfeier': ['Instrumentalmusik Trauerfeier', 'ohne Gesang', 'Melodie ohne konkurrierenden Text', 'Rede, Ritual oder Auszug', 'Raum für eigene Gedanken'],
	'klassische-musik-beerdigung': ['Klassische Musik Beerdigung', 'Repertoire', 'Bach, Schubert, Massenet oder ruhige Bearbeitungen', 'Beginn, Meditation oder Auszug', 'Klassik als Halt, nicht als Konzert'],
	'live-musik-beerdigung': ['Live Musik Beerdigung', 'Live vor Ort', 'flexible Länge und echtes Reagieren', 'Trauerhalle plus Weg oder Grabmoment', 'weniger starr als eine Aufnahme'],
	'live-musik-trauerfeier': ['Live Musik Trauerfeier', 'Zeremonie', 'Einsatz zwischen Worten und Stille', 'Trauerhalle, Kirche oder freie Feier', 'Ablauf atmen lassen'],
	'moderne-trauermusik': ['Moderne Trauermusik', 'persönliches Lied', 'Pop, Film oder Lieblingssong reduziert', 'freie Trauerfeier oder Trauerhalle', 'Wiedererkennung ohne Show'],
	'musik-abschied': ['Musik zum Abschied', 'weiter Abschiedsrahmen', 'freier Abschied, kleiner Kreis oder persönliches Ritual', 'privater Raum, Kapelle oder Trauerhalle', 'nicht automatisch Beerdigungsablauf'],
	'musik-am-grab': ['Musik am Grab', 'Außenmoment', 'kurz, wetterfest und konzentriert', 'Grabstelle, Urnengrab oder letzter Weg', 'ein letzter Ton statt langer Vortrag'],
	'musik-beerdigung': ['Musik Beerdigung', 'gesamter Ablauf', 'innen, draußen oder beides', 'Trauerhalle, Auszug und Beisetzung', 'praktische Verbindung der Stationen'],
	'musik-bestattung': ['Musik Bestattung', 'formale Planung', 'verlässliche Abstimmung mit Bestattungshaus', 'Bestattungshaus, Kirche oder Friedhof', 'sicherer Ablauf und ruhiger Ton'],
	'musik-letzter-abschied': ['Musik letzter Abschied', 'Schlussmoment', 'Blumengruß, Auszug oder letzte Minute', 'Ende der Feier oder Grab', 'den Abschluss halten'],
	'musik-trauerfeier': ['Musik Trauerfeier', 'Zeremonie im Raum', 'Beginn, Rede, Ritual und Auszug', 'Trauerhalle, Kirche oder Kapelle', 'Worte tragen, nicht ersetzen'],
	'musikerin-trauerfeier': ['Musikerin Trauerfeier', 'Person und Abstimmung', 'direkter Kontakt und ruhige Vorbereitung', 'Trauerhalle, Kirche oder freie Feier', 'eine Musikerin vor Ort statt anonymer Vermittlung'],
	'trauermusik-buchen': ['Trauermusik buchen', 'konkrete Anfrage', 'Datum, Ort, Ablauf und Wunschstücke', 'Trauerfeier oder Beerdigung', 'Verfügbarkeit und Machbarkeit klären'],
	'trauermusik-repertoire': ['Trauermusik Repertoire', 'Auswahlhilfe', 'klassisch, modern und persönliche Stücke vergleichen', 'Beginn, Mitte, Auszug oder Grab', 'Stücke nach Aufgabe sortieren'],
	trauermusikerin: ['Trauermusikerin', 'Rolle der Musikerin', 'ruhige Präsenz und klare Verantwortung', 'Trauerhalle, Kirche, Friedhof oder freie Feier', 'Haltung, Klang und Verlässlichkeit'],
	'viola-beerdigung': ['Viola Beerdigung', 'Instrument Viola', 'dunkler, warmer Streichklang', 'Trauerfeier, Kirche oder Grab', 'bewusst andere Farbe als Geige'],
};

const WEDDING_TOPIC_DETAILS = {
	'bratschistin-hochzeit': ['Bratschistin Hochzeit', 'Instrument und Person', 'warmer Soloklang statt Ensemble', 'Trauung, Empfang oder Dinner', 'direkter Kontakt zur Musikerin'],
	'geigerin-hochzeit': ['Geigerin Hochzeit', 'Suchbegriff Geige', 'transparent als Viola mit warmem Streichklang', 'Einzug, Auszug oder Empfang', 'Klangwunsch statt Etikett'],
	'hintergrundmusik-hochzeit': ['Hintergrundmusik Hochzeit', 'dezente Begleitung', 'Gespräche nicht überdecken', 'Empfang, Dinner oder Foyer', 'Atmosphäre ohne Konzertgefühl'],
	'musik-auszug': ['Musik Auszug Hochzeit', 'Jubel nach der Trauung', 'heller, beweglicher Schluss', 'Kirche, Standesamt oder Garten', 'Freude und Weglänge verbinden'],
	'musikerin-hochzeit': ['Musikerin Hochzeit', 'Person und Planung', 'eine Ansprechpartnerin für Stücke und Ablauf', 'Trauung, Standesamt, Empfang', 'persönliche Abstimmung'],
	'musik-freie-trauung': ['Musik freie Trauung', 'freie Zeremonie', 'Rituale, Texte und persönliche Übergänge', 'Garten, Hof, Schloss oder Terrasse', 'flexibel mit Trauredner:in abgestimmt'],
	'musik-hochzeitsempfang': ['Musik Hochzeitsempfang', 'Ankommen und Gratulationen', 'bewegliche Sets statt starrem Programm', 'Foyer, Garten, Terrasse oder Innenhof', 'Rahmen für Gespräche'],
	'musik-kirchliche-trauung': ['Musik kirchliche Trauung', 'Kirchenraum', 'Liturgie, Hall und feste Punkte', 'Kirche oder Kapelle', 'Respekt vor Ablauf und Akustik'],
	'musik-waehrend-trauung': ['Musik während Trauung', 'Zwischenmomente', 'Lesung, Ritual, Kerze oder Ringsegnung', 'freie Trauung, Kirche oder Standesamt', 'nicht jede Pause füllen'],
	'musik-zur-trauung': ['Musik zur Trauung', 'ganzer Zeremoniebogen', 'Einzug, Ringe, Ja-Wort und Auszug verbinden', 'Standesamt, Kirche oder freie Trauung', 'roter Faden statt Einzellieder'],
};

const BIRTHDAY_TOPIC_DETAILS = {
	'hintergrundmusik-geburtstag': ['Hintergrundmusik Geburtstag', 'ruhige Atmosphäre', 'Gespräche, Essen und Gratulationen begleiten', 'Wohnzimmer, Restaurant oder Garten', 'festlich ohne Lautstärke'],
	'streichmusik-geburtstag': ['Streichmusik Geburtstag', 'Streichklang', 'warme Viola statt großer Band', 'Empfang, Dinner oder Überraschung', 'persönlicher Rahmen'],
};

const TEACHING_TOPIC_DETAILS = {
	bratschenunterricht: ['Bratschenunterricht', 'Grundlagen und Aufbau', 'Haltung, Bogen, Klang und Übeplan', 'Kinder, Erwachsene und Wiedereinsteiger:innen', 'ruhige Probestunde'],
	'bratschenunterricht-erwachsene': ['Bratschenunterricht Erwachsene', 'Erwachsene Lernende', 'Alltag, Körpergefühl und musikalische Ziele verbinden', 'Wiedereinstieg oder erster Anfang', 'ohne Druck, aber mit Struktur'],
};

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

function hash(value) {
	return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0);
}

function pick(key, values, offset = 0) {
	return values[(hash(key) + offset) % values.length];
}

function titleFromSlug(slug) {
	return LOCATION_LABELS[slug] ?? slug
		.split('-')
		.map((part) => {
			const mapped = {
				duesseldorf: 'Düsseldorf',
				koeln: 'Köln',
				muenster: 'Münster',
				moenchengladbach: 'Mönchengladbach',
				muelheim: 'Mülheim',
				waehrend: 'während',
				fuer: 'für',
				geburtstag: 'Geburtstag',
				hochzeit: 'Hochzeit',
				beerdigung: 'Beerdigung',
			}[part] ?? part;
			return mapped.charAt(0).toLocaleUpperCase('de-DE') + mapped.slice(1);
		})
		.join(' ');
}

function noteFor(doc) {
	const notes = String(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
}

function compactFaq(items, additions) {
	const merged = [...additions, ...(items ?? [])]
		.filter((item) => item?.question && item?.answer);
	const seen = new Set();
	return merged.filter((item) => {
		const key = item.question.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	}).slice(0, 8);
}

function imageAltBase(service, label) {
	if (service === 'beerdigungen') return `Live-Viola für Trauermusik: ${label}`;
	if (service === 'hochzeiten') return `Live-Viola für Hochzeitsmusik: ${label}`;
	if (service === 'geburtstage') return `Live-Viola für Geburtstagsmusik: ${label}`;
	if (service === 'unterricht') return `Viola- und Bratschenunterricht: ${label}`;
	return `Live-Viola: ${label}`;
}

function applyImageAlts(doc, label) {
	if (!Array.isArray(doc.imageAlts)) return doc.imageAlts;
	return doc.imageAlts.map((item, index) => ({
		...item,
		alt: `${imageAltBase(doc.serviceSlug, label)} - Bild ${index + 1}`,
	}));
}

function localFuneralPatch(doc) {
	const location = titleFromSlug(doc.pageSlug);
	const textures = LOCAL_TEXTURES[doc.pageSlug] ?? [location, 'Trauerort', 'Ablauf', 'Kontaktperson'];
	const angle = pick(doc.pageSlug, [
		'kurze Wege und klare Startzeichen',
		'Raumakustik, Ankunft und ein ruhiger Platz für das Instrument',
		'den Wechsel zwischen Trauerhalle, Kirche und Grab',
		'Wetteroptionen, Friedhofswege und den Moment des Auszugs',
	], 1);
	const repertoire = pick(doc.pageSlug, [
		'Ave Maria, Amazing Grace, Air oder ein persönliches Lieblingslied',
		'ein klassisches Stück, ein moderner Wunsch und ein schlichter Auszug',
		'eine ruhige Eröffnung, ein Erinnerungsstück und ein kurzer Schlussmoment',
		'Instrumentalmusik ohne Text, damit Worte und Stille nicht konkurrieren',
	], 2);
	return {
		hero: {
			...doc.hero,
			lead: `Trauermusik in ${location} plane ich nach Trauerort, Ablauf und den Menschen, die Abschied nehmen. Die Solo-Viola bleibt warm und zurückhaltend, kann aber genau den Moment tragen, der sonst leer bliebe.`,
		},
		elegy: {
			quote: `Trauermusik in ${location} soll nicht auffallen, sondern den Abschied halten.`,
			passages: [
				{
					strong: 'Lokaler Rahmen',
					text: `In ${location} achte ich besonders auf ${textures.slice(0, 3).join(', ')}. Daraus ergibt sich, ob ein einzelnes Stück reicht oder ob Beginn, Erinnerung und Auszug jeweils einen eigenen Klang brauchen.`,
				},
				{
					strong: 'Ablauf statt Liste',
					text: `Vor der Stückauswahl klären wir, welche Aufgabe Musik übernimmt: sammeln, nach einer Rede Raum lassen, einen Weg begleiten oder den letzten Moment am Grab ruhig schließen.`,
				},
				{
					strong: 'Klang der Viola',
					text: `Der dunklere Streichklang passt gut zu Trauerhallen, Kirchen und kleinen Kapellen. Er wirkt persönlicher als eine Aufnahme und bleibt beweglich, wenn sich Wege oder Reden verschieben.`,
				},
				{
					strong: 'Praktische Abstimmung',
					text: `Für ${location} notiere ich ${angle}. Eine Kontaktperson vor Ort, ein Startsignal und ein geschützter Platz machen den Ablauf für Angehörige spürbar leichter.`,
				},
				{
					strong: 'Repertoire',
					text: `Möglich sind ${repertoire}. Entscheidend ist nicht die längste Liste, sondern ein Stück, das zur Person, zum Raum und zur seelischen Belastung des Tages passt.`,
				},
			],
		},
		solemn: {
			eyebrow: `Trauerfeier in ${location}`,
			title: `Was ich für Trauermusik in ${location} vorab kläre.`,
			lead: `Je genauer Raum, Weg und Einsatzpunkt beschrieben sind, desto ruhiger kann Musik am Tag selbst wirken.`,
			cards: [
				{
					rom: 'Vorab',
					title: 'Ablauf und Kontaktperson sortieren',
					poet: `Ich kläre mit euch oder dem Bestattungshaus, wo die Viola steht, wann der erste Ton beginnt und wie der Übergang zu ${textures[0]} ruhig bleibt.`,
					list: ['Datum und Uhrzeit', 'Trauerort', 'Startsignal'],
				},
				{
					rom: 'Am Tag',
					title: 'Wenig Aufbau, klare Präsenz',
					poet: `Die Musik bleibt bewusst schlank: stimmen, ankommen, warten können und erst dann spielen, wenn der Moment in ${location} wirklich bereit ist.`,
					list: ['ruhiger Platz', 'Wunschstück', 'Auszug oder Grab'],
				},
			],
			listLabel: `Typische Punkte für ${location}`,
			list: [`${textures[0]}`, `${textures[1]}`, `${textures[2]}`, 'Wunschlied', 'Kontaktperson'],
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Trauermusik in ${location}`,
			items: compactFaq(doc.faq?.items, [
				{
					question: `Kannst du Trauermusik in ${location} übernehmen?`,
					answer: `Ja, wenn der Termin passt. Ich spiele Solo-Viola für Trauerfeiern, Beerdigungen, stille Abschiede und kurze Momente am Grab in ${location}.`,
					open: true,
				},
				{
					question: `Welche Angaben brauchst du für ${location}?`,
					answer: `Hilfreich sind Datum, Uhrzeit, genauer Trauerort, gewünschte Musikmomente, vorhandene Wunschstücke und eine Kontaktperson vor Ort.`,
				},
				{
					question: 'Kann auch draußen am Grab gespielt werden?',
					answer: `Ja, wenn Wetter, Untergrund und Schutz für das Instrument stimmen. Gerade in ${location} klären wir dafür vorher Platz, Dauer und ein mögliches Zeichen für den Beginn.`,
				},
				{
					question: 'Wie wird ein Wunschlied geprüft?',
					answer: `Ich schaue, ob Melodie, Tonart und Länge auf Solo-Viola funktionieren. Manchmal ist ein kurzer Ausschnitt würdevoller als die vollständige Fassung.`,
				},
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schickt mir Datum, Uhrzeit, Trauerort in ${location}, gewünschte Einsatzpunkte und mögliche Wunschstücke. Ich prüfe ruhig, ob der Termin passt und wie die Musik den Abschied tragen kann.`,
			checklist: [location, 'Trauerort', 'Wunschstück oder Ablauf'],
			formTitle: `Trauermusik in ${location} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer behutsamen Einschätzung für Trauermusik in ${location}.`,
		},
	};
}

function funeralTopicPatch(doc) {
	const detail = FUNERAL_TOPIC_DETAILS[doc.pageSlug] ?? [titleFromSlug(doc.pageSlug), 'Abschied', 'ruhige Planung', 'Trauerfeier', 'persönliche Einordnung'];
	const [label, angle, planning, setting, distinction] = detail;
	const contrast = pick(doc.pageSlug, [
		'verwandte Trauerseiten',
		'allgemeine Repertoirelisten',
		'reine Ortsseiten',
		'unspezifische Beerdigungsmusik',
	], 2);
	return {
		hero: {
			...doc.hero,
			title: `${label}, ruhig als Solo-Viola geplant.`,
			lead: `${label} braucht eine eigene Entscheidung: ${planning}. Ich stimme Stück, Länge, Einsatzpunkt und Klang so ab, dass die Musik im Abschied trägt und nicht wie ein austauschbarer Programmpunkt wirkt.`,
		},
		elegy: {
			quote: `${label} wirkt am stärksten, wenn die musikalische Aufgabe vorher klar ist.`,
			passages: [
				{
					strong: 'Suchintention',
					text: `Wer ${label} sucht, meint nicht einfach irgendeine Trauermusik. Im Mittelpunkt stehen ${angle}, die passende Stelle im Ablauf und die Frage, ob Solo-Viola den Moment wirklich tragen kann.`,
				},
				{
					strong: 'Abgrenzung',
					text: `Diese Seite grenzt sich bewusst von ${contrast} ab. Der Fokus liegt auf ${distinction}, damit Angehörige schneller entscheiden können, ob genau dieser musikalische Schwerpunkt passt.`,
				},
				{
					strong: 'Einsatzpunkt',
					text: `Geeignet ist ${setting}. Dort entscheidet die Länge: ein zu langer Einsatz kann belasten, ein zu kurzer kann beliebig wirken. Ich plane deshalb mit klaren Start- und Endpunkten.`,
				},
				{
					strong: 'Klang und Fassung',
					text: `Auf Solo-Viola wird die Melodie reduziert und wärmer. Ich prüfe Tonart, Register und Tempo, damit der Klang ruhig bleibt und dennoch erkennbar genug ist.`,
				},
				{
					strong: 'Anfrage',
					text: `Für eine Einschätzung reichen Datum, Ort, Ablaufstelle und vorhandene Liedidee. Danach kann ich sagen, ob eine vollständige Fassung, ein Ausschnitt oder ein anderes Stück sinnvoller ist.`,
				},
			],
		},
		solemn: {
			eyebrow: 'Einordnung',
			title: `Worauf es bei ${label} konkret ankommt.`,
			lead: `Der Schwerpunkt entscheidet über Tempo, Länge und Wirkung. Deshalb wird diese Seite anders formuliert als allgemeine Trauermusik-Seiten.`,
			cards: [
				{
					rom: 'Rolle',
					title: `${angle} musikalisch ernst nehmen`,
					poet: `${planning} verlangt eine andere Vorbereitung als eine neutrale Hintergrundmusik. Ich plane erst die Aufgabe, dann das Stück.`,
					list: ['musikalische Aufgabe', 'passende Länge', 'ruhiger Schluss'],
				},
				{
					rom: 'Ablauf',
					title: 'Den Moment nicht überladen',
					poet: `Bei ${label} bleibt die Viola nah am Abschied: sie beginnt klar, lässt Stille zu und endet so, dass Worte, Wege oder der Grabmoment weitertragen können.`,
					list: ['Startsignal', 'Raumklang', 'Kontaktperson'],
				},
			],
			listLabel: `Planung für ${label}`,
			list: [angle, planning, setting, distinction],
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${label}`,
			items: compactFaq(doc.faq?.items, [
				{
					question: `Wann passt ${label}?`,
					answer: `${label} passt, wenn ${planning} im Mittelpunkt steht und nicht nur allgemein Musik für den Abschied gesucht wird.`,
					open: true,
				},
				{
					question: 'Kannst du das Stück oder den Schwerpunkt anpassen?',
					answer: `Ja. Ich prüfe, ob eine vollständige Fassung, ein Ausschnitt oder eine reduzierte Viola-Version besser zur Situation passt.`,
				},
				{
					question: 'Was unterscheidet diese Seite von anderen Trauerseiten?',
					answer: `Hier geht es gezielt um ${angle}. Andere Seiten behandeln Ortsbezug, Buchung, Repertoire oder einen anderen Moment im Ablauf.`,
				},
				{
					question: 'Welche Informationen helfen für die Anfrage?',
					answer: `Datum, Ort, Ablaufpunkt, Wunschstück und die Frage, ob Musik innen, draußen oder an beiden Stellen gewünscht ist.`,
				},
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schickt mir Datum, Ort und den konkreten Moment, für den ihr ${label} plant. Ich melde mich mit einer ruhigen Einschätzung zu Stück, Länge und Ablauf.`,
			checklist: [label, setting, 'Wunschstück oder Schwerpunkt'],
			formTitle: `${label} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${label}.`,
		},
	};
}

function weddingPatch(doc) {
	const detail = WEDDING_TOPIC_DETAILS[doc.pageSlug] ?? [doc.targetKeyword ?? titleFromSlug(doc.pageSlug), 'Hochzeit', 'persönliche Planung', 'Trauung oder Empfang', 'eigener Schwerpunkt'];
	const [label, angle, planning, setting, distinction] = detail;
	return {
		hero: {
			...doc.hero,
			lead: `${label} wird bei mir nicht als Standardpaket geplant. Ich stimme Live-Viola auf ${setting}, Wunschlied, Raumklang und den Punkt im Ablauf ab, an dem Musik wirklich tragen soll.`,
		},
		split: {
			...doc.split,
			title: `${label}: der Schwerpunkt entscheidet über Klang und Timing.`,
			lede: `Diese Seite behandelt gezielt ${angle}. Dadurch unterscheidet sie sich von allgemeinen Hochzeitsmusik-Seiten: Nicht die Menge der Stücke ist entscheidend, sondern die Funktion im Ablauf.`,
			paragraphs: [
				`Bei ${label} steht ${planning} im Mittelpunkt. Ich kläre zuerst, ob Musik sammeln, begleiten, einen Übergang öffnen oder bewusst im Hintergrund bleiben soll.`,
				`Für ${setting} sind Startsignal, Weglänge, Raumakustik und Lautstärke wichtiger als eine lange Wunschliste. Ein Solo-Instrument kann sehr flexibel reagieren, wenn der Ablauf emotional oder organisatorisch anders läuft als geplant.`,
				`Die Viola wirkt warm und elegant, ohne eine große Bühne aufzubauen. Sie kann ein Wunschlied tragen, klassische Musik öffnen oder moderne Melodien so reduzieren, dass sie persönlich bleiben.`,
				`Die Abgrenzung liegt bei ${distinction}. Deshalb formuliere ich Stückauswahl, FAQ und Kontaktfragen hier anders als auf Ortsseiten oder allgemeinen Momentseiten.`,
				`Für die Anfrage helfen Datum, Ort, Zeremonieform, gewünschter Einsatzpunkt, Lieblingslied und die Frage, ob nach der Trauung noch Empfangs- oder Dinnermusik geplant ist.`,
			],
		},
		focus: {
			...doc.focus,
			eyebrow: 'Ablaufentscheidung',
			title: `Wie ${label} sinnvoll eingebunden wird.`,
			lead: `Die vier Punkte helfen, den Schwerpunkt sauber von ähnlichen Hochzeitsseiten zu trennen.`,
			items: [
				{ kicker: 'Aufgabe', title: `${angle} definieren`, text: `Wir legen fest, ob Musik im Vordergrund steht, einen Übergang trägt oder bewusst dezenter Teil der Atmosphäre bleibt.`, piece: 'zuerst Rolle, dann Stück' },
				{ kicker: 'Timing', title: 'Start und Ende planen', text: `Ein Blickzeichen, eine klare Dauer und ein flexibler Schluss verhindern Unsicherheit im Moment.`, piece: 'besonders wichtig live' },
				{ kicker: 'Klang', title: 'Viola passend dosieren', text: `Der warme Klang bleibt nah, ohne Worte, Ringe, Gratulationen oder Gespräche zu überdecken.`, piece: 'solo und beweglich' },
				{ kicker: 'Anfrage', title: 'Details konkret benennen', text: `Ort, Ablaufpunkt, Gästezahl und Wunschlied zeigen schnell, welche musikalische Lösung wirklich sinnvoll ist.` },
			],
			footnote: `${label} wird individuell nach Ablauf und Raum geplant.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${label}`,
			items: compactFaq(doc.faq?.items, [
				{ question: `Wann ist ${label} sinnvoll?`, answer: `${label} passt, wenn ${angle} für euren Ablauf eine eigene Rolle spielt und nicht nur allgemeine Musik gesucht wird.`, open: true },
				{ question: 'Kann ein Wunschlied eingebunden werden?', answer: `Ja. Ich prüfe Tonart, Länge und Wirkung und schlage eine Fassung vor, die zu ${setting} passt.` },
				{ question: 'Wie unterscheidet sich diese Seite von Hochzeitsmusik allgemein?', answer: `Hier geht es gezielt um ${distinction}; Ortsseiten und allgemeine Hochzeitsseiten beantworten andere Fragen.` },
				{ question: 'Welche Angaben brauchst du?', answer: 'Datum, Ort, Zeremonieform, gewünschter Einsatzpunkt, Wunschlied und ob weitere Sets für Empfang oder Dinner geplant sind.' },
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schickt mir Datum, Ort, Ablaufpunkt und eure Idee zu ${label}. Ich prüfe, welche Viola-Fassung, Länge und Platzierung dafür am besten funktioniert.`,
			checklist: [label, setting, 'Wunschlied oder Ablaufpunkt'],
			formTitle: `${label} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${label}.`,
		},
	};
}

function birthdayLocalPatch(doc) {
	const location = titleFromSlug(doc.pageSlug);
	const textures = LOCAL_TEXTURES[doc.pageSlug] ?? [location, 'private Feier', 'Gästewege', 'ruhiger Aufbau'];
	if (doc.pageSlug === 'hagen') {
		return {
			hero: {
				...doc.hero,
				lead: 'Für Geburtstage in Hagen plane ich die Musik eher als kompakten, gut getimten Moment: ein Wunschlied beim Anstoßen, ein leiser Auftakt im Raum oder ein kurzer musikalischer Gruß, der nicht die ganze Feier an sich zieht.',
			},
			split: {
				...doc.split,
				title: 'Geburtstagsmusik in Hagen braucht ein klares Startsignal.',
				lede: 'Zwischen Volme, Hohenlimburg, privaten Gärten und Räumen am Sauerlandrand ist entscheidend, wann die Musik wirklich beginnen soll. Ich plane deshalb zuerst das Zeichen, dann erst die Stückfolge.',
				paragraphs: [
					'In Hagen passt Live-Musik besonders gut, wenn sie nicht als langes Programm gedacht ist. Ein einzelner musikalischer Moment kann die gefeierte Person abholen, ohne Gespräche, Essen oder Gratulationen zu verdrängen.',
					'Wenn die Musik als Überraschung geplant ist, klären wir vorher diskret den Weg in den Raum, die richtige Position und die Person, die mir das Startsignal gibt. Dadurch bleibt der Moment leicht und wirkt trotzdem vorbereitet.',
					'Für Feiern in Hohenlimburg, in einem Restaurant oder draußen am Rand der Stadt spielt auch die Akustik mit. Ein kleiner Innenraum braucht einen anderen Ton als eine Terrasse, auf der Gäste stehen und sich bewegen.',
					'Ich empfehle für Hagen oft eine kurze Dramaturgie: erst ein persönliches Wunschstück, danach zwei bis drei ruhige Melodien als Nachklang. So bleibt die Musik ein Geschenk und wird nicht zum Hintergrundteppich.',
					'Wichtig ist die Person, für die gespielt wird: Lieblingslied, Alter, Humor, Familie und Anlass entscheiden mehr als eine allgemeine Geburtstags-Playlist.',
					'Für deine Anfrage reichen Datum, Stadtteil oder Location in Hagen, Gästezahl, gewünschter Überraschungsgrad und ein Hinweis, ob die Musik vor einer Rede, beim Empfang oder am Tisch passieren soll.',
				],
			},
			focus: {
				...doc.focus,
				eyebrow: 'Ablauf in Hagen',
				title: 'So wird aus Live-Musik ein persönlicher Geburtstagsmoment.',
				lead: 'Ich plane die Musik so, dass sie im Raum sofort verstanden wird und danach wieder Platz für die Feier lässt.',
				items: [
					{ kicker: 'Signal', title: 'Den Einsatz vorbereiten', text: 'Eine vertraute Person gibt das Zeichen, damit das erste Stück nicht zufällig beginnt.' },
					{ kicker: 'Raum', title: 'Position in Hagen klären', text: 'Tür, Tischordnung, Außenfläche und Laufwege entscheiden, ob die Viola nah oder etwas freier stehen sollte.' },
					{ kicker: 'Lied', title: 'Wunschstück kürzen', text: 'Ein bekannter Refrain oder eine warme Melodie wirkt oft stärker als eine komplette Fassung.' },
					{ kicker: 'Nachklang', title: 'Nicht zu lange bleiben', text: 'Nach dem musikalischen Höhepunkt reichen wenige weitere Stücke, damit Gespräche natürlich zurückkommen.' },
				],
				footnote: 'Für Hagen stimme ich Startzeichen, Standort und Länge der Musik besonders genau ab.',
			},
			faq: {
				eyebrow: 'Gut zu wissen',
				title: 'FAQ zu Live-Musik zum Geburtstag in Hagen',
				items: compactFaq([], [
					{ question: 'Wann wirkt Live-Musik bei einem Geburtstag in Hagen am besten?', answer: 'Meist dann, wenn sie einen konkreten Moment markiert: Anstoßen, Rede, Überraschung oder Übergang zum Essen.', open: true },
					{ question: 'Kann die Viola unbemerkt vorbereitet werden?', answer: 'Ja. Wir klären vorab Ankunft, Ansprechpartner:in, Startsignal und Standort, damit der Überraschungsmoment ruhig entsteht.' },
					{ question: 'Ist ein Garten oder eine Terrasse möglich?', answer: 'Ja, wenn Wetter, Schatten, Untergrund und ein geschützter Platz für das Instrument passen. Alternativ planen wir einen kurzen Innenmoment.' },
					{ question: 'Welche Infos brauchst du für Hagen?', answer: 'Datum, genaue Location oder Stadtteil, Gästezahl, Wunschlied, geplanter Moment und ob die Musik geheim bleiben soll.' },
				]),
			},
			contact: {
				...doc.contact,
				lead: 'Schick mir Datum, Ort in Hagen, Gästezahl und den Moment, an dem die Musik einsetzen soll. Ich antworte mit einer konkreten Idee für Wunschlied, Überraschung oder kurzen musikalischen Rahmen.',
				checklist: ['Hagen', 'Startsignal', 'Wunschlied oder Rede'],
				formTitle: 'Geburtstagsmusik in Hagen planen',
				formSuccess: 'Danke - ich melde mich mit einer konkreten Idee für Live-Musik in Hagen.',
			},
		};
	}
	if (doc.pageSlug === 'siegen') {
		return {
			hero: {
				...doc.hero,
				lead: 'Für Geburtstage in Siegen denke ich die Musik mit Anreise, Zeitfenster und ruhigem Aufbau zusammen. Die Viola eignet sich für einen bewusst gesetzten Programmpunkt, wenn Gäste aus dem Siegerland zusammenkommen und ein persönlicher Moment klar herausgehoben werden soll.',
			},
			split: {
				...doc.split,
				title: 'Geburtstagsmusik in Siegen: bewusst geplant statt spontan dazugestellt.',
				lede: 'Im Siegerland sind Feiern oft familiär, räumlich etwas weiter verteilt und zeitlich klarer getaktet. Deshalb plane ich die Musik für Siegen als verlässliches Set mit genug Puffer vor dem ersten Ton.',
				paragraphs: [
					'Für Siegen steht am Anfang die Frage, welche Aufgabe die Musik übernehmen soll: ein stiller Gruß, ein festlicher Empfang, ein persönliches Wunschlied oder ein kurzer Programmpunkt zwischen Kaffee, Rede und Abendessen.',
					'Weil Anfahrt und Aufbau bei weiter entfernten Feiern sorgfältig sitzen müssen, bespreche ich den Ablauf besonders konkret: Adresse, Raum, Parkmöglichkeit, Ansprechpartner:in und Zeitpunkt des ersten Einsatzes.',
					'Musikalisch funktioniert ein konzentriertes Set sehr gut. Die Viola kann ein bekanntes Stück tragen, danach eine kleine Folge warmer Melodien spielen und den Moment wieder freigeben, bevor die Feier in Gespräche übergeht.',
					'Bei Familienfeiern im Siegerland ist oft wichtig, dass die Musik mehrere Generationen erreicht, ohne zu laut oder zu feierlich zu werden. Ich wähle deshalb Stücke mit Wiedererkennung, aber ohne Show-Charakter.',
					'Wenn draußen gefeiert wird, klären wir Wind, Schatten und einen geschützten Platz. Wenn drinnen gefeiert wird, geht es eher um Abstand, Blickrichtung und darum, wie nah die Musik an der Hauptperson sein darf.',
					'Für die Anfrage in Siegen helfen Datum, genaue Location, geplanter Ablauf, Wunschlied und eine kurze Beschreibung der Person, für die die Musik gedacht ist.',
				],
			},
			focus: {
				...doc.focus,
				eyebrow: 'Planung in Siegen',
				title: 'Die wichtigsten Entscheidungen vor dem ersten Ton.',
				lead: 'Bei Siegen-Seiten steht nicht nur der Ortsname im Text, sondern der konkrete Rahmen der Feier.',
				items: [
					{ kicker: 'Anreise', title: 'Puffer einplanen', text: 'Adresse, Parken und Aufbauzeit werden früh geklärt, damit die Musik entspannt beginnen kann.' },
					{ kicker: 'Person', title: 'Wunschlied einordnen', text: 'Das Stück wird so gewählt oder gekürzt, dass es zur gefeierten Person und zur Situation passt.' },
					{ kicker: 'Familie', title: 'Generationen verbinden', text: 'Das Repertoire bleibt zugänglich, ohne in eine beliebige Geburtstags-Playlist zu kippen.' },
					{ kicker: 'Zeitfenster', title: 'Set bewusst begrenzen', text: 'Ein klarer Anfang und ein klarer Schluss machen die Musik wertvoller als dauernde Begleitung.' },
				],
				footnote: 'Für Siegen plane ich Musik, Anfahrt und Aufbau als ein gemeinsames Zeitfenster.',
			},
			faq: {
				eyebrow: 'Gut zu wissen',
				title: 'FAQ zu Live-Musik zum Geburtstag in Siegen',
				items: compactFaq([], [
					{ question: 'Wie früh sollte ich für Siegen anfragen?', answer: 'Je früher Datum, Ort und Zeitfenster feststehen, desto besser lassen sich Anreise, Aufbau und Wunschstück vorbereiten.', open: true },
					{ question: 'Kann ein einzelnes Wunschlied reichen?', answer: 'Ja. Gerade bei einem persönlichen Geburtstagsmoment kann ein gut platzierter kurzer Einsatz stärker sein als ein langes Programm.' },
					{ question: 'Passt Viola zu einer Familienfeier im Siegerland?', answer: 'Ja, wenn Klang und Länge bewusst gewählt werden. Die Musik kann warm und festlich sein, ohne Gespräche zu überdecken.' },
					{ question: 'Welche Details soll ich senden?', answer: 'Datum, Location in Siegen oder Umgebung, Gästezahl, Ablauf, Wunschlied und ob die Musik ein Programmpunkt oder Begleitung sein soll.' },
				]),
			},
			contact: {
				...doc.contact,
				lead: 'Sende mir Datum, Location in Siegen, Ablauf und Wunschmoment. Ich prüfe Anfahrt, sinnvolle Setlänge und eine passende musikalische Form für die gefeierte Person.',
				checklist: ['Siegen', 'Zeitfenster', 'Wunschlied oder Set'],
				formTitle: 'Live-Musik in Siegen anfragen',
				formSuccess: 'Danke - ich melde mich mit einer abgestimmten Idee für Geburtstagsmusik in Siegen.',
			},
		};
	}
	const setShape = pick(doc.pageSlug, [
		'ein kurzes Wunschlied als Geschenk, danach leichte Musik für Gespräche',
		'zwei kleine Sets: erst Ankommen, später ein persönlicher Mittelpunkt',
		'eine diskrete Überraschung, die erst im Raum sichtbar wird',
		'ein ruhiger musikalischer Rahmen für Dinner, Rede und Ausklang',
	], 1);
	const guestAngle = pick(doc.pageSlug, [
		'Familienmitglieder aus verschiedenen Richtungen kommen zusammen',
		'mehrere Generationen hören sehr unterschiedlich hin',
		'der offizielle Moment soll kurz bleiben und trotzdem besonders wirken',
		'Gespräche, Toasts und Fotos dürfen nicht durch Musik zugedeckt werden',
	], 2);
	return {
		hero: {
			...doc.hero,
			lead: `Live-Musik zum Geburtstag in ${location} plane ich nach Raum, Gästezahl und Überraschungsmoment. Die Viola kann warm im Hintergrund bleiben oder ein Wunschlied so setzen, dass der Moment persönlich wird, ohne die Feier zu unterbrechen.`,
		},
		split: {
			...doc.split,
			title: `Geburtstagsmusik in ${location}: ein persönlicher Akzent statt Dauerprogramm.`,
			lede: `Für ${location} zählen praktische Details wie ${textures.slice(0, 3).join(', ')}. Daraus ergibt sich, ob die Musik sichtbar als Geschenk beginnt oder dezent den Empfang und das Essen trägt.`,
			paragraphs: [
				`Der erste Schritt ist nicht die Stückliste, sondern die Rolle der Musik: Soll sie überraschen, begrüßen, eine Rede rahmen oder einen offiziellen Teil sanft beenden?`,
				`Für ${location} bietet sich oft ${setShape} an. So bleibt die Feier beweglich und die Musik bekommt trotzdem einen erkennbaren Platz.`,
				`Ich achte auf ${textures[0]} und ${textures[1]}, weil diese Punkte verändern, wie nah die Viola stehen kann und ob ein einzelner Einsatz genügt.`,
				`Wenn ${guestAngle}, hilft ein klarer musikalischer Moment: nicht zu lang, nicht zu laut, aber deutlich genug, dass alle verstehen, warum gerade jetzt Musik erklingt.`,
				`Das Repertoire kann ein Lieblingslied, einen klassischen Gruß und leichte Melodien verbinden. Entscheidend ist, dass die Auswahl zur gefeierten Person passt, nicht nur zu einer abstrakten Vorstellung von Geburtstag.`,
				`Für die Anfrage in ${location} helfen Datum, genauer Ort, Gästezahl, Anlass, Wunschlied und die Frage, ob die Musik geheim vorbereitet werden soll.`,
			],
		},
		focus: {
			...doc.focus,
			eyebrow: 'Feierdramaturgie',
			title: `Vier sinnvolle Musikmomente für Geburtstage in ${location}.`,
			lead: `Die Musik bleibt leicht, wenn jeder Einsatz eine klare Aufgabe hat.`,
			items: [
				{ kicker: 'Empfang', title: `Ankommen in ${location}`, text: `Ein kurzer Auftakt hilft, dass Gäste in den Raum finden und die Feier sofort einen besonderen Ton bekommt.` },
				{ kicker: 'Geschenk', title: 'Das Wunschlied platzieren', text: `Ein persönliches Stück wirkt am stärksten, wenn Blickzeichen, Sitzordnung und Länge vorher diskret geklärt sind.` },
				{ kicker: 'Dinner', title: 'Zwischen Reden und Gesprächen spielen', text: `Kurze Sets halten die Stimmung, ohne Tischgespräche oder Service zu stören.` },
				{ kicker: 'Ausklang', title: 'Den offiziellen Teil lösen', text: `Ein ruhiger Schluss rundet den Moment ab und lässt die Feier danach offen weiterlaufen.` },
			],
			footnote: `Für ${location} stimme ich Setlänge, Position und Überraschungsgrad vorab ab.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Geburtstagsmusik in ${location}`,
			items: compactFaq([], [
				{ question: `Welche Geburtstagsmusik passt in ${location}?`, answer: `Das hängt von Raum und Anlass ab. Möglich sind Wunschlied, Empfangsmusik, ein kurzer Überraschungsmoment oder dezente Dinnermusik.`, open: true },
				{ question: 'Kann die Musik als Überraschung geplant werden?', answer: `Ja. Für ${location} klären wir Ankunft, erstes Zeichen und Position so, dass die Überraschung natürlich bleibt.` },
				{ question: 'Wie lang sollte die Viola spielen?', answer: 'Für ein Geschenk reichen oft wenige Minuten. Für Empfang oder Dinner sind mehrere kurze Sets angenehmer als ein langer Block.' },
				{ question: 'Was sollte ich vorab schreiben?', answer: `Datum, Ort in ${location}, Gästezahl, Anlass, Wunschlied, geplanter Zeitpunkt und ob die Musik sichtbar oder dezent sein soll.` },
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schick mir Datum, Ort in ${location}, Gästezahl und die Idee hinter der Musik. Ich schlage dir eine passende Form vor: Wunschlied, kurzer Überraschungsmoment oder dezente Begleitung.`,
			checklist: [location, 'Geburtstag', 'Wunschlied oder Überraschung'],
			formTitle: `Geburtstagsmusik in ${location} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für Geburtstagsmusik in ${location}.`,
		},
	};
}

function birthdayPatch(doc) {
	if (LOCAL_SLUGS.has(doc.pageSlug)) return birthdayLocalPatch(doc);
	const location = LOCAL_SLUGS.has(doc.pageSlug) ? titleFromSlug(doc.pageSlug) : '';
	const detail = BIRTHDAY_TOPIC_DETAILS[doc.pageSlug] ?? [`Live Musik Geburtstag ${location}`, 'private Feier', 'Empfang, Dinner oder Überraschung', 'Wohnung, Restaurant oder Garten', 'persönlicher Anlass'];
	const [label, angle, planning, setting, distinction] = detail;
	const phrase = location ? ` in ${location}` : '';
	const isBackground = doc.pageSlug === 'hintergrundmusik-geburtstag';
	const isStrings = doc.pageSlug === 'streichmusik-geburtstag';
	return {
		hero: {
			...doc.hero,
			lead: isBackground
				? 'Hintergrundmusik zum Geburtstag soll Gespräche tragen, nicht dominieren. Ich plane die Viola in kurzen, leisen Sets, die Empfang, Dinner oder Familienrunde wärmen, ohne daraus ein Konzert zu machen.'
				: isStrings
					? 'Streichmusik zum Geburtstag meint hier keinen großen Ensemble-Auftritt, sondern warmen Solo-Viola-Klang für Wunschlied, Empfang oder einen persönlichen Moment.'
					: `${label}${phrase} plane ich nach Gastgeber:in, Raum und gewünschtem Moment. Die Viola kann überraschen, begleiten oder einen offiziellen Teil elegant abrunden.`,
		},
		split: {
			...doc.split,
			title: isBackground ? 'Hintergrundmusik zum Geburtstag braucht Zurückhaltung.' : 'Streichmusik zum Geburtstag lebt vom direkten Klang.',
			lede: isBackground
				? 'Der Schwerpunkt liegt auf Atmosphäre: Musik darf den Raum veredeln, aber Gespräche, Essen und Gratulationen nicht überdecken.'
				: 'Der Schwerpunkt liegt auf der Klangfarbe: Bogen, warme Melodie und ein einzelnes Instrument schaffen Nähe, ohne eine Band- oder Quartett-Situation zu bauen.',
			paragraphs: isBackground ? [
				'Bei Hintergrundmusik ist die wichtigste Entscheidung die Lautstärke. Die Viola bleibt so präsent, dass der Raum festlich wirkt, aber niemand gegen die Musik sprechen muss.',
				'Ich plane dafür eher kurze Sets mit Pausen als dauerndes Spielen. Gerade bei Geburtstagen wechseln Gespräche, Reden, Fotos und kleine Überraschungen oft schneller als ein Ablaufplan vermuten lässt.',
				'Geeignet sind leichte klassische Stücke, ruhige moderne Melodien und bekannte Themen, die auch ohne Gesang funktionieren. Ein Wunschlied kann eingebaut werden, sollte aber nicht jeden Tisch zum Zuhören zwingen.',
				'Diese Seite grenzt sich von Streichmusik zum Geburtstag ab: Hier geht es nicht primär um die Instrumentenfarbe, sondern um dezente Atmosphäre im Hintergrund.',
				'Für die Anfrage helfen Raumgröße, Gästezahl, Essenszeiten, Reden und die Frage, ob Musik eher beim Ankommen, zwischen Gängen oder im Ausklang gewünscht ist.',
			] : [
				'Streichmusik meint den besonderen Ton eines gestrichenen Instruments. Auf Solo-Viola klingt dieser Ton wärmer und näher als eine helle Geige, bleibt aber klar melodisch.',
				'Bei Geburtstagen kann Streichmusik ein Wunschlied tragen, einen Empfang festlich öffnen oder als kurze musikalische Überraschung wirken. Die Musik muss dafür nicht pausenlos laufen.',
				'Ich wähle Stücke nach Wiedererkennung, Länge und Raum. Ein einzelner Refrain oder ein ruhiger Ausschnitt kann stärker sein als eine komplette Fassung.',
				'Diese Seite grenzt sich von Hintergrundmusik ab: Hier steht die bewusste Klangfarbe im Vordergrund, nicht nur eine leise Begleitung des Raums.',
				'Für die Anfrage helfen Anlass, Wunschstück, Raum, Gästezahl und die Frage, ob der Streicherklang sichtbar als Programmpunkt oder dezent eingebunden werden soll.',
			],
		},
		focus: {
			...doc.focus,
			eyebrow: isBackground ? 'Atmosphäre' : 'Klangfarbe',
			title: isBackground ? 'So bleibt Musik im Hintergrund wertvoll.' : 'So wird Streichmusik persönlich.',
			lead: isBackground ? 'Die Musik bekommt Platz, ohne Gespräche zu verdrängen.' : 'Der Streichklang bekommt eine klare Rolle im Ablauf.',
			items: isBackground ? [
				{ kicker: 'Leise', title: 'Gespräche zuerst denken', text: 'Die Lautstärke wird so gewählt, dass Gäste sich weiter natürlich unterhalten können.' },
				{ kicker: 'Pausen', title: 'In kurzen Sets spielen', text: 'Pausen machen die Musik angenehmer und geben Reden, Service oder Fotos genug Raum.' },
				{ kicker: 'Repertoire', title: 'Bekannt, aber unaufdringlich', text: 'Stücke werden so ausgewählt, dass sie Stimmung geben, ohne Aufmerksamkeit zu erzwingen.' },
				{ kicker: 'Timing', title: 'Ankommen und Essen rahmen', text: 'Empfang, Übergang zum Dinner oder Ausklang sind oft sinnvoller als dauernde Begleitung.' },
			] : [
				{ kicker: 'Bogen', title: 'Warmen Ton hörbar machen', text: 'Die Viola bringt die Streichfarbe direkt in den Raum, ohne großes Setup.' },
				{ kicker: 'Wunschlied', title: 'Melodie reduzieren', text: 'Ein persönliches Stück wird so gekürzt oder eingerichtet, dass es auf Solo-Viola trägt.' },
				{ kicker: 'Moment', title: 'Nicht alles begleiten', text: 'Streichmusik wirkt stärker, wenn sie an wenigen Stellen bewusst eingesetzt wird.' },
				{ kicker: 'Raum', title: 'Nähe planen', text: 'Position und Abstand entscheiden, ob der Klang intim, festlich oder dezent wirkt.' },
			],
			footnote: `${label}${phrase} wird nach Raum, Gästen und Überraschungsgrad geplant.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${label}${phrase}`,
			items: compactFaq(doc.faq?.items, [
				{ question: `Wann passt ${label}${phrase}?`, answer: `${label}${phrase} passt, wenn Musik eine persönliche Aufgabe übernehmen soll: Überraschung, Empfang, Dinner oder ein Wunschlied.`, open: true },
				{ question: 'Kann die Musik geheim geplant werden?', answer: 'Ja. Ankunft, erstes Stück und Blickzeichen können mit einer Vertrauensperson abgestimmt werden.' },
				{ question: 'Wie lange sollte ein Set dauern?', answer: 'Für eine Überraschung reichen oft wenige Minuten; für Empfang oder Dinner sind mehrere kurze Sets meist angenehmer.' },
				{ question: 'Was sollte in der Anfrage stehen?', answer: 'Datum, Ort, Anlass, Gästezahl, Wunschlied und ob die Musik sichtbar oder dezent im Hintergrund wirken soll.' },
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schick mir Datum, Ort, Gästezahl und den Anlass hinter ${label}${phrase}. Ich melde mich mit einer musikalischen Idee, die zur Person und zum Ablauf passt.`,
			checklist: [label, location || 'private Feier', 'Wunschlied oder Überraschung'],
			formTitle: `${label}${phrase} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${label}${phrase}.`,
		},
	};
}

function teachingPatch(doc) {
	const detail = TEACHING_TOPIC_DETAILS[doc.pageSlug] ?? [doc.targetKeyword ?? titleFromSlug(doc.pageSlug), 'Lernrahmen', 'Haltung, Klang und Üben', 'Probestunde oder regelmäßiger Unterricht', 'individuelles Ziel'];
	const [label, angle, planning, setting, distinction] = detail;
	const adult = doc.pageSlug === 'bratschenunterricht-erwachsene';
	return {
		hero: {
			...doc.hero,
			lead: adult
				? 'Bratschenunterricht für Erwachsene beginnt nicht bei einem Kinder-Lehrplan, sondern bei deinem Alltag: Zeit, Körpergefühl, Vorerfahrung, Hemmungen und musikalische Wünsche werden zuerst sortiert.'
				: 'Bratschenunterricht beginnt mit einem tragfähigen Fundament: Haltung, Bogen, erster Klang, Notenlesen und Üben werden so aufgebaut, dass Fortschritt verständlich bleibt.',
		},
		split: {
			...doc.split,
			title: adult ? 'Bratschenunterricht für Erwachsene darf anders anfangen.' : 'Bratschenunterricht: ein solides Fundament für Klang und Technik.',
			lede: adult
				? 'Erwachsene bringen Fragen mit, die im normalen Anfängertext oft fehlen: wenig Zeit, hohe Ansprüche, alte Bewegungsmuster oder der Wunsch, endlich ein Streichinstrument zu verstehen.'
				: `Diese Seite konzentriert sich auf ${angle}. So unterscheidet sie sich von lokalen Unterrichtsseiten: Im Mittelpunkt steht die Lernfrage, nicht der Ort.`,
			paragraphs: adult ? [
				'Bei Erwachsenen schaue ich zuerst auf Alltag und Ziel: Wie viel Übezeit ist realistisch, was soll musikalisch möglich werden, und welche körperlichen Gewohnheiten helfen oder stören?',
				'Ein später Einstieg ist kein Nachteil, wenn der Unterricht klar strukturiert ist. Erwachsene verstehen Zusammenhänge oft schnell; die Kunst liegt darin, Technik nicht zu verkopfen.',
				'Wir arbeiten mit kleinen, überprüfbaren Aufgaben: Bogenkontakt, entspannte linke Hand, saubere Wechsel, sicherer Rhythmus und Stücke, die motivieren, ohne zu überfordern.',
				'Wiedereinsteiger:innen brauchen eine andere Route als komplette Anfänger:innen. Alte Fähigkeiten werden geprüft, aber nicht romantisiert; was noch trägt, bleibt, was Spannung erzeugt, wird neu sortiert.',
				'Diese Seite grenzt sich vom allgemeinen Bratschenunterricht ab: Hier geht es um erwachsene Lernrealität, nicht um einen Einstieg für alle Altersgruppen.',
				'Für die Anfrage helfen Vorerfahrung, Wunschrepertoire, vorhandenes Instrument, Zeitfenster, Übemöglichkeit und die Frage, ob du eher neu anfängst oder zurückkehrst.',
			] : [
				'Im allgemeinen Bratschenunterricht steht das Fundament im Vordergrund: Instrument halten, Bogen führen, Ton hören, Noten verstehen und regelmäßig sinnvoll üben.',
				'Der Unterricht ist offen für Kinder, Jugendliche, Erwachsene und Wiedereinsteiger:innen. Die Inhalte ändern sich je nach Alter, aber die Grundidee bleibt: ein entspannter Körper und ein tragender Klang.',
				'Wir verbinden Technik sofort mit Musik. Eine Bogenübung bleibt nicht abstrakt, sondern taucht in kleinen Melodien, Etüden oder Wunschstücken wieder auf.',
				'Ein gutes Fundament spart später viele Korrekturen. Deshalb werden Haltung, Intonation und Rhythmus langsam genug aufgebaut, damit sie wirklich verstanden werden.',
				'Diese Seite grenzt sich von der Erwachsenen-Seite ab: Hier geht es um den vollständigen Unterrichtsrahmen für verschiedene Altersgruppen und Lernstände.',
				'Für die Anfrage helfen Alter, Lernstand, vorhandenes Instrument, musikalisches Ziel und die Frage, ob zuerst eine Probestunde gewünscht ist.',
			],
		},
		focus: {
			...doc.focus,
			eyebrow: 'Unterrichtsaufbau',
			title: adult ? 'Schwerpunkte für erwachsene Lernende.' : 'Schwerpunkte im allgemeinen Bratschenunterricht.',
			lead: adult ? 'Der Unterricht berücksichtigt Kopf, Körper und knappe Zeit.' : 'Die Unterrichtsarbeit bleibt konkret: hören, ausprobieren, verstehen und machbar weiterführen.',
			items: adult ? [
				{ kicker: 'Alltag', title: 'Realistisch üben', text: 'Wir entwickeln Aufgaben, die auch mit Beruf, Familie oder unregelmäßigen Wochen funktionieren.' },
				{ kicker: 'Körper', title: 'Spannung abbauen', text: 'Schulter, Nacken, linke Hand und Bogenarm werden so sortiert, dass Üben nicht verkrampft.' },
				{ kicker: 'Verstehen', title: 'Technik nachvollziehen', text: 'Erklärungen bleiben praktisch: Du sollst wissen, warum eine Bewegung den Klang verändert.' },
				{ kicker: 'Musik', title: 'Wunschstücke einordnen', text: 'Repertoire wird passend gewählt, damit Motivation bleibt und technische Schritte nicht übersprungen werden.' },
			] : [
				{ kicker: 'Start', title: 'Instrument sicher halten', text: 'Haltung, Schulterstütze, linke Hand und Bogen werden von Anfang an sinnvoll eingerichtet.' },
				{ kicker: 'Klang', title: 'Den Ton bewusst hören', text: 'Kontaktstelle, Bogengeschwindigkeit und Gewicht werden direkt mit dem Klang verbunden.' },
				{ kicker: 'Noten', title: 'Lesen und spielen verbinden', text: 'Rhythmus, Tonhöhe und Griffbrett werden so geübt, dass Musik nicht nur Theorie bleibt.' },
				{ kicker: 'Üben', title: 'Kleine Schritte planen', text: 'Nach jeder Stunde ist klar, was zu Hause Priorität hat und woran Fortschritt hörbar wird.' },
			],
			footnote: `${label} wird nach Lernziel, Alter und Alltag geplant.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${label}`,
			items: adult ? compactFaq([], [
				{ question: 'Ist Bratschenunterricht als Erwachsener realistisch?', answer: 'Ja. Wichtig sind realistische Ziele, regelmäßige kleine Übeeinheiten und ein Unterricht, der körperliche Gewohnheiten ernst nimmt.', open: true },
				{ question: 'Muss ich Noten lesen können?', answer: 'Nein. Notenlesen kann Schritt für Schritt mit dem Instrument aufgebaut werden.' },
				{ question: 'Was ist anders als beim Kinderunterricht?', answer: 'Erwachsene brauchen meist mehr Erklärung, flexible Übepläne und Repertoire, das Motivation und Technik sinnvoll verbindet.' },
				{ question: 'Was soll ich für die Anfrage schreiben?', answer: 'Vorerfahrung, Wunschziel, vorhandenes Instrument, verfügbare Übezeit und mögliche Termine für eine Probestunde.' },
			]) : compactFaq([], [
				{ question: 'Für wen passt Bratschenunterricht?', answer: 'Für Kinder, Jugendliche, Erwachsene, Anfänger:innen und Wiedereinsteiger:innen, die Klang, Technik und Üben strukturiert aufbauen möchten.', open: true },
				{ question: 'Brauche ich sofort ein eigenes Instrument?', answer: 'Nicht unbedingt. Für den Start kann ein passendes Leihinstrument sinnvoll sein; Größe und Zustand sollten zur Person passen.' },
				{ question: 'Wie läuft eine Probestunde ab?', answer: 'Wir sprechen über Ziele, probieren Klang und Haltung aus und klären, welcher Unterrichtsrhythmus realistisch ist.' },
				{ question: 'Was sollte ich vorab schreiben?', answer: 'Alter, Vorerfahrung, vorhandenes Instrument, Ziel und mögliche Unterrichtszeiten reichen für eine erste Einschätzung.' },
			]),
		},
		contact: {
			...doc.contact,
			lead: `Schreib mir kurz, für wen ${label} gedacht ist, welche Erfahrung vorhanden ist und welches Ziel im Raum steht. Danach schlage ich eine passende Probestunde oder einen Lernrhythmus vor.`,
			checklist: [label, 'Lernstand', 'Probestunde'],
			formTitle: `${label} anfragen`,
			formSuccess: `Danke - ich melde mich mit einem Vorschlag für ${label}.`,
		},
	};
}

function patchFor(doc) {
	if (doc.serviceSlug === 'beerdigungen') {
		return doc.pageKind === 'local' && LOCAL_SLUGS.has(doc.pageSlug)
			? localFuneralPatch(doc)
			: funeralTopicPatch(doc);
	}
	if (doc.serviceSlug === 'hochzeiten') return weddingPatch(doc);
	if (doc.serviceSlug === 'geburtstage') return birthdayPatch(doc);
	if (doc.serviceSlug === 'unterricht') return teachingPatch(doc);
	return {};
}

function updateDoc(service, pageSlug) {
	const file = path.join(CONTENT_DIR, service, `${pageSlug}.json`);
	if (!existsSync(file)) {
		return { ok: false, file, reason: 'missing file' };
	}
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const patch = patchFor(doc);
	const label = doc.pageKind === 'local' ? titleFromSlug(doc.pageSlug) : (doc.targetKeyword ?? titleFromSlug(doc.pageSlug));
	const next = {
		...doc,
		...patch,
		status: STATUS,
		editorNotes: noteFor(doc),
		imageAlts: applyImageAlts(doc, label),
	};
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
	return { ok: true, file, service, pageSlug };
}

if (!existsSync(TRACKER_FILE)) {
	console.error('Missing seo/local-page-tracker.csv. Run npm run tracker:local-seo first.');
	process.exit(1);
}

const rows = parseCsv(readFileSync(TRACKER_FILE, 'utf8'))
	.filter((row) => ['high', 'medium'].includes(row.cannibalization_risk))
	.sort((a, b) => a.service.localeCompare(b.service) || a.location_slug.localeCompare(b.location_slug));

const results = rows.map((row) => updateDoc(row.service, row.location_slug));
const failed = results.filter((result) => !result.ok);
const updated = results.filter((result) => result.ok);

console.log(`Risk SEO rewrite complete`);
console.log(`- tracker rows: ${rows.length}`);
console.log(`- updated docs: ${updated.length}`);
console.log(`- failed docs: ${failed.length}`);
for (const result of failed) {
	console.log(`  - ${result.file}: ${result.reason}`);
}

if (failed.length) process.exit(1);
