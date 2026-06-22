import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/seo-pages');
const PASS_NOTE = 'Manual Priority Local SEO Pass 2026-06-22: redaktionell kuratierte Entscheidungsseiten mit anlassbezogener Ortslogik, Anfrage-, Preis- und Wunschmusiktransparenz.';

const SERVICES = {
	hochzeiten: {
		keyword: 'Hochzeitsmusik',
		shortLabel: 'Hochzeitsmusik',
		titleTail: 'Viola fuer Trauung',
		descriptionLead: 'Solo-Viola fuer Trauung, Empfang und Dinner',
		setting: 'Standesamt, Kirche, freie Trauung, Sektempfang oder Dinner',
		moments: 'Einzug, Ringtausch oder Ja-Wort, Unterschrift, Auszug, Empfang und Dinner',
		needs: 'Datum, genaue Adresse, Trauform, Uhrzeit, Gaestezahl, Wunschmomente, erste Liedideen und eine Kontaktperson vor Ort',
		decision: 'ob die Musik nur einen einzelnen Moment traegt oder mehrere Uebergaenge eines Hochzeitstags verbindet',
		fit: 'wenn ein warmer, solistischer Klang die Zeremonie persoenlich tragen soll, ohne den Raum zu ueberdecken',
		notFit: 'wenn laute Tanzmusik, lange Partybeschallung oder ein sehr grosses Ensemble erwartet wird',
		formatName: 'Solo-Viola',
		planQuestion: 'wann Solo-Viola wirklich passt',
		momentPlanning: 'Ich plane lieber wenige sichere Momente als einen langen Musikblock, der Wege, Reden oder Gespraeche stoert.',
		coordination: 'Vorab klaeren wir, ob vorhandenes Repertoire reicht, ob ein Wunschstueck vorbereitet werden soll und ob die Einsaetze mit Standesamt, Kirche, Redner:in, Location oder Veranstaltungsleitung abgestimmt werden muessen.',
		localPlanningClose: 'So bleibt die Musik praesent, aber sie zwingt dem Anlass kein unpassendes Format auf.',
		suitabilityEyebrow: 'Solo-Viola: passend oder nicht?',
		suitabilityTitle: 'Wann Solo-Viola die richtige Wahl ist',
		notFitAdvice: 'Dann ist es fairer, ueber DJ, Band, Technik oder ein anderes Format zu sprechen.',
		scopeCheck: 'Wenn mehrere Orte oder laengere Wartezeiten geplant sind, pruefe ich vorab, ob der Wechsel musikalisch sinnvoll ist oder ob ein klar begrenzter Einsatz besser wirkt.',
		priceFactors: 'Dauer, Ort, Anfahrt, Wartezeit, Ortswechsel, Vorbereitung und Wunschmusik',
		defaultOccasion: 'Hochzeit',
		contactEyebrow: 'Hochzeitsmusik anfragen',
		contactLabel: 'Hochzeitsmusik',
		checklist: ['Datum & Trauort', 'Ablauf', 'Wunschmusik', 'Preis nach Rahmen'],
		localImpact: 'Einlass, Aufstellung, Startsignal, Wetteroption und Ortswechsel muessen zum Trauablauf passen.',
		flowTitle: 'Von Einzug bis Empfang',
		examplePrefix: 'Eine gute Hochzeitsanfrage',
	},
	firmenfeiern: {
		keyword: 'Live Musik Firmenevent',
		shortLabel: 'Live Musik fuer Firmenevents',
		titleTail: 'Viola fuers Event',
		descriptionLead: 'Solo-Viola fuer Empfang, Dinner, Jubilaeum und Messe',
		setting: 'Empfang, Dinner, Jubilaeum, Messe, Eroeffnung oder Kundenevent',
		moments: 'Ankommen der Gaeste, Networking, Dinner, Rede-Pausen, Ehrung und ein kurzer Programmpunkt',
		needs: 'Datum, genaue Adresse, Zeitfenster, Raumgroesse, Gaestezahl, Programmpunkte, Rechnungsadresse und Kontaktperson vor Ort',
		decision: 'ob Musik dezente Atmosphaere schaffen oder einen offiziellen Programmpunkt rahmen soll',
		fit: 'wenn hochwertige, gespraechsfreundliche Live-Musik gefragt ist',
		notFit: 'wenn ein lauter Showact, Partyband-Sound oder dauerhafte Beschallung fuer mehrere Stunden erwartet wird',
		formatName: 'Solo-Viola',
		planQuestion: 'ob Solo-Viola, Zeitfenster und Lautstaerke wirklich zum Event passen',
		momentPlanning: 'Ich plane lieber klar begrenzte Musikfenster als ein Dauerprogramm, das Reden, Empfang oder Networking ueberlagert.',
		coordination: 'Vorab klaeren wir, ob Repertoire, Wunschstuecke, Reden, Technik, Catering, Empfang oder Veranstaltungsleitung miteinander abgestimmt werden muessen.',
		localPlanningClose: 'So bleibt die Musik hochwertig und gespraechsfreundlich, ohne den Ablauf des Events zu blockieren.',
		suitabilityEyebrow: 'Eventformat: passend oder nicht?',
		suitabilityTitle: 'Wann Solo-Viola fuer ein Firmenevent die richtige Wahl ist',
		notFitAdvice: 'Dann ist es fairer, ueber DJ, Band, Technik oder ein anderes Format zu sprechen.',
		scopeCheck: 'Wenn mehrere Raeume, Sicherheitswege oder Wartezeiten geplant sind, pruefe ich vorab, ob der Wechsel musikalisch sinnvoll ist oder ob ein klar begrenzter Einsatz besser wirkt.',
		priceFactors: 'Dauer, Ort, Anfahrt, Wartezeit, technische Abstimmung, Rechnungsaufwand und Wunschmusik',
		defaultOccasion: 'Firmenevent',
		contactEyebrow: 'Firmenevent anfragen',
		contactLabel: 'Live Musik Firmenevent',
		checklist: ['Ablauf', 'Raum & Gaestezahl', 'Rechnung', 'Preis nach Rahmen'],
		localImpact: 'Empfangswege, Reden, Lautstaerke und Gespraechssituation bestimmen, ob akustische Viola reicht oder ob dezente Verstaerkung sinnvoll ist.',
		flowTitle: 'Empfang, Dinner oder Programmpunkt',
		examplePrefix: 'Eine gute Eventanfrage',
	},
	geburtstage: {
		keyword: 'Live Musik Geburtstag',
		shortLabel: 'Live Musik zum Geburtstag',
		titleTail: 'Viola fuer Feiern',
		descriptionLead: 'Solo-Viola fuer Geburtstag, Dinner, Empfang und Ueberraschung',
		setting: 'runder Geburtstag, private Feier, Gartenfest, Dinner, Empfang oder Ueberraschungsstaendchen',
		moments: 'Ankommen, Toast, Ueberraschungslied, Dinner, kurze Sets und ein persoenlicher musikalischer Moment',
		needs: 'Datum, genaue Adresse, Anlass, Uhrzeit, Gaestezahl, Innen- oder Aussenbereich, Wunschstueck und eine eingeweihte Kontaktperson',
		decision: 'ob die Musik offen angekuendigt wird, als Geschenk beginnt oder den Abend ruhig begleitet',
		fit: 'wenn ein persoenlicher, eleganter Akzent gewuenscht ist',
		notFit: 'wenn Tanzflaeche, Partylautstaerke oder durchgehende Beschallung im Mittelpunkt stehen',
		formatName: 'Solo-Viola',
		planQuestion: 'ob Solo-Viola, Ueberraschung und Raum wirklich zusammenpassen',
		momentPlanning: 'Ich plane lieber einen klaren musikalischen Moment oder ein kurzes Set als Musik, die gegen Gespräche und Feierlaerm anspielen muss.',
		coordination: 'Vorab klaeren wir, ob vorhandenes Repertoire reicht, ob ein Wunschstueck vorbereitet werden soll und wer aus Familie, Gastronomie oder Freundeskreis das Startsignal gibt.',
		localPlanningClose: 'So bleibt die Musik persoenlich, ohne aus einer privaten Feier ein unpassendes Konzertformat zu machen.',
		suitabilityEyebrow: 'Geburtstagsformat: passend oder nicht?',
		suitabilityTitle: 'Wann Solo-Viola zum Geburtstag die richtige Wahl ist',
		notFitAdvice: 'Dann ist es fairer, ueber DJ, Playlist, Band oder ein anderes Format zu sprechen.',
		scopeCheck: 'Wenn Ueberraschung, Ortswechsel oder laengere Wartezeit geplant sind, pruefe ich vorab, ob der Einsatz musikalisch sinnvoll bleibt.',
		priceFactors: 'Dauer, Ort, Anfahrt, Wartezeit, Wetteroption, Wunschmusik und Diskretion bei Ueberraschungen',
		defaultOccasion: 'Geburtstag',
		contactEyebrow: 'Geburtstagsmusik anfragen',
		contactLabel: 'Live Musik Geburtstag',
		checklist: ['Anlass', 'Ueberraschung', 'Wunschstueck', 'Preis nach Rahmen'],
		localImpact: 'Ankunft, Ueberraschungsmoment, Nachbarschaftslautstaerke, Wetterschutz und Platz fuer Bogenbewegung muessen vorher klar sein.',
		flowTitle: 'Vom Staendchen bis zum Dinner',
		examplePrefix: 'Eine gute Geburtstagsanfrage',
	},
	taufen: {
		keyword: 'Taufmusik',
		shortLabel: 'Taufmusik',
		titleTail: 'Viola zur Taufe',
		descriptionLead: 'Solo-Viola fuer Taufe, Segnung, Gottesdienst und Familienfeier',
		setting: 'Taufe, Segnung, Willkommensfest, Gottesdienst oder anschliessende Familienfeier',
		moments: 'Einzug, Taufhandlung, Segen, Auszug, Empfang und ein ruhiger Familienmoment',
		needs: 'Datum, genaue Adresse, Kirche oder Feierort, Uhrzeit, Ablauf, gewuenschte Stuecke und Kontakt zur Gemeinde oder zur Ansprechperson vor Ort',
		decision: 'ob die Musik Teil des Gottesdienstes, ein Familienlied oder Begleitung des Empfangs sein soll',
		fit: 'wenn ein weicher, ruhiger Klang den Anlass waermen soll',
		notFit: 'wenn sehr laute Unterhaltung, lange Programmbloecke oder spontane Wunschlisten ohne Vorbereitung erwartet werden',
		formatName: 'Solo-Viola',
		planQuestion: 'ob Solo-Viola, Gottesdienst und Familienfeier wirklich zusammenpassen',
		momentPlanning: 'Ich plane lieber wenige ruhige Einsaetze als einen langen Musikblock, der Gottesdienst, Segnung oder Familienfeier ueberlaedt.',
		coordination: 'Vorab klaeren wir, ob vorhandenes Repertoire reicht, ob ein Familienlied vorbereitet werden soll und ob die Einsaetze mit Gemeinde, Pfarrer:in, Redner:in, Familie oder Feierort abgestimmt werden muessen.',
		localPlanningClose: 'So bleibt die Musik warm und klar eingebunden, ohne dem Anlass ein zu grosses Format aufzudruecken.',
		suitabilityEyebrow: 'Taufformat: passend oder nicht?',
		suitabilityTitle: 'Wann Solo-Viola zur Taufe die richtige Wahl ist',
		notFitAdvice: 'Dann ist es fairer, ueber Gemeindemusik, Gesang, Technik oder ein anderes Format zu sprechen.',
		scopeCheck: 'Wenn Kirche und Familienfeier an unterschiedlichen Orten stattfinden, pruefe ich vorab, ob ein Wechsel musikalisch und zeitlich sinnvoll ist.',
		priceFactors: 'Dauer, Ort, Anfahrt, Absprache mit Gemeinde oder Redner:in, Wartezeit und Wunschmusik',
		defaultOccasion: 'Taufe',
		contactEyebrow: 'Taufmusik anfragen',
		contactLabel: 'Taufmusik',
		checklist: ['Taufort', 'Ablauf', 'Familienlied', 'Preis nach Rahmen'],
		localImpact: 'Kirchenraum, Gemeindeablauf, Akustik, Kinderlautstaerke und ein moeglicher Wechsel zur Familienfeier bestimmen den musikalischen Rahmen.',
		flowTitle: 'Gottesdienst und Familienfeier',
		examplePrefix: 'Eine gute Taufanfrage',
	},
	konzerte: {
		keyword: 'Viola Konzert',
		shortLabel: 'Viola Konzert',
		titleTail: 'Viola fuer Events',
		descriptionLead: 'kuratiertes Viola-Programm fuer Vernissage, Lesung und Kulturabend',
		setting: 'Vernissage, Lesung, Salonkonzert, Kulturabend, Empfang oder privates Konzert',
		moments: 'Begruessung, konzentriertes Set, moderierter Programmpunkt, Pause und ruhiger Ausklang',
		needs: 'Datum, genaue Adresse, Format, gewuenschte Dauer, Raumgroesse, Publikum, Moderationswunsch und Kontaktperson vor Ort',
		decision: 'ob ein kurzes Rahmenprogramm oder ein eigener Konzertteil mit Dramaturgie gebraucht wird',
		fit: 'wenn ein Raum aufmerksam zuhoeren kann und ein kuratiertes Programm gefragt ist',
		notFit: 'wenn die Musik nur neben sehr lauten Gespraechen laufen oder eine Party ersetzen soll',
		formatName: 'Viola-Programm',
		planQuestion: 'welches Viola-Format wirklich zum Raum und Publikum passt',
		momentPlanning: 'Ich plane lieber ein klares Set mit Dramaturgie als eine unbestimmte Dauer, die weder Konzert noch Hintergrundmusik ist.',
		coordination: 'Vorab klaeren wir, ob Repertoire, Moderation, Licht, Sitzordnung, Technik, Pausen und Veranstaltungsleitung miteinander abgestimmt werden muessen.',
		localPlanningClose: 'So bekommt das Programm einen klaren Rahmen und bleibt fuer Publikum, Raum und Anlass nachvollziehbar.',
		suitabilityEyebrow: 'Konzertformat: passend oder nicht?',
		suitabilityTitle: 'Wann ein Viola-Programm die richtige Wahl ist',
		notFitAdvice: 'Dann ist es fairer, ueber Hintergrundmusik, DJ, Band, Technik oder ein anderes Format zu sprechen.',
		scopeCheck: 'Wenn mehrere Raeume, Umbauten oder laengere Wartezeiten geplant sind, pruefe ich vorab, ob ein klar begrenztes Set besser wirkt.',
		priceFactors: 'Dauer, Programmarbeit, Ort, Anfahrt, Moderation, Wartezeit, Technik und Wunschmusik',
		defaultOccasion: 'Konzert/Event',
		contactEyebrow: 'Konzert anfragen',
		contactLabel: 'Viola Konzert',
		checklist: ['Format', 'Programmlaenge', 'Raum', 'Preis nach Rahmen'],
		localImpact: 'Raumakustik, Sitzordnung, Licht, Publikumssituation und Technik entscheiden, ob akustische Viola traegt oder ob Verstaerkung noetig ist.',
		flowTitle: 'Programm und Raum',
		examplePrefix: 'Eine gute Konzertanfrage',
	},
	unterricht: {
		keyword: 'Bratschenunterricht',
		shortLabel: 'Bratschenunterricht',
		titleTail: 'Viola lernen',
		descriptionLead: 'Viola- und Bratschenunterricht fuer Kinder, Erwachsene und Wiedereinstieg',
		setting: 'Einzelunterricht, Probestunde, Wiedereinstieg, Technikaufbau oder Zielvorbereitung',
		moments: 'Probestunde, Lernstandscheck, Technikaufbau, Uebeplan und regelmaessiger Rhythmus',
		needs: 'Alter, Lernstand, vorhandenes Instrument, Ziel, moeglicher Unterrichtsrhythmus, Weg, Uebezeit und Frage zur Probestunde',
		decision: 'ob Weg, Alltag, Instrument und realistische Uebezeit dauerhaft zusammenpassen',
		fit: 'wenn regelmaessiger Unterricht, klare Uebeaufgaben und geduldige Klangarbeit gesucht werden',
		notFit: 'wenn ein sehr schneller Effekt ohne Ueben oder nur kurzfristige Eventmusik erwartet wird',
		formatName: 'Bratschenunterricht',
		planQuestion: 'ob Unterrichtsort, Weg, Instrument und Wochenrhythmus wirklich passen',
		momentPlanning: 'Ich plane lieber einen tragfaehigen Wochenrhythmus mit klaren Uebezielen als eine Probestunde, nach der der Alltag den Unterricht sofort ausbremst.',
		coordination: 'Vorab klaeren wir, ob Instrument, Noten, Wunschstuecke, Lernstand, Probestunde und Uebezeit realistisch zusammenpassen.',
		localPlanningClose: 'So wird Unterricht regelmaessig machbar, statt nur als einmaliger guter Vorsatz zu starten.',
		suitabilityEyebrow: 'Unterricht: passend oder nicht?',
		suitabilityTitle: 'Wann Bratschenunterricht die richtige Wahl ist',
		notFitAdvice: 'Dann ist es ehrlicher, zuerst Ziel, Format, Material oder einen spaeteren Start zu klaeren.',
		scopeCheck: 'Wenn Unterrichtsort, Weg oder Rhythmus unsicher sind, pruefe ich lieber frueh, ob eine Probestunde oder ein anderer Rahmen sinnvoller ist.',
		priceFactors: 'Dauer, Rhythmus, Format, Unterrichtsort, Vorbereitung und Materialaufwand',
		defaultOccasion: 'Unterricht',
		contactEyebrow: 'Probestunde anfragen',
		contactLabel: 'Bratschenunterricht',
		checklist: ['Lernstand', 'Probestunde', 'Rhythmus', 'Preis nach Rahmen'],
		localImpact: 'Regelmaessiger Unterricht steht und faellt mit Weg, Wochenrhythmus, Uebezeit und einem Raum, in dem konzentriertes Spielen moeglich ist.',
		flowTitle: 'Probestunde und Wochenrhythmus',
		examplePrefix: 'Eine gute Unterrichtsanfrage',
	},
};

