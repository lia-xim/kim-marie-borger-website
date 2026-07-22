import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SERVICE = 'firmenfeiern';
const STATUS = 'rewritten-batch-9-review-needed';
const BATCH_NOTE = 'Batch 9: Firmenfeier-Seiten vollständig nach Ort, Business-Format, Anlass und Instrument-Intent umgeschrieben. Fachlich im CMS final prüfen.';

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

function location(label, area, business, venue, logistics, detailOne, detailTwo, clientLens) {
	return { label, area, business, venue, logistics, detailOne, detailTwo, clientLens };
}

const LOCATION_PROFILES = {
	aachen: location(
		'Aachen',
		'in Aachen',
		'Altstadt, Campus-Nähe, internationale Gäste und repräsentative Termine im Dreiländereck prägen viele Business-Events in Aachen.',
		'Geeignet sind Empfangssituationen in historischen Räumen, Hotellobbys, Institutsgebäuden, Gewölbekellern oder modernen Tagungsflächen.',
		'Längere Anfahrt, Altstadtwege und Einlasszeiten sollten mit einem klaren Puffer geplant werden.',
		'In Aachen achte ich besonders darauf, wie viel Hall ein Raum hat und ob Musik eher beim Ankommen oder als kurzer offizieller Akzent wirken soll.',
		'Bei Kunden aus mehreren Ländern hilft ein instrumentaler Klang, weil er ohne Sprache funktioniert und trotzdem einen sehr persönlichen Rahmen setzt.',
		'Für Unternehmen in Aachen ist oft wichtig, dass der musikalische Teil kultiviert wirkt, aber den fachlichen Austausch nicht ausbremst.',
	),
	'bergisches-land': location(
		'Bergisches Land',
		'im Bergischen Land',
		'Höhenlagen, kleinere Manufakturen, Familienunternehmen und Locations mit viel Grün geben Firmenevents im Bergischen Land einen sehr eigenen Charakter.',
		'Musik passt hier zu Sommerfest, Hofempfang, Jubiläum, Dinner, Eröffnung oder einem Kundenabend in einem Hotel oder Restaurant mit Aussicht.',
		'Wetter, Wege, Außenflächen und ein trockener Platz für das Instrument müssen hier früher geklärt werden als in einer Innenstadtlocation.',
		'Im Bergischen Land plane ich Sets lieber flexibel, weil Gäste häufig zwischen Terrasse, Innenraum und Empfangsbereich wechseln.',
		'Die Viola kann bei diesen Formaten warm und handgemacht wirken, ohne den Anlass rustikal oder privat erscheinen zu lassen.',
		'Für regionale Unternehmen ist der Ton oft wertig, aber bodenständig: professionell, nahbar und nicht zu inszeniert.',
	),
	'bergisch-gladbach': location(
		'Bergisch Gladbach',
		'in Bergisch Gladbach',
		'Bensberg, Refrath, Kölner Nähe und bergische Ruhe machen Business-Events in Bergisch Gladbach sehr unterschiedlich.',
		'Die Viola eignet sich für Villa, Hotel, Restaurant, Kundentermin, Sommerempfang oder ein ruhiges Dinner nach einem Workshop.',
		'Parken, Zufahrt und die Position der Musik sollten wegen kurzer Wechsel zwischen Empfang, Essen und Rede früh feststehen.',
		'In Bergisch Gladbach ist häufig eine elegante, aber nicht laute Atmosphäre gefragt, weil viele Veranstaltungen zwischen Privatheit und Repräsentation liegen.',
		'Ich setze die Musik dort gern so, dass sie Räume öffnet, bevor Gespräche beginnen, und später wieder zurückgenommen werden kann.',
		'Für Unternehmen am Rand von Köln ist die Abgrenzung wichtig: Es soll hochwertig klingen, aber nicht nach großem Showprogramm aussehen.',
	),
	bielefeld: location(
		'Bielefeld',
		'in Bielefeld',
		'Bielefeld verbindet Tagungsorte, Industrie, Hochschulnähe und Feiern rund um den Teutoburger Wald.',
		'Live-Viola passt zu Firmenjubiläum, Dinner, Kundenempfang, Preisverleihung oder einem Abendprogramm nach einer Konferenz.',
		'Die weitere Anfahrt braucht verlässliche Zeitfenster, damit Stimmen, Aufbau und ein kurzer Soundcheck ohne Druck möglich sind.',
		'Für Bielefeld plane ich den musikalischen Einsatz sehr genau, weil Business-Termine oft in enger Tagesdramaturgie liegen.',
		'Ein Solo-Instrument ist hier praktisch, wenn der Ablauf zwischen Vorträgen, Essen und Networking nicht durch Technik belastet werden soll.',
		'Für Gäste, die bereits einen langen Arbeitstag hinter sich haben, darf Musik eher sortieren und entspannen als zusätzliche Aufmerksamkeit fordern.',
	),
	bochum: location(
		'Bochum',
		'in Bochum',
		'Bochum steht für direkte Kommunikation, urbane Kulturorte, Technologie, Ruhrgebietsnähe und Business-Events mit wenig steifer Distanz.',
		'Geeignet sind moderne Eventflächen, Kulturhäuser, Firmenfeiern, Empfänge, Galas im kleineren Rahmen und Dinners mit vielen Gesprächen.',
		'Ladeweg, Parken, Eingang und Startsignal sollten konkret benannt werden, weil viele Orte mehrere Zugänge oder Ebenen haben.',
		'In Bochum darf die Musik hochwertig sein, ohne die Veranstaltung künstlich aufzublähen.',
		'Ich achte dort darauf, dass die Viola nahbar bleibt und sich nicht gegen die natürliche Lautstärke einer geselligen Runde stellt.',
		'Für Teams in Bochum ist oft ein guter Übergang wichtig: erst offizieller Teil, dann entspannter Abend.',
	),
	bonn: location(
		'Bonn',
		'in Bonn',
		'Bonn bringt Rheinlage, Verbände, Wissenschaft, Politiknähe und internationale Gästelisten zusammen.',
		'Live-Musik passt zu Empfang, Dinner, Tagungsabschluss, Kundenabend, Stiftungsveranstaltung oder einem festlichen Programmteil.',
		'Rheinverkehr, Innenstadtlage und ein möglicher Ortswechsel zwischen Tagung und Abend sollten mit Puffer geplant werden.',
		'In Bonn ist häufig eine sehr kultivierte, zurückhaltende Atmosphäre gefragt; Musik soll Bedeutung geben, ohne dominant zu werden.',
		'Instrumentale Viola funktioniert bei deutsch- und englischsprachigen Gästen gleichermaßen, weil sie keine Übersetzung braucht.',
		'Für Organisationen in Bonn ist wichtig, dass der musikalische Rahmen seriös bleibt und gleichzeitig Wärme in den Raum bringt.',
	),
	bottrop: location(
		'Bottrop',
		'in Bottrop',
		'Bottrop eignet sich für Firmenfeiern, Teamabende und Jubiläen mit direkter, unkomplizierter Ruhrgebietsatmosphäre.',
		'Musik passt zu Restaurant, Saal, Unternehmenshof, Eröffnung oder einem Kundentermin mit überschaubarer Gästezahl.',
		'Der Aufbau bleibt am besten schlank; eine feste Kontaktperson und ein klares Startzeichen reichen meist aus.',
		'In Bottrop plane ich Musik weniger als Show und mehr als wertigen Rahmen, der den Abend spürbar besonderer macht.',
		'Die Viola kann dort ein guter Mittelweg sein: festlich genug für ein Unternehmen, aber klein genug für persönliche Begegnungen.',
		'Für lokale Teams ist wichtig, dass die Musik nicht zwischen Gespräche und Essen gerät, sondern beide Phasen unterstützt.',
	),
	dormagen: location(
		'Dormagen',
		'in Dormagen',
		'Dormagen liegt zwischen Düsseldorf und Köln und hat dadurch häufig Gästelisten, die aus mehreren Richtungen anreisen.',
		'Geeignet sind Kundenempfang, Eröffnung, Unternehmensjubiläum, Dinner, Rheinlocation oder ein kleiner Business-Abend in Zons-Nähe.',
		'Die Lage zwischen zwei Metropolen macht genaue Anfahrt, Ladezeit und Setlänge besonders hilfreich.',
		'In Dormagen setze ich die Musik gern als ruhigen Ankommenspunkt, damit Gäste trotz unterschiedlicher Wege gemeinsam in den Abend finden.',
		'Bei Rheinorten oder historischen Räumen braucht der Klang eine andere Planung als in einem nüchternen Seminarraum.',
		'Für Unternehmen vor Ort ist oft entscheidend, dass der Anlass professionell wirkt, ohne den regionalen Charakter zu verlieren.',
	),
	dortmund: location(
		'Dortmund',
		'in Dortmund',
		'Dortmund bietet große Unternehmensstandorte, moderne Eventflächen, Phoenixsee-Umfeld und klassische Ruhrgebietsfeiern.',
		'Die Viola passt zu Firmenfeier, Gala, Produktmoment, Kundenempfang, Dinner, Networking und einem offiziellen Jubiläum.',
		'Bei weitläufigen Locations sollten Treffpunkt, Backstage-Zugang und die Position zum Rednerpult vorab feststehen.',
		'In Dortmund plane ich oft mit klar getrennten Phasen: Empfang, Begrüßung, Essen, Gespräch und ein musikalischer Akzent.',
		'Ein Solo-Instrument hält diese Struktur elegant, ohne dass dafür große Technik oder eine Bandfläche nötig wird.',
		'Für Dortmunder Business-Events ist ein souveräner, direkter Ton meist stärker als zu viel Feierlichkeit.',
	),
	duesseldorf: location(
		'Düsseldorf',
		'in Düsseldorf',
		'Düsseldorf ist geprägt von Rheinlage, Messe, Agenturen, Kanzleien, Hotels und repräsentativen Kundenterminen.',
		'Live-Viola passt zu Empfang, Dinner, Messeabend, Produktpräsentation, Boutique-Eröffnung, Firmenjubiläum oder Vorstandsdinner.',
		'Innenstadtverkehr, Ladezone, Aufzug, Parken und Einlass sollten wegen kurzer Zeitfenster präzise abgestimmt werden.',
		'In Düsseldorf muss Musik oft sehr hochwertig wirken und gleichzeitig gesprächsfreundlich bleiben.',
		'Ich plane die Viola dort eher kuratiert: klare Sets, saubere Übergänge und ein Klang, der Räume elegant markiert.',
		'Für Marken, Kanzleien und Unternehmen in Düsseldorf ist die Wirkung wichtig: nicht laut, nicht beliebig, aber sofort als live wahrnehmbar.',
	),
	duisburg: location(
		'Duisburg',
		'in Duisburg',
		'Duisburg verbindet Innenhafen, Industrie, Logistik, Rhein-Ruhr-Lage und Business-Events mit viel praktischer Klarheit.',
		'Die Musik passt zu Firmenfeier, Hafenevent, Kundenempfang, Eröffnung, Jubiläum oder einem Dinner nach einem Projekttag.',
		'Größere Distanzen im Stadtgebiet, Parkflächen und genaue Eingänge sollten früh abgestimmt werden.',
		'In Duisburg funktioniert Musik besonders gut, wenn sie den Anlass aufwertet, aber den direkten Charakter der Veranstaltung respektiert.',
		'Die Viola kann im Innenhafen anders klingen als in einem Unternehmensfoyer; deshalb plane ich Raum, Lautstärke und Setdauer getrennt.',
		'Für Teams und Kunden vor Ort zählt häufig Verlässlichkeit mehr als großes Bühnengefühl.',
	),
	erkrath: location(
		'Erkrath',
		'in Erkrath',
		'Erkrath liegt nah an Düsseldorf und wirkt bei Firmenfeiern trotzdem oft ruhiger, grüner und persönlicher.',
		'Passend sind Kundenabend, Empfang, Dinner, Teamfeier, Eröffnung oder ein kleiner offizieller Moment in Hochdahl oder Unterfeldhaus.',
		'Kurze Wege helfen, trotzdem sollten Aufbauplatz, Startsignal und ein möglicher Außenbereich sauber geklärt sein.',
		'In Erkrath plane ich Musik gern mit viel Nähe zum Publikum, weil viele Business-Events kleiner und direkter angelegt sind.',
		'Die Viola kann hier einen eleganten Rahmen setzen, ohne dass sich eine Veranstaltung plötzlich zu groß anfühlt.',
		'Für Firmen aus Erkrath ist der Bezug zu Düsseldorf oft praktisch, aber der Abend selbst soll lokaler und entspannter bleiben.',
	),
	essen: location(
		'Essen',
		'in Essen',
		'Essen verbindet Konzernstandorte, Kulturorte, Baldeneysee, Rüttenscheid und viele Business-Locations im Zentrum des Ruhrgebiets.',
		'Live-Musik passt zu Gala, Kundenempfang, Dinner, Firmenjubiläum, Eröffnung, Messeabend oder einem Empfang im Grünen.',
		'Stadtverkehr, Locationzugang und ein realistischer Puffer vor dem ersten Set sind in Essen besonders wichtig.',
		'In Essen kann der musikalische Rahmen sehr unterschiedlich sein: exklusiv am See, urban im Saal oder persönlich im Unternehmensumfeld.',
		'Ich stimme den Klang so ab, dass er bei Reden nicht stört und in Gesprächspausen trotzdem präsent bleibt.',
		'Für Essener Unternehmen ist oft eine Balance aus Seriosität, Wärme und Ruhrgebietsnähe gefragt.',
	),
	gelsenkirchen: location(
		'Gelsenkirchen',
		'in Gelsenkirchen',
		'Gelsenkirchen steht für direkte Ruhrgebietsveranstaltungen, Teamfeiern, lokale Unternehmen und Business-Events mit persönlichem Kontakt.',
		'Geeignet sind Empfang, Firmenfeier, Jubiläum, Eröffnung, Dinner oder ein Networking-Abend mit klarer, nicht überladener Atmosphäre.',
		'Ankunft, Parken und erster Einsatz sollten eindeutig geplant sein, damit der Abend ohne Unruhe beginnt.',
		'In Gelsenkirchen darf die Musik wertig klingen, sollte aber nicht abgehoben wirken.',
		'Die Viola funktioniert hier gut, wenn sie Gespräche begleitet und offizielle Momente kurz rahmt.',
		'Für Teams und Stammkunden ist oft eine ehrliche, warme Wirkung wichtiger als ein glatter Eventeffekt.',
	),
	haan: location(
		'Haan',
		'in Haan',
		'Haan hat einen kleineren, persönlichen Rahmen zwischen Düsseldorf, Wuppertal und dem Kreis Mettmann.',
		'Musik passt zu Kundenempfang, Teamabend, Firmenjubiläum, Sommerfest, Restaurantdinner oder einer kleinen Eröffnung.',
		'Der Aufbau sollte kompakt bleiben und der erste Einsatz mit Gastgeberperson oder Eventleitung abgestimmt sein.',
		'In Haan wirken Business-Events oft näher am persönlichen Austausch als an großer Inszenierung.',
		'Die Viola kann dort genau diese Mischung tragen: festlich, aber beweglich und gesprächsfreundlich.',
		'Für Haaner Unternehmen ist eine Musiklösung sinnvoll, die wenig Technik braucht und trotzdem nicht wie Hintergrundradio klingt.',
	),
	hagen: location(
		'Hagen',
		'in Hagen',
		'Hagen verbindet Sauerlandnähe, industrielle Tradition, Kulturorte und Business-Events mit regionalem Einzugsgebiet.',
		'Live-Viola passt zu Firmenjubiläum, Dinner, Auszeichnung, Empfang, Eröffnung oder einem Abend mit Gästen aus mehreren Orten.',
		'Anreise, Wetteroptionen und ein klarer Aufbauplatz sind bei Locations am Rand der Stadt besonders wichtig.',
		'In Hagen plane ich Musik oft mit Blick auf Räume, die nicht klassisch für Konzerte gedacht sind.',
		'Ein Solo-Instrument kann dort flexibel reagieren, wenn Reden länger dauern oder Gäste später ankommen.',
		'Für Unternehmen in Hagen zählt, dass Musik den Anlass hebt, ohne den Ablauf schwerer zu machen.',
	),
	heiligenhaus: location(
		'Heiligenhaus',
		'in Heiligenhaus',
		'Heiligenhaus eignet sich für kleinere Unternehmensfeiern, Eröffnungen und Kundentermine zwischen Ratingen und Velbert.',
		'Geeignet sind Empfang, Dinner, Jubiläum, Sommerfest, Netzwerkabend oder ein offizieller Moment in einem Firmenraum.',
		'Zugang, Wetterschutz und ein kurzer technischer Check sollten unkompliziert vorab geklärt werden.',
		'In Heiligenhaus ist oft eine dezente Lösung überzeugender als ein großes Musikprogramm.',
		'Die Viola kann den Raum elegant aufwerten und trotzdem flexibel bleiben, wenn die Veranstaltung kompakt geplant ist.',
		'Für regionale Betriebe ist ein persönlicher, zuverlässiger Ablauf meistens wichtiger als Eventshow.',
	),
	herne: location(
		'Herne',
		'in Herne',
		'Herne liegt mitten im Ruhrgebiet und passt zu Business-Events, die direkt, nahbar und gut organisiert sein sollen.',
		'Live-Musik funktioniert bei Firmenfeier, Kundenabend, Jubiläum, Dinner, Eröffnung oder einem Teamempfang.',
		'Timing, Eingang und Einsatzpunkt sollten klar gesetzt werden, weil viele Veranstaltungen in engem Zeitfenster laufen.',
		'In Herne plane ich die Musik so, dass sie Ankommen und offizielle Begrüßung unterstützt, aber nicht gegen Gespräche arbeitet.',
		'Die Viola bringt einen feinen Klang in Räume, die sonst schnell sachlich wirken.',
		'Für Unternehmen aus Herne ist die Mischung aus Wertschätzung und unkomplizierter Durchführung besonders wichtig.',
	),
	hilden: location(
		'Hilden',
		'in Hilden',
		'Hilden liegt zwischen Düsseldorf, Solingen und Langenfeld und hat häufig kompakte Business-Events mit guter regionaler Anbindung.',
		'Passend sind Empfang, Kundendinner, Teamabend, Eröffnung, Firmenjubiläum oder ein musikalischer Akzent vor einer Rede.',
		'Kurze Wege helfen, trotzdem sollten Raumgröße, Ablauf und Startsignal genau notiert werden.',
		'In Hilden ist die Musik oft dort stark, wo sie einen Übergang schafft: vom Ankommen zum offiziellen Teil oder vom Dinner zum Gespräch.',
		'Ich plane die Viola so, dass sie nicht wie Programmpause wirkt, sondern wie ein sauber gesetzter Rahmen.',
		'Für Unternehmen in Hilden zählt meistens eine elegante, aber schlanke Lösung.',
	),
	iserlohn: location(
		'Iserlohn',
		'in Iserlohn',
		'Iserlohn verbindet Sauerlandnähe, Mittelstand und Business-Events mit Gästen aus einem größeren regionalen Umfeld.',
		'Geeignet sind Firmenjubiläum, Kundenabend, Empfang, Dinner, Auszeichnung oder eine Veranstaltung mit familiärer Unternehmenskultur.',
		'Längere Wege und Wetteroptionen sollten früh geklärt werden, besonders bei Außenmomenten.',
		'In Iserlohn kann die Viola einen ruhigen, wertigen Ton setzen, der nicht zu urban oder überinszeniert wirkt.',
		'Ich achte auf eine Setlänge, die zum Tagesprogramm passt und Gäste nicht aus Gesprächen herausreißt.',
		'Für regionale Mittelständler ist Musik oft dann passend, wenn sie Anerkennung zeigt und trotzdem natürlich bleibt.',
	),
	koeln: location(
		'Köln',
		'in Köln',
		'Köln bringt Messe, Agenturen, Medien, Veedel, Rheinlage und eine sehr gesellige Business-Kultur zusammen.',
		'Die Viola passt zu Messeabend, Kundenempfang, Produktpräsentation, Firmenfeier, Dinner, Gala oder Networking im kleineren Rahmen.',
		'Bei dichter Stadtlage müssen Treffpunkt, Ladeweg, Parken und Startzeit besonders genau geplant werden.',
		'In Köln darf Musik lebendig wirken, muss aber im Business-Kontext klar dosiert bleiben.',
		'Ich setze die Viola gern als hochwertigen Kontrast zur üblichen Eventbeschallung, ohne Gespräche zu verdecken.',
		'Für Kölner Veranstaltungen ist oft entscheidend, dass der Abend freundlich bleibt und trotzdem professionell wirkt.',
	),
	krefeld: location(
		'Krefeld',
		'in Krefeld',
		'Krefeld verbindet Niederrhein, Textiltradition, Stadtwald, Uerdingen und Business-Events mit entspanntem Charakter.',
		'Geeignet sind Empfang, Kundenabend, Firmenjubiläum, Dinner, Eröffnung oder ein kleiner musikalischer Moment im Unternehmensumfeld.',
		'Raumgröße und Lautstärke sollten vorab geklärt werden, damit die Viola präsent bleibt und Gespräche nicht überdeckt.',
		'In Krefeld wirkt Musik besonders gut, wenn sie gepflegt, aber nicht zu formal eingesetzt wird.',
		'Ich plane Sets dort gern mit genügend Pausen, damit die Veranstaltung nicht nach Konzert, sondern nach wertigem Empfang klingt.',
		'Für Unternehmen am Niederrhein ist ein ruhiger, verbindlicher Ton oft stärker als laute Inszenierung.',
	),
	'kreis-mettmann': location(
		'Kreis Mettmann',
		'im Kreis Mettmann',
		'Der Kreis Mettmann verbindet Erkrath, Haan, Hilden, Ratingen, Velbert, Wülfrath und viele kleinere Unternehmensstandorte.',
		'Live-Viola passt zu regionalen Firmenevents, Kundentreffen, Jubiläen, Sommerfesten, Dinnern und Eröffnungen.',
		'Mehrere mögliche Anfahrtswege und Stadtgrenzen sollten bei der Planung mitgedacht werden.',
		'Im Kreis Mettmann sind Events oft regional vernetzt; Musik sollte deshalb professionell klingen und trotzdem nahbar bleiben.',
		'Ich plane den Einsatz so, dass er zu kleinen Räumen genauso passt wie zu größeren Empfängen mit Gästen aus mehreren Städten.',
		'Für lokale Unternehmen ist ein unkomplizierter Ablauf mit klarer Rechnung und verlässlicher Kommunikation wichtig.',
	),
	langenfeld: location(
		'Langenfeld',
		'in Langenfeld',
		'Langenfeld liegt zwischen Düsseldorf, Leverkusen und Monheim und ist für gut erreichbare Business-Events praktisch.',
		'Geeignet sind Empfang, Firmenfeier, Kundendinner, Jubiläum, Eröffnung oder ein musikalischer Akzent in Restaurant oder Firmenraum.',
		'Ablauf, Parken und Setdauer sollten kompakt geplant werden, damit der Abend ohne Leerlauf startet.',
		'In Langenfeld funktionieren besonders klare Konzepte: Musik zum Ankommen, kurze Pause für Worte, danach dezente Begleitung.',
		'Die Viola kann den Termin festlicher machen, ohne dass Bühne oder große Technik nötig sind.',
		'Für Firmen vor Ort ist der Nutzen oft genau diese Planbarkeit zwischen mehreren Großstädten.',
	),
	leverkusen: location(
		'Leverkusen',
		'in Leverkusen',
		'Leverkusen verbindet Industrie, Rheinlage, Opladen, Schlebusch und Business-Events zwischen Köln und Bergischem Land.',
		'Live-Musik passt zu Firmenjubiläum, Kundenempfang, Dinner, Eröffnung, Messeabend oder einem internen Feiermoment.',
		'Anfahrt zwischen Stadtteilen, Einlass und mögliche Sicherheitsabläufe sollten vorher klar sein.',
		'In Leverkusen kann Musik sehr repräsentativ oder sehr persönlich wirken, je nachdem ob der Anlass industriell, lokal oder privatwirtschaftlich geprägt ist.',
		'Ich stimme den Klang auf Raum, Gästezahl und Gesprächsanteil ab, damit die Viola den Abend trägt und nicht überlagert.',
		'Für Unternehmen in Leverkusen ist ein professioneller, aber nicht schwerfälliger Rahmen besonders passend.',
	),
	meerbusch: location(
		'Meerbusch',
		'in Meerbusch',
		'Meerbusch steht für elegante private und geschäftliche Anlässe nahe Düsseldorf, häufig mit ruhiger Rheinlage und gehobenem Rahmen.',
		'Geeignet sind Kundenabend, Dinner, Empfang, Boutique-Eröffnung, Firmenjubiläum oder ein kleiner Vorstandstermin.',
		'Dezente Musik, klare Position im Raum und pünktlicher Beginn sind hier meist wichtiger als ein großes Programm.',
		'In Meerbusch darf die Viola sehr fein wirken: warm, zurückhaltend und hochwertig.',
		'Ich plane sie so, dass sie den Empfang aufwertet, ohne die Gespräche am Tisch zu stören.',
		'Für Gastgeberinnen und Gastgeber in Meerbusch zählt oft ein unaufdringlicher, sehr gepflegter Eindruck.',
	),
	mettmann: location(
		'Mettmann',
		'in Mettmann',
		'Mettmann liegt im Kreis Mettmann, nah am Neandertal, und passt zu Business-Events mit regionalem und persönlichem Charakter.',
		'Musik eignet sich für Kundendinner, Firmenjubiläum, Eröffnung, Teamabend oder einen Empfang mit kleinerer Gästeliste.',
		'Ankunft, Aufbauplatz und der gewünschte musikalische Moment sollten mit einer Kontaktperson abgestimmt werden.',
		'In Mettmann plane ich die Viola eher nah am Anlass als groß inszeniert.',
		'Gerade in kleineren Räumen hilft ein akustisches Instrument, weil es Atmosphäre schafft, ohne technische Hürde aufzubauen.',
		'Für lokale Unternehmen ist Musik häufig ein Zeichen von Wertschätzung gegenüber Team, Kunden oder langjährigen Partnern.',
	),
	moenchengladbach: location(
		'Mönchengladbach',
		'in Mönchengladbach',
		'Mönchengladbach bringt Rheydt, Wickrath, Niederrhein und Business-Events mit mehreren Generationen im Unternehmen zusammen.',
		'Geeignet sind Firmenjubiläum, Kundenempfang, Dinner, Eröffnung, Teamfeier oder ein offizieller Programmpunkt.',
		'Größere Wege im Stadtgebiet und ein klares Startsignal sollten früh geklärt werden.',
		'In Mönchengladbach setze ich Musik gern so, dass sie den offiziellen Teil würdigt und danach Gespräche leichter macht.',
		'Die Viola kann einen traditionsbewussten Anlass modern rahmen, ohne dass es nach Standard-Eventmusik klingt.',
		'Für Familienunternehmen und regionale Betriebe ist dieser persönliche Klang oft passender als eine laute Bandlösung.',
	),
	moers: location(
		'Moers',
		'in Moers',
		'Moers steht für Niederrhein, Schlossnähe, Duisburg-Anbindung und Business-Events mit entspanntem regionalem Ton.',
		'Live-Viola passt zu Empfang, Firmenfeier, Kundenabend, Jubiläum, Eröffnung oder Dinner in Restaurant, Saal oder Unternehmensraum.',
		'Bei Außenbereichen sollten Wetterschutz, Untergrund und die Nähe zu den Gästen geklärt werden.',
		'In Moers wirkt Musik besonders gut, wenn sie den Empfang freundlich öffnet und später nicht zu präsent bleibt.',
		'Ich plane kurze Sets, wenn viele Gespräche und Begrüßungen im Vordergrund stehen.',
		'Für Unternehmen am Niederrhein ist ein natürlicher, warmer Klang oft stärker als formale Strenge.',
	),
	'monheim-am-rhein': location(
		'Monheim am Rhein',
		'in Monheim am Rhein',
		'Monheim am Rhein verbindet Rheinlage, Baumberg, moderne Stadtentwicklung und Business-Events zwischen Düsseldorf und Leverkusen.',
		'Geeignet sind Empfang, Eröffnung, Kundendinner, Sommerfest, Firmenjubiläum oder ein Abendtermin mit Blick zum Rhein.',
		'Rheinlage, Wetter und ein möglicher Wechsel zwischen innen und außen sollten früh eingeplant werden.',
		'In Monheim kann die Viola sehr gut als eleganter Ankommensmoment funktionieren, bevor der offizielle Teil startet.',
		'Ich halte die Musik dort gern beweglich, weil Empfang, Essen und Gespräch oft nah ineinander übergehen.',
		'Für Unternehmen in Monheim ist die Nähe zu mehreren Städten praktisch, der Klang darf aber klar lokal und persönlich bleiben.',
	),
	'muelheim-an-der-ruhr': location(
		'Mülheim an der Ruhr',
		'in Mülheim an der Ruhr',
		'Mülheim an der Ruhr verbindet Ruhrtal, Broich, Saarn und Business-Events mit grüner, ruhiger Stadtnähe.',
		'Live-Musik passt zu Kundenempfang, Firmenjubiläum, Dinner, Sommerabend, Eröffnung oder einer kleinen Gala.',
		'Wege am Wasser, Parken und ein trockener Aufbauplatz sollten vorab geklärt sein.',
		'In Mülheim wirkt die Viola oft besonders stimmig, wenn sie den Raum nicht füllt, sondern eine ruhige Linie unter den Abend legt.',
		'Ich plane die Musik mit Blick auf Essen, Reden und Gespräche, damit keine Phase überdeckt wird.',
		'Für Unternehmen vor Ort zählt häufig eine elegante Ruhe, die zum Ruhrtal und zum Anlass passt.',
	),
	muenster: location(
		'Münster',
		'in Münster',
		'Münster verbindet Universität, Verbände, Altstadt, Aasee und Business-Events mit heller, kultivierter Atmosphäre.',
		'Die Viola passt zu Empfang, Dinner, Tagungsabschluss, Jubiläum, Preisverleihung oder einem Abend im kleineren Kreis.',
		'Innenstadtlogistik, Fahrradverkehr und Einlasszeiten sollten mit ausreichend Puffer geplant werden.',
		'In Münster ist oft ein klarer, feiner Ton gefragt, der nicht schwer und nicht zu festlich wirkt.',
		'Ich plane die Musik deshalb gerne leicht, präzise und mit genügend Raum für Gespräche.',
		'Für Organisationen in Münster ist eine seriöse, aber persönliche Wirkung besonders wichtig.',
	),
	neuss: location(
		'Neuss',
		'in Neuss',
		'Neuss liegt nah an Düsseldorf, hat eigene Rheinlage, historische Bezüge und viele gut erreichbare Unternehmensorte.',
		'Geeignet sind Firmenempfang, Kundendinner, Jubiläum, Eröffnung, Sommerfest oder ein offizieller Moment nach einer Tagung.',
		'Der genaue Treffpunkt, Ladeweg und Übergang zwischen Empfang und Dinner sollten früh feststehen.',
		'In Neuss kann Musik sehr elegant wirken, ohne den Aufwand einer großen Produktion zu brauchen.',
		'Ich setze die Viola gern so, dass Gäste den Live-Charakter sofort wahrnehmen und trotzdem weiter sprechen können.',
		'Für Unternehmen in Neuss ist die Düsseldorf-Nähe praktisch, aber der Anlass soll oft bewusst eigenständig wirken.',
	),
	'nordrhein-westfalen': location(
		'Nordrhein-Westfalen',
		'in Nordrhein-Westfalen',
		'Nordrhein-Westfalen umfasst Rheinland, Ruhrgebiet, Bergisches Land, Westfalen und sehr unterschiedliche Business-Kulturen.',
		'Live-Viola passt zu Firmenjubiläum, Gala, Messeabend, Kundenempfang, Eröffnung, Dinner und internen Feierformaten in NRW.',
		'Region, Fahrzeit, Setlänge, Technikbedarf und gewünschter Rahmen sollten individuell geprüft werden.',
		'Für NRW plane ich nicht mit einem Einheitskonzept, sondern mit dem jeweiligen Format: Messe in Köln, Empfang in Düsseldorf, Jubiläum im Ruhrgebiet oder Dinner in Westfalen.',
		'Ein Solo-Instrument ist dafür praktisch, weil es in kleinen und mittleren Settings flexibel bleibt.',
		'Für Unternehmen in NRW zählt besonders, dass Musik professionell, abrechenbar und organisatorisch zuverlässig eingebunden ist.',
	),
	oberhausen: location(
		'Oberhausen',
		'in Oberhausen',
		'Oberhausen verbindet westliches Ruhrgebiet, CentrO-Nähe, Kulturorte und Firmenfeiern mit unkomplizierter Atmosphäre.',
		'Geeignet sind Empfang, Teamabend, Firmenjubiläum, Kundenveranstaltung, Eröffnung oder ein Dinner mit Programmpunkt.',
		'Startzeit, Parken und Aufbau sollten nicht zu knapp geplant werden, weil Wege im Ruhrgebiet schnell variieren.',
		'In Oberhausen wirkt Musik am besten, wenn sie den Abend aufwertet und trotzdem gesprächsfreundlich bleibt.',
		'Die Viola kann einen offiziellen Moment würdigen und danach wieder in dezente Begleitung wechseln.',
		'Für Teams und Kunden in Oberhausen passt ein direkter, verlässlicher Ablauf ohne unnötige Showeffekte.',
	),
	paderborn: location(
		'Paderborn',
		'in Paderborn',
		'Paderborn verbindet Technologie, Hochschulnähe, Ostwestfalen und Business-Events mit klarer Struktur.',
		'Live-Musik passt zu Tagungsabschluss, Firmenjubiläum, Kundenempfang, Dinner, Preisverleihung oder Eröffnung.',
		'Anreise und Setlänge sollten früh abgestimmt werden, damit die weitere Strecke sinnvoll in den Ablauf passt.',
		'In Paderborn plane ich den musikalischen Rahmen besonders präzise, weil viele Termine aus einem fachlichen Tagesprogramm heraus entstehen.',
		'Die Viola kann den Wechsel vom Arbeitsmodus in den Abend unterstützen, ohne eine zweite Bühne zu eröffnen.',
		'Für Unternehmen vor Ort zählt oft ein kultivierter, planbarer Abschluss des Veranstaltungstages.',
	),
	ratingen: location(
		'Ratingen',
		'in Ratingen',
		'Ratingen liegt nah an Düsseldorf, Flughafen, Messe und vielen Unternehmensstandorten.',
		'Geeignet sind Business-Empfang, Messeabend, Firmenjubiläum, Dinner, Eröffnung, Kundenveranstaltung oder ein kleiner Gala-Moment.',
		'Kurze Distanzen sind hilfreich, trotzdem sollten Einlass, Parken und Startsignal klar abgestimmt werden.',
		'In Ratingen braucht Musik oft eine professionelle, internationale Wirkung, darf aber nicht zu groß werden.',
		'Ich plane die Viola so, dass sie Ankommen, Begrüßung und Gesprächsphasen elegant verbindet.',
		'Für Firmen in Ratingen ist die Nähe zu Düsseldorf ein Vorteil, der musikalische Rahmen soll aber eigenständig und persönlich bleiben.',
	),
	recklinghausen: location(
		'Recklinghausen',
		'in Recklinghausen',
		'Recklinghausen verbindet Altstadt, Ruhrgebiet, Kultur und Business-Events am nördlichen Rand der Region.',
		'Live-Viola passt zu Empfang, Firmenfeier, Jubiläum, Kundenabend, Eröffnung oder einem Dinner mit persönlicher Note.',
		'Anfahrt, Parken und ein ruhiger Aufbaupunkt sollten vorab geklärt werden.',
		'In Recklinghausen funktioniert Musik gut, wenn sie den offiziellen Teil ernst nimmt und den Abend danach leicht bleiben lässt.',
		'Ich setze kurze musikalische Akzente dort lieber präzise als zu lang.',
		'Für lokale Unternehmen zählt häufig ein respektvoller, warmer Ton ohne unnötige Förmlichkeit.',
	),
	remscheid: location(
		'Remscheid',
		'in Remscheid',
		'Remscheid steht für bergische Höhen, Lennep, Mittelstand und Firmenfeiern mit handwerklich-regionalem Charakter.',
		'Geeignet sind Jubiläum, Kundenempfang, Teamabend, Eröffnung, Dinner oder ein Sommerfest mit kleiner Bühne.',
		'Wetter, Wege, Höhenlage und Zugang sollten vor allem bei Außenmomenten realistisch geplant werden.',
		'In Remscheid wirkt die Viola besonders gut, wenn sie den Anlass wertig macht, ohne den regionalen Ton zu verlieren.',
		'Ich plane den Klang hier eher warm und direkt als glamourös.',
		'Für Unternehmen vor Ort ist Musik oft eine Geste der Anerkennung gegenüber Mitarbeitenden und Partnern.',
	),
	'rhein-kreis-neuss': location(
		'Rhein-Kreis Neuss',
		'im Rhein-Kreis Neuss',
		'Der Rhein-Kreis Neuss umfasst Neuss, Meerbusch, Dormagen, Grevenbroich und viele Orte zwischen Düsseldorf, Köln und Niederrhein.',
		'Live-Musik passt zu Firmenempfang, Kundendinner, Sommerfest, Jubiläum, Eröffnung oder einem regionalen Netzwerkabend.',
		'Stadtgrenzen, Fahrzeit und genaue Location sollten flexibel, aber verbindlich geplant werden.',
		'Im Rhein-Kreis Neuss sind Business-Events oft regional vernetzt und trotzdem sehr persönlich.',
		'Die Viola kann diesen Rahmen elegant verbinden, ohne eine Veranstaltung schwer oder zu groß wirken zu lassen.',
		'Für Unternehmen in der Region ist eine professionelle, schlanke Lösung mit klarer Kommunikation besonders praktisch.',
	),
	rheinland: location(
		'Rheinland',
		'im Rheinland',
		'Das Rheinland steht für offene Gespräche, Rheinorte, Metropolen, Mittelstand und sehr unterschiedliche Business-Anlässe.',
		'Geeignet sind Messeempfang, Kundenabend, Firmenjubiläum, Dinner, Eröffnung, Sommerfest oder ein offizieller Empfang.',
		'Region, Fahrzeit, Setlänge und gewünschte Wirkung sollten je nach Stadt und Format einzeln abgestimmt werden.',
		'Im Rheinland darf Musik einladend und warm sein, muss aber im Business-Kontext klar dosiert bleiben.',
		'Ich plane die Viola so, dass sie den Empfang öffnet und danach Raum für Begegnung lässt.',
		'Für rheinische Unternehmen zählt oft ein Ton, der professionell wirkt und trotzdem leicht zugänglich bleibt.',
	),
	'rhein-ruhr': location(
		'Rhein-Ruhr',
		'in der Rhein-Ruhr-Region',
		'Rhein-Ruhr verbindet Düsseldorf, Köln, Essen, Dortmund, Duisburg und viele Business-Standorte auf engem Raum.',
		'Live-Viola passt zu Messeabend, Firmenjubiläum, Kundenempfang, Gala, Dinner, Netzwerkformat oder Produktpräsentation.',
		'Verkehr, Einlass, Stadtgrenzen und Zeitpuffer müssen in dieser Region besonders realistisch geplant werden.',
		'In Rhein-Ruhr ist oft entscheidend, dass Musik auch bei wechselnden Locations zuverlässig funktioniert.',
		'Ein Solo-Instrument bleibt flexibel genug für Empfang, Foyer, Dinnerraum und kurzen offiziellen Akzent.',
		'Für Unternehmen mit Gästen aus mehreren Städten schafft die Musik einen verbindenden, hochwertigen Rahmen.',
	),
	ruhrgebiet: location(
		'Ruhrgebiet',
		'im Ruhrgebiet',
		'Das Ruhrgebiet verbindet viele Städte, direkte Kommunikation, Industriegeschichte, Kulturorte und starke Unternehmensnetzwerke.',
		'Geeignet sind Firmenfeier, Jubiläum, Teamabend, Kundenempfang, Eröffnung, Gala oder ein Dinner mit regionalem Charakter.',
		'Klare Absprachen zu Startsignal, Lautstärke und Position sind wichtig, weil Veranstaltungen oft sehr lebendig werden.',
		'Im Ruhrgebiet darf Musik emotional und hochwertig sein, sollte aber nicht künstlich distanziert wirken.',
		'Ich plane die Viola so, dass sie offizielle Momente trägt und danach wieder Platz für Gespräche macht.',
		'Für Ruhrgebietsunternehmen passt ein musikalischer Rahmen, der Wertschätzung zeigt und trotzdem bodenständig bleibt.',
	),
	siegen: location(
		'Siegen',
		'in Siegen',
		'Siegen verbindet Siegerland, Mittelstand, Hochschulnähe und Business-Events mit weiterem regionalem Einzugsgebiet.',
		'Live-Musik passt zu Firmenjubiläum, Kundenabend, Empfang, Dinner, Auszeichnung oder einem offiziellen Programmpunkt.',
		'Längere Anfahrt, Setdauer und Zeitfenster sollten früh zusammengebracht werden.',
		'In Siegen plane ich Musik so, dass sie den Anlass würdigt, ohne den Abend zu schwer zu machen.',
		'Die Viola ist dafür geeignet, weil sie flexibel in kleineren und mittleren Räumen funktioniert.',
		'Für Unternehmen aus dem Siegerland ist eine persönliche, verlässliche Wirkung häufig wichtiger als großer Eventaufbau.',
	),
	solingen: location(
		'Solingen',
		'in Solingen',
		'Solingen steht für bergische Lage, Gräfrath, Ohligs, Unternehmenstradition und Business-Events mit handwerklicher Identität.',
		'Geeignet sind Firmenjubiläum, Eröffnung, Kundenempfang, Dinner, Teamabend oder ein Sommerfest mit persönlichem Rahmen.',
		'Bei Häusern, Höhenlagen und Außenflächen sollten Zugang, Wetter und Aufbauplatz früh besprochen werden.',
		'In Solingen wirkt die Viola besonders stimmig, wenn sie hochwertig klingt und trotzdem nicht zu glatt wird.',
		'Ich plane dort gern klare Einsätze, die Reden, Ehrungen oder den Empfang unterstützen.',
		'Für lokale Betriebe ist Musik oft ein Zeichen von Wertschätzung gegenüber Mitarbeitenden, Kundschaft und langjährigen Partnern.',
	),
	unna: location(
		'Unna',
		'in Unna',
		'Unna liegt zwischen Ruhrgebiet und Hellweg und eignet sich für Business-Events mit regionaler Gästestruktur.',
		'Live-Viola passt zu Empfang, Firmenfeier, Kundenabend, Jubiläum, Dinner oder einem offiziellen Auftakt.',
		'Anfahrt, Aufbau und erster Einsatz sollten ohne Hektik aufeinander abgestimmt werden.',
		'In Unna ist Musik besonders hilfreich, wenn sie einen Arbeitstag ruhig in einen Abend überführt.',
		'Die Viola kann einen klaren, warmen Rahmen setzen, ohne den Raum zu dominieren.',
		'Für Unternehmen in Unna zählt oft ein professioneller Ablauf, der trotzdem persönlich bleibt.',
	),
	velbert: location(
		'Velbert',
		'in Velbert',
		'Velbert verbindet Neviges, Langenberg, Schloss- und Beschlagindustrie sowie Business-Events zwischen Ruhrgebiet und Bergischem Land.',
		'Geeignet sind Firmenjubiläum, Kundenempfang, Eröffnung, Dinner, Sommerfest oder ein Netzwerkabend.',
		'Bei Steigungen, Wegen und Außenflächen sollten Aufbauzeit und Wetterschutz eingeplant werden.',
		'In Velbert darf Musik den Anlass aufwerten, ohne die Veranstaltung aus ihrem regionalen Charakter herauszulösen.',
		'Ich plane die Viola hier warm, klar und nicht zu groß.',
		'Für Unternehmen vor Ort ist eine verlässliche, schlanke musikalische Lösung meist sehr passend.',
	),
	wuelfrath: location(
		'Wülfrath',
		'in Wülfrath',
		'Wülfrath hat kurze Wege, bergische Nähe und Business-Events, die oft persönlicher und überschaubarer bleiben.',
		'Live-Musik passt zu Firmenjubiläum, Kundendinner, Eröffnung, Teamabend oder einem Empfang im kleinen Kreis.',
		'Ein ruhiger Aufbauplatz, Startsignal und ein realistisches Zeitfenster reichen meist für eine gute Planung.',
		'In Wülfrath wirkt die Viola besonders gut, wenn sie nicht zu formell eingesetzt wird.',
		'Ich plane kurze, wertige Sets, die den Anlass markieren und danach wieder Raum lassen.',
		'Für lokale Unternehmen ist Musik häufig dann richtig, wenn sie Gästen Aufmerksamkeit schenkt, ohne den Abend zu überladen.',
	),
	wuppertal: location(
		'Wuppertal',
		'in Wuppertal',
		'Wuppertal verbindet Elberfeld, Barmen, Höhenlagen, Kulturorte und Business-Events entlang der Wupper.',
		'Geeignet sind Firmenfeier, Kundenempfang, Dinner, Eröffnung, Jubiläum, Preisverleihung oder ein Empfang in einem besonderen Raum.',
		'Treppen, Wege, Parken und Wetter sollten in Wuppertal immer konkret eingeplant werden.',
		'In Wuppertal kann Musik sehr atmosphärisch wirken, weil viele Räume architektonisch oder topografisch besonders sind.',
		'Ich stimme die Viola darauf ab, ob der Abend urban, bergisch, industriell oder sehr persönlich wirken soll.',
		'Für Unternehmen in Wuppertal ist ein flexibler Klang wichtig, der mit ungewöhnlichen Räumen gut umgehen kann.',
	),
};

