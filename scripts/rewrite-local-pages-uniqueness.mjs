import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/content/seo-pages');
const LOCAL_SEO_FILE = path.join(ROOT, 'src/lib/local-seo.ts');
const BATCH_NOTE = 'Local Uniqueness Pass 2026-06-22: lokale Seiten mit konkreterer Ortslogik, Anfrage-/Buchungsinfos, Wunschmusik- und Preisrahmen-Transparenz neu aufgebaut.';

const SERVICE_ORDER = [
	'hochzeiten',
	'beerdigungen',
	'firmenfeiern',
	'geburtstage',
	'taufen',
	'konzerte',
	'unterricht',
];

const SERVICE = {
	hochzeiten: {
		label: 'Hochzeitsmusik',
		titleSuffix: 'Viola fuer Trauung',
		metaUse: 'Solo-Viola fuer Trauung, Einzug, Auszug, Empfang und Dinner',
		heroEyebrow: 'Hochzeit',
		heroTitle: (loc) => `Hochzeitsmusik ${loc.locative}, die eure Trauung persoenlich traegt.`,
		heroLead: (loc) => `Live-Viola fuer Standesamt, Kirche, freie Trauung, Sektempfang oder Dinner ${loc.locative} - nach Ort, Ablauf, Wunschmusik und Raumklang geplant.`,
		badge: 'Anfrage kostenlos - Preise nach Rahmen',
		contexts: 'Standesamt, Kirche, freie Trauung, Schloss-, Hotel-, Garten- oder Restaurantlocation',
		moments: ['Einzug', 'Ringtausch oder Ja-Wort', 'Auszug', 'Sektempfang oder Dinner'],
		need: 'Datum, Trauort, Zeremonieform, ungefaehre Uhrzeit, Gaestezahl, Wunschmomente und erste Liedideen',
		cta: 'Hochzeitsmusik anfragen',
		contactTitle: (loc) => `Hochzeitsmusik ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Spielst du Hochzeitsmusik ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich begleite Hochzeiten ${loc.locative} mit Solo-Viola - je nach Ablauf zur Trauung, zum Einzug, zum Ringtausch, zum Auszug, zum Sektempfang oder zum Dinner.`,
		specificFaq: {
			question: 'Kann die Musik auch draussen stattfinden?',
			answer: 'Ja, wenn Wetter, Untergrund und Schutz fuer das Instrument stimmen. Eine Innenoption oder ein ueberdachter Platz ist immer sinnvoll.',
		},
	},
	beerdigungen: {
		label: 'Trauermusik',
		titleSuffix: 'Viola fuer Abschied',
		metaUse: 'wuerdevolle Viola fuer Trauerfeier, Beerdigung, Bestattung und Abschied',
		heroEyebrow: 'Beerdigung & Trauerfeier',
		heroTitle: (loc) => `Trauermusik ${loc.locative} fuer einen wuerdevollen Abschied.`,
		heroLead: (loc) => `Warme Viola-Klaenge fuer Trauerhalle, Kirche, Kapelle, Friedhof oder freie Abschiedsfeier ${loc.locative} - ruhig, behutsam und zuverlaessig abgestimmt.`,
		badge: 'Schnelle Rueckmeldung zur Verfuegbarkeit',
		contexts: 'Trauerhalle, Kirche, Kapelle, Friedhof, freie Abschiedsfeier oder privater Abschiedsraum',
		moments: ['Einzug oder Beginn', 'Moment der Erinnerung', 'Abschied am Sarg oder an der Urne', 'Gang zum Grab oder stiller Ausklang'],
		need: 'Datum, Uhrzeit, Trauerort, gewuenschte Stuecke, Kontakt zum Bestattungshaus und der geplante Ablauf',
		cta: 'Trauermusik anfragen',
		contactTitle: (loc) => `Trauermusik ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Begleitest du Trauerfeiern ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich spiele Trauermusik ${loc.locative} in Trauerhallen, Kirchen, Kapellen, am Grab oder bei freien Abschiedsfeiern.`,
		specificFaq: {
			question: 'Kann die Abstimmung ueber das Bestattungshaus laufen?',
			answer: 'Ja. Ablauf, Ankunft, Einsaetze und Stueckauswahl klaere ich gern direkt mit Bestattungshaus, Pfarrer:in oder Trauerredner:in, damit die Familie entlastet ist.',
		},
	},
	firmenfeiern: {
		label: 'Live Musik Firmenevent',
		titleSuffix: 'Live-Viola fuers Event',
		metaUse: 'dezente Solo-Viola fuer Empfang, Dinner, Jubilaeum, Messe und Kundenevent',
		heroEyebrow: 'Firmenevent',
		heroTitle: (loc) => `Live Musik fuer Firmenevents ${loc.locative}, die hochwertig wirkt und Gespraeche laesst.`,
		heroLead: (loc) => `Solo-Viola fuer Empfang, Dinner, Firmenjubilaeum, Messe, Eroeffnung oder Kundenevent ${loc.locative} - planbar, dezent und mit Rechnung.`,
		badge: 'Anfrage kostenlos - Angebot nach Rahmen',
		contexts: 'Hotel, Foyer, Showroom, Galerie, Kanzlei, Agentur, Messe-Side-Event oder Dinnerraum',
		moments: ['Ankommen der Gaeste', 'Empfang', 'Dinner oder Redenpause', 'kuratierter Programmpunkt'],
		need: 'Datum, Ort, Anlass, Gaestezahl, Zeitfenster, gewuenschte Wirkung und Rechnungsdaten',
		cta: 'Firmenevent anfragen',
		contactTitle: (loc) => `Live Musik fuer ein Firmenevent ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Spielst du auf Firmenfeiern ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich begleite Firmenfeiern, Empfaenge, Dinners, Messen, Eroeffnungen und Jubilaeen ${loc.locative} mit Solo-Viola.`,
		specificFaq: {
			question: 'Ist die Musik Hintergrund oder Programmpunkt?',
			answer: 'Beides ist moeglich. Die Viola kann Gespraeche dezent rahmen oder als kurzer kuratierter Auftritt einen offiziellen Moment tragen.',
		},
	},
	geburtstage: {
		label: 'Live Musik Geburtstag',
		titleSuffix: 'Viola fuer Feiern',
		metaUse: 'Solo-Viola fuer Geburtstag, Dinner, Empfang, Gartenfest und Ueberraschung',
		heroEyebrow: 'Geburtstag & private Feier',
		heroTitle: (loc) => `Live Musik zum Geburtstag ${loc.locative}, die persoenlich bleibt.`,
		heroLead: (loc) => `Solo-Viola fuer Geburtstage, Gartenfeste, Dinner, Sektempfang oder musikalische Ueberraschungen ${loc.locative} - abgestimmt auf Person, Raum und Stimmung.`,
		badge: 'Anfrage kostenlos - Preis nach Dauer',
		contexts: 'Restaurant, Garten, Wohnzimmer, Terrasse, Vereinsraum, Hof oder private Feierlocation',
		moments: ['Empfang', 'Ueberraschungsstaendchen', 'Dinner', 'kurzer musikalischer Schwerpunkt'],
		need: 'Datum, Ort, Anlass, Alter oder Bezug zur gefeierten Person, Gaestezahl, Wunschlied und gewuenschte Setlaenge',
		cta: 'Geburtstagsmusik anfragen',
		contactTitle: (loc) => `Live Musik zum Geburtstag ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Spielst du auf Geburtstagen ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich begleite Geburtstage und private Feiern ${loc.locative} mit Solo-Viola - vom kurzen musikalischen Geschenk bis zur laengeren Empfangs- oder Dinnermusik.`,
		specificFaq: {
			question: 'Kann die Musik als Ueberraschung geplant werden?',
			answer: 'Ja. Ankunft, Einsatz und erstes Stueck stimme ich diskret mit einer Kontaktperson ab, damit der Moment persoenlich und ruhig bleibt.',
		},
	},
	taufen: {
		label: 'Taufmusik',
		titleSuffix: 'Viola zur Taufe',
		metaUse: 'sanfte Solo-Viola fuer Taufe, Segnung, Willkommensfest und Familienfeier',
		heroEyebrow: 'Taufe',
		heroTitle: (loc) => `Taufmusik ${loc.locative} fuer einen warmen, ruhigen Anfang.`,
		heroLead: (loc) => `Live-Viola fuer Taufe, Segnung, Willkommensfest, Gottesdienst oder anschliessende Familienfeier ${loc.locative} - sanft, persoenlich und gut abgestimmt.`,
		badge: 'Anfrage kostenlos - Ablauf ruhig klaeren',
		contexts: 'Kirche, Kapelle, Gemeindehaus, Garten, Familienrestaurant oder privater Feierort',
		moments: ['Einzug', 'Taufhandlung oder Segen', 'Familienlied', 'Auszug oder Empfang'],
		need: 'Datum, Kirche oder Feierort, Ablauf, Wunschmomente, vorhandene Liedideen und Ansprechperson fuer die Abstimmung',
		cta: 'Taufmusik anfragen',
		contactTitle: (loc) => `Taufmusik ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Begleitest du Taufen ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich spiele bei Taufen, Segnungen, Willkommensfesten und Familienfeiern ${loc.locative} - in Kirche, Gemeindehaus, Garten, Restaurant oder privatem Rahmen.`,
		specificFaq: {
			question: 'Stimmst du dich mit Kirche oder Rednerin ab?',
			answer: 'Ja. Wenn gewuenscht, klaere ich Einsaetze, Dauer und Startsignale direkt mit Pfarrer:in, Musiker:in oder freier Rednerin.',
		},
	},
	konzerte: {
		label: 'Viola Konzert',
		titleSuffix: 'Viola fuer Events',
		metaUse: 'kuratiertes Viola-Programm fuer Vernissage, Lesung, Salonkonzert und Kulturabend',
		heroEyebrow: 'Konzert & Event',
		heroTitle: (loc) => `Viola Konzert ${loc.locative} fuer einen Raum, der wirklich zuhoert.`,
		heroLead: (loc) => `Kuratierte Viola-Programme fuer Vernissage, Lesung, Salonkonzert, Matinee, Empfang oder Kulturabend ${loc.locative} - passend zu Publikum, Raum und Dramaturgie.`,
		badge: 'Programm nach Anlass',
		contexts: 'Galerie, Salon, Kulturraum, Lesung, Vernissage, privater Konzertabend oder Empfang',
		moments: ['Ankommen', 'kuratierter Konzertblock', 'moderierter Uebergang', 'Ausklang oder Empfang'],
		need: 'Datum, Ort, Publikum, gewuenschte Dauer, Anlass, Programmschwerpunkt und vorhandene Technik',
		cta: 'Viola-Programm anfragen',
		contactTitle: (loc) => `Viola Konzert ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Spielst du Konzerte und Kulturformate ${loc.locative}?`,
		serviceAnswer: (loc) => `Ja. Ich gestalte Viola-Programme fuer Konzerte, Vernissagen, Lesungen, Kulturabende, private Events und Empfaenge ${loc.locative}.`,
		specificFaq: {
			question: 'Kannst du ein Programm anmoderieren?',
			answer: 'Ja. Kurze persoenliche Anmoderationen koennen ein Programm zugaenglicher machen, ohne den musikalischen Fokus zu verlieren.',
		},
	},
	unterricht: {
		label: 'Bratschenunterricht',
		titleSuffix: 'Viola lernen',
		metaUse: 'Viola- und Bratschenunterricht fuer Kinder, Erwachsene, Anfaenger:innen und Wiedereinsteiger:innen',
		heroEyebrow: 'Unterricht',
		heroTitle: (loc) => `Bratschenunterricht ${loc.locative}, der ruhig aufbaut und in deinen Alltag passt.`,
		heroLead: (loc) => `Viola lernen ${loc.locative} fuer Kinder, Erwachsene, Anfaenger:innen, Wiedereinsteiger:innen und Fortgeschrittene - mit Struktur, Geduld und klaren Uebeaufgaben.`,
		badge: 'Probestunde kostenlos & unverbindlich',
		contexts: 'regelmaessiger Einzelunterricht, Wiedereinstieg, Anfaenger:innen-Aufbau, Technikphase oder Vorbereitung auf ein Ziel',
		moments: ['Lernstand klaeren', 'Probestunde', 'Uebeplan', 'regelmaessiger Rhythmus'],
		need: 'Alter, Lernstand, vorhandenes Instrument, Ziel, moeglicher Unterrichtsrhythmus, Uebezeit und Frage zur Probestunde',
		cta: 'Probestunde anfragen',
		contactTitle: (loc) => `Bratschenunterricht ${loc.locative} anfragen`,
		serviceQuestion: (loc) => `Bietest du Bratschenunterricht ${loc.locative} an?`,
		serviceAnswer: (loc) => `Ja. Ich biete Viola- und Bratschenunterricht ${loc.locative} beziehungsweise nach Absprache in einem passenden regionalen Rahmen an.`,
		specificFaq: {
			question: 'Ist der Unterricht fuer Anfaenger:innen geeignet?',
			answer: 'Ja. Haltung, Bogenfuehrung, Rhythmus, Ton und Notenlesen werden ruhig aufgebaut, damit der erste Fortschritt nicht nur zufaellig entsteht.',
		},
	},
};

