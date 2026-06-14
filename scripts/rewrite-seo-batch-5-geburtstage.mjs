import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'geburtstage';
const STATUS = 'rewritten-batch-5-review-needed';
const BATCH_NOTE = 'Batch 5: Geburtstagsseiten vollständig nach Orts- und Topic-Intent umgeschrieben. Fachlich im CMS final prüfen.';

const COPY_REPLACEMENTS = [
	[/Fuer/g, 'Für'], [/fuer/g, 'für'],
	[/Dafuer/g, 'Dafür'], [/dafuer/g, 'dafür'],
	[/Ueber/g, 'Über'], [/ueber/g, 'über'],
	[/Pruef/g, 'Prüf'], [/pruef/g, 'prüf'],
	[/Klaer/g, 'Klär'], [/klaer/g, 'klär'],
	[/Staerk/g, 'Stärk'], [/staerk/g, 'stärk'],
	[/Persoen/g, 'Persön'], [/persoen/g, 'persön'],
	[/Waerm/g, 'Wärm'], [/waerm/g, 'wärm'],
	[/Waehr/g, 'Währ'], [/waehr/g, 'währ'],
	[/Stueck/g, 'Stück'], [/stueck/g, 'stück'],
	[/Wuensch/g, 'Wünsch'], [/wuensch/g, 'wünsch'],
	[/Ueb/g, 'Üb'], [/ueb/g, 'üb'],
	[/Moecht/g, 'Möcht'], [/moecht/g, 'möcht'],
	[/Moeg/g, 'Mög'], [/moeg/g, 'mög'],
	[/Koenn/g, 'Könn'], [/koenn/g, 'könn'],
	[/Hoer/g, 'Hör'], [/hoer/g, 'hör'],
	[/Fuehl/g, 'Fühl'], [/fuehl/g, 'fühl'],
	[/Fuehr/g, 'Führ'], [/fuehr/g, 'führ'],
	[/Gaest/g, 'Gäst'], [/gaest/g, 'gäst'],
	[/Gespraech/g, 'Gespräch'], [/gespraech/g, 'gespräch'],
	[/Atmosphaere/g, 'Atmosphäre'], [/atmosphaere/g, 'atmosphäre'],
	[/Oeff/g, 'Öff'], [/oeff/g, 'öff'],
	[/Laeng/g, 'Läng'], [/laeng/g, 'läng'],
	[/Beruehr/g, 'Berühr'], [/beruehr/g, 'berühr'],
	[/Natuer/g, 'Natür'], [/natuer/g, 'natür'],
	[/Einsaetz/g, 'Einsätz'], [/einsaetz/g, 'einsätz'],
	[/Anschliess/g, 'Anschließ'], [/anschliess/g, 'anschließ'],
	[/Spaet/g, 'Spät'], [/spaet/g, 'spät'],
	[/Hauef/g, 'Häuf'], [/hauef/g, 'häuf'],
	[/Haeuf/g, 'Häuf'], [/haeuf/g, 'häuf'],
	[/Groess/g, 'Größ'], [/groess/g, 'größ'],
	[/Gross/g, 'Groß'], [/gross/g, 'groß'],
	[/Raumgroesse/g, 'Raumgröße'], [/raumgroesse/g, 'raumgröße'],
];

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
	aachen: ['Aachen', 'Altstadt, Pontviertel und Feiern im Dreiländereck', 'Gewölbekeller, Restaurantzimmer oder private Häuser im Umland', 'längere Anfahrt mit Puffer und klarer Abstimmung zum ersten Einsatz'],
	'bergisches-land': ['Bergisches Land', 'Höhenlagen, Fachwerkorte und Feiern zwischen Wupper und Dhünn', 'Gartenfeste, Scheunenräume und kleinere Restaurants mit viel Nähe', 'Wetter, Wege und Aufbauplatz besonders früh klären'],
	'bergisch-gladbach': ['Bergisch Gladbach', 'Schildgen, Bensberg und private Feiern am Rand von Köln', 'Villa, Restaurant, Terrasse oder Familienhaus mit engem Gästekreis', 'zwischen Stadtverkehr und bergischem Umland realistische Ankunftszeit planen'],
	bielefeld: ['Bielefeld', 'Altstadt, Musikerviertel und Geburtstage rund um den Teutoburger Wald', 'Wohnzimmerkonzert, Restaurantbereich oder Gartenfeier mit ruhigem Rahmen', 'Anreise und Aufbau so planen, dass genug Zeit zum Stimmen bleibt'],
	bochum: ['Bochum', 'Innenstadt, Ehrenfeld, Stiepel und private Feiern im Ruhrgebiet', 'lockere Familienfeier, Kulturraum oder Dinner mit vielen Gesprächen', 'Parken, Ladeweg und Startsignal vorab konkret festlegen'],
	bonn: ['Bonn', 'Südstadt, Rheinlage und Familienfeiern zwischen Stadt und Siebengebirge', 'Salon, Restaurant, Terrasse oder Hauskonzert mit persönlicher Note', 'Rheinverkehr und Locationzugang mit einem kleinen Puffer planen'],
	bottrop: ['Bottrop', 'ruhige Wohnlagen, Ruhrgebietsfeiern und Familienfeste mit direktem Kontakt', 'Garten, Vereinsraum oder Restaurant mit überschaubarer Gästezahl', 'Aufbau schlicht halten und den ersten Einsatz klar mit der Gastgeberperson abstimmen'],
	dormagen: ['Dormagen', 'Rheinlage, Zons und Feiern zwischen Düsseldorf und Köln', 'Innenhof, Restaurantzimmer oder privater Garten mit familiärer Stimmung', 'die Lage zwischen zwei Städten für Anfahrt und Setzeiten mitdenken'],
	dortmund: ['Dortmund', 'Kreuzviertel, Phoenixsee, Hörde und Geburtstage im östlichen Ruhrgebiet', 'größere Familienrunden, moderne Räume oder ein Dinner mit mehreren Generationen', 'bei weitläufigen Locations Treffpunkt und Aufbauplatz vorher festlegen'],
	duesseldorf: ['Düsseldorf', 'Rheinufer, Kaiserswerth, Flingern und private Feiern in Stadtnähe', 'Dinner, Sektempfang oder musikalische Überraschung in Wohnung, Restaurant oder Garten', 'Innenstadtverkehr, Aufzug und kurze Ladewege vorab berücksichtigen'],
	duisburg: ['Duisburg', 'Innenhafen, linksrheinische Stadtteile und Familienfeiern im Westen des Ruhrgebiets', 'Restaurant, Terrasse oder private Feier mit unkomplizierter Atmosphäre', 'Wege durch große Stadtteile und Parkmöglichkeiten vorab sauber abstimmen'],
	erkrath: ['Erkrath', 'Neandertal, Unterfeldhaus und Feiern nah an Düsseldorf', 'Gartenfeier, Wohnzimmermoment oder kleines Dinner im Familienkreis', 'kurze Wege nutzen und trotzdem einen ruhigen Aufbauplatz einplanen'],
	essen: ['Essen', 'Rüttenscheid, Baldeneysee und private Feiern im zentralen Ruhrgebiet', 'Empfang, Dinnermusik oder Überraschungsmoment in Restaurant und Zuhause', 'bei großen Stadtwegen genug Zeit für Ankunft, Stimmen und Soundcheck lassen'],
	gelsenkirchen: ['Gelsenkirchen', 'Buer, Schalke, Ückendorf und private Ruhrgebietsfeiern', 'Familienfest, Vereinsraum oder Geburtstag mit lockerer Tischordnung', 'Ankunft und erster Einsatz werden so geplant, dass keine Unruhe entsteht'],
	haan: ['Haan', 'Gartenstadt-Charakter, Nachbarschaftsnähe und Feiern zwischen Düsseldorf und Wuppertal', 'Terrasse, Wohnzimmer oder Restaurant mit persönlichem Kreis', 'Aufbau klein halten und die Überraschung diskret vorbereiten'],
	hagen: ['Hagen', 'Volme, Haspe, Hohenlimburg und Feiern am Rand des Sauerlands', 'Familienhaus, Restaurant oder Feier mit Blick ins Grüne', 'Anfahrt und Wetter bei Außenmomenten besonders zuverlässig planen'],
	heiligenhaus: ['Heiligenhaus', 'ruhige Wohnlagen, Höfe und Feiern zwischen Ratingen und Velbert', 'Garten, Esszimmer oder kleiner Saal mit familiärem Mittelpunkt', 'Zugang, Strombedarf und Wetterschutz unkompliziert vorab klären'],
	herne: ['Herne', 'Wanne, Eickel und Geburtstage mitten im Ruhrgebiet', 'direkte Familienfeier, Restaurantzimmer oder kurzer musikalischer Überraschungsbesuch', 'Timing genau setzen, damit der erste Ton zum geplanten Moment kommt'],
	hilden: ['Hilden', 'Innenstadt, Wohnviertel und Feiern zwischen Düsseldorf, Solingen und Langenfeld', 'Dinner, Sektempfang oder Gartenfest mit kurzer persönlicher Ansprache', 'durch kurze Wege flexibel bleiben und trotzdem den Ablauf klar notieren'],
	iserlohn: ['Iserlohn', 'Sauerlandnähe, Letmathe und private Feiern mit viel Familienbezug', 'Hauskonzert, Garten, Restaurant oder Feier mit ruhigem Empfang', 'Anreise und Wetteroptionen für Außenmusik früh mitdenken'],
	koeln: ['Köln', 'Veedel, Rheinlage und Geburtstage zwischen Altbau, Restaurant und Eventraum', 'Sektempfang, Dinner oder Überraschung in geselliger Atmosphäre', 'bei dichter Stadtlage Treffpunkt, Parken und Beginn besonders genau planen'],
	krefeld: ['Krefeld', 'Bockum, Uerdingen, Stadtwald und private Geburtstage am Niederrhein', 'Gartenfeier, Restaurant oder Empfang mit entspanntem Charakter', 'Ablauf und Raumgröße vorab klären, damit die Viola präsent und nicht zu laut wirkt'],
	'kreis-mettmann': ['Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert und kleinere Orte dazwischen', 'Garten, Restaurant, Hof oder Wohnzimmer mit regionalem Familienkreis', 'mehrere mögliche Anfahrtswege und Stadtgrenzen entspannt einplanen'],
	langenfeld: ['Langenfeld', 'Feiern zwischen Düsseldorf, Leverkusen und Monheim', 'Restaurant, Terrasse oder private Familienfeier mit gutem Anschluss', 'den Ablauf kompakt planen, damit Musik den Empfang oder das Dinner gezielt öffnet'],
	leverkusen: ['Leverkusen', 'Schlebusch, Opladen, Rheinlage und Feiern zwischen Köln und Bergischem Land', 'Geburtstagsdinner, Gartenfest oder musikalisches Geschenk im Familienkreis', 'Anfahrt zwischen Stadtteilen und Locationzugang vorab konkretisieren'],
	meerbusch: ['Meerbusch', 'Büderich, Osterath, Rheinlage und ruhige private Feiern', 'Garten, Hauskonzert oder Dinner mit elegantem, persönlichem Ton', 'dezente Musik und klares Timing passen hier oft besser als ein großer Auftritt'],
	mettmann: ['Mettmann', 'Neandertalnähe, Altstadt und Familienfeiern im Kreis Mettmann', 'kleiner Saal, Restaurant oder private Feier mit viel Gespräch', 'Ankunft, Aufbauplatz und Wunschlied diskret vorab mit einer Kontaktperson klären'],
	moenchengladbach: ['Mönchengladbach', 'Rheydt, Wickrath und Geburtstage am linken Niederrhein', 'Familienfest, Restaurant oder Gartenfeier mit mehreren Generationen', 'größere Wege im Stadtgebiet und den richtigen Moment für den Einsatz planen'],
	moers: ['Moers', 'Niederrhein, Schlossnähe und Feiern zwischen Duisburg und Kamp-Lintfort', 'Garten, Restaurant oder private Feier mit ruhigem Anfang', 'bei Außenmusik Wetterschutz und einen stabilen Platz für das Instrument sichern'],
	'monheim-am-rhein': ['Monheim am Rhein', 'Rheinpromenade, Baumberg und Feiern zwischen Düsseldorf und Leverkusen', 'Terrasse, Restaurant oder Empfang nachmittags mit Familienbezug', 'Rheinlage und Wetteroptionen bei musikalischen Außenmomenten beachten'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr', 'Ruhrtal, Broich, Saarn und private Feiern mit grüner Stadtnähe', 'Gartenfest, Restaurant oder Dinner mit ruhiger Eleganz', 'Wege am Wasser, Parken und Aufbauplatz vorher entspannt klären'],
	muenster: ['Münster', 'Altstadt, Aasee und Geburtstage mit heller, kultivierter Atmosphäre', 'Empfang, Hauskonzert oder Dinner in privatem Rahmen', 'Anreise und Fahrrad-/Innenstadtlogistik mit genügend Zeitpuffer planen'],
	neuss: ['Neuss', 'Innenstadt, Rheinlage und Feiern zwischen Düsseldorf und Grevenbroich', 'Sektempfang, Garten oder Familienessen mit kurzer musikalischer Überraschung', 'Nähe zu Düsseldorf nutzen und trotzdem den genauen Treffpunkt festlegen'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land und weitere Städte in NRW', 'private Feiern von der kleinen Wohnung bis zum größeren Familienfest', 'Anfahrt, Region und Setlänge individuell nach Termin prüfen'],
	oberhausen: ['Oberhausen', 'Sterkrade, Alt-Oberhausen und Feiern im westlichen Ruhrgebiet', 'Familienfeier, Restaurant oder Geburtstag mit entspanntem Empfang', 'bei großen Wegen im Ruhrgebiet Startzeit und Aufbau nicht zu knapp legen'],
	paderborn: ['Paderborn', 'Innenstadt, Schloss Neuhaus und Feiern in Ostwestfalen', 'Hauskonzert, Restaurant oder Familienfeier mit ruhiger Planung', 'Anreise und Setlänge früh abstimmen, damit sich die weitere Strecke lohnt'],
	ratingen: ['Ratingen', 'Lintorf, Hösel, Tiefenbroich und Feiern nah an Düsseldorf', 'Garten, Restaurant oder Wohnzimmer mit elegantem, aber lockeren Rahmen', 'kurze Distanzen helfen, trotzdem werden Beginn und Überraschungsmoment klar geplant'],
	recklinghausen: ['Recklinghausen', 'Altstadt, Süd, Hochlar und Geburtstage am Rand des Ruhrgebiets', 'Restaurant, Familienhaus oder Empfang mit vielen Gesprächen', 'Anfahrt und Parken ruhig vorab klären, damit der Beginn unaufgeregt bleibt'],
	remscheid: ['Remscheid', 'Bergische Höhen, Lennep und private Feiern mit gemütlichem Charakter', 'Gartenfeier, Esszimmer oder kleiner Saal mit engem Familienkreis', 'Wetter und Wege bei Außenmusik besonders realistisch einplanen'],
	'rhein-kreis-neuss': ['Rhein-Kreis Neuss', 'Neuss, Meerbusch, Dormagen, Grevenbroich und die Rheinorte dazwischen', 'Gartenfest, Restaurant oder familiärer Empfang mit regionalen Gästen', 'Anfahrt und Stadtgrenzen flexibel planen, damit der Ablauf ruhig bleibt'],
	rheinland: ['Rheinland', 'Rheinstädte, kleinere Orte und Feiern mit offener, geselliger Atmosphäre', 'Sektempfang, Garten, Dinner oder musikalische Überraschung für Familie und Freundeskreis', 'Region, Fahrzeit und gewünschte Setlänge individuell abstimmen'],
	'rhein-ruhr': ['Rhein-Ruhr', 'dichte Wege zwischen Düsseldorf, Köln, Essen, Dortmund und Duisburg', 'private Feiern mit Gästen aus mehreren Städten', 'Verkehr, Timing und Aufbau mit realistischen Puffern planen'],
	ruhrgebiet: ['Ruhrgebiet', 'viele Städte nah beieinander und Feiern mit direkter, herzlicher Stimmung', 'Restaurant, Vereinshaus, Garten oder Familienwohnung mit lebendigem Charakter', 'klare Absprachen zu Startsignal und Lautstärke sind hier besonders hilfreich'],
	siegen: ['Siegen', 'Oberstadt, Siegerland und Feiern mit weiterem regionalem Einzugsgebiet', 'Familienhaus, Restaurant oder Feier im Grünen', 'die längere Anfahrt mit Setdauer und Zeitfenster sinnvoll verbinden'],
	solingen: ['Solingen', 'Ohligs, Gräfrath, Wald und bergische Geburtstage', 'Garten, Restaurant oder private Feier mit handgemachtem Charakter', 'bei Häusern und Höhenlagen Zugang und Wetteroptionen früh besprechen'],
	unna: ['Unna', 'Altstadt, Königsborn und Feiern zwischen Ruhrgebiet und Hellweg', 'Familienessen, Gartenfest oder musikalische Überraschung am Nachmittag', 'Anfahrt, Aufbau und erster Einsatz werden ohne Hektik aufeinander abgestimmt'],
	velbert: ['Velbert', 'Neviges, Langenberg und Feiern zwischen Ruhrgebiet und Bergischem Land', 'Fachwerkambiente, Restaurant oder privater Garten mit ruhigem Ton', 'bei Steigungen, Wegen und Außenflächen genug Zeit für Aufbau einplanen'],
	viersen: ['Viersen', 'private Feiern am Niederrhein', 'Garten, Restaurant oder Familienhaus', 'Anfahrt und Setlänge vorab abstimmen'],
	wuelfrath: ['Wülfrath', 'kleine Stadtwege, bergische Nähe und persönliche Familienfeiern', 'Wohnzimmer, Garten oder Restaurant mit überschaubarem Kreis', 'ruhiger Aufbau und ein klarer Überraschungsmoment passen hier besonders gut'],
	wuppertal: ['Wuppertal', 'Elberfeld, Barmen, Höhenlagen und Feiern entlang der Wupper', 'Altbauwohnung, Garten am Hang oder Restaurant mit lebendigem Publikum', 'Wege, Treppen und Wetter bei Außenmusik vorab mitdenken'],
};

const TOPIC_PROFILES = {
	'private-feier': ['Musik private Feier', 'Private Feier', 'Musik für private Feiern, die Nähe schafft, ohne den Abend zu dominieren.', 'private Geburtstage, kleine Jubiläen und familiäre Treffen', 'Wohnzimmer, Garten, Restaurant oder kleiner Saal', 'Gespräche, Begrüßung und persönliche Momente'],
	'live-musik-geburtstag': ['Live Musik Geburtstag', 'Live-Musik', 'Live Musik zum Geburtstag, die auf echte Momente reagieren kann.', 'Geburtstagsfeiern mit Empfang, Dinner oder Überraschung', 'private Räume, Restaurants und Gärten', 'spontane Pausen, Gratulationen und Wunschlieder'],
	'musikerin-geburtstag': ['Musikerin Geburtstag', 'Musikerin', 'Eine Musikerin zum Geburtstag, wenn der Moment persönlich und nah klingen soll.', 'Gastgeber:innen, Familien und Freundeskreise', 'dezente Solo-Begleitung statt großer Band', 'klare Absprachen und ein unaufdringlicher Auftritt'],
	'viola-geburtstag': ['Viola Geburtstag', 'Viola', 'Viola zum Geburtstag, warm im Klang und nah an der Feier.', 'Geburtstage mit ruhiger, besonderer Klangfarbe', 'Dinner, Empfang oder kurzes musikalisches Geschenk', 'klassische, moderne und persönliche Melodien'],
	'geige-geburtstag': ['Geige Geburtstag', 'Geige', 'Geige zum Geburtstag, wenn eine vertraute Melodie festlich wirken soll.', 'Suchende, die nach Geige fragen und Solo-Streichmusik meinen', 'Überraschung, Sektempfang oder Dinner', 'helle Melodien, klare Einsätze und persönliche Stücke'],
	'bratsche-geburtstag': ['Bratsche Geburtstag', 'Bratsche', 'Bratsche zum Geburtstag, mit weichem Klang und persönlicher Tiefe.', 'Feiern, die bewusst eine warme Streichfarbe suchen', 'kleine Räume, Gärten und ruhige Dinner', 'tiefe Lagen, Nähe und dezente Präsenz'],
	'streichmusik-geburtstag': ['Streichmusik Geburtstag', 'Streichmusik', 'Streichmusik zum Geburtstag, wenn der Anlass feierlich, aber nicht überladen wirken soll.', 'private Feiern mit klassischem oder modernem Rahmen', 'Empfang, Dinner und kurze Ehrungsmomente', 'Instrumentalmusik ohne Showdruck'],
	'instrumentalmusik-geburtstag': ['Instrumentalmusik Geburtstag', 'Instrumentalmusik', 'Instrumentalmusik zum Geburtstag, die Gespräche trägt und nicht überlagert.', 'Feiern, bei denen Sprache und Begegnung wichtig bleiben', 'Dinner, Empfang und Hintergrundmusik', 'Melodien ohne Gesang und ohne laute Technik'],
	'musik-familienfeier': ['Musik Familienfeier', 'Familienfeier', 'Musik für Familienfeiern, die mehrere Generationen zusammenbringt.', 'Geburtstage, Jubiläen und Treffen im Familienkreis', 'Restaurant, Garten, Saal oder Wohnzimmer', 'Ankommen, Gratulationen und gemeinsames Essen'],
	'musik-gartenfeier': ['Musik Gartenfeier', 'Gartenfeier', 'Musik für die Gartenfeier, leicht, wetterbewusst und nah an den Gästen.', 'Sommergeburtstage, Terrassenfeiern und lockere Empfänge', 'Garten, Hof, Terrasse oder überdachter Außenbereich', 'Wetter, Schatten und kurze Wege'],
	'musik-gartenfest': ['Musik Gartenfest', 'Gartenfest', 'Musik für ein Gartenfest, wenn der Tag offen und lebendig bleiben soll.', 'größere Geburtstage im Freien', 'Garten, Hof, Pavillon oder lockere Stehtische', 'Sets zwischen Gesprächen, Essen und Gratulationen'],
	'sektempfang-geburtstag': ['Musik Sektempfang Geburtstag', 'Sektempfang', 'Musik zum Sektempfang beim Geburtstag, die Ankommen und Gratulieren verbindet.', 'Empfang vor Dinner oder Feierbeginn', 'Foyer, Garten, Terrasse oder Restaurantempfang', 'erste Gespräche, Toast und Begrüßung'],
	'dinner-geburtstag': ['Musik Dinner Geburtstag', 'Dinner', 'Musik zum Geburtstagsdinner, dezent zwischen Gängen, Reden und Gesprächen.', 'sitzende Geburtstagsessen und festliche Menüs', 'Restaurant, privates Esszimmer oder kleiner Saal', 'Service, Reden und ruhige Übergänge'],
	'hintergrundmusik-geburtstag': ['Hintergrundmusik Geburtstag', 'Hintergrundmusik', 'Hintergrundmusik zum Geburtstag, die Atmosphäre schafft, ohne laut zu werden.', 'Feiern mit vielen Gesprächen', 'Empfang, Dinner, Garten oder Lounge', 'dezente Lautstärke und flexible Setlängen'],
	'musikalische-ueberraschung-geburtstag': ['Musikalische Überraschung Geburtstag', 'Überraschung', 'Eine musikalische Überraschung zum Geburtstag, diskret geplant und emotional gesetzt.', 'Überraschungen von Partner:innen, Kindern, Freunden oder Kolleg:innen', 'Wohnzimmer, Restaurant, Garten oder Feierbeginn', 'geheimer Einsatz, Wunschlied und Reaktion des Geburtstagskinds'],
	'musikalisches-geschenk-geburtstag': ['Musikalisches Geschenk Geburtstag', 'Geschenk', 'Ein musikalisches Geschenk zum Geburtstag, das persönlicher wirkt als etwas Verpacktes.', 'Menschen, die ein besonderes Geburtstagsgeschenk suchen', 'kurzes Ständchen, Wunschlied oder kleiner Auftritt', 'Bedeutung, Timing und eine diskrete Vorbereitung'],
};

const LOCAL_EXTRA_PARAGRAPHS = {
	iserlohn: [
		'Für Iserlohn plane ich Geburtstagsmusik oft mit etwas mehr Blick auf Anreise und Setdauer. Wenn die Feier im Grünen, in Letmathe oder in einem privaten Haus stattfindet, lohnt sich ein klarer Zeitplan mit Puffer für Aufbau und Stimmung.',
		'Gerade durch die Sauerlandnähe wirken ruhige, warme Stücke oft sehr passend. Die Musik darf familiär bleiben und muss nicht urban oder eventhaft klingen, um den Geburtstag besonders zu machen.',
	],
	mettmann: [
		'In Mettmann ist der Rahmen häufig kleiner und direkter: Familienessen, Altstadtnähe, Neandertalbezug oder eine Feier im Kreis Mettmann. Dafür setze ich Musik eher als persönlichen Akzent statt als langen Programmpunkt.',
		'Wenn Gäste aus Düsseldorf, Erkrath, Haan oder Wülfrath dazukommen, kann die Viola den gemeinsamen Beginn sammeln. Ein kurzes Wunschlied nach der Begrüßung wirkt hier oft stärker als dauerhaftes Spiel im Hintergrund.',
	],
};

function normalizeGermanCopy(value) {
	if (typeof value === 'string') {
		return COPY_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
	}
	if (Array.isArray(value)) return value.map(normalizeGermanCopy);
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeGermanCopy(entry)]));
	}
	return value;
}