function topic(keyword, title, audience, setting, intent, musicRole, distinction, planning, proof) {
	return { keyword, title, audience, setting, intent, musicRole, distinction, planning, proof };
}

const TOPIC_PROFILES = {
	'dinnermusik-firmenevent': topic(
		'Dinnermusik Firmenevent',
		'Dinnermusik für Firmenevents mit Live-Viola.',
		'Unternehmen, die ein Essen nicht nur füllen, sondern angenehm rahmen möchten',
		'Dinner, gesetztes Menü, Flying Buffet, Vorstandstisch oder Kundenabend',
		'Der Suchintent ist klar auf Essen und Gespräch gerichtet: Musik soll den Raum veredeln, aber den Tisch nicht stören.',
		'Ich spiele in Sets, mit Pausen zwischen Gängen, reduzierter Dynamik und Repertoire, das auch bei leisem Pegel erkennbar bleibt.',
		'Diese Seite unterscheidet sich von allgemeiner Firmenfeier-Musik, weil der Fokus auf Tischlautstärke, Pausen, Serviceablauf und Gesprächsfluss liegt.',
		'Wichtig sind Menüzeiten, Reden, Raumgröße, Platzierung im Saal und die Frage, ob einzelne Stücke angekündigt oder bewusst unauffällig bleiben.',
		'Eine Solo-Viola braucht wenig Platz und kann sich an Service, Toasts und Gespräche anpassen.',
	),
	'empfangsmusik-firmenevent': topic(
		'Empfangsmusik Firmenevent',
		'Empfangsmusik für Firmenevents und Business-Gäste.',
		'Gastgeber, die den ersten Eindruck eines Firmenabends bewusst gestalten möchten',
		'Foyer, Terrasse, Lounge, Hotellobby, Messestand oder Eingangsbereich',
		'Gesucht wird Musik für das Ankommen: freundlich, präsent und trotzdem offen genug für Begrüßungen.',
		'Ich plane kurze, wiedererkennbare Sets, die Gäste willkommen heißen und nicht den Charakter eines Konzerts bekommen.',
		'Anders als Dinnermusik richtet sich diese Seite auf den ersten Kontakt, Namensschilder, Aperitif, Small Talk und die Bewegung im Raum.',
		'Wir klären Einlasszeit, erwartete Gästewellen, Begrüßung, Lautstärke und den Übergang in Rede, Dinner oder Networking.',
		'Live-Viola kann den Empfang sofort hochwertiger machen, ohne dass Technik oder Moderation nötig werden.',
	),
	eventmusikerin: topic(
		'Eventmusikerin',
		'Eventmusikerin für Business-Events mit Viola.',
		'Agenturen, Unternehmen und private Gastgeber, die eine einzelne professionelle Musikerin suchen',
		'Empfang, Dinner, Eröffnung, Messe, Gala, Jubiläum oder Produktmoment',
		'Der Begriff ist breiter als Firmenfeier, meint aber meistens eine konkrete Buchungsabsicht für eine Musikerin.',
		'Ich biete Solo-Viola als flexible Lösung, die ohne große Bühne funktioniert und trotzdem live erlebbar ist.',
		'Diese Seite grenzt sich von Instrumentenseiten ab: Im Mittelpunkt steht die Rolle als Eventmusikerin, nicht nur Geige oder Viola.',
		'Für die Planung zählen Anlass, Gästezahl, gewünschte Präsenz, Rechnungsdaten und die Frage, ob Musik Hintergrund oder Akzent sein soll.',
		'Eine einzelne Musikerin ist besonders geeignet, wenn der Event hochwertig wirken soll, aber keine Bandfläche verfügbar ist.',
	),
	'geige-firmenevent': topic(
		'Geige Firmenevent',
		'Geige oder Viola für Firmenevents.',
		'Unternehmen, die nach Streicherklang suchen und zwischen Geige, Violine und Viola unterscheiden möchten',
		'Business-Empfang, Dinner, Eröffnung, Messeabend oder Firmenjubiläum',
		'Viele suchen nach Geige, meinen aber generell ein elegantes Solo-Streichinstrument für ein Event.',
		'Ich erkläre transparent, dass ich Viola spiele: etwas tiefer, wärmer und oft gesprächsfreundlicher als eine sehr helle Geige.',
		'Diese Seite ist anders als die allgemeine Firmenevent-Seite, weil sie die Instrumentenfrage und die Erwartung hinter dem Wort Geige beantwortet.',
		'Wichtig ist, ob der Klang auffallen, dezent tragen oder einen offiziellen Moment hervorheben soll.',
		'Für Business-Räume kann Viola besonders angenehm sein, weil sie weniger scharf durch Gespräche schneidet.',
	),
	'hintergrundmusik-firmenevent': topic(
		'Hintergrundmusik Firmenevent',
		'Hintergrundmusik für Firmenevents, die nicht beliebig klingt.',
		'Unternehmen, die Atmosphäre wünschen, aber keine dominante Bühnensituation',
		'Empfang, Dinner, Lounge, Netzwerkabend, Firmenfeier oder Kundenveranstaltung',
		'Der Suchintent fragt nach dezenter Musik; entscheidend ist also Lautstärke, Wiedererkennbarkeit und Zurückhaltung.',
		'Ich spiele Musik, die Räume warm macht, ohne Gespräche zu verdrängen, und reduziere Tempo und Dynamik passend zum Raum.',
		'Diese Seite unterscheidet sich von Gala oder Produktpräsentation, weil die Musik bewusst nicht im Mittelpunkt steht.',
		'Wir planen Setdauer, Pausen, Position im Raum und den Moment, an dem Hintergrundmusik endet oder in einen Akzent wechselt.',
		'Live-Hintergrundmusik wirkt persönlicher als Playlist, bleibt aber deutlich unaufdringlicher als ein Konzert.',
	),
	'instrumentalmusik-firmenevent': topic(
		'Instrumentalmusik Firmenevent',
		'Instrumentalmusik für Firmenevents mit Solo-Viola.',
		'Unternehmen, die Musik ohne Gesang, Sprache oder Moderationscharakter suchen',
		'Empfang, Dinner, Eröffnung, Ausstellung, Kundenevent oder ruhiger Gala-Moment',
		'Instrumentalmusik wird gesucht, wenn Musik international verständlich, elegant und störungsarm sein soll.',
		'Ich nutze Melodien, die ohne Text funktionieren, und passe die Auswahl an Anlass, Raum und Publikum an.',
		'Diese Seite grenzt sich von Live-Musik allgemein ab: Es geht um textfreie Musik, nicht um Sängerin, Band oder DJ.',
		'Wichtig sind Repertoire, Lautstärke, Länge der Sets und ob bekannte Melodien oder eher klassische Linien gewünscht sind.',
		'Instrumentale Viola kann auch bei gemischten Sprachgruppen funktionieren, weil sie keine Erklärung braucht.',
	),
	'live-musik-firmenevent': topic(
		'Live Musik Firmenevent',
		'Live Musik für Firmenevents mit eleganter Viola.',
		'Unternehmen, die ihren Anlass live, hochwertig und trotzdem planbar begleiten lassen möchten',
		'Firmenfeier, Messeabend, Kundenempfang, Dinner, Eröffnung, Jubiläum oder Networking',
		'Der Suchintent ist kommerziell: Es geht nicht um eine Playlist, sondern um eine buchbare Live-Lösung für ein Business-Event.',
		'Ich plane Solo-Viola als musikalischen Rahmen, der sichtbar live ist und trotzdem wenig Technik, Fläche und Abstimmung braucht.',
		'Diese Seite ist breiter als Dinnermusik oder Messe-Musik und bündelt die allgemeine Buchungsfrage für Live-Musik.',
		'Wir klären Anlass, Ort, Gästezahl, gewünschte Rolle der Musik, Rechnungsdaten und mögliche Wechsel zwischen Hintergrund und Akzent.',
		'Live-Musik schafft eine andere Aufmerksamkeit als Aufnahmen, weil sie den Raum und die Stimmung der Gäste direkt aufnimmt.',
	),
	'musik-business-event': topic(
		'Musik Business Event',
		'Musik für Business-Events mit professioneller Wirkung.',
		'Unternehmen, Agenturen und Organisationen mit repräsentativem Anlass',
		'Konferenzabend, Kundenveranstaltung, Empfang, Panel-Ausklang, Dinner oder Netzwerkformat',
		'Business Event ist ein breiter Begriff; gesucht wird meist Musik, die professionell wirkt und den Ablauf nicht stört.',
		'Ich setze die Viola als eleganten Rahmen ein, der Gespräch, Marke und offiziellen Teil unterstützt.',
		'Diese Seite unterscheidet sich von Firmenfeier, weil der Fokus stärker auf Repräsentation, Außenwirkung und Geschäftsbeziehungen liegt.',
		'Wichtig sind Corporate-Kontext, Gästeprofil, Branding, Timing, Lautstärke und die Frage, ob Musik sichtbar oder subtil bleiben soll.',
		'Ein Solo-Instrument kann sehr hochwertig wirken, ohne die Veranstaltung in Richtung Showformat zu verschieben.',
	),
	'musik-eroeffnung': topic(
		'Musik Eröffnung',
		'Musik für Eröffnungen mit Live-Viola.',
		'Unternehmen, Praxen, Showrooms, Stores und Institutionen, die einen neuen Ort einweihen',
		'Eröffnung, Soft Opening, Store Launch, Praxisstart, Ausstellung oder Standortfeier',
		'Bei Eröffnungen soll Musik Aufmerksamkeit erzeugen und gleichzeitig Gäste durch den neuen Raum begleiten.',
		'Ich plane Musik für Begrüßung, kurze Rede, Rundgang, Aperitif oder einen symbolischen Moment wie Band, Toast oder Übergabe.',
		'Diese Seite ist enger als allgemeine Firmenfeier-Musik, weil Eröffnungen einen klaren Anfang und eine räumliche Dramaturgie haben.',
		'Wir klären Einlass, Redezeiten, Wege im Raum, gewünschte Außenwirkung und ob Musik eher einladend oder festlich sein soll.',
		'Viola kann einen neuen Ort sofort wertiger wirken lassen, ohne ihn akustisch zu überladen.',
	),
	'musik-firmenempfang': topic(
		'Musik Firmenempfang',
		'Musik für Firmenempfänge und repräsentative Gäste.',
		'Unternehmen, die Mitarbeitende, Kundschaft, Partner oder Presse im passenden Rahmen begrüßen möchten',
		'Foyer, Konferenzbereich, Empfangshalle, Terrasse, Lounge oder Dinner-Vorraum',
		'Ein Firmenempfang braucht Musik, die Orientierung gibt und gleichzeitig Small Talk ermöglicht.',
		'Ich spiele Sets, die den Raum öffnen, aber genügend Luft für Begrüßung, Namensschilder, Getränke und kurze Gespräche lassen.',
		'Diese Seite fokussiert den Empfang als eigenen Moment und nicht die gesamte Firmenfeier.',
		'Wir planen Gästewellen, Begrüßung, Rede, Raumakustik, Setlänge und den Übergang in das nächste Programmelement.',
		'Live-Viola macht den Empfang persönlicher als eine Playlist und bleibt trotzdem schlank organisierbar.',
	),
	'musik-firmenfeier': topic(
		'Musik Firmenfeier',
		'Musik für Firmenfeiern mit Stil und Gesprächsraum.',
		'Teams, Geschäftsführungen und Eventplaner, die eine Firmenfeier musikalisch aufwerten möchten',
		'Sommerfest, Weihnachtsfeier, Jubiläum, Teamabend, Dinner oder offizieller Empfang',
		'Bei Firmenfeiern geht es meistens um Wertschätzung, Atmosphäre und einen guten Übergang vom Arbeitsalltag in den Abend.',
		'Ich begleite Empfang, Dinner, kurze Ehrung oder einen ruhigen Programmpunkt mit Solo-Viola.',
		'Diese Seite bleibt allgemein für Firmenfeiern; Spezialseiten wie Dinnermusik, Messe oder Eröffnung behandeln engere Situationen.',
		'Wichtig sind Gästezahl, Ablauf, Reden, Essen, Lautstärke, gewünschte Stimmung und Rechnungsdaten.',
		'Die Viola ist eine gute Lösung, wenn die Feier hochwertiger wirken soll, aber Gespräche weiterhin möglich bleiben müssen.',
	),
	'musik-gala': topic(
		'Musik Gala',
		'Musik für Gala, Empfang und festlichen Abend.',
		'Unternehmen, Verbände, Stiftungen und Gastgeber mit einem feierlichen Programm',
		'Galaabend, Preisverleihung, Dinner, Empfang, Bühne, Foyer oder ein offizieller Programmpunkt',
		'Gala-Musik muss festlicher wirken als Hintergrundmusik, darf aber Reden und Auszeichnungen nicht stören.',
		'Ich plane Solo-Viola für Empfang, Dinner oder kurze Akzente zwischen Programmpunkten.',
		'Diese Seite grenzt sich von Firmenfeier-Musik ab, weil Ton, Kleidung, Timing und Wirkung formeller geplant werden.',
		'Wir klären Ablaufplan, Moderation, Rednerwechsel, Auftrittsort, Licht, Länge der Musik und mögliche Einspieler.',
		'Viola kann einer Gala einen edlen Live-Moment geben, ohne den Abend in ein Konzert zu verwandeln.',
	),
	'musik-jubilaeum': topic(
		'Musik Jubiläum',
		'Musik für Firmenjubiläum und besondere Meilensteine.',
		'Unternehmen, Vereine oder Institutionen, die Geschichte, Dank und Zukunft in einem Abend verbinden',
		'Firmenjubiläum, Ehrung, Empfang, Dinner, Festakt oder kleines internes Jubiläum',
		'Bei Jubiläen soll Musik Wertschätzung ausdrücken und zugleich den Ablauf zwischen Reden, Rückblick und Begegnung tragen.',
		'Ich setze Viola für Empfang, Ehrungen, Dinner oder einen kurzen musikalischen Moment nach einer Rede ein.',
		'Diese Seite unterscheidet sich von allgemeiner Firmenfeier-Musik, weil die Bedeutung des Meilensteins stärker im Mittelpunkt steht.',
		'Wichtig sind Firmenhistorie, Gästeprofil, Reden, Ehrungen, gewünschte Stimmung und die Frage, ob Musik modern oder klassisch wirken soll.',
		'Ein Solo-Instrument kann sehr persönlich danken, ohne den Festakt zu verlängern.',
	),
	'musik-kundenempfang': topic(
		'Musik Kundenempfang',
		'Musik für Kundenempfang und Geschäftspartner.',
		'Unternehmen, Kanzleien, Praxen, Agenturen oder Marken mit eingeladenen Kundinnen und Kunden',
		'Kundenabend, Showroom, Foyer, Produkttermin, Dinner, Networking oder Jahresauftakt',
		'Beim Kundenempfang soll Musik Qualität zeigen, ohne den geschäftlichen Kontakt zu erschweren.',
		'Ich plane dezente Viola für Begrüßung, Gesprächsphasen, kurze Übergänge und ein wertiges Ankommen.',
		'Diese Seite ist enger als Firmenempfang, weil der Blick auf Kundenbeziehung, Vertrauen und Außenwirkung liegt.',
		'Wir klären Gästestruktur, Gesprächslautstärke, Branding, Dresscode, Setzeiten und ob Musik eher sichtbar oder zurückgenommen wirken soll.',
		'Live-Viola kann Wertschätzung zeigen, ohne dass Gäste sich wie in einer Bühnensituation fühlen.',
	),
	'musik-messe': topic(
		'Musik Messe',
		'Musik für Messe, Messestand und Kundenkontakt.',
		'Aussteller, Agenturen und Unternehmen, die am Messestand oder Messeabend hochwertig auffallen möchten',
		'Messestand, Lounge, Side Event, Messeparty, Kundenempfang oder Produktbereich',
		'Messe-Musik muss Aufmerksamkeit schaffen und trotzdem Beratungsgespräche, Leads und Laufwege respektieren.',
		'Ich plane kürzere Slots, klare Pausen, dezente Lautstärke und Repertoire, das auch im offenen Raum funktioniert.',
		'Diese Seite unterscheidet sich deutlich von Geburtstagsständchen oder allgemeiner Eventmusik: Der Fokus liegt auf Business-Kontakt und Messelogistik.',
		'Wichtig sind Hallenregeln, Standfläche, Strom- oder Technikvorgaben, Laufpublikum, Kundenzeiten und der Wechsel zwischen Stand und Abendformat.',
		'Eine Solo-Viola kann einen Messestand hochwertiger und menschlicher machen, ohne Gespräche akustisch zu blockieren.',
	),
	'musik-networking-event': topic(
		'Musik Networking Event',
		'Musik für Networking-Events, bei denen Gespräche zählen.',
		'Unternehmen, Verbände und Communities, die Kontakte bewusst erleichtern möchten',
		'Netzwerkabend, Afterwork, Foyer, Lounge, Branchentreffen oder Empfang nach einem Panel',
		'Networking braucht Musik, die Atmosphäre schafft, aber nicht gegen Stimmen arbeitet.',
		'Ich spiele flexible Sets mit viel Raum zwischen den Stücken, damit Gesprächsgruppen sich bilden können.',
		'Diese Seite grenzt sich von Gala und Dinnermusik ab, weil Bewegung, Gesprächsinseln und Lautstärke wichtiger sind als ein festes Programm.',
		'Wir klären Raumaufteilung, Gästezahl, geplante Kurzreden, Barbereich, Setzeiten und ob Musik beim Einlass oder später stärker wirken soll.',
		'Viola ist hier hilfreich, weil sie einen Live-Charakter erzeugt und trotzdem akustisch kontrollierbar bleibt.',
	),
	'musik-produktpraesentation': topic(
		'Musik Produktpräsentation',
		'Musik für Produktpräsentationen und Launch-Events.',
		'Marken, Unternehmen und Agenturen, die ein Produkt oder eine Idee wertig vorstellen möchten',
		'Launch, Showroom, Präsentationsfläche, Presseevent, Kundentermin oder kurzer Bühnenmoment',
		'Bei einer Produktpräsentation soll Musik Spannung und Wertigkeit geben, ohne das Produkt zu überstrahlen.',
		'Ich plane musikalische Übergänge, Einlass, Reveal-Moment, kurze Pausen und dezente Begleitung im Anschluss.',
		'Diese Seite unterscheidet sich von Eröffnung, weil nicht der Ort, sondern ein Produkt, Konzept oder neuer Service im Mittelpunkt steht.',
		'Wichtig sind Timing, Dramaturgie, Moderation, Akustik, Markenton und die Frage, ob Musik vor oder nach dem Präsentationsmoment eingesetzt wird.',
		'Live-Viola kann ein Produkt emotional rahmen, ohne dass Sprache, Video oder Präsentation konkurriert werden.',
	),
	'musikerin-firmenevent': topic(
		'Musikerin Firmenevent',
		'Musikerin für Firmenevents, Empfang und Dinner.',
		'Unternehmen, die gezielt eine professionelle Musikerin für einen Business-Anlass suchen',
		'Firmenfeier, Empfang, Dinner, Messeabend, Eröffnung, Gala oder Kundenveranstaltung',
		'Der Suchintent ist personenbezogen und buchungsnah: Es geht um eine konkrete Musikerin, nicht nur um Musik als Idee.',
		'Ich begleite Business-Events mit Viola, klarer Absprache, Rechnung und einem Ablauf, der zu Unternehmen passt.',
		'Diese Seite ist anders als Eventmusikerin, weil sie stärker auf Firmenevent, Buchung und Business-Rahmen zielt.',
		'Wichtig sind Termin, Ort, Anlass, Gästezahl, Dresscode, Rechnungsdaten und die gewünschte Rolle der Musik.',
		'Eine Solo-Musikerin ist besonders praktisch, wenn der Rahmen hochwertig sein soll und trotzdem wenig Abstimmung braucht.',
	),
	'streichmusik-firmenevent': topic(
		'Streichmusik Firmenevent',
		'Streichmusik für Firmenevents mit Solo-Viola.',
		'Unternehmen, die den Klang von Streichinstrumenten suchen, aber keine große Besetzung brauchen',
		'Empfang, Dinner, Jubiläum, Eröffnung, Gala oder ein offizieller Business-Moment',
		'Streichmusik meint Eleganz, Wärme und Live-Charakter; die Erwartung ist oft klassisch, aber nicht zwingend altmodisch.',
		'Ich spiele Solo-Viola als schlanke Form von Streichmusik, mit klassischem, modernem oder reduziertem Repertoire.',
		'Diese Seite beantwortet den Streicher-Intent und unterscheidet sich von Geige- und Viola-Seiten durch den allgemeineren Klangwunsch.',
		'Wir klären, ob Gäste klassische Musik erwarten, ob moderne Melodien passen und wie präsent die Musik sein soll.',
		'Solo-Streichmusik ist gut, wenn ein Raum elegant wirken soll, ohne Quartett, Bühne oder große Technik zu benötigen.',
	),
	'viola-firmenevent': topic(
		'Viola Firmenevent',
		'Viola für Firmenevents mit warmem Live-Klang.',
		'Unternehmen, die bewusst nach dem tieferen, weicheren Klang der Viola suchen',
		'Empfang, Dinner, Kundenevent, Jubiläum, Eröffnung, Messe oder ein kleiner Gala-Moment',
		'Der Suchintent dreht sich um das Instrument selbst und die Frage, ob Viola für ein Business-Event geeignet ist.',
		'Ich nutze den warmen, mittleren Klang der Viola für dezente Atmosphäre, feierliche Akzente und gesprächsfreundliche Begleitung.',
		'Diese Seite grenzt sich von Geige ab, weil die Viola weniger hell und oft angenehmer im Gesprächsumfeld wirkt.',
		'Wichtig sind Raumakustik, Gästezahl, gewünschte Stilrichtung und die Frage, ob der Klang solo oder verstärkt geplant wird.',
		'Viola eignet sich besonders für Unternehmen, die einen kultivierten Live-Klang suchen, der nicht grell oder dominant wird.',
	),
};

