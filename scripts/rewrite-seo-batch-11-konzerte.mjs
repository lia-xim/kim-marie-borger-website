import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'konzerte';
const STATUS = 'rewritten-batch-11-review-needed';
const BATCH_NOTE = 'Batch 11: Konzert- und Kulturseiten vollständig nach Ort, Format, Instrument und Programm-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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

function loc(label, area, scene, venues, logistics, audience, programme, tone) {
	return { label, area, scene, venues, logistics, audience, programme, tone };
}

const LOCATION_PROFILES = {
	aachen: loc('Aachen', 'in Aachen', 'Aachen verbindet historische Räume, Hochschulnähe, internationales Publikum und Kulturorte im Dreiländereck.', 'Möglich sind Kammerkonzert, Vernissage, Lesung, Empfang, Salonabend oder ein kurzes Kulturprogramm in Altstadt, Institut, Hotel oder privatem Haus.', 'Altstadtwege, ältere Gebäude, Einlasszeiten und Hall im Raum sollten mit Puffer geplant werden.', 'Das Publikum ist oft gemischt aus Kulturinteresse, Fachgästen und Familie.', 'Ein Programm für Aachen darf klassisch beginnen, aber durch kurze Moderationen und moderne Stücke offen bleiben.', 'historisch, hell und europäisch'),
	'bergisches-land': loc('Bergisches Land', 'im Bergischen Land', 'Das Bergische Land bringt Höhenlagen, besondere Häuser, kleinere Kulturorte und ein Publikum mit Sinn für Nähe zusammen.', 'Passend sind Salonkonzert, Hauskonzert, Vernissage, Matinee, Lesung oder Kulturabend in Hof, Villa, Kirche, Galerie oder Hotel.', 'Wetter, Wege, Außenflächen und ein geschützter Platz für die Viola müssen früh geklärt werden.', 'Viele Gäste erwarten keinen steifen Konzertsaal, sondern einen konzentrierten Abend mit persönlicher Atmosphäre.', 'Im Bergischen Land funktioniert ein Programm gut, wenn es Raum, Natur und Klang miteinander atmen lässt.', 'naturnah, kammermusikalisch und ruhig'),
	'bergisch-gladbach': loc('Bergisch Gladbach', 'in Bergisch Gladbach', 'Bergisch Gladbach liegt zwischen Kölner Nähe, Bensberger Eleganz und bergischem Rückzug.', 'Geeignet sind Vernissage, Salon, private Matinee, Kulturabend, Empfang oder musikalische Rahmung in Villa, Galerie, Hotel oder Restaurant.', 'Zufahrt, Parken und die genaue Position der Musik sollten wegen kurzer Wechsel zwischen Empfang, Rede und Programm feststehen.', 'Das Publikum kann sehr kunstnah, privat oder unternehmerisch geprägt sein.', 'Ein Programm in Bergisch Gladbach darf elegant wirken, sollte aber nicht zu groß oder distanziert werden.', 'elegant, persönlich und kultiviert'),
	bielefeld: loc('Bielefeld', 'in Bielefeld', 'Bielefeld verbindet Altstadt, Sparrenburg-Nähe, Hochschulumfeld und ruhige Kulturformate in Ostwestfalen.', 'Möglich sind Kammermusikabend, Lesung, privates Konzert, Galerieprogramm oder Empfang mit kuratiertem musikalischem Teil.', 'Die weitere Anfahrt braucht klare Zeitfenster, damit Stimmen, Licht und Einlass ohne Druck möglich sind.', 'Gäste hören oft aufmerksam und mögen Programme, die gut erklärt und nicht überladen sind.', 'Für Bielefeld plane ich gern einen klaren Bogen: ruhiger Auftakt, erzählerische Mitte und ein warmer Schluss.', 'klar, gesammelt und erzählerisch'),
	bochum: loc('Bochum', 'in Bochum', 'Bochum steht für direkte Kulturorte, urbane Räume, Ruhrgebietsnähe und Formate mit wenig steifer Distanz.', 'Geeignet sind Kulturabend, Lesung, Vernissage, Empfang, moderner Salon oder ein kurzer Programmpunkt in Theater-, Galerie- oder Eventraum.', 'Ladeweg, Eingang, Licht und Startsignal sollten konkret benannt werden, weil viele Orte mehrere Zugänge haben.', 'Das Publikum ist oft offen für persönliche Ansprache und Programme mit direktem Ton.', 'In Bochum darf die Viola nahbar klingen und klassische Stücke mit modernen Farben verbinden.', 'direkt, warm und urban'),
	bonn: loc('Bonn', 'in Bonn', 'Bonn verbindet Rheinlage, Wissenschaft, Verbände, internationale Gäste und kultivierte Kammermusikorte.', 'Passend sind Salonkonzert, Stiftungsempfang, Lesung, Vernissage, Tagungsabschluss oder ein Kammerprogramm in Villa, Museum, Hotel oder privatem Raum.', 'Rheinverkehr, Innenstadtlogistik und ein möglicher Ortswechsel zwischen Tagung und Abend sollten mit Puffer geplant werden.', 'Das Publikum ist häufig konzentriert, mehrsprachig und offen für kurze inhaltliche Einordnungen.', 'Ein Bonner Programm darf fein gebaut sein: präzise, elegant und ohne unnötige Show.', 'kultiviert, ruhig und international'),
	bottrop: loc('Bottrop', 'in Bottrop', 'Bottrop eignet sich für persönliche Kulturabende, kleine Konzerte und unkomplizierte Formate im westlichen Ruhrgebiet.', 'Möglich sind Salonabend, privates Konzert, Lesung, Empfang, Jubiläum oder ein musikalischer Kulturteil in Saal, Restaurant oder Unternehmensraum.', 'Ein schlanker Aufbau, guter Sichtkontakt und eine feste Kontaktperson reichen meist für einen sicheren Ablauf.', 'Das Publikum erwartet häufig Nähe statt Konzertbetrieb.', 'Ein Programm in Bottrop funktioniert besonders gut, wenn es wertig bleibt und trotzdem bodenständig erzählt wird.', 'nahbar, bodenständig und warm'),
	dormagen: loc('Dormagen', 'in Dormagen', 'Dormagen liegt zwischen Düsseldorf und Köln und bringt Rheinorte, Zons, Knechtsteden und regionale Kulturorte zusammen.', 'Geeignet sind Kammerkonzert, Empfang, Vernissage, Lesung, Matinee oder privater Salon in Kirche, Klosterumfeld, Hof oder Restaurant.', 'Anfahrt aus mehreren Richtungen, Treffpunkt und Wechsel zwischen Empfang und Programm sollten früh geklärt sein.', 'Gäste kommen oft aus Düsseldorf, Köln und der Region.', 'Ein Dormagener Programm kann historische Räume aufnehmen und trotzdem leicht, offen und zugänglich bleiben.', 'rheinisch, verbindend und ruhig'),
	dortmund: loc('Dortmund', 'in Dortmund', 'Dortmund bietet moderne Eventorte, Kulturflächen, Phoenixsee-Umfeld und ein direktes Publikum im östlichen Ruhrgebiet.', 'Passend sind Kulturabend, Vernissage, Lesung, Firmenkulturformat, Salonkonzert oder musikalischer Programmpunkt bei Empfang und Gala.', 'Bei weitläufigen Locations sollten Treffpunkt, Licht, Sitzordnung und Position zum Rednerpult vorab feststehen.', 'Das Publikum reagiert gut auf klare Dramaturgie und persönliche Moderationen.', 'Für Dortmund plane ich Programme, die nicht zu filigran beginnen, sondern schnell eine Atmosphäre setzen.', 'prägnant, warm und präsent'),
	duesseldorf: loc('Düsseldorf', 'in Düsseldorf', 'Düsseldorf verbindet Galerien, Rheinlage, Messe, Hotels, Agenturen und repräsentative Kultur- und Eventräume.', 'Geeignet sind Vernissage, Salonkonzert, Lesung, Empfang, Produktabend, Kulturprogramm oder private Matinee in Galerie, Hotel, Showroom oder Haus.', 'Innenstadtverkehr, Ladezone, Aufzug, Licht und Einlass müssen präzise abgestimmt werden.', 'Das Publikum erwartet häufig einen hochwertigen, aber nicht überinszenierten musikalischen Rahmen.', 'Ein Düsseldorfer Programm darf elegant und kuratiert sein, mit klarer Form und wenigen starken Übergängen.', 'elegant, urban und konzentriert'),
	duisburg: loc('Duisburg', 'in Duisburg', 'Duisburg verbindet Innenhafen, Industriegeschichte, Rhein-Ruhr-Lage und Kulturorte mit robustem Charakter.', 'Möglich sind Kulturabend, Empfang, Vernissage, Lesung, Hafenevent oder ein Kammerprogramm in Foyer, Galerie, Saal oder privatem Raum.', 'Größere Distanzen im Stadtgebiet, Parkflächen und genaue Eingänge sollten früh abgestimmt werden.', 'Das Publikum schätzt Programme, die klar, warm und nicht zu akademisch wirken.', 'In Duisburg kann die Viola Räume stark verwandeln, wenn das Programm genug Wärme und Kontur hat.', 'klar, kräftig und warm'),
	erkrath: loc('Erkrath', 'in Erkrath', 'Erkrath liegt nah an Düsseldorf und wirkt bei Kulturformaten oft grüner, kleiner und persönlicher.', 'Passend sind Hauskonzert, Salon, Lesung, kleine Vernissage, Matinee oder Empfang in Hochdahl, Unterfeldhaus oder Neandertalnähe.', 'Kurze Wege helfen, dennoch sollten Aufbauplatz, Licht und ein möglicher Außenbereich sauber geklärt sein.', 'Das Publikum ist häufig nah am Anlass und hört persönlicher als in einem großen Saal.', 'Ein Erkrather Programm darf leise beginnen und über Erzählung in eine konzentrierte Mitte führen.', 'persönlich, naturverbunden und leise'),
	essen: loc('Essen', 'in Essen', 'Essen verbindet Konzernstandorte, Kulturorte, Rüttenscheid, Baldeneysee und zentrale Ruhrgebietslagen.', 'Geeignet sind Gala-Moment, Kulturabend, Vernissage, Lesung, Salonkonzert, Empfang oder Dinnerprogramm in Saal, Villa, Foyer oder Seelocation.', 'Stadtverkehr, Locationzugang und ein realistischer Puffer vor dem ersten Stück sind wichtig.', 'Das Publikum kann kunstnah, unternehmerisch oder privat gemischt sein.', 'Ein Programm in Essen braucht Balance: genug Eleganz für besondere Räume und genug Direktheit für Ruhrgebietsatmosphäre.', 'wertig, warm und ausbalanciert'),
	gelsenkirchen: loc('Gelsenkirchen', 'in Gelsenkirchen', 'Gelsenkirchen bringt direkte Ruhrgebietskultur, lokale Veranstaltungen und persönliche Empfangsformate zusammen.', 'Möglich sind Lesung, Kulturabend, Empfang, kleines Konzert, Vernissage oder ein offizieller musikalischer Akzent.', 'Ankunft, Parken und erster Einsatz sollten eindeutig geplant sein, damit der Abend ohne Unruhe beginnt.', 'Das Publikum erwartet eher einen ehrlichen Live-Moment als eine große Kunstgeste.', 'In Gelsenkirchen darf die Viola unmittelbar wirken und die Stücke sollten gut einordenbar sein.', 'ehrlich, nah und herzlich'),
	haan: loc('Haan', 'in Haan', 'Haan hat kurze Wege, Gartenstadt-Charakter und Kulturformate zwischen Düsseldorf und Wuppertal.', 'Geeignet sind Hauskonzert, Salonabend, Lesung, Vernissage, Empfang oder privates Kulturprogramm.', 'Der Aufbau sollte kompakt bleiben und der erste Einsatz mit Gastgeberperson oder Leitung abgestimmt sein.', 'Das Publikum ist oft überschaubar und sehr nah am musikalischen Geschehen.', 'Für Haan plane ich Programme, die leise Räume ernst nehmen und trotzdem genug festliche Kontur haben.', 'leicht, persönlich und kammermusikalisch'),
	hagen: loc('Hagen', 'in Hagen', 'Hagen verbindet Sauerlandnähe, Kulturorte, Volme und regionale Veranstaltungen mit weiterem Einzugsgebiet.', 'Passend sind Kulturabend, Lesung, Kammerkonzert, Empfang, Vernissage oder ein privates Programm mit Blick ins Grüne.', 'Anreise, Wetteroptionen und ein klarer Aufbauplatz sind bei Randlagen besonders wichtig.', 'Gäste hören häufig aufmerksam, wenn das Programm einen nachvollziehbaren Bogen hat.', 'Ein Hagener Programm darf landschaftliche Ruhe und expressive Stücke verbinden.', 'getragen, regional und offen'),
	heiligenhaus: loc('Heiligenhaus', 'in Heiligenhaus', 'Heiligenhaus eignet sich für kleinere Kulturformate, Eröffnungen und private Konzerte zwischen Ratingen und Velbert.', 'Möglich sind Salon, Empfang, Lesung, Vernissage, Hauskonzert oder ein kurzer offizieller Kulturmoment.', 'Zugang, Licht, Wetterschutz und ein kurzer Ablaufkontakt sollten vorab geklärt werden.', 'Das Publikum erwartet oft eine schlanke, hochwertige Lösung ohne großen Bühnenaufbau.', 'Ein Programm in Heiligenhaus wirkt stark, wenn jedes Stück eine klare Aufgabe hat.', 'schlicht, ruhig und verbindlich'),
	herne: loc('Herne', 'in Herne', 'Herne liegt mitten im Ruhrgebiet und passt zu Kulturabenden, Lesungen und nahbaren Konzertformaten.', 'Geeignet sind Lesung, Empfang, privates Konzert, Vernissage, Kulturabend oder ein kurzer Programmpunkt.', 'Timing, Eingang und Einsatzpunkt sollten klar gesetzt werden, weil viele Veranstaltungen kompakt laufen.', 'Das Publikum reagiert gut auf direkte Ansprache und warme musikalische Übergänge.', 'In Herne plane ich lieber präzise kurze Sets als ein zu langes Programm ohne Pause.', 'nahbar, klar und freundlich'),
	hilden: loc('Hilden', 'in Hilden', 'Hilden liegt zwischen Düsseldorf, Solingen und Langenfeld und eignet sich für kompakte Kultur- und Empfangsformate.', 'Passend sind Salonkonzert, Lesung, Vernissage, Empfang, Jubiläum oder ein musikalischer Abend in kleinem Saal oder Restaurant.', 'Raumgröße, Licht, Startsignal und Übergang zu Reden oder Empfang sollten genau notiert werden.', 'Gäste erleben Musik dort oft als bewussten Akzent im Ablauf.', 'Ein Hildener Programm sollte gut dosiert sein: nicht zu lang, aber mit klarer dramaturgischer Linie.', 'geordnet, fein und warm'),
	iserlohn: loc('Iserlohn', 'in Iserlohn', 'Iserlohn verbindet Sauerlandnähe, Mittelstand und Kulturabende mit regionalem Publikum.', 'Möglich sind Kammerkonzert, Lesung, privater Salon, Vernissage, Empfang oder ein Kulturteil bei einem Jubiläum.', 'Längere Wege und Wetteroptionen sollten früh geklärt werden, besonders bei Außenmomenten.', 'Das Publikum schätzt natürliche Moderation und Programme ohne unnötige Schwere.', 'Für Iserlohn kann ein Programm ruhig beginnen und mit rhythmischeren Stücken in den Ausklang gehen.', 'getragen, natürlich und konzentriert'),
	koeln: loc('Köln', 'in Köln', 'Köln verbindet Veedel, Rheinlage, Galerien, Medien, Messe und ein lebendiges Kulturpublikum.', 'Geeignet sind Vernissage, Lesung, Salon, Kulturabend, Empfang, Messe-Side-Event oder privates Konzert.', 'Bei dichter Stadtlage sind Treffpunkt, Parken, Ladeweg und Startzeit besonders genau zu planen.', 'Das Publikum ist oft offen, kommunikativ und erwartet Musik, die zugänglich bleibt.', 'Ein Kölner Programm darf lebendig sein und klassische Tiefe mit moderner Leichtigkeit verbinden.', 'lebendig, rheinisch und kunstnah'),
	krefeld: loc('Krefeld', 'in Krefeld', 'Krefeld verbindet Niederrhein, Stadtwald, Textiltradition und kultivierte private Räume.', 'Passend sind Salonkonzert, Matinee, Lesung, Vernissage, Empfang oder Kulturabend in Villa, Galerie, Restaurant oder Foyer.', 'Raumgröße und Lautstärke sollten vorab geklärt werden, damit die Viola präsent bleibt und nicht überdeckt wird.', 'Das Publikum erwartet häufig einen gepflegten, ruhigen Ton.', 'Ein Krefelder Programm darf elegant sein, sollte aber genug Nähe und Erzählung behalten.', 'gepflegt, ruhig und niederrheinisch'),
	'kreis-mettmann': loc('Kreis Mettmann', 'im Kreis Mettmann', 'Der Kreis Mettmann verbindet Erkrath, Haan, Hilden, Ratingen, Velbert und viele kleinere Kulturorte.', 'Möglich sind Hauskonzert, Salon, Vernissage, Lesung, Empfang, Kulturabend oder Matinee in mehreren Städten.', 'Stadtgrenzen, Anfahrt und genaue Adresse sollten sauber geplant werden.', 'Das Publikum ist oft regional gemischt und nah am Anlass.', 'Im Kreis Mettmann braucht das Programm eine lokale Klarheit, damit es nicht wie eine austauschbare Düsseldorf-Seite wirkt.', 'regional, verbindend und kammermusikalisch'),
	langenfeld: loc('Langenfeld', 'in Langenfeld', 'Langenfeld liegt zwischen Düsseldorf, Leverkusen und Monheim und eignet sich für gut erreichbare Kulturformate.', 'Geeignet sind Salonabend, Lesung, Vernissage, Empfang, privates Konzert oder ein musikalischer Programmpunkt.', 'Ablauf, Parken und Setdauer sollten kompakt geplant werden, damit der Abend ohne Leerlauf startet.', 'Gäste kommen häufig aus mehreren Nachbarstädten.', 'Für Langenfeld plane ich Programme mit klaren Blöcken, die Empfang, Musik und Gespräch gut verbinden.', 'leicht, klar und zugänglich'),
	leverkusen: loc('Leverkusen', 'in Leverkusen', 'Leverkusen verbindet Industrie, Rheinlage, Opladen, Schlebusch und Kulturorte zwischen Köln und Bergischem Land.', 'Passend sind Kulturabend, Empfang, Lesung, Vernissage, Firmenkulturformat oder privates Kammerkonzert.', 'Anfahrt zwischen Stadtteilen, Einlass und mögliche Sicherheitsabläufe sollten vorher klar sein.', 'Das Publikum kann geschäftlich, privat oder kulturorientiert gemischt sein.', 'Ein Leverkusener Programm darf repräsentativ wirken, sollte aber durch Moderation und Stückwahl persönlich bleiben.', 'klar, beweglich und verbindend'),
	meerbusch: loc('Meerbusch', 'in Meerbusch', 'Meerbusch steht für elegante private und geschäftliche Anlässe nahe Düsseldorf.', 'Geeignet sind Salonkonzert, Empfang, private Matinee, Vernissage, Dinnerprogramm oder ein ruhiger Kulturabend.', 'Position im Raum, pünktlicher Beginn und ein ruhiger Aufbau sind meist wichtiger als große Technik.', 'Das Publikum erwartet oft einen unaufdringlichen, sehr gepflegten Klang.', 'In Meerbusch sollte das Programm edel, aber nicht kühl sein: warm, kurz erklärt und fein dosiert.', 'fein, diskret und elegant'),
	mettmann: loc('Mettmann', 'in Mettmann', 'Mettmann liegt im Kreis Mettmann, nah am Neandertal, und passt zu Kulturformaten mit regionaler Bindung.', 'Möglich sind Hauskonzert, kleiner Salon, Lesung, Vernissage, Empfang oder musikalischer Jubiläumsmoment.', 'Aufbauplatz, Startsignal und Licht sollten mit einer Kontaktperson geklärt werden.', 'Das Publikum ist häufig nah an Gastgebern oder Veranstaltern.', 'Ein Mettmanner Programm wirkt besonders gut, wenn es persönliche Stückbezüge und kurze Erklärungen enthält.', 'nah, regional und ruhig'),
	moenchengladbach: loc('Mönchengladbach', 'in Mönchengladbach', 'Mönchengladbach verbindet Rheydt, Wickrath, Niederrhein und Kulturformate mit großer regionaler Breite.', 'Passend sind Vernissage, Salon, Lesung, Empfang, Kammerkonzert oder ein musikalischer Akzent bei Jubiläum und Feier.', 'Größere Wege im Stadtgebiet und der richtige Moment für den Einsatz sollten feststehen.', 'Das Publikum ist oft generationsgemischt und offen für persönliche Programme.', 'Ein Programm in Mönchengladbach kann traditionsbewusst beginnen und modern ausklingen.', 'familiär, warm und niederrheinisch'),
	moers: loc('Moers', 'in Moers', 'Moers steht für Niederrhein, Schlossnähe und Kulturformate zwischen Duisburg und Kamp-Lintfort.', 'Geeignet sind Kulturabend, Lesung, Vernissage, Hauskonzert, Empfang oder Matinee.', 'Bei Außenbereichen sollten Wetterschutz, Untergrund und Nähe zum Publikum geklärt werden.', 'Gäste hören oft entspannt, aber sehr aufmerksam, wenn der Rahmen nicht zu groß gemacht wird.', 'Für Moers plane ich Programme mit ruhigem Einstieg und einem klaren, warmen Schluss.', 'niederrheinisch, ruhig und freundlich'),
	'monheim-am-rhein': loc('Monheim am Rhein', 'in Monheim am Rhein', 'Monheim am Rhein verbindet Rheinpromenade, Baumberg und Kulturformate zwischen Düsseldorf und Leverkusen.', 'Möglich sind Empfang, Vernissage, Salonabend, Lesung, privates Konzert oder Kulturprogramm mit Rheinbezug.', 'Rheinlage, Wetter und ein möglicher Wechsel zwischen innen und außen sollten früh eingeplant werden.', 'Das Publikum ist oft regional gemischt und mag einen zugänglichen Live-Moment.', 'Ein Programm in Monheim kann den Rheincharakter aufnehmen: leicht, fließend und nicht zu schwer.', 'hell, rheinisch und gelassen'),
	'muelheim-an-der-ruhr': loc('Mülheim an der Ruhr', 'in Mülheim an der Ruhr', 'Mülheim an der Ruhr verbindet Ruhrtal, Broich, Saarn und Kulturformate mit grüner Stadtnähe.', 'Geeignet sind Salonkonzert, Matinee, Lesung, Vernissage, Empfang oder Kulturabend am Wasser oder im privaten Raum.', 'Wege am Wasser, Parken und ein trockener Aufbauplatz sollten vorab geklärt sein.', 'Das Publikum erwartet häufig eine ruhige, geschmackvolle Atmosphäre.', 'Für Mülheim plane ich Programme, die Stille zulassen und den Abend nicht mit zu vielen Stücken füllen.', 'grün, ruhig und fein'),
	muenster: loc('Münster', 'in Münster', 'Münster verbindet Universität, Altstadt, Aasee, Kirchenräume und eine helle, kultivierte Kulturatmosphäre.', 'Passend sind Kammerkonzert, Lesung, Salon, Vernissage, Tagungsabschluss oder Matinee.', 'Innenstadtlogistik, Fahrradverkehr und Einlasszeiten sollten mit ausreichend Puffer geplant werden.', 'Das Publikum ist häufig aufmerksam und offen für gut erklärte Programme.', 'Ein Programm in Münster darf fein, leicht und gedanklich klar gebaut sein.', 'hell, kultiviert und erzählerisch'),
	neuss: loc('Neuss', 'in Neuss', 'Neuss verbindet Rheinlage, Quirinus-Nähe, Düsseldorf-Anbindung und eigene Kulturorte.', 'Möglich sind Salonkonzert, Empfang, Lesung, Vernissage, privates Konzert oder ein Kulturteil im historischen Rahmen.', 'Treffpunkt, Ladeweg und Übergang zwischen Empfang und Musik sollten feststehen.', 'Das Publikum ist oft regional und zugleich großstadtnah geprägt.', 'Ein Neusser Programm kann rheinische Offenheit mit kammermusikalischer Konzentration verbinden.', 'rheinisch, klar und warm'),
	'nordrhein-westfalen': loc('Nordrhein-Westfalen', 'in Nordrhein-Westfalen', 'Nordrhein-Westfalen umfasst Rheinland, Ruhrgebiet, Bergisches Land, Westfalen und sehr unterschiedliche Kulturorte.', 'Geeignet sind Konzert, Vernissage, Lesung, Salonabend, Kulturprogramm, Empfang oder Event in NRW.', 'Region, Fahrzeit, Setlänge, Licht, Raumgröße und Technikbedarf werden individuell geprüft.', 'Das Publikum kann je nach Stadt kunstnah, privat, geschäftlich oder sehr familiär sein.', 'Für NRW plane ich kein Einheitsprogramm, sondern unterscheide deutlich zwischen Galerie, Salon, Lesung, Bühne und Empfang.', 'vielseitig, professionell und beweglich'),
	oberhausen: loc('Oberhausen', 'in Oberhausen', 'Oberhausen verbindet westliches Ruhrgebiet, Kulturorte und unkomplizierte Empfangsformate.', 'Passend sind Kulturabend, Lesung, Vernissage, Empfang, kleines Konzert oder musikalischer Programmpunkt.', 'Startzeit, Parken und Aufbau sollten nicht zu knapp geplant werden.', 'Das Publikum schätzt klare Programme ohne übertriebene Förmlichkeit.', 'In Oberhausen funktioniert ein Programm, wenn es schnell Atmosphäre schafft und danach Raum für Begegnung lässt.', 'freundlich, direkt und warm'),
	paderborn: loc('Paderborn', 'in Paderborn', 'Paderborn verbindet Hochschulnähe, Ostwestfalen, historische Räume und klar strukturierte Kulturformate.', 'Möglich sind Kammerkonzert, Lesung, Vernissage, Tagungsabschluss, Empfang oder private Matinee.', 'Anreise und Setlänge sollten früh abgestimmt werden, damit die weitere Strecke sinnvoll in den Ablauf passt.', 'Das Publikum hört oft konzentriert und mag Programme mit nachvollziehbarer Dramaturgie.', 'Ein Paderborner Programm darf präzise und ruhig sein, mit wenigen gut gesetzten Höhepunkten.', 'geordnet, konzentriert und hell'),
	ratingen: loc('Ratingen', 'in Ratingen', 'Ratingen liegt nah an Düsseldorf, Flughafen, Messe und ruhigen privaten Kulturorten.', 'Geeignet sind Empfang, Salonkonzert, Vernissage, Lesung, private Matinee oder Kulturprogramm für Gäste aus mehreren Städten.', 'Kurze Distanzen helfen, trotzdem sollten Einlass, Parken und Startsignal klar abgestimmt werden.', 'Das Publikum kann international, geschäftlich oder privat geprägt sein.', 'Ein Ratinger Programm sollte elegant und flexibel bleiben, besonders wenn es zwischen Empfang und Gespräch liegt.', 'diskret, elegant und beweglich'),
	recklinghausen: loc('Recklinghausen', 'in Recklinghausen', 'Recklinghausen verbindet Altstadt, Ruhrgebiet, Kultur und regionale Veranstaltungen am nördlichen Rand der Region.', 'Passend sind Lesung, Vernissage, Salonabend, Empfang, Kulturprogramm oder kleines Konzert.', 'Anfahrt, Parken und ein ruhiger Aufbaupunkt sollten vorab geklärt werden.', 'Das Publikum mag Programme, die Wertigkeit zeigen und trotzdem nahbar bleiben.', 'Für Recklinghausen plane ich klare musikalische Akzente lieber kürzer und präziser als zu lang.', 'regional, warm und klar'),
	remscheid: loc('Remscheid', 'in Remscheid', 'Remscheid steht für bergische Höhen, Lennep, Mittelstand und Kulturformate mit handwerklich-regionalem Charakter.', 'Möglich sind Hauskonzert, Salon, Lesung, Vernissage, Empfang oder musikalischer Abend im kleineren Rahmen.', 'Wetter, Wege, Höhenlage und Zugang sollten bei Außenmomenten realistisch geplant werden.', 'Gäste erwarten oft eine persönliche und nicht zu glatte Atmosphäre.', 'Ein Remscheider Programm darf warm und handgemacht klingen, ohne musikalisch beliebig zu werden.', 'bergisch, direkt und warm'),
	'rhein-kreis-neuss': loc('Rhein-Kreis Neuss', 'im Rhein-Kreis Neuss', 'Der Rhein-Kreis Neuss umfasst Neuss, Meerbusch, Dormagen, Grevenbroich und Rheinorte zwischen Metropolen und Niederrhein.', 'Geeignet sind Salon, Empfang, Vernissage, Lesung, privates Konzert oder Kulturabend in mehreren Städten.', 'Stadtgrenzen, Fahrzeit und genaue Location sollten flexibel, aber verbindlich geplant werden.', 'Das Publikum ist häufig regional vernetzt und trotzdem nah am Anlass.', 'Im Rhein-Kreis Neuss sollte das Programm verbindend wirken und nicht nur eine einzelne Stadt kopieren.', 'regional, rheinisch und verbindend'),
	rheinland: loc('Rheinland', 'im Rheinland', 'Das Rheinland steht für offene Gespräche, Rheinorte, Galerien, private Salons und gesellige Kulturformate.', 'Passend sind Vernissage, Lesung, Salonkonzert, Kulturabend, Empfang oder Matinee.', 'Region, Fahrzeit, Setlänge und Raumwirkung sollten je nach Stadt einzeln abgestimmt werden.', 'Gäste erwarten oft Zugänglichkeit, Wärme und einen nicht zu schweren Ton.', 'Ein rheinisches Programm darf kommunikativer sein und klassische Musik mit erzählerischen Übergängen öffnen.', 'offen, warm und kunstnah'),
	'rhein-ruhr': loc('Rhein-Ruhr', 'in der Rhein-Ruhr-Region', 'Rhein-Ruhr verbindet Düsseldorf, Köln, Essen, Dortmund, Duisburg und viele Kultur- und Eventräume auf engem Raum.', 'Möglich sind Konzert, Vernissage, Lesung, Kulturabend, Empfang, Messe-Side-Event oder privater Salon.', 'Verkehr, Einlass, Stadtgrenzen und Zeitpuffer müssen in dieser Region besonders realistisch geplant werden.', 'Das Publikum kommt oft aus mehreren Städten und braucht einen verbindenden Programmbogen.', 'Für Rhein-Ruhr plane ich Programme, die flexibel genug für Galerie, Foyer und Salon bleiben.', 'verbindend, urban und beweglich'),
	ruhrgebiet: loc('Ruhrgebiet', 'im Ruhrgebiet', 'Das Ruhrgebiet verbindet viele Städte, direkte Kultur, Industriegeschichte und lebendige kleine Bühnen.', 'Geeignet sind Kulturabend, Lesung, Vernissage, Empfang, Salonkonzert, Jubiläum oder musikalischer Programmpunkt.', 'Startsignal, Lautstärke, Licht und Position im Raum sollten früh geklärt sein.', 'Das Publikum schätzt Live-Musik, wenn sie nicht künstlich distanziert wirkt.', 'Ein Programm im Ruhrgebiet darf herzlich, deutlich und kammermusikalisch zugleich sein.', 'direkt, herzlich und präsent'),
	siegen: loc('Siegen', 'in Siegen', 'Siegen verbindet Siegerland, Oberstadt, Hochschulnähe und Kulturformate mit weiterem regionalem Einzugsgebiet.', 'Passend sind Kammerkonzert, Lesung, Salon, Empfang, Vernissage oder ein Kulturabend im Grünen oder privaten Raum.', 'Längere Anfahrt, Zeitfenster und Setdauer sollten zusammen geplant werden.', 'Gäste hören oft konzentriert, wenn der Abend eine klare innere Linie hat.', 'Für Siegen plane ich Programme mit ruhigem Grundton und einem nicht zu schweren Abschluss.', 'still, regional und konzentriert'),
	solingen: loc('Solingen', 'in Solingen', 'Solingen steht für bergische Lage, Gräfrath, Ohligs und Kulturformate mit handwerklicher Identität.', 'Möglich sind Hauskonzert, Salon, Lesung, Vernissage, Empfang oder Kulturabend.', 'Bei Häusern, Höhenlagen und Außenflächen sollten Zugang, Wetter und Aufbauplatz früh besprochen werden.', 'Das Publikum erwartet häufig einen persönlichen, nicht zu sterilen Rahmen.', 'Ein Solinger Programm darf handgemacht und warm sein, mit klaren melodischen Bögen.', 'bergisch, nah und charaktervoll'),
	unna: loc('Unna', 'in Unna', 'Unna liegt zwischen Ruhrgebiet und Hellweg und eignet sich für Kulturabende mit regionaler Gästestruktur.', 'Geeignet sind Lesung, Vernissage, Empfang, Salonkonzert, privates Konzert oder Matinee.', 'Anfahrt, Aufbau und erster Einsatz sollten ohne Hektik aufeinander abgestimmt werden.', 'Gäste mögen Programme, die einen Arbeitstag ruhig in einen Abend überführen.', 'Ein Programm in Unna sollte klar beginnen und den Ausklang freundlich öffnen.', 'klar, freundlich und leicht'),
	velbert: loc('Velbert', 'in Velbert', 'Velbert verbindet Neviges, Langenberg und Kulturorte zwischen Ruhrgebiet und Bergischem Land.', 'Passend sind Salonabend, Hauskonzert, Vernissage, Lesung, Empfang oder kleines Konzert.', 'Bei Steigungen, Wegen und Außenflächen sollte genug Zeit für Aufbau eingeplant werden.', 'Das Publikum ist häufig regional und nah am Veranstaltungsort.', 'Ein Velberter Programm kann bergische Ruhe mit einem festlichen, aber nicht übergroßen Klang verbinden.', 'warm, bergisch und ruhig'),
	wuelfrath: loc('Wülfrath', 'in Wülfrath', 'Wülfrath hat kurze Wege, bergische Nähe und Kulturformate mit überschaubarem Publikum.', 'Möglich sind Hauskonzert, Lesung, kleine Vernissage, Salonabend, Empfang oder Matinee.', 'Ruhiger Aufbau, Licht und ein klarer Einsatzmoment passen gut zu kompakten Formaten.', 'Gäste sitzen oft näher an der Musik als in klassischen Konzertsälen.', 'Für Wülfrath plane ich Programme, die klein bleiben dürfen und gerade dadurch intensiv wirken.', 'schlicht, nah und hell'),
	wuppertal: loc('Wuppertal', 'in Wuppertal', 'Wuppertal verbindet Elberfeld, Barmen, Höhenlagen, Kulturorte und besondere Räume entlang der Wupper.', 'Geeignet sind Vernissage, Lesung, Salonkonzert, Kulturabend, Empfang oder ein Programm in Altbau, Galerie oder Saal am Hang.', 'Treppen, Wege, Parken und Wetter sollten konkret eingeplant werden.', 'Das Publikum ist oft kulturinteressiert und offen für atmosphärische Programme.', 'Ein Wuppertaler Programm darf Raum und Topografie aufnehmen: beweglich, ausdrucksvoll und nicht zu glatt.', 'atmosphärisch, beweglich und kunstnah'),
};