function hash(value) {
	return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0);
}

function pick(slug, values, offset = 0) {
	return values[(hash(slug) + offset) % values.length];
}

function titleFromKeyword(keyword) {
	return keyword
		.replace(/\b\w/g, (char) => char.toLocaleUpperCase('de-DE'))
		.replace('Am Der', 'an der');
}

function fileFor(slug) {
	return path.join(ROOT, 'src/content/seo-pages', SERVICE, `${slug}.json`);
}

function noteFor(doc) {
	const notes = normalizeGermanCopy(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
}

function writeDoc(slug, patch) {
	const file = fileFor(slug);
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

function buildLocal(slug, doc, index) {
	const [label, localContext, roomContext, logistics] = LOCATION_PROFILES[slug];
	const keyword = `Live Musik Geburtstag ${label}`;
	const mood = pick(slug, ['warm und persönlich', 'festlich, aber unaufdringlich', 'nah an den Gästen', 'leicht, elegant und gesprächsfreundlich', 'emotional ohne Pathos'], 1);
	const setup = pick(slug, ['als musikalische Überraschung', 'zum Sektempfang', 'während des Dinners', 'als kurzer Empfangsmoment', 'als ruhige Begleitung beim Ankommen'], 2);
	const repertoire = pick(slug, ['klassische Melodien, moderne Songs und ein persönliches Wunschlied', 'ruhige Lieblingsstücke, Filmmusik und festliche Instrumentalmusik', 'dezente Klassiker, Pop-Melodien und warme Viola-Klänge', 'ein Wunschlied, feierliche Stücke und leichte Musik für Gespräche'], 3);
	const planning = pick(slug, ['Ich plane lieber wenige klare Einsätze als zu viel Musik am Stück.', 'Die Musik bekommt feste Momente, bleibt aber flexibel, falls sich der Ablauf verschiebt.', 'Vorab klären wir, ob die Musik angekündigt wird oder als Überraschung beginnt.', 'Die Sets werden so gesetzt, dass Gratulationen und Gespräche nicht überdeckt werden.'], 4);
	const energy = pick(slug, ['Der Klang der Viola bringt Ruhe in den Raum und wirkt persönlicher als eine Playlist.', 'Solo-Viola braucht wenig Aufbau und kann auch in kleinen Räumen sehr präsent wirken.', 'Die Musik kann ein Fest öffnen, ohne die Gäste in eine Konzert-Situation zu zwingen.', 'Gerade bei privaten Geburtstagen zählt der Moment mehr als Lautstärke.'], 5);
	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Live-Viola`,
		seoDescription: `${keyword}: Solo-Viola für Geburtstag, Dinner, Empfang und Überraschung in ${label}. Persönlich geplant.`,
		hero: {
			eyebrow: `Geburtstag in ${label}`,
			title: `Live Musik zum Geburtstag in ${label}, die persönlich bleibt.`,
			lead: `Ob ${setup}, beim Dinner oder als Geschenk: Ich begleite Geburtstage in ${label} mit Solo-Viola, abgestimmt auf Raum, Gäste und den richtigen Moment.`,
			badge: `Für private Feiern in ${label}`,
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Geburtstagsmusik in ${label} muss zum Ort und zur Feier passen.`,
			lede: `In ${label} entstehen Geburtstage sehr unterschiedlich: ${localContext}. Deshalb plane ich Live-Musik nicht pauschal, sondern nach Anlass, Raumgröße und gewünschter Nähe.`,
			paragraphs: [
				`Typische Orte sind ${roomContext}. Dort wirkt die Viola besonders gut, wenn sie gezielt eingesetzt wird: zum Ankommen, für ein Wunschlied, als Übergang zum Essen oder als kurzer emotionaler Mittelpunkt.`,
				`${planning} Wenn der Geburtstag lebendig und gesprächig ist, bleibt die Musik eher leicht. Wenn ein besonderer Moment geplant ist, darf ein Stück kurz mehr Aufmerksamkeit bekommen.`,
				`Für ${label} kläre ich vorab auch die praktischen Details: ${logistics}. So bleibt am Tag selbst genug Ruhe für Stimmung, Aufbau und den ersten Ton.`,
				`Das Repertoire kann ${repertoire} verbinden. Entscheidend ist nicht, möglichst viele Stile abzudecken, sondern die Musik an die Person anzupassen, die gefeiert wird.`,
				`${energy} Deshalb arbeite ich mit klaren Zeichen, passenden Pausen und einer Lautstärke, die Glückwünsche und Gespräche respektiert.`,
				`Wenn mehrere Generationen dabei sind, hilft ein ausgewogener Bogen: etwas Vertrautes für die Familie, ein modernes Stück für die persönliche Note und ein ruhiger Ausklang, wenn der offizielle Moment vorbei ist.`,
				`Zusätzlich bespreche ich, wie sichtbar die Musik sein soll. Manche Feiern wünschen einen kleinen Mittelpunkt, andere nur einen besonderen Klang im Hintergrund. Beides funktioniert, wenn Einsatz, Position im Raum und Erwartung der Gäste vorher klar sind.`,
				...(LOCAL_EXTRA_PARAGRAPHS[slug] ?? []),
			],
		},
		focus: {
			eyebrow: 'Ablaufideen',
			title: `So kann Live-Musik in ${label} eingebunden werden.`,
			lead: `Die genaue Dramaturgie richtet sich nach Gastgeber:in, Location und Gästekreis. Diese vier Varianten funktionieren bei Geburtstagen besonders häufig.`,
			items: [
				{ time: 'Ankommen', kicker: 'Empfang', title: `Musik, wenn Gäste in ${label} eintreffen`, text: 'Ein leichtes Set nimmt Unruhe aus dem Beginn und gibt dem Raum sofort eine besondere, aber nicht steife Stimmung.' },
				{ time: 'Überraschung', kicker: 'Wunschlied', title: 'Ein persönliches Stück für das Geburtstagskind', text: 'Der Einsatz wird diskret mit einer Kontaktperson abgesprochen, damit die Überraschung natürlich und nicht inszeniert wirkt.' },
				{ time: 'Dinner', kicker: 'Begleitung', title: 'Dezente Musik zwischen Gesprächen', text: 'Kurze Sets zwischen Gängen, Reden oder Toasts geben dem Essen einen feierlichen Rahmen, ohne Tischgespräche zu stören.' },
				{ time: 'Ausklang', kicker: 'Übergang', title: 'Ein ruhiger Schluss für den offiziellen Teil', text: 'Nach Gratulationen oder einer kleinen Rede kann ein Stück den Moment abrunden und die Feier offen weiterlaufen lassen.' },
			],
			footnote: `Für Feiern in ${label} stimme ich Setlänge, Ort im Raum und Lautstärke vorher konkret ab.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Live Musik zum Geburtstag in ${label}`,
			items: [
				{ question: `Spielst du auf Geburtstagen in ${label}?`, answer: `Ja. Ich begleite Geburtstage und private Feiern in ${label} mit Solo-Viola, vom kurzen Wunschlied bis zur längeren Empfangs- oder Dinnermusik.`, open: true },
				{ question: 'Kann die Musik eine Überraschung sein?', answer: `Ja. Gerade in ${label} plane ich dafür Ankunft, erstes Stück und Blickzeichen diskret mit einer Vertrauensperson, damit nichts vorab auffällt.` },
				{ question: 'Welche Musik passt zu einer Geburtstagsfeier?', answer: `Das hängt von Person und Moment ab. Möglich sind ${repertoire}; am Ende zählt, was zum Geburtstagskind und zur Runde passt.` },
				{ question: 'Ist Musik draußen möglich?', answer: `Ja, wenn Wetter, Untergrund und Schutz für das Instrument stimmen. Bei ${roomContext} klären wir am besten auch eine Innenoption.` },
				{ question: 'Wie lange sollte die Musik dauern?', answer: 'Für eine Überraschung reichen oft ein bis drei Stücke. Für Empfang oder Dinner sind mehrere kurze Sets meist angenehmer als ein langer Block.' },
				{ question: 'Was brauchst du vor Ort?', answer: `Einen sicheren Platz, Licht, etwas Ruhe zum Stimmen und die Info, wann der erste Einsatz geplant ist. Außerdem berücksichtige ich: ${logistics}.` },
			],
		},
		contact: {
			eyebrow: 'Geburtstag anfragen',
			title: `Live Musik zum Geburtstag in ${label} anfragen`,
			lead: `Schick mir Datum, Ort in ${label}, Gästezahl und ob es ein Wunschlied oder eine Überraschung geben soll. Ich melde mich mit einer passenden musikalischen Idee.`,
			checklist: [label, 'Geburtstag', 'Wunschlied oder Ablauf'],
			formEyebrow: 'Details senden',
			formTitle: `Geburtstagsmusik in ${label} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für eure Geburtstagsmusik in ${label}.`,
		},
		imageAltBase: `Live-Viola als Geburtstagsmusik in ${label}`,
	};
}

