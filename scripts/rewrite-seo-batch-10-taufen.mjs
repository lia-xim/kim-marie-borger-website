import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'taufen';
const STATUS = 'rewritten-batch-10-review-needed';
const BATCH_NOTE = 'Batch 10: Taufseiten vollständig nach Ort, Feierform, Instrument, Gottesdienst und Familien-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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

function loc(label, area, region, places, family, logistics, character) {
	return { label, area, region, places, family, logistics, character };
}

const LOCATION_PROFILES = {
	aachen: loc('Aachen', 'in Aachen', 'Domnähe, Altstadt, Dreiländereck und Familien, die oft aus mehreren Ländern zusammenkommen', 'historische Kirchen, Kapellen, Gemeindehäuser und private Räume im Aachener Umland', 'Taufen wirken hier häufig mehrsprachig, generationenübergreifend und sehr persönlich', 'Altstadtwege, Hall in Kirchen und Anreise aus dem Umland brauchen einen ruhigen Zeitpuffer', 'warm, klassisch und international verständlich'),
	'bergisches-land': loc('Bergisches Land', 'im Bergischen Land', 'Höhenlagen, Fachwerkorte, kleine Gemeinden und Feiern zwischen Wupper und Dhünn', 'Dorfkirchen, Gärten, Höfe, Kapellen und Familienhäuser mit Blick ins Grüne', 'viele Familien wünschen einen natürlichen, nicht zu feierlichen Klang', 'Wetter, Wege, Kies, Wiese und ein geschützter Platz für die Viola sollten früh geklärt werden', 'naturnah, ruhig und behutsam'),
	'bergisch-gladbach': loc('Bergisch Gladbach', 'in Bergisch Gladbach', 'Bensberg, Refrath, Kölner Nähe und bergische Ruhe in einem sehr gemischten Umfeld', 'Kirchen, freie Segnungen, Restaurants, Villen und familiäre Feiern am Stadtrand', 'die Taufe liegt oft zwischen Kölner Gästeliste und bergischem Familienrahmen', 'Zufahrt, Parken und Wechsel zwischen Kirche, Fotos und Feierort sollten realistisch geplant werden', 'elegant, familiär und hell'),
	bielefeld: loc('Bielefeld', 'in Bielefeld', 'Altstadt, Sparrenburg-Nähe, Teutoburger Wald und Familienfeiern in Ostwestfalen', 'Kirchen, Gemeindesäle, Restaurants und private Räume mit ruhigem Tagesablauf', 'Taufen werden hier oft klar strukturiert und nicht überladen geplant', 'längere Anfahrt, Stimmen und ein präzises Startsignal sind besonders hilfreich', 'klar, sanft und gesammelt'),
	bochum: loc('Bochum', 'in Bochum', 'Ehrenfeld, Stiepel, Innenstadt und direkte Familienfeiern mitten im Ruhrgebiet', 'Kirchen, Gemeindezentren, Restaurants, Gärten und lockere Familienrunden', 'die Musik darf nahbar klingen und sollte nicht zu steif wirken', 'Parken, Ladeweg, Eingang und der Moment des ersten Einsatzes sollten konkret feststehen', 'herzlich, direkt und weich'),
	bonn: loc('Bonn', 'in Bonn', 'Südstadt, Rheinlage, Kirchenräume und Familien zwischen Stadt und Siebengebirge', 'Kirchen, Kapellen, Terrassen, Restaurants und freie Segnungen im Grünen', 'oft treffen dort kultivierte Räume und sehr private Familienmomente aufeinander', 'Rheinverkehr, Innenstadtlogistik und Ortswechsel nach dem Gottesdienst brauchen Puffer', 'hell, kultiviert und ruhig'),
	bottrop: loc('Bottrop', 'in Bottrop', 'ruhige Wohnlagen, westliches Ruhrgebiet und familiäre Tauffeiern ohne große Inszenierung', 'Kirche, Gemeindehaus, kleiner Saal, Garten oder Restaurant mit überschaubarem Kreis', 'Musik darf hier besonders unkompliziert und warm wirken', 'ein schlanker Aufbau und eine feste Kontaktperson reichen meist für einen sicheren Ablauf', 'bodenständig, persönlich und freundlich'),
	dormagen: loc('Dormagen', 'in Dormagen', 'Rheinlage, Zons, Knechtsteden und Familien zwischen Düsseldorf und Köln', 'Kirchen, Klosterumfeld, Rheinorte, Gemeindesäle und private Familienfeiern', 'Gäste kommen oft aus zwei Richtungen, deshalb hilft ein ruhiger musikalischer Beginn', 'Anfahrt, Treffpunkt und Wechsel zwischen Kirche und Feierort sollten vorab geklärt sein', 'rheinisch, ruhig und verbindend'),
	dortmund: loc('Dortmund', 'in Dortmund', 'Kreuzviertel, Hörde, Phoenixsee und große wie kleine Familienfeiern im östlichen Ruhrgebiet', 'Kirchen, freie Tauforte, moderne Räume, Restaurants und Gemeindesäle', 'Taufen können hier sehr familiär, lebendig und trotzdem feierlich sein', 'bei größeren Anlagen und Eventorten sind Treffpunkt und Aufbauplatz wichtig', 'warm, tragend und nicht zu förmlich'),
	duesseldorf: loc('Düsseldorf', 'in Düsseldorf', 'Rheinufer, Kaiserswerth, Benrath, Flingern und sehr unterschiedliche Tauforte', 'Kirchen, Kapellen, Standesamt-Nähe, Restaurants, Gärten und Familienwohnungen', 'oft ist eine elegante, aber kindgerechte Atmosphäre gewünscht', 'Innenstadtverkehr, Ladezone, Aufzug und kurze Wege sollten präzise abgestimmt werden', 'fein, ruhig und repräsentativ'),
	duisburg: loc('Duisburg', 'in Duisburg', 'Innenhafen, Rhein, linksrheinische Stadtteile und Familienfeiern im Westen des Ruhrgebiets', 'Kirchen, Gemeindehäuser, Restaurants, Rheinorte und private Räume', 'Taufmusik darf hier klar und emotional sein, ohne den Gottesdienst zu beschweren', 'größere Distanzen im Stadtgebiet, Parken und genaue Eingänge sollten feststehen', 'warm, klar und nahbar'),
	erkrath: loc('Erkrath', 'in Erkrath', 'Neandertal, Hochdahl, Unterfeldhaus und Taufen nah an Düsseldorf mit grünem Charakter', 'Kirchen, Gemeindesäle, Gärten und kleine Familienfeiern', 'die Musik kann sehr nah an Familie und Paten wirken', 'kurze Wege helfen, dennoch sollten Außenoption, Aufbauplatz und Startsignal geklärt sein', 'zart, persönlich und naturverbunden'),
	essen: loc('Essen', 'in Essen', 'Rüttenscheid, Stadtwald, Baldeneysee und zentrale Ruhrgebietslagen', 'Kirchen, Kapellen, Restaurants, Seelagen und Familienfeiern im Grünen', 'Taufen reichen hier von urban bis sehr ruhig am Wasser', 'Stadtverkehr, Locationzugang und ein realistischer Puffer vor dem ersten Stück sind wichtig', 'ruhig, wertig und familiär'),
	gelsenkirchen: loc('Gelsenkirchen', 'in Gelsenkirchen', 'Buer, Schalke, Ückendorf und direkte Familienfeiern im Ruhrgebiet', 'Kirchen, Gemeindezentren, Vereinsräume, Gärten und kleinere Restaurants', 'der Klang darf herzlich sein und sollte nicht künstlich festlich wirken', 'Ankunft, Parken und der erste Einsatz werden am besten eindeutig geplant', 'ehrlich, warm und unkompliziert'),
	haan: loc('Haan', 'in Haan', 'Gartenstadt-Charakter, kurze Wege und Familien zwischen Düsseldorf und Wuppertal', 'Kirchen, Gärten, Restaurants und private Räume mit persönlichem Kreis', 'Taufen sind hier oft überschaubar und besonders nah an der Familie', 'Aufbau klein halten und die Abstimmung mit Eltern oder Paten diskret vorbereiten', 'leicht, persönlich und hell'),
	hagen: loc('Hagen', 'in Hagen', 'Volme, Haspe, Hohenlimburg und Feiern am Rand des Sauerlands', 'Kirchen, Gemeindesäle, Familienhäuser und Räume mit Blick ins Grüne', 'Musik darf den Tag tragen, ohne den Ablauf zu verlängern', 'Anfahrt, Wetteroptionen und Außenmomente sollten zuverlässig geplant werden', 'ruhig, regional und getragen'),
	heiligenhaus: loc('Heiligenhaus', 'in Heiligenhaus', 'ruhige Wohnlagen, Höfe und Familienfeiern zwischen Ratingen und Velbert', 'Kirchen, Kapellen, Gärten, kleine Säle und private Häuser', 'der musikalische Rahmen ist oft persönlich und nicht überinszeniert', 'Zugang, Wetterschutz und ein kurzer Ablaufkontakt sollten vorab geklärt sein', 'schlicht, warm und familiär'),
	herne: loc('Herne', 'in Herne', 'Wanne, Eickel und Taufen mitten im Ruhrgebiet mit direkter Familiennähe', 'Kirche, Gemeindehaus, Restaurantzimmer, Garten oder kurzer Empfang nach dem Gottesdienst', 'die Viola kann einen feinen Moment schaffen, ohne die Feier groß zu machen', 'Timing, Eingang und Einsatzpunkt sollten klar gesetzt werden', 'nahbar, weich und freundlich'),
	hilden: loc('Hilden', 'in Hilden', 'Innenstadt, Wohnviertel und Familien zwischen Düsseldorf, Solingen und Langenfeld', 'Kirchen, Gemeindesäle, Gärten und Restaurants mit kurzer Anbindung', 'Taufen werden oft kompakt geplant und brauchen gut gesetzte musikalische Übergänge', 'Raumgröße, Startsignal und Wechsel zur Familienfeier sollten klar notiert sein', 'fein, geordnet und warm'),
	iserlohn: loc('Iserlohn', 'in Iserlohn', 'Sauerlandnähe, Letmathe und Familienfeiern mit weiterem regionalem Einzugsgebiet', 'Kirchen, Kapellen, Familienhäuser, Restaurants und Feiern im Grünen', 'Musik darf hier ruhig und natürlich wirken', 'längere Wege und Wetteroptionen sollten früh zusammengebracht werden', 'getragen, naturverbunden und still'),
	koeln: loc('Köln', 'in Köln', 'Veedel, Rheinlage, Altstadt und sehr gesellige Familienfeiern', 'Kirchen, freie Segnungen, Restaurants, Innenhöfe, Gärten und Gemeindehäuser', 'Taufen sind oft lebendig, generationsübergreifend und freundlich offen', 'bei dichter Stadtlage sind Treffpunkt, Parken und Startzeit besonders wichtig', 'rheinisch, freundlich und lebendig'),
	krefeld: loc('Krefeld', 'in Krefeld', 'Bockum, Uerdingen, Stadtwald und Taufen am Niederrhein', 'Kirchen, Kapellen, Restaurants, Gärten und Familienfeiern mit entspanntem Charakter', 'der Klang darf gepflegt sein und gleichzeitig ruhig bleiben', 'Raumgröße und Lautstärke sollten vorab geklärt werden', 'sanft, niederrheinisch und klar'),
	'kreis-mettmann': loc('Kreis Mettmann', 'im Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert, Wülfrath und viele kleinere Familienorte', 'Kirchen, Gemeindehäuser, Gärten, Höfe und Restaurants in mehreren Städten', 'Familien kommen häufig aus verschiedenen Orten zusammen', 'Stadtgrenzen, Anfahrt und genaue Adresse sollten sauber geplant werden', 'regional, verbindend und warm'),
	langenfeld: loc('Langenfeld', 'in Langenfeld', 'Familien zwischen Düsseldorf, Leverkusen und Monheim mit guter Anbindung', 'Kirchen, Restaurants, Terrassen, Gemeindesäle und private Feiern', 'Taufen sind hier oft kompakt, freundlich und gut organisiert', 'Ablauf, Parken und Setdauer sollten ohne Leerlauf geplant werden', 'leicht, klar und familiär'),
	leverkusen: loc('Leverkusen', 'in Leverkusen', 'Schlebusch, Opladen, Rheinlage und Familien zwischen Köln und Bergischem Land', 'Kirchen, Kapellen, Restaurants, Gärten und Feiern im Stadtteil', 'der Tag kann städtisch, grün oder sehr familiär wirken', 'Anfahrt zwischen Stadtteilen und Einlass sollten vorher klar sein', 'freundlich, ruhig und beweglich'),
	meerbusch: loc('Meerbusch', 'in Meerbusch', 'Büderich, Osterath, Rheinlage und elegante private Familienanlässe nahe Düsseldorf', 'Kirchen, Gärten, Restaurants, private Räume und freie Segnungen', 'oft ist ein sehr gepflegter, unaufdringlicher Klang gewünscht', 'Position im Raum, pünktlicher Beginn und ein ruhiger Aufbau sind besonders wichtig', 'fein, zurückhaltend und liebevoll'),
	mettmann: loc('Mettmann', 'in Mettmann', 'Neandertalnähe, Altstadt und Taufen mit regionaler Familienbindung', 'Kirchen, Gemeindesäle, Restaurants und kleine Familienräume', 'die Musik darf sehr persönlich und nah am Kind wirken', 'Aufbauplatz, Startsignal und Wunschlied sollten mit einer Kontaktperson geklärt werden', 'nah, warm und schlicht'),
	moenchengladbach: loc('Mönchengladbach', 'in Mönchengladbach', 'Rheydt, Wickrath, Niederrhein und Taufen mit großer Familienrunde', 'Kirchen, Gemeindehäuser, Restaurants, Gärten und Familienhäuser', 'oft treffen mehrere Generationen und viele persönliche Liedideen zusammen', 'größere Wege im Stadtgebiet und der richtige Moment für den Einsatz sollten feststehen', 'familiär, weich und verbindend'),
	moers: loc('Moers', 'in Moers', 'Niederrhein, Schlossnähe und ruhige Familienfeiern zwischen Duisburg und Kamp-Lintfort', 'Kirchen, Kapellen, Gärten, Restaurants und kleine Säle', 'Taufmusik darf hier natürlich und nicht zu feierlich wirken', 'bei Außenmomenten sind Wetterschutz und ein stabiler Platz für die Viola wichtig', 'ruhig, freundlich und niederrheinisch'),
	'monheim-am-rhein': loc('Monheim am Rhein', 'in Monheim am Rhein', 'Rheinpromenade, Baumberg und Familien zwischen Düsseldorf und Leverkusen', 'Kirchen, Rheinorte, Terrassen, Gemeindesäle und private Feiern', 'die Musik kann den Wechsel von Gottesdienst zu Familienzeit weich öffnen', 'Rheinlage, Wetter und Ortswechsel sollten früh bedacht werden', 'hell, rheinisch und gelassen'),
	'muelheim-an-der-ruhr': loc('Mülheim an der Ruhr', 'in Mülheim an der Ruhr', 'Ruhrtal, Broich, Saarn und Taufen mit grüner Stadtnähe', 'Kirchen, Kapellen, Restaurants am Wasser, Gärten und Familienräume', 'Taufen wirken hier oft ruhig, hell und nah an der Natur', 'Wege am Wasser, Parken und trockener Aufbauplatz sollten vorab geklärt sein', 'sanft, grün und getragen'),
	muenster: loc('Münster', 'in Münster', 'Altstadt, Aasee, Kirchen, Universität und helle Familienfeiern in Westfalen', 'Kirchen, Kapellen, Gemeindehäuser, Restaurants und private Feiern', 'oft ist ein klarer, kultivierter und nicht schwerer Ton gefragt', 'Innenstadtlogistik und Einlasszeit sollten mit ausreichend Puffer geplant werden', 'hell, kultiviert und leicht'),
	neuss: loc('Neuss', 'in Neuss', 'Rheinlage, Quirinus-Nähe und Familien zwischen Düsseldorf und Grevenbroich', 'Kirchen, Gemeindehäuser, Restaurants, Gärten und private Feiern', 'Taufmusik soll hier häufig elegant und trotzdem sehr familiär bleiben', 'Treffpunkt, Ladeweg und Übergang zur Familienfeier sollten feststehen', 'klar, warm und rheinisch'),
	'nordrhein-westfalen': loc('Nordrhein-Westfalen', 'in Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land, Westfalen und sehr unterschiedliche Tauftraditionen', 'Kirchen, freie Segnungen, Kapellen, Gärten und Familienfeiern in NRW', 'jede Familie bringt andere kirchliche, freie oder persönliche Vorstellungen mit', 'Region, Fahrzeit, Setlänge und Abstimmung mit Kirche oder Rednerin werden individuell geprüft', 'vielseitig, behutsam und professionell'),
	oberhausen: loc('Oberhausen', 'in Oberhausen', 'Sterkrade, Alt-Oberhausen und Taufen im westlichen Ruhrgebiet', 'Kirchen, Gemeindesäle, Restaurants, Gärten und Familienfeiern mit entspanntem Beginn', 'Musik darf warm wirken und den Ablauf nicht größer machen als nötig', 'Startzeit, Parken und Aufbau sollten nicht zu knapp geplant werden', 'freundlich, weich und unkompliziert'),
	paderborn: loc('Paderborn', 'in Paderborn', 'Innenstadt, Schloss Neuhaus, Ostwestfalen und Familien mit klarer kirchlicher Struktur', 'Kirchen, Kapellen, Gemeindehäuser, Restaurants und freie Familienfeiern', 'Taufen sind oft liturgisch gut eingebunden und brauchen maßvolle Musik', 'Anreise und Setlänge sollten früh abgestimmt werden', 'geordnet, hell und ruhig'),
	ratingen: loc('Ratingen', 'in Ratingen', 'Lintorf, Hösel, Tiefenbroich und Taufen nah an Düsseldorf', 'Kirchen, Kapellen, Gärten, Restaurants und Familienfeiern mit eleganter Nähe', 'oft wird ein ruhiger, gepflegter Klang gewünscht', 'kurze Distanzen helfen, aber Einlass und Startsignal sollten klar sein', 'fein, warm und diskret'),
	recklinghausen: loc('Recklinghausen', 'in Recklinghausen', 'Altstadt, Süd, Hochlar und Familienfeiern am Rand des Ruhrgebiets', 'Kirchen, Gemeindesäle, Restaurants, Gärten und Räume mit persönlicher Note', 'Musik soll den Tag würdigen, ohne ihn zu schwer zu machen', 'Anfahrt, Parken und ein ruhiger Aufbaupunkt sollten vorab geklärt sein', 'freundlich, getragen und regional'),
	remscheid: loc('Remscheid', 'in Remscheid', 'bergische Höhen, Lennep und Taufen mit handwerklich-regionalem Charakter', 'Kirchen, kleine Säle, Gärten, Familienhäuser und Feiern mit bergischem Blick', 'der Klang darf warm und nicht zu glatt sein', 'Wetter, Wege und Zugang sollten besonders bei Außenmomenten realistisch geplant werden', 'bergisch, persönlich und weich'),
	'rhein-kreis-neuss': loc('Rhein-Kreis Neuss', 'im Rhein-Kreis Neuss', 'Neuss, Meerbusch, Dormagen, Grevenbroich und Rheinorte zwischen Düsseldorf, Köln und Niederrhein', 'Kirchen, Rheinorte, Gemeindesäle, Gärten und Restaurants in mehreren Städten', 'Familien kommen häufig aus unterschiedlichen Orten zusammen', 'Stadtgrenzen, Fahrzeit und genaue Location sollten flexibel, aber verbindlich geplant werden', 'regional, rheinisch und verbindend'),
	rheinland: loc('Rheinland', 'im Rheinland', 'Rheinstädte, Veedel, kleinere Orte und offene Familienfeiern', 'Kirchen, freie Segnungen, Rheinorte, Gärten und Gemeindehäuser', 'Taufen wirken oft gesellig, warm und generationenübergreifend', 'Region, Fahrzeit, gewünschte Setlänge und kirchliche Vorgaben werden einzeln abgestimmt', 'offen, warm und freundlich'),
	'rhein-ruhr': loc('Rhein-Ruhr', 'in der Rhein-Ruhr-Region', 'dichte Wege zwischen Düsseldorf, Köln, Essen, Dortmund und Duisburg', 'Kirchen, Kapellen, Gemeindesäle, Restaurants und private Feiern in mehreren Städten', 'Gäste reisen oft aus verschiedenen Städten an', 'Verkehr, Stadtgrenzen und Zeitpuffer müssen realistisch geplant werden', 'verbindend, flexibel und ruhig'),
	ruhrgebiet: loc('Ruhrgebiet', 'im Ruhrgebiet', 'viele Städte nah beieinander, direkte Familienkultur und lebendige Gemeindestrukturen', 'Kirchen, Gemeindezentren, Vereinsräume, Gärten und Restaurants', 'Taufmusik darf herzlich sein und sollte nicht künstlich feierlich werden', 'Startsignal, Lautstärke und Position im Raum sollten früh geklärt sein', 'herzlich, warm und bodenständig'),
	siegen: loc('Siegen', 'in Siegen', 'Oberstadt, Siegerland und Familienfeiern mit weiterem regionalem Einzugsgebiet', 'Kirchen, Kapellen, Familienhäuser, Restaurants und Räume im Grünen', 'Musik darf den Tag ruhig sammeln und natürlich wirken', 'längere Anfahrt, Zeitfenster und Setdauer sollten zusammen geplant werden', 'still, regional und getragen'),
	solingen: loc('Solingen', 'in Solingen', 'Ohligs, Gräfrath, Wald und bergische Familienfeiern', 'Kirchen, Gärten, Restaurants, Familienhäuser und kleine Gemeindesäle', 'der Klang darf handgemacht, weich und nah wirken', 'bei Häusern, Höhenlagen und Außenflächen sollten Zugang und Wetteroptionen früh besprochen werden', 'bergisch, nah und warm'),
	unna: loc('Unna', 'in Unna', 'Altstadt, Königsborn und Taufen zwischen Ruhrgebiet und Hellweg', 'Kirchen, Gemeindesäle, Familienräume und Restaurants mit ruhigem Tagesablauf', 'Musik hilft oft beim Übergang vom Gottesdienst zur Familienzeit', 'Anfahrt, Aufbau und erster Einsatz sollten ohne Hektik aufeinander abgestimmt werden', 'klar, freundlich und leicht'),
	velbert: loc('Velbert', 'in Velbert', 'Neviges, Langenberg und Taufen zwischen Ruhrgebiet und Bergischem Land', 'Kirchen, Fachwerkambiente, Gärten, Restaurants und Familienhäuser', 'die Musik kann feierlich sein und trotzdem bodenständig bleiben', 'bei Steigungen, Wegen und Außenflächen genug Zeit für Aufbau einplanen', 'warm, bergisch und getragen'),
	wuelfrath: loc('Wülfrath', 'in Wülfrath', 'kleine Stadtwege, bergische Nähe und persönliche Familienfeiern', 'Kirchen, kleine Gemeindesäle, Gärten und Restaurants mit überschaubarem Kreis', 'Taufmusik wirkt hier oft besonders schön, wenn sie schlicht bleibt', 'ruhiger Aufbau und ein klarer Einsatzmoment passen gut zu kompakten Feiern', 'schlicht, liebevoll und hell'),
	wuppertal: loc('Wuppertal', 'in Wuppertal', 'Elberfeld, Barmen, Höhenlagen und Taufen entlang der Wupper', 'Kirchen am Hang, Gemeindesäle, Altbauräume, Gärten und Familienrestaurants', 'die Musik muss mit besonderen Räumen und Wegen umgehen können', 'Treppen, Wege, Parken und Wetter sollten konkret eingeplant werden', 'atmosphärisch, weich und beweglich'),
};