const imageAltByService = {
	hochzeiten: 'Live-Viola als Hochzeitsmusik',
	beerdigungen: 'Viola fuer Trauermusik',
	firmenfeiern: 'Live-Viola fuer ein Firmenevent',
	geburtstage: 'Live-Viola fuer eine private Feier',
	taufen: 'Live-Viola fuer Taufmusik',
	konzerte: 'Viola fuer Konzert und Kulturabend',
	unterricht: 'Bratschenunterricht und Viola lernen',
};

function main() {
	if (!existsSync(CONTENT_DIR)) throw new Error(`Missing ${CONTENT_DIR}`);
	if (!existsSync(LOCAL_SEO_FILE)) throw new Error(`Missing ${LOCAL_SEO_FILE}`);

	const locations = readLocations();
	let changed = 0;
	let localDocs = 0;

	for (const serviceSlug of SERVICE_ORDER) {
		const serviceDir = path.join(CONTENT_DIR, serviceSlug);
		if (!existsSync(serviceDir)) continue;

		for (const fileName of readdirSync(serviceDir).filter((name) => name.endsWith('.json')).sort()) {
			const file = path.join(serviceDir, fileName);
			const doc = JSON.parse(readFileSync(file, 'utf8'));
			if (doc.pageKind !== 'local') continue;
			localDocs += 1;

			const service = SERVICE[doc.serviceSlug];
			const location = locations.get(doc.pageSlug);
			if (!service || !location) continue;

			const next = cleanGermanCopy(rewriteDoc(doc, service, location));
			const before = JSON.stringify(doc, null, 2);
			const after = `${JSON.stringify(next, null, 2)}\n`;
			if (`${before}\n` !== after) {
				writeFileSync(file, after);
				changed += 1;
			}
		}
	}

	console.log(`Rewrote ${changed}/${localDocs} local SEO documents.`);
}