const BUSINESS_VARIANTS = [
	'Der rote Faden ist immer derselbe: Musik soll den Anlass veredeln, ohne Gespräche, Service oder offizielle Programmpunkte zu verdrängen.',
	'Ich plane deshalb nicht einfach eine Stückliste, sondern die Rolle der Musik im Ablauf: Ankommen, Begrüßung, Essen, Rede, Pause oder Ausklang.',
	'Gerade bei Business-Events ist Zurückhaltung eine Qualität. Der Klang darf spürbar sein, aber er muss jederzeit dem Zweck des Treffens dienen.',
	'Für Unternehmen ist Planbarkeit genauso wichtig wie Atmosphäre. Deshalb gehören Ablauf, Rechnung, Kontaktperson und Timing zur musikalischen Vorbereitung.',
	'Ein Solo-Instrument kann sehr hochwertig wirken und bleibt zugleich flexibel, wenn sich Reden verschieben oder Gäste länger im Empfang bleiben.',
];

const LOCAL_EVENT_SHAPES = [
	'Für einen Empfang eignet sich ein erstes Set von etwa zwanzig bis dreißig Minuten, danach können Pausen oder kurze Wiederaufnahmen folgen.',
	'Bei einem Dinner plane ich die Musik eher in Blöcken, damit Service, Gespräche und Reden sauber voneinander getrennt bleiben.',
	'Für eine Eröffnung ist der erste Eindruck entscheidend: Musik darf den Raum sofort markieren, ohne den Weg durch die Location zu blockieren.',
	'Bei einem Firmenjubiläum zählt Wertschätzung. Ein ruhiger Live-Moment kann eine Rede oder Ehrung verbinden, ohne den Abend zu verlängern.',
	'Für einen Messeabend ist Timing besonders wichtig, weil Gäste aus Terminen kommen und die Musik eher ein Ankommen als ein Konzert sein soll.',
];