const FUNERAL = {
	keyword: 'Trauermusik',
	shortLabel: 'Trauermusik',
	titleTail: 'Viola fuer Abschied',
	descriptionLead: 'wuerdevolle Solo-Viola fuer Trauerfeier, Beerdigung und Abschied',
	setting: 'Trauerhalle, Kirche, Kapelle, Friedhof, Bestattungshaus oder freie Abschiedsfeier',
	moments: 'Beginn, Moment der Erinnerung, Abschied am Sarg oder an der Urne, Gang zum Grab und stiller Ausklang',
	needs: 'Datum, Uhrzeit, genaue Adresse, Abschiedsform, gewuenschte Stuecke, Kontakt zum Bestattungshaus und geplanter Ablauf',
	decision: 'ob die Musik vor allem entlasten, einen stillen Moment tragen oder den Weg zum Grab begleiten soll',
	fit: 'wenn ein warmer, zurueckhaltender Klang einen Abschied tragen soll',
	notFit: 'wenn sehr laute Musik, technische Showwirkung oder spontane Stueckwechsel ohne Vorbereitung erwartet werden',
	formatName: 'Solo-Viola',
	planQuestion: 'ob Solo-Viola, Abschiedsform und Ablauf wirklich zusammenpassen',
	priceFactors: 'Dauer, Ort, Anfahrt, Wartezeit, Abstimmung mit Bestattungshaus und Wunschmusik',
	defaultOccasion: 'Trauerfeier',
	contactEyebrow: 'Trauermusik anfragen',
	contactLabel: 'Trauermusik',
	checklist: ['Datum & Trauerort', 'Ablauf', 'Wunschstuecke', 'schnelle Rueckmeldung'],
	localImpact: 'Ankunft, Raumregeln, Startsignal, Position im Raum und Abstimmung mit Bestattungshaus oder Redner:in sind wichtiger als ein Ortsname.',
};