function readLocations() {
	const source = readFileSync(LOCAL_SEO_FILE, 'utf8');
	const map = new Map();
	const re = /\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*kind:\s*'([^']+)',\s*locative:\s*'([^']+)',\s*cue:\s*'([^']+)',\s*\}/g;
	for (const match of source.matchAll(re)) {
		const [, name, slug, kind, locative, cue] = match;
		map.set(slug, { name, slug, kind, locative, cue });
	}
	return map;
}

function rewriteDoc(doc, service, location) {
	const keyword = targetKeyword(doc, service, location);
	const images = collectImages(doc, service, location);
	const next = {
		...doc,
		targetKeyword: keyword,
		seoTitle: `${keyword} | ${service.titleSuffix}`,
		seoDescription: seoDescription(doc.serviceSlug, keyword, service, location),
		hero: {
			eyebrow: `${service.heroEyebrow} ${location.locative}`,
			title: service.heroTitle(location),
			lead: service.heroLead(location),
			badge: service.badge,
		},
		contact: buildContact(service, location),
		faq: buildFaq(service, location),
		imageAlts: images.map((image, index) => ({
			src: image.src,
			alt: `${imageAltByService[doc.serviceSlug] ?? service.label} ${location.locative} - Bild ${index + 1}`,
		})),
		editorNotes: appendNote(doc.editorNotes),
	};

	if (doc.serviceSlug === 'beerdigungen') {
		next.elegy = buildElegy(service, location);
		next.solemn = buildSolemn(service, location);
		next.split = { ...(doc.split ?? {}), sections: [] };
		next.focus = { ...(doc.focus ?? {}), items: [] };
	} else {
		next.split = buildSplit(doc, service, location, images);
		next.focus = buildFocus(service, location);
		if (doc.elegy) next.elegy = { ...doc.elegy, passages: [] };
		if (doc.solemn) next.solemn = { ...doc.solemn, cards: [], list: [] };
	}

	return next;
}

function targetKeyword(doc, service, location) {
	const label = {
		hochzeiten: 'Hochzeitsmusik',
		beerdigungen: 'Trauermusik',
		firmenfeiern: 'Live Musik Firmenevent',
		geburtstage: 'Live Musik Geburtstag',
		taufen: 'Taufmusik',
		konzerte: 'Viola Konzert',
		unterricht: 'Bratschenunterricht',
	}[doc.serviceSlug] ?? service.label;
	return `${label} ${location.name}`;
}