function topic(keyword, title, audience, setting, intent, role, distinction, planning, proof, programme) {
	return { keyword, title, audience, setting, intent, role, distinction, planning, proof, programme };
}

const TOPIC_PROFILES = {
	'bratsche-konzert': topic('Bratsche Konzert', 'Bratsche im Konzert mit warmem Solo-Klang.', 'Veranstalterinnen, Gastgeber und Kulturorte, die gezielt den tieferen Streicherklang suchen', 'Bühne, Salon, Vernissage, Lesung oder kammermusikalischer Abend', 'Der Suchbegriff fragt nach dem Instrument Bratsche und nach seiner Eignung für ein Konzertformat.', 'Ich spiele Viola beziehungsweise Bratsche als Soloinstrument mit klassischer, moderner und erzählerischer Programmgestaltung.', 'Diese Seite beantwortet die Instrumentenfrage und grenzt sich von allgemeinen Event- und Konzertseiten ab.', 'Wichtig sind Raumgröße, Programmlänge, gewünschte Moderation und die Frage, ob das Instrument im Mittelpunkt steht.', 'Die Bratsche trägt Wärme, Tiefe und eine seltenere Klangfarbe in ein Konzert.', 'Ein Bratschenprogramm kann Bach, romantische Miniaturen und moderne Linien verbinden.'),
	bratschenkonzert: topic('Bratschenkonzert', 'Bratschenkonzert als kuratierter Kammermusikabend.', 'Kulturveranstalter, private Gastgeber und kleine Bühnen mit Interesse am Solo-Repertoire der Bratsche', 'Kammermusik, Hauskonzert, Salon, Matinee oder Kulturreihe', 'Bratschenkonzert meint stärker ein eigenständiges Konzert als bloße Begleitmusik.', 'Ich entwickle einen dramaturgischen Bogen, der das Instrument vorstellt und dem Publikum Zugang gibt.', 'Diese Seite bleibt näher am Konzertbegriff als Bratsche Konzert und behandelt Programm, Dauer und Moderation.', 'Wir klären, ob ein abendfüllender Rahmen, ein kürzeres Matinee-Programm oder ein moderiertes Format passt.', 'Ein Bratschenkonzert wirkt besonders, weil das Instrument vertraut und zugleich überraschend klingt.', 'Ein Programm kann mit Prélude beginnen, über Gesangliches führen und mit Rhythmus oder Zugabe öffnen.'),
	'klassische-musik-event': topic('Klassische Musik Event', 'Klassische Musik für Events mit Solo-Viola.', 'Unternehmen, Kulturorte und private Gastgeber, die einen hochwertigen klassischen Akzent suchen', 'Empfang, Gala, Vernissage, Dinner, Kulturabend oder offizieller Programmpunkt', 'Der Intent liegt zwischen Event und Konzert: Klassik soll Atmosphäre und Wertigkeit geben, ohne den Anlass zu dominieren.', 'Ich wähle klassische Stücke, die auch in kurzen Sets tragen und zum Raum passen.', 'Diese Seite grenzt sich von Live-Musik-Event ab, weil sie bewusst klassische Klangsprache und Repertoire behandelt.', 'Wichtig sind Anlass, Gästeprofil, Gesprächsanteil, Setdauer und ob Musik Hintergrund oder Programmpunkt sein soll.', 'Solo-Viola kann klassische Musik elegant und platzsparend in Events bringen.', 'Ein klassisches Set kann Bach, Massenet, Elgar und eine ruhige Zugabe verbinden.'),
	'live-musik-event': topic('Live Musik Event', 'Live-Musik für Events, die wirklich im Raum entsteht.', 'Eventplaner, Unternehmen, Galerien und Gastgeber, die eine flexible Live-Lösung suchen', 'Empfang, Kulturabend, Vernissage, Gala, Lesung, Dinner oder Produktmoment', 'Gesucht wird eine buchbare Live-Musik-Lösung, nicht nur eine Playlist oder reine Hintergrundmusik.', 'Ich setze die Viola je nach Anlass als Empfangsmusik, kuratierten Akzent oder kleines Konzert ein.', 'Diese Seite ist breiter als Konzert, Vernissage oder Lesung und bündelt die Event-Buchungsfrage.', 'Wir klären Ziel des Events, Gästezahl, Raum, Lautstärke, Ablauf und die gewünschte Sichtbarkeit der Musik.', 'Live-Viola reagiert auf Raum und Publikum und wirkt dadurch persönlicher als abgespielte Musik.', 'Ein Event-Programm kann kurz, modular und mit klaren Übergängen gebaut werden.'),
	'live-musik-konzert': topic('Live Musik Konzert', 'Live-Musik im Konzertformat mit Viola.', 'Gastgeber und Veranstalter, die ein echtes Konzert oder einen konzertanten Programmpunkt planen', 'Salonkonzert, Kammermusikabend, Matinee, Kulturreihe oder moderierter Konzertblock', 'Der Begriff verbindet Live-Musik mit Konzertabsicht: Das Publikum soll bewusst zuhören.', 'Ich plane Programme mit Anfang, Bogen, Ruhepunkten und Ausklang statt loser Stückfolge.', 'Diese Seite grenzt sich von Live-Musik-Event ab, weil Zuhören und Dramaturgie im Vordergrund stehen.', 'Wichtig sind Länge, Sitzordnung, Licht, Moderation, Pause und der gewünschte Konzertcharakter.', 'Ein Live-Konzert mit Viola kann auch in kleinen Räumen intensiv wirken.', 'Das Programm kann von Barock über Romantik bis zu moderneren Miniaturen führen.'),
	'musik-kulturabend': topic('Musik Kulturabend', 'Musik für Kulturabende mit dramaturgischem Bogen.', 'Kulturvereine, Gastgeber, Stiftungen und Orte, die Musik mit Text, Kunst oder Gespräch verbinden', 'Kulturabend, Gesprächsformat, Themenabend, Empfang oder kleiner Bühnenrahmen', 'Kulturabend meint meist ein gemischtes Format, bei dem Musik Teil eines inhaltlichen Abends ist.', 'Ich setze die Viola als verbindenden Faden zwischen Text, Moderation, Gespräch und Atmosphäre ein.', 'Diese Seite unterscheidet sich von Salonkonzert, weil nicht nur Musik, sondern ein ganzer Abend im Fokus steht.', 'Wir klären Thema, Reihenfolge, Textanteile, Reden, Länge der Musik und mögliche Übergänge.', 'Viola kann Kulturabende konzentrieren, ohne den inhaltlichen Kern zu überdecken.', 'Ein Kulturabend-Programm arbeitet mit kurzen Blöcken, Zwischentönen und einem Schluss, der Gespräch öffnet.'),
	'musik-lesung': topic('Musik Lesung', 'Musik für Lesungen, die Text atmen lässt.', 'Autorinnen, Veranstalter, Buchhandlungen, Kulturorte und private Gastgeber mit Lesungsformat', 'Lesung, Literaturabend, Buchpremiere, Gespräch, Vernissage mit Text oder Salonabend', 'Bei Lesungen darf Musik den Text nicht kommentieren, sondern Übergänge und Atemräume schaffen.', 'Ich plane kurze musikalische Inseln vor, zwischen oder nach Textblöcken.', 'Diese Seite grenzt sich von Vernissage und Kulturabend ab, weil Sprache, Rhythmus und Stille der Lesung entscheidend sind.', 'Wichtig sind Textlänge, Anzahl der Leseblöcke, Mikrofon, Licht, Sitzordnung und gewünschte Stimmung.', 'Solo-Viola eignet sich für Lesungen, weil sie wenig Technik braucht und sehr fein auf Sprache reagieren kann.', 'Ein Lesungsprogramm nutzt Miniaturen, Pausen und Motive statt langer Konzertstücke.'),
	'musik-salonkonzert': topic('Musik Salonkonzert', 'Musik für Salonkonzerte mit Nähe zum Publikum.', 'Private Gastgeber, Kulturorte und kleine Reihen, die ein konzentriertes Konzert im nahen Raum planen', 'Salon, Wohnzimmer, Villa, Galerie, kleiner Saal oder privater Konzertabend', 'Salonkonzert meint ein intimes Konzertformat, bei dem Publikum, Raum und Moderation nah beieinander sind.', 'Ich kuratiere Programme mit persönlicher Ansprache, überschaubarer Länge und klarer Dramaturgie.', 'Diese Seite unterscheidet sich von Live-Musik-Event, weil Zuhören und kammermusikalische Nähe im Mittelpunkt stehen.', 'Wir klären Raumgröße, Sitzplätze, Pause, Dauer, Moderation und ob Wünsche in das Programm integriert werden sollen.', 'Viola funktioniert im Salon besonders gut, weil ihr Klang warm und direkt erlebbar ist.', 'Ein Salonprogramm kann wie ein Gespräch gebaut sein: Ankommen, Vertiefung, Pause, Ausklang.'),
	'musik-vernissage': topic('Musik Vernissage', 'Musik für Vernissagen mit Raum für Kunst und Gespräch.', 'Galerien, Künstler, Kuratoren und Gastgeber, die eine Ausstellung musikalisch öffnen möchten', 'Vernissage, Ausstellungseröffnung, Galerieabend, Kunstempfang oder kuratierter Rundgang', 'Bei Vernissagen muss Musik Kunst, Raum und Gespräche respektieren.', 'Ich spiele kurze Sets oder gezielte Akzente, die Atmosphäre schaffen und den Blick auf die Arbeiten offen lassen.', 'Diese Seite grenzt sich von Salonkonzert ab, weil nicht Zuhören allein, sondern Kunstbetrachtung und Begegnung im Mittelpunkt stehen.', 'Wichtig sind Raumwege, Reden, Hängung, Gästezahl, Lautstärke und die Frage, ob Musik beim Einlass oder nach der Eröffnung wirkt.', 'Solo-Viola kann einer Vernissage Wärme geben, ohne die Ausstellung akustisch zu überdecken.', 'Ein Vernissage-Programm ist modular: Auftakt, Rede-Rahmung, leiser Fluss, kurzer Schlussakzent.'),
	'viola-konzert': topic('Viola Konzert', 'Viola Konzert mit persönlicher Dramaturgie.', 'Veranstalter, Kulturorte und Gastgeber, die die Viola bewusst als Soloinstrument erleben möchten', 'Kammerkonzert, Salon, Vernissage, Lesung, Kulturabend oder privater Konzertabend', 'Viola Konzert ist der zentrale Instrumentenbegriff im Konzertcluster.', 'Ich stelle Programme zusammen, die die warme Mittellage der Viola zeigen und dem Publikum Zugang geben.', 'Diese Seite ist die Haupt-Topicseite für das Instrument und grenzt sich von Bratsche, Bratschenkonzert und Eventmusik ab.', 'Wichtig sind Programmlänge, Raum, Publikum, Moderation und die Balance zwischen bekannten Stücken und Entdeckungen.', 'Die Viola klingt nah, menschlich und weniger hell als eine Geige, was sie für kleine Konzertformate besonders stark macht.', 'Ein Viola-Programm kann Bach, Romantik, moderne Miniaturen und eine persönliche Zugabe verbinden.'),
};