const FAQ_ANGLES = [
	['Wie früh sollten wir anfragen?', 'Sobald Datum, Ort und grober Ablauf feststehen. Bei Business-Events hilft es, wenn Einlass, Reden und Essenszeiten bereits ungefähr bekannt sind.'],
	['Kannst du auch nur einen kurzen offiziellen Moment spielen?', 'Ja. Ein kurzes Set zur Begrüßung, ein musikalischer Akzent vor einer Rede oder ein ruhiger Übergang ist oft sinnvoller als lange durchgehende Musik.'],
	['Ist die Musik für Gespräche leise genug?', 'Ja, wenn sie entsprechend geplant wird. Ich passe Dynamik, Position und Setlänge so an, dass Gespräche weiterhin möglich bleiben.'],
	['Welche Informationen brauchst du für ein Angebot?', 'Hilfreich sind Termin, Ort, Anlass, Gästezahl, gewünschter Zeitraum, Raumart, Rechnungsadresse und ob Musik Hintergrund oder Programmpunkt sein soll.'],
	['Kann die Musik draußen stattfinden?', 'Grundsätzlich ja, wenn Wetter, Untergrund, Licht und Schutz für das Instrument stimmen. Für Außenbereiche plane ich immer eine realistische Alternative mit.'],
	['Spielst du mit Verstärkung?', 'Bei kleineren und mittleren Räumen ist akustische Viola oft ausreichend. Für größere Räume oder offene Flächen kann dezente Verstärkung sinnvoll sein.'],
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
			? `${base} mit Solo-Viola und Noten`
			: `Kim Marie Borger spielt ${base} bei einem Business-Anlass`,
	}));
}