const LOCATIONS = {
	duesseldorf: {
		displayName: 'Düsseldorf',
		locative: 'in Düsseldorf',
		priority: 'P1',
		routeReality: 'In Düsseldorf macht es einen grossen Unterschied, ob ein Termin innenstadtnah, am Rhein, linksrheinisch, in Benrath oder in einem Stadtteil weiter ausserhalb liegt.',
		arrival: 'Halte- oder Parkmoeglichkeit, genauer Eingang, Etage, Raum, Aufzug und Kontaktperson sollten vorab klar sein.',
		weddingResearch: 'Als Planungsbeispiele fuer standesamtliche Trauorte nennt die Stadt Düsseldorf unter anderem Schloss Benrath, das Stadtfenster im KAP1 und das Hetjens Museum. Das ist kein Erfahrungsbeleg, sondern ein Hinweis: Einlass, Zeitfenster, Raumregeln und Wege muessen vorab geklaert werden.',
		localExamples: 'Innenstadt, Altstadt, Rheinseite, Oberkassel, Benrath oder ein Hotel- und Restaurantumfeld',
		teaching: 'Fuer regelmaessigen Unterricht ist der Stadtteil wichtiger als der blosse Stadtname: ein Weg durch die Innenstadt fuehlt sich anders an als ein Termin im Norden, Sueden oder linksrheinisch.',
		funeral: 'Bei Trauerfeiern in Düsseldorf zaehlen vor allem genaue Adresse, Raumzugang, Bestattungshaus-Kontakt und ob Musik nur in der Halle, in der Kirche oder auch am Grab gebraucht wird.',
	},
	koeln: {
		displayName: 'Köln',
		locative: 'in Köln',
		priority: 'P1',
		routeReality: 'In Köln veraendert die Lage linksrheinisch oder rechtsrheinisch, in der Innenstadt, in einem Veedel oder weiter draussen schnell den realistischen Zeitplan.',
		arrival: 'Adresse, Stadtteil, Rheinseite, Ladepunkt, Einlass und Kontaktperson sollten frueh geklaert werden, weil Ortswechsel schnell mehr Puffer brauchen.',
		weddingResearch: 'Die Stadt Köln nennt fuer standesamtliche Trauungen unter anderem das Historische Rathaus, den Rathaus-Spanischen Bau und weitere Trauorte. Das ist kein Erfahrungsversprechen, sondern ein Planungsrahmen fuer Raum, Zeitfenster und Abstimmung.',
		localExamples: 'Innenstadt, Altstadt, Ehrenfeld, Nippes, Deutz, Porz oder ein anderes Veedel',
		teaching: 'Fuer Unterricht in Köln ist entscheidend, ob der Weg regelmaessig machbar bleibt - besonders, wenn die Rheinseite gewechselt wird oder die Stunde nach Schule oder Arbeit liegen soll.',
		funeral: 'Bei Trauerfeiern in Köln sollte frueh klar sein, ob die Musik in Trauerhalle, Kirche, Kapelle, freiem Raum oder am Grab stattfindet und wer vor Ort das Startsignal gibt.',
	},
	wuppertal: {
		displayName: 'Wuppertal',
		locative: 'in Wuppertal',
		priority: 'P1',
		routeReality: 'In Wuppertal ist die konkrete Lage zwischen Elberfeld, Barmen, Vohwinkel, Cronenberg, Ronsdorf oder einer Hoehenlage fuer Timing und Aufbau wichtiger als die reine Entfernung.',
		arrival: 'Stufen, Aufzug, Haltemoeglichkeit, Weg vom Parkplatz zum Raum und Wetterpuffer sollten nicht erst am Termin auffallen.',
		weddingResearch: 'Die Stadt Wuppertal nennt fuer Eheschliessungen klassische und moderne Trausaele im Barmer Rathaus sowie Ambiente-Trauorte. Das ist kein Hinweis auf bisherige Auftritte, sondern ein Beispiel dafuer, warum Raum, Zeitfenster und Wege vorher geklaert werden muessen.',
		localExamples: 'Elberfeld, Barmen, Vohwinkel, Cronenberg, Ronsdorf oder eine Feier in Hoehenlage',
		teaching: 'Fuer Unterricht in Wuppertal zaehlt, ob der Weg durch die Talachse oder auf die Hoehen regelmaessig realistisch bleibt und ob genug Ruhe fuer die Stunde vorhanden ist.',
		funeral: 'Bei Trauerfeiern in Wuppertal sind Zugang, Wetter, Hanglage, Raumgroesse und die Abstimmung mit Bestattungshaus oder Redner:in besonders wichtig.',
	},
	essen: {
		displayName: 'Essen',
		locative: 'in Essen',
		priority: 'P2',
		routeReality: 'In Essen fuehlt sich ein Termin in Innenstadtnaehe anders an als ein Anlass im Sueden, in Rüttenscheid, an einer Ruhrgebietsachse oder in einem ruhigeren Stadtteil.',
		arrival: 'Adresse, Anfahrtsfenster, Park- oder Ladepunkt und Raumzugang sollten vorab benannt werden.',
		localExamples: 'Innenstadtnaehe, Essener Sueden, Rüttenscheid, Firmenraeume oder private Feierorte',
		teaching: 'Fuer Unterricht in Essen muss der Wochenrhythmus zum Weg zwischen Schule, Arbeit, Zuhause und Uebezeit passen.',
		funeral: 'Bei Trauerfeiern in Essen zaehlt vor allem die klare Abstimmung mit Bestattungshaus, Trauerort und Ankunftszeit.',
	},
	duisburg: {
		displayName: 'Duisburg',
		locative: 'in Duisburg',
		priority: 'P2',
		routeReality: 'In Duisburg koennen Rheinnaehe, Innenhafen, groessere Distanzen im Stadtgebiet und der Uebergang Richtung Niederrhein oder Ruhrgebiet den Ablauf beeinflussen.',
		arrival: 'Genauer Stadtteil, Zugang zum Raum, Haltemoeglichkeit und ein realistisches Zeitfenster sind fuer den Musikbeginn wichtig.',
		localExamples: 'Innenstadt, Innenhafen, Rheinnaehe, Ruhrort, private Raeume oder Firmenumfeld',
		teaching: 'Fuer Unterricht in Duisburg ist der regelmaessige Weg entscheidend, nicht nur die Entfernung auf der Karte.',
		funeral: 'Bei Trauerfeiern in Duisburg helfen genaue Adresse, Friedhofs- oder Raumbezeichnung und Kontakt zum Bestattungshaus.',
	},
	bochum: {
		displayName: 'Bochum',
		locative: 'in Bochum',
		priority: 'P2',
		routeReality: 'In Bochum macht es fuer Timing und Lautstaerke einen Unterschied, ob der Anlass eher innenstadtnah, im Sueden, in einem Kulturraum, in einer Kirche oder privat stattfindet.',
		arrival: 'Einlass, Ladepunkt, Raumgroesse und Kontaktperson sollten vorab geklaert sein.',
		localExamples: 'Innenstadt, Bochumer Sueden, Kulturraeume, private Feiern oder Unternehmensumfeld',
		teaching: 'Fuer Unterricht in Bochum zaehlen Wochenrhythmus, Weg und ein ruhiger Raum mehr als ein grosser Anspruch zum Start.',
		funeral: 'Bei Trauerfeiern in Bochum sollte klar sein, ob die Musik in Halle, Kirche, Kapelle oder am Grab gebraucht wird.',
	},
	dortmund: {
		displayName: 'Dortmund',
		locative: 'in Dortmund',
		priority: 'P2',
		routeReality: 'In Dortmund koennen Innenstadt, Hörde, Dortmunder Sueden, groessere Eventraeume und weitere Wege im Stadtgebiet den Zeitplan deutlich veraendern.',
		arrival: 'Adresse, Einfahrt, Ladepunkt, Raum, Sicherheits- oder Empfangskontakt und Wartezeit sollten vorher feststehen.',
		localExamples: 'Innenstadt, Hörde, Dortmunder Sueden, Business-Raeume oder private Feierorte',
		teaching: 'Fuer Unterricht in Dortmund muss der Weg regelmaessig tragfaehig bleiben, sonst hilft auch ein guter Start nicht langfristig.',
		funeral: 'Bei Trauerfeiern in Dortmund sind pünktliche Ankunft, klare Raumbezeichnung und ein Ansprechpartner vor Ort besonders wichtig.',
	},
	solingen: {
		displayName: 'Solingen',
		locative: 'in Solingen',
		priority: 'P2',
		routeReality: 'In Solingen spielen bergische Wege, Stadtteile wie Mitte, Gräfrath oder Ohligs und moegliche Hoehenlagen fuer Ankunft und Aufbau eine echte Rolle.',
		arrival: 'Haltemoeglichkeit, Stufen, Raumzugang und Wetterschutz sollten vorab geklaert werden.',
		localExamples: 'Mitte, Gräfrath, Ohligs, bergische Feierorte oder private Raeume',
		teaching: 'Fuer Unterricht in Solingen sollte der Weg im Alltag klein genug bleiben, damit Ueben und Stunde zusammen funktionieren.',
		funeral: 'Bei Trauerfeiern in Solingen sind genaue Adresse, Zugang und Wetterpuffer fuer Musik in Halle, Kirche oder am Grab wichtig.',
	},
	remscheid: {
		displayName: 'Remscheid',
		locative: 'in Remscheid',
		priority: 'P2',
		routeReality: 'In Remscheid koennen Hoehenlage, Lennep, Lüttringhausen oder ein bergischer Feierort mehr Zeit fuer Anfahrt und Aufbau brauchen.',
		arrival: 'Park- oder Haltemoeglichkeit, Eingang, Stufen, Raumgroesse und Ansprechpartner sollten vorab feststehen.',
		localExamples: 'Lennep, Lüttringhausen, Innenstadt, bergische Raeume oder private Feiern',
		teaching: 'Fuer Unterricht in Remscheid zaehlt, ob Weg, Uebezeit und Wochenrhythmus auch im Alltag stabil bleiben.',
		funeral: 'Bei Trauerfeiern in Remscheid helfen genaue Raumangaben und eine klare Abstimmung mit Bestattungshaus oder Redner:in.',
	},
	neuss: {
		displayName: 'Neuss',
		locative: 'in Neuss',
		priority: 'P2',
		routeReality: 'In Neuss ist wichtig, ob der Termin innenstadtnah, rheinnah, im Rhein-Kreis Neuss oder in Verbindung mit Düsseldorf geplant wird.',
		arrival: 'Genaue Adresse, Zufahrt, Stadtteil, Raum und ein Ansprechpartner vor Ort machen den Zeitplan realistisch.',
		localExamples: 'Innenstadt, Rheinnaehe, Rhein-Kreis Neuss, private Raeume oder Wege nach Düsseldorf',
		teaching: 'Fuer Unterricht in Neuss muss der Weg regelmaessig funktionieren, besonders wenn Alltag und Pendeln Richtung Düsseldorf oder Rheinland dazukommen.',
		funeral: 'Bei Trauerfeiern in Neuss sollte frueh klar sein, ob die Musik nur im Raum oder auch am Grab gebraucht wird.',
	},
	mettmann: {
		displayName: 'Mettmann',
		locative: 'in Mettmann',
		priority: 'P2',
		routeReality: 'In Mettmann sind kurze Wege im Kreis Mettmann ein Vorteil, trotzdem entscheiden genaue Adresse, Raumzugang und Ortsteil ueber den Ablauf.',
		arrival: 'Haltemoeglichkeit, Raum, Etage, Kontaktperson und ein kleiner Zeitpuffer sollten vorab geklaert werden.',
		localExamples: 'Mettmann, Kreis Mettmann, Erkrath, Hilden, Ratingen oder ein ruhiger privater Rahmen',
		teaching: 'Fuer Unterricht in Mettmann ist ein realistischer Wochenrhythmus oft wichtiger als die perfekte erste Motivation.',
		funeral: 'Bei Trauerfeiern in Mettmann hilft eine fruehe Abstimmung mit Bestattungshaus, Kirche oder Redner:in.',
	},
	hilden: {
		displayName: 'Hilden',
		locative: 'in Hilden',
		priority: 'P2',
		routeReality: 'In Hilden sind die Wege oft gut planbar, aber die Naehe zu Düsseldorf, Erkrath und Langenfeld kann je nach Uhrzeit trotzdem Puffer brauchen.',
		arrival: 'Adresse, Zufahrt, Raumzugang und Ansprechpartner sollten vorab klar sein.',
		localExamples: 'Hilden, Kreis Mettmann, kurze Wege Richtung Düsseldorf, Erkrath oder Langenfeld',
		teaching: 'Fuer Unterricht in Hilden sollte der Termin so liegen, dass Ueben, Schule, Arbeit und Weg zusammenpassen.',
		funeral: 'Bei Trauerfeiern in Hilden sind genaue Raumangaben und eine ruhige Ankunft wichtiger als ein grosser musikalischer Aufwand.',
	},
	erkrath: {
		displayName: 'Erkrath',
		locative: 'in Erkrath',
		priority: 'P2',
		routeReality: 'In Erkrath machen Alt-Erkrath, Hochdahl, Unterfeldhaus und die Naehe zu Düsseldorf fuer Wege und Puffer einen Unterschied.',
		arrival: 'Genauer Ortsteil, Park- oder Haltemoeglichkeit, Raumzugang und Kontaktperson sollten vorab feststehen.',
		localExamples: 'Alt-Erkrath, Hochdahl, Unterfeldhaus, Kreis Mettmann oder Naehe Düsseldorf',
		teaching: 'Fuer Unterricht in Erkrath ist die Frage, ob der Weg regelmaessig klein genug bleibt, besonders wichtig.',
		funeral: 'Bei Trauerfeiern in Erkrath sollte klar sein, ob Musik im Raum, in der Kirche oder zusaetzlich am Grab gebraucht wird.',
	},
	ratingen: {
		displayName: 'Ratingen',
		locative: 'in Ratingen',
		priority: 'P2',
		routeReality: 'In Ratingen koennen Innenstadt, Lintorf, Hösel, Tiefenbroich oder Wege Richtung Düsseldorf-Nord den Ablauf veraendern.',
		arrival: 'Stadtteil, Zufahrt, Raumzugang, Park- oder Haltemoeglichkeit und Kontaktperson sollten vorab klar sein.',
		localExamples: 'Innenstadt, Lintorf, Hösel, Tiefenbroich oder Düsseldorf-Nord',
		teaching: 'Fuer Unterricht in Ratingen muss der Weg regelmaessig zu Schule, Arbeit und Uebezeit passen.',
		funeral: 'Bei Trauerfeiern in Ratingen helfen genaue Angaben zu Halle, Kirche, Kapelle oder Grabstelle und ein klarer Ansprechpartner.',
	},
	leverkusen: {
		displayName: 'Leverkusen',
		locative: 'in Leverkusen',
		priority: 'P2',
		routeReality: 'In Leverkusen sind Opladen, Wiesdorf, Rheinnaehe und die Achse zwischen Köln und Düsseldorf fuer Zeitplanung und Anfahrt relevant.',
		arrival: 'Adresse, Ortsteil, Einlass, Raum und Ladepunkt sollten vorab geklaert werden.',
		localExamples: 'Opladen, Wiesdorf, Rheinnaehe, Köln-Düsseldorf-Achse oder privater Feierort',
		teaching: 'Fuer Unterricht in Leverkusen sollte der Rhythmus zum Alltag und moeglichen Wegen Richtung Köln oder Düsseldorf passen.',
		funeral: 'Bei Trauerfeiern in Leverkusen sind genaue Raumangaben und Kontakt zum Bestattungshaus entscheidend.',
	},
	moenchengladbach: {
		displayName: 'Mönchengladbach',
		locative: 'in Mönchengladbach',
		priority: 'P2',
		routeReality: 'In Mönchengladbach koennen Innenstadt, Rheydt, Wickrath und Wege am linken Niederrhein den Ablauf unterschiedlich praegen.',
		arrival: 'Ortsteil, Park- oder Haltemoeglichkeit, Raumzugang und Kontaktperson sollten frueh klar sein.',
		localExamples: 'Innenstadt, Rheydt, Wickrath, linker Niederrhein oder private Raeume',
		teaching: 'Fuer Unterricht in Mönchengladbach ist wichtig, ob der Weg im Wochenrhythmus dauerhaft machbar bleibt.',
		funeral: 'Bei Trauerfeiern in Mönchengladbach hilft eine klare Abstimmung zu Raum, Beginn, Stuecken und Ansprechpartner vor Ort.',
	},
};