function seoDescription(serviceSlug, keyword, service, location) {
	const descByService = {
		hochzeiten: `${keyword}: Solo-Viola fuer Trauung, Empfang und Dinner ${location.locative}. Anfrage kostenlos, Preis nach Rahmen.`,
		beerdigungen: `${keyword}: wuerdevolle Viola fuer Trauerfeier, Beerdigung und Abschied ${location.locative}. Schnelle Rueckmeldung.`,
		firmenfeiern: `${keyword}: Solo-Viola fuer Empfang, Dinner, Jubilaeum und Messe ${location.locative}. Anfrage kostenlos.`,
		geburtstage: `${keyword}: Solo-Viola fuer Geburtstag, Dinner, Empfang und Ueberraschung ${location.locative}. Anfrage kostenlos.`,
		taufen: `${keyword}: sanfte Viola fuer Taufe, Segnung und Familienfeier ${location.locative}. Anfrage kostenlos.`,
		konzerte: `${keyword}: kuratiertes Viola-Programm fuer Vernissage, Lesung und Kulturabend ${location.locative}. Anfrage kostenlos.`,
		unterricht: `${keyword}: Viola- und Bratschenunterricht fuer Kinder, Erwachsene und Wiedereinstieg ${location.locative}. Probestunde kostenlos.`,
	};
	return descByService[serviceSlug] ?? `${keyword}: ${service.metaUse} ${location.locative}. Anfrage kostenlos.`;
}

function buildSplit(doc, service, location, images) {
	const inquiry = service.need;
	return {
		...(doc.split ?? {}),
		seal: `${location.name}\n${service.label}\nlokal geplant`,
		sections: [
			section(
				'Lokaler Rahmen',
				`${service.label} ${locLabel(location)}: worauf es vor Ort ankommt.`,
				`${localIntro(location)} Deshalb wird diese Seite nicht als reine Ortsvariante geplant, sondern vom konkreten Rahmen her: ${planningFactors(doc.serviceSlug)}.`,
				firstSectionParagraphs(doc.serviceSlug, service, location),
				imageAt(images, 0),
				false,
			),
			section(
				doc.serviceSlug === 'unterricht' ? 'Unterrichtsrahmen' : 'Ablauf',
				flowTitle(doc.serviceSlug, service, location),
				flowLede(doc.serviceSlug),
				flowParagraphs(doc.serviceSlug, service, location),
				imageAt(images, 1),
				true,
			),
			section(
				'Anfrage & Preisrahmen',
				`Was ich fuer eine gute Anfrage ${location.locative} brauche.`,
				`Die Kontaktaufnahme ist kostenlos und unverbindlich. Ein Preis entsteht erst, wenn Dauer, Ort, Aufwand, Wunschmusik, Anfahrt und Rahmen klar genug sind, damit ich ehrlich einschaetzen kann, was sinnvoll ist.`,
				requestParagraphs(doc.serviceSlug, inquiry, location),
				imageAt(images, 2),
				false,
			),
			section(
				'Beispiel',
				`Ein realistischer Ablauf ${location.locative}.`,
				exampleLede(doc.serviceSlug, location),
				[
					exampleParagraph(doc.serviceSlug, location),
					`So bleibt die Seite fuer ${location.name} praktisch: Nicht der Ortsname macht sie relevant, sondern die Entscheidungshilfen zu Raum, Timing, Wunschmusik, Kontaktperson und naechstem Schritt.`,
				],
				imageAt(images, 3),
				true,
			),
		],
	};
}

function planningFactors(serviceSlug) {
	if (serviceSlug === 'unterricht') return 'Lernstand, Unterrichtsort, Weg, Wochenrhythmus, Instrument und realistische Uebezeit';
	return 'Raum, Wege, Startsignal, Lautstaerke, Wetteroption, Wunschmusik und die Rolle der Musik';
}

function firstSectionParagraphs(serviceSlug, service, location) {
	if (serviceSlug === 'unterricht') {
		return [
			`Typische Rahmen sind ${service.contexts}. Entscheidend ist nicht nur der Ortsname, sondern ob Unterrichtsweg, Konzentration, Instrument und Uebezeit im Alltag wirklich zusammenpassen.`,
			`Ich klaere vorab praktische Punkte: moeglicher Unterrichtsort oder Treffpunkt, Instrument, Alter, Lernstand, Wochenrhythmus und Zeit zum Ueben. Diese Details machen Unterricht realistischer als ein grosses Versprechen.`,
			`Gerade ${location.locative} hilft ein klarer Aufbau: wenig Druck, genaue Klangarbeit und Aufgaben, die zwischen zwei Stunden wirklich wiederholt werden koennen.`,
		];
	}

	return [
		`Typische Rahmen sind ${service.contexts}. Je nach Ort ist entscheidend, ob Musik sammelt, einen einzelnen Moment traegt oder ueber mehrere kurze Sets Atmosphaere schafft.`,
		`Ich klaere vorab nicht nur Stuecke, sondern auch praktische Punkte: ${accessChecklist(location)}. Diese Details entscheiden oft, ob der erste Ton ruhig beginnt oder unter Zeitdruck steht.`,
		`Gerade ${location.locative} wirkt Solo-Viola stark, weil sie wenig Aufbau braucht, nah klingt und sich flexibel an kleinere Raeume, groessere Feiern oder kurze Uebergaenge anpassen laesst.`,
	];
}

function flowTitle(serviceSlug, service, location) {
	if (serviceSlug === 'unterricht') return `So wird Bratschenunterricht ${locLabel(location)} tragfaehig.`;
	return `So wird ${service.label} ${locLabel(location)} sinnvoll eingesetzt.`;
}

function flowLede(serviceSlug) {
	if (serviceSlug === 'unterricht') {
		return 'Ein guter Unterrichtsrahmen entsteht aus wenigen klaren Entscheidungen: Was ist das Ziel, wie viel Uebezeit ist realistisch und wie bleibt der naechste Schritt verstaendlich?';
	}
	return 'Ein guter lokaler Ablauf entsteht aus wenigen klaren Entscheidungen. Statt einfach eine lange Stueckliste zu spielen, legen wir fest, welche musikalischen Momente wirklich Aufgabe und Bedeutung haben.';
}