const PROGRAMME_FRAMES = [
	'Ein Konzertprogramm braucht nicht viele Stücke, sondern eine innere Richtung: ein Anfang, der den Raum öffnet, eine Mitte mit Tiefe und ein Schluss, der das Publikum nicht abrupt entlässt.',
	'Ich plane die Musik nicht als austauschbare Liste. Entscheidend ist, ob die Viola zuhören lässt, einen Text rahmt, Kunst begleitet oder einen Empfang kultivierter macht.',
	'Kurze Anmoderationen können helfen, besonders wenn das Publikum nicht aus einem klassischen Konzertkontext kommt.',
	'Die Länge entsteht aus Anlass und Aufmerksamkeit: dreißig Minuten können perfekt sein, wenn sie präzise gebaut sind; ein längerer Abend braucht Pausen und Kontraste.',
	'Auch die Stille gehört zum Programm. Gerade bei Viola wirkt ein bewusst gesetzter Zwischenraum oft stärker als ein weiterer schneller Wechsel.',
	'Wenn Wunschstücke geplant sind, prüfe ich, ob sie solistisch tragen und wie sie dramaturgisch eingebettet werden können.',
];

const FAQ_ANGLES = [
	['Wie lang sollte ein Konzertprogramm sein?', 'Je nach Format sind 30 bis 45 Minuten, ein geteilter Abend mit Pause oder ein kurzer musikalischer Akzent sinnvoll. Entscheidend ist die Aufmerksamkeit des Publikums.'],
	['Kannst du Stücke anmoderieren?', 'Ja. Kurze Anmoderationen können ein Programm zugänglicher machen, ohne den musikalischen Fluss zu unterbrechen.'],
	['Brauchst du Technik?', 'In vielen Räumen reicht akustische Viola mit gutem Licht. Bei größeren Räumen oder offenen Flächen bespreche ich dezente Verstärkung.'],
	['Kann ein Wunschstück integriert werden?', 'Ja, wenn es auf Solo-Viola funktioniert und zum dramaturgischen Bogen passt. Ich prüfe Melodie, Tonart und Wirkung vorab.'],
	['Ist das eher Konzert oder Begleitung?', 'Beides ist möglich. Der Unterschied liegt im Fokus: Beim Konzert hört das Publikum bewusst zu, bei Begleitung rahmt die Musik andere Inhalte.'],
	['Kann das Programm mit Lesung oder Kunst kombiniert werden?', 'Ja. Gerade Viola eignet sich gut für Übergänge zwischen Text, Bild, Gespräch und konzentriertem Zuhören.'],
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
	return images.map((image) => ({
		src: image.src,
		alt: `${base} mit Kim Marie Borger und Viola`,
	}));
}

