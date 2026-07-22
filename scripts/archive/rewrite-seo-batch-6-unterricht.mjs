import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'unterricht';
const STATUS = 'rewritten-batch-6-review-needed';
const BATCH_NOTE = 'Batch 6: Unterrichtsseiten vollständig nach Orts- und Topic-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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

const LOCATION_PROFILES = {
	aachen: ['Aachen', 'Altstadt, Pontviertel und Studierendenalltag im Dreiländereck', 'Schüler:innen mit weiterem Weg, Erwachsene mit dichtem Kalender und Familien aus dem Umland', 'die Anfahrt planbar bleibt und Unterrichtseinheiten nicht zwischen Terminen verschwinden'],
	'bergisches-land': ['Bergisches Land', 'kleinere Orte, Höhenlagen und Wege zwischen Wupper, Dhünn und Fachwerkorten', 'Kinder, Jugendliche und Erwachsene, die eher einen ruhigen Lernort als Großstadtbetrieb suchen', 'Wetter, Fahrzeit und Übezeiten realistisch zusammenpassen'],
	'bergisch-gladbach': ['Bergisch Gladbach', 'Bensberg, Schildgen und die Nähe zu Köln und dem Bergischen Land', 'Familien, Wiedereinsteiger:innen und Schüler:innen mit wechselnden Schul- oder Arbeitszeiten', 'Unterricht nicht wie ein Umweg wirkt, sondern fest in die Woche passt'],
	bielefeld: ['Bielefeld', 'Altstadt, Musikerviertel und Stadtteile rund um den Teutoburger Wald', 'Anfänger:innen, die ein Streichinstrument geduldig aufbauen möchten', 'der Lernrhythmus auch bei längerer Anfahrt ruhig bleibt'],
	bochum: ['Bochum', 'Ehrenfeld, Stiepel, Innenstadt und den direkten Ruhrgebietsalltag', 'Jugendliche, Studierende und Erwachsene, die strukturiert lernen und trotzdem flexibel bleiben möchten', 'Übeplan, Unterrichtszeit und Alltag nicht gegeneinander arbeiten'],
	bonn: ['Bonn', 'Südstadt, Rheinlagen und Familien zwischen Stadt, Universität und Siebengebirge', 'Kinder, Erwachsene und Wiedereinsteiger:innen mit musikalischer Neugier', 'Fahrzeit, Schulwege und Probestunde gut vorbereitet sind'],
	bottrop: ['Bottrop', 'ruhige Wohnlagen, kurze Ruhrgebietswege und Familien mit praktischen Wochenplänen', 'Schüler:innen, die klar wissen wollen, was sie zu Hause üben sollen', 'der Unterricht konkret bleibt und die Woche nicht überfordert'],
	dormagen: ['Dormagen', 'Rheinlage, Zons und die Achse zwischen Düsseldorf und Köln', 'Familien und Erwachsene, die Unterricht gut mit Pendeln verbinden müssen', 'Termine, Fahrwege und Instrumententransport entspannt geplant werden'],
	dortmund: ['Dortmund', 'Kreuzviertel, Hörde, Phoenixsee und Stadtteile mit sehr unterschiedlichen Wegen', 'Kinder, Jugendliche und Erwachsene aus dem östlichen Ruhrgebiet', 'Treffpunkt, Unterrichtsdauer und Übeziele vorab klar sind'],
	duesseldorf: ['Düsseldorf', 'Rheinufer, Flingern, Kaiserswerth, Benrath und den dichten Stadtverkehr', 'Kinder, Erwachsene, Anfänger:innen und Wiedereinsteiger:innen, die einen ruhigen Gegenpol zum Alltag suchen', 'Ankunft, Instrument und Unterrichtszeit nicht hektisch werden'],
	duisburg: ['Duisburg', 'Innenhafen, linksrheinische Stadtteile und weite Wege im Westen des Ruhrgebiets', 'Schüler:innen mit sehr unterschiedlichem musikalischem Vorwissen', 'die Strecke eingeplant ist und der Unterricht pünktlich beginnen kann'],
	erkrath: ['Erkrath', 'Neandertal, Unterfeldhaus und die kurze Verbindung nach Düsseldorf', 'Familien, Anfänger:innen und Erwachsene, die Streichunterricht in überschaubarem Rahmen suchen', 'kurze Wege genutzt werden und trotzdem genug Ruhe zum Stimmen bleibt'],
	essen: ['Essen', 'Rüttenscheid, Baldeneysee, Stadtwald und den zentralen Ruhrgebietsrhythmus', 'Schüler:innen, die zwischen Schule, Arbeit und Freizeit einen festen musikalischen Termin brauchen', 'der Unterricht verbindlich bleibt, ohne Druck aufzubauen'],
	gelsenkirchen: ['Gelsenkirchen', 'Buer, Schalke, Ückendorf und direkte Ruhrgebietswege', 'Kinder, Jugendliche und Erwachsene, die einen verständlichen Einstieg in die Viola suchen', 'regelmäßige Übeaufgaben klein genug bleiben, um wirklich gemacht zu werden'],
	haan: ['Haan', 'Gartenstadt-Atmosphäre und Wege zwischen Düsseldorf, Erkrath und Wuppertal', 'Familien und Erwachsene, die persönliche Begleitung statt anonymen Gruppenunterricht wünschen', 'der Unterricht ruhig, direkt und gut erreichbar bleibt'],
	hagen: ['Hagen', 'Volme, Haspe, Hohenlimburg und die Nähe zum Sauerland', 'Schüler:innen, die mit klaren Etappen und geduldiger Tonarbeit lernen möchten', 'Anreise und Unterrichtslänge sinnvoll zueinander passen'],
	heiligenhaus: ['Heiligenhaus', 'kleinere Wege zwischen Ratingen, Velbert und dem Kreis Mettmann', 'Kinder und Erwachsene, die einen verlässlichen Lerntermin suchen', 'Lernziele übersichtlich bleiben und der Wochenrhythmus stabil wird'],
	herne: ['Herne', 'Wanne, Eickel und die kurzen Wege mitten im Ruhrgebiet', 'Anfänger:innen und Wiedereinsteiger:innen, die praktische Übungen brauchen', 'der Unterricht unmittelbar anwendbar bleibt und zu Hause nicht verpufft'],
	hilden: ['Hilden', 'Innenstadt, Wohnviertel und die Lage zwischen Düsseldorf, Solingen und Langenfeld', 'Familien, Jugendliche und Erwachsene mit klaren Zeitfenstern', 'Unterricht, Fahrweg und Übezeit ohne große Reibung zusammenfinden'],
	iserlohn: ['Iserlohn', 'Letmathe, Sauerlandnähe und ruhigere Lernwege außerhalb der großen Städte', 'Schüler:innen, die lieber konzentriert als gehetzt arbeiten', 'die weitere Anfahrt durch klare Ziele und gute Vorbereitung sinnvoll wird'],
	koeln: ['Köln', 'Veedel, Rheinwege, dichter Stadtverkehr und musikalische Vielfalt', 'Erwachsene, Familien und Jugendliche, die Viola oder Bratsche bewusst lernen wollen', 'Treffpunkt, Instrument und Unterrichtsbeginn besonders sauber abgestimmt sind'],
	krefeld: ['Krefeld', 'Bockum, Uerdingen, Stadtwald und den Niederrhein', 'Schüler:innen, die warmen Streichklang und eine klare Technikbasis suchen', 'Üben, Unterricht und Alltag nicht zu abstrakt bleiben'],
	'kreis-mettmann': ['Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert und kleinere Orte dazwischen', 'Familien und Erwachsene aus mehreren Nachbarstädten', 'Fahrwege und Unterrichtsfenster pragmatisch geplant werden'],
	langenfeld: ['Langenfeld', 'die Achse zwischen Düsseldorf, Leverkusen und Monheim', 'Schüler:innen, die Unterricht gut zwischen Pendeln und Familie legen möchten', 'der Wochenplan die musikalische Arbeit unterstützt'],
	leverkusen: ['Leverkusen', 'Schlebusch, Opladen, Rheinlage und die Nähe zu Köln', 'Kinder, Jugendliche und Erwachsene mit unterschiedlichen musikalischen Zielen', 'Unterrichtszeit und Übeplan zu Schule, Beruf oder Studium passen'],
	meerbusch: ['Meerbusch', 'Büderich, Osterath, Rheinlage und ruhige Wohnorte nahe Düsseldorf', 'Familien und Erwachsene, die eine persönliche, leise Lernatmosphäre mögen', 'der Unterricht konzentriert bleibt und nicht wie ein weiterer Pflichttermin wirkt'],
	mettmann: ['Mettmann', 'Altstadt, Neandertalnähe und Wege im Kreis Mettmann', 'Anfänger:innen, Wiedereinsteiger:innen und Kinder mit familiärem Wochenrhythmus', 'der Einstieg praktisch bleibt und jedes Übeziel nachvollziehbar ist'],
	moenchengladbach: ['Mönchengladbach', 'Rheydt, Wickrath und den linken Niederrhein', 'Schüler:innen, die Streichunterricht ohne übertriebene Strenge suchen', 'Unterrichtsaufgaben motivierend bleiben und nicht wie Hausaufgaben klingen'],
	moers: ['Moers', 'Niederrhein, Schlossnähe und Wege zwischen Duisburg und Kamp-Lintfort', 'Erwachsene und Familien, die Unterricht gut planbar brauchen', 'Anfahrt, Instrument und regelmäßige Termine einfach zu organisieren sind'],
	'monheim-am-rhein': ['Monheim am Rhein', 'Rheinpromenade, Baumberg und die Verbindung nach Düsseldorf und Leverkusen', 'Kinder, Jugendliche und Erwachsene mit familiären oder beruflichen Zeitfenstern', 'der Unterricht kompakt, konzentriert und erreichbar bleibt'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr', 'Saarn, Broich, Ruhrtal und grüne Stadtnähe', 'Schüler:innen, die einen ruhigen Klang und eine entspannte Lernatmosphäre suchen', 'Technik, Stücke und Übezeit ohne Hektik wachsen können'],
	muenster: ['Münster', 'Altstadt, Aasee, Fahrradwege und akademischen Wochenrhythmus', 'Erwachsene, Studierende und Familien, die strukturierten Streichunterricht suchen', 'Termine mit Schul-, Studien- oder Arbeitszeiten sauber verzahnt sind'],
	neuss: ['Neuss', 'Innenstadt, Rheinlage und Nähe zu Düsseldorf und Grevenbroich', 'Schüler:innen, die Viola lernen und dabei nicht anonym unterrichtet werden möchten', 'Fahrwege kurz bleiben und die Probestunde konkret vorbereitet ist'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land und weitere Städte in NRW', 'Schüler:innen mit unterschiedlichem Niveau, von der ersten Stunde bis zum Wiedereinstieg', 'Region, Fahrzeit und Unterrichtsformat individuell geprüft werden'],
	oberhausen: ['Oberhausen', 'Sterkrade, Alt-Oberhausen und kurze Wege im westlichen Ruhrgebiet', 'Anfänger:innen, Kinder und Erwachsene, die verständliche Schritte brauchen', 'Unterricht und Üben alltagstauglich bleiben'],
	paderborn: ['Paderborn', 'Innenstadt, Schloss Neuhaus und Ostwestfalen', 'Schüler:innen, die für Viola oder Bratsche eine ruhige, klare Begleitung suchen', 'eine weitere Strecke nur dann Sinn ergibt, wenn Ziel und Rhythmus passen'],
	ratingen: ['Ratingen', 'Lintorf, Hösel, Tiefenbroich und die Nähe zu Düsseldorf', 'Kinder, Erwachsene und Wiedereinsteiger:innen, die verbindlich, aber ohne Druck lernen möchten', 'kurze Wege und klare Unterrichtsziele zusammenkommen'],
	recklinghausen: ['Recklinghausen', 'Altstadt, Süd, Hochlar und den Rand des Ruhrgebiets', 'Familien und Erwachsene, die einen gut strukturierten Einstieg wünschen', 'Übepläne überschaubar und trotzdem wirksam bleiben'],
	remscheid: ['Remscheid', 'Lennep, bergische Höhen und Wege mit etwas mehr Planung', 'Schüler:innen, die konzentriert und in kleinen Schritten lernen möchten', 'Anfahrt und Unterrichtsdauer nicht zufällig, sondern sinnvoll geplant sind'],
	'rhein-kreis-neuss': ['Rhein-Kreis Neuss', 'Neuss, Meerbusch, Dormagen, Grevenbroich und die Rheinorte dazwischen', 'Familien und Erwachsene aus mehreren Städten im Kreis', 'der passende Unterrichtsort und die Fahrzeit früh geklärt werden'],
	rheinland: ['Rheinland', 'Rheinstädte, kleinere Orte und ein weiter regionaler Einzugsbereich', 'Schüler:innen, die einen persönlichen Streichunterricht suchen', 'Unterrichtsformat, Weg und Probestunde individuell entschieden werden'],
	'rhein-ruhr': ['Rhein-Ruhr', 'dichte Wege zwischen Düsseldorf, Köln, Essen, Dortmund und Duisburg', 'Schüler:innen, deren Alltag zwischen mehreren Städten stattfindet', 'Verkehr, Fahrzeit und Übeziele realistisch geplant sind'],
	ruhrgebiet: ['Ruhrgebiet', 'viele nah beieinanderliegende Städte und sehr unterschiedliche Wochenrhythmen', 'Kinder, Jugendliche und Erwachsene, die praktische musikalische Begleitung suchen', 'der Unterricht klar genug ist, um auch in vollen Wochen weiterzugehen'],
	siegen: ['Siegen', 'Oberstadt, Siegerland und ein größeres regionales Einzugsgebiet', 'Schüler:innen, die für Streichunterricht bewusst Zeit einplanen', 'Ziel, Unterrichtsdauer und Anfahrt zueinander passen'],
	solingen: ['Solingen', 'Ohligs, Gräfrath, Wald und bergische Wege', 'Anfänger:innen und Wiedereinsteiger:innen, die eine stabile Technikbasis möchten', 'Weg, Instrument und Unterrichtsstart gut vorbereitet sind'],
	unna: ['Unna', 'Altstadt, Königsborn und die Lage zwischen Ruhrgebiet und Hellweg', 'Familien, Jugendliche und Erwachsene mit überschaubaren Zeitfenstern', 'die Stunden praktisch bleiben und ein klarer Übeauftrag entsteht'],
	velbert: ['Velbert', 'Neviges, Langenberg und die Verbindung zwischen Ruhrgebiet und Bergischem Land', 'Schüler:innen, die Klangarbeit und Technik geduldig verbinden möchten', 'Unterrichtswege und Übezeiten ohne Stress funktionieren'],
	wuelfrath: ['Wülfrath', 'kleine Stadtwege, Kreis-Mettmann-Nähe und ruhige Lernorte', 'Kinder und Erwachsene, die persönliche Rückmeldung brauchen', 'die Stunde konzentriert bleibt und der nächste Schritt klar ist'],
	wuppertal: ['Wuppertal', 'Elberfeld, Barmen, Höhenlagen und Wege entlang der Wupper', 'Schüler:innen, die mit Bogen, Haltung und Klang systematisch arbeiten möchten', 'Treppen, Fahrzeit und Unterrichtsbeginn praktisch mitgedacht sind'],
};

const TOPIC_PROFILES = {
	'bratschenunterricht': {
		keyword: 'Bratschenunterricht',
		eyebrow: 'Bratsche lernen',
		title: 'Bratschenunterricht mit warmem Klang, klarer Technik und realistischem Übeplan.',
		audience: 'Anfänger:innen, Wiedereinsteiger:innen und Fortgeschrittene, die die Bratsche bewusst lernen möchten',
		mainNeed: 'ein Fundament aus Haltung, Bogenführung, Intonation und musikalischem Verständnis',
		difference: 'Hier steht nicht ein bestimmtes Alter im Mittelpunkt, sondern der persönliche Lernweg vom ersten Ton bis zu sichereren Stücken.',
		method: 'Wir verbinden technische Übungen immer mit Musik, damit sich der Unterricht nicht trocken anfühlt.',
		repertoire: 'Klassische Etüden, einfache Melodien, Filmmusik oder Lieblingsstücke können je nach Niveau sinnvoll eingebunden werden.',
		challenge: 'Viele unterschätzen, wie körperlich ein Streichinstrument ist. Deshalb achten wir früh auf entspannte Schultern, klare linke Hand und einen Bogenarm, der tragen kann.',
	},
	'bratschenunterricht-anfaenger': {
		keyword: 'Bratschenunterricht Anfänger',
		eyebrow: 'Erster Ton',
		title: 'Bratschenunterricht für Anfänger:innen, der ruhig beginnt und trotzdem trägt.',
		audience: 'Menschen ohne Vorerfahrung oder mit sehr lange zurückliegendem Musikunterricht',
		mainNeed: 'einen Einstieg, der verständlich ist und keine musikalische Vorkenntnis voraussetzt',
		difference: 'Diese Seite fokussiert den Anfang: Instrument halten, Bogen führen, Töne finden, Noten lesen und kleine Erfolgserlebnisse sammeln.',
		method: 'Am Anfang sind wenige saubere Schritte besser als viele Informationen auf einmal.',
		repertoire: 'Die ersten Stücke bleiben kurz, klingen aber musikalisch und zeigen direkt, wofür die Technik gebraucht wird.',
		challenge: 'Gerade Anfänger:innen brauchen einen Übeplan, der klein genug ist, um im Alltag wirklich stattzufinden.',
	},
	'bratschenunterricht-erwachsene': {
		keyword: 'Bratschenunterricht Erwachsene',
		eyebrow: 'Erwachsene',
		title: 'Bratschenunterricht für Erwachsene, passend zu Alltag, Anspruch und Geduld.',
		audience: 'Erwachsene, die neu anfangen, wieder einsteigen oder sich einen lang gehegten Wunsch erfüllen möchten',
		mainNeed: 'Unterricht, der ernst nimmt, dass Erwachsene anders lernen als Kinder',
		difference: 'Hier geht es um Körperbewusstsein, klare Erklärungen, flexible Ziele und einen Übeplan, der neben Beruf und Familie funktioniert.',
		method: 'Erwachsene möchten oft verstehen, warum eine Bewegung hilft. Genau dieses Verstehen nutzen wir für schnellere Sicherheit.',
		repertoire: 'Neben Grundlagen können Stücke gewählt werden, die persönlich motivieren, ohne technisch zu früh zu viel zu verlangen.',
		challenge: 'Perfektionismus ist bei Erwachsenen oft größer als bei Kindern. Deshalb arbeiten wir mit konkreten Zwischenschritten statt mit Druck.',
	},
	'bratschenunterricht-kinder': {
		keyword: 'Bratschenunterricht Kinder',
		eyebrow: 'Kinder',
		title: 'Bratschenunterricht für Kinder, spielerisch, geduldig und mit stabilem Fundament.',
		audience: 'Kinder und Familien, die einen freundlichen Einstieg in die Bratsche oder Viola suchen',
		mainNeed: 'einen Unterricht, der Konzentration, Bewegung und Neugier in kindgerechte Schritte übersetzt',
		difference: 'Diese Seite achtet besonders auf altersgerechte Instrumentengröße, kurze Aufgaben und Erfolgserlebnisse.',
		method: 'Kinder lernen über Klang, Bilder, Wiederholung und kleine Rituale, nicht über lange technische Vorträge.',
		repertoire: 'Einfache Lieder, Rhythmusspiele und kleine Stücke helfen, Technik mit Freude zu verbinden.',
		challenge: 'Für Eltern ist wichtig zu wissen, wie zu Hause geübt werden kann, ohne dass Musik zum Streitpunkt wird.',
	},
	'bratsche-lernen': {
		keyword: 'Bratsche lernen',
		eyebrow: 'Lernweg',
		title: 'Bratsche lernen, wenn Klang, Körpergefühl und Geduld zusammenfinden sollen.',
		audience: 'alle, die noch prüfen, ob die Bratsche das richtige Instrument für sie ist',
		mainNeed: 'Orientierung vor und während des Einstiegs',
		difference: 'Diese Seite beantwortet nicht nur Unterrichtsfragen, sondern auch die Grundfrage: Wie fühlt sich Bratsche lernen eigentlich an?',
		method: 'Wir beginnen mit Klang, Haltung und einfachen Bewegungen, damit das Instrument nicht fremd bleibt.',
		repertoire: 'Schon früh können kleine Melodien, Kanons oder bekannte Motive auftauchen, solange sie technisch sinnvoll bleiben.',
		challenge: 'Wer Bratsche lernen möchte, braucht am Anfang vor allem ein passendes Instrument und eine klare Vorstellung davon, wie Üben funktioniert.',
	},
	'bratsche-unterricht': {
		keyword: 'Bratsche Unterricht',
		eyebrow: 'Unterrichtsform',
		title: 'Bratsche Unterricht mit klarer Struktur und persönlichem Tempo.',
		audience: 'Suchende, die nach konkretem Bratsche Unterricht statt allgemeiner Musikschule suchen',
		mainNeed: 'eine persönliche Begleitung mit nachvollziehbaren Zielen',
		difference: 'Diese Seite ist bewusst praktisch: Wie läuft eine Stunde ab, woran arbeiten wir, und wie wird daraus Fortschritt?',
		method: 'Jede Stunde hat einen Schwerpunkt, eine musikalische Anwendung und eine kleine Aufgabe für die nächste Woche.',
		repertoire: 'Stücke werden so gewählt, dass sie Technik, Klang und Motivation gleichzeitig bedienen.',
		challenge: 'Bratsche Unterricht funktioniert am besten, wenn Korrekturen direkt verständlich sind und zu Hause erinnerbar bleiben.',
	},
	'musikunterricht-bratsche': {
		keyword: 'Musikunterricht Bratsche',
		eyebrow: 'Musikunterricht',
		title: 'Musikunterricht für Bratsche, der Technik und musikalisches Verstehen verbindet.',
		audience: 'Schüler:innen, die neben dem Instrument auch Rhythmus, Noten und musikalische Zusammenhänge verstehen möchten',
		mainNeed: 'mehr als nur Griff und Bogenstrich',
		difference: 'Hier steht der breitere Musikunterricht im Vordergrund: Hören, Noten, Rhythmus, Stil und Ausdruck.',
		method: 'Theorie taucht nur dort auf, wo sie beim Spielen sofort hilft.',
		repertoire: 'Übungen, kurze Stücke und Lieblingsmusik werden so verbunden, dass musikalische Zusammenhänge hörbar werden.',
		challenge: 'Viele Lernende trennen Technik und Musik zu stark. Wir führen beides von Anfang an wieder zusammen.',
	},
	'musikunterricht-viola': {
		keyword: 'Musikunterricht Viola',
		eyebrow: 'Viola',
		title: 'Musikunterricht für Viola mit warmem Ton und verständlicher Technik.',
		audience: 'Menschen, die gezielt nach Viola suchen und den besonderen Klang des Instruments kennenlernen möchten',
		mainNeed: 'Unterricht, der den Unterschied zwischen Viola, Bratsche und Geige verständlich macht',
		difference: 'Diese Seite spricht bewusst den Begriff Viola an und erklärt, wie Klang, Lage und Spielgefühl aufgebaut werden.',
		method: 'Wir arbeiten nah am Instrument: Tonansatz, Bogenkontakt, linke Hand und Hören werden immer zusammen gedacht.',
		repertoire: 'Je nach Ziel kann das Repertoire klassisch, modern oder sehr persönlich sein.',
		challenge: 'Die Viola klingt nur dann warm, wenn Technik nicht verkrampft. Deshalb ist entspannte Bewegung ein zentrales Thema.',
	},
	'viola-lernen': {
		keyword: 'Viola lernen',
		eyebrow: 'Viola lernen',
		title: 'Viola lernen, wenn du einen warmen Klang und einen ruhigen Einstieg suchst.',
		audience: 'Anfänger:innen, Erwachsene und Wiedereinsteiger:innen, die gezielt Viola lernen möchten',
		mainNeed: 'einen Einstieg in Ton, Haltung und musikalische Sicherheit',
		difference: 'Diese Seite ist für Menschen gedacht, die nicht allgemein Streichunterricht suchen, sondern die Viola als eigenes Instrument wahrnehmen.',
		method: 'Wir starten mit tragfähigem Klang und überschaubaren Bewegungen, bevor die Stücke komplexer werden.',
		repertoire: 'Einfache Melodien, klassische Grundlagen und später moderne Stücke können sich gut ergänzen.',
		challenge: 'Beim Viola lernen ist Hören besonders wichtig, weil der warme Klang aus Kontakt, Gewicht und Ruhe entsteht.',
	},
	'viola-unterricht': {
		keyword: 'Viola Unterricht',
		eyebrow: 'Viola Unterricht',
		title: 'Viola Unterricht für Menschen, die Klang bewusst entwickeln möchten.',
		audience: 'Schüler:innen, die konkreten Viola Unterricht mit persönlicher Rückmeldung suchen',
		mainNeed: 'eine Unterrichtsform, die Technik, Klang und musikalische Ziele klar sortiert',
		difference: 'Diese Seite richtet sich an den konkreten Unterrichtsintent: regelmäßige Stunden, Probestunde, Lernstand und nächste Schritte.',
		method: 'Jede Stunde schließt mit einer klaren Übeidee ab, damit Fortschritt zwischen den Terminen entstehen kann.',
		repertoire: 'Die Stückauswahl folgt deinem Stand, kann aber immer persönliche Wünsche aufnehmen.',
		challenge: 'Viola Unterricht darf anspruchsvoll sein, sollte aber nie unverständlich werden.',
	},
};

function hash(value) {
	return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0);
}

function pick(slug, values, offset = 0) {
	return values[(hash(slug) + offset) % values.length];
}

function titleFromKeyword(keyword) {
	return keyword
		.replace(/\b\w/g, (char) => char.toLocaleUpperCase('de-DE'))
		.replace('Fuer', 'Für');
}

function fileFor(slug) {
	return path.join(ROOT, 'src/content/seo-pages', SERVICE, `${slug}.json`);
}

function noteFor(doc) {
	const notes = String(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
}

function writeDoc(slug, patch) {
	const file = fileFor(slug);
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

function buildLocal(slug) {
	const [label, localFrame, studentFrame, logistics] = LOCATION_PROFILES[slug];
	const keyword = `Bratschenunterricht ${label}`;
	const firstGoal = pick(slug, [
		'einen warmen, tragfähigen Ton entwickeln',
		'von Anfang an entspannt mit Bogen und Instrument umgehen',
		'Noten, Rhythmus und Klang ohne Druck verbinden',
		'regelmäßig üben, ohne dass Musik zur Pflichtübung wird',
	], 1);
	const levelFrame = pick(slug, [
		'Anfänger:innen starten mit Haltung, Bogenweg und einfachen Tönen. Fortgeschrittene arbeiten gezielter an Klangfarbe, Intonation und musikalischem Ausdruck.',
		'Für Kinder setze ich Aufgaben kleiner und bildhafter, für Erwachsene erkläre ich Bewegungen genauer und verbinde sie mit nachvollziehbaren Übeschritten.',
		'Wiedereinsteiger:innen müssen oft nicht bei null beginnen. Wir sortieren erst, was noch da ist, und bauen dann Sicherheit in Klang, Technik und Notenlesen auf.',
		'Wer bereits Geige, Klavier oder ein anderes Instrument kennt, bekommt andere Anknüpfungspunkte als jemand, der komplett neu beginnt.',
	], 2);
	const practiceFrame = pick(slug, [
		'Lieber wenige Minuten bewusst üben als lange gegen Verspannung arbeiten.',
		'Ein guter Übeplan ist kurz, konkret und nach der Stunde noch verständlich.',
		'Zu Hause soll klar sein, welcher Griff, welcher Bogenstrich und welches Stück Priorität haben.',
		'Fortschritt entsteht, wenn Klangarbeit, Technik und kleine musikalische Ziele regelmäßig zusammenkommen.',
	], 3);
	const toneFrame = pick(slug, [
		'Die Viola belohnt einen ruhigen Bogenarm und einen wachen Klanggeschmack.',
		'Bratsche klingt besonders schön, wenn Gewicht, Kontaktstelle und linke Hand nicht gegeneinander arbeiten.',
		'Der warme Ton entsteht nicht durch Kraft, sondern durch gute Balance zwischen Körper, Bogen und Ohr.',
		'Gerade am Anfang ist ein entspannter Körper wichtiger als schnelle Stücke.',
	], 4);
	const localLearningLens = pick(slug, [
		'Manche Schüler:innen brauchen zunächst Orientierung: Wie schwer ist das Instrument, wie klingt eine leere Saite, wie liest man die ersten Noten?',
		'Andere bringen bereits musikalische Erfahrung mit und möchten genauer verstehen, warum ein Bogenstrich trägt oder warum ein Ton nicht sauber einrastet.',
		'Bei Wiedereinsteiger:innen geht es oft darum, alte Bewegungen vorsichtig zu prüfen und neue Sicherheit aufzubauen, ohne alles wieder mühsam von vorn zu erklären.',
		'Bei Kindern ist die Aufmerksamkeitsspanne ein eigenes Thema: kurze Wiederholungen, kleine Erfolgserlebnisse und ein Instrument in passender Größe sind wichtiger als lange Erklärungen.',
		'Bei Erwachsenen spielen Alltag, Geduld und ein realistisches Übefenster eine größere Rolle als ein perfekter Stundenplan.',
		'Bei Fortgeschrittenen kann der Unterricht stärker in Richtung Klangkultur, Lagenwechsel, Vibrato, Stilgefühl oder Vorbereitung eines bestimmten Stücks gehen.',
	], 6);
	const localPracticeLens = pick(slug, [
		'Ich notiere Aufgaben so, dass sie auch drei Tage später noch verständlich sind: worauf hören, welche Stelle wiederholen, welche Bewegung langsam prüfen.',
		'Der nächste Schritt wird nicht an der Menge der gespielten Takte gemessen, sondern daran, ob der Klang freier, der Bogen ruhiger oder die Intonation sicherer wird.',
		'Wenn eine Woche voll ist, kann eine kleine Übeeinheit reichen. Wichtig ist, dass sie bewusst passiert und nicht nur aus mechanischem Durchspielen besteht.',
		'Gerade bei der Bratsche lohnt es sich, langsam zu arbeiten: Ein sauberer Ton am Anfang spart später viele Korrekturen.',
		'Ich trenne zwischen Üben, Wiederholen und Spielen. Diese Unterscheidung hilft, damit zu Hause nicht jede Minute gleich anstrengend wird.',
		'Manchmal ist der beste Fortschritt eine kleine Korrektur, die sofort spürbar ist: weniger Druck im Daumen, klarerer Bogenweg oder ein besserer Startton.',
	], 7);
	const parentFrame = pick(slug, [
		'Bei Kindern bespreche ich mit den Eltern, wie viel Unterstützung zu Hause sinnvoll ist.',
		'Für Familien ist wichtig, dass Üben nicht zum täglichen Streitpunkt wird.',
		'Wenn Kinder lernen, braucht es kurze Rituale, ein passendes Instrument und erreichbare Aufgaben.',
		'Eltern bekommen konkrete Hinweise, worauf sie achten können, ohne selbst zur zweiten Lehrkraft zu werden.',
	], 5);
	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Viola lernen`,
		seoDescription: `${keyword}: Viola- und Bratschenunterricht für Kinder, Erwachsene und Anfänger:innen mit Probestunde und klarem Übeplan.`,
		hero: {
			eyebrow: `Unterricht in ${label}`,
			title: `Bratschenunterricht in ${label}, der ruhig aufbaut und wirklich in deinen Alltag passt.`,
			lead: `Ob erster Ton, Wiedereinstieg oder neues Ziel: In ${label} begleite ich dich mit Viola- und Bratschenunterricht, der Technik, Klang und Üben verständlich macht.`,
			badge: 'Probestunde kostenlos & unverbindlich',
		},
		split: {
			eyebrow: 'Lernrahmen',
			title: `Viola lernen in ${label} braucht Struktur, Geduld und einen realistischen Wochenrhythmus.`,
			lede: `Bratschenunterricht in ${label} ist für mich kein Schema, das auf jede Person gleich gelegt wird. ${label} bedeutet hier: ${localFrame}. Genau deshalb klären wir zuerst Lernstand, Ziel, Alltag und die Frage, wie Unterricht regelmäßig funktionieren kann.`,
			paragraphs: [
				`Typisch sind ${studentFrame}. Manche möchten ein Instrument von Grund auf lernen, andere kommen nach Jahren zurück, wieder andere suchen für ein Kind einen Einstieg, der freundlich und trotzdem sorgfältig ist.`,
				`Im Zentrum stehen Haltung, Bogenführung, Ton, Intonation und ein musikalisches Verständnis, das Schritt für Schritt wächst. Ziel ist nicht, möglichst schnell viele Stücke anzuspielen, sondern ${firstGoal}.`,
				levelFrame,
				`${toneFrame} Deshalb korrigieren wir nicht nur einzelne Töne, sondern hören gemeinsam: Warum klingt etwas eng, frei, warm oder unsicher? Aus diesem Hören entsteht Technik, die nicht trocken bleibt.`,
				`${practiceFrame} Ich gebe nach jeder Stunde klare Aufgaben mit: eine technische Übung, einen musikalischen Ausschnitt und einen kleinen Hör- oder Rhythmusfokus. So bleibt der nächste Schritt greifbar.`,
				`Für ${label} berücksichtige ich außerdem die praktische Seite: ${logistics}. Ein Streichinstrument braucht Ruhe zum Stimmen, einen sinnvollen Unterrichtsbeginn und einen Ort, an dem man sich konzentrieren kann.`,
				`Die lokale Seite für ${label} ist bewusst nicht nur ein ausgetauschter Ortsname. ${localFrame} prägt, wie regelmäßig Unterricht planbar ist, wie viel Fahrzeit realistisch bleibt und ob eine kurze, konzentrierte Stunde besser passt als ein zu großes Lernpaket.`,
				`${localLearningLens} Genau dadurch unterscheidet sich Unterricht in ${label} von einer allgemeinen Beschreibung: Wir schauen auf die Person, den Weg, den Wochenrhythmus und die musikalische Situation.`,
				`${localPracticeLens} Das macht den Unterricht konkreter und hilft, Fortschritt nicht nur im Termin selbst, sondern zwischen zwei Stunden zu erleben.`,
				parentFrame,
				`Wenn du aus ${label} oder aus der Umgebung kommst, können wir in der Probestunde prüfen, welches Format passt: regelmäßiger Unterricht, ein vorbereitender Block für ein bestimmtes Ziel, Unterstützung beim Wiedereinstieg oder eine Phase, in der Technik neu sortiert wird.`,
			],
			seal: `${label}\nViola & Bratsche\nruhig lernen`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Bratschenunterricht in ${label}`,
			items: [
				{
					question: `Bietest du Bratschenunterricht in ${label} an?`,
					answer: `Ja. Ich biete persönlichen Viola- und Bratschenunterricht für ${label} beziehungsweise nach Absprache im passenden regionalen Rahmen an.`,
					open: true,
				},
				{
					question: 'Ist der Unterricht für Anfänger:innen geeignet?',
					answer: `Ja. Gerade der Anfang wird in ${label} ruhig aufgebaut: Haltung, Bogenführung, erste Töne, Notenlesen und kleine Stücke werden so verbunden, dass du den nächsten Schritt verstehst.`,
				},
				{
					question: 'Unterrichtest du Kinder und Erwachsene unterschiedlich?',
					answer: `Ja. Kinder brauchen kürzere Aufgaben, Bilder und Wiederholung. Erwachsene profitieren oft von genaueren Erklärungen und einem Übeplan, der zum Alltag in ${label} passt.`,
				},
				{
					question: 'Brauche ich direkt ein eigenes Instrument?',
					answer: `Nicht unbedingt. Für den Start kann ein passendes Leihinstrument sinnvoll sein. Wichtig ist, dass Größe, Zustand und Klang zum Körper, zum Lernstand und zum Unterrichtsrhythmus in ${label} passen.`,
				},
				{
					question: 'Wie läuft eine Probestunde ab?',
					answer: `Wir sprechen über deinen Lernstand, probieren erste Töne oder ein vorhandenes Stück und schauen, ob Rhythmus, Unterrichtsort und Ziel für ${label} realistisch zusammenpassen.`,
				},
				{
					question: 'Wie oft sollte Unterricht stattfinden?',
					answer: `Für viele Lernende ist ein regelmäßiger Wochenrhythmus ideal. Je nach Ziel, Alter und Fahrweg rund um ${label} kann auch ein anderer Abstand sinnvoll sein, wenn der Übeplan klar bleibt.`,
				},
			],
		},
		contact: {
			eyebrow: 'Probestunde anfragen',
			title: `Bratschenunterricht in ${label} anfragen`,
			lead: `Schreib mir kurz, für wen der Unterricht ist, ob Vorerfahrung vorhanden ist und welches Ziel du im Kopf hast. Dann melde ich mich mit einer passenden Idee für ${label}.`,
			checklist: [
				label,
				'Lernstand',
				'Probestunde',
			],
			formEyebrow: 'Unterricht starten',
			formTitle: `Passt Viola- oder Bratschenunterricht in ${label} zu dir?`,
			formSuccess: `Danke - ich melde mich persönlich mit einem Vorschlag für den Unterricht in ${label}.`,
		},
		focus: {
			eyebrow: 'Unterrichtsaufbau',
			title: `Woran wir im Bratschenunterricht in ${label} arbeiten.`,
			lead: 'Der genaue Schwerpunkt hängt von Alter, Lernstand und Ziel ab. Diese vier Bereiche tauchen aber in fast jeder guten Unterrichtsphase auf.',
			items: [
				{
					time: 'Start',
					kicker: 'Haltung',
					title: 'Instrument und Körper in Balance bringen',
					text: `Schulter, linke Hand und Bogenarm sollen zusammenarbeiten, damit der Klang in jeder Unterrichtsstunde in ${label} freier werden kann und Üben nicht verspannt.`,
				},
				{
					time: 'Klang',
					kicker: 'Bogen',
					title: 'Einen warmen, tragenden Ton entwickeln',
					text: 'Wir hören genau auf Kontaktstelle, Bogengeschwindigkeit und Gewicht, damit der Ton nicht zufällig entsteht.',
				},
				{
					time: 'Stücke',
					kicker: 'Musik',
					title: 'Technik sofort musikalisch anwenden',
					text: 'Übungen bleiben nicht isoliert. Sie tauchen in kleinen Stücken, Melodien und später auch in Wunschrepertoire wieder auf.',
				},
				{
					time: 'Zu Hause',
					kicker: 'Üben',
					title: 'Mit einem klaren Wochenplan weiterkommen',
					text: `Nach der Stunde weißt du, was Priorität hat, was bis zum nächsten Termin in ${label} realistisch ist und woran du erkennst, dass es besser wird.`,
				},
			],
			footnote: `Für ${label} stimme ich Unterrichtsrhythmus, Lernziel und Probestunde persönlich ab.`,
		},
		imageAltBase: `Bratschenunterricht und Viola lernen in ${label}`,
	};
}

function buildTopic(slug) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const keywordTitle = titleFromKeyword(profile.keyword);
	return {
		targetKeyword: profile.keyword,
		seoTitle: `${keywordTitle} | Viola lernen`,
		seoDescription: `${keywordTitle}: Unterricht für Viola oder Bratsche mit Probestunde, Übeplan, Klang, Haltung und Bogenführung.`,
		hero: {
			eyebrow: profile.eyebrow,
			title: profile.title,
			lead: `${keywordTitle} richtet sich an ${profile.audience}. Der Unterricht verbindet geduldige Technik, musikalische Neugier und Aufgaben, die zwischen den Stunden wirklich funktionieren.`,
			badge: 'Probestunde kostenlos & unverbindlich',
		},
		split: {
			eyebrow: 'Unterricht mit klarem Fokus',
			title: `${keywordTitle} heißt: nicht alles gleichzeitig, sondern der nächste sinnvolle Schritt.`,
			lede: `Wer nach ${profile.keyword} sucht, braucht meist keine allgemeine Musikfloskel, sondern Orientierung. Im Mittelpunkt steht ${profile.mainNeed}. ${profile.difference}`,
			paragraphs: [
				`Der Unterricht beginnt mit einer ehrlichen Bestandsaufnahme: Gibt es Vorerfahrung, ein eigenes Instrument, Notenkenntnisse, ein bestimmtes Ziel oder eher den Wunsch, überhaupt erst herauszufinden, ob Bratsche oder Viola passt?`,
				profile.method,
				`Technisch arbeiten wir an Haltung, Bogenführung, linker Hand, Intonation und Rhythmus. Diese Begriffe bleiben aber nicht abstrakt: Wir übersetzen sie in konkrete Bewegungen, kleine Hörziele und Stücke, die zum aktuellen Stand passen.`,
				profile.repertoire,
				profile.challenge,
				`Eine gute Stunde endet nicht mit einem vagen „üb das mal“. Du bekommst eine überschaubare Aufgabe, einen musikalischen Fokus und einen Hinweis, woran du zu Hause merkst, dass es besser wird.`,
				`Außerdem sprechen wir darüber, wie Lernen zwischen zwei Terminen aussieht. Manche brauchen eine feste Reihenfolge, andere kurze Klangaufgaben oder eine Stelle, die jeden Tag nur wenige Minuten Aufmerksamkeit bekommt.`,
				`Gerade bei ${profile.keyword} ist wichtig, den Suchintent sauber zu treffen: Es geht um Lernen, nicht um einen Auftritt. Deshalb stehen Lernstand, Probestunde, Instrumentenwahl, Übungsrhythmus und Fortschritt im Vordergrund.`,
				`Wenn du unsicher bist, ob Bratsche oder Viola für dich passt, ist die Probestunde der richtige Einstieg. Dort klären wir Körpergefühl, Klangvorstellung, mögliche Instrumentengröße und den nächsten realistischen Schritt.`,
			],
			seal: `${profile.eyebrow}\nKlang & Technik\npersönlich`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: [
				{
					question: `Für wen passt ${profile.keyword}?`,
					answer: `${keywordTitle} passt für ${profile.audience}. Entscheidend ist nicht Perfektion, sondern ein Unterrichtsrahmen, der zu Lernstand und Alltag passt.`,
					open: true,
				},
				{
					question: 'Gibt es eine kostenlose Probestunde?',
					answer: 'Ja. In der Probestunde schauen wir gemeinsam auf Instrument, Vorerfahrung, Ziele und die Frage, welcher Unterrichtsrhythmus realistisch ist.',
				},
				{
					question: 'Muss ich schon Noten lesen können?',
					answer: 'Nein. Notenlesen kann Teil des Unterrichts sein und wird direkt mit dem Spielen verbunden, damit Theorie nicht losgelöst vom Instrument bleibt.',
				},
				{
					question: 'Kann ich als Erwachsene:r noch anfangen?',
					answer: 'Ja. Erwachsene lernen oft sehr bewusst. Wichtig ist ein Übeplan, der in den Alltag passt und nicht mit unrealistischen Erwartungen beginnt.',
				},
				{
					question: 'Ist Unterricht auch für Kinder möglich?',
					answer: 'Ja, wenn Instrumentengröße, Konzentrationsspanne und Aufgaben gut gewählt sind. Bei Kindern beziehe ich die Eltern mit ein, ohne das Üben zu Hause zu kompliziert zu machen.',
				},
				{
					question: 'Welche Musik wird im Unterricht gespielt?',
					answer: 'Das hängt von Lernstand und Ziel ab. Klassische Grundlagen, kleine Melodien, Etüden, Filmmusik oder persönliche Wünsche können sinnvoll kombiniert werden.',
				},
			],
		},
		contact: {
			eyebrow: 'Unterricht anfragen',
			title: `${keywordTitle} anfragen`,
			lead: `Schreib mir kurz, ob du neu anfängst, wieder einsteigst oder für ein Kind suchst. Dann kann ich einschätzen, wie ${profile.keyword} sinnvoll beginnen kann.`,
			checklist: [
				profile.keyword,
				'Lernstand',
				'Probestunde',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt ${profile.keyword} zu dir?`,
			formSuccess: `Danke - ich melde mich persönlich mit einer Idee für ${profile.keyword}.`,
		},
		focus: {
			eyebrow: 'Lernbereiche',
			title: `Was bei ${keywordTitle} konkret aufgebaut wird.`,
			lead: 'Die Gewichtung verändert sich je nach Person. Damit der Unterricht greifbar bleibt, arbeiten wir mit klaren Bausteinen.',
			items: [
				{
					time: 'Körper',
					kicker: 'Haltung',
					title: 'Entspannt spielen statt gegen das Instrument arbeiten',
					text: 'Eine gute Haltung macht den Klang freier und verhindert, dass Üben unnötig anstrengend wird.',
				},
				{
					time: 'Bogen',
					kicker: 'Ton',
					title: 'Klang bewusst formen',
					text: 'Bogenkontakt, Geschwindigkeit und Gewicht werden so erklärt, dass du den Unterschied hören und wiederholen kannst.',
				},
				{
					time: 'Musik',
					kicker: 'Stücke',
					title: 'Übungen in echte Musik übertragen',
					text: 'Jede Technik bekommt eine musikalische Anwendung, damit Fortschritt nicht nur im Übeheft stattfindet.',
				},
				{
					time: 'Alltag',
					kicker: 'Üben',
					title: 'Kleine Aufgaben mit klarer Wirkung',
					text: 'Zu Hause geht es um wenige Prioritäten, die du verstehst und regelmäßig umsetzen kannst.',
				},
			],
			footnote: `${keywordTitle} wird je nach Alter, Vorerfahrung und Ziel individuell geplant.`,
		},
		imageAltBase: `${keywordTitle} mit Viola und Bratsche`,
	};
}

const dir = path.join(ROOT, 'src/content/seo-pages', SERVICE);
const slugs = readdirSync(dir)
	.filter((file) => file.endsWith('.json'))
	.map((file) => file.replace(/\.json$/, ''))
	.sort();

let rewritten = 0;
for (const slug of slugs) {
	const patch = LOCAL_SLUGS.has(slug) ? buildLocal(slug) : buildTopic(slug);
	writeDoc(slug, patch);
	rewritten += 1;
}

console.log(`Rewrote ${rewritten} ${SERVICE} SEO pages.`);
