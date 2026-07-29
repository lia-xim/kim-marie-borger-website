import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/seo-pages');
const writeChanges = process.argv.includes('--write');
const readFromHead = process.argv.includes('--from-head');
const DROP_PUBLIC_COPY = Symbol('drop-public-copy');

const SERVICE_PLAN_COPY = {
	beerdigungen:
		'Entscheidend sind ein ruhiger Ablauf, klare Absprachen und eine Stückauswahl, die zur Person und zum Abschied passt.',
	firmenfeiern:
		'Entscheidend sind Anlass, Raum, Zeitfenster, Lautstärke und die gewünschte Rolle der Musik.',
	geburtstage:
		'Entscheidend sind die gefeierte Person, der Ablauf, der Raum und die Frage, ob die Musik begleiten oder einen besonderen Moment eröffnen soll.',
	hochzeiten:
		'Entscheidend sind Zeremonieform, Einsatzpunkt, Raum, Wunschmusik und die gewünschte Wirkung.',
	konzerte:
		'Entscheidend sind Anlass, Publikum, Programmlänge, Raum und die gewünschte Nähe zwischen Musik und Gästen.',
	taufen:
		'Entscheidend sind der Ablauf der Feier, die vorgesehenen Musikmomente, der Raum und die gewünschte Stimmung.',
	unterricht:
		'Entscheidend sind Lernstand, Instrument, Ziel, Unterrichtsort, Wochenrhythmus und realistische Übezeit.',
};

const SERVICE_FORMAT_OPTIONS = {
	beerdigungen:
		'ein einzelnes Abschiedsstück, mehrere ruhige Einsätze, Musik am Grab oder eine Begleitung der gesamten Feier',
	firmenfeiern:
		'Empfangsmusik, mehrere kurze Sets, Dinnerbegleitung oder ein eigener Programmpunkt',
	geburtstage:
		'ein Überraschungsmoment, Empfangsmusik, Dinnerbegleitung oder mehrere kurze Sets',
	hochzeiten:
		'ein einzelner Einsatz, mehrere Momente der Trauung, Empfangsmusik oder eine längere Begleitung',
	konzerte:
		'ein kurzer Programmpunkt, ein moderiertes Set, ein Programm mit Pause oder ein abendfüllendes Konzert',
	taufen:
		'einzelne Stücke im Gottesdienst, Musik zur Taufhandlung, der Auszug oder der anschließende Empfang',
	unterricht:
		'eine Probestunde, regelmäßiger Unterricht, ein Technikschwerpunkt oder die Vorbereitung auf ein konkretes Ziel',
};

const SERVICE_DETAIL_OPTIONS = {
	unterricht: 'Stückauswahl, Unterrichtstempo, Übeaufgaben und Absprachen',
	default: 'Stückauswahl, Dauer, Pausen und die nötigen Absprachen',
};

const SERVICE_SECTION_TITLES = {
	beerdigungen: 'Trauermusik bewusst in den Ablauf einfügen.',
	firmenfeiern: 'Musik passend zum Veranstaltungsablauf planen.',
	geburtstage: 'Musik passend zur Feier und zur Person planen.',
	hochzeiten: 'Hochzeitsmusik bewusst in den Ablauf einfügen.',
	konzerte: 'Programm und Hörsituation bewusst planen.',
	taufen: 'Musik für Taufe und Segnung bewusst planen.',
	unterricht: 'Unterricht mit einem klaren Lernziel planen.',
};

const SERVICE_FIT_COPY = {
	beerdigungen:
		'Das passt besonders, wenn die Musik eine klar benannte Aufgabe im Abschied übernehmen soll.',
	firmenfeiern:
		'Das passt besonders, wenn Rolle, Lautstärke und Zeitfenster der Musik vorab klar festgelegt werden sollen.',
	geburtstage:
		'Das passt besonders, wenn die Musik auf die gefeierte Person und einen konkreten Moment abgestimmt werden soll.',
	hochzeiten:
		'Das passt besonders, wenn die Musik auf einen konkreten Moment der Hochzeit abgestimmt werden soll.',
	konzerte:
		'Das passt besonders, wenn Programm, Publikum und Hörsituation gemeinsam geplant werden sollen.',
	taufen:
		'Das passt besonders, wenn Musik einen konkreten Moment der Taufe oder Segnung begleiten soll.',
	unterricht:
		'Das passt besonders, wenn Lernstand, Ziel und verfügbare Übezeit gemeinsam geplant werden sollen.',
};

const SERVICE_FOCUS_TITLES = {
	beerdigungen: 'Worauf es bei der Planung von Trauermusik ankommt.',
	firmenfeiern: 'Worauf es bei Musik für Firmenveranstaltungen ankommt.',
	geburtstage: 'Worauf es bei Musik zum Geburtstag ankommt.',
	hochzeiten: 'Worauf es bei Hochzeitsmusik ankommt.',
	konzerte: 'Worauf es bei Konzert- und Kulturformaten ankommt.',
	taufen: 'Worauf es bei Taufmusik ankommt.',
	unterricht: 'Worauf es beim Unterricht ankommt.',
};

const SERVICE_FOOTNOTE_COPY = {
	beerdigungen:
		'Die Musik wird passend zu Abschiedsform, Raum, Ablauf und gewünschter Wirkung geplant.',
	firmenfeiern:
		'Die Musik wird passend zu Anlass, Raum, Zeitfenster und gewünschter Rolle geplant.',
	geburtstage:
		'Die Musik wird passend zur gefeierten Person, zum Raum und zum Ablauf geplant.',
	hochzeiten:
		'Die Musik wird passend zu Zeremonie, Raum, Wunschstücken und Ablauf geplant.',
	konzerte:
		'Das Programm wird passend zu Anlass, Publikum, Raum und gewünschter Länge geplant.',
	taufen:
		'Die Musik wird passend zu Feierform, Raum, Familie und Ablauf geplant.',
	unterricht:
		'Der Unterricht wird an Lernstand, Ziel, Alltag und Unterrichtsort angepasst.',
};