function localFaq(slug, profile, keyword) {
	const extra = pick(slug, FAQ_ANGLES, 1);
	return [
		{
			question: `Spielst du auf Firmenevents ${profile.area}?`,
			answer: `Ja. Ich begleite Empfänge, Dinner, Firmenjubiläen, Eröffnungen, Kundenabende und ähnliche Business-Anlässe ${profile.area} mit Solo-Viola.`,
			open: true,
		},
		{
			question: `Welche Firmenfeier-Formate passen ${profile.area}?`,
			answer: `${profile.venue} Besonders sinnvoll ist Live-Musik, wenn Gäste ankommen, ein offizieller Moment gerahmt wird oder das Dinner nicht still wirken soll.`,
		},
		{
			question: `Was ist bei der Planung ${profile.area} besonders wichtig?`,
			answer: profile.logistics,
		},
		{
			question: 'Bleibt die Musik dezent genug für Gespräche?',
			answer: 'Ja. Ich plane Lautstärke, Repertoire, Position und Pausen so, dass Gespräche, Service und Reden weiterhin gut funktionieren.',
		},
		{
			question: 'Bekommen wir eine Rechnung für das Unternehmen?',
			answer: 'Ja. Eine ordentliche Rechnung mit den nötigen Angaben für Buchhaltung, Agentur oder Eventabteilung ist selbstverständlich.',
		},
		{
			question: extra[0],
			answer: extra[1],
		},
		{
			question: `Warum passt Solo-Viola für ${keyword}?`,
			answer: `Die Viola klingt warm, elegant und weniger hell als eine Geige. Dadurch eignet sie sich besonders für Business-Räume, in denen Musik hochwertig wirken soll, aber nicht zu dominant sein darf.`,
		},
		{
			question: `Welche Angaben helfen für ein Angebot ${profile.area}?`,
			answer: `Sinnvoll sind Datum, Location, Gästezahl, Anlass, gewünschter Zeitraum, grober Ablauf und die Information, ob Musik beim Empfang, Dinner, offiziellen Teil oder als kurzer Akzent geplant ist.`,
		},
	];
}

