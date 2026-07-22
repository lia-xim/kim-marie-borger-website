import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TRACKER = path.join(ROOT, 'seo/seo-page-tracker.csv');
const CONTENT_DIR = path.join(ROOT, 'src/content/seo-pages');
const BATCH_NOTE = 'Batch 16: Medium- und Low-Seiten mit staerker unterscheidbaren lokalen und thematischen Textbloeken weiter differenziert.';
const OLD_BATCH_NOTES = [
	'Batch 12: Medium-Risk-Seiten mit zusaetzlichen Differenzierungsabsaetzen und Abgrenzungs-FAQ gestreckt.',
	'Batch 13: Verbleibende Medium-Risk-Seiten mit stark erweiterten lokalen und intent-spezifischen Differenzierungsabsaetzen gestreckt.',
	'Batch 14: Medium-Seiten mit leserfreundlichen lokalen und intent-spezifischen Differenzierungsabsaetzen poliert.',
];
const GENERATED_TEXT_MARKERS = [
	'So entsteht eine eigene Seite',
	'Diese Seite grenzt',
	'Diese Seite bleibt eng',
	'Diese Seite behandelt',
	'Diese Seite fokussiert bewusst',
	'Andere Seiten im Cluster',
	'Diese Seite ist bewusst',
	'So bleibt die Seite klar',
	'Die interne Verlinkung kann',
	'Wenn ein anderes Keyword besser passt',
	'Suchbegriff',
	'Suchintent',
	'welche Seite fuer welchen Suchintent',
	'Der Text ist auf diesen konkreten Intent',
	'eigene Aufgabe im',
	'eigene FAQ',
	'nicht nur auf dem Oberbegriff',
	'Suchintention hinter',
	'nicht als Synonym behandelt',
	'Keyword-Varianten',
	'Keyword',
	'Cluster',
	'Kannibalisierung',
	'zusaetzliche Differenzierung',
	'nicht nur auf den Ortsnamen bezogen',
	'naechste aehnliche Ort im Cluster',
	'nicht wie eine Kopie',
	'keine reine Ortsvariante',
	'eigenstaendigen Angebot innerhalb des Clusters',
	'anders zu lesen als ein allgemeiner Leistungsbegriff',
	'Zur Abgrenzung von',
	'benachbarten Keywords',
	'welche Entscheidung hinter',
	'aus einem Suchbegriff',
	'nicht gleichzeitig alle Nachbarintents',
	'Menschen mit diesem Keyword',
	'keine Standardantwort',
	'eine eigene Sprache',
	'im Cluster stabiler',
	'Abgrenzungs-FAQ',
	'SEO-Abgrenzung',
	'Diese Ortsmarker sind wichtig',
	'sichtbar im Mittelpunkt steht oder seitlich den Ablauf traegt',
	'kopiertes Paket',
	'Ich unterscheide in',
	'Die lokale Anfrage zu',
	'Auch die Abgrenzung zu',
	'Musikalisch heisst das fuer',
	'Wenn sich am Tag selbst etwas verschiebt',
	'Die Planung wird ueber',
	'Ein zweiter Schwerpunkt ist',
	'Praktisch pruefe ich bei',
	'Wichtig ist auch, was diese Anfrage nicht leisten soll',
	'Der dritte Blick liegt auf',
	'Die Abgrenzung entsteht ueber den Ablauf',
	'weniger allgemein und staerker auf Entscheidungshilfe',
	'Probestunde oder eine sehr reduzierte Loesung',
	'wird im CMS als eigene Seite',
	'paedagogisch aufgebaut',
	'Viola oder der Unterricht',
	'musikalische oder paedagogische Schwerpunkt',
	'Unterrichtseinstieg',
	'Musik fuer wird nicht',
	'Musik fur wird nicht',
	'SEO-Struktur',
	'redaktionellen Pflege im CMS',
	'Musik oder Unterricht',
	'In der Vorbereitung pruefe ich besonders',
	'In der Vorbereitung prüfe ich besonders',
	'Praktisch geht es um',
	'Wichtig ist die Grenze:',
	'Ein weiterer Blick gilt',
	'Fuer die erste Einschaetzung helfen',
	'Für die erste Einschätzung helfen',
	'Je klarer dieser Punkt beschrieben ist',
	'In der Vorbereitung kläre ich besonders',
	'In der Vorbereitung klaere ich besonders',
	'beginnt die Planung fuer',
	'beginnt die Planung für',
	'Vor Ort klaere ich vor allem',
	'Vor Ort kläre ich vor allem',
	'Deshalb richte ich',
	'Musikalisch bedeutet das:',
	'Gegenueber',
	'Gegenüber',
	'Fuer eine konkrete Anfrage helfen',
	'Für eine konkrete Anfrage helfen',
];
const GENERATED_QUESTION_MARKERS = [
	'gegenueber Nachbarorten eigenstaendig',
	'Welche Angaben helfen speziell fuer',
	'Wodurch unterscheidet sich',
	'die richtige Seite fuer eine Anfrage',
	'eigene Seite',
	'welcher Suchintent',
];

const COPY_NORMALIZE_SKIP_KEYS = new Set([
	'pageKind',
	'serviceSlug',
	'pageSlug',
	'route',
	'intentCluster',
	'priority',
	'status',
	'editorNotes',
	'src',
	'_template',
]);