function localFaq(slug, profile, keyword) {
	const extraOne = pick(slug, FAQ_ANGLES, 1);
	const extraTwo = pick(slug, FAQ_ANGLES, 3);
	return [
		{
			question: `Spielst du Viola-Konzerte ${profile.area}?`,
			answer: `Ja. Ich gestalte Konzerte, Vernissagen, Lesungen, Salonabende, Kulturprogramme und besondere Eventformate ${profile.area} mit Solo-Viola.`,
			open: true,
		},
		{
			question: `Welche Formate passen ${profile.area}?`,
			answer: `${profile.venues} Die genaue Länge hängt davon ab, ob das Publikum zuhören, ankommen, Kunst betrachten oder zwischen Textblöcken wechseln soll.`,
		},
		{
			question: `Was ist organisatorisch ${profile.area} wichtig?`,
			answer: profile.logistics,
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
			question: 'Kann das Programm klassisch und modern sein?',
			answer: 'Ja. Ich kombiniere klassische Stücke, romantische Miniaturen, moderne Linien oder persönliche Wünsche so, dass ein schlüssiger Bogen entsteht.',
		},
		{
			question: `Warum passt Solo-Viola für ${keyword}?`,
			answer: `Die Viola klingt warm, nah und selten genug, um Aufmerksamkeit zu wecken. Gleichzeitig bleibt sie schlank genug für kleine Räume, Galerien und private Konzertformate.`,
		},
		{
			question: `Welche Angaben helfen für eine Anfrage ${profile.area}?`,
			answer: 'Hilfreich sind Datum, Ort, Anlass, gewünschte Länge, Raumgröße, Publikum, Ablauf, Lichtsituation und ob Moderation gewünscht ist.',
		},
	];
}