function topic(keyword, title, audience, setting, intent, role, distinction, planning, proof) {
	return { keyword, title, audience, setting, intent, role, distinction, planning, proof };
}

const TOPIC_PROFILES = {
	'bratsche-taufe': topic('Bratsche Taufe', 'Bratsche zur Taufe mit warmem Klang.', 'Familien, die bewusst einen tieferen Streicherklang suchen', 'Taufe, Segnung, Gottesdienst oder Familienfeier', 'Der Begriff Bratsche fragt konkret nach dem Instrument und seiner Wirkung im Taufrahmen.', 'Ich spiele Bratsche beziehungsweise Viola als warmes Solo-Instrument, das weich trägt und nicht grell in den Vordergrund tritt.', 'Diese Seite beantwortet die Instrumentenfrage und konkurriert nicht mit allgemeinen Taufmusik-Seiten.', 'Wichtig sind Raum, gewünschte Stücke, kirchliche Vorgaben und der Moment rund um Taufhandlung oder Segen.', 'Die Bratsche eignet sich besonders für Taufen, weil ihr Klang ruhig, menschlich und nicht zu hell wirkt.'),
	'emotionale-musik-taufe': topic('Emotionale Musik Taufe', 'Emotionale Musik zur Taufe, ohne den Moment zu überladen.', 'Eltern und Paten, die einen berührenden, aber kindgerechten Rahmen suchen', 'Taufe, Segnung, Familienritual oder Willkommensfest', 'Emotional meint hier nicht dramatisch, sondern persönlich, warm und nah an der Familie.', 'Ich wähle Musik, die Erinnerung, Hoffnung und Segen spürbar macht, aber dem Kind und der Feier Luft lässt.', 'Diese Seite ist enger als Musik Taufe, weil sie die Gefühlslage und die Dosierung der Emotion behandelt.', 'Wir klären, ob ein Familienlied, ein Wiegenlied oder ein ruhiger Klassiker den stärksten Bezug hat.', 'Solo-Viola kann berühren, ohne den Gottesdienst in einen Auftritt zu verwandeln.'),
	'geige-taufe': topic('Geige Taufe', 'Geige oder Viola zur Taufe richtig einordnen.', 'Familien, die nach Geige suchen und einen sanften Streicherklang für die Taufe meinen', 'Kirche, Kapelle, freie Segnung, Garten oder Familienfeier', 'Viele suchen Geige, wünschen aber vor allem ein melodisches Solo-Streichinstrument.', 'Ich erkläre transparent, dass ich Viola spiele: tiefer, wärmer und bei Taufen oft besonders angenehm.', 'Diese Seite unterscheidet sich von Viola Taufe, weil sie die Erwartung hinter dem Suchwort Geige aufnimmt.', 'Wichtig ist, ob ein heller, festlicher Klang oder ein weicher, ruhiger Klang besser zum Raum passt.', 'Die Viola kann den Geigenwunsch oft sehr passend erfüllen, wenn Wärme wichtiger ist als Glanz.'),
	'instrumentalmusik-taufe': topic('Instrumentalmusik Taufe', 'Instrumentalmusik zur Taufe mit Solo-Viola.', 'Familien, die Musik ohne Gesang, Text oder Gemeindelied suchen', 'Gottesdienst, freie Segnung, Einzug, Taufhandlung oder Auszug', 'Instrumentalmusik wird gesucht, wenn Musik stimmungsvoll sein soll, ohne Worte zu ersetzen.', 'Ich spiele Melodien, die ohne Text verständlich bleiben und in der Kirche nicht zu dominant werden.', 'Diese Seite grenzt sich von Liedlisten ab, weil der Fokus auf textfreier musikalischer Begleitung liegt.', 'Wir klären, ob die Musik liturgisch, frei, klassisch, modern oder sehr persönlich wirken soll.', 'Instrumentale Viola ist besonders flexibel, wenn Gesang nicht möglich ist oder bewusst vermieden werden soll.'),
	'kirchliche-feier': topic('Musik kirchliche Feier', 'Musik für kirchliche Feiern mit sanfter Viola.', 'Familien, die Taufe, Kommunion, Konfirmation oder Segnung musikalisch rahmen möchten', 'Kirche, Kapelle, Gemeindegottesdienst oder festliche Familienliturgie', 'Kirchliche Feier ist breiter als Taufe und fragt nach einem passenden musikalischen Rahmen im Gottesdienst.', 'Ich stimme Stücke und Einsätze mit Familie, Pfarrperson oder Kirchenmusik ab.', 'Diese Seite sammelt kirchliche Familienmomente und verweist gedanklich auf speziellere Seiten wie Taufe oder Kommunion.', 'Wichtig sind liturgische Stellen, Vorgaben der Gemeinde und die Frage, ob Musik solistisch oder ergänzend eingesetzt wird.', 'Solo-Viola kann kirchliche Feiern feierlich machen, ohne den Gottesdienst musikalisch zu überfrachten.'),
	'klassische-musik-taufe': topic('Klassische Musik Taufe', 'Klassische Musik zur Taufe mit ruhiger Viola.', 'Familien, die einen zeitlosen und kirchentauglichen Klang suchen', 'Taufgottesdienst, Kapelle, Segnung oder feierlicher Auszug', 'Klassische Musik zur Taufe meint meist Stücke, die würdevoll wirken und trotzdem sanft bleiben.', 'Ich wähle klassische Melodien, die auf Solo-Viola tragen und zur Länge des Gottesdienstes passen.', 'Diese Seite unterscheidet sich von moderner Musik, weil sie Repertoire, Würde und kirchliche Anschlussfähigkeit behandelt.', 'Wir klären, ob Ave Maria, Air, Wiegenlied, Bach, Händel oder eine andere ruhige Linie passend ist.', 'Klassische Viola klingt vertraut, ohne dass ein großes Ensemble gebraucht wird.'),
	'live-musik-taufe': topic('Live Musik Taufe', 'Live-Musik zur Taufe mit persönlichem Klang.', 'Eltern, Paten und Familien, die nicht nur eine Aufnahme abspielen möchten', 'Taufe, freie Segnung, Willkommensfest oder anschließender Empfang', 'Live-Musik wird gesucht, wenn der Tauftag spürbar persönlicher und nicht beliebig klingen soll.', 'Ich reagiere live auf Raum, Tempo, Stille und Übergänge im Gottesdienst.', 'Diese Seite ist die Buchungsseite für den Live-Aspekt und nicht nur eine allgemeine Repertoire-Übersicht.', 'Wichtig sind Termin, Ort, gewünschte Momente, Wunschlieder und die Abstimmung mit Kirche oder Rednerin.', 'Live-Viola kann auch kleine Feiern sofort besonders machen, ohne Technik oder Bühne aufzubauen.'),
	'moderne-musik-taufe': topic('Moderne Musik Taufe', 'Moderne Musik zur Taufe fein reduziert.', 'Familien, die Pop, Filmmusik oder ein aktuelles Lieblingslied in den Tauftag einbinden möchten', 'Kirche, freie Segnung, Familienfeier oder Willkommensfest', 'Moderne Taufmusik fragt nach Nähe zur Familie und nach Liedern, die nicht klassisch sein müssen.', 'Ich reduziere moderne Melodien so, dass sie auf Viola ruhig, würdevoll und wiedererkennbar bleiben.', 'Diese Seite grenzt sich von klassischer Musik ab und prüft, welche modernen Lieder ohne Text funktionieren.', 'Wichtig sind Melodie, Tonart, kirchliche Zustimmung und die Länge des gewünschten Ausschnitts.', 'Viola kann moderne Stücke sehr weich machen, wenn sie nicht wie ein Pop-Cover wirken sollen.'),
	'musik-familienfeier-taufe': topic('Musik Familienfeier Taufe', 'Musik für die Familienfeier nach der Taufe.', 'Familien, die nach dem Gottesdienst weiter gemeinsam feiern möchten', 'Empfang, Kaffee, Garten, Restaurant, Zuhause oder kleiner Saal', 'Der Suchintent liegt nach der eigentlichen Taufe: Musik soll die Familienzeit danach öffnen.', 'Ich spiele ruhige Sets für Gratulationen, Kaffee, Ankommen oder einen kleinen Wunschliedmoment.', 'Diese Seite unterscheidet sich von Gottesdienst-Seiten, weil Essen, Gespräche und Kinder im Raum wichtiger werden.', 'Wir klären Ort, Dauer, Lautstärke, Wetter und ob Musik im Hintergrund oder als kurzer Mittelpunkt gedacht ist.', 'Solo-Viola ist für Familienfeiern praktisch, weil sie wenig Platz braucht und Gespräche zulässt.'),
	'musik-gottesdienst-taufe': topic('Musik Gottesdienst Taufe', 'Musik im Taufgottesdienst sicher planen.', 'Familien, die die Taufe in einen Gottesdienst oder eine Liturgie einbinden', 'Gemeindegottesdienst, eigener Taufgottesdienst, Kapelle oder kirchliche Feier', 'Gesucht wird nicht nur schöne Musik, sondern die richtige Einbindung in den Gottesdienst.', 'Ich plane Einzug, Taufhandlung, Segen, Kommunionteil oder Auszug so, dass liturgische Worte nicht überdeckt werden.', 'Diese Seite ist enger als Musik Kirche Taufe, weil sie den Ablauf des Gottesdienstes selbst behandelt.', 'Wichtig sind Pfarrperson, Kirchenmusik, Gemeindelieder, genaue Einsatzpunkte und mögliche Vorgaben.', 'Viola kann im Gottesdienst tragen, ohne die Gemeinde musikalisch zu verdrängen.'),
	'musik-kirche-taufe': topic('Musik Kirche Taufe', 'Musik in der Kirche zur Taufe mit Viola.', 'Familien, die eine Taufe in Kirche oder Kapelle musikalisch rahmen möchten', 'Kirchenraum, Kapelle, Altarbereich, Taufbecken oder Gemeindesaal', 'Der Fokus liegt auf Raum und Akustik: Kirche braucht andere Musik als Garten oder Restaurant.', 'Ich passe Tempo, Dynamik und Länge an Hall, Taufbecken, Laufwege und liturgische Stellen an.', 'Diese Seite unterscheidet sich von Gottesdienst Taufe, weil sie stärker die Kirchenakustik und den Raum behandelt.', 'Wir klären Aufbauplatz, Absprache mit der Gemeinde, gewünschte Stücke und ob es Gemeindelieder gibt.', 'Die Viola klingt in Kirchen warm und bleibt auch bei Hall verständlich, wenn Stücke passend gewählt werden.'),
	'musik-kommunion': topic('Musik Kommunion', 'Musik zur Kommunion und zur Familienfeier.', 'Familien, die Erstkommunion oder Kommunionfeier musikalisch begleiten möchten', 'Kirche, Empfang, Restaurant, Zuhause oder Familienfeier nach der Messe', 'Kommunion ist nicht Taufe, gehört aber in denselben kirchlichen Familiencluster.', 'Ich begleite ruhige Momente im Gottesdienst oder dezente Musik bei der anschließenden Familienfeier.', 'Diese Seite muss klar von Taufseiten getrennt bleiben, weil Kind, Anlass und liturgische Bedeutung anders sind.', 'Wichtig sind Gottesdienstform, Gemeindevorgaben, Feierort und ob Musik religiös oder familiär wirken soll.', 'Solo-Viola kann den Tag würdigen, ohne den Ablauf einer Kommunionfeier zu überladen.'),
	'musik-konfirmation': topic('Musik Konfirmation', 'Musik zur Konfirmation mit persönlichem Ton.', 'Familien, die Konfirmation, Gottesdienst oder anschließende Feier musikalisch gestalten möchten', 'Kirche, Segnung, Empfang, Restaurant oder Familienfeier', 'Konfirmation richtet sich an ältere Kinder und Jugendliche, deshalb braucht Musik einen anderen Ton als Taufe.', 'Ich wähle Stücke, die feierlich, aber nicht kindlich wirken, und bei Wunschliedern auch moderner sein dürfen.', 'Diese Seite grenzt sich von Taufe und Kommunion ab, weil Reife, persönlicher Glaube und Familienfeier anders gewichtet sind.', 'Wir klären Gottesdienst, Wunschmusik des Jugendlichen, Feierort und den passenden musikalischen Moment.', 'Viola kann Konfirmationsmusik warm und persönlich machen, ohne zu pathetisch zu werden.'),
	'musik-segnung': topic('Musik Segnung', 'Musik zur Segnung mit ruhigem Live-Klang.', 'Familien, die eine freie oder kirchliche Segnung musikalisch begleiten lassen möchten', 'freie Segnung, Willkommensfest, kirchlicher Segen oder Familienritual', 'Segnung ist breiter und freier als Taufe; Musik muss deshalb sehr genau auf das Ritual reagieren.', 'Ich begleite Worte, Kerzen, Patenbeiträge oder einen stillen Segensmoment mit weicher Viola.', 'Diese Seite unterscheidet sich von Musik Taufe, weil sie auch nicht-taufende und freie Feiern abdeckt.', 'Wichtig sind Art der Segnung, Textanteile, Rituale, gewünschte Nähe und der Übergang zur Familienfeier.', 'Solo-Viola kann einen Segensmoment halten, ohne ihn religiös festzulegen.'),
	'musik-taufe': topic('Musik Taufe', 'Musik zur Taufe, die den Tag ruhig zusammenhält.', 'Familien, die noch am Anfang der musikalischen Planung stehen', 'Taufe, Segnung, Gottesdienst, Einzug, Taufhandlung, Auszug oder Empfang', 'Musik Taufe ist der zentrale Überblicksbegriff und muss Ablauf, Repertoire und Buchung verständlich bündeln.', 'Ich plane wenige, klare Einsätze, die der Taufe Halt geben und nicht neben ihr stehen.', 'Diese Seite ist die Haupt-Topicseite im Taufcluster; Spezialseiten behandeln Instrumente, Kirche, Familienfeier oder Stilrichtungen.', 'Wir klären zuerst den Rahmen, dann Einsatzpunkte, Wunschlieder und mögliche Abstimmungen mit Kirche oder Rednerin.', 'Viola ist für Taufen besonders geeignet, weil sie warm klingt und auch kleine Räume nicht überfordert.'),
	'musikerin-taufe': topic('Musikerin Taufe', 'Musikerin für Taufe, Segnung und Familienfeier.', 'Eltern und Paten, die eine konkrete Musikerin für den Tauftag buchen möchten', 'Kirche, freie Segnung, Willkommensfest, Empfang oder Familienfeier', 'Der Suchintent ist personenbezogen und buchungsnah: Gesucht wird jemand, der die Taufe musikalisch begleitet.', 'Ich begleite mit Solo-Viola, klarer Absprache und einem ruhigen Ablauf, der Eltern entlastet.', 'Diese Seite unterscheidet sich von Live Musik Taufe durch die konkrete Frage nach einer Musikerin.', 'Wichtig sind Termin, Ort, gewünschte Stücke, Ansprechperson und ob ich Kirche oder Rednerin einbinden soll.', 'Eine Solo-Musikerin ist ideal, wenn der Rahmen persönlich bleiben und trotzdem professionell vorbereitet sein soll.'),
	'sanfte-musik-taufe': topic('Sanfte Musik Taufe', 'Sanfte Musik zur Taufe mit weicher Viola.', 'Familien, die einen leisen, kindgerechten und nicht zu großen Klang suchen', 'Taufbecken, Segen, Einzug, freie Segnung oder ruhige Familienfeier', 'Sanft ist ein eigener Intent: Die Musik soll beruhigen, wärmen und nicht glänzen.', 'Ich wähle langsame, klare Melodien und spiele mit zurückgenommener Dynamik.', 'Diese Seite grenzt sich von emotionaler Musik ab, weil weniger Berührung und mehr Zartheit im Mittelpunkt steht.', 'Wir klären, ob das Kind sehr klein ist, ob der Raum hallt und welche Momente besonders ruhig bleiben sollen.', 'Viola ist durch ihre warme Mittellage besonders geeignet für sanfte Taufmusik.'),
	'streichmusik-taufe': topic('Streichmusik Taufe', 'Streichmusik zur Taufe als Solo-Viola.', 'Familien, die den Klang von Streichinstrumenten für die Taufe suchen', 'Kirche, Kapelle, freie Segnung, Einzug, Segen oder Auszug', 'Streichmusik meint Eleganz und Wärme, aber nicht zwingend ein ganzes Ensemble.', 'Ich spiele Solo-Viola als schlanke, persönliche Form von Streichmusik.', 'Diese Seite behandelt den allgemeinen Streicherklang und grenzt sich von Geige, Bratsche und Viola als Einzelseiten ab.', 'Wichtig ist, ob ein klassischer, moderner oder sehr schlichter Streicherklang gewünscht ist.', 'Solo-Streichmusik braucht wenig Platz und passt auch in kleine Taufrahmen.'),
	'viola-taufe': topic('Viola Taufe', 'Viola zur Taufe mit warmem, ruhigem Klang.', 'Familien, die bewusst die Viola für Taufe oder Segnung suchen', 'Kirche, Kapelle, Gemeindesaal, Garten oder private Familienfeier', 'Viola Taufe ist ein klarer Instrumentenintent und soll zeigen, warum dieses Instrument passt.', 'Ich nutze die warme Mittellage der Viola für Einzug, Segnung, Wunschlied oder Auszug.', 'Diese Seite unterscheidet sich von Geige Taufe und Bratsche Taufe durch die klare Bezeichnung des Instruments.', 'Wir klären Raum, Ablauf, Wunschstücke und ob die Musik solistisch oder ergänzend wirken soll.', 'Die Viola klingt weich und trägt emotional, ohne sehr hell oder dominant zu werden.'),
};