const TARGET_LOCATIONS = Object.keys(LOCATIONS);
const TARGET_SERVICES = ['hochzeiten', 'beerdigungen', 'unterricht', 'firmenfeiern', 'geburtstage', 'taufen', 'konzerte'];

function serviceProfile(serviceSlug) {
	return serviceSlug === 'beerdigungen' ? FUNERAL : SERVICES[serviceSlug];
}

function suitabilityTitleFor(profile, location) {
	const suffix = ' die richtige Wahl ist';
	if (profile.suitabilityTitle.endsWith(suffix)) {
		return `${profile.suitabilityTitle.slice(0, -suffix.length)} ${location.locative}${suffix}.`;
	}
	return `${profile.suitabilityTitle} ${location.locative}.`;
}

function fileFor(serviceSlug, locationSlug) {
	return path.join(CONTENT_DIR, serviceSlug, `${locationSlug}.json`);
}

function readJson(file) {
	return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, doc) {
	writeFileSync(file, `${JSON.stringify(polishGermanText(doc), null, 2)}\n`, 'utf8');
}

function polishGermanText(value) {
	if (Array.isArray(value)) return value.map(polishGermanText);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, polishGermanText(item)]));
	}
	if (typeof value !== 'string') return value;
	return [
		[/\bFuer\b/g, 'Für'],
		[/\bfuer\b/g, 'für'],
		[/\bFuehr/g, 'Führ'],
		[/\bfuehr/g, 'führ'],
		[/\bFue/g, 'Fü'],
		[/\bfue/g, 'fü'],
		[/\bGaeste\b/g, 'Gäste'],
		[/\bGast(e|es)?\b/g, 'Gast$1'],
		[/\bUeber/g, 'Über'],
		[/\bueber/g, 'über'],
		[/\bUebe/g, 'Übe'],
		[/\buebe/g, 'übe'],
		[/\bAnfaenger/g, 'Anfänger'],
		[/\banfaenger/g, 'anfänger'],
		[/\bmoeg/g, 'mög'],
		[/\bMoeg/g, 'Mög'],
		[/\bkoenn/g, 'könn'],
		[/\bKoenn/g, 'Könn'],
		[/\bwuerd/g, 'würd'],
		[/\bWuerd/g, 'Würd'],
		[/\bfrueh/g, 'früh'],
		[/\bFrueh/g, 'Früh'],
		[/\brueck/g, 'rück'],
		[/\bRueck/g, 'Rück'],
		[/\bduerf/g, 'dürf'],
		[/\bDuerf/g, 'Dürf'],
		[/\bmuess/g, 'müss'],
		[/\bMuess/g, 'Müss'],
		[/\bzaehl/g, 'zähl'],
		[/\bZaehl/g, 'Zähl'],
		[/\bpraeg/g, 'präg'],
		[/\bPraeg/g, 'Präg'],
		[/\bdraeng/g, 'dräng'],
		[/\bDraeng/g, 'Dräng'],
		[/\bwaerm/g, 'wärm'],
		[/\bWaerm/g, 'Wärm'],
		[/\blaeng/g, 'läng'],
		[/\bLaeng/g, 'Läng'],
		[/\bstaend/g, 'ständ'],
		[/\bStaend/g, 'Ständ'],
		[/\bspontane Stueck/g, 'spontane Stück'],
		[/\bStueck/g, 'Stück'],
		[/\bstueck/g, 'stück'],
		[/\bStuecke/g, 'Stücke'],
		[/\bstuecke/g, 'stücke'],
		[/\bRaeum/g, 'Räum'],
		[/\braeum/g, 'räum'],
		[/\bRaumgroesse\b/g, 'Raumgröße'],
		[/\bgross/g, 'groß'],
		[/\bGross/g, 'Groß'],
		[/\bgroess/g, 'größ'],
		[/\bGroess/g, 'Größ'],
		[/\bSueden\b/g, 'Süden'],
		[/\bSued/g, 'Süd'],
		[/\bsued/g, 'süd'],
		[/\bHoeh/g, 'Höh'],
		[/\bhoeh/g, 'höh'],
		[/\bEroeffnung/g, 'Eröffnung'],
		[/\beroeffnung/g, 'eröffnung'],
		[/\bVerstaerk/g, 'Verstärk'],
		[/\bverstaerk/g, 'verstärk'],
		[/\bstaerk/g, 'stärk'],
		[/\bStaerk/g, 'Stärk'],
		[/\bLautstaerke/g, 'Lautstärke'],
		[/\blautstaerke/g, 'lautstärke'],
		[/Staerke/g, 'Stärke'],
		[/staerke/g, 'stärke'],
		[/\bJubilaeum/g, 'Jubiläum'],
		[/\bUeberrasch/g, 'Überrasch'],
		[/\bueberrasch/g, 'überrasch'],
		[/\bGespraech/g, 'Gespräch'],
		[/\bgespraech/g, 'gespräch'],
		[/\bklaer/g, 'klär'],
		[/\bKlaer/g, 'Klär'],
		[/\bserioes/g, 'seriös'],
		[/\bSerioes/g, 'Seriös'],
		[/\bVerfuegbarkeit/g, 'Verfügbarkeit'],
		[/\bverfuegbarkeit/g, 'verfügbarkeit'],
		[/\beinschaetz/g, 'einschätz'],
		[/\bEinschaetz/g, 'Einschätz'],
		[/\bzusaetz/g, 'zusätz'],
		[/\bZusaetz/g, 'Zusätz'],
		[/\bAnsprechperson\b/g, 'Ansprechperson'],
		[/\bregelmaessig/g, 'regelmäßig'],
		[/\bRegelmaessig/g, 'Regelmäßig'],
		[/\bmaessig/g, 'mäßig'],
		[/\bMaessig/g, 'Mäßig'],
		[/\bAussen/g, 'Außen'],
		[/\baussen/g, 'außen'],
		[/\bNaehe/g, 'Nähe'],
		[/\bnaehe/g, 'nähe'],
		[/Naehe/g, 'Nähe'],
		[/naehe/g, 'nähe'],
		[/\bausser/g, 'außer'],
		[/\bAusser/g, 'Außer'],
		[/\bheisst/g, 'heißt'],
		[/\bHeisst/g, 'Heißt'],
		[/\bnoet/g, 'nöt'],
		[/\bNoet/g, 'Nöt'],
		[/\bpersoen/g, 'persön'],
		[/\bPersoen/g, 'Persön'],
		[/\bschoen/g, 'schön'],
		[/\bSchoen/g, 'Schön'],
		[/\bblosse/g, 'bloße'],
		[/\bBlosse/g, 'Bloße'],
		[/\btraegt/g, 'trägt'],
		[/\bTraegt/g, 'Trägt'],
		[/\bpraesent/g, 'präsent'],
		[/\bPraesent/g, 'Präsent'],
		[/\bUeberg/g, 'Überg'],
		[/\bueberg/g, 'überg'],
		[/\bTuer/g, 'Tür'],
		[/\btuer/g, 'tür'],
	].reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function appendNote() {
	return PASS_NOTE;
}