const SERVICE_LOCAL_CONTEXT_COPY = {
	beerdigungen:
		'Für einen Termin in {place} brauche ich die genaue Adresse, den vorgesehenen Musikmoment, den Zugang zum Raum oder Grab und eine erreichbare Kontaktperson.',
	firmenfeiern:
		'Für einen Termin in {place} brauche ich die genaue Adresse, das Zeitfenster, den Aufbauplatz und die Programmpunkte vor und nach der Musik.',
	geburtstage:
		'Für einen Termin in {place} brauche ich die genaue Adresse, den geplanten Musikmoment und die Information, ob die Musik als Überraschung oder offen angekündigt beginnt.',
	hochzeiten:
		'Für einen Termin in {place} brauche ich die genaue Adresse, die Zeremonieform, den Spielort und ein klares Startsignal.',
	konzerte:
		'Für einen Termin in {place} brauche ich die genaue Adresse, Angaben zu Raum und Publikum sowie das gewünschte Zeitfenster für das Programm.',
	taufen:
		'Für einen Termin in {place} brauche ich die genaue Adresse, den Ablauf von Taufe oder Segnung und die vorgesehenen Musikmomente.',
	unterricht:
		'Für regelmäßigen Unterricht in {place} müssen Unterrichtsort, wöchentlicher Weg, Terminrhythmus und realistische Übezeit zusammenpassen.',
};

const SERVICE_MULTI_LOCATION_COPY = {
	beerdigungen:
		'Wenn Trauerfeier und Grab an verschiedenen Orten liegen, prüfe ich Weg und Zeitfenster vorab. Erst dann lässt sich verlässlich sagen, ob Musik an beiden Stellen sinnvoll möglich ist.',
	firmenfeiern:
		'Wenn Empfang, Dinner und Programmpunkte in verschiedenen Räumen stattfinden, prüfe ich Wechsel und Zeitfenster vorab. So bleibt die Musik präsent, ohne den Ablauf zu blockieren.',
	geburtstage:
		'Wenn Überraschung, Empfang und Feier an verschiedenen Stellen stattfinden, klären wir Weg und Startsignal vorab. So beginnt die Musik im richtigen Moment.',
	hochzeiten:
		'Wenn Trauung und Empfang an verschiedenen Orten liegen, prüfe ich Weg und Zeitfenster vorab. Erst dann lässt sich verlässlich sagen, ob Musik an beiden Stellen sinnvoll möglich ist.',
	konzerte:
		'Wenn Konzert, Moderation und Empfang verschiedene Räume nutzen, klären wir Wechsel, Aufbau und Zeitfenster vorab. So bleibt der Programmbogen ruhig.',
	taufen:
		'Wenn Taufe und Familienfeier an verschiedenen Orten stattfinden, prüfe ich Weg und Zeitfenster vorab. Erst dann lässt sich sagen, ob ein zweiter musikalischer Einsatz sinnvoll ist.',
	unterricht:
		'Für regelmäßigen Unterricht muss der Weg jede Woche realistisch bleiben. Unterrichtsort, Terminrhythmus und Übezeit klären wir deshalb vor dem Start.',
};

const SERVICE_LOCAL_FIT_COPY = {
	beerdigungen:
		'Vorab klären wir deshalb Raum oder Grabstelle, Zugang, Wetteroption, Startsignal und die gewünschte Länge.',
	firmenfeiern:
		'Vorab klären wir deshalb Raum, Aufbauplatz, Lautstärke, Zeitfenster und die Abstimmung mit Moderation oder Catering.',
	geburtstage:
		'Vorab klären wir deshalb Raum, Gästezahl, Startsignal und die Frage, ob die Musik überraschen oder begleiten soll.',
	hochzeiten:
		'Vorab klären wir deshalb Raum, Zugang, Startsignal, Wetteroption und mögliche Wechsel zwischen Trauung und Empfang.',
	konzerte:
		'Vorab klären wir deshalb Raum, Publikum, Akustik, Programmlänge und mögliche weitere Beiträge.',
	taufen:
		'Vorab klären wir deshalb Raum, Ablauf, Startsignale, Wunschmusik und einen möglichen Wechsel zur Familienfeier.',
	unterricht:
		'Vorab klären wir deshalb Unterrichtsort, Lernstand, Instrument, Wochenrhythmus und realistische Übezeit.',
};

const SERVICE_SEAL_COPY = {
	beerdigungen: 'ruhig abgestimmt',
	firmenfeiern: 'klar abgestimmt',
	geburtstage: 'persönlich abgestimmt',
	hochzeiten: 'sorgfältig abgestimmt',
	konzerte: 'bewusst programmiert',
	taufen: 'ruhig abgestimmt',
	unterricht: 'alltagstauglich geplant',
};

const IMAGE_ALT_BY_SRC = {
	'/uploads/_DSC7270.webp':
		'Kim Marie Borger steht mit ihrer Viola am See',
	'/uploads/_DSC7353.webp':
		'Kim Marie Borger hält ihre Viola vor einem See',
	'/uploads/_DSC7402.webp':
		'Kim Marie Borger spielt Viola am See',
	'/uploads/_DSC7458.webp':
		'Kim Marie Borger hält Viola und Bogen am See',
	'/uploads/mq0uvv3p-20250327-DSC01349.webp':
		'Kim Marie Borger spielt Viola in festlicher Kleidung',
	'/uploads/mq0uvv7v-20250327-DSC01550.webp':
		'Kim Marie Borger spielt Viola auf einer Wiese im Abendlicht',
	'/uploads/mq0uvva2-20250327-DSC01714.webp':
		'Kim Marie Borger sitzt mit ihrer Viola auf einer Wiese',
	'/uploads/mq0uvvd3-20250327-DSC01769.webp':
		'Kim Marie Borger sitzt mit ihrer Viola in festlicher Kleidung auf einer Wiese',
};

const GENERATED_LIST_COPY =
	/^(?:Entscheidend für die Planung:\s*[^.]+\.|Im Mittelpunkt:\s*[^.]+\. Vorab klären wir, welcher davon für den konkreten Anlass entscheidend ist\.|Für die Planung sind folgende Punkte besonders wichtig:\s*[^.]+\. Ein Wunsch(?:lied|stück), ein (?:Raumwechsel|neuer Unterrichtsort) oder (?:ein besonderer Ablaufpunkt|ein Lernziel) wird anders vorbereitet, wenn dieser Punkt im Mittelpunkt steht\.|Bei der Abstimmung schaue ich besonders auf [^.]+\.|Auch folgende Punkte beeinflussen die Planung:\s*[^.]+\. Je nach Schwerpunkt verändern sich [^.]+\.)$/iu;

const OPERATOR_LANGUAGE =
	/\b(?:(?:diese|andere|verwandte|lokale|thematische|priorisierte|übergeordnete|untergeordnete)\s+seiten?|redaktionell|Suchintention|Suchbegriff|Suchintent|Intent|Keyword|Cluster|für SEO|Abgrenzung|Überschrift, Beispiele|Kontaktfragen und FAQ|nicht zu allgemein bleiben|verändert den Ton der Seite|Übungen, Pausen oder Kontaktangaben|der Kern von)\b/iu;