function topicFaq(slug, profile) {
	const extraOne = pick(slug, FAQ_ANGLES, 2);
	const extraTwo = pick(slug, FAQ_ANGLES, 4);
	return [
		{
			question: `Für wen passt ${profile.keyword}?`,
			answer: `${profile.keyword} passt für ${profile.audience}. Entscheidend ist, ob Musik zuhören lässt, rahmt oder einen Übergang gestaltet.`,
			open: true,
		},
		{
			question: `Was unterscheidet diese Seite von allgemeiner Eventmusik?`,
			answer: profile.distinction,
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
			question: 'Wie wird das Programm geplant?',
			answer: `${profile.planning} Danach entsteht ein Programm mit Anfang, Kontrast, möglicher Pause und passendem Schluss.`,
		},
		{
			question: 'Kannst du moderieren?',
			answer: 'Ja. Kurze, persönliche Einordnungen zu Stücken oder zum Instrument machen ein Konzert oft nahbarer.',
		},
		{
			question: 'Ist Solo-Viola auch für kleine Räume geeignet?',
			answer: 'Ja. Gerade in kleinen Räumen trägt die Viola sehr direkt und braucht meist keine große Technik.',
		},
		{
			question: `Welche Angaben brauchst du für ${profile.keyword}?`,
			answer: 'Datum, Ort, Raum, Publikum, gewünschte Dauer, Anlass, Ablauf und vorhandene Wunschstücke reichen für eine erste Einschätzung.',
		},
	];
}