function topicFaq(slug, profile) {
	const extra = pick(slug, FAQ_ANGLES, 2);
	return [
		{
			question: `Für wen passt ${profile.keyword}?`,
			answer: `${profile.keyword} passt für ${profile.audience}. Entscheidend ist, dass die Musik im Ablauf eine klare Aufgabe bekommt.`,
			open: true,
		},
		{
			question: `Was unterscheidet ${profile.keyword} von allgemeiner Eventmusik?`,
			answer: profile.distinction,
		},
		{
			question: 'Kann die Musik wirklich im Hintergrund bleiben?',
			answer: 'Ja. Ich plane Dynamik, Setlänge und Position so, dass die Musik Atmosphäre schafft, aber Gespräche und offizielle Programmpunkte nicht stört.',
		},
		{
			question: 'Welche Musikstile sind möglich?',
			answer: 'Möglich sind klassische Stücke, moderne Melodien, ruhige Pop-Bearbeitungen und reduzierte instrumentale Linien. Entscheidend ist, dass die Melodie solo auf der Viola trägt.',
		},
		{
			question: extra[0],
			answer: extra[1],
		},
		{
			question: 'Wie wird der Ablauf abgestimmt?',
			answer: `${profile.planning} Danach entsteht ein klares Set-Konzept mit Startzeit, Pausen und möglichem Ende.`,
		},
		{
			question: 'Ist eine Buchung über Agentur oder Firma möglich?',
			answer: 'Ja. Ich kann die Anfrage direkt mit Unternehmen, Assistenz, Eventagentur, Location oder Projektleitung abstimmen und eine reguläre Rechnung stellen.',
		},
		{
			question: `Warum eignet sich Viola für ${profile.keyword}?`,
			answer: profile.proof,
		},
	];
}