const LOCAL_MOMENTS = [
	'Ein ruhiges Stück vor Beginn hilft, wenn Familie, Paten und Gäste erst im Raum ankommen müssen.',
	'Nach der Taufhandlung kann ein kurzer musikalischer Moment stärker wirken als ein langes Zusatzprogramm.',
	'Beim Auszug darf die Musik freundlicher werden und den Wechsel in Gratulationen und Familienfeier öffnen.',
	'Ein persönliches Familienlied kann anstelle einer langen Stückliste den ganzen Tag zusammenhalten.',
	'Bei sehr kleinen Kindern ist weniger Musik oft besser, wenn sie dafür an den richtigen Stellen steht.',
	'Wenn mehrere Kinder getauft werden, plane ich die Musik so, dass der Gottesdienst nicht unnötig länger wird.',
];

const PLANNING_FRAMES = [
	'Ich bespreche mit euch zuerst die Feierform: klassischer Gottesdienst, freie Segnung, Willkommensfest oder eine Kombination mit Familienfeier.',
	'Danach geht es um die konkreten Einsatzpunkte, damit Musik nicht zufällig beginnt, sondern dem Ablauf wirklich Halt gibt.',
	'Wenn eine Pfarrperson, Rednerin oder Kirchenmusikerin beteiligt ist, können die musikalischen Stellen vorab ruhig abgestimmt werden.',
	'Die Auswahl der Stücke entsteht aus Raum, Familiengefühl und gewünschter Stimmung, nicht aus einer pauschalen Taufmusik-Liste.',
	'Für Wunschlieder prüfe ich, ob die Melodie solo auf der Viola trägt und ob ein kurzer Ausschnitt stärker ist als die ganze Version.',
	'Organisatorisch reichen zuerst Datum, Ort, Uhrzeit, Art der Feier und zwei bis drei musikalische Wünsche.',
];