const GERMAN_COPY_REPLACEMENTS = [
	['aufblaeht', 'aufbläht'],
	['staerker', 'stärker'],
	['Staerker', 'Stärker'],
	['tatsaechlich', 'tatsächlich'],
	['geloest', 'gelöst'],
	['duerfen', 'dürfen'],
	['Duerfen', 'Dürfen'],
	['Wuerde', 'Würde'],
	['wuerdevoll', 'würdevoll'],
	['Hoehe', 'Höhe'],
	['Atmosphaere', 'Atmosphäre'],
	['atmosphaerisch', 'atmosphärisch'],
	['Gaenge', 'Gänge'],
	['ueberladen', 'überladen'],
	['anschliessender', 'anschließender'],
	['Zuhoeren', 'Zuhören'],
	['Verhaeltnis', 'Verhältnis'],
	['Verlaesslichkeit', 'Verlässlichkeit'],
	['Schoenheit', 'Schönheit'],
	['Gaestefluss', 'Gästefluss'],
	['traegfaehiger', 'tragfähiger'],
	['Duesseldorf', 'Düsseldorf'],
	['duesseldorf', 'düsseldorf'],
	['Koeln', 'Köln'],
	['koeln', 'köln'],
	['Muenster', 'Münster'],
	['muenster', 'münster'],
	['Muelheim', 'Mülheim'],
	['muelheim', 'mülheim'],
	['Moenchengladbach', 'Mönchengladbach'],
	['moenchengladbach', 'mönchengladbach'],
	['Wuelfrath', 'Wülfrath'],
	['Wuelrath', 'Wülfrath'],
	['wuelfrath', 'wülfrath'],
	['Aussen', 'Außen'],
	['aussen', 'außen'],
	['ausserdem', 'außerdem'],
	['Ausserdem', 'Außerdem'],
	['Gaestezahl', 'Gästezahl'],
	['Gaesteprofil', 'Gästeprofil'],
	['Gaesten', 'Gästen'],
	['gaesten', 'gästen'],
	['Gaeste', 'Gäste'],
	['gaeste', 'gäste'],
	['Gespraeche', 'Gespräche'],
	['gespraeche', 'gespräche'],
	['Gespraech', 'Gespräch'],
	['gespraech', 'gespräch'],
	['gespraechsfreundlich', 'gesprächsfreundlich'],
	['Fuer', 'Für'],
	['fuer', 'für'],
	['Ueber', 'Über'],
	['ueber', 'über'],
	['Praesenz', 'Präsenz'],
	['praesent', 'präsent'],
	['Praesent', 'Präsent'],
	['Repraesentation', 'Repräsentation'],
	['repraesentativ', 'repräsentativ'],
	['gewuenschte', 'gewünschte'],
	['gewuenscht', 'gewünscht'],
	['Gewuenschte', 'Gewünschte'],
	['wuensche', 'wünsche'],
	['persoenlichen', 'persönlichen'],
	['persoenlicher', 'persönlicher'],
	['persoenliche', 'persönliche'],
	['persoenlich', 'persönlich'],
	['Persoenlich', 'Persönlich'],
	['zurueckhaltender', 'zurückhaltender'],
	['zurueckhaltend', 'zurückhaltend'],
	['zuruecknimmt', 'zurücknimmt'],
	['zurueck', 'zurück'],
	['pruefend', 'prüfend'],
	['pruefen', 'prüfen'],
	['pruefe', 'prüfe'],
	['geprueft', 'geprüft'],
	['Pruefung', 'Prüfung'],
	['klaeren', 'klären'],
	['klaere', 'kläre'],
	['fuehren', 'führen'],
	['fuehrt', 'führt'],
	['Fuehrung', 'Führung'],
	['fuehrung', 'führung'],
	['laengerer', 'längerer'],
	['laengere', 'längere'],
	['laenger', 'länger'],
	['Laenge', 'Länge'],
	['laenge', 'länge'],
	['Setlaenge', 'Setlänge'],
	['Menuepausen', 'Menüpausen'],
	['Menuezeiten', 'Menüzeiten'],
	['Menue', 'Menü'],
	['Kontinuitaet', 'Kontinuität'],
	['kontinuitaet', 'kontinuität'],
	['naechsten', 'nächsten'],
	['naechste', 'nächste'],
	['naechster', 'nächster'],
	['naechst', 'nächst'],
	['moeglichst', 'möglichst'],
	['moeglichen', 'möglichen'],
	['moegliche', 'mögliche'],
	['moeglicher', 'möglicher'],
	['moeglich', 'möglich'],
	['regelmaessiger', 'regelmäßiger'],
	['regelmaessig', 'regelmäßig'],
	['Uebeziele', 'Übeziele'],
	['Uebezeit', 'Übezeit'],
	['Uebeplan', 'Übeplan'],
	['Uebung', 'Übung'],
	['Uebungen', 'Übungen'],
	['ueben', 'üben'],
	['Uebergang', 'Übergang'],
	['Uebergange', 'Übergänge'],
	['Ueberraschung', 'Überraschung'],
	['ueberraschung', 'überraschung'],
	['Ueberinszenierung', 'Überinszenierung'],
	['Hoehenlagen', 'Höhenlagen'],
	['Hoehen', 'Höhen'],
	['Hoefe', 'Höfe'],
	['Haeuser', 'Häuser'],
	['Raeume', 'Räume'],
	['raeume', 'räume'],
	['Saalraeume', 'Saalräume'],
	['Saele', 'Säle'],
	['Naehe', 'Nähe'],
	['naehe', 'nähe'],
	['gruene', 'grüne'],
	['gruenere', 'grünere'],
	['hellhoerig', 'hellhörig'],
	['bodenstaendigen', 'bodenständigen'],
	['bodenstaendig', 'bodenständig'],
	['Wertschaetzung', 'Wertschätzung'],
	['veraendern', 'verändern'],
	['veraendert', 'verändert'],
	['veraenderte', 'veränderte'],
	['Veraenderung', 'Veränderung'],
	['geschuetzten', 'geschützten'],
	['geschuetzte', 'geschützte'],
	['geschuetzt', 'geschützt'],
	['aelteren', 'älteren'],
	['aeltere', 'ältere'],
	['aelter', 'älter'],
	['Parkflaechen', 'Parkflächen'],
	['Eingange', 'Eingänge'],
	['Koerpergefuehl', 'Körpergefühl'],
	['Gefuehl', 'Gefühl'],
	['gefuehl', 'gefühl'],
	['Raeumen', 'Räumen'],
	['fuellen', 'füllen'],
	['oeffnen', 'öffnen'],
	['oeffnet', 'öffnet'],
	['waehlen', 'wählen'],
	['waehlt', 'wählt'],
	['waehrend', 'während'],
	['Waerme', 'Wärme'],
	['waermer', 'wärmer'],
	['kuenstlich', 'künstlich'],
	['Praezise', 'Präzise'],
	['praezise', 'präzise'],
	['Einsaetze', 'Einsätze'],
	['eroeffnung', 'eröffnung'],
	['Eroeffnung', 'Eröffnung'],
	['Jubilaeum', 'Jubiläum'],
	['jubilaeum', 'jubiläum'],
	['Verfuegbarkeit', 'Verfügbarkeit'],
	['verfuegbar', 'verfügbar'],
	['verstaendlich', 'verständlich'],
	['natuerliche', 'natürliche'],
	['natuerlich', 'natürlich'],
	['Natuerlich', 'Natürlich'],
	['traegt', 'trägt'],
	['Traegt', 'Trägt'],
	['Stueckauswahl', 'Stückauswahl'],
	['Wunschstuecke', 'Wunschstücke'],
	['Wunschstueck', 'Wunschstück'],
	['Stueckliste', 'Stückliste'],
	['Stuecke', 'Stücke'],
	['Stueck', 'Stück'],
	['Einschaetzung', 'Einschätzung'],
	['einschaetzung', 'einschätzung'],
	['Der Suchintent dreht sich', 'Die Anfrage dreht sich'],
	['der Suchintent dreht sich', 'die Anfrage dreht sich'],
	['Der Anfrage ist', 'Die Anfrage ist'],
	['der Anfrage ist', 'die Anfrage ist'],
	['Der Anfrage liegt', 'Die Anfrage liegt'],
	['der Anfrage liegt', 'die Anfrage liegt'],
	['Der Anfrage fragt', 'Die Anfrage fragt'],
	['der Anfrage fragt', 'die Anfrage fragt'],
	['Suchintentionen', 'Anfragen'],
	['Suchintention', 'Einordnung'],
	['Suchintent', 'Anfrage'],
	['Rueckmeldung', 'Rückmeldung'],
	['Rueckblick', 'Rückblick'],
	['Rueckkehr', 'Rückkehr'],
	['Ruecksprache', 'Rücksprache'],
	['Raumgroesse', 'Raumgröße'],
	['Groesse', 'Größe'],
	['groessere', 'größere'],
	['grosser', 'großer'],
	['grossen', 'großen'],
	['grosse', 'große'],
	['gross', 'groß'],
	['aehnliche', 'ähnliche'],
	['aehnlich', 'ähnlich'],
	['aeusseren', 'äußeren'],
	['schaetzen', 'schätzen'],
	['schaetzt', 'schätzt'],
	['erklaeren', 'erklären'],
	['erklaerte', 'erklärte'],
	['erklaerung', 'erklärung'],
	['zaehlen', 'zählen'],
	['zaehlt', 'zählt'],
	['Lautstaerke', 'Lautstärke'],
	['lautstaerke', 'lautstärke'],
	['Übergaenge', 'Übergänge'],
	['Übergange', 'Übergänge'],
	['haengt', 'hängt'],
	['haengen', 'hängen'],
	['laeuft', 'läuft'],
	['laesst', 'lässt'],
	['paedagogisch', 'pädagogisch'],
	['Paedagogisch', 'Pädagogisch'],
	['Oeffnung', 'Öffnung'],
	['oeffentlich', 'öffentlich'],
];

function normalizeGermanCopy(value, key = '') {
	if (typeof value === 'string') {
		if (COPY_NORMALIZE_SKIP_KEYS.has(key)) return value;
		return GERMAN_COPY_REPLACEMENTS.reduce((text, [from, to]) => text.replaceAll(from, to), value);
	}
	if (Array.isArray(value)) return value.map((item) => normalizeGermanCopy(item, key));
	if (value && typeof value === 'object') {
		for (const [childKey, childValue] of Object.entries(value)) {
			value[childKey] = normalizeGermanCopy(childValue, childKey);
		}
	}
	return value;
}

const SERVICE = {
	hochzeiten: {
		name: 'Hochzeitsmusik',
		moments: 'Einzug, Ringtausch, Ja-Wort, Auszug, Empfang und Dinner brauchen jeweils eine andere Lautstaerke und einen anderen musikalischen Atem.',
		logic: 'bei Hochzeiten geht es um Dramaturgie, Wege, Emotion und die Frage, wann Musik den Moment groesser macht und wann sie sich zuruecknimmt',
		request: 'Zeremonieform, Trauort, Ablaufpunkte, Wunschlied, Gaestezahl und die Frage, ob nach der Trauung Empfangsmusik geplant ist',
	},
	beerdigungen: {
		name: 'Trauermusik',
		moments: 'Beginn, Erinnerungsrede, stiller Zwischenmoment, Auszug und ein moeglicher Einsatz am Grab muessen sehr ruhig aufeinander abgestimmt sein.',
		logic: 'bei Abschieden geht es um Halt, Timing, Wuerde und darum, Angehoerige organisatorisch zu entlasten',
		request: 'Datum, Uhrzeit, Trauerort, Ablauf, Wunschstuecke und die Information, ob Musik auch draussen oder am Grab gewuenscht ist',
	},
	firmenfeiern: {
		name: 'Live-Musik fuer Firmenevents',
		moments: 'Empfang, Rede, Dinner, Networking, Produktmoment und Ausklang brauchen unterschiedliche Sichtbarkeit der Musik.',
		logic: 'bei Firmenfeiern zaehlen Repraesentation, Lautstaerke, Gaesteprofil, Markenwirkung und ein Ablauf ohne Reibung',
		request: 'Eventformat, Location, Gaestezahl, Zeitfenster, Reden, Dinnerablauf und die gewuenschte Rolle der Musik',
	},
	geburtstage: {
		name: 'Live-Musik zum Geburtstag',
		moments: 'Ankommen, Wunschlied, Ueberraschung, Dinner, Gratulation und Ausklang funktionieren besser in kurzen, klar gesetzten Sets.',
		logic: 'bei Geburtstagen steht die gefeierte Person im Mittelpunkt, nicht ein Konzertprogramm ohne Bezug zur Runde',
		request: 'Datum, Ort, Alter oder Anlass, Gaestezahl, Wunschlied, Ueberraschungsmoment und die geplante Setlaenge',
	},
	taufen: {
		name: 'Taufmusik',
		moments: 'Einzug, Lesung, Taufhandlung, Segnung, Kommunionbezug, Auszug und Familienfeier brauchen eine sanfte Reihenfolge.',
		logic: 'bei Taufen geht es um Kirche, Familie, Kind, Ritual und eine Musik, die hell bleibt, ohne den Gottesdienst zu ueberladen',
		request: 'Kirche oder Feierort, Ablauf, gewuenschte Stuecke, Familienmoment, Patenbezug und moegliche Musik nach dem Gottesdienst',
	},
	konzerte: {
		name: 'Viola-Konzert',
		moments: 'Auftakt, Moderation, Lesung, Vernissage, Salonmoment, Pause und Ausklang brauchen einen klaren Spannungsbogen.',
		logic: 'bei Konzerten und Kulturformaten zaehlen Raumklang, Aufmerksamkeit, Thema, Programmlaenge und die Balance zwischen Kunst und Begegnung',
		request: 'Format, Raum, Publikum, Programmlaenge, Moderation, thematischer Anlass und moegliche Wunschstuecke',
	},
	unterricht: {
		name: 'Bratschenunterricht',
		moments: 'Probestunde, Haltung, Bogen, Tonbildung, Notenlesen, Uebeplan und Wiedereinstieg brauchen ein realistisches Tempo.',
		logic: 'im Unterricht geht es um Lernrhythmus, Koerpergefuehl, Klang, Motivation und eine Form, die im Alltag wirklich tragfaehig ist',
		request: 'Lernstand, Alter, Ziel, bisheriges Instrument, Unterrichtsrhythmus, Uebezeit und moegliche Probestunde',
	},
};