function titleFor(serviceSlug, location) {
	const profile = serviceProfile(serviceSlug);
	return `${profile.keyword} ${location.displayName} | ${profile.titleTail}`;
}

function descriptionFor(serviceSlug, location) {
	const profile = serviceProfile(serviceSlug);
	const shortLead = {
		hochzeiten: 'Solo-Viola fuer Trauung, Empfang und Dinner',
		beerdigungen: 'wuerdevolle Viola fuer Trauerfeier und Abschied',
		firmenfeiern: 'Solo-Viola fuer Empfang, Dinner und Business-Event',
		geburtstage: 'Solo-Viola fuer Geburtstag, Dinner und Ueberraschung',
		taufen: 'Solo-Viola fuer Taufe, Segnung und Familienfeier',
		konzerte: 'Viola-Programm fuer Vernissage, Lesung und Kulturabend',
		unterricht: 'Viola- und Bratschenunterricht fuer Kinder und Erwachsene',
	}[serviceSlug];
	return `${profile.keyword} ${location.displayName}: ${shortLead} ${location.locative}. Ablauf, Wunschmusik und Preis transparent klaeren.`;
}

function heroFor(serviceSlug, location) {
	const profile = serviceProfile(serviceSlug);
	if (serviceSlug === 'beerdigungen') {
		return {
			eyebrow: `Beerdigung & Trauerfeier ${location.locative}`,
			title: `Trauermusik ${location.locative}: ruhig geplant, nicht nur gebucht.`,
			lead: `${profile.descriptionLead} ${location.locative}. Im Mittelpunkt stehen genauer Ort, Ablauf, Abstimmung mit Bestattungshaus oder Redner:in und ein Klang, der nicht draengt.`,
			badge: 'Schnelle Rueckmeldung zur Verfuegbarkeit',
		};
	}
	return {
		eyebrow: `${profile.contactLabel} ${location.locative}`,
		title: `${profile.shortLabel} ${location.locative}: konkret geplant nach Ort und Ablauf.`,
		lead: `${profile.descriptionLead} ${location.locative}. Geplant wird nach Ort, Ablauf, Raumklang, Wunschmusik, Anfahrt und der Frage, ${profile.planQuestion}.`,
		badge: serviceSlug === 'unterricht' ? 'Probestunde kostenlos & unverbindlich' : 'Anfrage kostenlos - Preis nach Rahmen',
	};
}