function buildLocal(slug, doc) {
	const profile = LOCATION_PROFILES[slug];
	if (!profile) throw new Error(`Missing location profile for ${slug}`);
	const keyword = `Live Musik Firmenevent ${profile.label}`;
	const shape = pick(slug, LOCAL_EVENT_SHAPES, 3);
	const variantOne = pick(slug, BUSINESS_VARIANTS, 4);
	const variantTwo = pick(slug, BUSINESS_VARIANTS, 5);
	const variantThree = pick(slug, BUSINESS_VARIANTS, 6);

	return {
		targetKeyword: keyword,
		seoTitle: `Firmenevent ${profile.label} | Live-Viola`,
		seoDescription: `${keyword}: dezente Solo-Viola für Empfang, Dinner, Firmenjubiläum, Messe, Eröffnung und Kundenveranstaltung.`,
		hero: {
			eyebrow: 'Business-Events',
			title: `Live Musik für Firmenevents ${profile.area}.`,
			lead: `${profile.business} Ich begleite Empfang, Dinner und offizielle Momente mit warmer Solo-Viola, klarer Abstimmung und professionellem Ablauf.`,
			badge: 'Solo-Viola für Empfang, Dinner & Jubiläum',
		},
		split: {
			eyebrow: 'Lokaler Rahmen',
			title: `Firmenevents ${profile.area} brauchen Musik mit Fingerspitzengefühl.`,
			lede: `${profile.clientLens} Genau darauf stimme ich Klang, Repertoire, Setlänge und Position im Raum ab.`,
			paragraphs: [
				profile.business,
				profile.venue,
				profile.logistics,
				profile.detailOne,
				profile.detailTwo,
				profile.clientLens,
				shape,
				variantOne,
				`Für ${keyword} ist wichtig, dass Musik nicht wie eine private Einlage wirkt. Sie soll professionell eingebunden sein, zur Marke passen und Gästen den Einstieg in Gespräche erleichtern.`,
				`Ich bespreche vorab, ob die Viola beim Einlass sichtbar sein soll, ob sie den offiziellen Teil vorbereitet oder ob sie später als ruhige Dinnermusik zurücktritt.`,
				`Auch die Lautstärke wird bewusst geplant. In einem Foyer braucht Musik eine andere Präsenz als in einem Restaurant, auf einer Terrasse oder in einem Konferenzraum.`,
				`Der Vorteil von Solo-Viola liegt in der schlanken Umsetzung: wenig Aufbau, kein großes Bühnenbild, aber ein Klang, der deutlich mehr Persönlichkeit hat als eine Playlist.`,
				variantTwo,
				`Für Unternehmen ${profile.area} ist außerdem die organisatorische Seite wichtig. Ich kläre Kontaktperson, Uhrzeit, Rechnungsdaten, mögliche Pausen und den Punkt, an dem Musik enden oder in den nächsten Programmpunkt übergehen soll.`,
				`Wenn Reden, Ehrungen oder Produktmomente geplant sind, setze ich die Musik so, dass sie diese Szenen rahmt und nicht kommentiert. Ein kurzer Live-Akzent kann stärker wirken als ein langes Set ohne klare Aufgabe.`,
				`Die Seite fokussiert bewusst ${keyword}. Andere Firmenfeier-Seiten behandeln Messe, Gala, Dinnermusik oder allgemeine Eventmusik; hier geht es um den konkreten Rahmen ${profile.area}.`,
				variantThree,
				`Für die erste Anfrage reichen Datum, Location, ungefähre Gästezahl, Anlass und der gewünschte musikalische Zeitraum. Danach lässt sich schnell einschätzen, ob ein Empfangsset, Dinnermusik oder ein einzelner offizieller Moment am besten passt.`,
			],
			seal: `${profile.label}\nBusiness\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Ablauf',
			title: `So kann Live-Musik ${profile.area} eingebunden werden.`,
			lead: `Je nach Anlass kann die Viola beim Empfang, während des Dinners, vor einer Rede oder als kurzer musikalischer Akzent eingesetzt werden.`,
			items: [
				{
					time: '01',
					kicker: 'Empfang',
					title: `Ankommen ${profile.area}`,
					text: `Die Musik öffnet den Raum, während Gäste eintreffen, Getränke nehmen und erste Gespräche entstehen. ${profile.detailOne}`,
				},
				{
					time: '02',
					kicker: 'Dinner',
					title: 'Dinnermusik mit Pausen',
					text: `Für Essen und Service plane ich Sets so, dass Gespräche möglich bleiben und Reden nicht unterbrochen werden. ${profile.venue}`,
				},
				{
					time: '03',
					kicker: 'Akzent',
					title: 'Offizielle Momente rahmen',
					text: `Bei Begrüßung, Ehrung, Produktmoment oder Eröffnung kann ein kurzes Stück mehr Wirkung haben als lange Hintergrundmusik. ${profile.clientLens}`,
				},
				{
					time: '04',
					kicker: 'Planung',
					title: 'Logistik ruhig vorbereiten',
					text: `${profile.logistics} Außerdem klären wir Rechnung, Kontaktperson, Dresscode und den gewünschten musikalischen Charakter.`,
				},
			],
			footnote: `Für ${keyword} plane ich Musik als Teil des Business-Ablaufs, nicht als zufälligen Programmpunkt.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keyword}`,
			items: localFaq(slug, profile, keyword),
		},
		contact: {
			eyebrow: 'Anfrage',
			title: `${keyword} anfragen`,
			lead: `Schick mir Datum, Location, Gästezahl und den geplanten Anlass ${profile.area}. Ich melde mich mit einer passenden Idee für Empfang, Dinner oder offiziellen Moment.`,
			checklist: [
				keyword,
				'Empfang, Dinner oder offizieller Akzent',
				'Termin, Ort & Rechnungsdaten',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt Live-Viola zu eurem Firmenevent ${profile.area}?`,
			formSuccess: `Danke - ich melde mich mit einer Idee für Live-Musik ${profile.area}.`,
		},
		imageAlts: altText(doc, `Live-Musik für Firmenevents ${profile.area}`),
	};
}

