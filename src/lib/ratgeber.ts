import { coreServiceNode } from './schema';
import { canonicalUrl } from './url';

export interface RatgeberLink {
	label: string;
	href: string;
	note?: string;
}

export interface RatgeberSection {
	title: string;
	body: string[];
	links?: RatgeberLink[];
}

export interface RatgeberFaq {
	question: string;
	answer: string;
}

export interface RatgeberPage {
	slug: string;
	title: string;
	shortTitle: string;
	seoTitle: string;
	seoDescription: string;
	intent: string;
	cluster: 'Hochzeit' | 'Trauerfeier' | 'Unterricht' | 'Geburtstag' | 'Firmenevent';
	serviceSlug: 'hochzeiten' | 'beerdigungen' | 'unterricht' | 'geburtstage' | 'firmenfeiern';
	heroImage: string;
	heroImageAlt: string;
	kicker: string;
	lead: string;
	summary: string;
	keyPoints: string[];
	sections: RatgeberSection[];
	internalLinks: RatgeberLink[];
	nextStep: RatgeberLink;
	faqs: RatgeberFaq[];
	openNext?: string[];
}

export const RATGEBER_BASE_PATH = '/ratgeber/';

export const RATGEBER_PAGES: RatgeberPage[] = [
	{
		slug: 'musik-zur-trauung',
		title: 'Ablaufplan für Musik zur Trauung',
		shortTitle: 'Ablaufplan Trauungsmusik',
		seoTitle: 'Ablaufplan Trauungsmusik | Einzug bis Auszug',
		seoDescription:
			'Checkliste für Trauungsmusik: Einzug, Ringtausch, Ja-Wort, Unterschrift und Auszug in eine stimmige Reihenfolge bringen.',
		intent: 'Paare suchen Orientierung, welche Musik an welcher Stelle der Trauung sinnvoll ist.',
		cluster: 'Hochzeit',
		serviceSlug: 'hochzeiten',
		heroImage: '/uploads/mq0uvv3p-20250327-DSC01349.webp',
		heroImageAlt: 'Kim Marie Borger spielt Viola vor festlicher Kulisse',
		kicker: 'Trauung',
		lead:
			'Eine Trauung braucht nicht viele Stücke, sondern klare musikalische Momente. Dieser Ratgeber hilft, Einzug, Ja-Wort, Ringtausch und Auszug ruhig zu planen.',
		summary:
			'Ideal für Paare, die gerade den Ablauf ihrer freien, kirchlichen oder standesamtlichen Trauung sortieren.',
		keyPoints: [
			'Zwei bis vier musikalische Einsätze reichen oft aus.',
			'Das wichtigste Stück ist meist der Einzug oder der Auszug.',
			'Wunschmusik sollte früh auf Spielbarkeit und Länge geprüft werden.',
		],
		sections: [
			{
				title: 'Welche Momente brauchen Musik?',
				body: [
					'Typische Stellen sind der Einzug, ein stiller Moment nach dem Ja-Wort, die Unterschrift und der Auszug. Nicht jede Trauung braucht alle vier Einsätze. Entscheidend ist, wo die Musik wirklich etwas trägt.',
					'Bei einer freien Trauung kann zusätzlich ein Ritual begleitet werden. In der Kirche sollte die Auswahl zum liturgischen Ablauf passen. Im Standesamt ist die Musik meist kürzer und präziser geplant.',
				],
			},
			{
				title: 'Wie viele Stücke sind sinnvoll?',
				body: [
					'Für eine kurze Trauung reichen oft zwei Stücke: ein bewusst gewähltes Stück zum Einzug und ein helleres Stück zum Auszug. Wenn Ringtausch oder Unterschrift Raum bekommen sollen, können weitere kurze Einsätze dazukommen.',
					'Wichtiger als die Anzahl ist das Timing. Live-Musik kann warten, atmen und auf den Moment reagieren. Das ist besonders hilfreich, wenn sich Abläufe verschieben.',
				],
			},
			{
				title: 'Klassisch, modern oder persönlich?',
				body: [
					'Klassische Stücke wirken vertraut und feierlich. Moderne Songs können sehr persönlich sein, müssen aber für Solo-Viola sinnvoll eingerichtet werden. Ein Lieblingslied passt besonders gut, wenn es emotional wichtig ist und nicht nur als Trend gewählt wird.',
					'Die beste Auswahl entsteht aus dem Ort, dem Ablauf und der Frage, wie die Zeremonie klingen soll: ruhig, festlich, schlicht oder sehr persönlich.',
				],
			},
		],
		internalLinks: [
			{ label: 'Hochzeitsmusik buchen', href: '/hochzeiten/', note: 'Leistungsseite mit Anfrage' },
			{ label: 'Musik zur Trauung', href: '/hochzeiten/musik-zur-trauung/', note: 'passende Themenseite' },
			{ label: 'Musik zur freien Trauung', href: '/hochzeiten/musik-freie-trauung/' },
			{ label: 'Musik zum Ringtausch', href: '/hochzeiten/musik-ringtausch/' },
		],
		nextStep: { label: 'Trauungsmusik anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Welche Musik passt zum Einzug?',
				answer:
					'Das Stück sollte genug Ruhe für den Weg geben und zum Ort passen. Häufig funktionieren feierliche Klassiker, ein ruhiger moderner Song oder ein persönliches Lieblingslied.',
			},
			{
				question: 'Kann ein Lieblingslied zur Trauung gespielt werden?',
				answer:
					'Ja, wenn es musikalisch für Solo-Viola geeignet ist. Sinnvoll ist eine frühe Prüfung, damit Tonart, Länge und Einsatzpunkt passen.',
			},
			{
				question: 'Muss die Musik mit Trauredner:in oder Kirche abgestimmt werden?',
				answer:
					'Ja. Einsätze, Dauer und mögliche technische oder räumliche Vorgaben sollten vorab geklärt werden.',
			},
		],
	},
	{
		slug: 'musik-im-standesamt',
		title: 'Musik im Standesamt: Ablauf und Checkliste',
		shortTitle: 'Checkliste Standesamt',
		seoTitle: 'Musik im Standesamt: Was ist möglich? | Ablauf & Checkliste',
		seoDescription:
			'Musik bei der standesamtlichen Trauung planen: Was erlaubt das Standesamt? Welche Momente eignen sich für Einzug, Unterschrift und Auszug? Checkliste für euren Ablauf.',
		intent: 'Paare möchten wissen, ob und wie Live-Musik im Standesamt organisatorisch funktioniert.',
		cluster: 'Hochzeit',
		serviceSlug: 'hochzeiten',
		heroImage: '/uploads/mq0uvv7v-20250327-DSC01550.webp',
		heroImageAlt: 'Kim Marie Borger spielt Viola im Abendlicht',
		kicker: 'Standesamt',
		lead:
			'Wann kann Musik bei der standesamtlichen Trauung erklingen? Mögliche Momente sind Einzug, Unterschrift und Auszug. Welche davon in eurem Termin Platz haben, klärt ihr zuerst mit dem Standesamt. Daraus entsteht ein kurzer, abgestimmter Musikplan.',
		summary:
			'Für Paare, die eine schlichte standesamtliche Trauung musikalisch aufwerten möchten, ohne den Ablauf zu überladen.',
		keyPoints: [
			'Vorher klären, ob und wann Live-Musik im Raum erlaubt ist.',
			'Mögliche Momente: Einzug, Unterschrift und Auszug.',
			'Zugang, Spielplatz und Startsignal vorher vereinbaren.',
		],
		sections: [
			{
				title: 'Was ist im Standesamt realistisch?',
				body: [
					'Ob Live-Musik möglich ist, entscheidet das jeweilige Standesamt für den konkreten Trauraum und Termin. Fragt nach zugelassenen Musikmomenten, maximaler Dauer und der Möglichkeit, vorher in den Raum zu kommen. Haltet die bestätigten Angaben fest, bevor ihr Stücke verbindlich plant.',
					'Für die Solo-Viola klären wir einen geeigneten Spielplatz und die Hörsituation im Raum. Fotos, Raumgröße und Gästezahl helfen bei der Einschätzung. Falls technische Anforderungen bestehen, werden sie mit dem Standesamt vor der Buchung abgestimmt.',
				],
			},
			{
				title: 'Welche Stellen eignen sich?',
				body: [
					'Zum Einzug kann ein vereinbartes Stück den Weg in den Raum begleiten. Während der Unterschrift kann Musik eine Wartephase füllen, wenn das im Ablauf vorgesehen ist. Für den Auszug wird ein eigener Einsatz nach dem offiziellen Abschluss abgestimmt. Nicht jeder Termin bietet Platz für alle drei Momente.',
					'Ordnet jedem bestätigten Einsatz ein Stück und ein Startsignal zu. Ist das Zeitfenster knapp, entscheidet euch für die Momente, die euch am wichtigsten sind. Länge und Schluss der Fassung werden so geplant, dass sie zum tatsächlichen Ablauf passen.',
				],
				links: [
					{ label: 'Musik während der Unterschrift', href: '/hochzeiten/musik-unterschrift-standesamt/' },
					{ label: 'Musik zum Auszug', href: '/hochzeiten/musik-auszug/' },
				],
			},
			{
				title: 'Was sollte vorab geklärt werden?',
				body: [
					'Klärt den genauen Eingang, die Ankunftszeit und den Zugang zum Trauraum. Kann die Musikerin vor dem Eintreffen der Gäste aufbauen und stimmen? Wer ist am Termin erreichbar? Eine Kontaktperson koordiniert den Einlass und das vereinbarte Startsignal, damit ihr euch während der Trauung darum nicht kümmern müsst.',
					'Wenn anschließend ein Empfang an einem anderen Ort geplant ist, behandelt ihn als eigene Spielphase. Wege, Aufbau und Wartezeiten müssen zum gebuchten Umfang passen. Auch eine Außenfläche braucht einen trockenen, schattigen Spielplatz und eine abgestimmte Innenalternative.',
				],
				links: [{ label: 'Empfang und Hochzeitsfeier weiterplanen', href: '/ratgeber/musikplanung-hochzeitsfeier/' }],
			},
			{
				title: 'Kurze Checkliste für euren Ablauf',
				body: [
					'In euren Musikplan gehören Datum, Adresse und Raum, die bestätigten Einsatzpunkte, das jeweilige Stück, die mögliche Länge und die Person für das Startsignal. Ergänzt die Ankunftszeit und, falls vorgesehen, den Ort des anschließenden Empfangs. Gebt die abgestimmte Fassung an Standesamt, Musikerin und Kontaktperson weiter.',
					'Schickt Wunschlieder frühzeitig mit Titel und Interpret:in. Ich prüfe, ob sie für Solo-Viola geeignet sind und wie sie zum Zeitfenster passen. Neue Bearbeitung oder Notation wird vorab besprochen. Hörproben helfen euch, euch den Instrumentalklang vorzustellen, bevor ihr eure Auswahl festlegt.',
				],
				links: [{ label: 'Viola-Hörproben anhören', href: '/portfolio/' }, { label: 'Wunschmusik vorbereiten', href: '/ratgeber/wunschmusik-hochzeit/' }],
			},
		],
		internalLinks: [
			{ label: 'Musik Standesamt Hochzeit', href: '/hochzeiten/musik-standesamt/', note: 'passende Themenseite' },
			{ label: 'Hochzeitsmusik', href: '/hochzeiten/' },
			{ label: 'Musik zur Unterschrift', href: '/hochzeiten/musik-unterschrift-standesamt/' },
			{ label: 'Musik zum Auszug', href: '/hochzeiten/musik-auszug/' },
			{ label: 'Hochzeitsmusik in Düsseldorf', href: '/hochzeiten/duesseldorf/', note: 'Trauung und Empfang vor Ort abstimmen' },
		],
		nextStep: { label: 'Termin im Standesamt anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Ist Live-Musik im Standesamt erlaubt?',
				answer:
					'Das entscheidet das jeweilige Standesamt für euren Trauraum und Termin. Lasst Musikmomente, Dauer, Zugang und mögliche technische Anforderungen bestätigen, bevor ihr verbindlich plant.',
			},
			{
				question: 'Wie viele Stücke braucht eine standesamtliche Trauung?',
				answer:
					'Mögliche Einsätze sind Einzug, Unterschrift und Auszug. Ob ein, zwei oder drei Stücke Platz haben, ergibt sich aus dem bestätigten Ablauf und dem verfügbaren Zeitfenster.',
			},
			{
				question: 'Braucht Solo-Viola Technik im Standesamt?',
				answer:
					'Das wird anhand von Raum, Gästezahl und Akustik eingeschätzt. Wenn Technik benötigt wird, stimmen wir deren Einsatz vorher mit dem Standesamt ab.',
			},
			{
				question: 'Wann beginnt die Musik bei der standesamtlichen Trauung?',
				answer: 'Jeder bestätigte Musikeinsatz bekommt ein Startsignal, etwa zum Einzug oder nach der Unterschrift. Wer das Signal gibt, wird mit Standesamt und Kontaktperson vor dem Termin vereinbart.',
			},
			{
				question: 'Kann ein modernes Lieblingslied gespielt werden?',
				answer: 'Schickt Titel und Interpret:in. Ich prüfe die Eignung für Solo-Viola sowie Länge und Vorbereitung. Das Stück wird erst nach dieser Prüfung und der Abstimmung mit dem Ablauf vereinbart.',
			},
			{
				question: 'Kann die Musik beim anschließenden Empfang weitergehen?',
				answer: 'Ein Empfang kann als eigene Spielphase angefragt werden. Ort, Wege, Aufbau, Spielzeit und mögliche Wartezeiten werden dafür gemeinsam abgestimmt und im Angebot berücksichtigt.',
			},
		],
	},
	{
		slug: 'wunschmusik-hochzeit',
		title: 'Wunschmusik bei der Hochzeit',
		shortTitle: 'Wunschmusik Hochzeit',
		seoTitle: 'Wunschmusik Hochzeit | Lieblingslied live mit Viola',
		seoDescription:
			'Wunschmusik zur Hochzeit planen: Wann ein Lieblingslied passt, wie es für Viola eingerichtet wird und welche Grenzen sinnvoll sind.',
		intent: 'Paare suchen Hilfe, ob ihr Lieblingslied live bei der Hochzeit gespielt werden kann.',
		cluster: 'Hochzeit',
		serviceSlug: 'hochzeiten',
		heroImage: '/uploads/mq0uvv3p-20250327-DSC01349.webp',
		heroImageAlt: 'Kim Marie Borger spielt Viola vor festlicher Kulisse',
		kicker: 'Wunschlied',
		lead:
			'Ein Lieblingslied kann eine Trauung unverwechselbar machen. Damit es live gut wirkt, braucht es eine ehrliche Prüfung von Melodie, Länge und Anlass.',
		summary:
			'Für Paare, die ein persönliches Lied einbinden möchten und wissen wollen, wie Wunschmusik praktisch vorbereitet wird.',
		keyPoints: [
			'Nicht jeder Song funktioniert automatisch als Solo-Instrumentalstück.',
			'Die Melodie muss ohne Gesang verständlich bleiben.',
			'Der Anlass entscheidet, ob das Lied eher zum Einzug, zur Mitte oder zum Auszug passt.',
		],
		sections: [
			{
				title: 'Wann passt ein Wunschlied?',
				body: [
					'Ein Wunschlied passt besonders gut, wenn es eine echte Verbindung zum Paar hat. Es muss nicht jedem Gast bekannt sein. Wichtiger ist, dass es im Moment trägt und nicht erklärt werden muss.',
					'Für den Einzug eignet sich ein Lied mit ruhigem Aufbau. Für den Auszug darf es heller und bewegter sein. Für die Unterschrift oder einen stillen Moment sind schlichte, melodische Fassungen sinnvoll.',
				],
			},
			{
				title: 'Was passiert beim Arrangement?',
				body: [
					'Bei einem Arrangement wird geprüft, welche Melodie die Viola übernimmt, welche Tonart angenehm klingt und wie lang die Fassung sein sollte. Manche Songs brauchen eine starke Reduktion, damit sie ohne Band und Gesang wirken.',
					'Wenn ein Stück musikalisch nicht sinnvoll übertragbar ist, ist eine ehrliche Alternative besser als eine Fassung, die am Tag enttäuscht.',
				],
			},
			{
				title: 'Wie früh sollte man Wunschmusik anfragen?',
				body: [
					'Je früher das Lied bekannt ist, desto besser. So bleibt Zeit für Prüfung, Vorbereitung und eine passende Einbindung in den Ablauf.',
					'Bei kurzfristigen Anfragen kann vorhandenes Repertoire die bessere Lösung sein. Persönliche Wirkung entsteht nicht nur durch einen Songtitel, sondern auch durch Timing und Spielweise.',
				],
			},
		],
		internalLinks: [
			{ label: 'Hochzeitsmusik buchen', href: '/hochzeiten/' },
			{ label: 'Musik Brauteinzug', href: '/hochzeiten/musik-brauteinzug/' },
			{ label: 'Musik nach dem Ja-Wort', href: '/hochzeiten/musik-nach-ja-wort/' },
			{ label: 'Solo-Musikerin Hochzeit', href: '/hochzeiten/solo-musikerin-hochzeit/' },
		],
		nextStep: { label: 'Wunschlied prüfen lassen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Kann jedes Lied auf Viola gespielt werden?',
				answer:
					'Nicht jedes Lied eignet sich gleich gut. Entscheidend sind Melodie, Tonumfang, Wiedererkennung und die Wirkung ohne Gesang.',
			},
			{
				question: 'Kostet ein Wunscharrangement extra?',
				answer:
					'Das hängt vom gebuchten Rahmen und vom Aufwand ab. Die konkrete Einschätzung erfolgt nach Prüfung des Stücks.',
			},
			{
				question: 'Kann moderne Musik feierlich klingen?',
				answer:
					'Ja, wenn sie passend eingerichtet und an der richtigen Stelle eingesetzt wird. Eine reduzierte Viola-Fassung kann sehr ruhig und persönlich wirken.',
			},
		],
	},
	{
		slug: 'trauermusik-repertoire',
		title: 'Trauermusik auswählen: eine ruhige Entscheidungshilfe',
		shortTitle: 'Trauermusik auswählen',
		seoTitle: 'Trauermusik auswählen | Wirkung, Ablauf & Stücke',
		seoDescription:
			'Entscheidungshilfe für Trauermusik: Stücke nach Person, Wirkung und Einsatzpunkt auswählen – von Klassik bis Lieblingslied.',
		intent: 'Angehörige suchen passende Stücke für Beerdigung, Trauerfeier oder Abschied.',
		cluster: 'Trauerfeier',
		serviceSlug: 'beerdigungen',
		heroImage: '/uploads/mq0uz91j-viola-6668608_1280.webp',
		heroImageAlt: 'Viola, stille Detailaufnahme im warmen Licht',
		kicker: 'Abschied',
		lead:
			'Trauermusik soll Halt geben, nicht überfordern. Ein kleines, gut gewähltes Repertoire hilft, die Trauerfeier würdevoll und persönlich zu rahmen.',
		summary:
			'Für Angehörige, die unter Zeitdruck Musik auswählen und eine ruhige Orientierung brauchen.',
		keyPoints: [
			'Ruhige Klassiker sind eine sichere Basis.',
			'Ein Lieblingslied kann persönlicher sein als ein bekanntes Trauerstück.',
			'Instrumentalmusik lässt Raum für Erinnerung, Gebet und Stille.',
		],
		sections: [
			{
				title: 'Welche Stücke werden häufig gewählt?',
				body: [
					'Klassische Trauermusik wie Ave Maria, Air oder Meditation wird häufig gewählt, weil sie vielen Menschen vertraut ist und einen ruhigen Rahmen schafft.',
					'Amazing Grace oder ein persönliches Lieblingslied können stärker biografisch wirken. Entscheidend ist, ob das Stück zur verstorbenen Person und zum Ort der Feier passt.',
				],
			},
			{
				title: 'Wie viele Musikmomente braucht eine Trauerfeier?',
				body: [
					'Oft reichen zwei bis vier musikalische Momente: Beginn, eine stille Phase, der Auszug und bei Bedarf Musik am Grab. Mehr Musik ist nicht automatisch besser.',
					'Die Musik sollte Pausen nicht füllen, sondern bewusst markieren. Gerade Stille darf bei einer Trauerfeier ihren Platz behalten.',
				],
			},
			{
				title: 'Wie persönlich darf Trauermusik sein?',
				body: [
					'Sehr persönlich, wenn es zum Abschied passt. Ein Lieblingslied kann eine Erinnerung öffnen, ohne viele Worte zu brauchen.',
					'Wenn ein Lied im Original sehr laut oder textlastig ist, kann eine reduzierte Viola-Fassung helfen. Sie nimmt die Melodie auf und hält den Rahmen stiller.',
				],
			},
		],
		internalLinks: [
			{ label: 'Trauermusik Repertoire', href: '/beerdigungen/trauermusik-repertoire/', note: 'passende Themenseite' },
			{ label: 'Musik zur Trauerfeier', href: '/beerdigungen/' },
			{ label: 'Ave Maria Beerdigung', href: '/beerdigungen/ave-maria-beerdigung/' },
			{ label: 'Amazing Grace Beerdigung', href: '/beerdigungen/amazing-grace-beerdigung/' },
		],
		nextStep: { label: 'Trauermusik anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Welche Trauermusik ist angemessen?',
				answer:
					'Angemessen ist Musik, die zur Person, zum Ort und zur Familie passt. Klassische Stücke, ruhige Instrumentalmusik oder ein Lieblingslied können gleichermaßen sinnvoll sein.',
			},
			{
				question: 'Kann Musik am Grab gespielt werden?',
				answer:
					'Das ist oft möglich, muss aber mit Friedhof, Bestattungshaus und Wetterbedingungen abgestimmt werden.',
			},
			{
				question: 'Sind Ave Maria und Amazing Grace immer passend?',
				answer:
					'Sie sind vertraute Stücke, aber nicht automatisch die beste Wahl. Entscheidend ist, ob sie zur Person und zur gewünschten Atmosphäre passen.',
			},
		],
	},
	{
		slug: 'musik-zur-trauerfeier',
		title: 'Ablaufcheck für Musik bei der Trauerfeier',
		shortTitle: 'Ablaufcheck Trauerfeier',
		seoTitle: 'Musik bei der Trauerfeier | Ablaufcheck & Abstimmung',
		seoDescription:
			'Ablaufcheck für Musik bei der Trauerfeier: Einsatzpunkte und Abstimmung mit Bestattungshaus, Kirche oder Trauerredner:in klären.',
		intent: 'Angehörige möchten wissen, wie Musik in den Ablauf einer Trauerfeier eingebunden wird.',
		cluster: 'Trauerfeier',
		serviceSlug: 'beerdigungen',
		heroImage: '/uploads/mq0uz91j-viola-6668608_1280.webp',
		heroImageAlt: 'Viola, stille Detailaufnahme im warmen Licht',
		kicker: 'Trauerfeier',
		lead:
			'Bei einer Trauerfeier muss Musik zuverlässig, ruhig und passend eingebunden sein. Der Ablauf sollte so klar sein, dass Angehörige am Tag selbst nichts organisieren müssen.',
		summary:
			'Für Familien, die eine würdevolle musikalische Begleitung planen und organisatorische Sicherheit brauchen.',
		keyPoints: [
			'Musik kann Beginn, Erinnerung, Auszug oder Gang zum Grab rahmen.',
			'Die Abstimmung läuft idealerweise über eine feste Kontaktperson.',
			'Live-Musik sollte den Ablauf entlasten, nicht zusätzliche Fragen schaffen.',
		],
		sections: [
			{
				title: 'Wo passt Musik in der Trauerfeier?',
				body: [
					'Musik kann die Gäste in den Raum führen, einen Moment der Erinnerung tragen oder den Auszug begleiten. Manchmal ist ein einzelnes Stück am Ende stärker als mehrere kurze Einsätze.',
					'Bei kirchlichen Feiern wird der Ablauf mit der Gemeinde oder dem Pfarramt abgestimmt. Bei freien Trauerfeiern ist die Abstimmung mit Redner:in und Bestattungshaus zentral.',
				],
			},
			{
				title: 'Wer stimmt den Ablauf ab?',
				body: [
					'Praktisch ist eine feste Kontaktperson: Angehörige, Bestattungshaus, Kirche oder Trauerredner:in. So sind Uhrzeit, Ort, Einsatzpunkte und Besonderheiten eindeutig geklärt.',
					'Gerade bei kurzfristigen Terminen hilft eine reduzierte Auswahl. Lieber wenige sichere Stücke als eine komplizierte Planung unter Druck.',
				],
			},
			{
				title: 'Was gilt für Musik am Grab?',
				body: [
					'Musik am Grab kann sehr berührend sein, braucht aber mehr Abstimmung: Wetter, Abstand, Akustik, Zeitpunkt und Friedhofsregeln spielen eine Rolle.',
					'Wenn draußen keine gute Lösung möglich ist, kann ein bewusst gesetztes Abschlussstück in der Kapelle oder Trauerhalle die bessere Wahl sein.',
				],
			},
		],
		internalLinks: [
			{ label: 'Beerdigung & Trauerfeier', href: '/beerdigungen/' },
			{ label: 'Live-Musik Trauerfeier', href: '/beerdigungen/live-musik-trauerfeier/' },
			{ label: 'Musik am Grab', href: '/beerdigungen/musik-am-grab/' },
			{ label: 'Musikerin Trauerfeier', href: '/beerdigungen/musikerin-trauerfeier/' },
		],
		nextStep: { label: 'Begleitung für Abschied klären', href: '/anfragen/' },
		faqs: [
			{
				question: 'Wie kurzfristig kann Trauermusik angefragt werden?',
				answer:
					'Das hängt vom Termin und der Entfernung ab. Bei Trauerfeiern lohnt sich eine Anfrage auch kurzfristig, wenn Ort, Uhrzeit und gewünschter Rahmen schon feststehen.',
			},
			{
				question: 'Kann die Musikerin direkt mit dem Bestattungshaus sprechen?',
				answer:
					'Ja. Das entlastet Angehörige und sorgt dafür, dass Ankunft, Einsatzpunkte und Ablauf ruhig geklärt sind.',
			},
			{
				question: 'Ist Live-Viola für kleine Trauerfeiern geeignet?',
				answer:
					'Ja. Gerade kleine Feiern profitieren von einem einzelnen Instrument, weil es nah wirkt und den Raum nicht dominiert.',
			},
		],
	},
	{
		slug: 'bratschenunterricht-erwachsene',
		title: 'Geige oder Bratsche als Erwachsene:r lernen?',
		shortTitle: 'Geige oder Bratsche lernen',
		seoTitle: 'Geige oder Bratsche lernen? Entscheidungshilfe für Erwachsene',
		seoDescription:
			'Entscheidungshilfe für Erwachsene: Geige oder Bratsche wählen, Einstieg planen, Übezeit einschätzen und realistische Ziele setzen.',
		intent: 'Erwachsene überlegen, ob sie Geige oder Bratsche lernen können und wie der Einstieg realistisch gelingt.',
		cluster: 'Unterricht',
		serviceSlug: 'unterricht',
		heroImage: '/uploads/mq0uz91n-violin-6635935_1280.webp',
		heroImageAlt: 'Nahaufnahme eines Streichinstruments',
		kicker: 'Unterricht',
		lead:
			'Geige oder Bratsche lernen ist auch als Erwachsene:r möglich. Wichtig sind ein ruhiger Einstieg, ein passendes Instrument und Ziele, die zum Alltag passen.',
		summary:
			'Für Erwachsene, die mit Geige, Bratsche oder Viola beginnen, wieder einsteigen oder zwischen den Instrumenten wechseln möchten.',
		keyPoints: [
			'Der Anfang braucht Geduld mit Haltung, Bogen und Klang.',
			'Kurze regelmäßige Übezeiten sind wirksamer als seltene lange Einheiten.',
			'Eine Probestunde hilft, Instrument, Ziele und Unterrichtsrhythmus zu klären.',
		],
		sections: [
			{
				title: 'Ist Geige oder Bratsche als Erwachsener realistisch?',
				body: [
					'Ja, wenn der Einstieg sinnvoll aufgebaut wird. Erwachsene bringen oft ein gutes Verständnis für Musik, Motivation und klare Ziele mit. Gleichzeitig brauchen Geige und Bratsche Geduld, weil Klang, Intonation und Haltung Zeit brauchen.',
					'Der Unterricht sollte nicht wie ein starres Kinderprogramm funktionieren. Sinnvoller ist ein Aufbau, der Körpergefühl, Hörtraining und musikalische Interessen verbindet.',
				],
			},
			{
				title: 'Was braucht man für den Start?',
				body: [
					'Zu Beginn müssen Instrumentengröße, Bogen, Schulterstütze und Haltung passen. Bei der Geige geht es oft um einen leichten, freien Start; bei der Bratsche zusätzlich um körperliche Balance, weil das Instrument größer ist.',
					'Für den ersten Schritt ist eine Probestunde hilfreich. Dabei lässt sich klären, ob ein Leihinstrument sinnvoll ist, welche Vorerfahrung vorhanden ist und welcher Unterrichtsrhythmus realistisch passt.',
				],
			},
			{
				title: 'Wie übt man ohne Druck?',
				body: [
					'Kurze, regelmäßige Einheiten sind am Anfang besser als lange Übephasen. Fünfzehn konzentrierte Minuten können mehr bringen als eine Stunde mit zu viel Spannung.',
					'Gute Ziele sind hörbar und klein: ein ruhiger Bogenstrich, ein sauberer Ton, ein einfaches Stück, das wirklich schön klingt. So entsteht Fortschritt ohne Überforderung.',
				],
			},
		],
		internalLinks: [
			{ label: 'Geigen- und Bratschenunterricht', href: '/unterricht/' },
			{ label: 'Geigenunterricht Erwachsene', href: '/unterricht/geigenunterricht-erwachsene/' },
			{ label: 'Geige lernen', href: '/unterricht/geige-lernen/' },
			{ label: 'Bratschenunterricht Erwachsene', href: '/unterricht/bratschenunterricht-erwachsene/' },
			{ label: 'Geigen- und Bratschenunterricht in Düsseldorf', href: '/unterricht/duesseldorf/', note: 'Probestunde für Geige oder Viola anfragen' },
			{ label: 'Geigenunterricht in Köln', href: '/unterricht/koeln/', note: 'Einstieg oder Wiedereinstieg persönlich abstimmen' },
		],
		nextStep: { label: 'Probestunde anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Kann man als Erwachsene:r noch Geige oder Bratsche lernen?',
				answer:
					'Ja. Der Einstieg braucht Geduld und einen passenden Aufbau, ist aber auch ohne Kindheitsunterricht möglich.',
			},
			{
				question: 'Brauche ich sofort ein eigenes Instrument?',
				answer:
					'Nicht zwingend. Für den Anfang kann ein Leihinstrument sinnvoll sein, bis Größe, Klangvorstellung und Unterrichtsrhythmus klarer sind.',
			},
			{
				question: 'Wie oft sollte Unterricht stattfinden?',
				answer:
					'Das hängt von Ziel und Alltag ab. Regelmäßigkeit ist wichtiger als Tempo; wöchentliche oder zweiwöchentliche Termine können beide sinnvoll sein.',
			},
		],
	},
{
	"slug": "musikplanung-hochzeitsfeier",
	"title": "Musikplanung für die Hochzeitsfeier",
	"shortTitle": "Musikplanung Hochzeitsfeier",
	"seoTitle": "Musikplanung Hochzeitsfeier: Empfang & Dinner | Ratgeber",
	"seoDescription": "Musik für eure Hochzeitsfeier planen: Empfang, Dinner, Reden und Übergänge abstimmen. Checkliste für Spielzeiten, Ortswechsel und die Übergabe an DJ oder Band.",
	"intent": "Paare möchten den musikalischen Ablauf nach der Trauung bis zum Beginn der Party planen.",
	"cluster": "Hochzeit",
	"serviceSlug": "hochzeiten",
	"heroImage": "/uploads/mq0uvv7v-20250327-DSC01550.webp",
	"heroImageAlt": "Kim Marie Borger spielt Viola im Abendlicht",
	"kicker": "Hochzeitsfeier",
	"lead": "Nach der Trauung geht es oft an einem anderen Ort weiter. Für Empfang und Dinner helfen klare Spielzeiten, Pausen für Reden und eine abgestimmte Übergabe an die Abendmusik. So weiß jede beteiligte Person, wann sie gefragt ist.",
	"summary": "Eine Checkliste für die Musik nach der Trauung: Sektempfang, Essen, Reden, Raumwechsel und der Übergang zur Party.",
	"keyPoints": [
		"Jede Spielphase bekommt einen Zweck und ein Zeitfenster.",
		"Reden und Moderation brauchen vereinbarte Musikpausen.",
		"Anfahrt, Aufbau und Übergaben gehören in den Ablaufplan."
	],
	"sections": [
		{
			"title": "1. Den Empfang vom weiteren Abend unterscheiden",
			"body": [
				"Beim Empfang kommen Gäste an, gratulieren und unterhalten sich. Hier kann Solo-Viola die Begrüßung begleiten. Vereinbart Beginn und Ende der Musik sowie den Platz für den Auftritt. Plant auch, ob das Paar währenddessen beim Fototermin ist oder die Musik gemeinsam mit den Gästen erleben möchte.",
				"Ein persönliches Lieblingsstück braucht einen erkennbaren Moment. Wenn es zwischen Gesprächen und Gratulationen erklingt, hören möglicherweise nicht alle bewusst zu. Soll das Stück ein Höhepunkt sein, haltet dafür einen eigenen kurzen Programmpunkt fest."
			],
			"links": [
				{
					"label": "Live-Musik zum Sektempfang",
					"href": "/hochzeiten/sektempfang/"
				}
			]
		},
		{
			"title": "2. Dinner, Reden und Service aufeinander abstimmen",
			"body": [
				"Für das Dinner besprecht ihr mit der Location und der Musikerin, wann Essen serviert wird und welche Reden geplant sind. Musikfenster lassen sich um diese Punkte herum legen. Während einer Ansprache pausiert die Musik, damit die Worte verständlich bleiben.",
				"Ob die Viola akustisch ausreicht, hängt von Raum, Gästezahl und Umgebungsgeräuschen ab. Fotos des Raums und eine grobe Sitzordnung helfen bei der Einschätzung. Technische Anforderungen werden vor der Buchung geklärt; ein großer Saal ist kein Anlass für eine pauschale Zusage zur Lautstärke."
			],
			"links": [
				{
					"label": "Hörproben der Solo-Viola",
					"href": "/portfolio/"
				}
			]
		},
		{
			"title": "3. Ortswechsel und die Übergabe zur Party planen",
			"body": [
				"Wenn Trauung, Empfang und Dinner an verschiedenen Orten stattfinden, notiert die Wege und die jeweiligen Ankunftszeiten. Auch Ausladen, Aufbauen und Stimmen brauchen Platz im Plan. Klärt, wer Zugang zum nächsten Raum ermöglicht und welche Wartezeit zwischen den Einsätzen entsteht.",
				"Für den Übergang zur Party vereinbart ihr mit DJ oder Band das Ende der Live-Musik und den nächsten Einsatz. Ist ein gemeinsamer Übergang gewünscht, müssen Ablauf und technische Voraussetzungen vorher besprochen werden. Ein festes Startsignal ist verlässlicher als mehrere Personen, die gleichzeitig Änderungen weitergeben."
			],
			"links": [
				{
					"label": "Musik für eure Hochzeit anfragen",
					"href": "/hochzeiten/"
				}
			]
		},
		{
			"title": "4. Eine gemeinsame Ablaufübersicht verschicken",
			"body": [
				"Für jede Musikphase reichen zunächst diese Angaben: Ort, Beginn, Ende, Aufgabe der Musik und zuständige Kontaktperson. Ergänzt Reden, Pausen, Ortswechsel, gewünschte Stücke und das Startsignal. Gebt die bestätigte Fassung an Location, Musikerin und die Personen weiter, die den Abend koordinieren.",
				"Für einen Empfang im Freien braucht es einen trockenen, schattigen Platz mit stabilem Untergrund und eine Innenalternative. Haltet fest, wer die Entscheidung bei Wetteränderungen trifft. Für das Angebot zählen außerdem Anfahrt, Vorbereitung, Wartezeiten und der vereinbarte musikalische Umfang."
			],
			"links": [
				{
					"label": "Wunschmusik und Vorbereitung",
					"href": "/ratgeber/wunschmusik-hochzeit/"
				}
			]
		}
	],
	"internalLinks": [
		{
			"label": "Hochzeitsmusik mit Solo-Viola",
			"href": "/hochzeiten/"
		},
		{
			"label": "Ablauf der Trauungsmusik",
			"href": "/ratgeber/musik-zur-trauung/"
		},
		{
			"label": "Musik zum Empfang",
			"href": "/hochzeiten/sektempfang/"
		},
		{
			"label": "Hochzeitsmusik in Düsseldorf",
			"href": "/hochzeiten/duesseldorf/"
		}
	],
	"nextStep": {
		"label": "Musik für Empfang und Dinner anfragen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Wie plane ich die Musik für die Hochzeitsfeier?",
			"answer": "Trennt Empfang, Dinner, Reden und Party in einzelne Phasen. Notiert je Phase Ort, Zeitfenster, Aufgabe der Musik und eine Kontaktperson. Danach werden Wunschstücke, Pausen und Übergaben abgestimmt."
		},
		{
			"question": "Kann Solo-Viola Empfang und Dinner begleiten?",
			"answer": "Ja, diese Einsätze können vereinbart werden. Ob die Musik akustisch oder mit abgestimmter Technik passend hörbar ist, prüfen wir anhand des Raums, der Gästezahl und des Ablaufs."
		},
		{
			"question": "Spielt die Musik während der Hochzeitsreden weiter?",
			"answer": "Für geplante Ansprachen werden Musikpausen vereinbart. Eine Kontaktperson gibt das Signal für die Pause und den nächsten Einsatz."
		},
		{
			"question": "Sind mehrere Spielorte an einem Tag möglich?",
			"answer": "Das wird anhand der Wege und Zeitfenster geprüft. Anfahrt, Aufbau, Wartezeiten und Zugang zu den Räumen müssen in Ablauf und Angebot berücksichtigt werden."
		},
		{
			"question": "Wann beginnt die Tanzmusik?",
			"answer": "Das bestimmt euer Ablauf mit DJ oder Band. Haltet das Ende der Solo-Viola und den Beginn der anschließenden Musik gemeinsam fest; es gibt dafür keine allgemeine Uhrzeit."
		}
	]
},
{
	"slug": "live-musik-geburtstagsgeschenk",
	"title": "Live-Musik als Geburtstagsgeschenk",
	"shortTitle": "Live-Musik als Geburtstagsgeschenk",
	"seoTitle": "Live-Musik als Geburtstagsgeschenk | Überraschung planen",
	"seoDescription": "Ein Ständchen mit Solo-Viola zum Geburtstag verschenken: Lieblingslied, Zeitpunkt, Kontaktperson, Raum und diskrete Ankunft vor dem Auftritt abstimmen.",
	"intent": "Menschen möchten einen persönlichen Musikauftritt zum Geburtstag verschenken und die Überraschung organisieren.",
	"cluster": "Geburtstag",
	"serviceSlug": "geburtstage",
	"heroImage": "/uploads/mq0uvvd3-20250327-DSC01769.webp",
	"heroImageAlt": "Porträt von Kim Marie Borger mit ihrer Viola",
	"kicker": "Musik verschenken",
	"lead": "Ein Lieblingslied, live auf der Viola gespielt, kann ein persönliches Geburtstagsgeschenk sein. Damit die Überraschung gelingt, braucht sie einen passenden Moment und eine Person, die Ankunft, Raum und Startsignal im Blick behält.",
	"summary": "Vom Lieblingslied zum vereinbarten Auftritt: So bereitet ihr ein persönliches Ständchen vor, ohne die Überraschung vorzeitig zu verraten.",
	"keyPoints": [
		"Wunschlied und Spielbarkeit vor der Buchung prüfen.",
		"Eine eingeweihte Person koordiniert Ankunft und Start.",
		"Dauer, Kosten und Bedingungen gemeinsam festhalten."
	],
	"sections": [
		{
			"title": "Welches Stück passt zur beschenkten Person?",
			"body": [
				"Beginnt mit einem Lied, das der Person etwas bedeutet: etwa Musik aus einem Lieblingsfilm oder ein Stück, mit dem sie eine gemeinsame Erinnerung verbindet. Ein kurzer Hinweis zur Bedeutung hilft bei der Auswahl. Eine größere Wunschliste ist für ein einzelnes Ständchen nicht nötig.",
				"Schickt Titel und Interpret:in frühzeitig. Ich prüfe, ob das Stück für Solo-Viola geeignet ist und welche Fassung zum Auftritt passt. Wenn eine neue Bearbeitung oder Notation nötig ist, bespreche ich den Aufwand vorher. Die Buchung setzt keine Zusage voraus, jedes gewünschte Lied spielen zu können."
			],
			"links": [
				{
					"label": "So klingt die Viola",
					"href": "/portfolio/"
				}
			]
		},
		{
			"title": "Ein Ständchen oder Begleitung für die ganze Feier?",
			"body": [
				"Ein Ständchen ist ein eigener Moment: Die beschenkte Person und die Gäste können zuhören. Begleitung zum Empfang oder Dinner erfüllt eine andere Aufgabe und wird als eigener Umfang vereinbart. Entscheidet deshalb zuerst, ob ihr ein einzelnes musikalisches Geschenk oder mehrere Einsätze schenken möchtet.",
				"Plant den Beginn so, dass die Person tatsächlich anwesend ist und gerade kein anderer Programmpunkt läuft. Wenn ein Essen oder eine Rede vorgesehen ist, stimmt das Zeitfenster mit der gastgebenden Person ab. Eine klare Absprache hilft mehr als ein minutengenauer Überraschungsplan ohne Puffer."
			],
			"links": [
				{
					"label": "Musik für Geburtstage und private Feiern",
					"href": "/geburtstage/"
				}
			]
		},
		{
			"title": "Ankunft und Startsignal diskret organisieren",
			"body": [
				"Eine eingeweihte Kontaktperson sollte vor Ort erreichbar sein. Sie kennt den Eingang, ermöglicht den Zugang und gibt das vereinbarte Startsignal. Klärt auch, wo ich vor dem Auftritt warten und mich vorbereiten kann, ohne die Überraschung unbeabsichtigt vorwegzunehmen.",
				"Teilt mir bei der Anfrage mit, über welchen Kontakt die Absprachen laufen sollen. Wenn die Feier in einem Restaurant oder Veranstaltungsraum stattfindet, muss die verantwortliche Person dort den Auftritt ebenfalls kennen und dem geplanten Platz und Zeitfenster zustimmen."
			]
		},
		{
			"title": "Raum, Wetter und Angebot klären",
			"body": [
				"Für einen Auftritt zu Hause sind Platz zum Spielen und eine ruhige Hörsituation wichtig. Beschreibt den Raum und die ungefähre Gästezahl. Bei einer Gartenfeier brauche ich einen trockenen, schattigen Platz auf stabilem Untergrund; für Regen oder starke Sonne wird vorab eine Innenalternative vereinbart.",
				"Für die Anfrage nennt Datum, Adresse, gewünschte Spielzeit, Anlass und Liedidee. Der Preis hängt unter anderem von Anfahrt, Dauer, Vorbereitung und möglichen Wartezeiten ab. Ihr bekommt den vereinbarten Umfang vor der Buchung genannt; besondere Wünsche werden vorher besprochen."
			],
			"links": [
				{
					"label": "Persönlichen Musikauftritt anfragen",
					"href": "/anfragen/"
				}
			]
		}
	],
	"internalLinks": [
		{
			"label": "Live-Musik zum Geburtstag",
			"href": "/geburtstage/"
		},
		{
			"label": "Musik für private Feiern",
			"href": "/geburtstage/private-feier/"
		},
		{
			"label": "Hörproben im Portfolio",
			"href": "/portfolio/"
		},
		{
			"label": "Über Kim Marie Borger",
			"href": "/ueber-mich/"
		}
	],
	"nextStep": {
		"label": "Geburtstagsüberraschung anfragen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Kann ein Auftritt eine Überraschung bleiben?",
			"answer": "Ja, Ankunft und Start werden mit einer eingeweihten Kontaktperson abgestimmt. Sagt bei der Anfrage, wer erreichbar ist und über welchen Kontakt die weitere Planung laufen soll."
		},
		{
			"question": "Kann ich ein Lieblingslied verschenken?",
			"answer": "Schick mir den Titel und die gewünschte Situation. Ich prüfe die Eignung für Solo-Viola und bespreche einen möglichen Bearbeitungsaufwand, bevor wir das Stück verbindlich vereinbaren."
		},
		{
			"question": "Wie lange dauert ein musikalisches Geburtstagsgeschenk?",
			"answer": "Ein einzelnes Ständchen und die Begleitung eines Empfangs haben unterschiedliche Umfänge. Dauer und Anzahl der Einsätze werden passend zu eurem Wunsch im Angebot festgehalten."
		},
		{
			"question": "Ist ein Auftritt im Garten möglich?",
			"answer": "Bei einem trockenen, schattigen Spielplatz mit stabilem Untergrund kann das möglich sein. Eine Innenalternative und die Entscheidung bei Wetteränderungen werden vorab abgestimmt."
		},
		{
			"question": "Was kostet Live-Musik als Geburtstagsgeschenk?",
			"answer": "Der Preis wird individuell für Datum, Ort, Anfahrt, Spielzeit und Vorbereitung genannt. Zusätzlicher Aufwand für Wunschmusik oder Wartezeiten wird vor der Buchung geklärt."
		}
	]
},
{
	"slug": "musik-firmenevent-ablauf",
	"title": "Musik beim Firmenevent planen",
	"shortTitle": "Ablaufcheckliste Firmenevent",
	"seoTitle": "Musik beim Firmenevent planen | Ablauf & Checkliste",
	"seoDescription": "Checkliste für Live-Musik beim Firmenevent: Spielzeiten, Reden, Dinner, Raum, Lautstärke und Kontaktperson vor der Buchung mit Location und Veranstaltungsleitung klären.",
	"intent": "Organisator:innen suchen einen Ablaufplan für Live-Musik, der zu Empfang, Reden, Networking und Dinner passt.",
	"cluster": "Firmenevent",
	"serviceSlug": "firmenfeiern",
	"heroImage": "/uploads/_DSC7402.webp",
	"heroImageAlt": "Kim Marie Borger spielt Viola am See",
	"kicker": "Eventplanung",
	"lead": "Beim Firmenevent teilen sich Musik, Gespräche, Reden und Service denselben Raum. Legt die musikalische Aufgabe und die Spielzeiten zuerst fest. Daraus ergeben sich der passende Platz, die Lautstärke und die Abstimmung mit der Veranstaltungsleitung.",
	"summary": "Eine Ablaufcheckliste für Veranstaltungsleitung und Location: von der Begrüßung bis zu Musikpausen, Technik und Rechnungsangaben.",
	"keyPoints": [
		"Empfangsbegleitung und Konzertmoment getrennt planen.",
		"Reden und Moderation mit klaren Pausensignalen abstimmen.",
		"Raum, Zugang, Technik und Leistungsumfang vorab klären."
	],
	"sections": [
		{
			"title": "Welche Aufgabe soll die Musik übernehmen?",
			"body": [
				"Beim Empfang begleitet die Musik das Ankommen. Beim Dinner kann sie vereinbarte Phasen zwischen den Programmpunkten füllen. Ein kurzer Konzertmoment verlangt dagegen Aufmerksamkeit: Die Gäste sollten wissen, dass jetzt ein musikalischer Beitrag beginnt. Diese Aufgaben beeinflussen Stückauswahl, Platz und Spielzeit.",
				"Notiert für jeden Einsatz Beginn, Ende und die gewünschte Funktion. Solo-Viola kann für eine Begrüßung, einen Empfang oder ein Dinner angefragt werden. Für einen eigenen musikalischen Programmpunkt wird der Umfang gesondert abgestimmt. Eine Hörprobe hilft, den Klang in die Planung einzuordnen."
			],
			"links": [
				{
					"label": "Live-Musik für Firmenfeiern",
					"href": "/firmenfeiern/musik-firmenfeier/"
				},
				{
					"label": "Solo-Viola hören",
					"href": "/portfolio/"
				}
			]
		},
		{
			"title": "Reden, Catering und Musikpausen koordinieren",
			"body": [
				"Haltet Begrüßung, Reden, Ehrungen und Moderation im gemeinsamen Ablauf fest. Vereinbart, wann die Musik pausiert und wer das Signal für den nächsten Einsatz gibt. Die Kontaktperson sollte auch bei kurzfristigen Verschiebungen erreichbar sein.",
				"Besprecht mit Location oder Catering, wann Servicewege besonders stark genutzt werden. Der Spielplatz sollte diese Wege frei halten. Wenn ein Beitrag später beginnt, braucht es eine abgestimmte Entscheidung über Musikpause, Verlängerung oder einen verschobenen Einsatz; zusätzliche Zeiten werden nicht stillschweigend vorausgesetzt."
			]
		},
		{
			"title": "Raum und Technik vor der Buchung einschätzen",
			"body": [
				"Gästezahl, Raumgröße, Sitzordnung und Geräuschpegel helfen bei der Einschätzung, wie die Viola hörbar wird. Sendet bei Bedarf Raumfotos und nennt geplante Mikrofone oder andere Beschallung. Ob akustisches Spiel ausreicht oder eine technische Abstimmung nötig ist, wird anhand der tatsächlichen Situation geklärt.",
				"Gebt den genauen Eingang, Etage, Aufzug und eine mögliche Haltemöglichkeit an. Bei mehreren Räumen werden Wege und Aufbauzeiten mitgeplant. Im Freien braucht das Instrument einen trockenen, schattigen Platz auf stabilem Untergrund und eine vereinbarte Innenalternative."
			],
			"links": [
				{
					"label": "Firmenevent in Düsseldorf anfragen",
					"href": "/firmenfeiern/duesseldorf/"
				}
			]
		},
		{
			"title": "Diese Angaben gehören in die Anfrage",
			"body": [
				"Nennt Datum, Adresse, Veranstaltungstyp, ungefähre Gästezahl und gewünschte Spielzeiten. Ergänzt die geplanten Reden, mögliche Ortswechsel, eine Kontaktperson für den Veranstaltungstag und Rechnungsangaben. Eine Liedidee könnt ihr mitschicken, damit Eignung und Vorbereitungsaufwand geprüft werden können.",
				"Im Angebot werden der musikalische Umfang und die vereinbarten Bedingungen festgehalten. Anfahrt, Vorbereitung, Wartezeiten, Ortswechsel und technische Anforderungen können den Preis beeinflussen. Verfügbarkeit und Kosten lassen sich deshalb erst mit dem konkreten Veranstaltungsrahmen zuverlässig abstimmen."
			],
			"links": [
				{
					"label": "Verfügbarkeit und Umfang klären",
					"href": "/anfragen/"
				}
			]
		}
	],
	"internalLinks": [
		{
			"label": "Firmenfeiern und Empfänge",
			"href": "/firmenfeiern/"
		},
		{
			"label": "Musik für die Firmenfeier",
			"href": "/firmenfeiern/musik-firmenfeier/"
		},
		{
			"label": "Firmenevents in Düsseldorf",
			"href": "/firmenfeiern/duesseldorf/"
		},
		{
			"label": "Hörproben",
			"href": "/portfolio/"
		}
	],
	"nextStep": {
		"label": "Musik für das Firmenevent anfragen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Wann passt Live-Musik in ein Firmenevent?",
			"answer": "Mögliche Einsätze sind Empfang, Dinner und ein eigener musikalischer Programmpunkt. Aufgabe und Zeitfenster werden mit dem übrigen Ablauf abgestimmt."
		},
		{
			"question": "Wer gibt das Signal für Musikpausen?",
			"answer": "Vorab wird eine erreichbare Kontaktperson benannt, etwa aus der Veranstaltungsleitung. Sie koordiniert Pausen für Reden sowie Änderungen und den nächsten Musikeinsatz."
		},
		{
			"question": "Ist Solo-Viola beim Networking zu hören?",
			"answer": "Das hängt von Raum, Gästezahl und Gesprächslautstärke ab. Die Hörsituation und ein möglicher technischer Bedarf werden vor der Buchung eingeschätzt."
		},
		{
			"question": "Kann der Auftritt zwischen mehreren Räumen wechseln?",
			"answer": "Das kann nach Prüfung von Wegen, Zugang und Aufbauzeit vereinbart werden. Die Wechsel und mögliche Wartezeiten gehören in Ablauf und Angebot."
		},
		{
			"question": "Welche Informationen braucht ein Angebot?",
			"answer": "Hilfreich sind Datum, genaue Adresse, Gästezahl, Raum, Spielzeiten, Programmpunkte, Kontaktperson und Rechnungsangaben. Wunschmusik und besondere Technik werden ebenfalls vorab besprochen."
		}
	]
},
];