const LOCATION = {
	aachen: ['Aachen', 'Altstadt, Domnaehe, Hochschule, Dreilaendereck und historische Saele', 'weitere Anfahrt, Einlasszeit und Akustik in aelteren Raeumen', 'ein Publikum aus Familie, Kulturinteresse, Wissenschaft und internationalen Gaesten'],
	'bergisch-gladbach': ['Bergisch Gladbach', 'Bensberg, bergische Villen, Koelner Naehe, Galerien und ruhige Restaurants', 'Zufahrt, Parken und Wechsel zwischen Empfang, Rede und Musik', 'Gaeste mit Sinn fuer elegante, aber persoenliche Formate'],
	'bergisches-land': ['Bergisches Land', 'Hoehenlagen, Gutshoefer, Fachwerk, Kirchen, Villen und gruene Aussenbereiche', 'Wetteroption, Wege, Untergrund und geschuetzte Position fuer das Instrument', 'Menschen, die Naehe, Natur und kammermusikalische Ruhe schaetzen'],
	bielefeld: ['Bielefeld', 'Sparrenburg, Altstadt, Hochschulumfeld, ostwestfaelische Saele und private Kulturorte', 'laengere Fahrzeit, klare Zeitfenster und ein ruhiger Aufbau', 'aufmerksame Gaeste, die gut erklaerte und nicht ueberladene Programme moegen'],
	bochum: ['Bochum', 'Bermuda3Eck, Theaternaehe, Industriegeschichte, Stadtteile und direkte Ruhrgebietskultur', 'mehrere Eingange, Licht, Ladeweg und ein klares Startsignal', 'ein offenes Publikum, das persoenliche Ansprache und warmen Klang mag'],
	bonn: ['Bonn', 'Rheinlage, Villen, Museen, Verbandsorte, Wissenschaft und internationale Gaeste', 'Innenstadtlogistik, Tagungswechsel und ein realistischer Puffer vor dem ersten Ton', 'konzentrierte, oft mehrsprachige Gaeste mit Sinn fuer feine Programme'],
	bottrop: ['Bottrop', 'westliches Ruhrgebiet, persoenliche Saele, Restaurants und unkomplizierte Empfangsorte', 'kompakter Aufbau, klare Kontaktperson und kurze Wege', 'Gaeste, die Naehe, Wertschaetzung und einen bodenstaendigen Ton bevorzugen'],
	dormagen: ['Dormagen', 'Zons, Knechtsteden, Rheinorte, Hoefe und die Lage zwischen Koeln und Duesseldorf', 'Treffpunkt, Anfahrt aus zwei Richtungen und Wechsel zwischen drinnen und draussen', 'regionale Runden, die historische Orte und persoenliche Musik verbinden'],
	dortmund: ['Dortmund', 'Phoenixsee, moderne Eventflaechen, Dortmunder U, Kulturorte und oestliches Ruhrgebiet', 'weite Wege in Locations, Sitzordnung, Licht und Abstimmung mit Reden', 'direkte, gemischte Gaeste, die klare Dramaturgie schaetzen'],
	duesseldorf: ['Duesseldorf', 'Rhein, Benrath, Kaiserswerth, Flingern, Messe, Hotels und Galerien', 'Innenstadtverkehr, Ladezone, Aufzug, Einlass und kurze Wege zwischen Programmpunkten', 'Gaeste, die hochwertige Wirkung ohne Ueberinszenierung erwarten'],
	duisburg: ['Duisburg', 'Innenhafen, Rhein, Industriegeschichte, Stadtteile und robuste Kulturraeume', 'Parkflaechen, Eingangswege und ein gut erkennbarer Einsatzpunkt', 'Menschen, die klare, warme und nicht zu akademische Musik bevorzugen'],
	erkrath: ['Erkrath', 'Hochdahl, Unterfeldhaus, Neandertalnaehe, gruene Orte und Duesseldorfer Naehe', 'Aussenoption, Wetterschutz, kurzer Aufbau und guter Sichtkontakt', 'kleinere Runden, die Musik nah und persoenlich erleben wollen'],
	essen: ['Essen', 'Ruettenscheid, Baldeneysee, Villa Huegel, Konzernstandorte und zentrale Ruhrgebietslage', 'Stadtverkehr, Locationzugang und Puffer vor Reden oder Zeremonie', 'unternehmerische, private oder kulturinteressierte Gaeste mit hohem Qualitaetsanspruch'],
	gelsenkirchen: ['Gelsenkirchen', 'lokale Saele, Ruhrgebietskultur, persoenliche Feiern und offizielle Empfangsformate', 'Parken, Raumzugang und eindeutiger erster Einsatz', 'Gaeste, die einen ehrlichen Live-Moment statt grosser Geste suchen'],
	haan: ['Haan', 'Gartenstadt-Charakter, kurze Wege, private Haeuser und Lage zwischen Duesseldorf und Wuppertal', 'kompakter Aufbau, Licht und ein abgestimmtes Zeichen der Gastgeberperson', 'ueberschaubare Runden mit grosser Naehe zur Musik'],
	hagen: ['Hagen', 'Volme, Sauerlandnaehe, Kulturorte, gruenere Randlagen und regionales Publikum', 'Wetteroptionen, Anreise und ein genauer Aufbauplatz', 'Gaeste, die ruhige Boegen und natuerliche Moderation moegen'],
	heiligenhaus: ['Heiligenhaus', 'kleinere Kulturorte, Eroeffnungen, private Raeume und Lage zwischen Ratingen und Velbert', 'Zugang, Licht, Wetterschutz und eine kurze Ablaufkontaktperson', 'Menschen, die eine schlanke, hochwertige Loesung suchen'],
	herne: ['Herne', 'zentrale Ruhrgebietslage, kompakte Veranstaltungsorte und persoenliche Kulturformate', 'Timing, Eingang und Einsatzpunkt, weil viele Ablaeufe dicht geplant sind', 'Gaeste, die direkte Ansprache und warme Uebergaenge schaetzen'],
	hilden: ['Hilden', 'Innenstadt, kurze Wege, Naehe zu Solingen, Duesseldorf und Langenfeld', 'Raumgroesse, Startsignal, Licht und Uebergang zu Reden oder Empfang', 'regionale Gaeste, die Musik als bewusst gesetzten Akzent wahrnehmen'],
	iserlohn: ['Iserlohn', 'Sauerlandnaehe, Mittelstand, gruenere Lagen und regionale Kulturabende', 'laengere Wege, Wetteroptionen und Konzentration vor dem Start', 'ein Publikum, das natuerliche Ruhe und nachvollziehbare Boegen mag'],
	koeln: ['Koeln', 'Rhein, Veedel, Medien, Messe, Galerien und lebendige Gastronomie', 'Parken, Ladeweg, dichte Stadtlage und flexible Reaktion auf Gespraeche', 'kommunikative Gaeste, die Zugaenglichkeit und Leichtigkeit erwarten'],
	krefeld: ['Krefeld', 'Niederrhein, Stadtwald, Villen, Textiltradition und gepflegte private Raeume', 'Raumgroesse, Lautstaerke und ein ruhiger Platz fuer das Instrument', 'Gaeste mit Sinn fuer einen kultivierten und unaufdringlichen Ton'],
	'kreis-mettmann': ['Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert, Wuelrath und mehrere kleinere Kulturorte', 'Stadtgrenzen, genaue Adresse, Fahrzeit und realistische Uebergaenge', 'regional gemischte Gaeste, die lokale Klarheit statt Grossstadt-Schablone brauchen'],
	langenfeld: ['Langenfeld', 'Mitte zwischen Duesseldorf, Leverkusen und Monheim, gut erreichbare Feierraeume', 'Parken, kompakte Setdauer und sauberer Start ohne Leerlauf', 'Gaeste aus mehreren Nachbarstaedten mit praktischer Erwartung an den Ablauf'],
	leverkusen: ['Leverkusen', 'Opladen, Schlebusch, Rheinlage, Industrieumfeld und Verbindung nach Koeln und ins Bergische', 'Stadtteilwege, Einlass und moegliche Sicherheitsabstimmungen', 'gemischte private, geschaeftliche und kulturorientierte Runden'],
	meerbusch: ['Meerbusch', 'Büderich, Osterath, elegante private Raeume und unmittelbare Duesseldorfer Naehe', 'ruhiger Aufbau, Position im Raum und puenktlicher Beginn', 'Gaeste, die diskreten, gepflegten und warmen Klang erwarten'],
	mettmann: ['Mettmann', 'Neandertalnaehe, Kreisstadt, kleinere Saele und regionale Bindung', 'Kontaktperson, Licht, Startsignal und ueberschaubare Wege', 'Gaeste, die persoenliche Bezuge und kurze Erklaerungen schaetzen'],
	moenchengladbach: ['Moenchengladbach', 'Rheydt, Wickrath, Niederrhein, Parks und breite regionale Einzugsgebiete', 'groessere Stadtteilwege und ein klarer Moment fuer den Einsatz', 'generationsgemischte Runden mit Offenheit fuer persoenliche Musik'],
	moers: ['Moers', 'Schlossnaehe, Niederrhein, Stadtpark, Kulturorte und Verbindung nach Duisburg', 'Wetterschutz, Untergrund, Anfahrt und Naehe zum Publikum', 'entspannte, aufmerksame Gaeste, die keinen ueberdimensionierten Rahmen brauchen'],
	'monheim-am-rhein': ['Monheim am Rhein', 'Rheinpromenade, Baumberg, Altstadt und Lage zwischen Duesseldorf und Leverkusen', 'Rheinwetter, Innenoption und Wechsel zwischen Empfang und Programm', 'regionale Gaeste, die helle, zugängliche Live-Musik moegen'],
	'muelheim-an-der-ruhr': ['Muelheim an der Ruhr', 'Ruhrlage, Broich, Saarn, gruenere Orte und gute Erreichbarkeit im Ruhrgebiet', 'Parken, Raumzugang und ein Ablauf, der nicht zu breit geplant wird', 'private oder geschaeftliche Runden mit Sinn fuer ruhige Eleganz'],
	muenster: ['Muenster', 'Prinzipalmarkt, Aasee, Hochschulstadt, Kulturorte und westfaelische Klarheit', 'Anfahrt, Einlasszeit und ein gut strukturierter Aufbau', 'aufmerksame Gaeste, die klare Form und gute Erklaerung moegen'],
	neuss: ['Neuss', 'Quirinus, Rheinnaehe, Hafen, Stadthalle und direkte Duesseldorfer Nachbarschaft', 'Zufahrt, Parken und kurze Wechsel zwischen Ortsteilen', 'regionale Runden, die warmen Klang ohne viel Technik schaetzen'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land, Westfalen und sehr unterschiedliche Raumtypen', 'Fahrzeit, regionale Abstimmung und realistische Puffer zwischen Terminen', 'Gaeste mit sehr unterschiedlichen Erwartungen an Form, Naehe und Repraesentation'],
	oberhausen: ['Oberhausen', 'Centro-Naehe, Ruhrgebiet, Gasometer, Restaurants und flexible Eventflaechen', 'Parken, Einlass, Raumgroesse und Lautstaerke in lebendigen Umgebungen', 'Gaeste, die einen klaren, freundlichen Live-Akzent moegen'],
	paderborn: ['Paderborn', 'Innenstadt, Domnaehe, Hochschulumfeld, ostwestfaelische Orte und weitere Anfahrt', 'Zeitpuffer, klare Kontaktperson und genauer Aufbauplatz', 'Gaeste, die konzentrierte, gut vorbereitete Musik schaetzen'],
	ratingen: ['Ratingen', 'Lintorf, Hoesel, Kaiserswerther Naehe, Hotels und ruhige private Raeume', 'Anfahrt, Aufzug, Parken und ein sauberer Wechsel zwischen Programmpunkten', 'Gaeste, die eine elegante, aber entspannte Loesung erwarten'],
	recklinghausen: ['Recklinghausen', 'Vest, Altstadt, Ruhrfestspielnaehe und regionale Veranstaltungsorte', 'Anreise, Saalzugang und klare Zeitfenster', 'Gaeste mit Sinn fuer einen direkten, warmen und nicht ueberladenen Rahmen'],
	remscheid: ['Remscheid', 'bergische Hoehen, Stadtteile, Werkzeugstadt-Charakter und Naehe zu Wuppertal und Solingen', 'Wege, Wetter, Steigungen und ein geschuetzter Platz fuer das Instrument', 'Menschen, die Musik nahbar und handwerklich sorgfaeltig erleben wollen'],
	'rhein-kreis-neuss': ['Rhein-Kreis Neuss', 'Neuss, Dormagen, Meerbusch, Grevenbroich, Rheinorte und Duesseldorfer Naehe', 'mehrere Stadtgrenzen, Fahrzeit und exakte Adresse', 'regionale Gaeste, die verbindende Musik zwischen Stadt und Rhein suchen'],
	'rhein-ruhr': ['Rhein-Ruhr', 'Rheinland, Ruhrgebiet, Messeorte, Hotels und sehr unterschiedliche Eventraeume', 'Entfernungen, Verkehrsfenster, Puffer und Abstimmung mit mehreren Beteiligten', 'gemischte Gaeste aus Stadt, Unternehmen, Familie und Kultur'],
	rheinland: ['Rheinland', 'Rheinorte, Koeln, Duesseldorf, Bonn, Neuss und offene Begegnungsformate', 'Fahrwege, Stadtlage, Wetter und die Balance zwischen Lockerheit und Form', 'Gaeste, die Musik lebendig, herzlich und trotzdem fein dosiert moegen'],
	ruhrgebiet: ['Ruhrgebiet', 'Industriekultur, direkte Saele, lebendige Innenstaedte und kurze Wege zwischen Staedten', 'Parken, Eingangssituation, Lautstaerke und eine klare Ablaufkommunikation', 'Menschen, die ehrliche Live-Musik ohne steife Buehne bevorzugen'],
	siegen: ['Siegen', 'Huegellage, Oberstadt, Siegerland, weitere Anfahrt und regionale Kulturorte', 'Wetter, Fahrzeit, Wege und ein ruhiger Aufbau', 'Gaeste, die persoenliche Programme mit landschaftlicher Ruhe moegen'],
	solingen: ['Solingen', 'Gräfrath, Klingenstadt, bergische Wege und Naehe zu Haan, Wuppertal und Remscheid', 'Steigungen, Parken, Wetterschutz und kurze Abstimmung vor Ort', 'Gaeste, die einen klaren, warmen und bodenstaendigen Ton schaetzen'],
	unna: ['Unna', 'Hellweg, oestliches Ruhrgebiet, regionale Saele und gut erreichbare Feierraeume', 'Anfahrt, Zeitfenster, Raumzugang und kompakte Setplanung', 'Gaeste, die einen freundlichen, strukturierten Musikrahmen moegen'],
	velbert: ['Velbert', 'Neviges, Langenberg, bergische Hoehen und private Veranstaltungsorte', 'Wege, Wetter, Parken und ein geschuetzter Platz', 'Runden, die Musik ruhig, persoenlich und nicht zu gross inszeniert erleben wollen'],
	wuelfrath: ['Wuelfrath', 'bergische Naehe, kurze Wege, kleine Kulturorte und ueberschaubare Runden', 'Licht, ruhiger Aufbau und ein klarer erster Einsatz', 'Gaeste, die Intensitaet gerade in kleiner Form erleben'],
	wuppertal: ['Wuppertal', 'Elberfeld, Barmen, Hoehenlagen, Altbauorte und Raeume entlang der Wupper', 'Treppen, Parken, Wege, Wetter und ein beweglicher Aufbau', 'kulturinteressierte Gaeste mit Sinn fuer atmosphaerische Programme'],
};

const TERM_LENS = {
	brautpaar: ['Beziehung, Blickkontakt, gemeinsame Geschichte, ein musikalischer Mittelpunkt', 'Wunschlied, Sitzordnung, Wege, persoenlicher Bezug', 'nicht nur Gaesteunterhaltung planen'],
	geburtstag: ['gefeierte Person, Ueberraschung, Gratulation, vertraute Runde', 'Timing, Wunschlied, Setlaenge, geheimer Einsatz', 'nicht wie eine allgemeine Abendbegleitung wirken'],
	hochzeit: ['Zeremonie, Empfang, Familie, Emotion, festlicher Ablauf', 'Trauort, Wege, Wunschmusik, Gaestezahl, Uebergang zum Empfang', 'nicht jeden Moment gleich stark bespielen'],
	hochzeitsdinner: ['Dinner, Tischgespraeche, Reden, warme Begleitung, festlicher Abend', 'Gange, Servicewege, Toasts, Lautstaerke, Setpausen', 'nicht den Raum wie ein Konzert bespielen'],
	hochzeitsfeier: ['Feier, Gratulation, Tanznaehe, Dinner, gemeinsame Stimmung', 'Ablauf nach der Trauung, Reden, Empfang, Raumwechsel, Lautstaerke', 'nicht mit der eigentlichen Trauung verwechseln'],
	hochzeitsempfang: ['Gratulation, Ankommen, Glaeser, Gespraeche, lockerer Uebergang', 'Aussenbereich, Setlaenge, Wege, Wetter, flexible Pausen', 'nicht denselben Ton wie beim Einzug behalten'],
	hochzeitszeremonie: ['Trauversprechen, Rituale, Einzug, Ringmoment, konzentrierte Aufmerksamkeit', 'Startsignal, Ablaufpunkte, Wunschlied, Raum, Zeremonieform', 'nicht als reine Hintergrundmusik planen'],
	kirche: ['Kirchenraum, Nachhall, Liturgie, festliche Ruhe, Orgelbezug', 'Absprache mit Pfarramt, Akustik, Einsatzstellen, Einzug, Auszug', 'nicht wie einen freien Aussenort behandeln'],
	musik: ['musikalischer Rahmen, Anlass, Wirkung, Stueckauswahl, Ablauf', 'Dauer, Position, Lautstaerke, Wunschstuecke, Uebergange', 'nicht zu allgemein bleiben'],
	private: ['private Naehe, Familie, Freunde, persoenliche Geschichten, vertrauter Raum', 'Gastgeberperson, Zeitfenster, Wunschlied, Ueberraschung, Raumgroesse', 'nicht zu offiziell oder buehnenhaft auftreten'],
	abschied: ['ruhiger Halt, letzter Weg, Erinnerung, stille Rituale', 'wenige Einsaetze, langsamer Atem, deutliche Pausen', 'nicht dramatisieren, sondern tragen'],
	auszug: ['heller Schluss, gemeinsamer Schritt, Bewegung, Loesung', 'Timing am Ausgang, Jubel, Gratulation, Raumwechsel', 'nicht zu schwer werden'],
	anfaenger: ['erster Ton, Orientierung, Geduld, kleine Erfolgserlebnisse', 'Haltung, Bogenweg, Notenlesen, kurze Uebeziele', 'nicht zu schnell zu viele Stuecke stapeln'],
	beerdigung: ['Trauerhalle, Kapelle, Auszug, Friedhofsweg, Wuerde', 'zwei bis vier Einsaetze, klare Abstimmung, wetterfeste Planung', 'keine Konzertwirkung erzwingen'],
	bestattung: ['formeller Ablauf, Friedhof, Ansprechpartner, Abschiedsritual', 'kurze Signale, exakte Reihenfolge, Zusammenarbeit mit Bestattungshaus', 'keine laute Begleitung ueber Worte legen'],
	brauteinzug: ['Weg der Braut, Blickachsen, Atem, Beginn der Zeremonie', 'Tempo, Startzeichen, Laenge des Weges, wiederholbare Phrasen', 'nicht zu frueh enden'],
	bratsche: ['warme Mittellage, satter Bogen, dunklere Farbe, Naehe zur Stimme', 'Tonbildung, Resonanz, ruhige Artikulation, tragende Melodielinie', 'nicht wie helle Violine formulieren'],
	bratschistin: ['Person, Instrument, Auftritt, Verlaesslichkeit, solistische Verantwortung', 'Position im Raum, Repertoire, Moderation, feine Kommunikation', 'nicht als austauschbare Musikerin beschreiben'],
	buchen: ['Entscheidung, Verfuegbarkeit, Angebot, Kostenrahmen, Planungssicherheit', 'Termin, Ort, Dauer, Ablauf, Rueckmeldung, naechster Schritt', 'nicht nur Repertoire auflisten'],
	business: ['Empfang, Networking, Marke, Professionalitaet, dezente Wertigkeit', 'Lautstaerke, Reden, Zeitfenster, Gaestefluss, Raumakustik', 'nicht zu konzertant auftreten'],
	dezente: ['Zurueckhaltung, Gespraechsraum, leiser Glanz, unaufdringliche Eleganz', 'kurze Sets, Lautstaerke, Pausen, Position am Rand', 'nicht die Hauptrolle suchen'],
	dinner: ['Tischgespraeche, Gaenge, Toasts, warme Atmosphaere', 'Sets zwischen Gaengen, Blickkontakt zum Service, moderate Lautstaerke', 'nicht dauerhaft durchspielen'],
	dinnermusik: ['Essensrhythmus, Menuepausen, Servicewege, leise Kontinuitaet', 'Setlaengen, Uebergang zu Reden, Klangbalance im Raum', 'nicht Tischgespraeche ueberdecken'],
	elegante: ['klare Linie, wertiger Klang, reduzierter Auftritt, feine Auswahl', 'Raumwirkung, Kleidung, Timing, ruhiger Aufbau', 'nicht dekorativ ueberfrachten'],
	emotionale: ['Beruehrung, persoenliche Erinnerung, Traenen, Geluebde, leiser Atem', 'Wunschlied, Ringmoment, Rede, innere Spannung', 'nicht sentimental ueberzeichnen'],
	empfangsmusik: ['Ankommen, Begruessung, Gespraeche, leichte Orientierung', 'modulare Sets, Laufwege, Lautstaerke, flexible Pausen', 'nicht wie ein sitzendes Konzert wirken'],
	eroeffnung: ['Auftakt, Aufmerksamkeit, erster Eindruck, offizieller Moment', 'kurzes Signal, Redeuebergang, Platzierung, Startzeit', 'nicht den eigentlichen Anlass verdecken'],
	event: ['Ablauf, Gaestefluss, Markenbild, Raumenergie, flexible Rollen', 'Setplanung, Reden, Technik, Wege, Programmpunkte', 'nicht pauschal als Hintergrundmusik behandeln'],
	familienfeier: ['Generationentisch, persoenliche Runde, warme Wiedererkennung', 'Wunschstuecke, kurze Einsaetze, Gespraechspausen', 'nicht zu formal werden'],
	firmenevent: ['Unternehmen, Empfang, Repraesentation, Gaesteprofil, Ablaufdisziplin', 'Briefing, Kontaktperson, Zeitfenster, Reden, Branding', 'nicht unkoordiniert in Programmpunkte hineinspielen'],
	firmenfeier: ['Team, Jahresabschluss, Jubilaeum, Dank, gemeinsamer Abend', 'Dinner, Rede, Empfang, Ausklang, Lautstaerke', 'nicht zu steif klingen'],
	firmenempfang: ['Begruessung, Kundinnen, Partner, Foyer, erster Eindruck', 'kurze Sets, Bewegung im Raum, dezente Praesenz', 'nicht Gespraeche blockieren'],
	freie: ['persoenliche Zeremonie, eigene Texte, Rituale, flexibler Ort', 'Startzeichen, Traubogen, Wetter, Moderation, Wunschmusik', 'nicht wie Kirchenablauf behandeln'],
	gala: ['Abendkleid, Buehne, Empfang, Dinner, festliche Dramaturgie', 'Einsatzpunkte, Licht, Reden, Service, formaler Rahmen', 'nicht zu klein planen'],
	gartenfeier: ['draussen, Sommerlicht, Wetter, lockere Wege, private Naehe', 'Wetterschutz, Untergrund, Schatten, Nachbarn, Innenoption', 'nicht ohne Plan B ansetzen'],
	gartenfest: ['freie Bewegung, Stehtische, Gartenwege, ungezwungene Stimmung', 'kurze Sets, wetterfeste Position, flexible Pausen', 'nicht gegen Gespraeche anspielen'],
	geige: ['heller Streicherklang, bekannte Melodiefuehrung, klare Hoehe', 'Tonart, Arrangement, Balance zur Viola, Erwartung an Violine', 'nicht falsche Instrumentenversprechen machen'],
	geigerin: ['klassische Erwartung, Soloauftritt, heller Klang, Wunschlied', 'Instrumentenbezeichnung, Repertoire, Raumakustik, Anlass', 'nicht Bratschenklang verschweigen'],
	geschenk: ['Ueberraschung, persoenliche Geste, kurzer Mittelpunkt, Erinnerung', 'geheimer Ablauf, Vertrauensperson, Wunschlied, Timing', 'nicht zu lang ausdehnen'],
	gottesdienst: ['Liturgie, Lesung, Segen, Gemeindegesang, ruhige Ordnung', 'Absprache mit Kirche, Pfarrer, Organist, Einsatzstellen', 'nicht in liturgische Worte hineinspielen'],
	hintergrundmusik: ['Gespraeche, dezente Farbe, Raeume fuellen, unaufdringlich bleiben', 'Lautstaerke, Setpausen, Position, Gaestebewegung', 'nicht Aufmerksamkeit erzwingen'],
	instrumentalmusik: ['Melodie ohne Text, klare Linie, Arrangement, Klangfarbe', 'Tonart, Tragfaehigkeit, Wiedererkennbarkeit, Bogenfuehrung', 'nicht wie Gesangstitel eins zu eins behandeln'],
	ja: ['Versprechen, Blick, kurzer Atem, konzentrierte Stille', 'sehr leiser Einsatz, Timing, Pause vor Worten', 'nicht zu breit anlegen'],
	jubilaeum: ['Rueckblick, Dank, offizieller Rahmen, Generationen, Wertschaetzung', 'Reden, Empfang, Dinner, persoenlicher Akzent', 'nicht beliebig feierlich bleiben'],
	kinder: ['spielerischer Einstieg, Konzentration, kurze Aufgaben, positive Routine', 'Bilder, Wiederholung, Elternkommunikation, passende Instrumentengroesse', 'nicht erwachsene Uebeziele uebertragen'],
	kirchliche: ['Kirchenraum, Liturgie, Segen, Orgelbezug, feierlicher Nachhall', 'Absprache mit Pfarramt, Akustik, Einzug, Auszug', 'nicht freie Zeremonie kopieren'],
	klassische: ['Bach, Massenet, klare Form, ruhiger Stil, zeitlose Wirkung', 'Auswahl, Tonart, Akustik, konzentrierte Aufmerksamkeit', 'nicht beliebige Eventmusik nennen'],
	kommunion: ['Familie, Kirche, Kind, Festtag, Gemeinde', 'Gottesdienst, Segen, Auszug, Familienfeier', 'nicht mit Taufe gleichsetzen'],
	konfirmation: ['Jugendliche, Bekenntnis, Familie, Gottesdienst, Uebergang', 'Kirchenablauf, Wunschmusik, Familienmoment', 'nicht zu kindlich formulieren'],
	konzert: ['Zuhören, Bogen, Programm, Stille, Schlusswirkung', 'Dauer, Moderation, Sitzordnung, Raumakustik', 'nicht als reine Begleitung verkaufen'],
	kundenempfang: ['Gäste, Beziehungspflege, Foyer, hochwertige Begruessung', 'Lautstaerke, Reden, Gespraechsfluss, Markenwirkung', 'nicht aufdringlich werden'],
	kulturabend: ['Thema, Gespraech, Text, Kunst, musikalischer Faden', 'Uebergaenge, Moderation, Blocklaengen, Schluss', 'nicht nur Konzertprogramm sein'],
	lernen: ['Aufbau, Wiederholung, Koerpergefuehl, kleine Fortschritte', 'Uebeplan, Technik, Klang, Geduld, naechstes Ziel', 'nicht mit Leistungsdruck starten'],
	lesung: ['Text, Sprache, Atem, Zwischenraum, literarischer Ton', 'kurze Inseln, Licht, Mikrofon, Pausen', 'nicht den Text kommentierend ueberladen'],
	live: ['im Raum entstehender Klang, Reaktion, Flexibilitaet, echte Praesenz', 'Startsignal, Dauer, Lautstaerke, Anpassung', 'nicht wie Playlist beschreiben'],
	messe: ['Stand, Besucherfluss, Produktpraesentation, Businessgespraeche', 'kurze Sets, Lautstaerke, Laufwege, Hallenregeln', 'nicht wie Abendgala planen'],
	moderne: ['aktuelle Melodien, reduzierte Bearbeitung, persoenlicher Bezug', 'Arrangement, Tonart, Wiedererkennbarkeit, Stilbruch vermeiden', 'nicht beliebig poppig werden'],
	musikerin: ['Ansprechperson, Planung, Auftritt, musikalische Verantwortung', 'Kommunikation, Repertoire, Platzierung, Timing', 'nicht nur Instrument nennen'],
	musikunterricht: ['Lernmethode, Klangarbeit, Struktur, persoenlicher Rhythmus', 'Probestunde, Uebeplan, Noten, Technik, Motivation', 'nicht als starres Kursangebot schreiben'],
	networking: ['Gespraeche, lockerer Fluss, Kontakte, Empfangsatmosphaere', 'Lautstaerke, kurze Sets, Pausen, Raumachsen', 'nicht die Gespräche dominieren'],
	produktpraesentation: ['Fokus, Inszenierung, Markenmoment, Aufmerksamkeit', 'Auftakt, Reveal, Rede, Timing, Lautstaerke', 'nicht vom Produkt ablenken'],
	repertoire: ['Stueckauswahl, Stilbreite, Lieblingslied, passende Reihenfolge', 'Tonart, Anlass, Bearbeitung, dramaturgischer Platz', 'nicht Buchungsfragen in den Vordergrund stellen'],
	ringtausch: ['Haende, Ringe, Blick, leiser Mittelpunkt, ruhige Zeit', 'dezente Musik, flexible Laenge, Start- und Endzeichen', 'nicht zu dominant werden'],
	romantische: ['Zweisamkeit, warme Linie, Abendlicht, feiner Schwung, Eleganz', 'Einzug, Paarklang, Lieblingsmelodie, weicher Auszug', 'nicht mit Traurigkeit verwechseln'],
	salonkonzert: ['kleiner Raum, Publikumnaehe, Moderation, kammermusikalisches Gespraech', 'Dauer, Pause, Stueckfolge, Sitzordnung', 'nicht wie grosser Saal auftreten'],
	sanfte: ['hell, ruhig, behutsam, kindnah, warm', 'leise Dynamik, einfache Linien, Liturgie, Familienmoment', 'nicht zu dramatisch werden'],
	segnung: ['Segen, Ritual, kurze Stille, Familie, Zuversicht', 'Einsatzstelle, Textnaehe, Gottesdienstabstimmung', 'nicht als beliebiges Zwischenstueck setzen'],
	sektempfang: ['Gratulation, Ankommen, Glaeser, Gespraeche, leichte Bewegung', 'kurze Sets, Lautstaerke, flexible Pausen, Aussenoption', 'nicht Zeremonieklang fortsetzen'],
	solo: ['eine Musikerin, klare Verantwortung, schlanker Aufbau, persoenlicher Klang', 'Raumposition, Stueckauswahl, Dynamik, Tragfaehigkeit', 'nicht Ensemblewirkung versprechen'],
	standesamt: ['Trauzimmer, kurze Wege, Unterschrift, enger Zeitplan', 'Einzug, Ringtausch, Auszug, Auf- und Abbau', 'nicht Kirchenlaenge erwarten'],
	streichmusik: ['Saitenklang, Bogen, klassischer Bezug, warme Textur', 'Instrumentenfarbe, Arrangement, Raumklang, Anlass', 'nicht nur als Hintergrund verstehen'],
	taufe: ['Kind, Familie, Segen, heller Anfang, Kirchenraum', 'Taufhandlung, Lesung, Auszug, Familienfeier', 'nicht zu konzertant gestalten'],
	trauerfeier: ['Rede, Stille, Erinnerung, Auszug, Familie', 'Abstimmung mit Bestattungshaus, Pfarramt, Rednerin, Timing', 'nicht die Worte ueberlagern'],
	trauermusik: ['Wuerde, Halt, Lieblingslied, letzte Erinnerung, ruhiger Klang', 'Einsatzstellen, Raum, Auszug, Grab, Kontaktperson', 'nicht als normale Eventmusik behandeln'],
	trauung: ['Zeremonie, Versprechen, Einzug, Ringmoment, Auszug', 'Startzeichen, Ablauf, Wunschlied, Raum, Wetter', 'nicht Empfangsmusik daraus machen'],
	ueberraschung: ['geheimer Moment, Blickkontakt, Emotion, kurze Wirkung', 'Kontaktperson, Timing, erstes Stueck, Position', 'nicht zu auffaellig vorbereiten'],
	unterricht: ['Lernbeziehung, Technik, Klang, Tempo, Vertrauen', 'Probestunde, Wochenrhythmus, Uebeplan, Ziele', 'nicht als Massenkurs formulieren'],
	unterschrift: ['kurze Ruhe, Dokument, leise Ueberbrueckung, Standesamt', 'flexible Laenge, Blickzeichen, dezenter Klang', 'nicht zu lang planen'],
	vernissage: ['Kunst, Blick, Gespraech, Raumwege, Eroeffnung', 'Rede, Einlass, Lautstaerke, Hängung, kurze Sets', 'nicht die Ausstellung uebertoenen'],
	viola: ['warmer Mittelklang, menschliche Farbe, seltene Naehe, dunklere Linie', 'Bogen, Resonanz, Arrangement, Raumklang', 'nicht wie Geige oder Cello beschreiben'],
	violinistin: ['heller Soloklang, klassische Erwartung, bekannte Melodien', 'Instrumentenfrage, Repertoire, Tonhoehe, Anlass', 'nicht die Bratsche unsichtbar machen'],
	wort: ['Versprechen, Sprache, Stille, kurzer Nachklang', 'leiser Einsatz, Pausen, Timing, Redefluss', 'nicht die Worte ueberdecken'],
};

function parseCsvLine(line) {
	const out = [];
	let cur = '';
	let quoted = false;
	for (let i = 0; i < line.length; i += 1) {
		const c = line[i];
		if (c === '"' && line[i + 1] === '"') {
			cur += '"';
			i += 1;
		} else if (c === '"') quoted = !quoted;
		else if (c === ',' && !quoted) {
			out.push(cur);
			cur = '';
		} else cur += c;
	}
	out.push(cur);
	return out;
}

function readTrackerRows() {
	const lines = readFileSync(TRACKER, 'utf8').trim().split(/\r?\n/);
	const headers = parseCsvLine(lines[0]);
	return lines.slice(1).map((line) => {
		const values = parseCsvLine(line);
		return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
	});
}

function titleCase(value) {
	return value
		.split(/[\s-]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function keywordCore(doc) {
	return String(doc.targetKeyword ?? '')
		.replace(/^(Hochzeitsmusik|Trauermusik|Live Musik Firmenevent|Live Musik Geburtstag|Taufmusik|Viola Konzert|Bratschenunterricht)\s+/i, '')
		.trim();
}

function serviceLabel(row) {
	return SERVICE[row.service]?.name ?? row.service;
}

function nearestSlug(row) {
	const match = String(row.nearest_template_url || row.nearest_keyword_url || '').match(/\/([^/]+)\/$/);
	return match ? titleCase(match[1].replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü')) : '';
}

function stableIndex(value, length) {
	if (!length) return 0;
	let hash = 0;
	for (const char of String(value)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return hash % length;
}

function withoutDuplicates(existing, additions) {
	const seen = new Set(existing.map((item) => normalizeGermanCopy(String(item).slice(0, 120))));
	return additions.filter((item) => {
		const key = normalizeGermanCopy(String(item).slice(0, 120));
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

function dedupeDocArrays(doc) {
	if (Array.isArray(doc.split?.paragraphs)) {
		const seen = new Set();
		doc.split.paragraphs = doc.split.paragraphs.filter((paragraph) => {
			const key = normalizeGermanCopy(String(paragraph).replace(/\s+/g, ' ').trim());
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
	if (Array.isArray(doc.faq?.items)) {
		const seen = new Set();
		doc.faq.items = doc.faq.items.filter((item) => {
			const key = normalizeGermanCopy(`${item.question ?? ''}\n${item.answer ?? ''}`.replace(/\s+/g, ' ').trim());
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
	return doc;
}

function buildLocalParagraphs(row, doc) {
	const profile = LOCATION[row.slug] ?? [keywordCore(doc), `Ortsteile, Wege und Raeume rund um ${keywordCore(doc)}`, 'Fahrzeit, Raumzugang und ein klarer Aufbau', 'Gaeste mit konkretem Anlass und persoenlicher Erwartung'];
	const [label, scene, logistics, audience] = profile;
	const service = SERVICE[row.service];
	const keyword = doc.targetKeyword;
	const near = nearestSlug(row);
	const serviceNeed = service.logic.replace(/^bei /, 'Bei ');
	const opener = [
		`${keyword} in ${label} ist keine reine Ortsvariante der Hauptseite. Entscheidend sind ${scene}, weil diese Umgebung beeinflusst, wie nah, sichtbar und flexibel die Musik eingesetzt werden kann.`,
		`Fuer ${label} plane ich ${keyword} zuerst vom echten Ablauf her: ${scene}. Daraus ergibt sich, ob die Viola eher sammelt, begleitet, Akzente setzt oder einen einzelnen Moment bewusst traegt.`,
		`Wer in ${label} anfragt, hat meistens schon einen konkreten Rahmen vor Augen. ${scene} bringen andere Wege, Raumgroessen und Zeitfenster mit als eine abstrakte Leistungsseite.`,
	][stableIndex(row.slug, 3)];
	return [
		opener,
		`Die wichtigste Vorbereitung in ${label}: ${logistics}. Wenn diese Punkte vorab klar sind, beginnt die Musik ruhiger und laesst sich besser mit Worten, Wegen, Empfang oder Unterrichtsstart verbinden.`,
		`Typisch fuer ${label} sind ${audience}. Darauf reagiere ich nicht mit mehr Programm, sondern mit einer genaueren Dosierung: manchmal reicht ein einzelner Schwerpunkt, manchmal sind kurze wiederkehrende Einsaetze besser.`,
		`${serviceNeed}. In ${label} uebersetze ich das in konkrete Entscheidungen zu Position, Dauer, Lautstaerke, Startsignal und Pausen.`,
		`Der Unterschied zu ${near || 'einer Nachbarseite'} liegt selten in einem voellig anderen Repertoire. Wichtiger sind lokale Details wie Zugang, Raumklang, Wetteroption, Gaestebewegung und die Frage, wie viel Praesenz der Moment vertraegt.`,
		`Fuer die Anfrage sind ${service.request} hilfreicher als eine lange Wunschliste. Aus diesen Angaben entsteht ein Vorschlag, der zu ${label} passt und den Ablauf nicht kuenstlich aufblaeht.`,
		`Wenn ${keyword} mehrere Programmpunkte begleiten soll, plane ich kleine Spannungswechsel: erst Orientierung, dann ein tragender Mittelteil, danach ein offener Schluss oder eine dezente Ruecknahme.`,
		`Bei knappen Zeitfenstern in ${label} ist weniger oft praeziser. Ein gut gesetzter Einsatz wirkt staerker als ein zu langer Musikblock, der Reden, Gratulationen, Rituale oder Gespraeche ueberdeckt.`,
	];
}

function planningModesFor(serviceSlug) {
	if (serviceSlug === 'unterricht') return 'geduldig, technisch, klanglich, motivierend oder pruefend';
	if (serviceSlug === 'konzerte') return 'praesent, kammermusikalisch, moderiert, begleitend oder konzentriert';
	if (serviceSlug === 'firmenfeiern') return 'repraesentativ, dezent, elegant, verbindend oder als kurzer Akzent';
	if (serviceSlug === 'beerdigungen') return 'zurueckhaltend, rituell, tragend, still oder als klarer Abschiedsmoment';
	return 'praesent, dezent, rituell, festlich oder begleitend';
}

function deliverySubjectFor(serviceSlug) {
	return serviceSlug === 'unterricht' ? 'der Unterricht' : 'die Viola';
}

function buildTopicParagraphs(row, doc) {
	const service = SERVICE[row.service];
	const keyword = doc.targetKeyword;
	const near = nearestSlug(row);
	const slugParts = String(row.slug).split('-').filter(Boolean);
	const lenses = slugParts
		.map((part) => TERM_LENS[part])
		.filter(Boolean);
	const primary = lenses[0] ?? ['konkrete Anfrage, Klang, Ablauf und Erwartung', 'Dauer, Position, Raum, Timing', 'nicht als austauschbare Variante behandeln'];
	const secondary = lenses[1] ?? primary;
	const tertiary = lenses[2] ?? secondary;
	const modes = planningModesFor(row.service);
	const deliverySubject = deliverySubjectFor(row.service);
	const topicTerms = slugParts.map(titleCase).join(', ');
	const variant = stableIndex(row.slug, 4);
	const contrast = near || 'die naechste verwandte Anfrage';
	const serviceAngle = {
		hochzeiten: [
			`Bei Hochzeiten entscheidet die Reihenfolge der Momente: Einzug, Worte, Ringmoment und Auszug duerfen musikalisch nicht gleich klingen. ${keyword} bekommt deshalb einen eigenen Bogen statt nur ein weiteres Wunschlied.`,
			`Gerade bei Hochzeiten hilft eine klare Begrenzung. Diese Seite schaut auf ${topicTerms}, damit Empfang, Dinner oder Zeremonie nicht in denselben Ton fallen.`,
		],
		beerdigungen: [
			`Bei Abschieden muss Musik nicht gross werden, um tragend zu sein. ${keyword} wird hier so gedacht, dass Stille, Rede, Erinnerung und ein moeglicher Weg zum Grab genug Raum behalten.`,
			`Trauermusik braucht eine andere Sprache als Eventmusik. Diese Seite behandelt ${topicTerms} mit Blick auf Wuerde, Tempo, Ansprechpersonen und die Belastung der Angehoerigen.`,
		],
		firmenfeiern: [
			`Bei Firmenformaten zaehlt nicht nur Schoenheit, sondern Verlaesslichkeit im Ablauf. ${keyword} muss Reden, Networking, Markenwirkung und Gaestefluss zusammenhalten, ohne zur Hauptsache zu werden.`,
			`Business-Musik darf hochwertig wirken und trotzdem diskret bleiben. Diese Seite trennt ${topicTerms} bewusst von Gala, Messe, Dinner oder allgemeiner Hintergrundmusik.`,
		],
		geburtstage: [
			`Bei Geburtstagen steht die Person im Mittelpunkt, nicht die Musikerin. ${keyword} wird deshalb nach Ueberraschung, Alter, Runde, Wunschlied und Zeitpunkt geplant.`,
			`Eine Geburtstagsseite muss klaeren, ob es um Staendchen, Dinner, Gartenfeier oder Geschenkidee geht. ${topicTerms} bekommt hier einen eigenen Rahmen und keine austauschbare Partymusik.`,
		],
		taufen: [
			`Bei Taufen ist die Musik Teil eines Familien- und Segensmoments. ${keyword} braucht darum eine helle, behutsame Dramaturgie, die Gottesdienst, Kind und Familie respektiert.`,
			`Kirchliche Feiern wirken schnell ueberladen, wenn jeder Moment Musik bekommt. Diese Seite ordnet ${topicTerms} nach Ritual, Lesung, Segen, Auszug und anschliessender Familienfeier.`,
		],
		konzerte: [
			`Bei Konzertformaten steht das Zuhoeren staerker im Mittelpunkt als bei Begleitmusik. ${keyword} braucht deshalb Programm, Bogen, Moderation und ein klares Verhaeltnis zum Raum.`,
			`Kulturabende, Lesungen und Salonformate leben von Pausen. Diese Seite betrachtet ${topicTerms} als kuratierten Moment, nicht als dekorative Hintergrundspur.`,
		],
		unterricht: [
			`Im Unterricht ist das Ziel nicht ein schneller Effekt, sondern ein tragfaehiger naechster Schritt. ${keyword} wird deshalb nach Lernstand, Koerpergefuehl, Klangvorstellung und Uebealltag geplant.`,
			`Lernseiten duerfen nicht alle gleich klingen: ${topicTerms} hat andere Fragen als Kinderunterricht, Erwachseneneinstieg, Fortgeschrittene oder reine Probestunde.`,
		],
	}[row.service] ?? [
		`${keyword} bekommt einen eigenen Rahmen, weil Anlass, Ablauf und Erwartung enger gefasst sind als auf der allgemeinen Leistungsseite.`,
		`Diese Seite ordnet ${topicTerms} so ein, dass die Anfrage nicht mit verwandten Themen vermischt wird.`,
	];
	const serviceText = serviceAngle[variant % serviceAngle.length];
	return [
		serviceText,
		`Der Kern von ${keyword} ist ${primary[0]}. Deshalb beginne ich nicht mit einer Standardliste, sondern mit der Frage, welcher Moment tatsaechlich geloest werden soll.`,
		`Fuer die Planung sind ${primary[1]} die ersten Stellschrauben. Aus ihnen ergibt sich, ob ${deliverySubject} ${modes} wirken soll.`,
		`Die klare Abgrenzung zu ${contrast} lautet: ${primary[2]}. Dadurch behalten Ueberschrift, Beispiele, Kontaktfragen und FAQ eine eigene Richtung.`,
		`${secondary[0]} veraendert den Ton der Seite deutlich. Ein Wunschlied, ein Raumwechsel oder ein Lernziel wird anders vorbereitet, wenn dieser Punkt im Mittelpunkt steht.`,
		`Bei der Abstimmung schaue ich besonders auf ${secondary[1]}. Das verhindert, dass ${keyword} nur wie eine Variante der Hauptleistung klingt.`,
		`Auch ${tertiary[0]} ist relevant. Je nachdem, ob dieser Aspekt stark oder nur nebenbei gemeint ist, veraendert sich die Auswahl von Stuecken, Uebungen, Pausen oder Kontaktangaben.`,
		`Eine gute Anfrage nennt ${service.request}. Damit laesst sich schnell unterscheiden, ob ein kurzer Akzent, ein laengerer Bogen, ein Technikfokus oder eine bewusst dezente Begleitung passend ist.`,
		`Redaktionell bleibt diese Seite eng bei ${topicTerms || keyword}. Andere Seiten duerfen verwandte Begriffe auffangen; hier geht es um die praktische Entscheidung, die hinter genau dieser Suche steht.`,
	];
}

function buildFaq(row, doc) {
	const keyword = doc.targetKeyword;
	const service = SERVICE[row.service];
	if (row.page_kind === 'local') {
		const label = LOCATION[row.slug]?.[0] ?? keywordCore(doc);
		return [
			{
				question: `Welche Details sind fuer ${keyword} besonders wichtig?`,
				answer: `Wichtig sind der genaue Ort, die Raumgroesse, der Ablauf, moegliche Wege zwischen den Programmpunkten und die Rolle der Musik. In ${label} plane ich diese Punkte so, dass Klang, Timing und Aufbau zum Anlass passen.`,
			},
			{
				question: `Wie wird die Musik in ${label} konkret geplant?`,
				answer: `Hilfreich sind ${service.request}. Danach kann ich einschaetzen, ob ein einzelner Einsatz, mehrere kurze Sets oder eine laengere Begleitung sinnvoll ist.`,
			},
		];
	}
	const topicKind = row.service === 'unterricht' ? 'dieser Lernschwerpunkt' : 'dieser musikalische Schwerpunkt';
	const optionText = row.service === 'unterricht'
		? 'ein Unterrichtseinstieg, ein Technikfokus, ein Wiedereinstieg oder eine regelmaessige Begleitung passend ist'
		: 'ein kurzer Akzent, ein festlicher Rahmen, eine dezente Begleitung oder ein laengerer musikalischer Bogen passend ist';
	return [
		{
			question: `Wann passt ${keyword} besonders gut?`,
			answer: `${keyword} passt, wenn genau ${topicKind} gesucht wird. Entscheidend sind Rolle, Ablauf, Klangwirkung und die konkrete Erwartung hinter der Anfrage.`,
		},
		{
			question: `Welche Angaben helfen fuer eine erste Einschaetzung?`,
			answer: `Fuer eine schnelle Einordnung helfen ${service.request}. Damit laesst sich klaeren, ob ${optionText}.`,
		},
	];
}

function foldForMatch(value) {
	return String(value ?? '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ß/g, 'ss');
}

function isGeneratedText(value) {
	const text = foldForMatch(value);
	return GENERATED_TEXT_MARKERS.some((marker) => text.includes(foldForMatch(marker)));
}

function isGeneratedQuestion(value) {
	const text = foldForMatch(value);
	return GENERATED_QUESTION_MARKERS.some((marker) => text.includes(foldForMatch(marker)));
}

function objectHasGeneratedCopy(value) {
	if (!value || typeof value !== 'object') return false;
	return Object.entries(value).some(([key, child]) => {
		if (typeof child === 'string') {
			return ['text', 'answer', 'lede', 'lead', 'footnote', 'question', 'strong'].includes(key) && (isGeneratedText(child) || isGeneratedQuestion(child));
		}
		if (Array.isArray(child)) return child.some((item) => objectHasGeneratedCopy(item) || isGeneratedText(item));
		return objectHasGeneratedCopy(child);
	});
}

function cleanGeneratedArrays(value) {
	if (Array.isArray(value)) {
		return value
			.map((item) => cleanGeneratedArrays(item))
			.filter((item) => {
				if (typeof item === 'string') return !isGeneratedText(item);
				return !objectHasGeneratedCopy(item);
			});
	}
	if (value && typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) {
			if (Array.isArray(child)) value[key] = cleanGeneratedArrays(child);
			else if (child && typeof child === 'object') cleanGeneratedArrays(child);
		}
	}
	return value;
}

function hasGeneratedArtifacts(doc) {
	const paragraphs = Array.isArray(doc.split?.paragraphs) ? doc.split.paragraphs : [];
	const faqItems = Array.isArray(doc.faq?.items) ? doc.faq.items : [];
	return paragraphs.some(isGeneratedText)
		|| faqItems.some((item) => isGeneratedQuestion(item.question) || isGeneratedText(item.answer))
		|| String(doc.editorNotes ?? '').includes('Batch 12:')
		|| String(doc.editorNotes ?? '').includes('Batch 13:')
		|| String(doc.status ?? '').includes('batch-12')
		|| String(doc.status ?? '').includes('batch-13');
}

function cleanNotes(value) {
	return String(value ?? '')
		.split(/\n{2,}/)
		.map((part) => part.trim())
		.filter(Boolean)
		.filter((part) => !OLD_BATCH_NOTES.includes(part) && part !== BATCH_NOTE)
		.join('\n\n');
}

function polishInlineTechnicalCopy(doc) {
	const keyword = doc.targetKeyword ?? 'Diese Anfrage';
	if (typeof doc.hero?.lead === 'string') {
		doc.hero.lead = doc.hero.lead
			.replace(/Konzertcluster/g, 'Konzertbereich')
			.replace(/Familiencluster/g, 'kirchlichen Familienbereich')
			.replace(/Suchbegriff/g, 'Anfrage');
	}
	if (typeof doc.split?.lede === 'string') {
		if (isGeneratedText(doc.split.lede)) {
			const leadQuestion = doc.serviceSlug === 'unterricht'
				? 'Welche Rolle soll der Unterricht uebernehmen, wie viel Raum braucht das Lernziel, und welche Vorbereitung macht den Einstieg leichter?'
				: 'Welche Rolle soll die Musik uebernehmen, wie viel Raum braucht der Moment, und welche Vorbereitung macht den Ablauf sicher?';
			doc.split.lede = `${keyword} wird hier praktisch eingeordnet: ${leadQuestion}`;
		} else {
			doc.split.lede = doc.split.lede
				.replace(/Konzertcluster/g, 'Konzertbereich')
				.replace(/Familiencluster/g, 'kirchlichen Familienbereich')
				.replace(/Suchbegriff/g, 'Anfrage')
				.replace(/suchen suchen/g, 'suchen');
		}
	}
	if (typeof doc.focus?.footnote === 'string' && isGeneratedText(doc.focus.footnote)) {
		doc.focus.footnote = `${keyword} wird passend zu Anlass, Raum, Familie und Ablauf geplant.`;
	}
	if (doc.elegy && Array.isArray(doc.elegy.passages)) {
		doc.elegy.passages = doc.elegy.passages.filter((item) => !objectHasGeneratedCopy(item));
	}
}

function cleanGenerated(doc) {
	cleanGeneratedArrays(doc);
	polishInlineTechnicalCopy(doc);
	doc.split = doc.split ?? {};
	doc.split.paragraphs = Array.isArray(doc.split.paragraphs) ? doc.split.paragraphs.filter((paragraph) => !isGeneratedText(paragraph)) : [];
	if (doc.faq && Array.isArray(doc.faq.items)) {
		doc.faq.items = doc.faq.items.filter((item) => !isGeneratedQuestion(item.question) && !isGeneratedText(item.answer));
	}
	doc.editorNotes = cleanNotes(doc.editorNotes);
	return doc;
}

function stretchDoc(row) {
	const file = path.join(CONTENT_DIR, row.service, `${row.slug}.json`);
	if (!existsSync(file)) return false;
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const before = JSON.stringify(doc);
	normalizeGermanCopy(doc);
	if (String(doc.status ?? '').includes('batch-15') || String(doc.editorNotes ?? '').includes('Batch 15:')) {
		if (JSON.stringify(doc) === before) return false;
		writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);
		return true;
	}
	const hadGenerated = hasGeneratedArtifacts(doc);
	if (!hadGenerated && !['low', 'medium'].includes(row.risk)) return false;
	cleanGenerated(doc);

	const additions = normalizeGermanCopy(row.page_kind === 'local'
		? buildLocalParagraphs(row, doc)
		: buildTopicParagraphs(row, doc));

	doc.split.paragraphs.push(...withoutDuplicates(doc.split.paragraphs, additions));

	doc.faq = doc.faq ?? { eyebrow: 'Gut zu wissen', title: `FAQ zu ${doc.targetKeyword}`, items: [] };
	doc.faq.items = Array.isArray(doc.faq.items) ? doc.faq.items : [];
	const existingQuestions = new Set(doc.faq.items.map((item) => item.question));
	for (const item of buildFaq(row, doc)) {
		if (!existingQuestions.has(item.question)) doc.faq.items.push(item);
	}

	doc.status = 'rewritten-batch-16-stretched-review-needed';
	doc.editorNotes = `${String(doc.editorNotes ?? '').trim()}\n\n${BATCH_NOTE}`.trim();
	normalizeGermanCopy(doc);
	dedupeDocArrays(doc);

	if (JSON.stringify(doc) === before) return false;
	writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);
	return true;
}

const rows = readTrackerRows().filter((row) => ['low', 'medium'].includes(row.risk) || row.editor_status.includes('batch-13') || row.editor_status.includes('batch-12'));
let changed = 0;
for (const row of rows) {
	if (stretchDoc(row)) changed += 1;
}

console.log(`Stretched ${changed} low/medium SEO pages.`);