function flowParagraphs(serviceSlug, service, location) {
	if (serviceSlug === 'unterricht') {
		return [
			`Moegliche Schritte sind ${joinList(service.moments)}. Daraus entsteht kein starres Programm, sondern ein Unterrichtsplan, der zu Lernstand, Alltag und Motivation passt.`,
			`Fuer ${location.name} ist die konkrete Alltagssituation wichtig, weil ${location.cue} je nach Adresse andere Wege, Zeitfenster und Routinen bedeuten kann.`,
			'Wenn die Zeit knapp ist, wird der Unterricht nicht groesser, sondern praeziser: wenige Uebeaufgaben, deutliche Prioritaeten und ein Klangziel, das in der naechsten Stunde wieder aufgegriffen wird.',
		];
	}

	return [
		`Moegliche Einsatzpunkte sind ${joinList(service.moments)}. Daraus entsteht ein Plan, der zum Anlass passt und Pausen, Worte, Wege und Gaeste nicht ueberdeckt.`,
		`Fuer ${location.name} ist die genaue Adresse wichtig, weil ${location.cue} je nach Location andere Wege, Raumgroessen und Zeitfenster bedeuten kann.`,
		'Wenn mehrere Programmpunkte begleitet werden, plane ich kurze Spannungswechsel: ein ruhiger Beginn, ein tragender Kern und danach entweder ein heller Abschluss oder eine dezente Ruecknahme.',
	];
}

function requestParagraphs(serviceSlug, inquiry, location) {
	if (serviceSlug === 'unterricht') {
		return [
			`Hilfreich sind: ${inquiry}. Damit kann ich einschaetzen, ob eine Probestunde, ein regelmaessiger Rhythmus oder zuerst eine kurze Orientierungsphase sinnvoll ist.`,
			eventPiecePolicy(serviceSlug),
			'Die Probestunde ist kostenlos und unverbindlich. Regelmaessiger Unterricht startet erst, wenn Ziel, Format, Rhythmus und Preisrahmen transparent geklaert sind.',
		];
	}

	return [
		`Hilfreich sind: ${inquiry}. Damit kann ich Verfuegbarkeit, passenden Umfang und einen realistischen Preisrahmen einschaetzen.`,
		eventPiecePolicy(serviceSlug),
		`Es gibt kein kostenloses Vorspielen vor Ort. Stattdessen klaeren wir in der Anfrage transparent, welche Musik passt, welcher Aufwand entsteht und ob der Termin ${location.locative} machbar ist.`,
	];
}

function buildElegy(service, location) {
	return {
		quote: `Trauermusik ${location.locative} soll nicht groesser sein als der Abschied - sie soll ihn halten.`,
		passages: [
			{
				strong: 'Lokaler Rahmen',
				text: `${localIntro(location)} Fuer Trauerfeiern zaehlt vor Ort vor allem, ob der Abschied in Trauerhalle, Kirche, Kapelle, am Grab oder in einem freien Raum stattfindet. Danach richten sich Ankunft, Stuecklaenge, Position und Lautstaerke.`,
			},
			{
				strong: 'Absprache',
				text: `Eine gute Anfrage nennt ${service.need}. Wenn gewuenscht, klaere ich Ablauf und Einsaetze direkt mit Bestattungshaus, Pfarrer:in oder Trauerredner:in, damit die Familie nicht noch eine weitere organisatorische Aufgabe bekommt.`,
			},
			{
				strong: 'Wunschstueck',
				text: `${eventPiecePolicy('beerdigungen')} Gerade bei Abschieden bespreche ich vorher sehr klar, was musikalisch wuerdevoll machbar ist und welcher Aufwand entsteht.`,
			},
		],
	};
}

function buildSolemn(service, location) {
	return {
		eyebrow: `Ablauf ${location.locative}`,
		title: `Trauermusik ${location.locative} ruhig planen.`,
		lead: `Der musikalische Rahmen richtet sich nach Ort, Abschiedsform und dem, was fuer die Familie wirklich hilfreich ist.`,
		cards: [
			{
				rom: 'Vorab',
				title: 'Ein Kontakt reicht',
				poet: `Datum, Uhrzeit, Trauerort, Ablauf und Wunschstuecke genuegen fuer den ersten Schritt. Die Anfrage ist kostenlos; der Preis wird nach Rahmen und Aufwand vereinbart.`,
			},
			{
				rom: 'Vor Ort',
				title: 'Puenktlich, still, vorbereitet',
				poet: `Ich plane ${accessChecklist(location)}, damit die Musik ${location.locative} nicht unter Zeitdruck beginnt und der Abschied ruhig bleibt.`,
			},
		],
		listLabel: `Moegliche musikalische Momente ${location.locative}`,
		list: service.moments,
	};
}

function buildFocus(service, location) {
	if (service.label === 'Bratschenunterricht') return buildTeachingFocus(location);
	return {
		eyebrow: `Planung ${location.locative}`,
		title: `Vier Punkte, die ${service.label} ${location.locative} konkret machen.`,
		lead: `Diese Punkte helfen, aus einer allgemeinen Idee einen realistischen Ablauf und einen fairen Preisrahmen zu machen.`,
		items: [
			{
				time: '1',
				kicker: 'Ort',
				title: `Adresse und Raum ${location.locative} klaeren`,
				text: `Wichtig sind ${accessChecklist(location)}. So weiss ich, wie viel Zeit fuer Ankunft, Stimmen und Aufbau realistisch ist.`,
			},
			{
				time: '2',
				kicker: 'Moment',
				title: 'Musikalische Aufgabe festlegen',
				text: `Wir entscheiden, ob die Musik sammelt, einen Hoehepunkt traegt, Gespraeche begleitet oder als eigener Programmpunkt wirken soll.`,
			},
			{
				time: '3',
				kicker: 'Stuecke',
				title: 'Repertoire und Wunschmusik pruefen',
				text: eventPiecePolicyForFocus(service),
			},
			{
				time: '4',
				kicker: 'Rahmen',
				title: 'Preis und Buchung ehrlich abstimmen',
				text: `Die Anfrage ist kostenlos. Der Preis richtet sich nach Dauer, Ort, Vorbereitung, Wunschmusik, Anfahrt und Aufwand - nicht nach einem pauschalen Versprechen.`,
			},
		],
		footnote: `Fuer ${location.name} sind besonders ${accessChecklist(location)} hilfreich.`,
	};
}