export function getRatgeberPages(): RatgeberPage[] {
	return RATGEBER_PAGES;
}

export function getRatgeberPage(slug: string): RatgeberPage | undefined {
	return RATGEBER_PAGES.find((page) => page.slug === slug);
}

export function getRatgeberPagesForService(serviceSlug: string): RatgeberPage[] {
	return RATGEBER_PAGES.filter((page) => page.serviceSlug === serviceSlug);
}

export function ratgeberPath(pageOrSlug: RatgeberPage | string): string {
	const slug = typeof pageOrSlug === 'string' ? pageOrSlug : pageOrSlug.slug;
	return `${RATGEBER_BASE_PATH}${slug}/`;
}

export function ratgeberOverviewJsonLd(site: URL): object {
	const url = canonicalUrl(site, RATGEBER_BASE_PATH).href;
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumb`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Start', item: site.href },
					{ '@type': 'ListItem', position: 2, name: 'Ratgeber', item: url },
				],
			},
			{
				'@type': 'CollectionPage',
				'@id': `${url}#collection`,
				name: 'Ratgeber Musikplanung',
				description:
					'Ratgeber zur Musikplanung für Hochzeit, Trauerfeier, Geburtstag und Firmenevent sowie zum Geigen- und Bratschenunterricht.',
				url,
				inLanguage: 'de',
				mainEntity: {
					'@type': 'ItemList',
					'@id': `${url}#items`,
					itemListElement: RATGEBER_PAGES.map((page, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: page.shortTitle,
						url: canonicalUrl(site, ratgeberPath(page)).href,
					})),
				},
			},
		],
	};
}

export function ratgeberPageJsonLd(site: URL, page: RatgeberPage): object {
	const url = canonicalUrl(site, ratgeberPath(page)).href;
	const overviewUrl = canonicalUrl(site, RATGEBER_BASE_PATH).href;
	const serviceNode = coreServiceNode(site, page.serviceSlug);

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumb`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Start', item: site.href },
					{ '@type': 'ListItem', position: 2, name: 'Ratgeber', item: overviewUrl },
					{ '@type': 'ListItem', position: 3, name: page.shortTitle, item: url },
				],
			},
			{
				'@type': 'Article',
				'@id': `${url}#article`,
				headline: page.title,
				description: page.seoDescription,
				image: new URL(page.heroImage, site).href,
				mainEntityOfPage: url,
				author: { '@id': new URL('/#person', site).href },
				publisher: { '@id': new URL('/#website', site).href },
				about: page.intent,
				inLanguage: 'de',
				isPartOf: { '@id': `${overviewUrl}#collection` },
				url,
			},
			...(serviceNode ? [serviceNode] : []),
			{
				'@type': 'FAQPage',
				'@id': `${url}#faq`,
				mainEntity: page.faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer,
					},
				})),
			},
		],
	};
}
