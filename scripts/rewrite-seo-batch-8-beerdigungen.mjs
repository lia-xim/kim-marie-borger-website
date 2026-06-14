import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'beerdigungen';
const STATUS = 'rewritten-batch-8-review-needed';
const BATCH_NOTE = 'Batch 8: Beerdigungsseiten vollständig nach Ort, Abschiedsform, Instrument und Lied-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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
	aachen: ['Aachen', 'in Aachen', 'Altstadt, historische Kirchen, Trauerhallen und Abschiede im Dreiländereck', 'Kapelle, Friedhof, Kirche oder freie Abschiedsfeier mit regionalem Einzugsgebiet', 'Anreise, Raumzugang und den ersten Einsatz mit genug Ruhe planen'],
	'bergisches-land': ['Bergisches Land', 'im Bergischen Land', 'Höhenlagen, kleine Orte, Friedhöfe und stille Abschiede zwischen Wupper und Dhünn', 'Trauerhalle, Kirche, Kapelle, Hof oder Abschied im kleinen Kreis', 'Wetter, Wege und einen geschützten Platz für das Instrument früh klären'],
	'bergisch-gladbach': ['Bergisch Gladbach', 'in Bergisch Gladbach', 'Bensberg, Refrath, Köln-Nähe und Abschiede am Rand des Bergischen Landes', 'Trauerhalle, Kirche, Friedhof oder freie Feier mit anschließender Begegnung', 'Stadtverkehr, Parken und kurze Wege zur Trauerhalle realistisch abstimmen'],
	bielefeld: ['Bielefeld', 'in Bielefeld', 'Altstadt, Friedhöfe, Kirchen und Abschiede rund um den Teutoburger Wald', 'Trauerhalle, Kirche, Kapelle oder stiller Abschied im Familienkreis', 'längere Anfahrt und genügend Zeit zum Stimmen einplanen'],
	bochum: ['Bochum', 'in Bochum', 'Stiepel, Ehrenfeld, Innenstadt und Abschiede mitten im Ruhrgebiet', 'Trauerhalle, Kirche, Friedhofskapelle oder freie Trauerfeier', 'Ladeweg, Parken und Startsignal vorab konkret festlegen'],
	bonn: ['Bonn', 'in Bonn', 'Südstadt, Rheinlage, Kirchen, Friedhöfe und Abschiede zwischen Stadt und Siebengebirge', 'Trauerhalle, Kirche, Kapelle oder persönlicher Abschied im Grünen', 'Rheinverkehr, genaue Adresse und den musikalischen Beginn mit Puffer planen'],
	bottrop: ['Bottrop', 'in Bottrop', 'ruhige Wohnlagen, Friedhöfe und familiäre Abschiede im westlichen Ruhrgebiet', 'Trauerhalle, Kirche, Friedhof oder kleiner Raum mit direktem Angehörigenkreis', 'Aufbau schlicht halten und den ersten Einsatz klar mit einer Kontaktperson abstimmen'],
	dormagen: ['Dormagen', 'in Dormagen', 'Rheinlage, Zons, Knechtsteden und Abschiede zwischen Düsseldorf und Köln', 'Trauerhalle, Kirche, Friedhofskapelle oder freie Abschiedsfeier', 'die Lage zwischen zwei Städten für Anfahrt und Ablauf mitdenken'],
	dortmund: ['Dortmund', 'in Dortmund', 'Innenstadt, Hörde, östliches Ruhrgebiet und große wie kleine Trauerorte', 'Trauerhalle, Kirche, Kapelle, Friedhof oder freier Abschiedsraum', 'bei weitläufigen Anlagen Treffpunkt und Aufbauplatz vorher festlegen'],
	duesseldorf: ['Düsseldorf', 'in Düsseldorf', 'Nordfriedhof, Südfriedhof, Kaiserswerth, Benrath und urbane Trauerorte', 'Trauerhalle, Kirche, Friedhofskapelle oder persönlicher Abschied am Rhein', 'Innenstadtverkehr, Aufzug und kurze Ladewege vorab berücksichtigen'],
	duisburg: ['Duisburg', 'in Duisburg', 'Innenhafen, linksrheinische Stadtteile, Kirchen und Friedhöfe im Westen des Ruhrgebiets', 'Trauerhalle, Kirche, Kapelle, Friedhof oder Abschied im kleinen Kreis', 'Wege durch große Stadtteile und Parkmöglichkeiten sauber abstimmen'],
	erkrath: ['Erkrath', 'in Erkrath', 'Neandertal, Hochdahl, Unterfeldhaus und Abschiede nah an Düsseldorf', 'Trauerhalle, Kirche, Friedhof oder freie Feier mit ruhigem Rahmen', 'kurze Wege nutzen und trotzdem einen stillen Aufbauplatz einplanen'],
	essen: ['Essen', 'in Essen', 'Rüttenscheid, Stadtwald, Baldeneysee-Nähe und zentrale Ruhrgebietsfriedhöfe', 'Trauerhalle, Kirche, Kapelle oder persönlicher Abschied mit vielen Angehörigen', 'bei großen Stadtwegen genug Zeit für Ankunft, Stimmen und Abstimmung lassen'],
	gelsenkirchen: ['Gelsenkirchen', 'in Gelsenkirchen', 'Buer, Schalke, Ückendorf und herzliche Abschiede im Ruhrgebiet', 'Kirche, Trauerhalle, Friedhofskapelle oder freier Abschiedsraum', 'Ankunft und erster Einsatz so planen, dass keine Unruhe entsteht'],
	haan: ['Haan', 'in Haan', 'Gartenstadt-Charakter und Abschiede zwischen Düsseldorf und Wuppertal', 'Kapelle, Friedhof, kleiner Saal oder Familienraum mit persönlichem Kreis', 'Aufbau klein halten und Wunschmusik diskret vorbereiten'],
	hagen: ['Hagen', 'in Hagen', 'Volme, Haspe, Hohenlimburg und Abschiede am Rand des Sauerlands', 'Kirche, Trauerhalle, Friedhof oder Feier mit ruhigem Blick ins Grüne', 'Anfahrt und Wetter bei Außenmomenten zuverlässig planen'],
	heiligenhaus: ['Heiligenhaus', 'in Heiligenhaus', 'ruhige Wohnlagen, Friedhöfe und Abschiede zwischen Ratingen und Velbert', 'Kapelle, Trauerhalle, Kirche oder familiärer Abschied', 'Zugang, Strombedarf und Wetterschutz unkompliziert vorab klären'],
	herne: ['Herne', 'in Herne', 'Wanne, Eickel und Abschiede mitten im Ruhrgebiet', 'Trauerhalle, Kirche, Friedhofskapelle oder kurzer Abschied im kleinen Kreis', 'Timing genau setzen, damit der erste Ton zum geplanten Moment kommt'],
	hilden: ['Hilden', 'in Hilden', 'Innenstadt, Stadtpark-Nähe und Abschiede zwischen Düsseldorf, Solingen und Langenfeld', 'Trauerhalle, Kirche, Friedhof oder persönlicher Abschied mit kurzer musikalischer Rahmung', 'durch kurze Wege flexibel bleiben und den Ablauf klar notieren'],
	iserlohn: ['Iserlohn', 'in Iserlohn', 'Sauerlandnähe, Letmathe und Abschiede mit viel Familienbezug', 'Kirche, Trauerhalle, Friedhof oder ruhiger Abschied im Familienkreis', 'Anreise und Wetteroptionen für Außenmusik früh mitdenken'],
	koeln: ['Köln', 'in Köln', 'Veedel, Rheinlage, Melaten, Kirchen und sehr unterschiedliche Abschiedsorte', 'Trauerhalle, Kirche, Kapelle, Friedhof oder freie Feier', 'bei dichter Stadtlage Treffpunkt, Parken und Beginn besonders genau planen'],
	krefeld: ['Krefeld', 'in Krefeld', 'Bockum, Uerdingen, Stadtwald und Abschiede am Niederrhein', 'Trauerhalle, Kirche, Friedhofskapelle oder Abschiedsfeier mit entspanntem, stillen Rahmen', 'Ablauf und Raumgröße klären, damit die Viola präsent und nicht zu laut wirkt'],
	'kreis-mettmann': ['Kreis Mettmann', 'im Kreis Mettmann', 'Erkrath, Haan, Hilden, Ratingen, Velbert und kleinere Trauerorte dazwischen', 'Trauerhalle, Kirche, Friedhof, Kapelle oder Abschied mit regionalem Angehörigenkreis', 'mehrere mögliche Anfahrtswege und Stadtgrenzen entspannt einplanen'],
	langenfeld: ['Langenfeld', 'in Langenfeld', 'Abschiede zwischen Düsseldorf, Leverkusen und Monheim', 'Trauerhalle, Kirche, Friedhof oder persönlicher Abschied im Familienkreis', 'den Ablauf kompakt planen, damit Musik Anfang oder Schluss gezielt trägt'],
	leverkusen: ['Leverkusen', 'in Leverkusen', 'Schlebusch, Opladen, Rheinlage und Abschiede zwischen Köln und Bergischem Land', 'Trauerhalle, Kirche, Kapelle oder Abschied mit anschließender Begegnung', 'Anfahrt zwischen Stadtteilen und Zugang zur Trauerhalle konkretisieren'],
	meerbusch: ['Meerbusch', 'in Meerbusch', 'Büderich, Osterath, Rheinlage und stille private Abschiede', 'Kapelle, Kirche, Friedhof oder kleiner Raum mit ruhigem Ton', 'dezente Musik und klares Timing oft besser planen als einen großen Auftritt'],
	mettmann: ['Mettmann', 'in Mettmann', 'Neandertalnähe, Altstadt und Abschiede im Kreis Mettmann', 'kleine Trauerhalle, Kirche, Friedhof oder private Feier mit viel Nähe', 'Ankunft, Aufbauplatz und Wunschlied diskret mit einer Kontaktperson klären'],
	moenchengladbach: ['Mönchengladbach', 'in Mönchengladbach', 'Rheydt, Wickrath und Abschiede am linken Niederrhein', 'Trauerhalle, Kirche, Friedhof oder Abschied mit mehreren Generationen', 'größere Wege im Stadtgebiet und den richtigen Moment für den Einsatz planen'],
	moers: ['Moers', 'in Moers', 'Niederrhein, Schlossnähe, Friedhöfe und Abschiede zwischen Duisburg und Kamp-Lintfort', 'Trauerhalle, Kirche, Friedhof oder ruhiger Abschied im kleinen Kreis', 'bei Außenmusik Wetterschutz und einen stabilen Platz für das Instrument sichern'],
	'monheim-am-rhein': ['Monheim am Rhein', 'in Monheim am Rhein', 'Rheinpromenade, Baumberg und Abschiede zwischen Düsseldorf und Leverkusen', 'Kapelle, Kirche, Friedhof oder Abschied am Nachmittag', 'Rheinlage und Wetteroptionen bei musikalischen Außenmomenten beachten'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr', 'in Mülheim an der Ruhr', 'Ruhrtal, Broich, Saarn und Abschiede mit grüner Stadtnähe', 'Trauerhalle, Kirche, Friedhof oder ruhige Feier mit nahen Angehörigen', 'Wege am Wasser, Parken und Aufbauplatz vorher klären'],
	muenster: ['Münster', 'in Münster', 'Altstadt, Aasee-Nähe, Kirchen und Abschiede mit heller, kultivierter Atmosphäre', 'Trauerhalle, Kirche, Friedhof oder persönliche Feier im privaten Rahmen', 'Innenstadtlogistik und Anreise mit genügend Zeitpuffer planen'],
	neuss: ['Neuss', 'in Neuss', 'Innenstadt, Rheinlage, Quirinus-Nähe und Abschiede zwischen Düsseldorf und Grevenbroich', 'Trauerhalle, Kirche, Friedhof oder stiller Abschied im Familienkreis', 'Nähe zu Düsseldorf nutzen und den genauen Treffpunkt festlegen'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen', 'in Nordrhein-Westfalen', 'Rheinland, Ruhrgebiet, Bergisches Land und weitere Trauerorte in NRW', 'Abschiede von der kleinen Trauerfeier bis zur größeren Beisetzung', 'Anfahrt, Region und Länge der musikalischen Begleitung individuell prüfen'],
	oberhausen: ['Oberhausen', 'in Oberhausen', 'Sterkrade, Alt-Oberhausen und Abschiede im westlichen Ruhrgebiet', 'Trauerhalle, Kirche, Friedhof oder familiärer Abschied mit ruhigem Beginn', 'bei großen Wegen im Ruhrgebiet Startzeit und Aufbau nicht zu knapp legen'],
	paderborn: ['Paderborn', 'in Paderborn', 'Innenstadt, Schloss Neuhaus und Abschiede in Ostwestfalen', 'Kirche, Trauerhalle, Friedhof oder Familienabschied mit ruhiger Planung', 'Anreise und Setlänge früh abstimmen, damit sich die weitere Strecke sinnvoll einfügt'],
	ratingen: ['Ratingen', 'in Ratingen', 'Lintorf, Hösel, Tiefenbroich und Abschiede nah an Düsseldorf', 'Trauerhalle, Kirche, Friedhof oder ruhiger Abschied mit elegantem Rahmen', 'kurze Distanzen nutzen und Beginn sowie Wunschmoment klar planen'],
	recklinghausen: ['Recklinghausen', 'in Recklinghausen', 'Altstadt, Süd, Hochlar und Abschiede am Rand des Ruhrgebiets', 'Trauerhalle, Kirche, Friedhof oder Familienraum mit vielen Gesprächen danach', 'Anfahrt und Parken ruhig vorab klären, damit der Beginn unaufgeregt bleibt'],
	remscheid: ['Remscheid', 'in Remscheid', 'Bergische Höhen, Lennep und Abschiede mit ruhigem Charakter', 'Trauerhalle, Kirche, Friedhof oder kleiner Raum im Familienkreis', 'Wetter und Wege bei Außenmusik realistisch einplanen'],
	'rhein-kreis-neuss': ['Rhein-Kreis Neuss', 'im Rhein-Kreis Neuss', 'Neuss, Meerbusch, Dormagen, Grevenbroich und Rheinorte dazwischen', 'Trauerhalle, Kirche, Friedhof oder familiärer Abschied', 'Anfahrt und Stadtgrenzen flexibel planen, damit der Ablauf ruhig bleibt'],
	rheinland: ['Rheinland', 'im Rheinland', 'Rheinstädte, kleinere Orte und Abschiede mit offenem, persönlichem Rahmen', 'Trauerhalle, Kirche, Friedhof, Kapelle oder freie Feier', 'Region, Fahrzeit und gewünschte Einsatzpunkte individuell abstimmen'],
	'rhein-ruhr': ['Rhein-Ruhr', 'in der Rhein-Ruhr-Region', 'dichte Wege zwischen Düsseldorf, Köln, Essen, Dortmund und Duisburg', 'Abschiede mit Angehörigen aus mehreren Städten', 'Verkehr, Timing und Aufbau mit realistischen Puffern planen'],
	ruhrgebiet: ['Ruhrgebiet', 'im Ruhrgebiet', 'viele Städte nah beieinander und Abschiede mit direkter, herzlicher Stimmung', 'Trauerhalle, Kirche, Vereinshaus, Friedhof oder kleiner Familienraum', 'klare Absprachen zu Startsignal und Lautstärke besonders früh treffen'],
	siegen: ['Siegen', 'in Siegen', 'Oberstadt, Siegerland und Abschiede mit weiterem regionalem Einzugsgebiet', 'Familienraum, Kirche, Trauerhalle oder Friedhof im Grünen', 'die längere Anfahrt mit Einsatzdauer und Zeitfenster sinnvoll verbinden'],
	solingen: ['Solingen', 'in Solingen', 'Ohligs, Gräfrath, Wald und bergische Abschiedsorte', 'Trauerhalle, Kirche, Friedhof oder persönliche Feier mit handgemachtem Charakter', 'bei Häusern, Höhenlagen und Friedhofswegen Zugang und Wetteroptionen früh besprechen'],
	unna: ['Unna', 'in Unna', 'Altstadt, Königsborn und Abschiede zwischen Ruhrgebiet und Hellweg', 'Trauerhalle, Kirche, Friedhof oder stiller Abschied am Nachmittag', 'Anfahrt, Aufbau und erster Einsatz ohne Hektik aufeinander abstimmen'],
	velbert: ['Velbert', 'in Velbert', 'Neviges, Langenberg und Abschiede zwischen Ruhrgebiet und Bergischem Land', 'Kirche, Friedhof, Kapelle oder privater Abschiedsraum', 'bei Steigungen, Wegen und Außenflächen genug Zeit für Aufbau einplanen'],
	wuelfrath: ['Wülfrath', 'in Wülfrath', 'kleine Stadtwege, bergische Nähe und persönliche Abschiede', 'kleine Trauerhalle, Kirche, Friedhof oder Raum mit überschaubarem Kreis', 'ruhiger Aufbau und ein klarer Einsatzmoment passen hier besonders gut'],
	wuppertal: ['Wuppertal', 'in Wuppertal', 'Elberfeld, Barmen, Höhenlagen und Abschiede entlang der Wupper', 'Trauerhalle, Kirche, Friedhof am Hang oder Raum mit lebendigem Familienkreis', 'Wege, Treppen und Wetter bei Außenmusik mitdenken'],
};

const LOCAL_DETAIL_NOTES = {
	aachen: ['In Aachen denke ich besonders an historische Räume, Hall in Kirchen und kurze Wege in der Altstadt. Wenn Angehörige aus dem Dreiländereck anreisen, hilft ein musikalischer Beginn, der nicht eilt und den Raum zuerst sammelt.', 'Für Aachen klären wir vor allem Raumakustik, Treffpunkt und einen belastbaren Zeitpuffer, weil ältere Gebäude und enge Wege die Planung stärker beeinflussen können als eine reine Liedliste.'],
	'bergisches-land': ['Im Bergischen Land verändern Hügel, kleinere Friedhöfe, Kapellen, Höfe und wechselhaftes Wetter die Planung deutlich. Ich achte deshalb darauf, ob die Viola draußen geschützt steht und ob Wege über Kies, Wiese oder Steigung führen.', 'Für das Bergische Land klären wir früh, ob Musik im Freien wirklich sinnvoll ist und wo ein ruhiger, trockener Alternativplatz liegt.'],
	'bergisch-gladbach': ['In Bergisch Gladbach liegen Bensberg, Refrath, Kölner Stadtnähe und bergische Ruhe nah beieinander. Dadurch kann ein Abschied sehr städtisch oder sehr persönlich im kleineren Kreis wirken.', 'Für Bergisch Gladbach sind Zufahrt, Parken und die Position der Musik wichtig, weil manche Trauerorte festlich wirken, aber organisatorisch kurze Zeitfenster haben.'],
	bielefeld: ['Für Bielefeld plane ich mit längerer Anreise, klaren Zeitfenstern und Abschiedsorten zwischen Stadt und Teutoburger-Wald-Nähe. Die Musik sollte den Termin nicht schwerer machen, sondern den Ablauf beruhigen.', 'Bei Bielefeld-Terminen ist ein sauberer Ablaufplan hilfreich, damit Anfahrt, Stimmen, Startsignal und mögliche Pausen nicht zu knapp kalkuliert werden.'],
	bochum: ['Bochum-Abschiede wirken oft direkt, familiär und weniger formell. Die Viola darf deshalb nah klingen: nicht wie ein Auftritt, sondern wie ein ruhiger Ton für Worte, Erinnerung und Auszug.', 'In Bochum klären wir Ladeweg, Parkmöglichkeit und Startsignal, weil urbane Trauerorte häufig mehrere Eingänge oder kurze Wege über Anlagen haben.'],
	bonn: ['In Bonn mischen sich Rheinlage, Südstadt, Kirchenräume und Siebengebirge-Nähe zu sehr unterschiedlichen Abschiedsorten. Die Musik kann im Trausaal ruhig tragen oder draußen sehr reduziert wirken.', 'Für Bonn sind Rheinverkehr, genaue Adresse und ein sinnvoller Puffer wichtig, besonders wenn Trauerfeier und Beisetzung an verschiedenen Orten stattfinden.'],
	bottrop: ['Bottrop passt häufig zu familiären Abschieden, bei denen der musikalische Moment nicht groß wirken soll. Ein Solo-Instrument kann hier besonders persönlich sein, weil es wenig Aufbau braucht und trotzdem Würde gibt.', 'In Bottrop reicht oft eine schlanke Planung, aber Startsignal, Aufbauplatz und ein kurzer Kontakt vor Ort sollten eindeutig feststehen.'],
	dormagen: ['Dormagen liegt zwischen Düsseldorf und Köln, und genau diese Lage prägt viele Abläufe. Angehörige kommen aus mehreren Richtungen, Rheinorte wirken ruhig, und Zons oder Knechtsteden brauchen eine feine musikalische Linie.', 'Für Dormagen achte ich besonders auf die Abstimmung zwischen Trauerort, Beisetzung und möglichem Wechsel zwischen Innenraum und Friedhof.'],
	dortmund: ['In Dortmund können Abschiede sehr großstädtisch, familiär oder sachlich organisiert sein. Ich plane den Klang deshalb dramaturgisch: ein ruhiger Einstieg, klare Zwischenräume und ein Auszug, der den Raum nicht überfrachtet.', 'Für Dortmund sind Treffpunkt, Wege innerhalb der Anlage und eine feste Kontaktperson wichtig, weil größere Friedhöfe und Häuser schnell unübersichtlich werden können.'],
	duesseldorf: ['Düsseldorf braucht oft präzise und dennoch sehr ruhige Planung: Nordfriedhof, Südfriedhof, Benrath, Kaiserswerth, Innenstadtverkehr und kurze Ladezonen verändern den Ablauf. Die Viola passt gut, wenn Musik würdevoll wirken soll, ohne technisch groß aufzubauen.', 'In Düsseldorf stimmen wir neben den Stücken besonders Ladeweg, Parken, Raumzugang und den Wechsel zwischen Trauerhalle, Kirche und Friedhof ab.'],
	duisburg: ['Duisburg bringt Innenhafen, Rhein, Ruhrgebiet und linksrheinische Stadtteile zusammen. Für Trauermusik bedeutet das: Der Klang darf warm und klar sein, aber die Planung muss Wege, Parkplätze und größere Distanzen ernst nehmen.', 'In Duisburg ist es sinnvoll, Ankunftszeit und Aufbauplatz vorab festzulegen, damit der erste Ton entspannt und nicht unter Zeitdruck entsteht.'],
	erkrath: ['Erkrath ist nah an Düsseldorf, wirkt bei Abschieden aber oft grüner und persönlicher. Zwischen Neandertal, Hochdahl und Unterfeldhaus entsteht ein Rahmen, in dem Solo-Viola sehr still und nah funktionieren kann.', 'Für Erkrath klären wir, ob die Musik in der Halle, draußen oder an einem Übergangspunkt zwischen Feier und Beisetzung sitzen soll.'],
	essen: ['Essen hat mit Stadtwald, Rüttenscheid, Baldeneysee-Nähe und zentralen Ruhrgebietslagen sehr unterschiedliche Trauerorte. Ich plane die Musik passend zur Atmosphäre: ruhig am Wasser, getragen im Raum oder sehr schlicht am Grab.', 'Bei Essen-Terminen sind Stadtverkehr, Locationzugang und ein realistischer Puffer vor dem ersten Einsatz besonders wichtig.'],
	gelsenkirchen: ['In Gelsenkirchen darf Trauermusik bodenständig und emotional zugleich sein. Buer, Ückendorf oder kleinere Räume verlangen weniger Form und mehr verlässliches Timing.', 'Für Gelsenkirchen hilft ein klarer Ablaufplan mit Startzeichen und Pausen, weil viele Abschiede familiär organisiert sind und nicht jede Feier eine feste Regie hat.'],
	haan: ['Haan wirkt bei Abschieden häufig privat, gartenstädtisch und nah an den Menschen. Die Viola kann dort sehr fein eingesetzt werden: als Lieblingslied, als Einstieg oder als ruhiger Abschluss.', 'In Haan geht es oft um diskrete Vorbereitung, damit ein persönliches Stück nicht organisatorisch auffällt und dennoch rechtzeitig bereitsteht.'],
	hagen: ['Hagen liegt am Übergang Richtung Sauerland, dadurch spielen Wetter, Wege und Blick ins Grüne bei manchen Abschieden eine größere Rolle. Musikalisch plane ich lieber robuste, klare Momente als empfindliche Abläufe mit vielen Ortswechseln.', 'Für Hagen klären wir früh, ob Außenmusik geschützt möglich ist und wie viel Zeit zwischen Ankunft, Stimmen und dem ersten Einsatz bleibt.'],
	heiligenhaus: ['Heiligenhaus-Abschiede sind oft überschaubar, persönlich und zwischen Ratingen und Velbert gut erreichbar. Die Musik darf hier besonders nah wirken: nicht als Konzert, sondern als bewusster Klang für Erinnerung, Segen oder Auszug.', 'In Heiligenhaus sind Zugang, Strombedarf bei eventueller Technik und Wetterschutz schnell geklärt, sollten aber vor dem Termin schriftlich feststehen.'],
	herne: ['Herne liegt mitten im Ruhrgebiet und passt zu Abschieden, die direkt, familiär und unkompliziert geplant sind. Solo-Viola bringt Festlichkeit in Trauerhalle, Kirche oder Kapelle, ohne den Ablauf schwerer zu machen.', 'In Herne ist ein klares Zeitfenster wichtig, damit die Musik genau dort beginnt, wo die Feier still und aufmerksam ist.'],
	hilden: ['Hilden liegt zwischen Düsseldorf, Solingen und Langenfeld, wodurch viele Abschiede regional gemischt sind. Ich plane die Musik kompakt und klar: ein Einstieg, ein stiller Zwischenmoment und bei Bedarf ein kurzer Auszug.', 'Für Hilden sind kurze Wege ein Vorteil, trotzdem sollten Treffpunkt, Wunschlied und die Rolle der Musik vorab konkret notiert sein.'],
	iserlohn: ['In Iserlohn wirken Abschiede oft etwas weiter, grüner und familienbezogener. Die Musik darf dort nicht wie ein städtischer Standardblock klingen, sondern soll Raum, Anreise und persönlichen Anlass verbinden.', 'Für Iserlohn plane ich Anfahrt und Einsatzdauer sorgfältig, damit der musikalische Moment zur weiteren Strecke und zum Tagesablauf passt.'],
	koeln: ['Köln bringt Veedel, Rhein, Melaten, Kirchen und sehr unterschiedliche Angehörigenkreise zusammen. Trauermusik muss hier flexibel sein: würdevoll im offiziellen Moment, aber schlicht genug für direkte Nähe.', 'In Köln sind Parken, Eingang, Etage und Startsignal besonders wichtig, weil dichte Stadtlagen musikalisch nur funktionieren, wenn die Logistik ruhig bleibt.'],
	krefeld: ['Krefeld und der Niederrhein wirken bei Abschieden häufig etwas ruhiger und weitläufiger. Die Viola kann dort eine klare Linie setzen, ohne die Trauerfeier zu überdecken, besonders in Stadtwaldnähe oder familiären Kapellen.', 'Für Krefeld klären wir Raumgröße und Abstand zu den Angehörigen, damit der warme Klang präsent ist, aber die Stille möglich bleibt.'],
	'kreis-mettmann': ['Im Kreis Mettmann wechseln Erkrath, Ratingen, Haan, Hilden, Velbert und kleinere Orte schnell ineinander. Für die Musik ist entscheidend, welcher Trauerort den Ton setzt: grün, urban, bergisch, familiär oder sehr schlicht.', 'Bei Abschieden im Kreis Mettmann planen wir Stadtgrenzen pragmatisch mit und legen Treffpunkt, Fahrzeit und Aufbauplatz eindeutig fest.'],
	langenfeld: ['Langenfeld liegt praktisch zwischen Düsseldorf, Leverkusen und Monheim. Viele Abschiede sind gut erreichbar, aber zeitlich dicht geplant. Ich setze Musik hier gern kompakt ein, damit Feier, Beisetzung und Begegnung nicht auseinanderfallen.', 'Für Langenfeld ist entscheidend, ob die Musik nur den Beginn trägt oder auch den Auszug beziehungsweise den Gang zum Grab begleitet.'],
	leverkusen: ['Leverkusen verbindet Rheinlage, Opladen, Schlebusch und bergische Nähe. Die Trauermusik sollte deshalb nicht pauschal klingen, sondern je nach Ort heller, ruhiger oder privater angelegt werden.', 'In Leverkusen klären wir Wege zwischen Stadtteilen und den genauen Zugang zur Trauerhalle, damit die Viola pünktlich und ruhig startbereit ist.'],
	meerbusch: ['Meerbusch steht oft für stille private Abschiede, Rheinlage und ein Publikum, das dezente Qualität schätzt. Die Viola darf dort fein und nah bleiben, mit Musik, die Atmosphäre schafft, ohne den Raum zu besetzen.', 'Für Meerbusch ist die Balance aus Zurückhaltung und Würde zentral: Wo steht die Musik, wie lange spielt sie, und wann bleibt besser Stille?'],
	mettmann: ['Mettmann wirkt durch Altstadt, Neandertalnähe und kleinere Trauerräume sehr persönlich. Ich plane die Musik so, dass sie nicht zu groß für den Raum wird und trotzdem als besonderer Abschiedston erkennbar bleibt.', 'Für Mettmann sind Aufbauplatz, Raumgröße und die Abstimmung mit einer Kontaktperson besonders hilfreich, weil viele Abschiede privat oder halbprivat organisiert sind.'],
	moenchengladbach: ['Mönchengladbach bringt Rheydt, Wickrath und den linken Niederrhein zusammen. Viele Abschiede haben hier einen starken Familienbezug, daher plane ich Musik, die mehrere Generationen abholt, ohne beliebig zu werden.', 'Für Mönchengladbach achten wir auf Wege im Stadtgebiet, die richtige Einsatzstelle und darauf, ob ein Wunschlied eher Erinnerung oder Schlussmoment sein soll.'],
	moers: ['Moers passt gut zu Abschieden mit Niederrhein-Ruhe, Schlossnähe oder kleinen Kapellen. Die Viola kann dort klar und warm wirken, besonders wenn der Übergang von Trauerfeier zu Beisetzung nicht hektisch werden soll.', 'Für Moers sind Wetterschutz und ein stabiler Platz bei Außenmusik wichtig, weil ein warmer Klang nur trägt, wenn das Instrument sicher stehen kann.'],
	'monheim-am-rhein': ['Monheim am Rhein hat mit Promenade, Baumberg und der Lage zwischen Düsseldorf und Leverkusen einen eigenen ruhigen Rahmen. Musikalisch plane ich dort gern klare Übergänge: Feier, Auszug, stiller Abschied.', 'Für Monheim ist wichtig, ob Musik am Wasser, draußen am Friedhof oder im Innenraum stattfinden soll, denn Wind und Abstand verändern die Wirkung der Viola.'],
	'muelheim-an-der-ruhr': ['Mülheim an der Ruhr wirkt grüner als viele Ruhrgebietsstädte. Broich, Saarn und Ruhrtal passen zu Abschieden, bei denen Musik würdevoll, aber entspannt bleiben soll.', 'Für Mülheim klären wir Wege am Wasser, Parken und den Schutz bei Außenmomenten, damit die Musik nicht durch Wetter oder lange Laufwege gestört wird.'],
	muenster: ['Münster-Abschiede haben oft eine helle, geordnete Stimmung zwischen Altstadt, Aasee und kirchlichen Räumen. Ich plane die Viola dort fein und ruhig, damit Musik nicht zu schwer wirkt, aber dem Moment Gewicht gibt.', 'Für Münster sollten Anreise, Innenstadtlogistik und ein Puffer vor dem Stimmen früh eingeplant werden.'],
	neuss: ['Neuss liegt nah an Düsseldorf und hat zugleich eigene Rhein- und Innenstadtmomente. Die Musik kann hier gut verbinden: Trauerhalle oder Kirche, danach Auszug, Friedhof und ein kurzer letzter Gruß.', 'In Neuss ist ein genauer Treffpunkt sinnvoll, weil kleine Wege zwischen Trauerort, Rheinlage und Friedhof den Ablauf schneller verschieben können als geplant.'],
	'nordrhein-westfalen': ['Nordrhein-Westfalen ist als Zielseite breiter als eine Stadtseite. Deshalb erkläre ich hier stärker, wie ich Abschiede in Rheinland, Ruhrgebiet, Bergischem Land und weiteren Regionen unterschiedlich plane.', 'Für NRW-Anfragen brauche ich besonders Ort, Fahrzeit, Zeremonieform und gewünschte Einsatzpunkte, damit die Musik realistisch zum Termin passt.'],
	oberhausen: ['Oberhausen-Abschiede sind oft unkompliziert, familiär und im westlichen Ruhrgebiet gut vernetzt. Die Viola passt gut, wenn eine Feier einen würdevollen Anfang braucht, aber später nicht wie ein Auftritt wirken soll.', 'Für Oberhausen sollten Ankunft, Parken und der Weg zum Raum vorab stehen, weil größere Ruhrgebietswege schnell Puffer kosten.'],
	paderborn: ['Paderborn liegt weiter im Osten des NRW-Radius, daher muss eine Anfrage musikalisch und organisatorisch sinnvoll geplant sein. Wenn der Rahmen passt, kann die Viola Kirche, Trauerhalle oder Friedhof sehr persönlich öffnen.', 'Für Paderborn klären wir früh Einsatzdauer, Anreise und Zeitfenster, damit sich die weitere Strecke gut in den Abschiedstag einfügt.'],
	ratingen: ['Ratingen ist nah an Düsseldorf, hat aber mit Hösel, Lintorf und grünen Lagen viele ruhigere Trauerorte. Musik kann hier würdevoll sein, ohne städtisch kühl zu wirken.', 'Für Ratingen ist wichtig, ob die Musik in einer Kapelle, Kirche, Trauerhalle oder draußen beginnt, weil jeder Ort anderes Timing verlangt.'],
	recklinghausen: ['Recklinghausen liegt am Rand des Ruhrgebiets und hat viele Abschiede mit persönlichem, geselligem Nachklang. Die Viola kann dort vor allem die offiziellen Momente tragen, ohne späteren Gesprächen im Weg zu stehen.', 'Für Recklinghausen klären wir Parken, Raumzugang und eine Kontaktperson, damit der erste Einsatz nicht von organisatorischen Fragen abhängt.'],
	remscheid: ['Remscheid bringt bergische Höhen, Lennep und wetterabhängige Friedhofswege mit. Ich plane Musik dort bewusst robust: klare Startpunkte, gute Platzwahl und genug Ruhe für den Klang.', 'Für Remscheid sind Wege, Treppen, Außenflächen und Wetteroptionen wichtige Punkte, bevor wir die Stücke final festlegen.'],
	'rhein-kreis-neuss': ['Der Rhein-Kreis Neuss ist keine einzelne Stimmung, sondern ein Netz aus Neuss, Meerbusch, Dormagen, Grevenbroich und kleineren Rheinorten. Die Musik wird deshalb nach Trauerort und Angehörigenweg geplant, nicht nur nach Kreisname.', 'Für den Rhein-Kreis Neuss stimmen wir Fahrzeit, Ortswechsel und den passendsten Einsatzpunkt ab, damit die Viola den Abschied verbindet statt nur einen Programmpunkt zu füllen.'],
	rheinland: ['Im Rheinland sind Abschiede oft offen, persönlich und stark vom Miteinander nach der Feier geprägt. Die Musik muss hier nicht nur die Zeremonie tragen, sondern auch den Übergang zu Auszug, Grab oder Begegnung weich machen.', 'Für Rheinland-Abschiede klären wir Region, Fahrzeit und Einsatzdauer individuell, weil Köln, Düsseldorf, Bonn oder kleinere Orte ganz unterschiedliche Abläufe haben.'],
	'rhein-ruhr': ['Rhein-Ruhr bedeutet dichte Wege, mehrere Städte und oft Angehörige aus verschiedenen Richtungen. Für die Musik plane ich deshalb mit realistischen Puffern und einer klaren Dramaturgie, damit der Termin trotz Verkehr ruhig beginnt.', 'In Rhein-Ruhr ist die Logistik fast so wichtig wie das Repertoire: Startsignal, Parken und Aufbauort müssen vorab eindeutig sein.'],
	ruhrgebiet: ['Im Ruhrgebiet darf Trauermusik herzlich, direkt und trotzdem würdevoll sein. Viele Abschiede wechseln schnell zwischen offizieller Zeremonie, Familienmoment und stiller Begegnung; die Viola kann diese Übergänge warm zusammenhalten.', 'Für Ruhrgebiets-Abschiede helfen klare Absprachen zu Lautstärke, Startsignal und Pausen, weil Räume und Angehörigenkreise oft lebendig sind.'],
	siegen: ['Siegen und das Siegerland bringen häufig weitere Anfahrten, grüne Orte und Abschiede mit starkem regionalem Bezug. Die Musik sollte dort nicht zu kurz gedacht werden, sondern als bewusster Teil des Zeitfensters.', 'Für Siegen ist es sinnvoll, Einsatzdauer, Anreise und mögliche Wartezeiten früh zu verbinden, damit der Auftritt gut zum Ablauf passt.'],
	solingen: ['Solingen wirkt mit Gräfrath, Ohligs, Wald und bergischen Lagen oft handgemacht und persönlich. Die Viola kann dort warm, nah und nicht zu repräsentativ klingen, was besonders zu kleineren Kapellen und Friedhöfen passt.', 'Für Solingen sind Höhenlage, Zugang, Wetter und Raumgröße wichtig, bevor wir entscheiden, ob Musik draußen oder innen besser wirkt.'],
	unna: ['Unna liegt zwischen Ruhrgebiet und Hellweg und passt zu Abschieden, die familiär und zugleich gut erreichbar sind. Musik kann hier vor allem den Nachmittag strukturieren: Beginn, Erinnerung, Auszug.', 'Für Unna klären wir Anfahrt, Aufbau und den ersten Einsatz so, dass keine Hektik entsteht, wenn Angehörige aus verschiedenen Richtungen ankommen.'],
	velbert: ['Velbert verbindet Neviges, Langenberg und bergische Nähe mit Ruhrgebietswegen. Trauermusik sollte hier flexibel auf Kirche, Kapelle, Friedhof oder kleinen Raum reagieren können.', 'Für Velbert berücksichtige ich Steigungen, Wege und Außenflächen, weil der beste musikalische Platz manchmal nicht direkt am Eingang liegt.'],
	wuelfrath: ['Wülfrath ist klein genug für persönliche Wege und bergisch genug für Wetter- und Außenfragen. Die Musik darf hier sehr intim sein: ein Lieblingslied, ein ruhiger Beginn oder ein kurzer Abschied im überschaubaren Kreis.', 'Für Wülfrath ist ein ruhiger Aufbauplatz wichtig, weil kleine Abschiede meist wenig Abstand zwischen Musik und Angehörigen lassen.'],
	wuppertal: ['Wuppertal verlangt wegen Höhenlagen, Treppen, Altbauten, Friedhofswegen und der Wupper-Täler besonders genaue Planung. Der Klang der Viola kann sehr schön tragen, wenn Position, Akustik und Wetter vorher stimmen.', 'Für Wuppertal klären wir Laufwege und Aufbauplatz genau, damit die Musik nicht durch Treppen, Hanglagen oder kurzfristige Ortswechsel aus dem Takt kommt.'],
};

const TOPIC_PROFILES = {
	'amazing-grace-beerdigung': ['Amazing Grace Beerdigung', 'Amazing Grace', 'Amazing Grace zur Beerdigung, schlicht gespielt und ohne Pathos.', 'Angehörige, die ein bekanntes Hoffnungslied wünschen', 'Trauerhalle, Kirche, Auszug oder Moment am Grab', 'Der Suchintent ist liedbezogen: Es geht um ein konkretes Stück und darum, ob es zur Beerdigung passt.', 'Amazing Grace wirkt auf Solo-Viola besonders gut, wenn Tempo, Länge und Dynamik sehr ruhig bleiben.', 'Diese Seite grenzt sich von allgemeinen Repertoirelisten ab: Im Mittelpunkt steht ein einzelnes Lied und seine sensible Platzierung.'],
	'ave-maria-beerdigung': ['Ave Maria Beerdigung', 'Ave Maria', 'Ave Maria zur Beerdigung, getragen, klassisch und behutsam eingesetzt.', 'Familien, die ein bekanntes klassisches Stück für den Abschied suchen', 'Kirche, Trauerhalle, Beginn, Meditation oder Auszug', 'Der Suchintent ist sehr konkret: Es geht nicht um irgendeine Trauermusik, sondern um Ave Maria als Abschiedsstück.', 'Ich prüfe, welche Fassung und welcher Ausschnitt zur Solo-Viola, zur Raumakustik und zum Ablauf passt.', 'Ave Maria braucht Ruhe und darf nicht zu dekorativ wirken. Der Einsatzpunkt entscheidet, ob es trägt oder zu schwer wird.'],
	'bratsche-beerdigung': ['Bratsche Beerdigung', 'Bratsche', 'Bratsche zur Beerdigung, warm, dunkel und nah an der menschlichen Stimme.', 'Suchende, die gezielt einen warmen Streichklang suchen', 'Trauerhalle, Kirche, Kapelle oder Grab', 'Der Intent ist instrumentennah: Die Bratsche soll nicht beliebige Hintergrundmusik sein, sondern eine bestimmte Klangfarbe geben.', 'Tiefe Lagen, ruhige Bögen und klare Melodien wirken besonders stark, wenn Worte nicht ausreichen.', 'Diese Seite erklärt die Bratsche als eigenes Trauerinstrument und nicht als austauschbare Alternative.'],
	'geige-beerdigung': ['Geige Beerdigung', 'Geige', 'Geige zur Beerdigung gesucht, transparent als warme Solo-Viola umgesetzt.', 'Menschen, die nach Geige suchen und Live-Streicherklang meinen', 'Trauerfeier, Beerdigung, Auszug oder Abschied am Grab', 'Viele suchen Geige, obwohl eine Viola klanglich oft die wärmere, tiefere Alternative ist.', 'Ich erkläre offen, dass ich Viola spiele und wie sich der Klang von der Geige unterscheidet.', 'Der Fokus liegt auf dem gewünschten Streichklang, nicht auf einem falschen Instrumentenversprechen.'],
	'instrumentalmusik-trauerfeier': ['Instrumentalmusik Trauerfeier', 'Instrumental', 'Instrumentalmusik zur Trauerfeier, wenn Worte Raum behalten sollen.', 'Trauerfeiern, in denen Musik ohne Gesang wirken soll', 'Beginn, Zwischenmoment, Kerzenritual oder Auszug', 'Instrumentalmusik wird gesucht, wenn Musik tragen soll, ohne Text in Konkurrenz zu Reden oder Gebeten zu setzen.', 'Solo-Viola kann bekannte Melodien textfrei spielen und dadurch Erinnerungen öffnen, ohne sie auszuformulieren.', 'Diese Seite grenzt sich von Liedlisten ab: Entscheidend ist die Funktion der Musik ohne gesungene Worte.'],
	'klassische-musik-beerdigung': ['Klassische Musik Beerdigung', 'Klassisch', 'Klassische Musik zur Beerdigung, würdevoll, ruhig und nicht schwerer als nötig.', 'Angehörige, die vertraute klassische Stücke für eine Beerdigung suchen', 'Kirche, Trauerhalle, Auszug oder stiller Moment', 'Der Intent ist repertoirebezogen: Klassik soll Halt geben, aber nicht wie Konzertprogramm wirken.', 'Bach, Schubert, Massenet oder ruhige Bearbeitungen können passend sein, wenn Länge und Raum stimmen.', 'Diese Seite unterscheidet sich von Ave Maria und Amazing Grace, weil sie mehrere klassische Optionen einordnet.'],
	'live-musik-beerdigung': ['Live Musik Beerdigung', 'Live vor Ort', 'Live Musik zur Beerdigung, wenn der Ablauf atmen darf.', 'Beerdigungen mit Trauerhalle, Kirche, Auszug oder Grabmoment', 'Innenraum, Friedhof, Weg zum Grab oder kurzer Schlussmoment', 'Live-Musik wird gesucht, wenn eine Aufnahme zu starr wirkt und der Ablauf flexibel bleiben muss.', 'Die Viola kann auf Pausen, Wege, Applauslosigkeit und stille Verzögerungen reagieren.', 'Diese Seite betrachtet den ganzen Beerdigungsablauf, nicht nur die Trauerfeier im Raum.'],
	'live-musik-trauerfeier': ['Live Musik Trauerfeier', 'Live Trauerfeier', 'Live Musik zur Trauerfeier, die auf Worte und Stille reagiert.', 'Trauerfeiern mit Reden, Ritualen und stillen Übergängen', 'Trauerhalle, Kirche, Kapelle oder freie Abschiedsfeier', 'Der Suchintent fragt nach dem Mehrwert von live gespielter Musik gegenüber einer Aufnahme.', 'Live-Viola kann warten, früher enden, eine Pause halten oder den Auszug organisch begleiten.', 'Diese Seite bleibt bei der Zeremonie selbst und grenzt sich von Live Musik Beerdigung mit Grab- und Wegmomenten ab.'],
	'moderne-trauermusik': ['Moderne Trauermusik', 'Modern', 'Moderne Trauermusik, wenn ein persönliches Lied wichtiger ist als Tradition.', 'Familien mit Pop-Song, Filmmusik oder persönlicher Erinnerung', 'freie Trauerfeier, Trauerhalle, Kirche oder kleiner Abschied', 'Der Intent ist Repertoire mit persönlicher Sprache: moderne Musik soll würdevoll reduziert werden.', 'Nicht jedes Lied funktioniert auf Solo-Viola. Ich prüfe Melodie, Wiedererkennbarkeit und emotionales Gewicht.', 'Diese Seite grenzt moderne Stücke von klassischer Trauermusik ab, ohne sie gegeneinander auszuspielen.'],
	'musik-abschied': ['Musik Abschied', 'Abschied', 'Musik für einen Abschied, der nicht immer in ein festes Schema passt.', 'freie Abschiedsfeiern, kleine Kreise und persönliche Rituale', 'Trauerhalle, privater Raum, Kapelle oder stiller Abschied', 'Der Begriff ist breiter als Beerdigung: Er kann eine freie Feier, einen persönlichen Moment oder ein Lieblingslied meinen.', 'Die Viola kann den Rahmen öffnen, ohne eine feste Liturgie vorauszusetzen.', 'Diese Seite ist bewusst weiter gefasst als Musik letzter Abschied, die den finalen Moment behandelt.'],
	'musik-am-grab': ['Musik am Grab', 'Grab', 'Musik am Grab, kurz, schlicht und wetterfest geplant.', 'Beisetzungen mit einem letzten musikalischen Moment draußen', 'Friedhof, Grabstelle, Urnengrab oder kurzer Weg im Freien', 'Der Suchintent ist sehr praktisch: Draußen am Grab gelten andere Bedingungen als in einer Trauerhalle.', 'Ein kurzes Stück, ein einzelner Vers oder ein ruhiger Abschluss kann stärker wirken als ein langer Vortrag.', 'Diese Seite grenzt sich von Musik Beerdigung ab, weil nur der Außenmoment am Grab im Mittelpunkt steht.'],
	'musik-beerdigung': ['Musik Beerdigung', 'Beerdigung', 'Musik zur Beerdigung, ruhig geplant vom ersten Ton bis zum Abschied am Grab.', 'Angehörige, die den gesamten Beerdigungsablauf musikalisch rahmen möchten', 'Trauerhalle, Kirche, Auszug, Weg zum Grab oder Beisetzung', 'Der Intent umfasst mehr als die Trauerfeier: Es geht um die Beerdigung mit allen Stationen.', 'Ich plane, ob Musik innen, draußen oder an beiden Orten sinnvoll ist.', 'Diese Seite ist breiter als Musik Trauerfeier und praktischer als reine Liedseiten.'],
	'musik-bestattung': ['Musik Bestattung', 'Bestattung', 'Musik zur Bestattung, formal sicher und trotzdem persönlich.', 'Bestattungen mit klarer Organisation und Wunsch nach Live-Musik', 'Trauerhalle, Friedhof, Kirche oder Bestattungshaus', 'Der Begriff Bestattung klingt formaler als Beerdigung und meint oft Organisation, Ablauf und Verlässlichkeit.', 'Ich stimme Einsätze, Ankunft und Wunschmusik gern mit Bestattungshaus, Familie oder Rednerin ab.', 'Diese Seite grenzt sich von emotionaleren Begriffen ab und betont die ruhige, sichere Abstimmung.'],
	'musik-letzter-abschied': ['Musik letzter Abschied', 'Letzter Abschied', 'Musik für den letzten Abschied, wenn der Schlussmoment gehalten werden soll.', 'Angehörige, die den finalen Moment musikalisch rahmen möchten', 'Auszug, Gang zum Grab, Blumengruß oder stille Schlussminute', 'Der Intent ist enger als Musik Abschied: Es geht um das Ende der Feier oder den letzten Gruß.', 'Kurze, schlichte Melodien wirken hier oft stärker als lange Stücke.', 'Diese Seite behandelt den letzten Moment, nicht die gesamte Trauerfeier.'],
	'musik-trauerfeier': ['Musik Trauerfeier', 'Trauerfeier', 'Musik für die Trauerfeier, die Worte nicht ersetzt, sondern trägt.', 'Trauerfeiern mit Ansprache, Erinnerung, Ritualen und Auszug', 'Trauerhalle, Kirche, Kapelle oder freie Zeremonie', 'Der Suchintent meint die Zeremonie selbst: Beginn, Rede, stille Übergänge und Auszug.', 'Die Viola gibt Atemräume nach Worten und kann einen Beginn oder Schluss würdevoll halten.', 'Diese Seite grenzt sich von Musik Beerdigung ab, weil Weg zum Grab und Beisetzung nicht im Zentrum stehen.'],
	'musikerin-trauerfeier': ['Musikerin Trauerfeier', 'Musikerin', 'Eine Musikerin zur Trauerfeier, wenn direkter Kontakt und ruhige Abstimmung wichtig sind.', 'Angehörige, Rednerinnen oder Bestattungshäuser mit Bedarf an einer einzelnen Musikerin', 'Trauerhalle, Kirche, Kapelle oder freie Feier', 'Der Suchintent ist personenbezogen: Es geht um eine Musikerin, die zuverlässig und sensibel vor Ort ist.', 'Ich stimme Wunschlieder, Kleidung, Ankunft, Einsätze und Rückfragen direkt ab.', 'Diese Seite grenzt sich von allgemeinen Musikseiten ab, weil die Person und Abstimmung im Vordergrund stehen.'],
	'trauermusik-buchen': ['Trauermusik buchen', 'Buchen', 'Trauermusik buchen, wenn Termin, Ort und Wunschmusik konkret werden.', 'Angehörige mit konkretem Termin oder Bestattungshäuser mit Anfrage', 'Trauerfeier, Beerdigung, Bestattung oder Abschied am Grab', 'Der Intent ist transaktional: Gesucht wird nicht nur Inspiration, sondern eine verlässliche Buchung.', 'Ich frage Datum, Ort, Ablauf, Wunschstücke und Kontaktperson ab und gebe schnell Rückmeldung.', 'Diese Seite unterscheidet sich von Repertoireseiten, weil Anfrage, Ablauf und Verfügbarkeit im Mittelpunkt stehen.'],
	'trauermusikerin': ['Trauermusikerin', 'Trauermusikerin', 'Eine Trauermusikerin mit Viola, ruhig, persönlich und verlässlich.', 'Menschen, die eine einzelne Musikerin für einen Abschied suchen', 'Trauerhalle, Kirche, Friedhof oder freie Abschiedsfeier', 'Der Suchintent ist personenbezogen und breiter als Musikerin Trauerfeier.', 'Als Solo-Musikerin bringe ich wenig Aufbau, klare Abstimmung und einen warmen Streichklang mit.', 'Diese Seite erklärt Rolle, Haltung und Klang einer Trauermusikerin, nicht nur ein einzelnes Stück.'],
	'trauermusik-repertoire': ['Trauermusik Repertoire', 'Repertoire', 'Trauermusik Repertoire, wenn Stücke ausgewählt und eingeordnet werden sollen.', 'Angehörige, die Liedideen, klassische Stücke oder moderne Alternativen suchen', 'Trauerfeier, Beerdigung, Abschied oder stiller Moment', 'Der Intent ist orientierend: Es geht um Auswahl, Vergleich und passende Einsatzpunkte.', 'Ich ordne klassische Werke, moderne Lieder und persönliche Wunschmusik nach Wirkung und Ablauf ein.', 'Diese Seite ist keine reine Liste, sondern hilft, Stücke sinnvoll im Abschied zu platzieren.'],
	'viola-beerdigung': ['Viola Beerdigung', 'Viola', 'Viola zur Beerdigung, warm, schlicht und nah an der Stimme.', 'Angehörige, die bewusst den Klang der Viola suchen', 'Trauerfeier, Beerdigung, Kirche, Trauerhalle oder Grab', 'Der Intent erklärt die Viola als Instrument für Abschiede.', 'Ihr mittlerer, warmer Klang kann Trauer tragen, ohne hell oder virtuos zu wirken.', 'Diese Seite grenzt sich von Geige und Bratsche ab, indem sie die Viola klar als eigenes Instrument beschreibt.'],
};

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
		.replace('Am', 'am');
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
	const [locationNote, localFaqDetail] = LOCAL_DETAIL_NOTES[slug];
	const keyword = `Trauermusik ${label}`;
	const tone = pick(slug, [
		'ruhig, warm und zurückhaltend',
		'würdevoll, schlicht und nah',
		'getragen, aber nicht schwerer als nötig',
		'klar, leise und verlässlich',
		'persönlich, ohne den Abschied zu überladen',
	], 1);
	const repertoire = pick(slug, [
		'Ave Maria, Amazing Grace, Bach, Massenet oder ein persönliches Lieblingslied',
		'ein klassisches Stück, ein moderner Song in ruhiger Fassung und ein kurzer Auszug',
		'ein Lieblingslied, ein stiller Zwischenmoment und eine schlichte Musik zum Schluss',
		'klassische Trauermusik, moderne Melodien und sehr reduzierte Musik am Grab',
	], 2);
	const planning = pick(slug, [
		'Ich plane lieber wenige klare Einsätze als zu viel Musik am Stück.',
		'Die Musik bekommt feste Momente, bleibt aber flexibel, falls sich der Ablauf verschiebt.',
		'Vorab klären wir, wer das Startsignal gibt und wann ein Stück enden darf.',
		'Die Einsätze werden so gesetzt, dass Reden, Gebete und stille Wege nicht überdeckt werden.',
	], 3);
	const ceremonyDetail = pick(slug, [
		'Beim Beginn zählt Sammlung, nach einer Rede der Atemraum, beim Auszug die sichere Führung.',
		'Eine Trauerhalle braucht andere Länge als ein Moment am Grab; eine Kirche braucht wegen der Akustik mehr Ruhe.',
		'Wenn Angehörige aus mehreren Städten anreisen, hilft ein klarer musikalischer Anfang, damit der Abschied gesammelt beginnt.',
		'Ein Lieblingslied kann viel bedeuten, muss aber an der richtigen Stelle und in passender Länge erscheinen.',
	], 4);
	const familyDetail = pick(slug, [
		'Gerade für Angehörige ist es hilfreich, wenn die musikalischen Punkte vorher feststehen. Dann muss niemand während der Trauerfeier überlegen, ob ein Stück schon beginnen soll oder noch gewartet werden muss.',
		'Viele Familien wünschen sich einen würdevollen Klang, aber keinen sichtbaren Konzertmoment. Deshalb halte ich Aufbau, Auftreten und Abstimmung so schlicht wie möglich.',
		'Wenn mehrere Generationen anwesend sind, kann ein bekanntes Stück Orientierung geben. Ein persönliches Lied kann dagegen genau den Menschen in den Mittelpunkt stellen, um den es geht.',
		'Manchmal ist die wichtigste Entscheidung, an welcher Stelle keine Musik erklingt. Stille kann ebenso tragend sein wie ein Stück, wenn sie bewusst gesetzt wird.',
	], 6);
	const coordinationDetail = pick(slug, [
		'Wenn Bestattungshaus, Kirche oder Trauerrednerin beteiligt sind, stimme ich die musikalischen Einsätze gern direkt ab. Dadurch bleibt die Familie aus organisatorischen Rückfragen heraus.',
		'Vor Ort brauche ich nur einen sicheren Platz, ein kurzes Zeitfenster zum Stimmen und eine Person, die über Ablaufänderungen Bescheid weiß.',
		'Bei kurzfristigen Terminen helfen mir Datum, Uhrzeit, genaue Adresse, gewünschte Stücke und der Hinweis, ob Musik auch draußen geplant ist.',
		'Wenn ein Stück als Überraschung oder sehr persönlicher Wunsch gedacht ist, kann die Abstimmung diskret über eine Kontaktperson laufen.',
	], 7);
	const roomDetail = pick(slug, [
		'In kleinen Räumen wirkt die Viola oft ohne Verstärkung unmittelbar. In größeren Hallen oder draußen prüfen wir, ob der Platz näher an der Familie oder näher am Ausgang sinnvoller ist.',
		'Kirchenräume brauchen wegen Hall und Nachklang ruhigere Tempi. Am Grab dagegen wirkt ein kurzer, klarer musikalischer Satz häufig stärker als ein ganzes Stück.',
		'Wenn der Raum akustisch trocken ist, bleibt die Musik eher nah und direkt. Wenn viel Hall entsteht, müssen Einsatz und Ende besonders ruhig geführt werden.',
		'Der beste Platz ist nicht automatisch vorne. Manchmal trägt die Musik besser von der Seite, damit Blickachsen und Wege frei bleiben.',
	], 8);
	const closingDetail = pick(slug, [
		'Zum Schluss geht es nicht um Wirkung, sondern um Halt. Ein schlichtes Ende hilft, wenn Menschen aufstehen, Blumen niederlegen oder aus der Halle gehen.',
		'Für den Auszug wähle ich Musik, die tragen kann, ohne zu dramatisieren. Der Abschied soll nicht größer gemacht werden, sondern sicher gehalten werden.',
		'Am Grab ist weniger oft mehr: ein kurzer Ausschnitt, ein ruhiger letzter Ton und dann wieder Stille.',
		'Wenn nach der Feier eine Begegnung oder ein stilles Beisammensein folgt, kann die Musik den Übergang weicher machen, ohne diesen Teil zu begleiten.',
	], 9);
	const localDifference = pick(slug, [
		'Die lokale Seite ist bewusst mehr als ein Ortsname: Wege, Akustik, Friedhofsablauf und Kontaktpersonen verändern die musikalische Planung.',
		'Für Abschiede in dieser Region denke ich neben der Stückliste immer auch an Wege, Wetter und die Frage, wie nah die Musik an den Angehörigen stehen soll.',
		'Ortsbezug bedeutet hier praktische Entlastung: Wo beginnt die Musik, wie laut darf sie sein, und wo ist der beste Platz für die Viola?',
		'Gerade lokale Trauermusik darf nicht wie eine kopierte Vorlage wirken. Der Ablauf wird auf Trauerort, Angehörige und Wunschmoment abgestimmt.',
	], 5);
	const localPlanningContext = pick(slug, [
		`Für ${label} unterscheide ich zuerst zwischen Musik im Raum und Musik auf dem Friedhof. In ${venueFrame} gelten andere Fragen als am Grab: Wie weit trägt der Klang, wer sieht die Musikerin, und wann darf der letzte Ton ausklingen?`,
		`Bei Abschieden ${areaPhrase} geht es nicht nur um die Liedauswahl. Entscheidend ist auch, ob die Musik vor der Ansprache, nach einem persönlichen Text, beim Auszug oder erst draußen ihren stärksten Platz hat.`,
		`Ich plane Trauermusik ${areaPhrase} so, dass der Ablauf auch dann ruhig bleibt, wenn Reden länger dauern, Wege über den Friedhof langsamer sind oder Angehörige nach einem Ritual noch einen Moment brauchen.`,
		`Die lokale Planung beginnt bei der Frage, wie ${localFrame} den Abschied prägt. Daraus ergibt sich, ob ein getragenes Stück, ein kurzer Ausschnitt oder ein stiller Übergang besser passt.`,
	], 10);
	const remembranceDetail = pick(slug, [
		'Musik kann eine Erinnerung öffnen, ohne sie auszusprechen. Deshalb bespreche ich gern, ob ein Lied mit der verstorbenen Person verbunden ist oder ob ein klassisches Stück eher Halt geben soll.',
		'Wenn mehrere Wunschlieder im Raum stehen, ordne ich sie nach Wirkung: eines zum Sammeln, eines für Erinnerung, eines für den Schluss. Nicht jedes Stück muss vollständig gespielt werden.',
		'Manchmal reicht ein einzelner musikalischer Gedanke. Gerade bei Beerdigungen kann ein kürzerer Ausschnitt stärker wirken als eine lange Fassung, wenn die Stimmung ohnehin sehr dicht ist.',
		'Bei der Auswahl achte ich darauf, ob die Melodie auch ohne Gesang verstanden wird. Viele moderne Lieder brauchen eine ruhige Bearbeitung, damit sie würdevoll und nicht sentimental wirken.',
	], 11);
	const routeDetail = pick(slug, [
		`Für ${label} frage ich außerdem, ob Trauerfeier und Beisetzung am selben Ort stattfinden. Wenn ein Ortswechsel dazugehört, verändert das die sinnvollste Länge der Musik deutlich.`,
		`Wenn der Abschied ${areaPhrase} mehrere Stationen hat, plane ich lieber klare musikalische Inseln als durchgehende Begleitung. So bleibt jeder Moment erkennbar und der Ablauf übersichtlich.`,
		`Bei einer Feier ${areaPhrase} kann die Viola auch einen Übergang tragen: vom Ankommen in die Stille, von Worten zum Ritual oder vom letzten Gruß zurück in die Begegnung danach.`,
		`Für Termine ${areaPhrase} ist mir wichtig, dass die Musik nicht an organisatorischen Details hängt. Adresse, Ansprechpartner und Reihenfolge der Programmpunkte sollten vorab klar sein.`,
	], 12);
	const serviceBoundary = pick(slug, [
		'Diese Ortsseite ersetzt keine allgemeine Repertoireseite. Sie beantwortet die lokale Frage: Wie lässt sich ein Abschied hier vor Ort musikalisch ruhig und zuverlässig begleiten?',
		'So bleibt die Seite bewusst anders als eine reine Liedliste. Der Schwerpunkt liegt auf Ablauf, Raum, Nähe zur Familie und der konkreten Organisation am Trauerort.',
		'Der lokale Inhalt ist deshalb nicht nur SEO-Text, sondern eine praktische Entscheidungshilfe für Angehörige, Rednerinnen oder Bestattungshäuser in der Region.',
		'Für Google und für echte Anfragen ist diese Abgrenzung wichtig: Die Seite soll nicht nur Trauermusik erklären, sondern Trauermusik an diesem Ort planbar machen.',
	], 13);
	const enquiryDetail = pick(slug, [
		`Für eine Anfrage reichen zunächst Datum, Uhrzeit, genauer Ort ${areaPhrase}, gewünschter musikalischer Moment und falls vorhanden ein Wunschlied. Danach kann ich einschätzen, welche Besetzung und Länge sinnvoll ist.`,
		`Wenn noch kein Stück feststeht, genügt eine Beschreibung der Stimmung: klassisch, modern, sehr schlicht, hoffnungsvoll oder besonders persönlich. Daraus lässt sich eine passende musikalische Richtung entwickeln.`,
		`Bei kurzfristigen Abschieden hilft eine knappe, klare Anfrage. Ich prüfe dann Verfügbarkeit, Fahrzeit, mögliche Stücke und ob Musik im Raum, draußen oder an beiden Punkten realistisch ist.`,
		`Wenn die Familie entlastet werden soll, kann die weitere Abstimmung über Bestattungshaus, Kirche oder Trauerrednerin laufen. Wichtig ist nur, dass am Ende ein eindeutiges Startsignal feststeht.`,
	], 14);
	const localCeremonyDepth = pick(slug, [
		`In ${label} achte ich besonders darauf, ob der Abschied eher öffentlich, familiär oder sehr klein gehalten ist. Davon hängt ab, ob die Musik sichtbar vorne steht oder fast unauffällig aus dem Raum heraus trägt.`,
		`Für ${label} bespreche ich gern, ob Musik bereits beim Ankommen beginnen soll oder erst nach den ersten Worten. Diese Entscheidung verändert die gesamte Atmosphäre der Trauerfeier und sollte nicht zufällig entstehen.`,
		`Wenn ${venueFrame} zusammenkommen, braucht die Musik eine klare Dramaturgie. Ein Stück kann den Anfang ordnen, ein zweites kann Erinnerung öffnen, und ein Schlussstück kann den Weg nach draußen halten.`,
		`Bei Trauermusik ${areaPhrase} ist Zurückhaltung oft die stärkste Form. Ich spiele lieber mit klarer Linie, ruhigem Bogen und genug Stille zwischen den Einsätzen, damit die Worte ihren Platz behalten.`,
	], 15);
	const localSoundDecision = pick(slug, [
		'Die Viola ist dafür besonders geeignet, weil sie nicht so hell wie eine Geige wirkt und trotzdem melodisch klar bleibt. In Trauerhallen kann dieser mittlere Klang sehr menschlich und unaufdringlich tragen.',
		'Ob ein Stück klassisch, modern oder persönlich ist, entscheidet weniger über die Qualität als seine Platzierung. Ein Lied am falschen Punkt kann zu viel werden; am richtigen Punkt kann es genau den Halt geben.',
		'Ich achte darauf, dass die Musik nicht gegen Raumgeräusche, Schritte oder organisatorische Ansagen arbeiten muss. Wenn der Ablauf ruhig geplant ist, kann auch ein einzelner Ton sehr wirksam sein.',
		'Gerade draußen verändert sich der Klang schnell. Wind, Abstand und Bewegung auf dem Friedhof machen kurze, klare musikalische Formen oft sinnvoller als lange Fassungen.',
	], 16);
	const localTrustDetail = pick(slug, [
		'Für Angehörige bedeutet das: Sie müssen keine perfekte musikalische Sprache finden. Es reicht, wenn sie erzählen, was der Moment ausdrücken soll; daraus kann ich eine passende musikalische Form ableiten.',
		'Wenn mehrere Personen mitentscheiden, helfe ich dabei, die Optionen zu sortieren. Meist entsteht schnell Klarheit, wenn man jedem Stück eine konkrete Aufgabe im Ablauf gibt.',
		'Ich halte die Abstimmung bewusst ruhig und übersichtlich. Gerade in Trauerzeiten sind kurze Rückfragen, klare Vorschläge und verlässliche Zusagen wichtiger als eine lange musikalische Beratung.',
		'Wenn eine Familie unsicher ist, ob Live-Musik zu viel sein könnte, plane ich besonders reduziert: wenige Einsätze, leise Dynamik, keine Anmoderation und ein Auftreten, das den Abschied nicht unterbricht.',
	], 17);

	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Live-Viola für Abschied`,
		seoDescription: `${keyword}: Solo-Viola für Trauerfeier, Beerdigung, Bestattung und letzten Abschied. Ruhig geplant und persönlich abgestimmt.`,
		hero: {
			eyebrow: `Abschied ${areaPhrase}`,
			title: `Trauermusik ${areaPhrase}, die den Abschied ruhig trägt.`,
			lead: `Ob Trauerfeier, Beerdigung, Bestattung oder letzter Abschied: Ich begleite Abschiede ${areaPhrase} mit Solo-Viola, abgestimmt auf Ort, Ablauf und die Menschen, die Abschied nehmen.`,
			badge: 'Behutsam geplant & persönlich abgestimmt',
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Trauermusik ${areaPhrase} braucht Ruhe, Timing und verlässliche Abstimmung.`,
			lede: `${label} bedeutet für Abschiede oft: ${localFrame}. Deshalb plane ich Trauermusik nicht pauschal, sondern nach Trauerort, Raumklang, Weglänge und dem Punkt, an dem Musik wirklich helfen kann.`,
			paragraphs: [
				`Typische Rahmen sind ${venueFrame}. Dort wirkt die Viola besonders gut, wenn sie gezielt eingesetzt wird: zum Beginn, nach Erinnerungsworten, während eines stillen Rituals, beim Auszug oder kurz am Grab.`,
				`Der Klang soll ${tone} sein. Solo-Viola bleibt nah an der menschlichen Stimme, braucht wenig Aufbau und kann auch in kleinen Kapellen, Trauerhallen oder draußen sehr direkt wirken.`,
				`${planning} So entsteht kein Musikblock, sondern ein ruhiger Faden durch die Feier.`,
				`Für ${label} kläre ich vorab auch die praktischen Details: ${logistics}. Das klingt nüchtern, entscheidet aber oft darüber, ob die Musik am Tag selbst still und sicher beginnen kann.`,
				`${ceremonyDetail} Deshalb wählen wir nicht nur Stücke aus, sondern ordnen sie einem konkreten Punkt im Ablauf zu.`,
				`Das Repertoire kann ${repertoire} verbinden. Wichtig ist, dass die Musik zur Person, zum Raum und zur Familie passt.`,
				localDifference,
				locationNote,
				localFaqDetail,
				familyDetail,
				coordinationDetail,
				roomDetail,
				closingDetail,
				localPlanningContext,
				remembranceDetail,
				routeDetail,
				serviceBoundary,
				enquiryDetail,
				localCeremonyDepth,
				localSoundDecision,
				localTrustDetail,
				`Wenn mehrere Teile begleitet werden sollen, plane ich die Übergänge bewusst: ein stiller Beginn, ein kurzer Atemraum nach Worten, ein geführter Auszug und bei Bedarf ein sehr schlichter Moment am Grab.`,
			],
			seal: `${label}\nTrauerfeier & Abschied\nLive-Viola`,
		},
		elegy: {
			quote: `Trauermusik ${areaPhrase} soll nicht erklären, sondern dem Abschied einen ruhigen Halt geben.`,
			passages: [
				{
					strong: 'Der Ort',
					text: `${localFrame}. Diese konkrete Umgebung beeinflusst, ob Musik eher im Raum, am Ausgang oder draußen am Grab sinnvoll ist.`,
				},
				{
					strong: 'Der Klang',
					text: `Die Viola bleibt warm und zurückhaltend. Sie kann Trauer halten, ohne aus dem Abschied einen musikalischen Vortrag zu machen.`,
				},
				{
					strong: 'Die Abstimmung',
					text: `Ich stimme mich bei Bedarf mit Bestattungshaus, Rednerin, Pfarrer oder Familie ab, damit Angehörige am Tag selbst nicht organisieren müssen.`,
				},
				{
					strong: 'Lokaler Ablauf',
					text: `${localPlanningContext} ${routeDetail}`,
				},
				{
					strong: `${label} konkret`,
					text: locationNote,
				},
				{
					strong: 'Praktische Details',
					text: localFaqDetail,
				},
				{
					strong: 'Räume und Wege',
					text: `Für ${label} bedeutet ${venueFrame}: ${logistics}. Der Rahmen ${localFrame} verändert, ob die Musik nah bei den Angehörigen, am Ausgang, in einer Kapelle oder erst draußen sinnvoll wirkt.`,
				},
				{
					strong: 'Wunschmusik',
					text: `${remembranceDetail} ${localSoundDecision}`,
				},
				{
					strong: 'Entlastung',
					text: `${localTrustDetail} ${enquiryDetail}`,
				},
				{
					strong: 'Abgrenzung',
					text: serviceBoundary,
				},
			],
		},
		solemn: {
			eyebrow: 'Ablauf',
			title: `Wo Trauermusik ${areaPhrase} sinnvoll wirken kann.`,
			lead: 'Die genaue Dramaturgie richtet sich nach Trauerort, Zeremonieform und dem gewünschten Abschiedston.',
			cards: [
				{
					rom: 'Beginn',
					title: 'Den Raum sammeln',
					poet: 'Ein ruhiges erstes Stück hilft, bevor die ersten Worte gesprochen werden.',
					list: ['Ankommen', 'Kerze oder Foto', 'erster stiller Moment'],
				},
				{
					rom: 'Abschluss',
					title: 'Den Auszug halten',
					poet: 'Ein schlichtes Schlussstück kann den Übergang aus Trauerhalle, Kirche oder Kapelle würdevoll führen.',
					list: ['Auszug', 'Gang zum Grab', 'letzter Gruß'],
				},
			],
			listLabel: `Mögliche Einsatzpunkte ${areaPhrase}`,
			list: [
				'Beginn der Trauerfeier',
				'nach persönlichen Erinnerungen',
				'Kerzen- oder Blumenmoment',
				'Auszug oder kurzer Moment am Grab',
			],
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu Trauermusik ${areaPhrase}`,
			items: [
				{
					question: `Spielst du Trauermusik ${areaPhrase}?`,
					answer: `Ja. Ich begleite Abschiede ${areaPhrase} mit Solo-Viola, je nach Ablauf in Trauerhalle, Kirche, Kapelle, am Friedhof oder bei einer freien Abschiedsfeier.`,
					open: true,
				},
				{
					question: `Was ist bei Trauermusik ${areaPhrase} besonders wichtig?`,
					answer: localFaqDetail,
				},
				{
					question: 'Kannst du dich mit dem Bestattungshaus abstimmen?',
					answer: 'Ja. Ablauf, Ankunft, Platzierung, Einsätze und Rückfragen kann ich direkt mit Bestattungshaus, Trauerrednerin, Pfarrer oder Kontaktperson klären.',
				},
				{
					question: 'Welche Stücke passen zur Trauerfeier?',
					answer: `Häufig passen ${repertoire}. Entscheidend ist, dass das Stück zur Person und zur konkreten Stelle im Ablauf passt.`,
				},
				{
					question: 'Ist Musik draußen am Grab möglich?',
					answer: 'Ja, wenn Wetter, Untergrund und Schutz für das Instrument stimmen. Oft ist am Grab ein kurzer, sehr reduzierter Einsatz am passendsten.',
				},
				{
					question: 'Wie viele Musikstücke sind sinnvoll?',
					answer: 'Häufig reichen zwei bis vier Einsätze. Ein Stück zum Beginn, ein ruhiger Moment nach Worten und Musik zum Auszug sind oft stimmiger als ein zu dichtes Programm.',
				},
				{
					question: 'Kann die Musik sehr dezent bleiben?',
					answer: 'Ja. Die Viola kann leise und nah spielen. Gerade bei Trauerfeiern ist Zurückhaltung oft wichtiger als Lautstärke oder ein besonders langer musikalischer Beitrag.',
				},
				{
					question: 'Welche Angaben brauchst du für eine Anfrage?',
					answer: `Hilfreich sind Datum, Uhrzeit, genauer Trauerort ${areaPhrase}, der geplante Ablauf und ein Hinweis, ob Musik nur in der Trauerfeier oder auch am Grab gewünscht ist. Wenn es bereits ein Wunschstück gibt, prüfe ich direkt, ob es für Solo-Viola passt.`,
				},
				{
					question: `Warum gibt es eine eigene Seite für ${label}?`,
					answer: `Weil Trauermusik ${areaPhrase} andere praktische Fragen hat als eine allgemeine Repertoireseite. Wege, Raumakustik, Friedhofsablauf, Wetter und lokale Abstimmung verändern, wie Musik am Abschiedstag wirklich funktioniert.`,
				},
				{
					question: 'Sind kurzfristige Anfragen möglich?',
					answer: `Oft ja. Für Abschiede ${areaPhrase} melde ich mich schnell zurück, sobald Datum, Ort und ungefähre Uhrzeit feststehen.`,
				},
			],
		},
		contact: {
			eyebrow: 'Trauermusik anfragen',
			title: `Trauermusik ${areaPhrase} anfragen`,
			lead: `Schickt mir Datum, Trauerort ${areaPhrase}, Ablauf und mögliche Wunschstücke. Ich melde mich ruhig und zeitnah mit einer realistischen musikalischen Einschätzung.`,
			checklist: [
				label,
				'Trauerfeier oder Grab',
				'Wunschstück',
			],
			formEyebrow: 'Termin prüfen',
			formTitle: `Trauermusik ${areaPhrase} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer behutsamen Idee für Trauermusik ${areaPhrase}.`,
		},
		imageAltBase: `Live-Viola als Trauermusik ${areaPhrase}`,
	};
}

function buildTopic(slug) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const [keyword, eyebrow, title, audience, room, intent, repertoire, distinction] = profile;
	const keywordTitle = titleFromKeyword(keyword);
	const planning = pick(slug, [
		'Vorab klären wir Startsignal, gewünschte Länge, mögliche Pausen und den Punkt, an dem das Stück natürlich enden darf.',
		'Ich plane den Einsatz so, dass die Musik weder zu früh beginnt noch den Abschied unnötig verlängert.',
		'Wenn ein Wunschlied geplant ist, prüfe ich Melodie, Tonart und Wirkung für Solo-Viola.',
		'Die Musik bekommt eine klare Aufgabe im Ablauf, damit sie nicht wie eine zufällige Einlage wirkt.',
	], 1);
	const boundary = pick(slug, [
		'Diese Seite grenzt den Suchbegriff bewusst von allgemeineren Trauerseiten ab.',
		'Der Text ist auf diesen konkreten Intent zugeschnitten und nicht nur eine Variation der lokalen Seiten.',
		'So entsteht eine eigene Seite für den Suchbegriff, ohne dass sie mit der allgemeinen Trauermusik-Seite dieselbe Aufgabe übernimmt.',
		'Der Fokus bleibt eng genug, damit Angehörige sofort erkennen, ob diese Seite zu ihrer Frage passt.',
	], 2);
	const practical = pick(slug, [
		'Organisatorisch wichtig sind Ankunft, Raumzugang, Kontaktperson, Einsatzpunkt und die Frage, ob draußen gespielt werden soll.',
		'Gerade bei Abschieden entlastet eine klare Vorabstimmung die Familie, weil am Tag selbst möglichst wenig erklärt werden muss.',
		'Ich bespreche bei Bedarf direkt mit Bestattungshaus, Rednerin oder Kirche, wie die Musik in den Ablauf eingebunden wird.',
		'Wenn der Termin kurzfristig ist, helfen Datum, Uhrzeit, Ort und gewünschte Stücke für eine schnelle Einschätzung.',
	], 3);
	const emotionalFrame = pick(slug, [
		'Dabei bleibt die Musik bewusst schlicht. Sie soll nicht zeigen, was musikalisch möglich ist, sondern genau den Raum öffnen, den Angehörige in diesem Moment brauchen.',
		'Besonders wichtig ist der Abstand zwischen Musik und Sprache. Ein Stück darf Worte nachklingen lassen, sollte sie aber nicht kommentieren oder ersetzen.',
		'Wenn ein Lied stark mit der verstorbenen Person verbunden ist, plane ich lieber einen passenden Ausschnitt als eine vollständige Version, die den Moment zu lang macht.',
		'Je konkreter der musikalische Moment benannt wird, desto besser lässt sich das Stück auswählen: Beginn, Erinnerung, Ritual, Auszug oder letzter Gruß.',
	], 4);
	const distinctionFrame = pick(slug, [
		'So bleibt die Seite klar von benachbarten Begriffen getrennt: Sie beantwortet nicht jede Frage zu Trauermusik, sondern genau die Frage hinter diesem Keyword.',
		'Für die interne Struktur ist diese Differenzierung wichtig, weil ähnliche Begriffe sonst denselben Text tragen würden. Hier bekommt der Suchintent eine eigene redaktionelle Aufgabe.',
		'Andere Trauerseiten können breiter planen; diese Seite bleibt enger an Instrument, Lied, Ablauf oder Buchungsabsicht.',
		'Das reduziert Kannibalisierung, weil sich Zielkeyword, Textschwerpunkt, FAQ und Kontaktfrage bewusst voneinander unterscheiden.',
	], 5);
	const practicalSecond = pick(slug, [
		'Für die Anfrage reichen zunächst wenige Informationen: Termin, Ort, gewünschter Moment und falls vorhanden ein Stückwunsch. Alles Weitere kann danach ruhig abgestimmt werden.',
		'Wenn noch kein Stück feststeht, kann ich Vorschläge machen, die zu Raum, Ablauf und gewünschter Stimmung passen.',
		'Bei einer kirchlichen Feier kann zusätzlich wichtig sein, ob es musikalische Vorgaben gibt oder ob ein bestimmter Programmpunkt liturgisch festgelegt ist.',
		'Bei einer freien Trauerfeier lässt sich Musik oft flexibler setzen, sollte aber trotzdem nicht jede Pause füllen.',
	], 6);
	const soundFrame = pick(slug, [
		'Die Viola klingt tiefer und dunkler als eine Geige. Dadurch wirkt sie in Trauerräumen oft weniger hell und weniger exponiert, bleibt aber klar melodisch.',
		'Weil die Viola ohne große Technik auskommt, kann sie sehr diskret platziert werden. Das hilft besonders bei kleinen Abschieden oder engen Zeitfenstern.',
		'Der Klang trägt am besten, wenn vorab geklärt ist, ob die Musik Richtung Angehörige, Richtung Rednerpult oder Richtung Ausgang wirken soll.',
		'Bei modernen Stücken achte ich darauf, dass die Melodie auch ohne Text verstanden wird. Nicht jedes Lied behält ohne Gesang dieselbe Bedeutung.',
	], 7);
	const processFrame = pick(slug, [
		`Für ${keyword} beginne ich nicht mit einer pauschalen Stückliste, sondern mit der Rolle im Ablauf. Erst wenn klar ist, ob die Musik sammeln, erinnern oder verabschieden soll, wird die Auswahl wirklich passend.`,
		`Der praktische Ablauf entscheidet viel: Ein Stück vor der ersten Rede braucht eine andere Ruhe als ein musikalischer Gruß am Grab oder ein kurzer Moment nach dem Kerzenritual.`,
		`Ich trenne bei ${keyword} zwischen musikalischer Wirkung und Organisation. Beides muss stimmen, damit Angehörige am Tag selbst nicht erklären, suchen oder entscheiden müssen.`,
		`Die Planung bleibt bewusst schlank. Ein Solo-Instrument kann schnell reagieren, aber die wichtigsten Punkte müssen trotzdem vorab feststehen: Ort, Zeitpunkt, Einsatz und gewünschte Stimmung.`,
	], 8);
	const selectionFrame = pick(slug, [
		'Bei der Stückauswahl zählt Wiedererkennbarkeit mehr als Länge. Ein ruhiger Ausschnitt kann stärker sein als eine vollständige Version, wenn die Melodie sofort verstanden wird.',
		'Klassische Musik, moderne Lieder und persönliche Wunschstücke brauchen unterschiedliche Bearbeitungen. Entscheidend ist, dass die Melodie auf der Viola trägt und der Moment nicht überladen wird.',
		'Wenn ein Stück mit einer konkreten Erinnerung verbunden ist, behandle ich es anders als neutrale Hintergrundmusik. Dann ist die Platzierung im Ablauf besonders wichtig.',
		'Nicht jedes bekannte Lied passt automatisch. Manche Stücke wirken auf einem Solo-Instrument sehr klar, andere verlieren ohne Text oder Begleitung ihren eigentlichen Sinn.',
	], 9);
	const familyFrame = pick(slug, [
		'Für Angehörige ist oft schon viel organisiert. Darum formuliere ich die musikalischen Optionen möglichst konkret: welcher Moment, welche Länge, welches Signal, welche Alternative, falls sich etwas verschiebt.',
		'Wenn Bestattungshaus, Pfarrer, Trauerrednerin oder mehrere Familienmitglieder beteiligt sind, hilft eine gemeinsame kurze Abstimmung. So bleibt die musikalische Entscheidung ruhig und nachvollziehbar.',
		'Gerade bei emotionalen Terminen sollte Musik nicht noch eine zusätzliche Aufgabe für die Familie werden. Sie soll einen Moment halten und die Organisation im Hintergrund einfacher machen.',
		'Wenn Unsicherheit bei der Liedwahl besteht, kann ich zwei bis drei Richtungen vorschlagen: klassisch, modern reduziert oder sehr schlicht. Daraus entsteht meist schnell ein passender Rahmen.',
	], 10);
	const cannibalizationFrame = pick(slug, [
		`Diese Seite bleibt eng bei ${keyword}. Lokale Seiten beantworten Ortsfragen, Repertoireseiten ordnen mehrere Stücke, und diese Seite behandelt den konkreten Suchbegriff mit eigener FAQ, eigener Kontaktfrage und eigener musikalischer Aufgabe.`,
		`Damit die Seite nicht mit anderen Trauerseiten konkurriert, bekommt ${keyword} einen eigenen Schwerpunkt: Zielperson, Einsatzpunkt, Klangentscheidung und Anfrage unterscheiden sich bewusst vom allgemeinen Trauermusik-Text.`,
		`Die interne Verlinkung kann von hier zu allgemeinen Trauerseiten führen, aber der Haupttext bleibt bei ${keyword}. Dadurch wird klar, welche Seite für welchen Suchintent zuständig ist.`,
		`Für die SEO-Struktur ist diese Abgrenzung zentral: ${keyword} soll nicht dieselben Antworten liefern wie Musik Beerdigung, Musik Trauerfeier oder eine lokale Stadtseite.`,
	], 11);
	const requestFrame = pick(slug, [
		`Für eine Anfrage zu ${keyword} reichen zuerst Datum, Ort, Uhrzeit, geplanter Einsatzpunkt und mögliche Wunschmusik. Danach lässt sich klären, ob ein Stück, mehrere Einsätze oder ein sehr kurzer musikalischer Moment sinnvoll sind.`,
		`Wenn der Termin kurzfristig ist, helfen klare Angaben mehr als lange Erklärungen. Ich prüfe Verfügbarkeit, musikalische Machbarkeit und die Abstimmung mit den beteiligten Personen so zügig wie möglich.`,
		`Falls noch kein Wunschstück feststeht, ist das kein Problem. Dann geht es zuerst um die Stimmung: getragen, schlicht, hoffnungsvoll, klassisch, modern oder sehr persönlich.`,
		`Bei Trauerfeiern mit engem Zeitfenster plane ich ${keyword} lieber präzise als umfangreich. Ein passender Einsatz kann stärker wirken als mehrere musikalische Beiträge ohne klare Funktion.`,
	], 12);
	const ceremonyFitFrame = pick(slug, [
		`Bei ${keyword} frage ich außerdem, wie nah der musikalische Moment an Worten, Gebet, Ritual oder Auszug liegt. Je näher Musik an Sprache steht, desto schlichter muss sie beginnen und enden.`,
		`Der Begriff ${keyword} kann je nach Familie sehr Unterschiedliches meinen. Deshalb kläre ich, ob es um Inspiration, konkrete Buchung, ein bestimmtes Lied, ein Instrument oder eine einzelne Stelle im Ablauf geht.`,
		`Für ${keyword} ist ein gutes Ergebnis nicht möglichst viel Musik. Passender ist ein Moment, der den Abschied trägt, ohne ihn zu verlängern oder die Aufmerksamkeit von der verstorbenen Person wegzunehmen.`,
		`Wenn ${keyword} in einer freien Trauerfeier eingesetzt wird, kann die Musik flexibler atmen. In einer Kirche oder bei einer eng getakteten Beisetzung braucht sie dagegen klarere Einsatzpunkte.`,
	], 13);
	const roomFitFrame = pick(slug, [
		`Der Raum macht einen großen Unterschied: ${room} kann warm, hallig, trocken, eng oder offen wirken. Darum entscheide ich Tempo, Länge und Dynamik nie unabhängig von der Akustik.`,
		`In ${room} geht es auch um Sichtbarkeit. Manchmal soll die Musikerin bewusst wahrnehmbar sein, manchmal ist eine seitliche, ruhige Platzierung stimmiger für die Familie.`,
		`Wenn ${room} mit einem anschließenden Gang zum Grab verbunden ist, plane ich die Musik eher als Übergang. Dann zählt weniger das einzelne Stück als die ruhige Führung durch den Moment.`,
		`Für ${room} ist die Frage nach Verstärkung meist zweitrangig. Wichtiger ist, ob die Viola nahe genug am Geschehen steht und ob das Ende des Stücks ohne Hektik ausklingen kann.`,
	], 14);
	const songBoundaryFrame = pick(slug, [
		`So unterscheidet sich ${keyword} auch redaktionell von ähnlichen Seiten: Es geht nicht nur um Trauermusik im Allgemeinen, sondern um die konkrete Erwartung, die jemand mit genau diesem Suchbegriff verbindet.`,
		`Die Seite soll deshalb nicht jeden verwandten Begriff übernehmen. Sie verweist innerlich auf Nachbarseiten, bleibt aber im Text bei der Frage, wie ${keyword} praktisch und musikalisch gelöst wird.`,
		`Wenn ein anderes Keyword besser passt, etwa ein bestimmtes Lied oder eine lokale Stadtseite, sollte diese Seite nicht dagegen konkurrieren. Sie behält ihren eigenen Fokus im Cluster.`,
		`Diese klare Grenze hilft auch bei der späteren redaktionellen Pflege im CMS: Titel, FAQ, Alt-Texte und Kontaktabschnitt folgen demselben Intent und wirken nicht wie kopierte Varianten.`,
	], 15);
	const careFrame = pick(slug, [
		'Für die Familie soll der Prozess möglichst leicht bleiben. Ich kann mit einer kurzen Empfehlung starten, danach Stücke konkretisieren und die musikalischen Einsätze mit den beteiligten Personen abstimmen.',
		'Wenn ein Wunschlied emotional sehr aufgeladen ist, bespreche ich behutsam, ob es vollständig, gekürzt oder an einer anderen Stelle besser funktioniert. Manchmal schützt eine kurze Fassung den Moment.',
		'Musik bei Abschieden braucht Verlässlichkeit. Deshalb gehören neben dem Klang auch Pünktlichkeit, Kleidung, diskrete Kommunikation und ein ruhiger Aufbau zur eigentlichen musikalischen Leistung.',
		'Nach meiner Erfahrung entsteht die beste Wirkung, wenn die Musik nicht erklärt werden muss. Sie ist vorbereitet, beginnt im richtigen Moment und lässt danach wieder Raum für Stille.',
	], 16);

	return {
		targetKeyword: keyword,
		seoTitle: `${keywordTitle} | Live-Viola für Abschied`,
		seoDescription: `${keyword}: Solo-Viola für Trauerfeier, Beerdigung oder Abschied. Wunschmusik, Timing und Ablauf behutsam geplant.`,
		hero: {
			eyebrow,
			title,
			lead: `${keywordTitle} richtet sich an ${audience}. Ich plane Solo-Viola so, dass Klang, Timing und Ablauf zum Abschied passen und Angehörige organisatorisch entlastet werden.`,
			badge: 'Behutsam gespielt & ruhig abgestimmt',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht eine eigene musikalische Planung.`,
			lede: `${intent} Gesucht wird keine austauschbare Hintergrundmusik, sondern eine Lösung für ${room}.`,
			paragraphs: [
				`Am Anfang steht die Frage, welche Aufgabe die Musik übernehmen soll: sammeln, tragen, überleiten, erinnern, beruhigen oder einen letzten Moment halten.`,
				repertoire,
				distinction,
				`${planning} Dadurch bleibt der Ablauf sicher, auch wenn eine Rede länger dauert, Angehörige einen Moment brauchen oder Wege langsamer sind als geplant.`,
				practical,
				emotionalFrame,
				distinctionFrame,
				practicalSecond,
				soundFrame,
				processFrame,
				selectionFrame,
				familyFrame,
				cannibalizationFrame,
				requestFrame,
				ceremonyFitFrame,
				roomFitFrame,
				songBoundaryFrame,
				careFrame,
				`Solo-Viola eignet sich dafür besonders gut, weil der Klang warm, direkt und beweglich bleibt. Sie braucht wenig Aufbau und kann in Trauerhalle, Kirche, Kapelle, kleinem Raum oder draußen unterschiedlich eingesetzt werden.`,
				`Wichtig ist, dass ${keyword} nicht isoliert geplant wird. Ein Stück verändert den Moment davor und danach: Ein Beginn braucht Sammlung, ein Zwischenraum braucht Stille, ein Auszug braucht Halt.`,
				`${boundary} Andere Seiten behandeln Ort, Buchung, Instrument oder einzelne Lieder; hier geht es genau um ${keyword}.`,
			],
			seal: `${eyebrow}\nAbschied\nLive-Viola`,
		},
		elegy: {
			quote: `${keywordTitle} soll dem Abschied Raum geben, ohne Worte zu ersetzen.`,
			passages: [
				{
					strong: 'Der Suchintent',
					text: intent,
				},
				{
					strong: 'Musikalische Aufgabe',
					text: repertoire,
				},
				{
					strong: 'Abgrenzung',
					text: distinction,
				},
				{
					strong: 'Ablauf',
					text: `${processFrame} ${ceremonyFitFrame}`,
				},
				{
					strong: 'Raum und Klang',
					text: `${roomFitFrame} ${soundFrame}`,
				},
				{
					strong: 'Wunschmusik',
					text: `${selectionFrame} ${careFrame}`,
				},
				{
					strong: 'SEO-Abgrenzung',
					text: `${cannibalizationFrame} ${songBoundaryFrame}`,
				},
				{
					strong: 'Anfrage',
					text: requestFrame,
				},
			],
		},
		solemn: {
			eyebrow: 'Planung',
			title: `Worauf es bei ${keywordTitle} ankommt.`,
			lead: 'Die Details unterscheiden sich je nach Zeremonie, Raum und gewünschter Nähe. Diese Punkte sollten vor dem Abschied geklärt sein.',
			cards: [
				{
					rom: 'Rolle',
					title: 'Die Aufgabe der Musik festlegen',
					poet: `Bei ${keyword} klären wir zuerst, ob die Musik Anfang, Übergang, Erinnerung oder Schlussmoment sein soll.`,
					list: ['Beginn', 'Zwischenmoment', 'Abschluss'],
				},
				{
					rom: 'Ablauf',
					title: 'Start und Ende sicher abstimmen',
					poet: 'Ein Blickzeichen, eine Kontaktperson oder ein Stichwort verhindert Unsicherheit während der Trauerfeier.',
					list: ['Kontaktperson', 'Startsignal', 'flexibles Ende'],
				},
			],
			listLabel: `Mögliche Fragen zu ${keyword}`,
			list: [
				'Welcher Moment soll getragen werden?',
				'Ist ein Wunschstück vorgesehen?',
				'Findet etwas draußen statt?',
				'Wer gibt am Tag selbst das Signal?',
			],
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: [
				{
					question: `Für welchen Abschied passt ${keyword}?`,
					answer: `${keywordTitle} passt besonders für ${audience}. Entscheidend ist, dass Musik eine klare Aufgabe im Ablauf bekommt.`,
					open: true,
				},
				{
					question: 'Kann ein Wunschlied gespielt werden?',
					answer: 'Ja, wenn die Melodie für Solo-Viola geeignet ist. Ich prüfe Tonart, Länge und Wirkung und schlage bei Bedarf einen passenden Ausschnitt vor.',
				},
				{
					question: 'Passt das zu Trauerhalle, Kirche und Friedhof?',
					answer: 'Ja. Die genaue Planung unterscheidet sich je nach Ort, aber Solo-Viola ist für Trauerhallen, Kirchen, Kapellen und kurze Außenmomente flexibel.',
				},
				{
					question: 'Wie wird der Einsatz abgestimmt?',
					answer: 'Wir klären vorab Startsignal, Dauer, Platz im Raum, gewünschte Stimmung und mögliche Rückfragen mit Bestattungshaus, Rednerin, Kirche oder Familie.',
				},
				{
					question: 'Ist draußen spielen möglich?',
					answer: 'Ja, wenn Wetter, Untergrund und Schutz für das Instrument stimmen. Am Grab ist oft ein kurzer, schlichter Einsatz sinnvoller als ein langes Stück.',
				},
				{
					question: 'Wie viele Stücke sind für diesen Schwerpunkt sinnvoll?',
					answer: 'Das hängt vom Ablauf ab. Für viele Trauerfeiern reichen wenige Einsätze, die klar begründet sind: Anfang, Erinnerung, Übergang oder Abschluss.',
				},
				{
					question: 'Was passiert, wenn noch kein Lied feststeht?',
					answer: 'Dann ordnen wir zuerst den Moment ein. Danach kann ich Stücke vorschlagen, die zu Raum, Person und gewünschter Zurückhaltung passen.',
				},
				{
					question: 'Warum gibt es dazu eine eigene Seite?',
					answer: `${keywordTitle} hat einen eigenen Suchintent. Diese Seite beantwortet deshalb nicht nur allgemein, welche Trauermusik möglich ist, sondern ordnet genau diesen Begriff nach Ablauf, Klang, Wunschmusik, Abgrenzung zu ähnlichen Seiten und konkreter Anfrage ein.`,
				},
				{
					question: 'Welche Informationen helfen für die erste Einschätzung?',
					answer: `Für ${keyword} helfen Datum, Ort, Uhrzeit, gewünschter Moment im Ablauf, vorhandene Wunschstücke und die Frage, ob die Musik in der Trauerfeier, draußen am Grab oder an beiden Stellen geplant ist.`,
				},
				{
					question: 'Wie kurzfristig können wir anfragen?',
					answer: 'Oft auch kurzfristig. Wichtig sind Datum, Ort, Uhrzeit, grober Ablauf und die gewünschte Musik, damit ich schnell prüfen kann, ob der Termin möglich ist.',
				},
			],
		},
		contact: {
			eyebrow: 'Trauermusik planen',
			title: `${keywordTitle} anfragen`,
			lead: `Schickt mir Datum, Ort, Ablauf und den Moment, für den ihr ${keyword} plant. Ich melde mich mit einer behutsamen musikalischen Idee.`,
			checklist: [
				keyword,
				'Trauerfeier oder Grab',
				'Wunschstück',
			],
			formEyebrow: 'Anfrage senden',
			formTitle: `${keywordTitle} anfragen`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ${keyword}.`,
		},
		imageAltBase: `Live-Viola für ${keyword}`,
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