function buildLocal(slug, doc) {
	const profile = LOCATION_PROFILES[slug];
	if (!profile) throw new Error(`Missing location profile for ${slug}`);
	const keyword = `Viola Konzert ${profile.label}`;
	const frameOne = pick(slug, PROGRAMME_FRAMES, 1);
	const frameTwo = pick(slug, PROGRAMME_FRAMES, 2);
	const frameThree = pick(slug, PROGRAMME_FRAMES, 3);

	return {
		targetKeyword: keyword,
		seoTitle: `${keyword} | Kultur & Event`,
		seoDescription: `${keyword}: Solo-Viola für Vernissage, Lesung, Salonkonzert, Kulturabend und besondere Events.`,
		hero: {
			eyebrow: 'Konzert & Event',
			title: `Viola Konzert ${profile.area} für Kulturabende mit Dramaturgie.`,
			lead: `${profile.scene} Ich kuratiere Solo-Viola-Programme für Konzert, Vernissage, Lesung, Salon und besondere Bühnen.`,
			badge: 'Kammermusik, Salon & Kulturformat',
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Ein Viola-Programm ${profile.area} muss zum Raum und Publikum passen.`,
			lede: `${profile.audience} Genau danach entstehen Länge, Stückfolge, Moderation und Klangwirkung.`,
			paragraphs: [
				profile.scene,
				profile.venues,
				profile.logistics,
				profile.audience,
				profile.programme,
				`Für ${keyword} ist der Ton bewusst ${profile.tone}. Das Programm soll nicht wie ein beliebiger Musikblock wirken, sondern den Ort, den Anlass und die Aufmerksamkeit der Gäste aufnehmen.`,
				frameOne,
				frameTwo,
				frameThree,
				`Ich beginne die Planung mit der Frage, ob das Publikum wirklich zuhört oder ob Musik Kunst, Text, Empfang oder Gespräch rahmt. Daraus ergibt sich ein anderes Tempo und eine andere Stücklänge.`,
				`Bei Vernissagen ${profile.area} darf die Musik den Blick auf Kunst nicht versperren. Kurze Sets, klare Pausen und eine seitliche Position sind oft stärker als ein durchgehendes Konzert.`,
				`Bei Lesungen ${profile.area} achte ich auf Atemräume. Die Viola kann vor einem Text sammeln, nach einem Abschnitt nachklingen oder einen Themenwechsel weich vorbereiten.`,
				`Für Salonkonzerte ${profile.area} plane ich persönlicher: mit Nähe zum Publikum, möglichen Anmoderationen und einer Stückfolge, die auch ohne großes Bühnenbild trägt.`,
				`Bei Empfangs- oder Eventformaten verändert sich die Aufgabe: Musik soll Qualität zeigen, aber den Anlass nicht übernehmen. Dann sind modulare Sets oft sinnvoller als ein langer Block.`,
				`Die Viola eignet sich für diese Formate, weil sie warm und ungewöhnlich klingt. Sie braucht wenig Fläche, kann akustisch sehr direkt wirken und ist trotzdem flexibel genug für unterschiedliche Räume.`,
				`Wenn ein Wunschstück eingebunden werden soll, prüfe ich, ob es solo trägt und an welcher Stelle es dramaturgisch sinnvoll ist. Nicht jedes bekannte Stück wirkt ohne Begleitung gleich stark.`,
				`Diese Seite fokussiert bewusst ${keyword}. Andere Seiten im Cluster behandeln Vernissage, Lesung, Salonkonzert, Live-Musik-Event oder Instrumentenfragen; hier geht es um den konkreten lokalen Konzertintent.`,
				`Für eine Anfrage reichen Datum, Ort, Raumart, Publikum, gewünschte Länge und grober Ablauf. Danach kann ich einschätzen, ob ein kurzes Kulturset, ein moderiertes Programm oder ein Salonabend passt.`,
			],
			seal: `${profile.label}\nKonzert\nViola`,
		},
		focus: {
			eyebrow: 'Programmidee',
			title: `Ein möglicher Bogen für ${keyword}.`,
			heading: 'Programm',
			subtitle: `Viola-Abend ${profile.label}`,
			items: [
				{ title: 'Auftakt: ein ruhiger Raumöffner', detail: `Bach, Telemann oder eine freie Prélude-Idee für ${profile.tone}` },
				{ title: 'Erzählende Mitte', detail: `Romantische Miniatur oder modernes Stück für ${profile.audience}` },
				{ title: 'Kurzer Übergang', detail: 'Moderation, Textbezug oder bewusste Stille' },
				{ title: 'Kontrast mit Bewegung', detail: 'Piazzolla, Tanzform oder zeitgenössische Farbe' },
				{ title: 'Ausklang', detail: `Zugabe oder persönliches Wunschstück für ${profile.area}` },
			],
			footnote: `Das konkrete Programm für ${keyword} wird nach Raum, Anlass, Publikum und gewünschter Dauer zusammengestellt.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keyword}`,
			items: localFaq(slug, profile, keyword),
		},
		contact: {
			eyebrow: 'Konzert anfragen',
			title: `${keyword} anfragen`,
			lead: `Schick mir Datum, Ort, Format und gewünschte Programmlänge ${profile.area}. Ich melde mich mit einer passenden Idee für Solo-Viola.`,
			checklist: [
				keyword,
				'Konzert, Vernissage oder Lesung',
				'Raum, Publikum & Programmlänge',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt ein Viola-Programm ${profile.area}?`,
			formSuccess: `Danke - ich melde mich mit einer Idee für ein Viola Konzert ${profile.area}.`,
		},
		imageAlts: altText(doc, `Viola Konzert ${profile.area}`),
	};
}