const FAQ_ANGLES = [
	['Kannst du auch ein Familienlied spielen?', 'Ja, wenn die Melodie für Solo-Viola geeignet ist. Ich prüfe Tonart, Länge und Wirkung und schlage bei Bedarf eine ruhige Fassung vor.'],
	['Wie viele Stücke sind sinnvoll?', 'Meist reichen zwei bis vier musikalische Momente. Dadurch bleibt die Taufe leicht und jeder Einsatz hat eine klare Aufgabe.'],
	['Ist Musik auch bei einer freien Segnung möglich?', 'Ja. Freie Segnungen lassen sich oft besonders flexibel mit Musik verbinden, weil Rituale und Worte individuell geplant werden.'],
	['Muss die Musik kirchlich sein?', 'Nicht zwingend. Klassische, geistliche, moderne oder sehr persönliche Stücke sind möglich, wenn sie zum Rahmen passen und vor Ort erlaubt sind.'],
	['Kannst du nach der Taufe weiter spielen?', 'Ja. Auf Wunsch begleite ich auch Gratulation, Empfang, Kaffee oder die Familienfeier im Anschluss mit ruhiger Musik.'],
	['Wie kurzfristig können wir anfragen?', 'Manchmal auch kurzfristig. Für Wunschlieder und Abstimmung mit Kirche oder Rednerin ist etwas Vorlauf aber deutlich entspannter.'],
];