function buildTeachingFocus(location) {
	return {
		eyebrow: `Planung ${location.locative}`,
		title: `Vier Punkte, die Bratschenunterricht ${location.locative} konkret machen.`,
		lead: 'Diese Punkte helfen, aus einer ersten Unterrichtsidee einen realistischen Rhythmus und einen transparenten Preisrahmen zu machen.',
		items: [
			{
				time: '1',
				kicker: 'Lernstand',
				title: 'Vorerfahrung und Ziel sortieren',
				text: 'Wir klaeren, ob es um den ersten Ton, Wiedereinstieg, Technik, Klang, Notenlesen oder ein konkretes musikalisches Ziel geht.',
			},
			{
				time: '2',
				kicker: 'Probestunde',
				title: 'Kostenlos ausprobieren',
				text: `Die Probestunde ${location.locative} ist kostenlos und unverbindlich. Danach entscheiden wir, ob Unterrichtsart, Weg und Rhythmus passen.`,
			},
			{
				time: '3',
				kicker: 'Ueben',
				title: 'Ein kleiner, klarer Wochenplan',
				text: 'Nach jeder Stunde soll klar sein, was als Naechstes wichtig ist: eine technische Aufgabe, ein musikalischer Ausschnitt und ein realistischer Uebeumfang.',
			},
			{
				time: '4',
				kicker: 'Rahmen',
				title: 'Preis und Unterrichtsformat abstimmen',
				text: 'Der Preis richtet sich nach Dauer, Rhythmus und Rahmen des Unterrichts. Das klaeren wir offen, bevor regelmaessiger Unterricht beginnt.',
			},
		],
		footnote: `Fuer ${location.name} sind Lernstand, moeglicher Unterrichtsort oder Treffpunkt, Instrument und Wochenrhythmus besonders hilfreich.`,
	};
}

function buildFaq(service, location) {
	const isTeaching = service.label === 'Bratschenunterricht';
	return {
		eyebrow: 'Gut zu wissen',
		title: `FAQ zu ${service.label} ${location.locative}`,
		items: [
			{ question: service.serviceQuestion(location), answer: service.serviceAnswer(location), open: true },
			{
				question: `Welche Angaben helfen fuer eine Anfrage ${location.locative}?`,
				answer: `Am hilfreichsten sind ${service.need}. Je konkreter diese Punkte sind, desto genauer kann ich Verfuegbarkeit, Umfang und Preisrahmen einschaetzen.`,
			},
			{
				question: isTeaching ? 'Ist die Probestunde wirklich kostenlos?' : 'Ist die Kontaktaufnahme kostenlos?',
				answer: isTeaching
					? 'Ja. Die Probestunde ist kostenlos und unverbindlich. Danach besprechen wir, ob Unterrichtsrhythmus, Ziel und Rahmen passen.'
					: 'Ja. Die Anfrage und erste Klaerung sind kostenlos und unverbindlich. Kostenloses Vorspielen vor Ort ist damit nicht gemeint.',
			},
			{
				question: isTeaching ? 'Wie werden Unterrichtspreise vereinbart?' : 'Wie entsteht der Preis?',
				answer: isTeaching
					? 'Der Preis haengt von Unterrichtsformat, Dauer, Rhythmus und Rahmen ab. Das klaeren wir nach der Probestunde oder in der Anfrage transparent.'
					: 'Der Preis richtet sich nach Dauer, Ort, Anfahrt, Vorbereitung, Wunschmusik und Aufwand. Ich nenne keinen pauschalen Fantasiepreis, sondern klaere den Rahmen persoenlich.',
			},
			{
				question: isTeaching ? 'Kann ich Wunschstuecke im Unterricht spielen?' : 'Sind Wunschstuecke moeglich?',
				answer: isTeaching
					? 'Ja. Wunschstuecke koennen motivieren, wenn sie zum Lernstand passen. Ich achte darauf, dass sie technisch sinnvoll vorbereitet werden.'
					: eventPiecePolicy(docServiceFromLabel(service.label)),
			},
			{
				question: `Was ist ${location.locative} organisatorisch wichtig?`,
				answer: `Wichtig sind ${accessChecklist(location)}. ${localIntro(location)} Diese lokalen Details beeinflussen Timing, Aufbau und die Frage, wie viel Musik sinnvoll ist.`,
			},
			service.specificFaq,
		],
	};
}

function buildContact(service, location) {
	const isTeaching = service.label === 'Bratschenunterricht';
	return {
		eyebrow: service.cta,
		title: service.contactTitle(location),
		lead: `Schreib mir kurz ${service.need}. Die Anfrage ist kostenlos und unverbindlich; danach klaeren wir Verfuegbarkeit, passenden Umfang und Preisrahmen persoenlich.`,
		checklist: isTeaching
			? [location.name, 'Lernstand', 'Probestunde', 'Preis nach Format']
			: [location.name, 'Datum & Ort', service.label, 'Preis nach Rahmen'],
		formEyebrow: 'Details senden',
		formTitle: `Verfuegbarkeit und Preisrahmen ${location.locative} klaeren`,
		formSuccess: `Danke - ich pruefe deine Anfrage ${location.locative} und melde mich persoenlich mit den naechsten Schritten.`,
	};
}

function section(eyebrow, title, lede, paragraphs, image, imageFirst) {
	return {
		eyebrow,
		title,
		lede,
		paragraphs,
		image,
		imageFirst,
	};
}

function collectImages(doc, service, location) {
	const fromSections = (doc.split?.sections ?? [])
		.map((section) => section?.image)
		.filter((image) => image?.src);
	const fromImageAlts = (doc.imageAlts ?? [])
		.map((image) => ({ src: image.src, alt: image.alt }))
		.filter((image) => image?.src);
	const images = uniqueBySrc([...fromSections, ...fromImageAlts]);
	while (images.length < 4 && images.length > 0) images.push(images[images.length % uniqueBySrc(images).length]);
	if (images.length === 0) {
		images.push({
			src: '/og-default.png',
			alt: `${imageAltByService[doc.serviceSlug] ?? service.label} ${location.locative}`,
		});
	}
	return images.slice(0, 4).map((image, index) => ({
		src: image.src,
		alt: `${imageAltByService[doc.serviceSlug] ?? service.label} ${location.locative} - Bild ${index + 1}`,
	}));
}