function buildTopic(slug, doc) {
	const profile = TOPIC_PROFILES[slug];
	const [keyword, eyebrow, title, bestFor, room, detail] = profile;
	const keywordTitle = titleFromKeyword(keyword);
	const contrast = pick(slug, ['nicht wie ein Programmpunkt wirken', 'Gespräche nicht zudecken', 'den Anlass nicht künstlich vergrößern', 'nah an der Person bleiben', 'den Raum nicht beschallen'], 1);
	const planning = pick(slug, ['Timing, Lautstärke und Länge werden vorher konkret geplant', 'die Musik bekommt klare Einsätze statt Dauerbeschallung', 'Wunschlieder werden auf Wirkung und Spielbarkeit geprüft', 'der Ablauf bleibt flexibel, aber nicht zufällig'], 2);
	return {
		targetKeyword: keyword,
		seoTitle: `${keywordTitle} | Live-Viola Geburtstag`,
		seoDescription: `${keyword}: Solo-Viola für private Geburtstage, Empfang, Dinner oder Überraschung. Persönlich und dezent geplant.`,
		hero: {
			eyebrow,
			title,
			lead: `Für ${bestFor}: Ich plane Solo-Viola so, dass sie in ${room} funktioniert und ${detail} musikalisch unterstützt.`,
			badge: 'Geburtstag persönlich begleiten',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht eine andere Planung als allgemeine Partymusik.`,
			lede: `Wer nach ${keyword} sucht, möchte meistens keinen lauten Showblock. Gesucht wird ein musikalischer Moment, der den Geburtstag besonders macht und trotzdem zur privaten Atmosphäre passt.`,
			paragraphs: [
				`Der wichtigste Unterschied liegt im Maß: Die Musik soll ${contrast}. Deshalb kläre ich zuerst, ob sie als Geschenk, als Empfang, als Hintergrund oder als bewusster Mittelpunkt gedacht ist.`,
				`Für ${bestFor} eignet sich Solo-Viola besonders, weil sie warm klingt und wenig technischen Aufwand braucht. Sie kann ein Zimmer, einen Garten oder ein Restaurant füllen, ohne die Feier zu übernehmen.`,
				`Im Mittelpunkt steht immer die Person, die Geburtstag hat. Ein Lieblingslied, ein bestimmter Stil oder ein kurzer musikalischer Gruß kann stärker wirken als ein langes Set ohne Bezug.`,
				`${planning}. So entsteht ein Ablauf, bei dem die Musik natürlich beginnt, rechtzeitig wieder Platz macht und den richtigen Moment nicht verpasst.`,
				`Wenn mehrere Gäste etwas beitragen möchten, kann Musik auch verbinden: vor einer Rede, nach einem Toast oder als ruhiger Übergang zum Essen. Dadurch wirkt der Tag geordnet, aber nicht steif.`,
				`Diese Seite ist bewusst auf ${keyword} zugeschnitten. Andere Geburtstagsseiten behandeln zum Beispiel Gartenfeier, Dinner, Sektempfang oder musikalisches Geschenk mit eigener Dramaturgie.`,
				`Praktisch bedeutet das: Für ${keyword} bespreche ich nicht nur die Stückauswahl, sondern auch die soziale Situation. Bei ${bestFor} macht es einen Unterschied, ob Gäste stehen, sitzen, essen oder auf eine Überraschung warten.`,
				`Auch die Länge wird passend zum Suchintent gewählt. In ${room} reicht manchmal ein präziser musikalischer Impuls; bei ${detail} sind mehrere kurze Einsätze sinnvoller, weil die Musik dann wieder Raum für Begegnung lässt.`,
			],
		},
		focus: {
			eyebrow: 'Planung',
			title: `Typische Einsatzpunkte für ${keyword}.`,
			lead: `Nicht jeder Geburtstag braucht dieselbe musikalische Länge. Entscheidend ist, welche Aufgabe die Musik übernehmen soll.`,
			items: [
				{ time: 'Vor Beginn', kicker: 'Ankommen', title: 'Den Raum öffnen', text: `Ein erstes Set schafft Atmosphäre, während Gäste eintreffen und noch nicht alle Gespräche sortiert sind.` },
				{ time: 'Hauptmoment', kicker: 'Persönlich', title: 'Ein Stück mit Bedeutung', text: `Ein Wunschlied oder eine vertraute Melodie macht ${keyword} besonders, ohne viele Worte zu brauchen.` },
				{ time: 'Während der Feier', kicker: 'Begleitung', title: 'Musik als ruhiger Rahmen', text: `Kurze Sets können Gratulationen, Essen oder lockere Begegnungen tragen, ohne die Feier anzuhalten.` },
				{ time: 'Nach einer Rede', kicker: 'Übergang', title: 'Worte nachklingen lassen', text: `Nach Toast, Rede oder Geschenk kann Musik den Moment lösen und den nächsten Teil des Geburtstags öffnen.` },
			],
			footnote: `Die konkrete Länge richtet sich nach Raum, Gästezahl, Anlass und gewünschter Wirkung.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keyword}`,
			items: [
				{ question: `Für welche Geburtstage passt ${keyword}?`, answer: `${keyword} passt besonders zu ${bestFor}. Wichtig ist, dass der musikalische Moment zum Menschen und nicht nur zum Anlass passt.`, open: true },
				{ question: 'Kann ein Lieblingslied eingebunden werden?', answer: 'Ja, wenn die Melodie für Solo-Viola geeignet ist. Ich prüfe Tonart, Länge und Wirkung und schlage gegebenenfalls einen passenden Ausschnitt vor.' },
				{ question: 'Wie lang sollte die Musik dauern?', answer: 'Für ein Geschenk reichen oft wenige Stücke. Für Empfang, Dinner oder Hintergrundmusik sind mehrere kurze Sets sinnvoller als ein langer Block.' },
				{ question: 'Ist die Musik auch im kleinen privaten Rahmen passend?', answer: `Ja. Gerade in ${room} funktioniert Solo-Viola gut, weil der Klang nah bleibt und keine große Bühne braucht.` },
				{ question: 'Wie wird der Ablauf abgestimmt?', answer: `Wir klären Startsignal, Platz im Raum, gewünschte Stimmung und mögliche Pausen. So bleibt ${keyword} am Tag selbst entspannt.` },
				{ question: 'Kann die Musik draußen gespielt werden?', answer: 'Ja, wenn ein geschützter Platz vorhanden ist. Für Garten oder Terrasse besprechen wir Schatten, Wetteroption und Abstand zu Gesprächen.' },
			],
		},
		contact: {
			eyebrow: 'Geburtstagsmusik planen',
			title: `${keywordTitle} anfragen`,
			lead: `Schick mir Anlass, Ort, Gästezahl und den gewünschten musikalischen Moment. Ich melde mich mit einer passenden Idee für ${keyword}.`,
			checklist: [keyword, 'Geburtstag', 'Ablauf & Wunschlied'],
			formEyebrow: 'Anfrage senden',
			formTitle: `${keywordTitle} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer passenden Idee für ${keyword}.`,
		},
		imageAltBase: `Live-Viola für ${keyword}`,
	};
}

const files = readdirSync(path.join(ROOT, 'src/content/seo-pages', SERVICE)).filter((file) => file.endsWith('.json'));
for (const [index, file] of files.entries()) {
	const slug = file.replace(/\.json$/, '');
	const doc = JSON.parse(readFileSync(fileFor(slug), 'utf8'));
	if (LOCAL_SLUGS.has(slug)) {
		if (!LOCATION_PROFILES[slug]) throw new Error(`Missing location profile for ${slug}`);
		writeDoc(slug, buildLocal(slug, doc, index));
		continue;
	}
	if (!TOPIC_PROFILES[slug]) throw new Error(`Missing topic profile for ${slug}`);
	writeDoc(slug, buildTopic(slug, doc));
}

console.log(`Rewrote ${files.length} ${SERVICE} SEO pages.`);