function buildTopic(slug, doc) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const keywordTitle = titleFromKeyword(profile.keyword);
	const frameOne = pick(slug, PROGRAMME_FRAMES, 6);
	const frameTwo = pick(slug, PROGRAMME_FRAMES, 7);
	const frameThree = pick(slug, PROGRAMME_FRAMES, 8);

	return {
		targetKeyword: profile.keyword,
		seoTitle: `${keywordTitle} | Solo-Viola`,
		seoDescription: `${profile.keyword}: kuratiertes Solo-Viola-Programm für Konzert, Kulturabend, Vernissage, Lesung oder Event.`,
		hero: {
			eyebrow: 'Konzert & Kultur',
			title: profile.title,
			lead: `${profile.intent} Ich plane Solo-Viola so, dass Programm, Raum, Publikum und Anlass zusammenpassen.`,
			badge: 'Kuratierte Programme mit Viola',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht eine eigene dramaturgische Aufgabe.`,
			lede: `${profile.audience} suchen Musik für ${profile.setting}. Deshalb bekommt dieser Begriff eine eigene Seite im Konzertcluster.`,
			paragraphs: [
				profile.intent,
				profile.role,
				profile.distinction,
				profile.planning,
				profile.proof,
				profile.programme,
				`Bei ${profile.keyword} geht es zuerst um die Hörsituation. Sitzt das Publikum konzentriert, bewegt es sich durch eine Ausstellung, hört es einer Lesung zu oder entsteht der musikalische Moment zwischen Gesprächen?`,
				frameOne,
				frameTwo,
				frameThree,
				`Ich wähle Stücke danach aus, ob sie solistisch auf der Viola tragen und zum Format passen. Ein Werk, das im Konzertsaal stark ist, kann bei einer Vernissage zu groß wirken; eine Miniatur kann dagegen genau richtig sein.`,
				`Auch Moderation wird bewusst entschieden. Manchmal braucht das Publikum einen kurzen Einstieg in das Instrument oder den Komponisten, manchmal soll Musik ohne Erklärung zwischen zwei Texten stehen.`,
				`Die Dauer folgt nicht einer Standardliste. Ein konzentrierter Block von dreißig Minuten kann stärker sein als ein langer Abend, wenn das Format eigentlich auf Begegnung oder Kunstbetrachtung zielt.`,
				`Bei längeren Programmen plane ich Kontraste: warme Linie, rhythmischer Impuls, Stille, ein bekanntes Stück und ein überraschender Schluss.`,
				`Diese Seite bleibt bewusst bei ${profile.keyword}. Ortsseiten beantworten lokale Fragen, andere Topic-Seiten behandeln Vernissage, Lesung, Salon, Live-Musik-Event oder Bratsche als Instrument.`,
				`Für eine Anfrage reichen Datum, Ort, Publikum, Anlass, gewünschte Länge und die Frage, ob Musik im Mittelpunkt steht oder einen anderen Inhalt rahmt.`,
				`So entsteht ein Konzertformat, das nicht nur schön klingt, sondern die Aufmerksamkeit im Raum bewusst führt.`,
			],
			seal: `${keywordTitle}\nKultur\nViola`,
		},
		focus: {
			eyebrow: 'Programmidee',
			title: `Ein möglicher Aufbau für ${keywordTitle}.`,
			heading: 'Programm',
			subtitle: keywordTitle,
			items: [
				{ title: 'Eröffnung', detail: 'Ein Stück, das den Raum sammelt und die Klangfarbe der Viola vorstellt' },
				{ title: 'Kontext', detail: `Kurze Moderation oder thematische Brücke für ${profile.setting}` },
				{ title: 'Kernstück', detail: profile.programme },
				{ title: 'Kontrast', detail: 'Moderne Farbe, Tanzimpuls oder persönliche Bearbeitung' },
				{ title: 'Schluss', detail: 'Ruhiger Ausklang oder Zugabe mit offenem Gesprächscharakter' },
			],
			footnote: `${profile.keyword} wird je nach Anlass als Konzert, Rahmung oder kuratierter Programmpunkt geplant.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: topicFaq(slug, profile),
		},
		contact: {
			eyebrow: 'Programm anfragen',
			title: `${keywordTitle} anfragen`,
			lead: `Schick mir Datum, Ort, Publikum und gewünschte Länge für ${profile.keyword}. Ich melde mich mit einer passenden Programmidee für Solo-Viola.`,
			checklist: [
				profile.keyword,
				profile.setting,
				'Dauer, Raum & Publikum',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt ${keywordTitle} zu deinem Format?`,
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