function uniqueBySrc(images) {
	const seen = new Set();
	return images.filter((image) => {
		if (!image?.src || seen.has(image.src)) return false;
		seen.add(image.src);
		return true;
	});
}

function imageAt(images, index) {
	return images[index % images.length];
}

function appendNote(notes = '') {
	const text = String(notes ?? '').trim();
	if (text.includes(BATCH_NOTE)) return text;
	return text ? `${text}\n\n${BATCH_NOTE}` : BATCH_NOTE;
}

function localIntro(location) {
	if (location.kind === 'city') return `${location.name} steht hier fuer konkrete Orte und Wege ${cuePhrase(location)}.`;
	if (location.kind === 'county') return `${location.name} umfasst mehrere Orte ${cuePhrase(location)}.`;
	if (location.kind === 'region') return `${location.name} ist eine groessere Region ${cuePhrase(location)}.`;
	return `${location.name} ist ein grosses Einsatzgebiet ${cuePhrase(location)}.`;
}

function cuePhrase(location) {
	if (location.cue.startsWith('zwischen ')) return location.cue;
	if (location.cue.startsWith('rund um ')) return location.cue;
	if (location.cue.startsWith('von ')) return location.cue;
	return `rund um ${location.cue}`;
}

function accessChecklist(location) {
	if (location.kind === 'city') return 'genaue Adresse, Park- oder Haltemoeglichkeit, Etage, Raum, Aufbauplatz und eine Kontaktperson vor Ort';
	if (location.kind === 'county') return 'exakte Stadt, genaue Adresse, Fahrzeit, Treffpunkt, moeglicher Ortswechsel und eine Kontaktperson vor Ort';
	if (location.kind === 'region') return 'konkrete Stadt, Fahrtstrecke, Zeitpuffer, Treffpunkt, Raumtyp und eine Kontaktperson vor Ort';
	return 'konkreter Ort in NRW, Fahrtstrecke, Zeitpuffer, Raumtyp, Ansprechpartner:in und realistischer Ablauf';
}

function locLabel(location) {
	return location.locative;
}

function joinList(items) {
	if (items.length <= 1) return items.join('');
	return `${items.slice(0, -1).join(', ')} und ${items.at(-1)}`;
}

function eventPiecePolicy(serviceSlug) {
	if (serviceSlug === 'unterricht') {
		return 'Wunschstuecke koennen Teil des Unterrichts sein, wenn sie zum Lernstand passen. Der Fokus bleibt darauf, Technik und Musik sinnvoll aufzubauen.';
	}
	return 'Eine passende Auswahl an vorhandenen Stuecken ist ohne Aufpreis moeglich. Wenn ein Wunschlied keine verwendbaren Noten hat und neu herausgehoert oder notiert werden muss, klaere ich den Zusatzaufwand vorher; als Orientierung koennen etwa 30 Euro pro Song anfallen.';
}

function eventPiecePolicyForFocus(service) {
	if (service.label === 'Bratschenunterricht') {
		return 'Wunschstuecke sind moeglich, wenn sie zum Lernstand passen. Sie werden so vorbereitet, dass Technik, Klang und Motivation zusammengehen.';
	}
	return 'Viele passende Stuecke sind ohne Aufpreis moeglich. Bei einem Lied ohne verwendbare Noten bespreche ich vorher, ob ein neues Arrangement sinnvoll ist und welcher Zusatzaufwand entsteht.';
}

function docServiceFromLabel(label) {
	return Object.entries(SERVICE).find(([, service]) => service.label === label)?.[0] ?? '';
}

function exampleLede(serviceSlug, location) {
	const map = {
		hochzeiten: `Eine Trauung ${location.locative} kann mit einem ruhigen Einzug beginnen, beim Ringtausch sehr reduziert werden und nach dem Auszug in leichte Empfangsmusik wechseln.`,
		firmenfeiern: `Ein Empfang ${location.locative} kann mit dezenter Musik starten, waehrend Gaeste ankommen, und spaeter mit einem kurzen musikalischen Akzent in Reden oder Dinner uebergehen.`,
		geburtstage: `Eine private Feier ${location.locative} kann mit einem Ueberraschungsstueck beginnen und danach in kurze Sets wechseln, die Gespraeche nicht ueberdecken.`,
		taufen: `Eine Taufe ${location.locative} kann mit einem sanften Einzug beginnen, die Taufhandlung ruhig rahmen und den Auszug oder Empfang warm oeffnen.`,
		konzerte: `Ein Kulturabend ${location.locative} kann aus einem kurzen kuratierten Block, einer persoenlichen Anmoderation und einem offenen Ausklang bestehen.`,
		unterricht: `Bratschenunterricht ${location.locative} kann mit einer Probestunde beginnen, danach einen Wochenrhythmus bekommen und mit klaren Uebeaufgaben wachsen.`,
	};
	return map[serviceSlug] ?? `Ein Termin ${location.locative} wird vom konkreten Anlass her geplant.`;
}

