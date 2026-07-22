import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'hochzeiten';
const STATUS = 'rewritten-batch-7-review-needed';
const BATCH_NOTE = 'Batch 7: Hochzeitsseiten vollständig nach Orts-, Moment-, Format- und Instrument-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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
	aachen: ['Aachen', 'in Aachen', 'Altstadt, Standesamt, historische Säle und Feiern im Dreiländereck', 'Kirche, freie Trauung, Restaurant oder Feierort im Aachener Umland', 'Anreise, Aufbauzeit und den ersten Einsatz mit genug Puffer planen'],
	'bergisches-land': ['Bergisches Land', 'im Bergischen Land', 'Höhenlagen, Fachwerkorte, Scheunen und Trauorte zwischen Wupper und Dhünn', 'Garten, Hof, Kirche, Schlossambiente oder kleiner Saal mit viel Nähe', 'Wetter, Wege und einen geschützten Platz für das Instrument früh klären'],
	'bergisch-gladbach': ['Bergisch Gladbach', 'in Bergisch Gladbach', 'Bensberg, Schildgen und Hochzeiten zwischen Köln und bergischem Umland', 'freie Trauung, Standesamt, Villa, Restaurant oder Empfang auf der Terrasse', 'Stadtverkehr, Parken und Wege zum Trauort realistisch abstimmen'],
	bielefeld: ['Bielefeld', 'in Bielefeld', 'Altstadt, Sparrenburg-Nähe und Feiern rund um den Teutoburger Wald', 'kirchliche Trauung, freie Zeremonie, Hausfeier oder festliches Dinner', 'längere Anfahrt und genügend Zeit zum Stimmen einplanen'],
	bochum: ['Bochum', 'in Bochum', 'Ehrenfeld, Stiepel, Innenstadt und Hochzeiten mitten im Ruhrgebiet', 'freie Trauung, moderne Location, Kirche oder lockerer Sektempfang', 'Ladeweg, Parken und Startsignal vorab konkret festlegen'],
	bonn: ['Bonn', 'in Bonn', 'Südstadt, Rheinlage, Standesamt und Feiern zwischen Stadt und Siebengebirge', 'Trausaal, Kirche, Terrasse, Restaurant oder Empfang im Grünen', 'Rheinverkehr, Locationzugang und den musikalischen Beginn mit Puffer planen'],
	bottrop: ['Bottrop', 'in Bottrop', 'ruhige Wohnlagen, Ruhrgebietsfeiern und familiäre Hochzeiten', 'Standesamt, Kirche, Garten oder kleiner Saal mit direktem Gästekreis', 'Aufbau schlicht halten und den ersten Einsatz klar mit einer Kontaktperson abstimmen'],
	dormagen: ['Dormagen', 'in Dormagen', 'Rheinlage, Zons und Hochzeiten zwischen Düsseldorf und Köln', 'Standesamt, Kirche, Innenhof, Restaurant oder privater Garten', 'die Lage zwischen zwei Städten für Anfahrt und Ablauf mitdenken'],
	dortmund: ['Dortmund', 'in Dortmund', 'Kreuzviertel, Hörde, Phoenixsee und Hochzeiten im östlichen Ruhrgebiet', 'freie Trauung, Kirche, große Familienrunde oder moderner Eventraum', 'bei weitläufigen Locations Treffpunkt und Aufbauplatz vorher festlegen'],
	duesseldorf: ['Düsseldorf', 'in Düsseldorf', 'Rheinufer, Kaiserswerth, Flingern, Benrath und urbane Trauorte', 'Standesamt, freie Trauung, Kirche, Dinner oder Sektempfang', 'Innenstadtverkehr, Aufzug und kurze Ladewege vorab berücksichtigen'],
	duisburg: ['Duisburg', 'in Duisburg', 'Innenhafen, linksrheinische Stadtteile und Hochzeiten im Westen des Ruhrgebiets', 'Standesamt, Kirche, Restaurant, Terrasse oder private Feier', 'Wege durch große Stadtteile und Parkmöglichkeiten sauber abstimmen'],
	erkrath: ['Erkrath', 'in Erkrath', 'Neandertal, Unterfeldhaus und Hochzeiten nah an Düsseldorf', 'freie Trauung im Grünen, Standesamt, Kirche oder familiärer Empfang', 'kurze Wege nutzen und trotzdem einen ruhigen Aufbauplatz einplanen'],
	essen: ['Essen', 'in Essen', 'Rüttenscheid, Baldeneysee, Stadtwald und zentrale Ruhrgebietslocations', 'Trauung, Empfang, Dinnermusik oder musikalischer Übergang', 'bei großen Stadtwegen genug Zeit für Ankunft, Stimmen und Soundcheck lassen'],
	gelsenkirchen: ['Gelsenkirchen', 'in Gelsenkirchen', 'Buer, Schalke, Ückendorf und herzliche Hochzeiten im Ruhrgebiet', 'Kirche, Standesamt, Vereinsraum, Restaurant oder freier Trauort', 'Ankunft und erster Einsatz so planen, dass keine Unruhe entsteht'],
	haan: ['Haan', 'in Haan', 'Gartenstadt-Charakter und Hochzeiten zwischen Düsseldorf und Wuppertal', 'Terrasse, Wohnzimmermoment, Standesamt oder Restaurant mit persönlichem Kreis', 'Aufbau klein halten und den musikalischen Überraschungsmoment diskret vorbereiten'],
	hagen: ['Hagen', 'in Hagen', 'Volme, Haspe, Hohenlimburg und Feiern am Rand des Sauerlands', 'Kirche, freie Trauung, Restaurant oder Feier mit Blick ins Grüne', 'Anfahrt und Wetter bei Außenmomenten zuverlässig planen'],
	heiligenhaus: ['Heiligenhaus', 'in Heiligenhaus', 'ruhige Wohnlagen, Höfe und Hochzeiten zwischen Ratingen und Velbert', 'Garten, kleiner Saal, Kirche oder familiärer Empfang', 'Zugang, Strombedarf und Wetterschutz unkompliziert vorab klären'],
	herne: ['Herne', 'in Herne', 'Wanne, Eickel und Hochzeiten mitten im Ruhrgebiet', 'Standesamt, Kirche, Restaurantzimmer oder kurzer Sektempfang', 'Timing genau setzen, damit der erste Ton zum geplanten Moment kommt'],
	hilden: ['Hilden', 'in Hilden', 'Innenstadt und Hochzeiten zwischen Düsseldorf, Solingen und Langenfeld', 'Standesamt, Kirche, Gartenfest oder Dinner mit kurzer musikalischer Ansprache', 'durch kurze Wege flexibel bleiben und den Ablauf klar notieren'],
	iserlohn: ['Iserlohn', 'in Iserlohn', 'Sauerlandnähe, Letmathe und Hochzeiten mit viel Familienbezug', 'Kirche, Garten, Restaurant oder Feier mit ruhigem Empfang', 'Anreise und Wetteroptionen für Außenmusik früh mitdenken'],
	koeln: ['Köln', 'in Köln', 'Veedel, Rheinlage, Altstadt und sehr unterschiedliche Hochzeitsorte', 'Standesamt, freie Trauung, Kirche, Eventraum oder Sektempfang', 'bei dichter Stadtlage Treffpunkt, Parken und Beginn besonders genau planen'],
	krefeld: ['Krefeld', 'in Krefeld', 'Bockum, Uerdingen, Stadtwald und Hochzeiten am Niederrhein', 'Gartenfeier, Kirche, Standesamt oder Empfang mit entspanntem Charakter', 'Ablauf und Raumgröße klären, damit die Viola präsent und nicht zu laut wirkt'],
	'kreis-mettmann': ['Kreis Mettmann', 'im Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert und kleinere Orte dazwischen', 'Garten, Restaurant, Hof, Standesamt oder Kirche mit regionalem Gästekreis', 'mehrere mögliche Anfahrtswege und Stadtgrenzen entspannt einplanen'],
	langenfeld: ['Langenfeld', 'in Langenfeld', 'Hochzeiten zwischen Düsseldorf, Leverkusen und Monheim', 'Restaurant, Terrasse, Standesamt oder private Familienfeier', 'den Ablauf kompakt planen, damit Musik Empfang oder Trauung gezielt öffnet'],
	leverkusen: ['Leverkusen', 'in Leverkusen', 'Schlebusch, Opladen, Rheinlage und Hochzeiten zwischen Köln und Bergischem Land', 'Trauung, Gartenfest, Restaurant oder musikalischer Empfang', 'Anfahrt zwischen Stadtteilen und Locationzugang konkretisieren'],
	meerbusch: ['Meerbusch', 'in Meerbusch', 'Büderich, Osterath, Rheinlage und elegante private Hochzeiten', 'Garten, Hauskonzert, freie Trauung oder Dinner mit ruhigem Ton', 'dezente Musik und klares Timing oft besser planen als einen großen Auftritt'],
	mettmann: ['Mettmann', 'in Mettmann', 'Neandertalnähe, Altstadt und Hochzeiten im Kreis Mettmann', 'kleiner Saal, Kirche, Restaurant oder private Feier mit viel Gespräch', 'Ankunft, Aufbauplatz und Wunschlied diskret mit einer Kontaktperson klären'],
	moenchengladbach: ['Mönchengladbach', 'in Mönchengladbach', 'Rheydt, Wickrath und Hochzeiten am linken Niederrhein', 'Familienfeier, Kirche, Standesamt oder Gartenfeier mit mehreren Generationen', 'größere Wege im Stadtgebiet und den richtigen Moment für den Einsatz planen'],
	moers: ['Moers', 'in Moers', 'Niederrhein, Schlossnähe und Feiern zwischen Duisburg und Kamp-Lintfort', 'Garten, Kirche, Restaurant oder private Feier mit ruhigem Anfang', 'bei Außenmusik Wetterschutz und einen stabilen Platz für das Instrument sichern'],
	'monheim-am-rhein': ['Monheim am Rhein', 'in Monheim am Rhein', 'Rheinpromenade, Baumberg und Hochzeiten zwischen Düsseldorf und Leverkusen', 'Terrasse, Standesamt, Restaurant oder Empfang am Nachmittag', 'Rheinlage und Wetteroptionen bei musikalischen Außenmomenten beachten'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr', 'in Mülheim an der Ruhr', 'Ruhrtal, Broich, Saarn und Hochzeiten mit grüner Stadtnähe', 'Gartenfest, Kirche, Restaurant oder Dinner mit ruhiger Eleganz', 'Wege am Wasser, Parken und Aufbauplatz vorher klären'],
	muenster: ['Münster', 'in Münster', 'Altstadt, Aasee und Hochzeiten mit heller, kultivierter Atmosphäre', 'Empfang, Kirche, freie Trauung oder Dinner in privatem Rahmen', 'Innenstadtlogistik und Anreise mit genügend Zeitpuffer planen'],
	neuss: ['Neuss', 'in Neuss', 'Innenstadt, Rheinlage und Hochzeiten zwischen Düsseldorf und Grevenbroich', 'Sektempfang, Standesamt, Garten oder Familienessen', 'Nähe zu Düsseldorf nutzen und den genauen Treffpunkt festlegen'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen', 'in Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land und weitere Städte in NRW', 'Hochzeiten von der kleinen Trauung bis zum größeren Fest', 'Anfahrt, Region und Setlänge individuell nach Termin prüfen'],
	oberhausen: ['Oberhausen', 'in Oberhausen', 'Sterkrade, Alt-Oberhausen und Hochzeiten im westlichen Ruhrgebiet', 'Familienfeier, Kirche, Restaurant oder Empfang mit entspanntem Beginn', 'bei großen Wegen im Ruhrgebiet Startzeit und Aufbau nicht zu knapp legen'],
	paderborn: ['Paderborn', 'in Paderborn', 'Innenstadt, Schloss Neuhaus und Hochzeiten in Ostwestfalen', 'Kirche, Hausfeier, Restaurant oder Familienfeier mit ruhiger Planung', 'Anreise und Setlänge früh abstimmen, damit sich die weitere Strecke lohnt'],
	ratingen: ['Ratingen', 'in Ratingen', 'Lintorf, Hösel, Tiefenbroich und Hochzeiten nah an Düsseldorf', 'Garten, Kirche, Standesamt oder Restaurant mit elegantem, lockerem Rahmen', 'kurze Distanzen nutzen und Beginn sowie Wunschmoment klar planen'],
	recklinghausen: ['Recklinghausen', 'in Recklinghausen', 'Altstadt, Süd, Hochlar und Hochzeiten am Rand des Ruhrgebiets', 'Restaurant, Familienhaus, Kirche oder Empfang mit vielen Gesprächen', 'Anfahrt und Parken ruhig vorab klären, damit der Beginn unaufgeregt bleibt'],
	remscheid: ['Remscheid', 'in Remscheid', 'Bergische Höhen, Lennep und Hochzeiten mit gemütlichem Charakter', 'Gartenfeier, Kirche, Esszimmer oder kleiner Saal', 'Wetter und Wege bei Außenmusik realistisch einplanen'],
	'rhein-kreis-neuss': ['Rhein-Kreis Neuss', 'im Rhein-Kreis Neuss', 'Neuss, Meerbusch, Dormagen, Grevenbroich und Rheinorte dazwischen', 'Gartenfest, Standesamt, Restaurant oder familiärer Empfang', 'Anfahrt und Stadtgrenzen flexibel planen, damit der Ablauf ruhig bleibt'],
	rheinland: ['Rheinland', 'im Rheinland', 'Rheinstädte, kleinere Orte und Hochzeiten mit offener, geselliger Atmosphäre', 'Sektempfang, freie Trauung, Kirche, Garten oder Dinner', 'Region, Fahrzeit und gewünschte Setlänge individuell abstimmen'],
	'rhein-ruhr': ['Rhein-Ruhr', 'in der Rhein-Ruhr-Region', 'dichte Wege zwischen Düsseldorf, Köln, Essen, Dortmund und Duisburg', 'Hochzeiten mit Gästen aus mehreren Städten', 'Verkehr, Timing und Aufbau mit realistischen Puffern planen'],
	ruhrgebiet: ['Ruhrgebiet', 'im Ruhrgebiet', 'viele Städte nah beieinander und Hochzeiten mit direkter, herzlicher Stimmung', 'Restaurant, Kirche, Vereinshaus, Garten oder Familienwohnung', 'klare Absprachen zu Startsignal und Lautstärke besonders früh treffen'],
	siegen: ['Siegen', 'in Siegen', 'Oberstadt, Siegerland und Hochzeiten mit weiterem regionalem Einzugsgebiet', 'Familienhaus, Kirche, Restaurant oder Feier im Grünen', 'die längere Anfahrt mit Setdauer und Zeitfenster sinnvoll verbinden'],
	solingen: ['Solingen', 'in Solingen', 'Ohligs, Gräfrath, Wald und bergische Hochzeiten', 'Garten, Kirche, Restaurant oder private Feier mit handgemachtem Charakter', 'bei Häusern und Höhenlagen Zugang und Wetteroptionen früh besprechen'],
	unna: ['Unna', 'in Unna', 'Altstadt, Königsborn und Hochzeiten zwischen Ruhrgebiet und Hellweg', 'Familienessen, Gartenfest, Kirche oder Sektempfang am Nachmittag', 'Anfahrt, Aufbau und erster Einsatz ohne Hektik aufeinander abstimmen'],
	velbert: ['Velbert', 'in Velbert', 'Neviges, Langenberg und Hochzeiten zwischen Ruhrgebiet und Bergischem Land', 'Fachwerkambiente, Kirche, Restaurant oder privater Garten', 'bei Steigungen, Wegen und Außenflächen genug Zeit für Aufbau einplanen'],
	wuelfrath: ['Wülfrath', 'in Wülfrath', 'kleine Stadtwege, bergische Nähe und persönliche Hochzeiten', 'Wohnzimmer, Garten, Kirche oder Restaurant mit überschaubarem Kreis', 'ruhiger Aufbau und ein klarer Einsatzmoment passen hier besonders gut'],
	wuppertal: ['Wuppertal', 'in Wuppertal', 'Elberfeld, Barmen, Höhenlagen und Hochzeiten entlang der Wupper', 'Altbauwohnung, Kirche, Garten am Hang oder Restaurant mit lebendigem Publikum', 'Wege, Treppen und Wetter bei Außenmusik mitdenken'],
};

const LOCAL_DETAIL_NOTES = {
	aachen: ['In Aachen denke ich besonders an kurze Wege in der Altstadt, ältere Gebäude mit Hall und Feiern, bei denen Gäste oft aus Belgien, den Niederlanden und dem Rheinland zusammenkommen. Dadurch wird der musikalische Beginn gern bewusst ruhig gesetzt, damit der Tag trotz Anreise gesammelt startet.', 'Wichtig sind in Aachen vor allem Treffpunkt, Raumakustik und ein belastbarer Zeitpuffer, weil historische Trauorte und enge Wege den Aufbau stärker beeinflussen können als eine reine Stückliste.'],
	'bergisches-land': ['Im Bergischen Land verändern Hügel, Höfe, Scheunen, Gärten und wechselhaftes Wetter die Planung stärker als in einer klassischen Innenstadtlocation. Ich achte deshalb darauf, ob die Viola draußen geschützt steht, ob Wege über Kies oder Wiese führen und ob der Klang nah genug bei euch bleibt.', 'Bei Hochzeiten im Bergischen Land klären wir früh, ob Außenmusik wirklich wetterfest möglich ist und wo ein ruhiger, trockener Alternativplatz liegt.'],
	'bergisch-gladbach': ['In Bergisch Gladbach liegen elegante Bensberger Räume, private Gärten und Kölner Stadtnähe oft sehr nah beieinander. Musikalisch plane ich deshalb nicht nur den Traumoment, sondern auch die Übergänge zwischen Ankunft, Fotos, Gratulationen und späterem Empfang.', 'Für Bergisch Gladbach sind Zufahrt, Parken und die genaue Position der Musik wichtig, weil manche Locations festlich wirken, aber organisatorisch eher kurze Zeitfenster haben.'],
	bielefeld: ['Für Bielefeld plane ich Hochzeitsmusik mit Blick auf längere Anreise, klare Zeitfenster und Locations zwischen Stadt, Sparrenburgnähe und Teutoburger-Wald-Atmosphäre. Der Klang darf hier festlich sein, ohne dass der Ablauf durch zu viele Einsätze schwer wird.', 'Bei Bielefeld-Terminen ist ein sauberer Ablaufplan hilfreich, damit Anfahrt, Stimmen, Startsignal und mögliche Pausen nicht zu knapp kalkuliert werden.'],
	bochum: ['Bochum-Hochzeiten wirken oft direkt, herzlich und weniger formell als klassische Schlossfeiern. Deshalb darf die Musik nah bei den Gästen sein: ein warmer Einzug, ein ruhiger Moment für die Ringe und danach ein Auszug, der wirklich nach Ruhrgebiet und Familie klingt.', 'In Bochum klären wir vor allem Ladeweg, Parkmöglichkeit und das Startsignal, weil moderne Locations und urbane Räume häufig mehrere Eingänge oder Etagen haben.'],
	bonn: ['In Bonn mischen sich Rheinlage, Südstadt, politische Geschichte und Siebengebirge-Nähe zu sehr unterschiedlichen Hochzeitsbildern. Ich plane die Viola so, dass sie im Trausaal genauso funktioniert wie auf einer Terrasse oder bei einem Empfang mit Blick ins Grüne.', 'Für Bonn sind Rheinverkehr, genaue Adresse und ein sinnvoller Puffer wichtig, besonders wenn Trauung, Fotos und Empfang an verschiedenen Orten stattfinden.'],
	bottrop: ['Bottrop passt häufig zu familiären Hochzeiten, bei denen der musikalische Moment nicht übergroß wirken soll. Ein Solo-Instrument kann hier sehr persönlich sein: nah am Brautpaar, beweglich im Ablauf und angenehm für Gäste, die sich nach der Trauung direkt unterhalten möchten.', 'In Bottrop reicht oft eine schlanke Planung, aber Startsignal, Aufbauplatz und ein kurzer Kontakt vor Ort sollten eindeutig feststehen.'],
	dormagen: ['Dormagen liegt zwischen Düsseldorf und Köln, und genau diese Lage prägt viele Abläufe: Gäste kommen aus mehreren Richtungen, Rheinorte wirken ruhig, und Zons oder private Gärten verlangen oft nach einer feinen, nicht zu lauten musikalischen Linie.', 'Für Dormagen achte ich besonders auf die Abstimmung zwischen Trauort, Fotomoment und Empfang, damit die Musik nicht an einer Stadtgrenze oder einem Ortswechsel hängen bleibt.'],
	dortmund: ['In Dortmund können Hochzeiten sehr großstädtisch, familiär oder modern am Phoenixsee wirken. Ich plane den Klang deshalb eher dramaturgisch: ein klarer Einstieg, ein zurückgenommener Mittelteil und ein Auszug, der den Wechsel vom offiziellen Moment in den Empfang hörbar macht.', 'Für Dortmund sind Treffpunkt, Wege innerhalb der Location und eine feste Kontaktperson wichtig, weil größere Häuser schnell unübersichtlich werden können.'],
	duesseldorf: ['Düsseldorf braucht oft eine präzise, elegante Planung: Rheinlage, Benrath, Kaiserswerth, Innenstadtverkehr und kurze Ladezonen verändern den Ablauf. Die Viola passt gut, wenn Musik hochwertig wirken soll, ohne eine große Bühne aufzubauen.', 'In Düsseldorf stimmen wir neben den Stücken besonders Aufzug, Ladeweg, Parken und den Wechsel zwischen Trauung, Fotos und Empfang ab.'],
	duisburg: ['Duisburg bringt Innenhafen, Rhein, Ruhrgebiet und linksrheinische Stadtteile zusammen. Für Hochzeitsmusik bedeutet das: Die Stimmung darf warm und klar sein, aber die Planung muss Wege, Parkplätze und manchmal größere Distanzen im Stadtgebiet ernst nehmen.', 'In Duisburg ist es sinnvoll, die genaue Ankunftszeit und den Aufbauplatz vorab festzulegen, damit der erste Ton entspannt und nicht unter Zeitdruck entsteht.'],
	erkrath: ['Erkrath ist nah an Düsseldorf, wirkt bei Hochzeiten aber oft grüner und persönlicher. Zwischen Neandertal, Unterfeldhaus und privaten Feiern entsteht ein Rahmen, in dem Solo-Viola besonders gut funktioniert, weil sie festlich klingt und trotzdem nicht zu groß wird.', 'Für Erkrath klären wir, ob die Musik draußen, im Saal oder an einem Übergangspunkt zwischen Trauung und Empfang sitzen soll.'],
	essen: ['Essen hat mit Baldeneysee, Stadtwald, Rüttenscheid und zentralen Ruhrgebietslagen sehr unterschiedliche Hochzeitsorte. Ich plane die Musik passend zur Atmosphäre: ruhig am Wasser, festlich im Saal oder dezent beim Empfang, wenn viele Gäste gleichzeitig ankommen.', 'Bei Essen-Terminen sind Stadtverkehr, Locationzugang und ein realistischer Puffer vor dem ersten Einsatz besonders wichtig.'],
	gelsenkirchen: ['In Gelsenkirchen darf Hochzeitsmusik oft bodenständig und emotional zugleich sein. Buer, Ückendorf oder kleinere Feierräume verlangen weniger Show und mehr verlässliches Timing, damit Einzug, Ringtausch und Gratulationen natürlich ineinander greifen.', 'Für Gelsenkirchen hilft ein klarer Ablaufplan mit Startzeichen und Pausen, weil viele Feiern familiär organisiert sind und nicht jede Location eine feste Regie hat.'],
	haan: ['Haan wirkt bei Hochzeiten häufig privat, gartenstädtisch und nah an den Menschen. Die Viola kann dort sehr fein eingesetzt werden: als kleines musikalisches Geschenk, als Einzugsmoment oder als ruhige Begleitung zwischen Standesamt und Essen.', 'In Haan geht es oft um eine diskrete Vorbereitung, damit ein Wunschlied oder Überraschungsmoment nicht zu früh sichtbar wird.'],
	hagen: ['Hagen liegt am Übergang Richtung Sauerland, dadurch spielen Wetter, Wege und Blick ins Grüne bei vielen Feiern eine größere Rolle. Musikalisch plane ich lieber robuste, klare Momente als zu empfindliche Abläufe mit vielen Ortswechseln.', 'Für Hagen klären wir früh, ob Außenmusik geschützt möglich ist und wie viel Zeit zwischen Ankunft, Stimmen und dem ersten Einsatz bleibt.'],
	heiligenhaus: ['Heiligenhaus-Hochzeiten sind oft überschaubar, persönlich und zwischen Ratingen und Velbert gut erreichbar. Die Musik darf hier besonders nah wirken: nicht als Konzert, sondern als bewusster Klang für Einzug, Segen, Ringe oder einen kleinen Empfang.', 'In Heiligenhaus sind Zugang, Strombedarf bei eventueller Technik und Wetterschutz schnell geklärt, sollten aber vor dem Hochzeitstag schriftlich feststehen.'],
	herne: ['Herne liegt mitten im Ruhrgebiet und passt zu Hochzeiten, die direkt, familiär und unkompliziert geplant sind. Solo-Viola bringt dabei Festlichkeit in Standesamt, Kirche oder Restaurantzimmer, ohne den Tag organisatorisch schwerer zu machen.', 'In Herne ist ein klares Zeitfenster wichtig, damit die Musik genau dort beginnt, wo die Zeremonie emotional offen ist.'],
	hilden: ['Hilden liegt zwischen Düsseldorf, Solingen und Langenfeld, wodurch viele Hochzeiten regional gemischt sind. Ich plane die Musik kompakt und klar: ein präziser Einzug, ein warmes Stück im Trauungsmoment und bei Bedarf leichte Musik für den Empfang.', 'Für Hilden sind kurze Wege ein Vorteil, trotzdem sollten Treffpunkt, Wunschlied und die Rolle der Musik vorab konkret notiert sein.'],
	iserlohn: ['In Iserlohn wirken Hochzeiten oft etwas weiter, grüner und familienbezogener. Die Musik darf dort nicht wie ein städtischer Standardblock klingen, sondern soll Raum, Anreise und persönlichen Anlass verbinden.', 'Für Iserlohn plane ich Anfahrt und Setdauer besonders sorgfältig, damit der musikalische Einsatz zur weiteren Strecke und zum Tagesablauf passt.'],
	koeln: ['Köln bringt Veedel, Rhein, Altstadt, urbane Räume und sehr unterschiedliche Gästegruppen zusammen. Hochzeitsmusik muss hier oft flexibel sein: festlich genug für den offiziellen Moment, aber locker genug für den direkten Übergang in Gratulationen und Gespräche.', 'In Köln sind Parken, Eingang, Etage und Startsignal besonders wichtig, weil dichte Stadtlagen musikalisch nur funktionieren, wenn die Logistik ruhig bleibt.'],
	krefeld: ['Krefeld und der Niederrhein wirken bei Hochzeiten häufig entspannter und etwas weitläufiger. Die Viola kann dort eine elegante Linie setzen, ohne den Empfang zu überdecken, besonders in Gärten, Stadtwaldnähe oder familiären Restaurants.', 'Für Krefeld klären wir Raumgröße und Abstand zu den Gästen, damit der warme Klang präsent ist, aber Gespräche möglich bleiben.'],
	'kreis-mettmann': ['Im Kreis Mettmann wechseln Erkrath, Ratingen, Haan, Hilden, Velbert und kleinere Orte schnell ineinander. Für die Musik ist deshalb entscheidend, welcher Trauort wirklich den Ton setzt: grün, urban, bergisch, familiär oder sehr elegant.', 'Bei Hochzeiten im Kreis Mettmann planen wir die Stadtgrenzen pragmatisch mit und legen Treffpunkt, Fahrzeit und Aufbauplatz eindeutig fest.'],
	langenfeld: ['Langenfeld liegt praktisch zwischen Düsseldorf, Leverkusen und Monheim. Viele Hochzeiten sind dadurch gut erreichbar, aber zeitlich dicht geplant. Ich setze Musik hier gern kompakt ein, damit Trauung, Empfang und Essen nicht auseinanderfallen.', 'Für Langenfeld ist entscheidend, ob die Musik nur die Trauung trägt oder auch den Empfang öffnet, weil beide Rollen unterschiedliche Lautstärke und Setlänge brauchen.'],
	leverkusen: ['Leverkusen verbindet Rheinlage, Opladen, Schlebusch und bergische Nähe. Die Hochzeitsmusik sollte deshalb nicht pauschal klingen, sondern je nach Ort heller, ruhiger oder privater angelegt werden.', 'In Leverkusen klären wir besonders die Wege zwischen Stadtteilen und den genauen Zugang zur Location, damit die Viola pünktlich und ruhig startbereit ist.'],
	meerbusch: ['Meerbusch steht oft für elegante private Hochzeiten, Gärten, Rheinlage und ein Publikum, das dezente Qualität schätzt. Die Viola darf dort fein und nah bleiben, mit Musik, die Atmosphäre schafft, ohne den Raum zu besetzen.', 'Für Meerbusch ist die Balance aus Zurückhaltung und Festlichkeit zentral: Wo steht die Musik, wie lange spielt sie, und wann bleibt besser Stille?'],
	mettmann: ['Mettmann wirkt durch Altstadt, Neandertalnähe und kleinere Feierräume sehr persönlich. Ich plane die Musik so, dass sie nicht zu groß für den Raum wird und trotzdem als besonderer Moment erkennbar bleibt.', 'Für Mettmann sind Aufbauplatz, Raumgröße und die Abstimmung mit einer Kontaktperson besonders hilfreich, weil viele Feiern privat oder halbprivat organisiert sind.'],
	moenchengladbach: ['Mönchengladbach bringt Rheydt, Wickrath und den linken Niederrhein zusammen. Viele Hochzeiten haben hier einen starken Familienbezug, daher plane ich Musik, die mehrere Generationen abholt, ohne beliebig zu werden.', 'Für Mönchengladbach achten wir auf Wege im Stadtgebiet, die richtige Einsatzstelle und darauf, ob ein Wunschlied eher Zeremonie oder Geschenk sein soll.'],
	moers: ['Moers passt gut zu Hochzeiten mit Niederrhein-Ruhe, Schlossnähe oder Gartencharakter. Die Viola kann dort sehr klar und warm wirken, besonders wenn der Übergang von Trauung zu Empfang nicht hektisch werden soll.', 'Für Moers sind Wetterschutz und ein stabiler Platz bei Außenmusik wichtig, weil ein warmer Klang nur trägt, wenn das Instrument sicher stehen kann.'],
	'monheim-am-rhein': ['Monheim am Rhein hat mit Promenade, Baumberg und der Lage zwischen Düsseldorf und Leverkusen einen eigenen ruhigen Rahmen. Musikalisch plane ich dort gern leichte Übergänge: Trauung, Gratulation, Rheinluft, Empfang.', 'Für Monheim ist wichtig, ob Musik am Wasser, auf einer Terrasse oder im Innenraum stattfinden soll, denn Wind und Abstand verändern die Wirkung der Viola.'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr wirkt grüner als viele Ruhrgebietsstädte. Broich, Saarn und Ruhrtal passen zu Hochzeiten, bei denen die Musik elegant, aber entspannt bleiben soll.', 'Für Mülheim klären wir Wege am Wasser, Parken und den Schutz bei Außenmomenten, damit die Musik nicht durch Wetter oder lange Laufwege gestört wird.'],
	muenster: ['Münster-Hochzeiten haben oft eine helle, kultivierte Stimmung zwischen Altstadt, Aasee und privatem Empfang. Ich plane die Viola dort fein und geordnet, damit Musik nicht zu schwer wirkt, aber dem Tag dennoch Gewicht gibt.', 'Für Münster sollten Anreise, Innenstadtlogistik und ein Puffer vor dem Stimmen früh eingeplant werden.'],
	neuss: ['Neuss liegt nah an Düsseldorf und hat gleichzeitig eigene Rhein- und Innenstadtmomente. Die Musik kann hier sehr gut als Verbindung funktionieren: Standesamt oder Kirche, danach Gratulationen, Fotos und ein kurzer Empfang.', 'In Neuss ist ein genauer Treffpunkt sinnvoll, weil kleine Wege zwischen Trauort, Rheinlage und Feierort den Ablauf schneller verschieben können als geplant.'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen ist als Zielseite breiter als eine Stadtseite. Deshalb erkläre ich hier stärker, wie ich Hochzeiten in Rheinland, Ruhrgebiet, Bergischem Land und weiteren Regionen unterschiedlich plane.', 'Für NRW-Anfragen brauche ich besonders Ort, Fahrzeit, Zeremonieform und gewünschte Setlänge, damit die Musik realistisch zum Termin passt.'],
	oberhausen: ['Oberhausen-Hochzeiten sind oft unkompliziert, familiär und im westlichen Ruhrgebiet gut vernetzt. Die Viola passt gut, wenn eine Feier einen festlichen Anfang braucht, aber später nicht wie ein Konzert wirken soll.', 'Für Oberhausen sollten Ankunft, Parken und der Weg zum Raum vorab stehen, weil größere Ruhrgebietswege schnell Puffer kosten.'],
	paderborn: ['Paderborn liegt weiter im Osten des NRW-Radius, daher muss eine Anfrage musikalisch und organisatorisch sinnvoll geplant sein. Wenn der Rahmen passt, kann die Viola Kirche, Hausfeier oder Restaurant sehr persönlich öffnen.', 'Für Paderborn klären wir früh Setlänge, Anreise und Zeitfenster, damit sich die weitere Strecke gut in den Hochzeitstag einfügt.'],
	ratingen: ['Ratingen ist nah an Düsseldorf, hat aber mit Hösel, Lintorf und grünen Lagen viele ruhigere Hochzeitsorte. Musik kann hier elegant sein, ohne städtisch kühl zu wirken.', 'Für Ratingen ist wichtig, ob die Musik in einem Garten, einer Kirche, einem Standesamt oder einem Restaurant beginnt, weil jeder Ort ein anderes Timing verlangt.'],
	recklinghausen: ['Recklinghausen liegt am Rand des Ruhrgebiets und hat viele Hochzeiten mit persönlichem, geselligem Charakter. Die Viola kann dort besonders gut die offiziellen Momente veredeln, ohne späteren Gesprächen im Weg zu stehen.', 'Für Recklinghausen klären wir Parken, Raumzugang und eine Kontaktperson, damit der erste Einsatz nicht von organisatorischen Fragen abhängt.'],
	remscheid: ['Remscheid bringt bergische Höhen, Lennep und oft gemütliche, wetterabhängige Hochzeitsorte mit. Ich plane Musik dort bewusst robust: klare Startpunkte, gute Platzwahl und genug Ruhe für den Klang.', 'Für Remscheid sind Wege, Treppen, Außenflächen und Wetteroptionen wichtige Punkte, bevor wir die Stücke final festlegen.'],
	'rhein-kreis-neuss': ['Der Rhein-Kreis Neuss ist keine einzelne Stimmung, sondern ein Netz aus Neuss, Meerbusch, Dormagen, Grevenbroich und kleineren Rheinorten. Die Musik wird deshalb nach Trauort und Gästeweg geplant, nicht nur nach Kreisname.', 'Für den Rhein-Kreis Neuss stimmen wir Fahrzeit, Ortswechsel und den passendsten Einsatzpunkt ab, damit die Viola den Tag verbindet statt nur einen Programmpunkt zu füllen.'],
	rheinland: ['Im Rheinland sind Hochzeiten oft offen, gesellig und stark vom Empfang geprägt. Die Musik muss hier nicht nur die Zeremonie tragen, sondern auch den Übergang zu Gratulationen, Fotos und Gesprächen weich machen.', 'Für Rheinland-Hochzeiten klären wir Region, Fahrzeit und Setlänge individuell, weil Köln, Düsseldorf, Bonn oder kleinere Orte ganz unterschiedliche Abläufe haben.'],
	'rhein-ruhr': ['Rhein-Ruhr bedeutet dichte Wege, mehrere Städte und oft Gäste aus verschiedenen Richtungen. Für die Musik plane ich deshalb mit realistischen Puffern und einer klaren Dramaturgie, damit der Tag trotz Verkehr ruhig beginnt.', 'In Rhein-Ruhr ist die Logistik fast so wichtig wie das Repertoire: Startsignal, Parken und Aufbauort müssen vorab eindeutig sein.'],
	ruhrgebiet: ['Im Ruhrgebiet darf Hochzeitsmusik herzlich, direkt und trotzdem festlich sein. Viele Feiern wechseln schnell zwischen offizieller Zeremonie, Familienmoment und lockerem Empfang; die Viola kann diese Übergänge warm zusammenhalten.', 'Für Ruhrgebiets-Hochzeiten helfen klare Absprachen zu Lautstärke, Startsignal und Pausen, weil Locations und Gästegruppen oft lebendig sind.'],
	siegen: ['Siegen und das Siegerland bringen häufig weitere Anfahrten, grüne Orte und Familienfeiern mit starkem regionalem Bezug. Die Musik sollte dort nicht zu kurz gedacht werden, sondern als bewusster Teil des Tagesfensters.', 'Für Siegen ist es sinnvoll, Setdauer, Anreise und mögliche Wartezeiten früh zu verbinden, damit der Auftritt gut zum Ablauf passt.'],
	solingen: ['Solingen wirkt mit Gräfrath, Ohligs, Wald und bergischen Lagen oft handgemacht und persönlich. Die Viola kann dort warm, nah und nicht zu repräsentativ klingen, was besonders zu Garten- und Restaurantfeiern passt.', 'Für Solingen sind Höhenlage, Zugang, Wetter und Raumgröße wichtig, bevor wir entscheiden, ob Musik draußen oder innen besser wirkt.'],
	unna: ['Unna liegt zwischen Ruhrgebiet und Hellweg und passt zu Hochzeiten, die familiär und zugleich gut erreichbar sind. Musik kann hier vor allem den Nachmittag strukturieren: Trauung, Sektempfang, Familienessen.', 'Für Unna klären wir Anfahrt, Aufbau und den ersten Einsatz so, dass keine Hektik entsteht, wenn Gäste aus verschiedenen Richtungen ankommen.'],
	velbert: ['Velbert verbindet Neviges, Langenberg und bergische Nähe mit Ruhrgebietswegen. Hochzeitsmusik sollte hier flexibel auf Fachwerkambiente, Kirche, Garten oder Restaurant reagieren können.', 'Für Velbert berücksichtige ich Steigungen, Wege und Außenflächen, weil der beste musikalische Platz manchmal nicht direkt am Eingang liegt.'],
	wuelfrath: ['Wülfrath ist klein genug für persönliche Wege und bergisch genug für Wetter- und Außenfragen. Die Musik darf hier sehr intim sein: ein Wunschlied im Garten, ein ruhiger Einzug oder ein kurzer Empfang im überschaubaren Kreis.', 'Für Wülfrath ist ein ruhiger Aufbauplatz wichtig, weil kleine Feiern meist wenig Abstand zwischen Musik, Brautpaar und Gästen lassen.'],
	wuppertal: ['Wuppertal verlangt wegen Höhenlagen, Treppen, Altbauten und Wegen entlang der Wupper besonders genaue Planung. Der Klang der Viola kann sehr schön tragen, wenn Position, Akustik und Wetter vorher stimmen.', 'Für Wuppertal klären wir Laufwege und Aufbauplatz genau, damit die Musik nicht durch Treppen, Hanglagen oder kurzfristige Ortswechsel aus dem Takt kommt.'],
};

const TOPIC_PROFILES = {
	'bratsche-hochzeit': ['Bratsche Hochzeit', 'Bratsche', 'Bratsche zur Hochzeit, warm, nah und weniger hell als klassische Geige.', 'Paare, die bewusst eine warme Streichfarbe suchen', 'Trauung, Ringtausch, Ja-Wort oder Dinner', 'Der Suchintent ist instrumentennah: Es geht nicht um irgendeine Hochzeitsmusik, sondern um den besonderen Klang der Bratsche.', 'Tiefe Lagen, ruhige Bögen und klare Melodien wirken besonders gut, wenn der Moment intim bleiben soll.', 'Die Bratsche braucht keine große Bühne. Sie trägt den Raum über Klangfarbe, nicht über Lautstärke.'],
	'bratschistin-hochzeit': ['Bratschistin Hochzeit', 'Bratschistin', 'Eine Bratschistin zur Hochzeit, wenn der Klang persönlich und fein geführt sein soll.', 'Paare, die eine einzelne Musikerin statt Band oder Ensemble suchen', 'Einzug, Zeremonie, Sektempfang oder kurzer Empfang', 'Hier steht die Person und das Live-Format im Vordergrund: klare Absprachen, direkter Kontakt und Solo-Viola.', 'Ich stimme Stücke, Kleidung, Einsatzpunkte und Rückfragen mit euch oder der Traurednerin ab.', 'Eine Bratschistin ist besonders passend, wenn die Musik sichtbar sein darf, aber nicht zur Show werden soll.'],
	'dezente-hochzeitsmusik': ['Dezente Hochzeitsmusik', 'Dezent', 'Dezente Hochzeitsmusik, die Atmosphäre schafft, ohne Gespräche zu überdecken.', 'Trauungen, Empfänge und Dinner mit ruhigem, stilvollem Rahmen', 'Sektempfang, Dinnermusik, Unterschrift oder Hintergrund', 'Der Fokus liegt auf Zurückhaltung: Die Musik soll spürbar sein, aber nicht dominieren.', 'Repertoire, Lautstärke und Setlänge werden so gewählt, dass Reden, Gratulationen und Essen Raum behalten.', 'Dezent heißt nicht beliebig. Gerade leise Musik braucht präzises Timing und eine klare Aufgabe.'],
	'dinnermusik-hochzeit': ['Dinnermusik Hochzeit', 'Dinner', 'Dinnermusik zur Hochzeit, die zwischen Gängen, Reden und Gesprächen atmet.', 'Hochzeitsessen, Menüabende und kleinere Feiern mit Sitzordnung', 'Restaurant, Saal, privates Esszimmer oder Schlossdinner', 'Hier zählt Service-Timing: Musik muss zum Essen passen und darf Gespräche nicht stören.', 'Kurze Sets zwischen Gängen oder nach einer Rede sind oft angenehmer als ein langer Block.', 'Dinnermusik funktioniert am besten, wenn Lautstärke, Pausen und Platz im Raum vorher geklärt sind.'],
	'elegante-hochzeitsmusik': ['Elegante Hochzeitsmusik', 'Elegant', 'Elegante Hochzeitsmusik mit Solo-Viola, klassisch im Ton und persönlich im Ablauf.', 'Paare, die einen stilvollen, ruhigen Rahmen suchen', 'Standesamt, freie Trauung, Kirche, Empfang oder Dinner', 'Elegant meint nicht distanziert. Die Musik soll festlich wirken und trotzdem nah an euch bleiben.', 'Klassische Stücke, moderne Balladen und ein Wunschlied können zu einem feinen Bogen verbunden werden.', 'Die Eleganz entsteht durch Maß: wenige gute Einsätze, passende Pausen und ein klarer Klang.'],
	'emotionale-hochzeitsmusik': ['Emotionale Hochzeitsmusik', 'Emotional', 'Emotionale Hochzeitsmusik, die den Moment trägt, ohne ihn zu überzeichnen.', 'Einzug, Ja-Wort, Ringtausch und persönliche Wunschlieder', 'Zeremonie, Trausaal, Kirche oder freie Trauung', 'Der Intent ist Gefühl: Musik soll Tränen, Ruhe und Bedeutung zulassen, ohne kitschig zu werden.', 'Ich plane Stücke so, dass sie Zeit lassen, wenn ein Moment länger braucht.', 'Emotionale Musik braucht auch Zurückhaltung, damit Worte, Blicke und Versprechen nicht zugedeckt werden.'],
	'geige-hochzeit': ['Geige Hochzeit', 'Geige', 'Geige zur Hochzeit gesucht, warm als Solo-Streichmusik auf Viola umgesetzt.', 'Suchende, die nach Geige fragen und Live-Streicherklang meinen', 'Trauung, Einzug, Auszug, Sektempfang oder Dinner', 'Viele Paare suchen nach Geige, obwohl eine Viola klanglich genau die wärmere Alternative sein kann.', 'Ich erkläre transparent, wie sich Viola und Geige unterscheiden und welche Stücke gut funktionieren.', 'Der Fokus liegt auf dem gewünschten Streicherklang, nicht auf einem falschen Instrumentenversprechen.'],
	'geigerin-hochzeit': ['Geigerin Hochzeit', 'Geigerin', 'Geigerin zur Hochzeit gesucht, als persönliche Solo-Streicherin mit Viola-Klang.', 'Paare, die eine einzelne Musikerin für ihre Hochzeit suchen', 'Einzug, Trauung, Empfang oder Dinner', 'Diese Seite fängt den Suchbegriff Geigerin ab und ordnet ihn sauber ein: gespielt wird Solo-Viola mit warmer Streicherfarbe.', 'Wunschlieder, klassische Stücke und moderne Songs werden auf Wirkung, Tonart und Ablauf geprüft.', 'Wichtig ist, dass ihr den Klang bekommt, den ihr euch vorstellt, und der Ablauf nicht aus Standards besteht.'],
	'hintergrundmusik-hochzeit': ['Hintergrundmusik Hochzeit', 'Hintergrund', 'Hintergrundmusik zur Hochzeit, die Gespräche trägt und Räume verbindet.', 'Empfang, Dinner, Gratulationen und lockere Übergänge', 'Foyer, Garten, Terrasse, Restaurant oder Lounge', 'Der Suchintent ist nicht Zeremonie, sondern Atmosphäre über längere Zeit.', 'Ich plane mehrere kurze Sets, damit Musik präsent bleibt und trotzdem Pausen für Gespräche entstehen.', 'Gute Hintergrundmusik ist nicht egal. Sie braucht Klangkontrolle, Blick für die Gäste und flexible Übergänge.'],
	'hochzeitsfeier': ['Musik für Hochzeitsfeier', 'Feier', 'Musik für die Hochzeitsfeier, vom offiziellen Moment bis zum lockeren Ankommen.', 'Feiern nach der Trauung, Empfänge und Abendessen', 'Restaurant, Saal, Garten oder private Feierlocation', 'Hier geht es weniger um die Zeremonie und stärker um Atmosphäre, Gäste und Übergänge.', 'Solo-Viola kann Gratulationen, Empfang, Dinner oder einen kurzen persönlichen Moment verbinden.', 'Für die spätere Party ersetzt sie keine Tanzband, aber sie veredelt die leisen und offiziellen Teile.'],
	'hochzeitsmusik-buchen': ['Hochzeitsmusik buchen', 'Buchen', 'Hochzeitsmusik buchen, wenn Datum, Ort und musikalische Momente langsam konkret werden.', 'Paare mit konkreter Anfrage und Buchungsabsicht', 'Trauung, Empfang, Dinner oder Paket aus mehreren Einsätzen', 'Diese Seite ist kommerziell: Sie soll klären, was ihr für eine Anfrage braucht und wie die Planung weitergeht.', 'Datum, Ort, Zeremonieform, Wunschlied und gewünschte Einsatzpunkte reichen für den ersten Schritt.', 'Buchen heißt nicht sofort festlegen. Zuerst prüfen wir Verfügbarkeit, Klangvorstellung und Ablauf.'],
	'hochzeitsmusikerin': ['Hochzeitsmusikerin', 'Musikerin', 'Eine Hochzeitsmusikerin für Paare, die direkten Kontakt und klare Planung möchten.', 'Paare, Trauredner:innen und Familien, die Solo-Musik buchen möchten', 'Trauung, Standesamt, Kirche, Empfang oder Dinner', 'Der Suchintent liegt auf der Person: Wer spielt, wie wird geplant, wie persönlich ist der Kontakt?', 'Ich begleite euch von der Stückauswahl bis zum Einsatzsignal und halte die Abstimmung schlank.', 'Eine einzelne Musikerin ist besonders passend, wenn Musik nah wirken und organisatorisch unkompliziert bleiben soll.'],
	'instrumentalmusik-hochzeit': ['Instrumentalmusik Hochzeit', 'Instrumental', 'Instrumentalmusik zur Hochzeit, wenn Melodien wirken sollen, ohne Worte zu brauchen.', 'Trauungen, Empfänge und Dinner mit ruhiger musikalischer Linie', 'Zeremonie, Standesamt, Kirche, Garten oder Restaurant', 'Instrumentalmusik passt, wenn Texte nicht ablenken sollen oder ein Song ohne Gesang persönlicher wirkt.', 'Solo-Viola kann bekannte Melodien so spielen, dass der emotionale Kern erhalten bleibt.', 'Der Vorteil liegt in der Flexibilität: Ein Stück kann verlängert, gekürzt oder im richtigen Moment gelöst werden.'],
	'klassische-musik-hochzeit': ['Klassische Musik Hochzeit', 'Klassisch', 'Klassische Musik zur Hochzeit, festlich, vertraut und sorgfältig dosiert.', 'Paare, die einen zeitlosen Klang für Trauung oder Empfang möchten', 'Kirche, Standesamt, freie Trauung oder Schlossambiente', 'Der Fokus liegt auf Stücken wie Pachelbel, Bach, Massenet oder Elgar, aber nicht auf einem steifen Konzertprogramm.', 'Klassische Musik wird nach Tempo, Länge und emotionaler Aufgabe ausgesucht.', 'Auch Klassiker brauchen Anpassung an Weglänge, Akustik und Zeremonieform.'],
	'live-instrumentalmusik-hochzeit': ['Live Instrumentalmusik Hochzeit', 'Live instrumental', 'Live-Instrumentalmusik zur Hochzeit, die auf echte Momente reagieren kann.', 'Paare, die bewusst live statt Playlist planen', 'Einzug, Ja-Wort, Ringtausch, Auszug, Empfang oder Dinner', 'Der Live-Aspekt ist entscheidend: Tempo, Länge und Einsatz können auf den Ablauf reagieren.', 'Wenn Ringe länger dauern oder Gäste noch stehen, kann Musik atmen und den Moment halten.', 'Live-Instrumentalmusik ist besonders stark, wenn der Ablauf emotional, aber nicht starr sein soll.'],
	'live-musik-hochzeit-buchen': ['Live Musik Hochzeit buchen', 'Live buchen', 'Live-Musik zur Hochzeit buchen, mit klarer Planung statt Bauchgefühl allein.', 'Paare kurz vor Anfrage oder Entscheidung', 'Trauung, Empfang, Dinner oder Kombination mehrerer Teile', 'Diese Seite verbindet Buchungsintention mit Live-Musik: Was braucht es, damit die Anfrage sinnvoll beantwortet werden kann?', 'Ich prüfe Datum, Ort, Dauer, Wunschlied und die gewünschte Rolle der Musik.', 'Live buchen heißt auch: rechtzeitig klären, ob Außenmusik, Technik oder Absprachen mit Kirche und Location nötig sind.'],
	'live-musik-hochzeit': ['Live Musik Hochzeit', 'Live-Musik', 'Live-Musik zur Hochzeit, die den Ablauf begleitet und nicht nur eine Playlist ersetzt.', 'Paare, die echte musikalische Präsenz für ihren Tag suchen', 'Zeremonie, Empfang, Dinner und persönliche Übergänge', 'Der Suchintent ist breit, aber klar: Live-Musik soll die Hochzeit spürbar persönlicher machen.', 'Solo-Viola ist flexibel genug für kleine Trausäle und präsent genug für festliche Räume.', 'Entscheidend ist die Dramaturgie: Wann beginnt Musik, wann trägt sie, wann macht sie wieder Platz?'],
	'moderne-hochzeitsmusik': ['Moderne Hochzeitsmusik', 'Modern', 'Moderne Hochzeitsmusik auf Solo-Viola, persönlich ohne Pop-Show.', 'Paare mit Lieblingssongs, Filmmusik oder aktuellen Balladen', 'Einzug, Auszug, Ringtausch, Empfang oder Dinner', 'Moderne Musik lebt von Wiedererkennung. Auf Viola muss sie so arrangiert werden, dass Melodie und Gefühl bleiben.', 'Ich prüfe Tonart, Länge und ob ein Refrain, Intro oder Ausschnitt am besten funktioniert.', 'Nicht jeder Song braucht die volle Länge. Oft wirkt ein präziser Ausschnitt stärker als eine komplette Fassung.'],
	'musik-auszug': ['Musik Auszug Hochzeit', 'Auszug', 'Musik zum Auszug, wenn aus der Trauung der erste gemeinsame Schritt wird.', 'Paare, die den Jubel nach Ja-Wort oder Segen musikalisch öffnen möchten', 'Standesamt, Kirche, freie Trauung oder Gartenauszug', 'Der Auszug braucht andere Energie als der Einzug: heller, freier und mit mehr Bewegung.', 'Das Stück muss schnell genug Freude geben und gleichzeitig lang genug für Weg, Gratulation und Fotos bleiben.', 'Ich plane den Schluss so, dass die Musik nicht abrupt endet, wenn der Weg länger oder kürzer wird.'],
	'musik-brauteinzug': ['Musik Brauteinzug', 'Brauteinzug', 'Musik zum Brauteinzug, die dem Raum Zeit zum Stillwerden gibt.', 'Einzug der Braut, des Bräutigams oder des Brautpaares', 'Kirche, Standesamt, freie Trauung oder Außenzeremonie', 'Beim Brauteinzug schauen alle in dieselbe Richtung. Die Musik muss tragen, aber nicht ziehen.', 'Tempo und Länge werden nach Weg, Türen, Treppe und geplantem Startsignal gewählt.', 'Ein Wunschlied kann sehr stark wirken, wenn es als Solo-Viola-Fassung genug Ruhe für den Weg lässt.'],
	'musik-brautpaar': ['Musik für Brautpaar', 'Brautpaar', 'Musik für das Brautpaar, wenn ein Stück wirklich zu euch gehören soll.', 'Paare mit persönlichem Lied, gemeinsamer Geschichte oder besonderem Moment', 'Trauung, Geschenk, Sektempfang oder kurzer privater Augenblick', 'Hier steht nicht der allgemeine Ablauf im Mittelpunkt, sondern eure Beziehung und ein musikalischer Bezug.', 'Ein Lieblingslied kann als roter Faden wiederkehren oder nur an einer Stelle bewusst erklingen.', 'Die Musik sollte nicht erklären, wer ihr seid, sondern den Moment öffnen, in dem alle es spüren.'],
	'musik-freie-trauung': ['Musik freie Trauung', 'Freie Trauung', 'Musik für die freie Trauung, flexibel, persönlich und eng am Ablauf.', 'freie Trauungen mit Trauredner:in, Ritualen und eigenen Texten', 'Garten, Hof, Schloss, Terrasse oder Eventlocation', 'Freie Trauungen brauchen musikalische Übergänge zwischen Texten, Ritualen und persönlichen Momenten.', 'Ich stimme Einsätze mit Trauredner:in oder Planungsperson ab, damit Musik organisch entsteht.', 'Gerade draußen sind Wetter, Schatten, Abstand und akustische Nähe wichtige Planungsdetails.'],
	'musik-hochzeitsdinner': ['Musik Hochzeitsdinner', 'Hochzeitsdinner', 'Musik zum Hochzeitsdinner, dezent zwischen Menü, Reden und Gesprächen.', 'sitzende Hochzeitsessen und festliche Abendessen', 'Restaurant, Saal, Schloss, Terrasse oder privater Raum', 'Beim Dinner darf Musik nie gegen Gespräche oder Service arbeiten.', 'Mehrere kurze Sets zwischen Gängen, Toasts oder Reden sind meist eleganter als Dauerbegleitung.', 'Die Viola kann den Raum wärmen und trotzdem leise genug bleiben, damit Tische miteinander sprechen.'],
	'musik-hochzeitsempfang': ['Musik Hochzeitsempfang', 'Empfang', 'Musik zum Hochzeitsempfang, wenn Gäste ankommen und Glückwünsche beginnen.', 'Sektempfang, Gratulationen, Foyer oder Gartenempfang', 'Terrasse, Innenhof, Restaurant, Schloss oder Locationeingang', 'Der Empfang ist oft unruhig: Gäste begrüßen sich, Fotos entstehen, Gläser werden gereicht.', 'Live-Viola gibt dieser Phase einen Rahmen, ohne alle in eine Konzert-Situation zu zwingen.', 'Wichtig sind flexible Setlängen, kurze Pausen und ein Platz, an dem der Klang hörbar bleibt.'],
	'musik-hochzeitszeremonie': ['Musik Hochzeitszeremonie', 'Zeremonie', 'Musik für die Hochzeitszeremonie, als roter Faden vom Beginn bis zum Auszug.', 'Zeremonien mit mehreren musikalischen Punkten', 'Standesamt, Kirche, freie Trauung oder Outdoor-Zeremonie', 'Diese Seite bündelt die gesamte Zeremonie: Einzug, Ringe, Ja-Wort, Unterschrift, Auszug.', 'Ich plane nicht nur einzelne Stücke, sondern die Übergänge zwischen ihnen.', 'Eine Zeremonie wirkt ruhiger, wenn Musik an wenigen klaren Stellen sitzt, statt überall etwas zu füllen.'],
	'musik-ja-wort': ['Musik Ja-Wort', 'Ja-Wort', 'Musik zum Ja-Wort, leise genug für Worte und stark genug für den Moment danach.', 'Paare, die den zentralen Moment musikalisch rahmen möchten', 'freie Trauung, Standesamt oder Kirche', 'Beim Ja-Wort darf Musik nicht im Weg stehen. Oft liegt der beste Einsatz direkt danach oder in einer stillen Phase.', 'Ich plane mit euch, ob Musik vor, während oder nach dem Versprechen sinnvoll ist.', 'Der Moment braucht sehr genaue Lautstärke und ein Stück, das Emotion hält, ohne Aufmerksamkeit wegzunehmen.'],
	'musik-kirchliche-trauung': ['Musik kirchliche Trauung', 'Kirche', 'Musik für die kirchliche Trauung, abgestimmt mit Liturgie, Raum und Akustik.', 'kirchliche Hochzeiten mit Einzug, Segen, Ringen und Auszug', 'Kirche, Kapelle oder sakraler Raum', 'Kirchliche Trauungen haben feste Punkte. Musik muss in Liturgie und Akustik passen.', 'Ich kläre Stückauswahl, Einsatz und mögliche Vorgaben mit euch und bei Bedarf mit der Kirche.', 'Die Viola klingt in Kirchen warm und tragfähig, braucht aber wegen Hall und Raumgröße eine ruhige Planung.'],
	'musik-nach-ja-wort': ['Musik nach Ja-Wort', 'Nach dem Ja-Wort', 'Musik nach dem Ja-Wort, wenn der Moment kurz stehen bleiben darf.', 'Paare, die nach dem Versprechen einen ruhigen musikalischen Atemzug möchten', 'Standesamt, freie Trauung oder Kirche', 'Nach dem Ja-Wort ist oft ein kurzer stiller Raum da. Musik kann diesen Augenblick halten.', 'Das Stück sollte nicht zu groß beginnen, sondern den Moment aufnehmen und langsam lösen.', 'Diese Seite grenzt sich vom allgemeinen Ja-Wort ab: Der Fokus liegt auf dem Danach, nicht auf dem gesprochenen Satz.'],
	'musik-ringtausch': ['Musik Ringtausch', 'Ringtausch', 'Musik zum Ringtausch, fein, ruhig und flexibel im Timing.', 'Ringtausch, Segenshandlung oder stiller Zeremoniepunkt', 'Trausaal, Kirche, freie Trauung oder Garten', 'Beim Ringtausch kann die Länge variieren. Live-Musik ist hier besonders hilfreich.', 'Ich wähle Stücke, die sich natürlich verlängern oder kürzen lassen.', 'Die Musik bleibt leise genug für Worte und Bewegungen, aber präsent genug, damit der Moment nicht organisatorisch wirkt.'],
	'musik-schloss-hochzeit': ['Musik Schloss Hochzeit', 'Schloss', 'Musik für die Schloss-Hochzeit, festlich im Raum und trotzdem persönlich.', 'Trauungen und Empfänge in Schloss, Villa oder historischem Saal', 'Schlosssaal, Innenhof, Park, Kapelle oder Dinnerraum', 'Schlosslocations verlangen oft nach Eleganz, aber nicht nach steifem Programm.', 'Klassische Stücke und moderne Lieblingslieder können so kombiniert werden, dass der Ort trägt und ihr erkennbar bleibt.', 'Wichtig sind Wege, Akustik, Fotomomente und die Frage, ob Musik draußen oder im Saal beginnt.'],
	'musik-standesamt': ['Musik Standesamt Hochzeit', 'Standesamt', 'Musik im Standesamt, kurz, präzise und emotional auf den Ablauf abgestimmt.', 'standesamtliche Trauungen mit wenig Zeit und klaren Programmpunkten', 'Trausaal, Rathaus, Außenstelle oder kleiner Saal', 'Im Standesamt sind Zeitfenster oft knapp. Musik muss genau sitzen.', 'Typisch sind Einzug, Unterschrift, Ringtausch oder Auszug, je nachdem was die Standesbeamtin zulässt.', 'Ein Solo-Instrument ist hier praktisch, weil Aufbau und Lautstärke unkompliziert bleiben.'],
	'musik-unterschrift-standesamt': ['Musik Unterschrift Standesamt', 'Unterschrift', 'Musik während der Unterschrift, damit der formale Moment nicht leer wirkt.', 'standesamtliche Trauungen mit kurzer organisatorischer Phase', 'Trausaal, Rathaus oder Außenstelle', 'Die Unterschrift ist formal, aber sie gehört emotional zur Trauung. Musik hält die Atmosphäre.', 'Das Stück muss kurz, flexibel und ruhig sein, weil die Dauer schwer exakt planbar ist.', 'Ich plane diesen Moment so, dass keine peinliche Stille entsteht und trotzdem nichts überladen wirkt.'],
	'musik-waehrend-trauung': ['Musik während Trauung', 'Während der Trauung', 'Musik während der Trauung, punktgenau zwischen Worten, Ritualen und Stille.', 'Trauungen mit mehreren kurzen musikalischen Einsätzen', 'freie Trauung, Kirche oder Standesamt', 'Hier geht es um Zwischenmomente: Ritual, Lesung, Kerze, Ringsegnung oder kurze Pause.', 'Musik darf nicht überall sein. Sie braucht eine klare dramaturgische Aufgabe.', 'Ich helfe euch zu entscheiden, welche Stellen Musik wirklich brauchen und welche besser still bleiben.'],
	'musik-zur-trauung': ['Musik zur Trauung', 'Trauung', 'Musik zur Trauung, als klarer musikalischer Bogen für eure Zeremonie.', 'Paare, die Einzug, Ringe, Ja-Wort und Auszug zusammen planen möchten', 'Standesamt, Kirche, freie Trauung oder Gartenzeremonie', 'Diese Seite ist der Hauptintent für Zeremonie-Musik und bündelt mehrere Momente.', 'Wir legen fest, welche Stücke wann beginnen, wie lang sie sein dürfen und wer das Startsignal gibt.', 'Gute Trauungsmusik verbindet die Punkte, statt jeden Moment isoliert zu behandeln.'],
	'musikerin-hochzeit': ['Musikerin Hochzeit', 'Musikerin', 'Eine Musikerin zur Hochzeit, wenn Live-Musik persönlich und unkompliziert sein soll.', 'Paare, die eine einzelne Musikerin für Trauung oder Empfang suchen', 'Zeremonie, Standesamt, freie Trauung, Empfang oder Dinner', 'Der Suchintent ist personenbezogen, aber weniger spezifisch als Bratschistin oder Geigerin.', 'Ich begleite euch mit direkter Abstimmung, Wunschliedprüfung und klarer Planung am Hochzeitstag.', 'Eine Solo-Musikerin passt besonders gut, wenn Musik nah wirken und organisatorisch schlank bleiben soll.'],
	'romantische-hochzeitsmusik': ['Romantische Hochzeitsmusik', 'Romantisch', 'Romantische Hochzeitsmusik, die Gefühl zulässt und trotzdem elegant bleibt.', 'Einzug, Ringtausch, Ja-Wort und persönliche Lieblingslieder', 'Trauung, Kirche, freie Zeremonie oder Empfang', 'Romantik braucht Maß. Zu viel Pathos kann einen echten Moment kleiner machen.', 'Ich wähle Stücke, die warm, singbar und nicht überladen wirken.', 'Ein romantischer Klang entsteht durch Tempo, Phrasierung und Pausen, nicht durch Lautstärke.'],
	'sektempfang': ['Musik Sektempfang Hochzeit', 'Sektempfang', 'Musik zum Sektempfang, wenn Gratulationen, Fotos und erste Gespräche zusammenkommen.', 'Empfang direkt nach Trauung oder vor dem Dinner', 'Foyer, Garten, Terrasse, Innenhof oder Schlosspark', 'Der Sektempfang ist lebendig und oft etwas unübersichtlich. Musik schafft einen feierlichen Rahmen.', 'Solo-Viola kann zwischen Gratulationen, Fotos und Gesprächen flexibel in Sets spielen.', 'Wichtig ist, dass die Musik hörbar bleibt, ohne aus dem Empfang ein Konzert zu machen.'],
	'solo-musikerin-hochzeit': ['Solo Musikerin Hochzeit', 'Solo', 'Solo-Musikerin zur Hochzeit, reduziert, flexibel und nah am Moment.', 'kleinere Trauungen, intime Feiern und Paare mit klarer musikalischer Linie', 'Standesamt, freie Trauung, Kirche, Empfang oder Dinner', 'Solo bedeutet: wenig Aufbau, direkter Klang und flexible Reaktion auf den Ablauf.', 'Die Viola kann ohne Technik sehr nah wirken und trotzdem einen festlichen Raum öffnen.', 'Eine Solo-Musikerin ist ideal, wenn die Musik persönlich sein soll, aber kein großes Ensemble gebraucht wird.'],
	'streicherin-hochzeit': ['Streicherin Hochzeit', 'Streicherin', 'Eine Streicherin zur Hochzeit, wenn ihr Solo-Streichklang statt Band sucht.', 'Paare, die nach Geige, Viola oder allgemeinem Streichinstrument suchen', 'Einzug, Trauung, Empfang oder Dinner', 'Der Begriff Streicherin ist breiter als Bratschistin und fokussiert das musikalische Format.', 'Ich erkläre, welche Stücke auf Solo-Viola gut funktionieren und wie der Klang im Raum trägt.', 'Der Vorteil liegt in der Mischung aus Eleganz, Wärme und unkomplizierter Planung.'],
	'streichmusik-hochzeit': ['Streichmusik Hochzeit', 'Streichmusik', 'Streichmusik zur Hochzeit, festlich, warm und als Solo-Viola sehr persönlich.', 'Trauungen, Empfänge und Dinner mit klassischem oder modernem Rahmen', 'Kirche, Standesamt, freie Trauung, Schloss oder Garten', 'Streichmusik muss nicht automatisch Quartett heißen. Solo-Viola kann den Kern sehr konzentriert tragen.', 'Klassische Melodien, moderne Songs und persönliche Wunschstücke werden passend eingerichtet.', 'Diese Seite grenzt Streichmusik von allgemeiner Live-Musik ab: Es geht um Klangfarbe, Bogen und Melodie.'],
	'viola-hochzeit': ['Viola Hochzeit', 'Viola', 'Viola zur Hochzeit, wenn ihr einen warmen Streicherklang sucht.', 'Paare, die gezielt den Klang der Viola mögen oder entdecken möchten', 'Trauung, Ringtausch, Ja-Wort, Auszug, Empfang oder Dinner', 'Diese Seite erklärt die Viola als eigenes Instrument, nicht als Ersatzbegriff.', 'Der warme, mittlere Klang passt gut zu Stimmen, kleinen Räumen und emotionalen Momenten.', 'Viola zur Hochzeit ist besonders stark, wenn Musik nah und elegant statt hell und virtuos wirken soll.'],
	'violinistin-hochzeit': ['Violinistin Hochzeit', 'Violinistin', 'Violinistin zur Hochzeit gesucht, transparent als Solo-Viola mit Streicherklang geplant.', 'Suchende, die eine einzelne Streicherin für ihre Hochzeit suchen', 'Zeremonie, Empfang, Dinner oder Wunschliedmoment', 'Der Begriff Violinistin wird häufig für Streicherin gesucht. Ich ordne klar ein, dass ich Viola spiele.', 'Viele Stücke, die als Violinmusik bekannt sind, funktionieren auf Viola wärmer und intimer.', 'Entscheidend ist nicht das Etikett, sondern ob Klang, Ablauf und Stücke zu euch passen.'],
};

const TOPIC_CONTENT_OVERRIDES = {
	'musik-ja-wort': {
		split: {
			eyebrow: 'Kernmoment',
			title: 'Musik zum Ja-Wort braucht Zurückhaltung vor dem entscheidenden Satz.',
			lede: 'Beim Ja-Wort steht nicht das Instrument im Mittelpunkt, sondern die Stimme des Paares. Die Musik wird deshalb so geplant, dass sie vor dem Versprechen sammelt, danach trägt und während der Worte keine Aufmerksamkeit abzieht.',
			paragraphs: [
				'Diese Seite behandelt den Moment rund um den gesprochenen Satz: Wann entsteht Stille, wann darf ein Ton beginnen, und wie bleibt der Raum aufmerksam, ohne dass Musik die Worte kommentiert?',
				'Bei einer freien Trauung kann ein kurzes musikalisches Motiv vor dem Versprechen helfen, den Raum zu beruhigen. Im Standesamt ist oft eher der Augenblick nach der Antwort geeignet. In der Kirche hängt es stärker von Liturgie, Segen und Akustik ab.',
				'Ich plane kein dauerhaftes Unterlegen der Stimmen. Gerade beim Ja-Wort ist Stille oft die stärkere Entscheidung, weil alle hören sollen, was ihr einander versprecht.',
				'Wenn Musik eingesetzt wird, braucht sie ein klares Signal: ein Blick der Traurednerin, eine kurze Pause nach der Frage oder ein festgelegter Satz im Ablauf. So entsteht kein unsicherer Einsatz mitten im wichtigsten Moment.',
				'Das Repertoire bleibt bewusst konzentriert. Geeignet sind ruhige Linien, klare Melodien und Stücke, die schnell Atmosphäre schaffen, ohne sich nach großer Szene anzufühlen.',
				'Die Viola kann diesen Moment warm rahmen, weil ihr Klang nah an der menschlichen Stimme bleibt. Sie nimmt dem Raum die Leere, ohne die Aufmerksamkeit vom Brautpaar wegzuziehen.',
				'Abgegrenzt wird diese Seite von Musik nach dem Ja-Wort: Dort geht es um den gelösten Augenblick danach. Hier geht es um die Frage, wie Musik den gesprochenen Kern des Versprechens schützt.',
				'Für die Planung frage ich deshalb sehr konkret nach Ablauf, Wortlaut, Position im Raum und dem gewünschten Gefühl: still, getragen, sehr privat oder sichtbar feierlich.',
			],
		},
		focus: {
			eyebrow: 'Feinabstimmung',
			title: 'Die richtige Stelle für Musik rund um das Ja-Wort.',
			lead: 'Der musikalische Einsatz wird enger geplant als bei Einzug oder Auszug, weil wenige Sekunden über die Wirkung entscheiden.',
			items: [
				{
					time: 'Davor',
					kicker: 'Sammlung',
					title: 'Ein kurzer Klang vor dem Versprechen',
					text: 'Ein ruhiger Einstieg kann helfen, bevor die entscheidende Frage gestellt wird. Danach braucht der Raum oft bewusste Stille.',
				},
				{
					time: 'Während',
					kicker: 'Stille',
					title: 'Die Worte nicht überdecken',
					text: 'Während des Ja-Worts selbst bleibt Musik meist aus oder extrem reduziert, damit jede Antwort hörbar und unverstellt bleibt.',
				},
				{
					time: 'Signal',
					kicker: 'Ablauf',
					title: 'Einen eindeutigen Einsatzpunkt festlegen',
					text: 'Ein Blickzeichen oder ein Satz im Ablauf verhindert, dass die Musik zu früh in den Moment hineingeht.',
				},
				{
					time: 'Danach',
					kicker: 'Übergang',
					title: 'Nicht automatisch alles füllen',
					text: 'Nach dem Ja-Wort kann Musik einsetzen, muss es aber nicht. Manchmal wirkt ein kurzer stiller Blick stärker.',
				},
			],
			footnote: 'Musik zum Ja-Wort wird so geplant, dass der gesprochene Moment im Zentrum bleibt.',
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: 'FAQ zu Musik zum Ja-Wort',
			items: [
				{
					question: 'Soll während des Ja-Worts überhaupt Musik spielen?',
					answer: 'Meistens nicht durchgehend. Häufig ist es schöner, die Worte frei stehen zu lassen und Musik davor oder direkt danach einzusetzen.',
					open: true,
				},
				{
					question: 'Wie lang sollte das Stück sein?',
					answer: 'Für diesen Moment reichen oft wenige ruhige Takte. Wichtig ist ein flexibles Ende, weil Emotionen und Pausen nicht exakt planbar sind.',
				},
				{
					question: 'Wer gibt das Startsignal?',
					answer: 'Das kann die Traurednerin, eine Standesbeamtin, die Planungsperson oder ein vereinbartes Blickzeichen sein. Hauptsache, es ist eindeutig.',
				},
				{
					question: 'Kann ein persönliches Lied verwendet werden?',
					answer: 'Ja, wenn es in Tempo und Ausdruck nicht zu groß für diesen intimen Moment wirkt. Ich prüfe gern einen passenden Ausschnitt.',
				},
				{
					question: 'Unterscheidet sich das von Musik zum Ringtausch?',
					answer: 'Ja. Beim Ringtausch begleitet Musik oft eine Handlung. Beim Ja-Wort schützt sie eher den Raum um die gesprochenen Worte.',
				},
				{
					question: 'Passt das auch im Standesamt?',
					answer: 'Ja, aber dort sind Zeitfenster kürzer. Deshalb planen wir den Einsatz besonders präzise und stimmen ihn mit dem erlaubten Ablauf ab.',
				},
			],
		},
		contact: {
			eyebrow: 'Ja-Wort planen',
			title: 'Musik zum Ja-Wort anfragen',
			lead: 'Schickt mir Datum, Trauort, Zeremonieform und die Stelle, an der das Ja-Wort im Ablauf steht. Ich schlage euch einen musikalisch passenden Rahmen vor.',
			checklist: [
				'Ja-Wort im Ablauf',
				'Startsignal',
				'Wunschlied oder Stil',
			],
			formEyebrow: 'Anfrage senden',
			formTitle: 'Musik zum Ja-Wort anfragen',
			formSuccess: 'Danke - ich melde mich mit einer Idee für den Moment rund um euer Ja-Wort.',
		},
	},
	'musik-nach-ja-wort': {
		split: {
			eyebrow: 'Danach-Moment',
			title: 'Musik nach dem Ja-Wort fängt den gelösten Augenblick auf.',
			lede: 'Nach dem Ja-Wort verändert sich die Stimmung im Raum: Die Spannung löst sich, oft kommen Lächeln, Tränen, Applaus oder ein erster Kuss. Diese Seite behandelt genau diese kurze Phase nach dem Versprechen.',
			paragraphs: [
				'Der Einsatz beginnt nicht bei der Frage und auch nicht mitten in den Worten, sondern nachdem der entscheidende Satz gesprochen ist. Dadurch bekommt der Moment einen hörbaren Nachklang.',
				'Musikalisch eignet sich ein Stück, das leise beginnen kann und sich langsam öffnet. Es soll den Atemzug nach dem Versprechen verlängern, nicht die Szene sofort in Jubel verwandeln.',
				'In einer freien Trauung kann die Musik den Übergang zu Ringritual, Segen oder Rede schließen. Im Standesamt überbrückt sie manchmal den Weg zur Unterschrift. In der Kirche kann sie nach dem Versprechen einen stillen Andachtsraum schaffen.',
				'Wichtig ist das Ende: Der Klang darf nicht zu lange stehen bleiben, wenn danach ein organisatorischer Punkt folgt. Live gespielt kann die Länge flexibel angepasst werden.',
				'Ich achte darauf, ob Applaus gewünscht ist, ob ein Kuss eingeplant ist und ob Gäste direkt reagieren dürfen. Diese kleinen Details entscheiden, ob Musik trägt oder stört.',
				'Die Viola wirkt nach dem Ja-Wort besonders warm, weil sie das Gefühl nicht dramatisiert. Sie lässt Nähe zu und nimmt den Druck aus einem sehr emotionalen Moment.',
				'Diese Seite unterscheidet sich bewusst von Musik zum Ja-Wort. Dort steht der gesprochene Satz im Zentrum; hier geht es um den Klang danach, wenn die Antwort bereits im Raum steht.',
				'Für die Planung reicht oft ein kurzes Zeitfenster, aber es muss exakt verstanden sein: Wann beginnt das Danach, wer schaut mich an, und welcher nächste Programmpunkt folgt?',
			],
		},
		focus: {
			eyebrow: 'Übergang',
			title: 'Was direkt nach dem Ja-Wort musikalisch passieren kann.',
			lead: 'Der Moment danach ist kurz, aber sehr wirkungsvoll. Musik kann ihn halten, öffnen oder sanft in den nächsten Programmpunkt führen.',
			items: [
				{
					time: 'Sekunde 1',
					kicker: 'Antwort',
					title: 'Erst sprechen lassen',
					text: 'Die Musik setzt erst ein, wenn beide Antworten wirklich abgeschlossen sind und der Raum den Moment verstanden hat.',
				},
				{
					time: 'Atem',
					kicker: 'Nachklang',
					title: 'Leise beginnen und Raum geben',
					text: 'Ein zarter Anfang lässt Tränen, Lächeln oder Umarmung zu, ohne den Augenblick sofort zu groß zu machen.',
				},
				{
					time: 'Reaktion',
					kicker: 'Applaus',
					title: 'Gäste nicht ausbremsen',
					text: 'Wenn Applaus gewünscht ist, wird die Musik so gesetzt, dass sie Reaktion trägt und nicht gegen sie arbeitet.',
				},
				{
					time: 'Weiter',
					kicker: 'Nächster Punkt',
					title: 'Zur Unterschrift oder zum Ringritual führen',
					text: 'Das Stück kann flexibel enden, wenn der Ablauf weitergeht und wieder gesprochen wird.',
				},
			],
			footnote: 'Musik nach dem Ja-Wort wird als Übergang geplant, nicht als Hintergrund während des Versprechens.',
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: 'FAQ zu Musik nach dem Ja-Wort',
			items: [
				{
					question: 'Wann beginnt Musik nach dem Ja-Wort?',
					answer: 'Erst nachdem das Versprechen gesprochen ist. Der genaue Einsatz kann nach dem zweiten Ja, nach einem Kuss oder nach einem Blickzeichen erfolgen.',
					open: true,
				},
				{
					question: 'Wie unterscheidet sich das vom Ringtausch?',
					answer: 'Nach dem Ja-Wort geht es um den emotionalen Nachklang. Beim Ringtausch begleitet Musik eher eine konkrete Handlung.',
				},
				{
					question: 'Kann das Stück sehr kurz sein?',
					answer: 'Ja. Oft reichen 30 bis 90 Sekunden, wenn danach eine Unterschrift, ein Segen oder eine weitere Rede folgt.',
				},
				{
					question: 'Was passiert, wenn Gäste applaudieren?',
					answer: 'Live-Musik kann reagieren: leiser beginnen, Raum lassen oder den Applaus aufnehmen, statt starr darüber zu spielen.',
				},
				{
					question: 'Welche Stücke passen?',
					answer: 'Ruhige Balladen, warme klassische Linien oder ein persönliches Lied funktionieren gut, wenn sie nicht zu dramatisch starten.',
				},
				{
					question: 'Brauchen wir dafür eine eigene Planung?',
					answer: 'Ja, weil der Einsatzpunkt sehr fein ist. Ein klares Signal verhindert, dass Musik zu früh oder zu spät beginnt.',
				},
			],
		},
		contact: {
			eyebrow: 'Danach-Moment planen',
			title: 'Musik nach dem Ja-Wort anfragen',
			lead: 'Schickt mir Datum, Trauort und den Ablauf nach dem Versprechen: Kuss, Applaus, Ringe, Segen oder Unterschrift. Dann plane ich den passenden musikalischen Übergang.',
			checklist: [
				'Moment nach dem Ja-Wort',
				'Folgepunkt im Ablauf',
				'Wunschlied oder Stimmung',
			],
			formEyebrow: 'Anfrage senden',
			formTitle: 'Musik nach dem Ja-Wort anfragen',
			formSuccess: 'Danke - ich melde mich mit einer Idee für den Moment direkt nach eurem Ja-Wort.',
		},
	},
};

function applyTopicOverride(base, slug) {
	const override = TOPIC_CONTENT_OVERRIDES[slug];
	if (!override) return base;
	return {
		...base,
		...override,
		split: override.split ? { ...base.split, ...override.split } : base.split,
		focus: override.focus ? { ...base.focus, ...override.focus } : base.focus,
		faq: override.faq ? { ...base.faq, ...override.faq } : base.faq,
		contact: override.contact ? { ...base.contact, ...override.contact } : base.contact,
	};
}

function hash(value) {
	return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0);
}

function pick(slug, values, offset = 0) {
	return values[(hash(slug) + offset) % values.length];
}

function titleFromKeyword(keyword) {
	return keyword
		.replace(/\b\p{L}/gu, (char) => char.toLocaleUpperCase('de-DE'))
		.replace('Für', 'für')
		.replace('Zur', 'zur')
		.replace('Zum', 'zum')
		.replace('Während', 'während');
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
	const [label, areaPhrase, localFrame, venueFrame, logistics] = LOCATION_PROFILES[slug];
	const [locationNote, localFaqDetail] = LOCAL_DETAIL_NOTES[slug] ?? [
		`Für ${label} wird die Musik nach Ort, Raum und Ablauf geplant, damit der lokale Bezug nicht nur im Seitentitel steht.`,
		`Für ${label} klären wir Trauort, Wege, Startsignal und Wetterschutz, bevor die Stücke final festgelegt werden.`,
	];
	const keyword = `Hochzeitsmusik ${label}`;
	const ceremonyMood = pick(slug, [
		'ruhig und sehr persönlich',
		'festlich, aber nicht steif',
		'warm und nah an euren Gästen',
		'elegant, ohne den Ablauf zu überladen',
		'emotional mit genug Raum für Worte und Blicke',
	], 1);
	const repertoire = pick(slug, [
		'klassische Stücke, moderne Songs und ein persönliches Wunschlied',
		'Pachelbel, Bach, Filmmusik und moderne Balladen',
		'ein Wunschlied, ein festlicher Auszug und dezente Empfangsmusik',
		'ruhige Trauungsmusik, ein heller Auszug und leichte Musik für den Sektempfang',
	], 2);
	const planning = pick(slug, [
		'Ich plane lieber wenige klare Einsätze als zu viel Musik am Stück.',
		'Die Musik bekommt feste Momente, bleibt aber flexibel, falls sich der Ablauf verschiebt.',
		'Vorab klären wir, wer das Startsignal gibt und wann ein Stück enden darf.',
		'Die Sets werden so gesetzt, dass Reden, Ringe und Gratulationen nicht überdeckt werden.',
	], 3);
	const ceremonyDetail = pick(slug, [
		'Beim Einzug zählt Tempo, beim Ringtausch die Zurückhaltung, beim Auszug die Leichtigkeit.',
		'Ein Standesamt braucht kürzere Stücke als eine freie Trauung im Garten; eine Kirche braucht wegen der Akustik mehr Ruhe.',
		'Wenn Gäste aus mehreren Städten anreisen, hilft ein klarer musikalischer Beginn, damit der Tag sofort gesammelt wirkt.',
		'Ein Lieblingslied kann ein roter Faden sein, muss aber an der richtigen Stelle eingesetzt werden.',
	], 4);
	const localDifference = pick(slug, [
		'Die lokale Seite ist bewusst mehr als ein Ortsname: Der Weg zum Trauort, die Akustik und die Art eurer Feier verändern die musikalische Planung.',
		'Für Hochzeiten in dieser Region denke ich neben der Stückliste immer auch an Wege, Wetter und die Frage, wie nah die Musik an euch stehen soll.',
		'Ortsbezug bedeutet hier nicht Dekoration, sondern praktische Planung: Wo beginnt der Einzug, wie laut darf Musik sein, und wo ist der beste Platz für die Viola?',
		'Gerade lokale Hochzeitsmusik soll nicht wie eine kopierte Vorlage wirken. Der Ablauf wird auf euren Trauort, eure Gäste und eure Wunschmomente abgestimmt.',
	], 5);
	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Live-Viola`,
		seoDescription: `${keyword}: Solo-Viola für Trauung, Einzug, Auszug, Empfang und Dinner. Persönlich geplant.`,
		hero: {
			eyebrow: `Hochzeit ${areaPhrase}`,
			title: `Hochzeitsmusik ${areaPhrase}, die eure Trauung persönlich trägt.`,
			lead: `Ob Standesamt, freie Trauung, Kirche oder Empfang: Ich begleite Hochzeiten ${areaPhrase} mit Solo-Viola, abgestimmt auf Ort, Ablauf und eure wichtigsten Momente.`,
			badge: 'Erstgespräch kostenlos & unverbindlich',
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Live-Musik zur Hochzeit ${areaPhrase} braucht mehr als eine schöne Stückliste.`,
			lede: `${label} bedeutet für Hochzeiten oft: ${localFrame}. Deshalb plane ich Hochzeitsmusik nicht pauschal, sondern nach Trauort, Weglänge, Raumklang und der Frage, welche Momente wirklich Musik brauchen.`,
			paragraphs: [
				`Typische Rahmen sind ${venueFrame}. Dort wirkt die Viola besonders gut, wenn sie gezielt eingesetzt wird: zum Einzug, während der Zeremonie, beim Ringtausch, zur Unterschrift, zum Auszug oder beim Sektempfang.`,
				`Der Klang soll ${ceremonyMood} sein. Solo-Viola bleibt nah an der menschlichen Stimme, braucht wenig Aufbau und kann auch in kleineren Trausälen oder draußen sehr präsent wirken.`,
				`${planning} So entsteht kein beliebiger Musikblock, sondern ein roter Faden vom ersten Blick bis zum Moment, in dem Gratulationen und Empfang beginnen.`,
				`Für ${label} kläre ich vorab auch die praktischen Details: ${logistics}. Das klingt nüchtern, entscheidet aber oft darüber, ob Musik am Hochzeitstag ruhig beginnt oder unter Zeitdruck steht.`,
				`${ceremonyDetail} Deshalb wählen wir nicht nur Stücke aus, sondern ordnen sie einem konkreten Punkt im Ablauf zu.`,
				`Das Repertoire kann ${repertoire} verbinden. Wichtig ist, dass die Musik zu euch passt und nicht nur zu einer allgemeinen Vorstellung von Hochzeit.`,
				localDifference,
				locationNote,
				`Wenn mehrere Teile begleitet werden sollen, plane ich die Übergänge bewusst: ein ruhiger Einzug, ein stillerer Moment für Ringe oder Ja-Wort, ein heller Auszug und danach leichtere Musik für Empfang oder Dinner.`,
			],
			seal: `${label}\nTrauung & Empfang\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Ablauf',
			title: `So kann Hochzeitsmusik ${areaPhrase} eingebunden werden.`,
			lead: 'Die genaue Dramaturgie richtet sich nach Trauort, Zeremonieform und Gästen. Diese vier Einsatzpunkte funktionieren bei vielen Hochzeiten besonders gut.',
			items: [
				{
					time: 'Beginn',
					kicker: 'Einzug',
					title: `Einzug ${areaPhrase} mit ruhigem musikalischem Start`,
					text: 'Das Stück gibt dem Weg Zeit und sammelt den Raum, bevor die ersten Worte der Trauung beginnen.',
					piece: 'z. B. Canon in D oder Wunschlied',
				},
				{
					time: 'Mitte',
					kicker: 'Versprechen',
					title: 'Musik für Ringtausch, Ja-Wort oder Unterschrift',
					text: 'Leise, flexible Musik hält die Atmosphäre, ohne Worte, Blicke oder Bewegungen zu überdecken.',
					piece: 'z. B. Meditation oder ruhige Ballade',
				},
				{
					time: 'Jubel',
					kicker: 'Auszug',
					title: 'Ein heller Auszug nach der Trauung',
					text: 'Der Auszug darf freier und leichter klingen, weil aus der Zeremonie der erste gemeinsame Schritt wird.',
					piece: 'z. B. Salut d’Amour oder modernes Arrangement',
				},
				{
					time: 'Danach',
					kicker: 'Empfang',
					title: 'Dezente Musik für Gratulationen und Sektempfang',
					text: 'Kurze Sets schaffen Atmosphäre, während Gäste ankommen, gratulieren, fotografieren und ins Gespräch gehen.',
				},
			],
			footnote: `Für Hochzeiten ${areaPhrase} stimme ich Stücke, Startsignale und Setlängen persönlich mit euch ab.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Hochzeitsmusik ${areaPhrase}`,
			items: [
				{
					question: `Spielst du Hochzeitsmusik ${areaPhrase}?`,
					answer: `Ja. Ich begleite Hochzeiten ${areaPhrase} mit Solo-Viola, je nach Ablauf für Trauung, Einzug, Ringtausch, Auszug, Sektempfang oder Dinner.`,
					open: true,
				},
				{
					question: 'Passt Viola zu Standesamt, Kirche und freier Trauung?',
					answer: 'Ja. Die Viola klingt warm, elegant und nah. Sie funktioniert in kleinen Trausälen ebenso wie in Kirchen, Gärten und festlichen Räumen.',
				},
				{
					question: `Was ist bei Hochzeitsmusik ${areaPhrase} besonders wichtig?`,
					answer: localFaqDetail,
				},
				{
					question: 'Können wir unser Wunschlied einbinden?',
					answer: `Sehr gern. Ich prüfe Tonart, Länge und Wirkung und richte das Stück so ein, dass es für Solo-Viola und euren Ablauf ${areaPhrase} passt.`,
				},
				{
					question: 'Ist Musik draußen möglich?',
					answer: 'Ja, wenn Wetter, Untergrund und Schutz für das Instrument stimmen. Eine Innenoption oder ein überdachter Platz gibt Sicherheit.',
				},
				{
					question: 'Wie früh sollten wir anfragen?',
					answer: `Für Hochzeiten ${areaPhrase} lohnt sich eine frühe Anfrage, besonders für Samstage in der Saison. Wenn Datum und Ort feststehen, könnt ihr unverbindlich schreiben.`,
				},
				{
					question: 'Was brauchst du am Hochzeitstag vor Ort?',
					answer: 'Einen sicheren Platz, etwas Ruhe zum Stimmen, klare Startsignale und eine Kontaktperson, falls sich Ablauf oder Timing spontan verschieben.',
				},
			],
		},
		contact: {
			eyebrow: 'Hochzeit anfragen',
			title: `Hochzeitsmusik ${areaPhrase} anfragen`,
			lead: `Schickt mir Datum, Trauort ${areaPhrase}, Zeremonieform und eure Wunschmomente. Ich melde mich mit einer passenden musikalischen Idee für euren Tag und prüfe dabei auch die lokalen Details vor Ort.`,
			checklist: [
				label,
				'Trauung oder Empfang',
				'Wunschlied',
			],
			formEyebrow: 'Details senden',
			formTitle: `Hochzeitsmusik ${areaPhrase} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für eure Hochzeitsmusik ${areaPhrase}.`,
		},
		imageAltBase: `Live-Viola als Hochzeitsmusik ${areaPhrase}`,
	};
}

function buildTopic(slug) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const [keyword, eyebrow, title, audience, room, intent, repertoire, distinction, practical] = profile;
	const keywordTitle = titleFromKeyword(keyword);
	const practicalNote = practical ?? `Für ${keyword} klären wir vorab, welcher Programmpunkt wirklich gemeint ist und wie lange die Musik dort wirken soll.`;
	const planning = pick(slug, [
		'Vorab klären wir Startsignal, gewünschte Länge, mögliche Pausen und den Punkt, an dem das Stück natürlich enden darf.',
		'Ich plane den Einsatz so, dass die Musik weder zu früh beginnt noch den Moment unnötig verlängert.',
		'Wenn ein Wunschlied geplant ist, prüfe ich Melodie, Tonart und Wirkung für Solo-Viola.',
		'Die Musik bekommt eine klare Aufgabe im Ablauf, damit sie nicht wie eine zufällige Einlage wirkt.',
	], 1);
	const boundary = pick(slug, [
		'Diese Seite grenzt den Suchbegriff bewusst von allgemeineren Hochzeitsseiten ab.',
		'Der Text ist auf diesen konkreten Intent zugeschnitten und nicht nur eine Variation der lokalen Seiten.',
		'So entsteht eine eigene Seite für den Suchbegriff, ohne dass sie mit der allgemeinen Hochzeitsmusik-Seite dieselbe Aufgabe übernimmt.',
		'Der Fokus bleibt eng genug, damit Paare sofort erkennen, ob diese Seite zu ihrer Frage passt.',
	], 2);
	const base = {
		targetKeyword: keyword,
		seoTitle: `${keywordTitle} | Live-Viola Hochzeit`,
		seoDescription: `${keyword}: Solo-Viola für Hochzeit, Trauung oder Empfang. Wunschlied, Timing und Ablauf persönlich geplant.`,
		hero: {
			eyebrow,
			title,
			lead: `${keywordTitle} richtet sich an ${audience}. Ich plane Solo-Viola so, dass Klang, Timing und Ablauf wirklich zu eurem Hochzeitstag passen.`,
			badge: 'Erstgespräch kostenlos & unverbindlich',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht eine eigene musikalische Planung.`,
			lede: `${intent} Gesucht wird kein austauschbarer Musikblock, sondern eine Lösung für ${room}.`,
			paragraphs: [
				`Am Anfang steht die Frage, welche Aufgabe die Musik übernehmen soll: sammeln, tragen, überleiten, feiern, beruhigen oder einen ganz persönlichen Bezug hörbar machen.`,
				repertoire,
				distinction,
				`${planning} Dadurch bleibt der Ablauf sicher, auch wenn ein Weg länger dauert, Gäste noch stehen oder ein emotionaler Moment mehr Zeit braucht.`,
				practicalNote,
				`Solo-Viola eignet sich dafür besonders gut, weil der Klang warm, direkt und beweglich bleibt. Sie braucht wenig Aufbau und kann in Trausaal, Kirche, Garten, Schloss, Restaurant oder Foyer unterschiedlich eingesetzt werden.`,
				`Wichtig ist, dass ${keyword} nicht isoliert geplant wird. Ein Stück verändert den Moment davor und danach: Ein Einzug braucht Stille, ein Ringtausch braucht Zurückhaltung, ein Auszug braucht Öffnung.`,
				`${boundary} Andere Seiten behandeln Ort, Buchung, Instrument oder einzelne Zeremonieformen; hier geht es genau um ${keyword}.`,
			],
			seal: `${eyebrow}\nHochzeit\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Planung',
			title: `Worauf es bei ${keywordTitle} ankommt.`,
			lead: 'Die Details unterscheiden sich je nach Zeremonie und Location. Diese Punkte sollten vor der Hochzeit sauber geklärt sein.',
			items: [
				{
					time: 'Vorab',
					kicker: 'Rolle',
					title: 'Die Aufgabe der Musik festlegen',
					text: `Bei ${keyword} klären wir zuerst, ob die Musik Mittelpunkt, Übergang, Hintergrund oder persönliches Zeichen sein soll.`,
				},
				{
					time: 'Stück',
					kicker: 'Repertoire',
					title: 'Klassisch, modern oder Wunschlied auswählen',
					text: 'Die Auswahl folgt nicht nur Geschmack, sondern auch Weglänge, Raumakustik und emotionaler Dichte.',
				},
				{
					time: 'Ablauf',
					kicker: 'Timing',
					title: 'Start und Ende sicher abstimmen',
					text: 'Ein Blickzeichen, eine Kontaktperson oder ein klares Stichwort verhindert Unsicherheit am Hochzeitstag.',
				},
				{
					time: 'Ort',
					kicker: 'Klang',
					title: 'Den Platz im Raum sinnvoll wählen',
					text: 'Die Viola soll hörbar und sichtbar sein, ohne Laufwege, Reden oder Gäste zu stören.',
				},
			],
			footnote: `${keywordTitle} wird mit euch passend zu Zeremonie, Location und Gästen geplant.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: [
				{
					question: `Für welche Hochzeit passt ${keyword}?`,
					answer: `${keywordTitle} passt besonders für ${audience}. Entscheidend ist, dass Musik eine klare Aufgabe im Ablauf bekommt.`,
					open: true,
				},
				{
					question: 'Kann ein Wunschlied gespielt werden?',
					answer: 'Ja, wenn die Melodie für Solo-Viola geeignet ist. Ich prüfe Tonart, Länge und Wirkung und schlage bei Bedarf einen passenden Ausschnitt vor.',
				},
				{
					question: 'Passt das auch zu Standesamt, Kirche und freier Trauung?',
					answer: 'Ja. Die genaue Planung unterscheidet sich je nach Ort, aber Solo-Viola ist für kleine Trausäle, Kirchen, freie Trauungen und Empfänge sehr flexibel.',
				},
				{
					question: 'Wie wird der Einsatz abgestimmt?',
					answer: 'Wir klären vorab Startsignal, Dauer, Platz im Raum, gewünschte Stimmung und mögliche Rückfragen mit Trauredner:in, Kirche, Standesamt oder Location.',
				},
				{
					question: 'Ist draußen spielen möglich?',
					answer: 'Ja, wenn Wetter, Schatten, Untergrund und Schutz für das Instrument stimmen. Ein Plan B ist bei Hochzeiten im Freien immer sinnvoll.',
				},
				{
					question: 'Wie früh sollten wir anfragen?',
					answer: 'Sobald Datum und Ort feststehen, ist eine Anfrage sinnvoll. Besonders Termine in der Hochzeitssaison sind oft früh vergeben.',
				},
			],
		},
		contact: {
			eyebrow: 'Hochzeitsmusik planen',
			title: `${keywordTitle} anfragen`,
			lead: `Schickt mir Datum, Ort, Zeremonieform und den Moment, für den ihr ${keyword} plant. Ich melde mich mit einer passenden musikalischen Idee.`,
			checklist: [
				keyword,
				'Trauung oder Empfang',
				'Wunschlied',
			],
			formEyebrow: 'Anfrage senden',
			formTitle: `${keywordTitle} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${keyword}.`,
		},
		imageAltBase: `Live-Viola für ${keyword}`,
	};
	return applyTopicOverride(base, slug);
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