function collectImages(doc) {
	const sectionImages = (doc.split?.sections ?? [])
		.map((section) => section?.image)
		.filter((image) => image?.src);
	const altImages = (doc.imageAlts ?? [])
		.map((image) => ({ src: image.src, alt: image.alt }))
		.filter((image) => image?.src);
	const images = sectionImages.length ? sectionImages : altImages;
	if (!images.length) {
		return [
			{ src: '/uploads/mq0uvv7v-20250327-DSC01550.webp', alt: 'Live-Viola' },
			{ src: '/uploads/mq0uvva2-20250327-DSC01714.webp', alt: 'Viola' },
		];
	}
	return images;
}

function imageAt(images, index, alt) {
	const image = images[index % images.length];
	return { src: image.src, alt };
}

function splitSectionsFor(serviceSlug, location, images) {
	const profile = SERVICES[serviceSlug];
	const localTeaching = serviceSlug === 'unterricht' ? location.teaching : location.routeReality;
	const contextParagraph = serviceSlug === 'unterricht'
		? localTeaching
		: `${location.routeReality} Fuer ${profile.shortLabel} heisst das: ${profile.localImpact}`;
	const researchedParagraph = serviceSlug === 'hochzeiten' && location.weddingResearch
		? [location.weddingResearch]
		: [];
	const outdoorParagraph = serviceSlug === 'unterricht'
		? 'Wenn ein Unterrichtsort vorgeschlagen wird, pruefe ich lieber frueh, ob Raum, Lautstaerke, Notenstaender, Sitzmoeglichkeit und Wiederholbarkeit des Weges passen.'
		: 'Bei Aussenbereichen gilt: trockener, schattiger Stand, stabiler Untergrund und eine Innenoption sind fuer ein Streichinstrument wichtiger als ein besonders schoener Hintergrund.';

	return [
		{
			eyebrow: 'Lokaler Rahmen',
			title: `${profile.shortLabel} ${location.locative}: was vor Ort wirklich zaehlt.`,
			lede: `${contextParagraph} Es geht nicht darum, moeglichst viele Ortsnamen zu nennen, sondern den konkreten Rahmen fuer Musik realistisch zu planen.`,
			paragraphs: [
				`Typische Situationen ${location.locative} koennen ${location.localExamples} sein. Entscheidend ist, ob Gaeste sitzen oder stehen, wie laut gesprochen wird, wo die Viola aufgebaut werden kann und wer vor Ort das Startsignal gibt.`,
				`${location.arrival} Ohne diese Punkte bleibt ein Angebot ungenau, weil Anfahrt, Aufbau, Wartezeit und moegliche Ortswechsel den Aufwand veraendern.`,
				...researchedParagraph,
			],
			image: imageAt(images, 0, `${profile.shortLabel} ${location.locative} - lokaler Planungsrahmen`),
			imageFirst: false,
		},
		{
			eyebrow: 'Ablauf',
			title: `${profile.flowTitle} ${location.locative}.`,
			lede: `Ein sinnvoller Ablauf entsteht aus der Aufgabe der Musik: ${profile.decision}.`,
			paragraphs: [
				`Moegliche Einsatzpunkte sind ${profile.moments}. ${profile.momentPlanning}`,
				profile.coordination,
				`Gerade ${location.locative} hilft ein Ablaufplan mit Uhrzeiten, Ansprechpartner und Puffer. ${profile.localPlanningClose}`,
			],
			image: imageAt(images, 1, `${profile.shortLabel} ${location.locative} - Ablauf und Einsaetze`),
			imageFirst: true,
		},
		{
			eyebrow: profile.suitabilityEyebrow,
			title: suitabilityTitleFor(profile, location),
			lede: `${profile.formatName} passt, ${profile.fit}. Das passt nicht automatisch zu jedem Anliegen - und genau das sollte vor der Buchung klar sein.`,
			paragraphs: [
				`Nicht ideal ist ${profile.formatName}, ${profile.notFit}. ${profile.notFitAdvice}`,
				outdoorParagraph,
				profile.scopeCheck,
			],
			image: imageAt(images, 2, `${profile.shortLabel} ${location.locative} - passend planen`),
			imageFirst: false,
		},
		{
			eyebrow: 'Anfrage & Preisrahmen',
			title: `Was ich fuer eine serioese Anfrage ${location.locative} brauche.`,
			lede: `${profile.examplePrefix} nennt ${profile.needs}. Erst damit lassen sich Verfuegbarkeit, sinnvoller Umfang und Preisrahmen ehrlich einschaetzen.`,
			paragraphs: [
				`Der Preis richtet sich nach ${profile.priceFactors}. Eine erste Anfrage ist kostenlos und unverbindlich; ein verbindliches Angebot entsteht erst, wenn der Rahmen klar ist.`,
				`Vorhandenes Repertoire ist ohne Aufpreis moeglich. Wenn ein Wunschstueck keine brauchbaren Noten hat und neu herausgehoert oder notiert werden muss, klaere ich den Zusatzaufwand vorher; als Orientierung koennen etwa 30 Euro pro Song anfallen.`,
				`Zusaetzlich kosten koennen laengere Wartezeiten, kurzfristige Verlaengerungen, ein zweiter Spielort, besondere Technik oder sehr kurzfristige Neunotation. Es gibt kein kostenloses Vorspielen vor Ort; die musikalische Passung klaeren wir transparent in der Anfrage.`,
			],
			image: imageAt(images, 3, `${profile.shortLabel} ${location.locative} - Anfrage und Preisrahmen`),
			imageFirst: true,
		},
	];
}