const TEMPLATE_LANGUAGE =
	/\b(?:ein kurzer Akzent, ein längerer Bogen, ein Technikfokus|ein kurzer Akzent, ein festlicher Rahmen, eine dezente Begleitung|Ein Wunschlied, ein Raumwechsel oder ein Lernziel|Stücken, Übungen, Pausen oder Kontaktangaben|braucht eine eigene Entscheidung|braucht einen eigenen Schwerpunkt|braucht eine eigene musikalische Planung|Variante der Hauptleistung|verwandte Anfragen wie|allgemeine Musikfloskel)\b/i;

const TEACHING_EVENT_LANGUAGE =
	/\b(?:Gäste|private Feiern|Unternehmensumfeld|Eventräume|Einlass|Ladepunkt|Wartezeit|Ortswechsel|Spielort|Vorspielen vor Ort|besondere Technik|Kontaktperson vor Ort|einmaligen Auftritt|wie viel Musik sinnvoll|kurzfristige Verlängerungen|Park- oder Haltemöglichkeit|Aufbauplatz)\b/i;

function walkJsonFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walkJsonFiles(full);
		return entry.isFile() && entry.name.endsWith('.json') ? [full] : [];
	});
}

function compact(value) {
	return String(value)
		.replace(/\s+([,.;:!?])/g, '$1')
		.replace(/([.!?]){2,}/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

function preserveInitialCase(source, replacement) {
	if (!source || source[0] !== source[0].toUpperCase()) return replacement;
	return replacement.charAt(0).toUpperCase() + replacement.slice(1);
}

function normalizePublicGerman(value) {
	const replacements = [
		['einsch\\?tzung', 'einschätzung'],
		['anfänger', 'anfänger'],
		['traürfeier', 'trauerfeier'],
		['traürmusik', 'trauermusik'],
		['ueberg', 'überg'],
		['ueberrasch', 'überrasch'],
		['ueberbrueck', 'überbrück'],
		['übergaenge', 'übergänge'],
		['überlaedt', 'überlädt'],
		['überbrueck', 'überbrück'],
		['uebealltag', 'übealltag'],
		['uebeplan', 'übeplan'],
		['uebezeit', 'übezeit'],
		['uebeweg', 'übeweg'],
		['uebung', 'übung'],
		['mitgeuebt', 'mitgeübt'],
		['geuebt', 'geübt'],
		['koerpergefuehl', 'körpergefühl'],
		['koerper', 'körper'],
		['stueck', 'stück'],
		['fuer', 'für'],
		['frueh', 'früh'],
		['beruehr', 'berühr'],
		['eigenstaendig', 'eigenständig'],
		['noetig', 'nötig'],
		['rueckfrag', 'rückfrag'],
		['ungefaehr', 'ungefähr'],
		['verlaess', 'verläss'],
		['wuensch', 'wünsch'],
		['laenge', 'länge'],
		['glaeser', 'gläser'],
		['traenen', 'tränen'],
		['geluebde', 'gelübde'],
		['buehne', 'bühne'],
		['gespraeche', 'gespräche'],
		['aehnlich', 'ähnlich'],
		['drueck', 'drück'],
		['haende', 'hände'],
		['hoer', 'hör'],
		['kuerz', 'kürz'],
		['laeuf', 'läuf'],
		['prioritaeten', 'prioritäten'],
		['regelmaess', 'regelmäß'],
		['unregelmaess', 'unregelmäß'],
		['spuer', 'spür'],
		['traegt', 'trägt'],
		['dafuer', 'dafür'],
		['fuell', 'füll'],
		['professionalitaet', 'professionalität'],
		['tonhoehe', 'tonhöhe'],
		['anschliessende', 'anschließende'],
	];

	let next = String(value)
		.replace(/AnfäNger/g, 'Anfänger')
		.replace(/\bFÜR\b/g, 'für')
		.replace(/\bamazing Grace\b/g, 'Amazing Grace');

	for (const [source, replacement] of replacements) {
		next = next.replace(new RegExp(source, 'giu'), (match) =>
			preserveInitialCase(match, replacement));
	}

	return next;
}

function escapeRegExp(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function locationLabel(doc) {
	const eyebrow = String(doc.hero?.eyebrow ?? '');
	const match = eyebrow.match(/\bin\s+(.+)$/i);
	if (match) return match[1].trim();
	return String(doc.pageSlug ?? '')
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function teachingReplacement(doc, pathParts) {
	const place = locationLabel(doc);
	const field = pathParts.at(-1) ?? '';
	const pathName = pathParts.join('.');

	if (field === 'question') {
		return `Wie lässt sich Unterricht in ${place} gut in den Alltag einplanen?`;
	}
	if (pathName.includes('contact.notes')) {
		return 'Unterrichtsort, Rhythmus und möglicher Materialaufwand werden vorab geklärt';
	}
	if (field === 'title') {
		return `Unterricht in ${place} alltagstauglich planen`;
	}
	if (field === 'answer') {
		return `Für regelmäßigen Unterricht in ${place} sollten Unterrichtsort, Weg, Schul- oder Arbeitszeiten und realistische Übezeit zusammenpassen. Das klären wir in der Probestunde.`;
	}
	if (pathName.includes('split.sections.3')) {
		return 'Zusätzlicher Aufwand kann durch neu zu erstellende Noten oder besonderes Unterrichtsmaterial entstehen. Das bespreche ich vorab; der reguläre Unterricht wird transparent nach Dauer, Rhythmus und Ort vereinbart.';
	}
	if (field === 'footnote') {
		return `Unterricht in ${place} wird tragfähig, wenn Lernstand, Weg, Rhythmus und Übezeit dauerhaft zusammenpassen.`;
	}
	return `Vor der Probestunde klären wir Lernstand, Instrument, Ziel, möglichen Unterrichtsort und einen Rhythmus, der im Alltag in ${place} regelmäßig funktioniert.`;
}

function fallbackCopy(doc, pathParts) {
	const keyword = String(doc.targetKeyword ?? doc.pageSlug ?? 'diesem Thema');
	const field = pathParts.at(-1) ?? '';
	const planCopy = SERVICE_PLAN_COPY[doc.serviceSlug] ?? SERVICE_PLAN_COPY.hochzeiten;

	if (field === 'question') return 'Was ist bei der Planung besonders wichtig?';
	if (field === 'answer') return planCopy;
	if (field === 'strong' || field === 'kicker' || field === 'eyebrow') return 'Worauf es ankommt';
	if (field === 'title') return `Was bei ${keyword} wichtig ist`;
	return planCopy;
}

function replaceKnownTemplates(value, doc, pass = 0) {
	const detailOptions = SERVICE_DETAIL_OPTIONS[doc.serviceSlug] ?? SERVICE_DETAIL_OPTIONS.default;
	const formatOptions = SERVICE_FORMAT_OPTIONS[doc.serviceSlug] ?? SERVICE_FORMAT_OPTIONS.hochzeiten;
	const planCopy = SERVICE_PLAN_COPY[doc.serviceSlug] ?? SERVICE_PLAN_COPY.hochzeiten;
	const sectionTitle = SERVICE_SECTION_TITLES[doc.serviceSlug] ?? 'Musik bewusst planen.';
	const fitCopy = SERVICE_FIT_COPY[doc.serviceSlug] ?? planCopy;
	const focusTitle = SERVICE_FOCUS_TITLES[doc.serviceSlug] ?? 'Worauf es bei der Planung ankommt.';
	const footnoteCopy = SERVICE_FOOTNOTE_COPY[doc.serviceSlug] ?? planCopy;
	const offerSubject = doc.serviceSlug === 'unterricht' ? 'Der Unterricht' : 'Diese musikalische Begleitung';
	const keywordPattern = escapeRegExp(doc.targetKeyword ?? '');
	const place = locationLabel(doc);
	const localContextCopy = (
		SERVICE_LOCAL_CONTEXT_COPY[doc.serviceSlug] ?? SERVICE_LOCAL_CONTEXT_COPY.hochzeiten
	).replace('{place}', place);
	const multiLocationCopy =
		SERVICE_MULTI_LOCATION_COPY[doc.serviceSlug] ?? SERVICE_MULTI_LOCATION_COPY.hochzeiten;
	const localFitCopy =
		SERVICE_LOCAL_FIT_COPY[doc.serviceSlug] ?? SERVICE_LOCAL_FIT_COPY.hochzeiten;
	let next = normalizePublicGerman(value);

	next = next.replace(
		/[^.!?]+ steht hier für konkrete Orte und Wege zwischen [^.!?]+\.\s*/giu,
		`${localContextCopy} `,
	);
	next = next.replace(
		/Typische Orte und Routen liegen zum Beispiel im Umfeld von [^;.!?]+;\s*für [^.!?]+ verändert das Timing, Aufbau und Akustik\.\s*/giu,
		'',
	);
	next = next.replace(
		/Die lokalen Marker [^.!?]+ helfen, den Termin nicht nur nach Stadtname, sondern nach echter Situation zu planen\.\s*/giu,
		'',
	);
	next = next.replace(
		/Gerade in [^.!?]+ wirkt Solo-Viola stark, weil sie wenig Aufbau braucht, nah klingt und sich flexibel an kleinere Räume, größere Feiern oder kurze Übergänge anpassen lässt\.\s*/giu,
		`${localFitCopy} `,
	);
	next = next.replace(
		/Wenn Zeremonie, Fotos und Empfang an zwei Orten [^.!?]+ liegen, plane ich nicht automatisch beides ein; erst die Wege und Zeiten zeigen, ob ein Ortswechsel musikalisch sinnvoll ist\.\s*/giu,
		`${multiLocationCopy} `,
	);
	next = next.replace(
		/Wenn nur [^.!?]+ genannt wird, ist die erste Entscheidung immer der konkrete Ort\. Erst danach kann ich sagen, ob ein kurzer Einsatz, ein längeres Set oder mehrere Momente realistisch sind\.\s*/giu,
		`${multiLocationCopy} `,
	);
	next = next.replace(
		/Für die Buchung klären wir danach ehrlich, ob vorhandenes Repertoire reicht oder ob ein Wunschlied neu herausgehört beziehungsweise notiert werden muss\.\s*/giu,
		'Vor der Buchung klären wir Repertoire, Wunschmusik und möglichen Zusatzaufwand. ',
	);
	next = next.replace(
		/Für die konkrete Entscheidung gilt:\s*Nicht der Ortsname macht sie relevant, sondern die Entscheidungshilfen zu Raum, Timing, Wunschmusik, Kontaktperson, Anfahrt und nächstem Schritt\.\s*/giu,
		'',
	);
	next = next.replace(
		/\nlokal geplant$/iu,
		`\n${SERVICE_SEAL_COPY[doc.serviceSlug] ?? 'klar abgestimmt'}`,
	);

	if (/^.+ braucht eine eigene musikalische Planung\.$/i.test(next)) {
		return sectionTitle;
	}

	if (
		/^.+ passt, wenn genau dieser (?:musikalische|Lern)schwerpunkt gesucht wird\. Entscheidend sind Rolle, Ablauf, Klangwirkung und die konkrete Erwartung hinter der Anfrage\.$/i.test(next)
	) {
		return fitCopy;
	}
	if (doc.pageKind === 'topic' && keywordPattern) {
		next = next.replace(
			new RegExp(`^Worauf es bei ${keywordPattern} (?:konkret )?ankommt\\.$`, 'i'),
			focusTitle,
		);
		next = next.replace(
			new RegExp(`^Worauf kommt es bei ${keywordPattern} besonders an\\?$`, 'i'),
			doc.serviceSlug === 'unterricht'
				? 'Worauf kommt es beim Unterricht besonders an?'
				: 'Worauf kommt es bei der Planung besonders an?',
		);
		next = next.replace(
			new RegExp(`^Für wen passt ${keywordPattern}\\?$`, 'i'),
			doc.serviceSlug === 'unterricht'
				? 'Für wen passt der Unterricht?'
				: 'Für wen passt diese musikalische Begleitung?',
		);
		next = next.replace(
			new RegExp(`^${keywordPattern} passt\\b`, 'i'),
			`${offerSubject} passt`,
		);
		next = next.replace(
			new RegExp(`\\bBei ${keywordPattern} (?:steht|stehen) ([^.!?]+?) im Mittelpunkt\\.`, 'gi'),
			'Im Mittelpunkt: $1.',
		);
		next = next.replace(
			new RegExp(`\\bBei ${keywordPattern} stehen folgende Punkte im Mittelpunkt: ([^.!?]+)\\.`, 'gi'),
			'Im Mittelpunkt: $1.',
		);
		next = next.replace(
			new RegExp(`\\bBei ${keywordPattern} beginne ich mit`, 'gi'),
			'Ich beginne mit',
		);
		next = next.replace(
			new RegExp(`\\bFür ${keywordPattern} klären wir`, 'gi'),
			'Für die Planung klären wir',
		);
		next = next.replace(
			new RegExp(`\\bFür ${keywordPattern} beginne ich`, 'gi'),
			'Bei der Planung beginne ich',
		);
		next = next.replace(
			new RegExp(`\\b${keywordPattern} wird hier praktisch eingeordnet:`, 'gi'),
			'Für die Planung sind drei Fragen wichtig:',
		);
		next = next.replace(
			new RegExp(`\\b${keywordPattern} wird deshalb nach ([^.]+) geplant\\.`, 'gi'),
			'Deshalb richtet sich die Planung nach $1.',
		);
		next = next.replace(
			new RegExp(`^${keywordPattern} wird passend zu Anlass, Raum, Familie und Ablauf geplant\\.$`, 'i'),
			footnoteCopy,
		);
	}
	if (doc.pageKind === 'topic') {
		next = next.replace(
			/^Für wen passt [^?]+\?$/i,
			doc.serviceSlug === 'unterricht'
				? 'Für wen passt der Unterricht?'
				: 'Für wen passt diese musikalische Begleitung?',
		);
		next = next.replace(
			/^Worauf kommt es bei [^?]+ besonders an\?$/i,
			doc.serviceSlug === 'unterricht'
				? 'Worauf kommt es beim Unterricht besonders an?'
				: 'Worauf kommt es bei der Planung besonders an?',
		);
		next = next.replace(
			/\bBei [A-ZÄÖÜ][^.!?]{0,100} stehen folgende Punkte im Mittelpunkt: ([^.!?]+)\./gu,
			'Im Mittelpunkt: $1.',
		);
		next = next.replace(
			/\bBei [A-ZÄÖÜ][^.!?]{0,100} (?:steht|stehen) ([^.!?]+?) im Mittelpunkt\./gu,
			'Im Mittelpunkt: $1.',
		);
		next = next.replace(
			/\bBei [A-ZÄÖÜ][^.!?]{0,100} beginne ich mit der Frage/gu,
			'Ich beginne mit der Frage',
		);
		next = next.replace(
			/\bFür [A-ZÄÖÜ][^.!?]{0,100} klären wir vorab/gu,
			'Für die Planung klären wir vorab',
		);
		next = next.replace(
			/\bFür [A-ZÄÖÜ][^.!?]{0,100} beginne ich nicht mit/gu,
			'Bei der Planung beginne ich nicht mit',
		);
		next = next.replace(
			/\b[A-ZÄÖÜ][^.!?]{0,100} wird hier praktisch eingeordnet:/gu,
			'Für die Planung sind drei Fragen wichtig:',
		);
		next = next.replace(
			/\b[A-ZÄÖÜ][^.!?]{0,100} wird deshalb nach ([^.]+) geplant\./gu,
			'Deshalb richtet sich die Planung nach $1.',
		);
		next = next.replace(
			/^[^.]+ wird passend zu Anlass, Raum, Familie und Ablauf geplant\.$/i,
			footnoteCopy,
		);
		next = next.replace(
			/\b([A-ZÄÖÜ][^.!?]{0,80}) braucht deshalb Programm, Bogen, Moderation und ein klares Verhältnis zum Raum\./gu,
			'Das Format braucht deshalb ein Programm, einen dramaturgischen Bogen, passende Moderation und ein klares Verhältnis zum Raum.',
		);
		next = next.replace(
			/Praktisch bedeutet das: Für [A-ZÄÖÜ][^.!?]{0,100} bespreche ich/gu,
			'Praktisch bedeutet das: Ich bespreche',
		);
		next = next
			.replace(/suchen macht es einen Unterschied/gi, 'suchen, macht es einen Unterschied')
			.replace(/Bei Geburtstage, Jubiläen/gi, 'Bei Geburtstagen, Jubiläen')
			.replace(/Familien und Freundeskreise macht/gi, 'Familien und Freundeskreisen macht')
			.replace(/Bei Empfang vor Dinner/gi, 'Bei einem Empfang vor dem Dinner')
			.replace(/Bei Geburtstage mit/gi, 'Bei Geburtstagen mit');
	}

	next = next.replace(
		/^Wer nach [^.]+? sucht, braucht meist keine allgemeine Musikfloskel, sondern Orientierung\.\s*/i,
		'',
	);
	next = next.replace(
		/^(.+?) suchen Musik für (.+)\.$/i,
		(_match, audience, useCases) => {
			const completeAudience = /(?:möchten|einbinden|stehen)$/i.test(audience)
				? audience
				: `${audience} suchen`;
			return `${completeAudience}, wünschen sich eine musikalische Begleitung für ihre Feier. Mögliche Einsatzorte und Momente sind ${useCases}.`;
		},
	);
	next = next.replace(
		/Bei der Planung von [^.!?]+? ist besonders wichtig:\s*/gi,
		'Besonders wichtig für die Planung: ',
	);
	next = next.replace(
		/Bei [^.!?]+? geht es zuerst um die Aufgabe der Musik\./gi,
		'Zuerst geht es um die Aufgabe der Musik.',
	);
	next = next.replace(
		/Bei [^.!?]+? geht es zuerst um die Hörsituation\./gi,
		'Zuerst geht es um die Hörsituation.',
	);
	next = next.replace(
		/Hier geht es gezielt um ([^.]+)\./gi,
		'Im Mittelpunkt: $1.',
	);
	next = next.replace(
		/Als fachlichen Zusatz kläre ich bei [^.!?]+ auch (der|die|das) /gi,
		(_match, article) => `Zusätzlich kläre ich ${article.toLowerCase() === 'der' ? 'den' : article.toLowerCase()} `,
	);
	next = next.replace(
		/Bei [^.!?]+? (?:steht|stehen) ([^.!?]+?) im Vordergrund\.\s*Dieser Schwerpunkt führt zu einer anderen Planung als verwandte Anfragen wie [^.]+\./gi,
		'Entscheidend für die Planung: $1.',
	);
	next = next.replace(
		/\s*Dieser Schwerpunkt führt zu einer anderen Planung als verwandte Anfragen wie [^.]+\./gi,
		'',
	);
	next = next.replace(
		/\s*Das verhindert, dass [^.]+ nur wie eine Variante der Hauptleistung klingt\./gi,
		'',
	);
	next = next.replace(
		/Sinnvoll ist, (?:[\p{Lu}][\p{L}-]*,\s*){1,6}[\p{Lu}][\p{L}-]* nach ([^.]+)\./gu,
		'Sinnvoll ist eine Planung nach $1.',
	);
	next = next.replace(
		/(?:[\p{Lu}][\p{L}-]*,\s*){1,6}[\p{Lu}][\p{L}-]* als kuratierten Moment, nicht wirkt hier als dekorative Hintergrundspur/gu,
		'Dabei wirkt die Musik als kuratierter Moment und nicht als dekorative Hintergrundspur',
	);
	next = next.replace(/Im Mittelpunkt steht der Empfang als eigenen Moment/gi, 'Im Mittelpunkt steht der Empfang als eigener Moment');

	next = next.replace(
		/(.+?) braucht eine eigene Entscheidung:\s*(.+?)\.\s*Ich stimme/gi,
		'Bei der Planung von $1 ist besonders wichtig: $2. Ich stimme',
	);
	next = next.replace(
		/.+? braucht einen eigenen Schwerpunkt\./gi,
		'Musik passend zu Ablauf und Feier planen.',
	);
	next = next.replace(/Sanft ist ein eigener (?:Suchintent|Intent):\s*/gi, 'Sanfte Musik hat eine klare Aufgabe: ');
	next = next.replace(/Der (?:Suchintent|Intent) ist instrumentennah:\s*/gi, 'Hier entscheidet die gewünschte Klangfarbe: ');
	next = next.replace(/Der (?:Suchintent|Intent) ist repertoirebezogen:\s*/gi, 'Hier steht die Stückauswahl im Mittelpunkt: ');
	next = next.replace(
		/Der (?:Suchintent|Intent) ist Repertoire mit persönlicher Sprache:\s*/gi,
		'Hier steht persönliches Repertoire im Mittelpunkt: ',
	);
	next = next.replace(/Der (?:Suchintent|Intent) ist Gefühl:\s*/gi, 'Hier steht die gewünschte Wirkung im Mittelpunkt: ');
	next = next.replace(/Der (?:Suchintent|Intent) ist enger als Musik Abschied:\s*/gi, 'Dieses Thema ist enger als Musik zum Abschied: ');
	next = next.replace(/Der (?:Suchintent|Intent) ist transaktional:\s*/gi, 'Hier geht es um die konkrete Buchung: ');
	next = next.replace(/Der (?:Suchintent|Intent) ist orientierend:\s*/gi, 'Hier geht es um Auswahl und Einordnung: ');
	next = next.replace(
		/Der (?:Suchintent|Intent) ist [^:]+:\s*/gi,
		'Wichtig ist dabei Folgendes: ',
	);
	next = next.replace(/Der (?:Suchintent|Intent) umfasst /gi, 'Das Angebot umfasst ');
	next = next.replace(/Der (?:Suchintent|Intent) erklärt /gi, 'Im Mittelpunkt steht ');
	next = next.replace(/Der (?:Suchintent|Intent) liegt /gi, 'Der gewünschte Rahmen liegt ');
	next = next.replace(/Der (?:Suchintent|Intent) fragt nach /gi, 'Entscheidend ist ');
	next = next.replace(/Der (?:Suchintent|Intent) meint /gi, 'Gemeint ist ');
	next = next.replace(/Der (?:Suchintent|Intent) ist /gi, 'Wichtig ist ');
	next = next.replace(
		/Wichtig ist auch die Grenze zur reinen Buchungsseite: Hier geht es um Idee, Wirkung und passende Einsatzmomente\. Wenn Datum, Ort und Zeitfenster schon feststehen, ist die Buchungsseite der direktere nächste Schritt\./gi,
		'Hier geht es zuerst um Idee, Wirkung und passende Einsatzmomente. Wenn Datum, Ort und Zeitfenster schon feststehen, führt der direkte nächste Schritt zur konkreten Anfrage.',
	);
	next = next.replace(/diese Buchungsseite/gi, 'dieser nächste Schritt');
	next = next.replace(/zur reinen Buchungsseite/gi, 'zur konkreten Anfrage');
	next = next.replace(/ist die Buchungsseite/gi, 'ist eine konkrete Anfrage');
	next = next.replace(/Die Buchungsseite/gi, 'Eine konkrete Anfrage');

	next = next.replace(
		/Der Kern von (.+?) ist (.+?)\. Deshalb beginne ich nicht mit einer Standardliste, sondern mit der Frage, welcher Moment tatsächlich gelöst werden soll\./gi,
		'Bei $1 stehen folgende Punkte im Mittelpunkt: $2. Vorab klären wir, welcher davon für den konkreten Anlass entscheidend ist.',
	);
	next = next.replace(/Die organisatorische Seite bleibt bewusst klar:\s*/gi, 'Organisatorisch wichtig sind ');
	next = next.replace(
		/Die klare Abgrenzung zu [^.]+ lautet:\s*[^.]+\. Dadurch behalten Überschrift, Beispiele, Kontaktfragen und FAQ eine eigene Richtung\./gi,
		'',
	);
	next = next.replace(
		/Auch (.+?) ist relevant\. Je nachdem, ob dieser Aspekt stark oder nur nebenbei gemeint ist, verändert sich die Auswahl von Stücken, Übungen, Pausen oder Kontaktangaben\./gi,
		`Auch folgende Punkte beeinflussen die Planung: $1. Je nach Schwerpunkt verändern sich ${detailOptions}.`,
	);
	next = next.replace(
		/(.+?) verändert den Ton der Seite deutlich\./gi,
		'Für die Planung sind folgende Punkte besonders wichtig: $1.',
	);
	next = next.replace(
		/verändert sich die Auswahl von Stücken, Übungen, Pausen oder Kontaktangaben/gi,
		`verändern sich ${detailOptions}`,
	);
	next = next.replace(/verändert den Ton der Seite deutlich/gi, 'prägt die Planung deutlich');
	next = next.replace(/Stücken, Übungen, Pausen oder Kontaktangaben/gi, detailOptions);
	next = next.replace(/Übungen, Pausen oder Kontaktangaben/gi, detailOptions);
	next = next.replace(
		/ein kurzer Akzent, ein längerer Bogen, ein Technikfokus oder eine bewusst dezente Begleitung/gi,
		formatOptions,
	);
	next = next.replace(
		/ein kurzer Akzent, ein festlicher Rahmen, eine dezente Begleitung oder ein längerer musikalischer Bogen/gi,
		formatOptions,
	);
	next = next.replace(
		/Ein Wunschlied, ein Raumwechsel oder ein Lernziel/gi,
		doc.serviceSlug === 'unterricht'
			? 'Ein Wunschstück, ein neuer Unterrichtsort oder ein Lernziel'
			: 'Ein Wunschlied, ein Raumwechsel oder ein besonderer Ablaufpunkt',
	);
	next = next.replace(
		/Deshalb wird diese Seite nicht als reine Ortsvariante geplant, sondern vom konkreten Rahmen her:\s*/gi,
		'Für die konkrete Planung zählen ',
	);
	next = next.replace(
		/So bleibt die Seite für [^.]+ praktisch:\s*/gi,
		'Für die konkrete Entscheidung gilt: ',
	);
	next = next.replace(
		/Diese Seite behandelt gezielt ([^.]+)\.\s*Dadurch unterscheidet sie sich von [^:]+:\s*/gi,
		'Im Mittelpunkt steht $1. Entscheidend ist: ',
	);
	next = next.replace(
		/Diese Seite behandelt ([^.]+) mit Blick auf /gi,
		'Bei $1 geht es um ',
	);
	next = next.replace(
		/Diese Seite unterscheidet sich von ([^,]+), weil der Fokus (.+?) liegt\./gi,
		'Im Vergleich zu $1 liegt der Fokus $2.',
	);
	next = next.replace(
		/Diese Seite unterscheidet sich von ([^,]+), weil (.+?) im Mittelpunkt (?:steht|stehen)\./gi,
		'Im Vergleich zu $1 steht $2 im Mittelpunkt.',
	);
	next = next.replace(
		/Diese Seite unterscheidet sich von ([^,]+), weil ([^.]+)\./gi,
		planCopy,
	);
	next = next.replace(
		/Diese Seite grenzt sich von ([^:]+) ab:\s*([^.]+)\./gi,
		'Im Vergleich zu $1 gilt hier: $2.',
	);
	next = next.replace(
		/Diese Seite ist (?:enger|anders) als ([^,]+), weil ([^.]+)\./gi,
		planCopy,
	);
	next = next.replace(
		/Diese Seite ist breiter als ([^.]+)\./gi,
		'Das Angebot ist breiter als $1.',
	);
	next = next.replace(
		/Diese Seite ist die Buchungsseite für ([^.]+)\./gi,
		'Hier geht es um die konkrete Buchung für $1.',
	);
	next = next.replace(
		/Diese Seite bleibt allgemein für ([^;]+);/gi,
		'Das Angebot richtet sich allgemein an $1;',
	);
	next = next.replace(
		/Diese Seite bleibt näher an ([^.]+)\./gi,
		'Im Mittelpunkt steht $1.',
	);
	next = next.replace(
		/Diese Seite beantwortet ([^.]+)\./gi,
		'Im Mittelpunkt steht $1.',
	);
	next = next.replace(
		/Diese Seite sammelt ([^.]+)\./gi,
		'Hier werden $1 gebündelt.',
	);
	next = next.replace(
		/Diese Seite muss klar von ([^,]+) getrennt bleiben, weil ([^.]+)\./gi,
		planCopy,
	);
	next = next.replace(
		/Diese Seite ordnet ([^.]+) nach /gi,
		'Sinnvoll ist, $1 nach ',
	);
	next = next.replace(
		/Diese Seite betrachtet ([^.]+) als /gi,
		'$1 wirkt hier als ',
	);
	next = next.replace(/Diese Seite konzentriert sich auf /gi, 'Im Mittelpunkt stehen ');
	next = next.replace(/Diese Seite fokussiert /gi, 'Im Mittelpunkt steht ');
	next = next.replace(/Die Abgrenzung liegt bei ([^.]+)\./gi, 'Entscheidend ist: $1.');
	next = next.replace(/\bAbgrenzung\b/gi, 'Schwerpunkt');
	next = next.replace(/für SEO und Planung/gi, 'für eine verlässliche Planung');
	next = next.replace(/für SEO/gi, 'für die Planung');
	next = next.replace(/nicht zu allgemein bleiben/gi, 'den konkreten Anlass und Ablauf benennen');
	next = next.replace(/Im Mittelpunkt steht ganzer Zeremoniebogen/gi, 'Im Mittelpunkt steht der gesamte Zeremoniebogen');
	next = next.replace(/Im Mittelpunkt steht einen /gi, 'Im Mittelpunkt steht ein ');
	next = next.replace(/Im Mittelpunkt steht den /gi, 'Im Mittelpunkt steht der ');
	next = next.replace(
		/Entscheidend ist: Nicht die Menge der Stücke ist entscheidend, sondern die Funktion im Ablauf/gi,
		'Nicht die Menge der Stücke zählt, sondern ihre Funktion im Ablauf',
	);
	next = next.replace(/Entscheidend ist: roter Faden statt Einzellieder/gi, 'Entscheidend ist ein roter Faden statt einzelner Lieder');
	next = next.replace(/Entscheidend ist: direkter Kontakt zur Musikerin/gi, 'Entscheidend ist der direkte Kontakt zur Musikerin');
	next = next.replace(/Entscheidend ist: persönliche Abstimmung/gi, 'Entscheidend ist die persönliche Abstimmung');
	next = next.replace(/Entscheidend ist: flexibel mit Trauredner:in abgestimmt/gi, 'Entscheidend ist die flexible Abstimmung mit der Traurednerin oder dem Trauredner');
	next = next.replace(/Entscheidend ist: nicht jede Pause füllen/gi, 'Entscheidend ist, nicht jede Pause mit Musik zu füllen');
	next = next.replace(/gilt hier: Hier/gi, 'gilt: Hier');
	next = next.replace(
		/Bei der Planung von [^.!?]+? ist besonders wichtig:\s*/gi,
		'Besonders wichtig für die Planung: ',
	);
	next = next.replace(
		/Bei [^.!?]+? geht es zuerst um die Aufgabe der Musik\./gi,
		'Zuerst geht es um die Aufgabe der Musik.',
	);
	next = next.replace(
		/Bei [^.!?]+? geht es zuerst um die Hörsituation\./gi,
		'Zuerst geht es um die Hörsituation.',
	);
	next = next.replace(
		/Sinnvoll ist, (?:[\p{Lu}][\p{L}-]*,\s*){1,6}[\p{Lu}][\p{L}-]* nach ([^.]+)\./gu,
		'Sinnvoll ist eine Planung nach $1.',
	);
	next = next.replace(
		/(?:[\p{Lu}][\p{L}-]*(?:,\s*|\s+)){1,6}als kuratierten Moment, nicht wirkt hier als dekorative Hintergrundspur/gu,
		'Dabei wirkt die Musik als kuratierter Moment und nicht als dekorative Hintergrundspur',
	);
	next = next.replace(/Im Mittelpunkt steht der Empfang als eigenen Moment/gi, 'Im Mittelpunkt steht der Empfang als eigener Moment');

	if (next !== value && pass < 3) return replaceKnownTemplates(next, doc, pass + 1);
	return next;
}

function cleanPublicString(value, doc, pathParts) {
	if (pathParts.includes('editorNotes') || pathParts.includes('status')) return value;
	if (pathParts.at(-1) === 'route' || pathParts.at(-1) === 'pageSlug' || pathParts.at(-1) === 'intentCluster' || pathParts.at(-1) === 'src') {
		return value;
	}

	let next = replaceKnownTemplates(value, doc);

	if (GENERATED_LIST_COPY.test(next)) {
		if (pathParts.includes('paragraphs')) return DROP_PUBLIC_COPY;
		return fallbackCopy(doc, pathParts);
	}

	if (
		/^.+ passt, wenn genau dieser (?:musikalische|Lern)schwerpunkt gesucht wird\. Entscheidend sind Rolle, Ablauf, Klangwirkung und die konkrete Erwartung hinter der Anfrage\.$/i.test(next)
	) {
		return SERVICE_FIT_COPY[doc.serviceSlug] ?? SERVICE_PLAN_COPY[doc.serviceSlug] ?? SERVICE_PLAN_COPY.hochzeiten;
	}

	if (/^(?:Suchintention|Suchintent|Intent|Planungsfrage)$/i.test(next.trim())) {
		return fallbackCopy(doc, pathParts);
	}

	if (doc.pageKind === 'local' && doc.serviceSlug === 'unterricht' && TEACHING_EVENT_LANGUAGE.test(next)) {
		return teachingReplacement(doc, pathParts);
	}
	if (!next.trim()) {
		if (pathParts.includes('paragraphs')) return DROP_PUBLIC_COPY;
		return fallbackCopy(doc, pathParts);
	}
	if (!OPERATOR_LANGUAGE.test(next) && !TEMPLATE_LANGUAGE.test(next)) return next;

	if (/Was unterscheidet diese Seite/i.test(next)) {
		return doc.serviceSlug === 'unterricht'
			? 'Worauf kommt es beim Unterricht besonders an?'
			: 'Worauf kommt es bei der Planung besonders an?';
	}

	const sentences = next.split(/(?<=[.!?])\s+/).filter(Boolean);
	const cleanedSentences = sentences.filter((sentence) => {
		if (/^Redaktionell\b/i.test(sentence)) return false;
		if (/^Andere Seiten dürfen\b/i.test(sentence)) return false;
		if (/^Die klare Abgrenzung\b/i.test(sentence)) return false;
		if (/^Dadurch behalten Überschrift\b/i.test(sentence)) return false;
		if (/^So unterscheidet sich diese Seite\b/i.test(sentence)) return false;
		if (/\bdiese Seite\b/i.test(sentence)) return false;
		if (OPERATOR_LANGUAGE.test(sentence)) return false;
		return true;
	});

	next = compact(cleanedSentences.join(' '));
	if (!next || OPERATOR_LANGUAGE.test(next)) {
		if (pathParts.includes('paragraphs')) return DROP_PUBLIC_COPY;
		return fallbackCopy(doc, pathParts);
	}
	return next;
}

function transform(value, doc, pathParts = []) {
	if (Array.isArray(value)) {
		const items = value
			.map((item, index) => transform(item, doc, [...pathParts, String(index)]))
			.filter((item) => item !== DROP_PUBLIC_COPY && (typeof item !== 'string' || item.trim()));
		const uniqueItems = items.filter((item, index) =>
			typeof item !== 'string' || items.indexOf(item) === index);
		if (doc.pageKind === 'local' && doc.serviceSlug === 'unterricht' && pathParts.at(-1) === 'paragraphs') {
			return uniqueItems.map((item, index) => {
				if (typeof item !== 'string' || item !== uniqueItems[index - 1]) return item;
				const place = locationLabel(doc);
				return `Auch die Probestunde selbst wird vorbereitet: Wir prüfen das vorhandene Instrument, erste Ziele und welche Übeaufgaben bis zum nächsten Termin in ${place} realistisch sind.`;
			});
		}
		if (doc.pageKind === 'local' && doc.serviceSlug === 'unterricht' && pathParts.join('.') === 'contact.notes') {
			const seenNotes = new Set();
			return items.map((item) => {
				if (typeof item !== 'string') return item;
				if (!seenNotes.has(item)) {
					seenNotes.add(item);
					return item;
				}
				return 'Neue Notation oder besonderes Unterrichtsmaterial wird nur nach vorheriger Absprache berechnet';
			});
		}
		if (doc.pageKind === 'local' && doc.serviceSlug === 'unterricht' && pathParts.join('.') === 'faq.items') {
			const seenAnswers = new Set();
			return items.map((item) => {
				if (!item || typeof item !== 'object' || typeof item.answer !== 'string') return item;
				if (!seenAnswers.has(item.answer)) {
					seenAnswers.add(item.answer);
					return item;
				}
				const place = locationLabel(doc);
				return {
					...item,
					answer: `Der genaue Unterrichtsort ist wichtig, weil der Weg in ${place} jede Woche machbar bleiben muss. Deshalb klären wir Treffpunkt, Rhythmus und Übezeit vor dem Start.`,
				};
			});
		}
		return uniqueItems;
	}
	if (value && typeof value === 'object') {
		const transformed = Object.fromEntries(
			Object.entries(value).map(([key, child]) => [
				key,
				transform(child, doc, [...pathParts, key]),
			]),
		);
		if (
			typeof transformed.src === 'string'
			&& typeof transformed.alt === 'string'
			&& /(?:\s+-\s+Bild\s+\d+|\s+\d+)$/iu.test(transformed.alt)
			&& IMAGE_ALT_BY_SRC[transformed.src]
		) {
			transformed.alt = IMAGE_ALT_BY_SRC[transformed.src];
		}
		return transformed;
	}
	if (typeof value === 'string') return cleanPublicString(value, doc, pathParts);
	return value;
}

const changed = [];
const remaining = [];

for (const file of walkJsonFiles(CONTENT_DIR).sort()) {
	const currentSource = readFileSync(file, 'utf8');
	const relativeFile = path.relative(process.cwd(), file).replaceAll(path.sep, '/');
	const source = readFromHead
		? execFileSync('git', ['show', `HEAD:${relativeFile}`], { encoding: 'utf8' })
		: currentSource;
	const doc = JSON.parse(source);
	const transformed = transform(doc, doc);
	const output = `${JSON.stringify(transformed, null, 2)}\n`;

	if (output !== currentSource.replace(/\r\n/g, '\n')) {
		changed.push(path.relative(process.cwd(), file));
		if (writeChanges) writeFileSync(file, output, 'utf8');
	}

	const visibleCopy = JSON.stringify({
		...transformed,
		editorNotes: undefined,
		status: undefined,
	});
	if (OPERATOR_LANGUAGE.test(visibleCopy)) {
		remaining.push(path.relative(process.cwd(), file));
	}
}

console.log(`${writeChanges ? 'Updated' : 'Would update'} ${changed.length} SEO content files.`);
if (changed.length > 0) console.log(changed.slice(0, 12).join('\n'));
if (changed.length > 12) console.log(`... and ${changed.length - 12} more`);

if (remaining.length > 0) {
	console.error(`Operator language remains in ${remaining.length} files.`);
	console.error(remaining.slice(0, 20).join('\n'));
	process.exit(1);
}