function exampleParagraph(serviceSlug, location) {
	const map = {
		hochzeiten: `Wenn die Location ${location.locative} mehrere Wege zwischen Trauung, Fotos und Empfang hat, plane ich lieber kuerzere, sichere Einsaetze als einen zu langen Musikblock.`,
		firmenfeiern: `Wenn Reden, Begruessung und Dinner eng getaktet sind, bleibt die Viola bewusst flexibel: wenige starke Einsaetze statt dauerhafter Beschallung.`,
		geburtstage: `Wenn das erste Stueck eine Ueberraschung ist, braucht es ein klares Signal von einer Kontaktperson, damit der Einsatz nicht zu frueh oder zu spaet kommt.`,
		taufen: `Wenn Kirche und Familienfeier an verschiedenen Orten stattfinden, klaeren wir vorher, ob ein einzelner musikalischer Schwerpunkt reicht oder ob ein zweites kurzes Set sinnvoll ist.`,
		konzerte: `Wenn Raum und Publikum eher klein sind, funktioniert ein konzentriertes Programm oft staerker als ein zu langer Abend mit zu vielen Stilen.`,
		unterricht: `Wenn Alltag, Fahrweg und Uebezeit knapp sind, ist ein realistischer Plan wichtiger als ein grosses Versprechen: lieber wenige klare Aufgaben, die wirklich wiederholt werden.`,
	};
	return map[serviceSlug] ?? `Der Ablauf wird so geplant, dass Musik, Ort und Timing zusammenpassen.`;
}

function cleanGermanCopy(value) {
	if (Array.isArray(value)) return value.map(cleanGermanCopy);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cleanGermanCopy(entry)]));
	}
	if (typeof value !== 'string') return value;

	return COPY_REPLACEMENTS.reduce((text, [from, to]) => text.replaceAll(from, to), value);
}

const COPY_REPLACEMENTS = [
	['Verfuegbarkeit', 'Verfügbarkeit'],
	['verfuegbar', 'verfügbar'],
	['fuer', 'für'],
	['Fuer', 'Für'],
	['klaeren', 'klären'],
	['klaere', 'kläre'],
	['geklaert', 'geklärt'],
	['klaert', 'klärt'],
	['Klaerung', 'Klärung'],
	['Stueckliste', 'Stückliste'],
	['Stueckauswahl', 'Stückauswahl'],
	['Wunschstuecke', 'Wunschstücke'],
	['Wunschstueck', 'Wunschstück'],
	['Stuecke', 'Stücke'],
	['Stueck', 'Stück'],
	['moeglich', 'möglich'],
	['Moegliche', 'Mögliche'],
	['moegliche', 'mögliche'],
	['moeglicher', 'möglicher'],
	['moeglichem', 'möglichem'],
	['koennen', 'können'],
	['koennte', 'könnte'],
	['koennte', 'könnte'],
	['ueber', 'über'],
	['Ueber', 'Über'],
	['Atmosphaere', 'Atmosphäre'],
	['Raeume', 'Räume'],
	['Raeumen', 'Räumen'],
	['Raumgroessen', 'Raumgrößen'],
	['groessere', 'größere'],
	['groesser', 'größer'],
	['groesseres', 'größeres'],
	['Uebergaenge', 'Übergänge'],
	['Übergaenge', 'Übergänge'],
	['Uebergang', 'Übergang'],
	['Gaeste', 'Gäste'],
	['Gespraeche', 'Gespräche'],
	['waehrend', 'während'],
	['Rueckmeldung', 'Rückmeldung'],
	['Ruecknahme', 'Rücknahme'],
	['zurueck', 'zurück'],
	['Hoehepunkt', 'Höhepunkt'],
	['traegt', 'trägt'],
	['Traegt', 'Trägt'],
	['laesst', 'lässt'],
	['haengt', 'hängt'],
	['einschaetzen', 'einschätzen'],
	['persoenlich', 'persönlich'],
	['Persoenlich', 'Persönlich'],
	['Anfaenger:innen', 'Anfänger:innen'],
	['Uebeaufgaben', 'Übeaufgaben'],
	['Uebeaufgabe', 'Übeaufgabe'],
	['Uebeplan', 'Übeplan'],
	['Uebezeit', 'Übezeit'],
	['Uebeumfang', 'Übeumfang'],
	['Ueben', 'Üben'],
	['Uebens', 'Übens'],
	['regelmaessig', 'regelmäßig'],
	['Regelmaessiger', 'Regelmäßiger'],
	['regelmaessiger', 'regelmäßiger'],
	['regelmaessigen', 'regelmäßigen'],
	['praeziser', 'präziser'],
	['praezise', 'präzise'],
	['Prioritaeten', 'Prioritäten'],
	['tragfaehig', 'tragfähig'],
	['Bogenfuehrung', 'Bogenführung'],
	['verstaendlich', 'verständlich'],
	['zufaellig', 'zufällig'],
	['Jubilaeum', 'Jubiläum'],
	['Eroeffnung', 'Eröffnung'],
	['Empfaenge', 'Empfänge'],
	['zugaenglicher', 'zugänglicher'],
	['wuerdevolle', 'würdevolle'],
	['wuerdevoll', 'würdevoll'],
	['wuerdige', 'würdige'],
	['zuverlaessig', 'zuverlässig'],
	['Puenktlich', 'Pünktlich'],
	['ungefaehre', 'ungefähre'],
	['genuegen', 'genügen'],
	['gewuenschte', 'gewünschte'],
	['gewuenschter', 'gewünschter'],
	['gewuenschten', 'gewünschten'],
	['gewuenscht', 'gewünscht'],
	['guenstig', 'günstig'],
	['vollstaendig', 'vollständig'],
	['staerker', 'stärker'],
	['pruefen', 'prüfen'],
	['pruefe', 'prüfe'],
	['Pruefung', 'Prüfung'],
	['Traeuer', 'Trauer'],
	['laengere', 'längere'],
	['kuerzere', 'kürzere'],
	['Kuerzere', 'Kürzere'],
	['Einsaetze', 'Einsätze'],
	['Einsatz', 'Einsatz'],
	['herausgehoert', 'herausgehört'],
	['Lautstaerke', 'Lautstärke'],
	['Stuecklaenge', 'Stücklänge'],
	['Stücklaenge', 'Stücklänge'],
	['zaehlt', 'zählt'],
	['grosses', 'großes'],
	['grossen', 'großen'],
	['gross', 'groß'],
	['spaeter', 'später'],
	['naechste', 'nächste'],
	['Naechste', 'Nächste'],
	['weiss', 'weiß'],
	['draussen', 'draußen'],
	['hoeren', 'hören'],
	['ueben', 'üben'],
	['oefter', 'öfter'],
];

main();