function focusFor(serviceSlug, location) {
	const profile = SERVICES[serviceSlug];
	const isTeaching = serviceSlug === 'unterricht';
	return {
		eyebrow: `Planung ${location.locative}`,
		title: `Vier Entscheidungen, die ${profile.shortLabel} ${location.locative} konkret machen.`,
		lead: 'Diese Punkte helfen, aus einer allgemeinen Idee einen realistischen Ablauf und einen fairen Preisrahmen zu machen.',
		items: [
			{
				time: '1',
				kicker: isTeaching ? 'Lernstand' : 'Ort',
				title: isTeaching ? 'Lernstand und Ziel klaeren' : 'Adresse, Raum und Zugang klaeren',
				text: isTeaching
					? `Wichtig sind Alter, Vorerfahrung, vorhandenes Instrument, Ziel und die Frage, ob der Weg ${location.locative} regelmaessig machbar bleibt.`
					: `${location.arrival} Das beeinflusst Ankunft, Aufbau, Stimmen, Wartezeit und die Frage, ob ein Ortswechsel sinnvoll ist.`,
			},
			{
				time: '2',
				kicker: 'Aufgabe',
				title: isTeaching ? 'Probestunde realistisch nutzen' : 'Musikalische Aufgabe festlegen',
				text: isTeaching
					? 'Die kostenlose Probestunde klaert, ob Unterrichtsart, Tempo, Klangarbeit, Uebezeit und Rhythmus zusammenpassen.'
					: 'Wir entscheiden, ob die Musik sammelt, begleitet, einen Hoehepunkt traegt oder als eigener Programmpunkt wirkt.',
			},
			{
				time: '3',
				kicker: isTeaching ? 'Material' : 'Stuecke',
				title: 'Wunschmusik und Notation pruefen',
				text: isTeaching
					? 'Wunschstuecke koennen motivieren, wenn sie zum Lernstand passen. Neue Notation oder eigenes Material bespreche ich vorher transparent.'
					: 'Viele passende Stuecke sind vorhanden. Wenn ein Wunschlied neu herausgehoert oder notiert werden muss, klaere ich Aufwand und Kosten vorab.',
			},
			{
				time: '4',
				kicker: 'Rahmen',
				title: 'Preis und Buchung ehrlich abstimmen',
				text: `Der Preis richtet sich nach ${profile.priceFactors}. Die Anfrage ist kostenlos; die Buchung erfolgt erst nach klarer Abstimmung.`,
			},
		],
		footnote: `${profile.shortLabel} ${location.locative} wird belastbar, wenn Ort, Ablauf, Wunschmusik, Kontaktperson und Preisrahmen vor der Zusage klar sind.`,
	};
}

function faqFor(serviceSlug, location) {
	const profile = serviceProfile(serviceSlug);
	const isFuneral = serviceSlug === 'beerdigungen';
	const isTeaching = serviceSlug === 'unterricht';
	const questionLead = isFuneral ? 'Begleitest du Trauerfeiern' : isTeaching ? 'Bietest du Bratschenunterricht' : `Spielst du ${profile.shortLabel}`;
	const answerLead = isFuneral
		? `${profile.descriptionLead} ${location.locative} - in Trauerhalle, Kirche, Kapelle, am Grab oder bei einer freien Abschiedsfeier.`
		: isTeaching
			? `Ja. Ich biete Viola- und Bratschenunterricht ${location.locative} beziehungsweise nach Absprache in einem passenden regionalen Rahmen an.`
			: `Ja. Ich begleite ${profile.setting} ${location.locative} mit Solo-Viola, wenn Ort, Ablauf und musikalische Aufgabe passen.`;

	return {
		eyebrow: 'Gut zu wissen',
		title: `FAQ zu ${profile.keyword} ${location.displayName}`,
		items: [
			{
				question: `${questionLead} ${location.locative}?`,
				answer: answerLead,
				open: true,
			},
			{
				question: `Welche Angaben brauchst du fuer eine Anfrage ${location.locative}?`,
				answer: `Am hilfreichsten sind ${profile.needs}. Je genauer diese Angaben sind, desto schneller kann ich Verfuegbarkeit, Ablauf und Preisrahmen einschaetzen.`,
			},
			{
				question: 'Wie entsteht der Preis?',
				answer: `Der Preis richtet sich nach ${profile.priceFactors}. Die erste Anfrage ist kostenlos und unverbindlich; ein Angebot wird erst sinnvoll, wenn der Rahmen klar ist.`,
			},
			{
				question: 'Sind Wunschstuecke moeglich?',
				answer: isTeaching
					? 'Ja, wenn sie zum Lernstand, Instrument und Unterrichtsziel passen. Vorhandenes Unterrichtsmaterial ist ohne Aufpreis moeglich. Wenn ein Stueck neu herausgehoert oder notiert werden muss, klaere ich den Zusatzaufwand vorher; als Orientierung koennen etwa 30 Euro pro Song anfallen.'
					: `Ja, wenn sie musikalisch zu ${profile.formatName} und zum Anlass passen. Vorhandenes Repertoire ist ohne Aufpreis moeglich. Wenn ein Stueck neu herausgehoert oder notiert werden muss, klaere ich den Zusatzaufwand vorher; als Orientierung koennen etwa 30 Euro pro Song anfallen.`,
			},
			{
				question: `Wann passt ${profile.formatName} besonders gut?`,
				answer: `${profile.formatName} passt, ${profile.fit}. ${isTeaching ? 'Unterricht wirkt am besten, wenn Weg, Ziel, Uebezeit und Regelmaessigkeit realistisch sind.' : 'Das wirkt am besten, wenn der Moment zuhoeren darf und der Klang nicht gegen laute Umgebung anspielen muss.'}`,
			},
			{
				question: `Wann ist ${profile.formatName} nicht die richtige Loesung?`,
				answer: `Nicht ideal ist ${profile.formatName}, ${profile.notFit}. Dann sage ich das lieber ehrlich, statt ein unpassendes Format zu verkaufen.`,
			},
			{
				question: `Was ist ${location.locative} organisatorisch wichtig?`,
				answer: `${location.routeReality} ${location.arrival} Diese Details beeinflussen Timing, Aufbau, Wartezeit und moegliche Zusatzkosten.`,
			},
			{
				question: isTeaching ? 'Was kostet nach der Probestunde extra?' : 'Was kann zusaetzlich kosten?',
				answer: isTeaching
					? 'Nach der kostenlosen Probestunde haengen die Kosten von Dauer, Rhythmus, Format und Unterrichtsort ab. Neue Notation, besonderes Material oder zusaetzliche Vorbereitung bespreche ich vorher.'
					: 'Zusaetzlich kosten koennen laengere Wartezeit, ein zweiter Spielort, kurzfristige Verlaengerung, besondere Technik, sehr kurzfristige Buchung oder neue Notation fuer Wunschmusik.',
			},
		],
	};
}