function hash(input) {
	let value = 0;
	for (const char of input) value = (value * 31 + char.charCodeAt(0)) >>> 0;
	return value;
}

function pick(key, values, offset = 0) {
	return values[(hash(`${key}:${offset}`) + offset) % values.length];
}

function titleFromKeyword(keyword) {
	return keyword
		.split(' ')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function altText(doc, base) {
	const images = doc.imageAlts?.length ? doc.imageAlts : [];
	return images.map((image, index) => ({
		src: image.src,
		alt: index === 0
			? `${base} mit sanfter Live-Viola`
			: index === 1
				? `${base} im ruhigen Tauf- und Familienrahmen`
				: `Kim Marie Borger spielt ${base}`,
	}));
}

function localFaq(slug, profile, keyword) {
	const extraOne = pick(slug, FAQ_ANGLES, 1);
	const extraTwo = pick(slug, FAQ_ANGLES, 3);
	return [
		{
			question: `Spielst du Taufmusik ${profile.area}?`,
			answer: `Ja. Ich begleite Taufen, Segnungen, Willkommensfeste und Familienfeiern ${profile.area} mit Solo-Viola.`,
			open: true,
		},
		{
			question: `Welche Orte passen für Taufmusik ${profile.area}?`,
			answer: `${profile.places} Wichtig ist, dass die Musik dort ruhig platziert werden kann und der Ablauf vorher klar ist.`,
		},
		{
			question: `Was ist bei einer Taufe ${profile.area} besonders zu beachten?`,
			answer: `${profile.logistics} So entsteht ein sicherer Rahmen, auch wenn Familie und Gäste aus verschiedenen Richtungen anreisen.`,
		},
		{
			question: 'Stimmst du dich mit Kirche oder Rednerin ab?',
			answer: 'Ja. Wenn gewünscht, kläre ich Einsatzpunkte, Aufbau und musikalische Übergänge direkt mit Pfarrperson, Kirchenmusik oder freier Rednerin.',
		},
		{
			question: extraOne[0],
			answer: extraOne[1],
		},
		{
			question: extraTwo[0],
			answer: extraTwo[1],
		},
		{
			question: `Warum passt Viola für ${keyword}?`,
			answer: `Die Viola klingt warm, weich und weniger hell als eine Geige. Dadurch passt sie gut zu Taufe, Segnung und Familienmomenten, ohne den Raum zu überfordern.`,
		},
		{
			question: `Welche Informationen helfen für eine Anfrage ${profile.area}?`,
			answer: `Hilfreich sind Datum, Uhrzeit, genauer Ort, Art der Feier, gewünschte musikalische Momente und vorhandene Wunschlieder.`,
		},
	];
}

function topicFaq(slug, profile) {
	const extraOne = pick(slug, FAQ_ANGLES, 2);
	const extraTwo = pick(slug, FAQ_ANGLES, 5);
	return [
		{
			question: `Für wen passt ${profile.keyword}?`,
			answer: `${profile.keyword} passt für ${profile.audience}. Entscheidend ist, dass die Musik zum Raum, zur Familie und zum Ablauf passt.`,
			open: true,
		},
		{
			question: `Was unterscheidet diese Seite von allgemeiner Taufmusik?`,
			answer: profile.distinction,
		},
		{
			question: 'Kann ein Wunschlied gespielt werden?',
			answer: 'Ja, wenn die Melodie für Solo-Viola geeignet ist und zum Rahmen passt. Ich prüfe Tonart, Länge und Wirkung vorab.',
		},
		{
			question: 'Wie wird die Musik im Ablauf platziert?',
			answer: `${profile.planning} Meist sind wenige klare Einsätze stärker als durchgehende Musik.`,
		},
		{
			question: extraOne[0],
			answer: extraOne[1],
		},
		{
			question: extraTwo[0],
			answer: extraTwo[1],
		},
		{
			question: 'Ist die Viola für Kirche und kleine Räume geeignet?',
			answer: 'Ja. Sie klingt warm und trägt gut, bleibt aber auch in kleinen Räumen oder halligen Kirchen kontrollierbar.',
		},
		{
			question: `Welche Angaben brauchst du für ${profile.keyword}?`,
			answer: 'Datum, Ort, Uhrzeit, Art der Feier, gewünschte Momente, vorhandene Liedideen und eine Kontaktperson für Rückfragen reichen für den Anfang.',
		},
	];
}

function buildLocal(slug, doc) {
	const profile = LOCATION_PROFILES[slug];
	if (!profile) throw new Error(`Missing location profile for ${slug}`);
	const keyword = `Taufmusik ${profile.label}`;
	const momentOne = pick(slug, LOCAL_MOMENTS, 1);
	const momentTwo = pick(slug, LOCAL_MOMENTS, 2);
	const planningOne = pick(slug, PLANNING_FRAMES, 3);
	const planningTwo = pick(slug, PLANNING_FRAMES, 4);
	const planningThree = pick(slug, PLANNING_FRAMES, 5);

	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Live-Viola zur Taufe`,
		seoDescription: `${keyword}: Live-Viola für Taufe, Segnung, Gottesdienst, Willkommensfest und Familienfeier. Ruhig und persönlich geplant.`,
		hero: {
			eyebrow: 'Taufmusik',
			title: `Taufmusik ${profile.area} für einen warmen Anfang.`,
			lead: `${profile.region}. Ich begleite Taufe, Segnung, Gottesdienst und Familienfeier mit sanfter Solo-Viola.`,
			badge: 'Sanfte Viola für Taufe & Segnung',
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Musik zur Taufe ${profile.area} braucht Ruhe und klare Momente.`,
			lede: `${profile.family}. Genau darauf stimme ich Stücke, Einsatzpunkte und den Klang der Viola ab.`,
			paragraphs: [
				`${profile.region}. Dadurch verändert sich auch die musikalische Planung: Manche Feiern brauchen einen sehr stillen Anfang, andere einen hellen Auszug oder ein persönliches Familienlied.`,
				`${profile.places}. Die Viola lässt sich dort schlank einbinden, weil sie wenig Aufbau braucht und auch ohne große Technik warm trägt.`,
				`${profile.family}. Deshalb plane ich Taufmusik nicht als kleines Konzert, sondern als Teil des Tages: sie soll die Familie sammeln, die Segnung tragen und danach wieder Raum für Worte lassen.`,
				`${profile.logistics}. Wenn diese Punkte vorab klar sind, kann der erste Ton ruhig entstehen und niemand muss am Tag selbst suchen oder improvisieren.`,
				`Für ${keyword} ist der Klang bewusst ${profile.character}. Die Musik darf feierlich sein, aber sie soll ein Kind, Eltern und Paten nicht überfordern.`,
				momentOne,
				momentTwo,
				planningOne,
				planningTwo,
				planningThree,
				`Ich achte besonders darauf, wie nah Musik an Worten, Gebet, Taufhandlung oder Segen steht. Je näher sie an einem liturgischen Moment liegt, desto schlichter muss sie beginnen und enden.`,
				`Wenn ein Wunschlied geplant ist, ordne ich es nicht nur musikalisch ein. Entscheidend ist, ob es als Einzug, Moment nach der Taufe, Segen, Auszug oder später bei der Familienfeier am besten wirkt.`,
				`Bei freien Segnungen ${profile.area} kann die Musik flexibler atmen. Dann lassen sich Rituale, Kerzen, Patenbeiträge oder ein kurzer Willkommensmoment sehr persönlich verbinden.`,
				`Bei kirchlichen Taufen ${profile.area} ist die Abstimmung mit Pfarrperson oder Kirchenmusik wichtig. Ich kann die musikalischen Stellen so formulieren, dass sie für die Gemeinde klar und unkompliziert bleiben.`,
				`Auch die Familienfeier danach kann musikalisch begleitet werden. Dann verändert sich die Aufgabe: weg vom liturgischen Rahmen, hin zu Gratulationen, Kaffee, Gesprächen und einem weichen Übergang in den gemeinsamen Nachmittag.`,
				`Diese Seite fokussiert bewusst ${keyword}. Andere Seiten im Cluster behandeln Geige, Viola, Gottesdienst, Familienfeier, Kommunion oder moderne Taufmusik; hier geht es um den konkreten Ort und seine Planung.`,
				`Für die erste Anfrage reichen Datum, Ort, Uhrzeit, Art der Feier, gewünschte Einsatzpunkte und erste Liedideen. Danach kann ich einschätzen, ob zwei, drei oder vier musikalische Momente sinnvoll sind.`,
				`So bleibt Taufmusik ${profile.area} persönlich und zugleich leicht: vorbereitet genug für Kirche oder freie Rede, aber nicht so groß, dass der eigentliche Anlass in den Hintergrund rückt.`,
			],
			seal: `${profile.label}\nTaufe\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Ablauf',
			title: `Mögliche Einsatzpunkte für Taufmusik ${profile.area}.`,
			lead: 'Die meisten Taufen brauchen keine durchgehende Musik. Stärker sind wenige Stellen, die dem Tag Halt geben.',
			items: [
				{
					time: 'I.',
					kicker: 'Ankommen',
					title: 'Ruhig in den Raum finden',
					text: `Vor Beginn kann die Viola Gäste und Familie sammeln. ${profile.logistics}`,
				},
				{
					time: 'II.',
					kicker: 'Taufmoment',
					title: 'Musik rund um Segen und Wasser',
					text: `Ein kurzer Einsatz vor oder nach der Taufhandlung hält den Kernmoment, ohne Worte oder Gebet zu überdecken. ${profile.family}`,
				},
				{
					time: 'III.',
					kicker: 'Wunschlied',
					title: 'Ein Lied mit Familienbezug',
					text: `Wenn ein Lied durch die Familie geht, kann es für Solo-Viola reduziert werden und ${profile.area} zum roten Faden des Tages werden.`,
				},
				{
					time: 'IV.',
					kicker: 'Feier',
					title: 'Übergang zur Familienzeit',
					text: `Nach Gottesdienst oder Segnung kann Musik Gratulationen, Empfang oder Kaffee sanft öffnen. ${profile.places}`,
				},
			],
			footnote: `Für ${keyword} plane ich die Musik nach Raum, Ablauf, Familie und gewünschter Nähe.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keyword}`,
			items: localFaq(slug, profile, keyword),
		},
		contact: {
			eyebrow: 'Taufe anfragen',
			title: `${keyword} anfragen`,
			lead: `Schick mir Datum, Ort, Uhrzeit und eure ersten Liedideen für die Taufe ${profile.area}. Ich melde mich mit einem ruhigen Vorschlag für Ablauf und Musik.`,
			checklist: [
				keyword,
				'Taufe, Segnung oder Willkommensfest',
				'Kirche, Feierort & Wunschlieder',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt Live-Viola zur Taufe ${profile.area}?`,
			formSuccess: `Danke - ich melde mich mit einer Idee für Taufmusik ${profile.area}.`,
		},
		imageAlts: altText(doc, `Taufmusik ${profile.area}`),
	};
}