function buildTopic(slug, doc) {
	const profile = TOPIC_PROFILES[slug];
	if (!profile) throw new Error(`Missing topic profile for ${slug}`);
	const keywordTitle = titleFromKeyword(profile.keyword);
	const variantOne = pick(slug, BUSINESS_VARIANTS, 10);
	const variantTwo = pick(slug, BUSINESS_VARIANTS, 11);
	const variantThree = pick(slug, BUSINESS_VARIANTS, 12);

	return {
		targetKeyword: profile.keyword,
		seoTitle: `${keywordTitle} | Live-Viola für Business`,
		seoDescription: `${profile.keyword}: Solo-Viola für Business-Events. Dezent, hochwertig, gesprächsfreundlich und professionell planbar.`,
		hero: {
			eyebrow: 'Business-Musik',
			title: profile.title,
			lead: `${profile.intent} Ich plane Solo-Viola so, dass Musik, Ablauf, Raum und geschäftlicher Anlass zusammenpassen.`,
			badge: 'Live-Viola für Unternehmen',
		},
		split: {
			eyebrow: 'Suchintention',
			title: `${keywordTitle} braucht einen eigenen musikalischen Fokus.`,
			lede: `${profile.audience} suchen keine beliebige Musik, sondern eine Lösung für ${profile.setting}.`,
			paragraphs: [
				profile.intent,
				profile.musicRole,
				profile.distinction,
				profile.planning,
				profile.proof,
				`Bei ${profile.keyword} beginne ich mit der Frage, welche Aufgabe die Musik im Business-Ablauf übernimmt: einladend, verbindend, festlich, dezent oder als klarer Akzent.`,
				`Die Setlänge hängt nicht nur von der gebuchten Zeit ab. Wichtig ist, wann Gäste wirklich hören, wann sie sprechen, wann Service läuft und wann ein offizieller Programmpunkt Aufmerksamkeit braucht.`,
				variantOne,
				`Ich wähle Repertoire so aus, dass es auf der Viola verständlich bleibt. Manche bekannten Stücke wirken ohne Gesang wunderbar, andere verlieren ohne Text ihren Sinn und werden besser ersetzt.`,
				`Auch die Platzierung im Raum gehört zur Planung. Zu nah am Buffet ist Musik oft im Weg, zu weit entfernt verliert sie Wirkung. Die beste Position unterstützt Bewegung und Blickrichtung der Gäste.`,
				`Für ${profile.keyword} kann klassische Musik passend sein, aber auch moderne Melodien, ruhige Pop-Bearbeitungen oder reduzierte instrumentale Linien. Entscheidend ist der Anlass, nicht eine starre Stil-Schublade.`,
				variantTwo,
				`Die organisatorische Seite bleibt bewusst klar: Termin, Ort, Kontaktperson, Rechnungsdaten, Dresscode, gewünschte Spielzeit und eventuelle Besonderheiten der Location.`,
				`Wenn Agentur, Assistenz, Location und Unternehmen beteiligt sind, kann ich die musikalischen Eckpunkte kurz und verbindlich abstimmen, damit am Veranstaltungstag niemand lange erklären muss.`,
				`Diese Seite bleibt bei ${profile.keyword}. Verwandte Seiten behandeln einzelne Orte, Messe, Firmenfeier, Gala, Dinnermusik oder Instrumentenfragen; hier geht es um den konkreten Suchintent dieses Begriffs.`,
				variantThree,
				`Für eine erste Einschätzung reichen wenige Angaben. Danach kann ich vorschlagen, ob ein durchgehender Rahmen, mehrere kurze Sets oder ein einzelner musikalischer Moment die sauberste Lösung ist.`,
			],
			seal: `${keywordTitle}\nBusiness\nLive-Viola`,
		},
		focus: {
			eyebrow: 'Planung',
			title: `Worauf es bei ${keywordTitle} ankommt.`,
			lead: `Der musikalische Rahmen wird so geplant, dass er zum Anlass passt und den geschäftlichen Zweck der Veranstaltung unterstützt.`,
			items: [
				{
					time: '01',
					kicker: 'Intent',
					title: 'Die Rolle der Musik festlegen',
					text: `${profile.intent} Daraus ergibt sich, ob Musik eher dezent, sichtbar, festlich oder verbindend eingesetzt wird.`,
				},
				{
					time: '02',
					kicker: 'Raum',
					title: 'Akustik und Bewegung beachten',
					text: `${profile.setting} hat eigene Anforderungen an Lautstärke, Position und Länge der Sets.`,
				},
				{
					time: '03',
					kicker: 'Ablauf',
					title: 'Übergänge statt Dauerbeschallung',
					text: `${profile.planning} So bleibt Musik Teil des Ablaufes und nicht nur akustische Fläche.`,
				},
				{
					time: '04',
					kicker: 'Klang',
					title: 'Viola passend einsetzen',
					text: `${profile.proof} Der Klang bleibt live, warm und zugleich kontrollierbar.`,
				},
			],
			footnote: `${profile.keyword} wird als eigene Seite geführt, weil der Suchintent andere Fragen stellt als eine allgemeine Firmenfeier-Seite.`,
		},
		faq: {
			eyebrow: 'Gut zu wissen',
			title: `FAQ zu ${keywordTitle}`,
			items: topicFaq(slug, profile),
		},
		contact: {
			eyebrow: 'Anfrage',
			title: `${keywordTitle} anfragen`,
			lead: `Schick mir Datum, Ort, Gästezahl und den geplanten Ablauf für ${profile.keyword}. Ich melde mich mit einer passenden Idee für Solo-Viola im Business-Kontext.`,
			checklist: [
				profile.keyword,
				profile.setting,
				'Termin, Ablauf & Rechnung',
			],
			formEyebrow: 'Direkt anfragen',
			formTitle: `Passt ${keywordTitle} zu eurem Event?`,
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