function contactFor(serviceSlug, location) {
	const profile = serviceProfile(serviceSlug);
	const isTeaching = serviceSlug === 'unterricht';
	const isFuneral = serviceSlug === 'beerdigungen';
	const lead = isFuneral
		? `Schreib mir kurz ${profile.needs}. Ich pruefe schnell, ob Trauermusik ${location.locative} zeitlich und organisatorisch machbar ist, und stimme mich auf Wunsch direkt mit Bestattungshaus oder Redner:in ab.`
		: isTeaching
			? `Schreib mir kurz ${profile.needs}. Danach klaeren wir, ob eine kostenlose Probestunde ${location.locative}, ein regelmaessiger Rhythmus oder zuerst eine Orientierung sinnvoll ist.`
			: `Schreib mir kurz ${profile.needs}. Danach klaeren wir, ${profile.planQuestion}, wie der Ablauf aussehen kann und welcher Preisrahmen realistisch ist.`;
	return {
		eyebrow: profile.contactEyebrow,
		title: `${profile.contactLabel} ${location.locative} anfragen`,
		lead,
		checklist: [location.displayName, ...profile.checklist],
		defaultOccasion: profile.defaultOccasion,
		sourceLabel: `${profile.keyword} ${location.displayName}`,
		notes: [
			isTeaching ? 'Probestunde kostenlos und unverbindlich' : 'Kontaktaufnahme kostenlos und unverbindlich',
			'Kein kostenloses Vorspielen vor Ort',
			'Vorhandenes Repertoire ohne Aufpreis; neue Notation oder Heraushoeren nach Aufwand, Orientierung ca. 30 Euro pro Song',
			'Zusatzaufwand wie Wartezeit, Ortswechsel, Technik, Verlaengerung oder sehr kurzfristige Vorbereitung wird vor der Buchung geklaert',
		],
		formEyebrow: 'Details senden',
		formTitle: `Verfuegbarkeit und Preisrahmen ${location.locative} klaeren`,
		formSuccess: `Danke - ich pruefe deine Anfrage ${location.locative} und melde mich persoenlich mit den naechsten Schritten.`,
	};
}

function imageAltsFor(serviceSlug, location, images) {
	const profile = serviceProfile(serviceSlug);
	const count = serviceSlug === 'beerdigungen' ? Math.min(Math.max(images.length, 2), 4) : 4;
	return Array.from({ length: count }, (_, index) => {
		const image = images[index % images.length];
		return {
			src: image.src,
			alt: `${profile.shortLabel} ${location.locative} - Planungsbild ${index + 1}`,
		};
	});
}

function funeralOverride(doc, serviceSlug, location, images) {
	const profile = FUNERAL;
	return {
		...doc,
		priority: location.priority,
		status: 'manual-priority-local-seo-2026-06-22',
		seoTitle: titleFor(serviceSlug, location),
		seoDescription: descriptionFor(serviceSlug, location),
		hero: heroFor(serviceSlug, location),
		elegy: {
			quote: `Trauermusik ${location.locative} soll den Abschied halten, nicht groesser machen als den Moment.`,
			passages: [
				{
					strong: 'Ort und Ablauf',
					text: `${location.funeral} ${profile.setting} haben unterschiedliche Wege, Raumregeln und Startsignale. Darum klaere ich vorab, wo genau gespielt wird, wie lange der musikalische Moment dauern soll und wer am Tag selbst ansprechbar ist.`,
				},
				{
					strong: 'Entlastung',
					text: `Eine gute Anfrage nennt ${profile.needs}. Wenn es hilft, stimme ich Einsaetze, Ankunft und Stueckfolge direkt mit Bestattungshaus, Pfarrer:in oder Trauerredner:in ab, damit die Familie nicht zusaetzlich koordinieren muss.`,
				},
				{
					strong: 'Wunschstueck und Preis',
					text: `Vorhandene passende Stuecke sind ohne Aufpreis moeglich. Wenn ein persoenliches Wunschstueck keine brauchbaren Noten hat, klaere ich neue Notation oder Heraushoeren vorher transparent; als Orientierung koennen etwa 30 Euro pro Song anfallen. Der Gesamtpreis richtet sich nach ${profile.priceFactors}.`,
				},
			],
		},
		solemn: {
			eyebrow: `Ablauf ${location.locative}`,
			title: `Trauermusik ${location.locative} mit ruhiger Abstimmung.`,
			lead: `${location.routeReality} Fuer einen Abschied ist deshalb nicht wichtig, dass die Musik viel zeigt, sondern dass sie pünktlich, vorbereitet und passend eingesetzt wird.`,
			cards: [
				{
					rom: 'Vorab',
					title: 'Ein klarer Kontakt reicht',
					poet: `${profile.needs} reichen fuer den ersten Schritt. Danach klaere ich, ob der Termin passt und welcher musikalische Umfang sinnvoll ist.`,
				},
				{
					rom: 'Vor Ort',
					title: 'Still, pünktlich, vorbereitet',
					poet: `${location.arrival} Bei Musik am Grab pruefe ich zusaetzlich Wetter, Untergrund, kurze Wege und ob das Instrument geschuetzt stehen kann.`,
				},
			],
			listLabel: `Moegliche musikalische Momente ${location.locative}`,
			list: [
				'Beginn der Trauerfeier',
				'Moment der Erinnerung',
				'Abschied am Sarg oder an der Urne',
				'Gang zum Grab oder stiller Ausklang',
			],
		},
		faq: faqFor(serviceSlug, location),
		contact: contactFor(serviceSlug, location),
		imageAlts: imageAltsFor(serviceSlug, location, images),
		split: { ...(doc.split ?? {}), sections: [] },
		focus: { ...(doc.focus ?? {}), items: [] },
		editorNotes: appendNote(doc.editorNotes),
	};
}

function standardOverride(doc, serviceSlug, location, images) {
	return {
		...doc,
		priority: location.priority,
		status: 'manual-priority-local-seo-2026-06-22',
		seoTitle: titleFor(serviceSlug, location),
		seoDescription: descriptionFor(serviceSlug, location),
		hero: heroFor(serviceSlug, location),
		split: {
			...(doc.split ?? {}),
			seal: `${location.displayName}\n${SERVICES[serviceSlug].shortLabel}\nkonkret geplant`,
			sections: splitSectionsFor(serviceSlug, location, images),
		},
		focus: focusFor(serviceSlug, location),
		faq: faqFor(serviceSlug, location),
		contact: contactFor(serviceSlug, location),
		imageAlts: imageAltsFor(serviceSlug, location, images),
		elegy: { ...(doc.elegy ?? {}), passages: [] },
		solemn: { ...(doc.solemn ?? {}), cards: [], list: [] },
		editorNotes: appendNote(doc.editorNotes),
	};
}

function validateDoc(doc, serviceSlug, locationSlug) {
	const id = `${serviceSlug}/${locationSlug}`;
	const failures = [];
	if (!doc.seoTitle || doc.seoTitle.length > 68) failures.push(`${id}: invalid title length ${doc.seoTitle?.length ?? 0}`);
	if (!doc.seoDescription || doc.seoDescription.length > 170 || doc.seoDescription.length < 80) {
		failures.push(`${id}: invalid description length ${doc.seoDescription?.length ?? 0}`);
	}
	if ((doc.faq?.items?.length ?? 0) < 6) failures.push(`${id}: expected at least 6 FAQ items`);
	if (!doc.contact?.lead || !doc.contact?.notes?.length) failures.push(`${id}: missing contact lead/notes`);
	const text = JSON.stringify(doc);
	if (!/Wunschstueck|Wunschstuecke|Wunschstück|Wunschstücke|Wunschmusik/i.test(text)) failures.push(`${id}: missing Wunschmusik transparency`);
	if (!/Notation|Noten|herausgehoert|herausgehört/i.test(text)) failures.push(`${id}: missing notation transparency`);
	if (!/Preis|kosten|Zusatzaufwand/i.test(text)) failures.push(`${id}: missing price/extra-cost transparency`);
	if (serviceSlug !== 'beerdigungen' && (doc.split?.sections?.length ?? 0) !== 4) failures.push(`${id}: expected 4 split sections`);
	if (serviceSlug === 'beerdigungen' && (doc.elegy?.passages?.length ?? 0) < 3) failures.push(`${id}: expected funeral elegy passages`);
	return failures;
}

const failures = [];
let written = 0;

for (const locationSlug of TARGET_LOCATIONS) {
	const location = LOCATIONS[locationSlug];
	for (const serviceSlug of TARGET_SERVICES) {
		const file = fileFor(serviceSlug, locationSlug);
		if (!existsSync(file)) {
			failures.push(`${serviceSlug}/${locationSlug}: file not found`);
			continue;
		}
		const doc = readJson(file);
		const images = collectImages(doc);
		const next = serviceSlug === 'beerdigungen'
			? funeralOverride(doc, serviceSlug, location, images)
			: standardOverride(doc, serviceSlug, location, images);
		failures.push(...validateDoc(next, serviceSlug, locationSlug));
		writeJson(file, next);
		written += 1;
	}
}

if (failures.length > 0) {
	console.error('Priority local SEO curation failed invariants:');
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log(`Curated ${written} local SEO pages across ${TARGET_LOCATIONS.length} locations and ${TARGET_SERVICES.length} services.`);