function buildTopic(slug, doc) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const keywordTitle = titleFromKeyword(profile.keyword);
	const momentOne = pick(slug, LOCAL_MOMENTS, 6);
	const momentTwo = pick(slug, LOCAL_MOMENTS, 7);
	const planningOne = pick(slug, PLANNING_FRAMES, 8);
	const planningTwo = pick(slug, PLANNING_FRAMES, 9);
	const planningThree = pick(slug, PLANNING_FRAMES, 10);

	return {
		targetKeyword: profile.keyword,
		seoTitle: `${keywordTitle} | Live-Viola`,
		seoDescription: `${profile.keyword}: sanfte Solo-Viola für Taufe, Segnung, Gottesdienst und Familienfeier. Persönlich und ruhig geplant.`,
		hero: {
			eyebrow: 'Taufmusik',
			title: profile.title,
			lead: `${profile.intent} Ich plane Solo-Viola so, dass Musik, Worte, Raum und Familie zusammenpassen.`,
			badge: 'Sanfte Viola für Familie & Kirche',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht einen eigenen Schwerpunkt.`,
			lede: `${profile.audience} suchen Musik für ${profile.setting}. Dafür reicht eine allgemeine Taufmusik-Seite nicht immer aus.`,
			paragraphs: [
				profile.intent,
				profile.role,
				profile.distinction,
				profile.planning,
				profile.proof,
				`Bei ${profile.keyword} geht es zuerst um die Aufgabe der Musik. Soll sie beruhigen, sammeln, einen Segen halten, ein Wunschlied tragen oder die Familienfeier danach öffnen?`,
				momentOne,
				momentTwo,
				planningOne,
				planningTwo,
				planningThree,
				`Ich wähle Stücke danach aus, ob sie auf der Viola wirklich funktionieren. Nicht jedes bekannte Lied behält ohne Text dieselbe Wirkung, und nicht jeder Klassiker passt automatisch zu Kind, Raum und Familie.`,
				`Die Länge ist ebenfalls wichtig. Ein kurzer musikalischer Ausschnitt kann stärker sein als eine vollständige Version, wenn er genau an der richtigen Stelle steht.`,
				`In der Kirche braucht Musik andere Übergänge als bei einer freien Segnung. Dort muss sie Gebet, Lesung, Taufhandlung oder Gemeindelied respektieren und darf keine liturgischen Stellen verdecken.`,
				`Bei einer freien Feier kann der Klang persönlicher gesetzt werden: rund um Kerzen, Worte der Paten, ein Willkommensritual oder einen Moment, in dem Eltern kurz innehalten möchten.`,
				`Auch nach der Taufe verändert sich die Rolle der Musik. Beim Empfang geht es weniger um Liturgie und mehr um eine warme Atmosphäre, in der Familie, Kinder und Gäste gut miteinander ankommen.`,
				`Diese Seite bleibt bewusst bei ${profile.keyword}. Andere Seiten im Cluster übernehmen Orte, Instrumente, Gottesdienst, Kirche, Kommunion, Konfirmation oder Familienfeier. So wird klar, welcher Suchintent hier beantwortet wird.`,
				`Für eine Anfrage reichen Datum, Ort, Art der Feier, gewünschte musikalische Momente und vorhandene Liedideen. Danach lässt sich ein schlanker, passender Ablauf entwickeln.`,
			],
			seal: `${keywordTitle}\nTaufe\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Planung',
			title: `Worauf es bei ${keywordTitle} ankommt.`,
			lead: 'Die Musik wird nicht als Programmpunkt gedacht, sondern als ruhiger Faden durch Taufe, Segnung oder Familienmoment.',
			items: [
				{
					time: 'I.',
					kicker: 'Intent',
					title: 'Die Aufgabe der Musik klären',
					text: `${profile.intent} Daraus ergibt sich, ob ein einzelnes Stück, mehrere Einsätze oder ein kurzer Rahmen sinnvoll ist.`,
				},
				{
					time: 'II.',
					kicker: 'Raum',
					title: 'Kirche, Garten oder Familienraum',
					text: `${profile.setting} verändert Lautstärke, Tempo und Länge der Musik deutlich.`,
				},
				{
					time: 'III.',
					kicker: 'Repertoire',
					title: 'Wunschlied oder klassischer Rahmen',
					text: `${profile.role} Die Auswahl bleibt kindgerecht, warm und nicht zu groß.`,
				},
				{
					time: 'IV.',
					kicker: 'Abgrenzung',
					title: 'Eigener Platz im Taufcluster',
					text: `${profile.distinction} Dadurch reduziert die Seite Kannibalisierung mit verwandten Taufseiten.`,
				},
			],
			footnote: `${profile.keyword} wird im CMS als eigene Seite geführt, weil der Suchbegriff andere Fragen stellt als allgemeine Taufmusik.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: topicFaq(slug, profile),
		},
		contact: {
			eyebrow: 'Taufe planen',
			title: `${keywordTitle} anfragen`,
			lead: `Schick mir Datum, Ort, Art der Feier und eure ersten Liedideen für ${profile.keyword}. Ich melde mich mit einem ruhigen musikalischen Vorschlag.`,
			checklist: [
				profile.keyword,
				profile.setting,
				'Wunschlieder & Ablauf',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt ${keywordTitle} zu eurer Feier?`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${profile.keyword}.`,
		},
		imageAlts: altText(doc, `Live-Viola für ${profile.keyword}`),
	};
}

function writeDoc(slug, patch) {
	const file = path.join(ROOT, 'src/content/seo-pages', SERVICE, `${slug}.json`);
	const current = JSON.parse(readFileSync(file, 'utf8'));
	const next = {
		...current,
		...patch,
		status: STATUS,
		enabled: true,
		editorNotes: BATCH_NOTE,
	};
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
}

const dir = path.join(ROOT, 'src/content/seo-pages', SERVICE);
const slugs = readdirSync(dir)
	.filter((file) => file.endsWith('.json'))
	.map((file) => file.replace(/\.json$/, ''))
	.sort();

let rewritten = 0;
for (const slug of slugs) {
	const file = path.join(dir, `${slug}.json`);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const patch = LOCAL_SLUGS.has(slug) ? buildLocal(slug, doc) : buildTopic(slug, doc);
	writeDoc(slug, patch);
	rewritten += 1;
}

console.log(`Rewrote ${rewritten} ${SERVICE} SEO pages.`);
