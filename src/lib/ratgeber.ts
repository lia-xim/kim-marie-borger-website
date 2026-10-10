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
	cluster: 'Hochzeit' | 'Trauerfeier' | 'Unterricht' | 'Geburtstag' | 'Firmenevent' | 'Taufe';
	serviceSlug: 'hochzeiten' | 'beerdigungen' | 'unterricht' | 'geburtstage' | 'firmenfeiern' | 'taufen';
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
			{ label: 'Hochzeitsmusik im Freien: Wetter und Standort planen', href: '/ratgeber/hochzeitsmusik-im-freien/' },
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
			{ label: 'Bratsche und Geige: Klang und Größe vergleichen', href: '/ratgeber/bratsche-geige-unterschied/' },
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
{
	"slug": "bratsche-geige-unterschied",
	"title": "Bratsche oder Geige: Was ist der Unterschied?",
	"shortTitle": "Bratsche und Geige im Vergleich",
	"seoTitle": "Bratsche oder Geige? Unterschiede in Klang & Größe",
	"seoDescription": "Bratsche, Viola und Geige unterscheiden: Stimmung, Klang, Größe und musikalische Rolle verständlich erklärt. Mit Orientierung für die erste Probestunde.",
	"intent": "Klang, Stimmung und Größe von Bratsche und Geige vergleichen und die Instrumentenwahl für den Unterricht vorbereiten.",
	"cluster": "Unterricht",
	"serviceSlug": "unterricht",
	"heroImage": "/uploads/mq0uvva2-20250327-DSC01714.webp",
	"heroImageAlt": "Kim Marie Borger sitzt mit ihrer Viola auf einer Wiese",
	"kicker": "Instrumente kennenlernen",
	"lead": "Die Bratsche heißt auch Viola, die Geige auch Violine. Beide gehören zu den Streichinstrumenten und werden ähnlich gehalten. Der Unterschied liegt vor allem in Stimmung, Größe und Klang — und damit auch in der musikalischen Aufgabe.",
	"summary": "Was Bratsche, Viola und Geige unterscheidet und worauf es bei der Instrumentenwahl für den Unterricht ankommt.",
	"keyPoints": [
		"Bratsche und Viola bezeichnen dasselbe Instrument.",
		"Die Bratsche ist tiefer gestimmt als die Geige.",
		"Für die Instrumentenwahl zählen Klanginteresse und eine passende Größe."
	],
	"sections": [
		{
			"title": "Stimmung und Klang: die tiefe C-Saite statt der hohen E-Saite",
			"body": [
				"Die Geige hat eine hohe E-Saite. Bei der Bratsche steht an deren Stelle eine tiefe C-Saite; sie ist eine Quinte tiefer gestimmt. Dadurch erhält die Viola ihren tieferen Tonbereich und die oft als dunkler beschriebene Klangfarbe.",
				"Diese Grundrichtung ist eine Orientierung, keine Grenze für den Ausdruck. Wer den Klang der Viola kennenlernen möchte, kann sich zunächst Hörbeispiele anhören. Für den direkten Vergleich lohnt es sich, beide Instrumente im Unterricht auszuprobieren."
			],
			"links": [
				{
					"label": "Viola-Hörbeispiele von Kim Marie Borger",
					"href": "/portfolio/"
				}
			]
		},
		{
			"title": "Größe und Haltung: das Instrument muss zur Person passen",
			"body": [
				"Eine Bratsche ist gewöhnlich größer als eine Geige. Eine feste Zentimeterzahl entscheidet den Vergleich aber nicht: Für den Unterricht wird eine passende Instrumentengröße gewählt. Dabei schauen wir auf Haltung, Griffwege und eine freie Bogenbewegung.",
				"Gerade vor einem Kauf hilft eine persönliche Einschätzung. Kinder, Jugendliche und Erwachsene brauchen ein Instrument, das sich gut halten und spielen lässt. Die Entscheidung sollte deshalb nicht allein anhand eines Fotos oder einer Größenangabe fallen."
			]
		},
		{
			"title": "Musikalische Rolle: Mittelstimme und Solo",
			"body": [
				"Im Orchester und in der Kammermusik übernimmt die Bratsche häufig eine Mittelstimme. Zugleich hat sie eigenes Solo-Repertoire und kann als eigenständiges Instrument im Mittelpunkt stehen. Geige und Bratsche unterscheiden sich also nicht einfach in „Melodie“ und „Begleitung“.",
				"Kim Marie Borger spielt Solo-Viola bei Konzerten und Kulturformaten sowie bei persönlichen Anlässen. Wer eine Buchung plant, findet bei den Konzertformaten Beispiele für Programme; wer selbst lernen möchte, kann sich über Geigen- und Bratschenunterricht informieren."
			],
			"links": [
				{
					"label": "Konzerte und Kulturformate mit Viola",
					"href": "/konzerte/"
				},
				{
					"label": "Geigen- und Bratschenunterricht",
					"href": "/unterricht/"
				}
			]
		},
		{
			"title": "Geige oder Bratsche lernen: die erste Entscheidung",
			"body": [
				"Für den Einstieg helfen zwei Fragen: Welcher Klang interessiert dich, und wie fühlt sich das passende Instrument an? In einer Probestunde können wir Vorerfahrung, Haltung und erste Ziele besprechen. Bei Kim Marie Borger ist diese Probestunde kostenlos und unverbindlich.",
				"Haltung, Bogenführung, Ton, Intonation und Gehör gehören bei beiden Instrumenten zum Unterricht. Ein Wechsel zwischen Geige und Bratsche wird auf die vorhandenen Kenntnisse abgestimmt. Für den Einstieg als Erwachsene:r gibt es zusätzlich eine eigene Entscheidungshilfe."
			],
			"links": [
				{
					"label": "Als Erwachsene:r mit Geige oder Bratsche beginnen",
					"href": "/ratgeber/bratschenunterricht-erwachsene/"
				},
				{
					"label": "Bratschenunterricht kennenlernen",
					"href": "/unterricht/bratschenunterricht/"
				}
			]
		},
		{
			"title": "Zum Weiterlesen über das Instrument",
			"body": [
				"Die Hinweise zur tieferen Stimmung und Klangfarbe lassen sich in der Instrumentenerklärung der Elbphilharmonie nachlesen. Der Landesmusikrat Berlin zeigt in seiner Broschüre die Bratsche als Orchester-, Kammermusik- und Solo-Instrument."
			],
			"links": [
				{
					"label": "Elbphilharmonie: Klang und Bauweise der Bratsche",
					"href": "https://www.elbphilharmonie.de/de/mediathek/die-ostfriesen-des-orchesters/491"
				},
				{
					"label": "Landesmusikrat Berlin: Bratsche – Instrument des Jahres 2014 (PDF)",
					"href": "https://www.landesmusikrat-berlin.de/fileadmin/projekte/LMR_Bratsche_Instr_d_Jahres_2014_web_EF.pdf"
				}
			]
		}
	],
	"internalLinks": [
		{
			"label": "Geigen- und Bratschenunterricht",
			"href": "/unterricht/"
		},
		{
			"label": "Bratschenunterricht",
			"href": "/unterricht/bratschenunterricht/"
		},
		{
			"label": "Geigenunterricht",
			"href": "/unterricht/geigenunterricht/"
		}
	],
	"nextStep": {
		"label": "Kostenlose Probestunde anfragen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Sind Bratsche und Viola dasselbe?",
			"answer": "Ja. Bratsche ist die deutsche Bezeichnung für die Viola. Die Geige wird auch Violine genannt."
		},
		{
			"question": "Warum klingt die Bratsche tiefer als die Geige?",
			"answer": "Die Bratsche ist eine Quinte tiefer gestimmt. Anstelle der hohen E-Saite der Geige hat sie eine tiefe C-Saite."
		},
		{
			"question": "Ist die Bratsche immer größer als die Geige?",
			"answer": "Eine Bratsche ist gewöhnlich größer. Für den Unterricht zählt jedoch die passende Instrumentengröße für die jeweilige Person, nicht nur ein allgemeiner Größenvergleich."
		},
		{
			"question": "Kann man direkt mit Bratsche beginnen?",
			"answer": "Der Unterricht kann mit Bratsche beginnen. In einer Probestunde werden Instrumentengröße, Haltung und erste Ziele persönlich besprochen."
		},
		{
			"question": "Ist Bratsche leichter zu lernen als Geige?",
			"answer": "Eine pauschale Rangfolge hilft bei der Wahl wenig. Beide Instrumente brauchen Arbeit an Haltung, Bogen, Ton und Intonation. Klanginteresse, ein passendes Instrument und regelmäßiges Üben sind hilfreicher für die Entscheidung."
		}
	]
},
{
	"slug": "hochzeitsmusik-im-freien",
	"title": "Hochzeitsmusik im Freien planen",
	"shortTitle": "Hochzeitsmusik im Freien",
	"seoTitle": "Hochzeitsmusik im Freien: Wetter, Klang & Plan B",
	"seoDescription": "Live-Musik für eine Hochzeit im Garten oder auf der Terrasse planen: geschützter Standort, Hörsituation, Ersatzraum und Wechsel zum Sektempfang.",
	"intent": "Standort, Hörsituation und Wetteralternative für eine Trauung oder einen Empfang im Freien abstimmen.",
	"cluster": "Hochzeit",
	"serviceSlug": "hochzeiten",
	"heroImage": "/uploads/mq0uvv7v-20250327-DSC01550.webp",
	"heroImageAlt": "Kim Marie Borger spielt Viola auf einer Wiese im Abendlicht",
	"kicker": "Draußen heiraten",
	"lead": "Eine Trauung im Garten oder ein Empfang auf der Terrasse braucht auch für die Musik einen vorbereiteten Platz. Neben den Stücken klärt ihr Standort, Hörsituation und eine Alternative für ungeeignetes Wetter.",
	"summary": "Eine Planungshilfe für Live-Musik draußen: geschützter Standort, Gäste, Ersatzraum und Wechsel zwischen Trauung und Empfang.",
	"keyPoints": [
		"Ein trockener, schattiger und stabiler Platz gehört zur Vorbereitung.",
		"Die Hörsituation wird mit Gästezahl, Sitzordnung und Umgebung eingeschätzt.",
		"Ein Ersatzraum und die Entscheidung über einen Wechsel stehen vor dem Hochzeitstag fest."
	],
	"sections": [
		{
			"title": "1. Den Platz für die Viola konkret abstimmen",
			"body": [
				"Beschreibt den vorgesehenen Standort oder schickt ein Foto der Fläche. Für Solo-Viola braucht es einen trockenen, schattigen und geschützten Standort auf stabilem Untergrund. Gemeinsam mit der Location wird geklärt, ob der Platz für den vereinbarten Auftritt geeignet ist.",
				"Die Musikerin sollte das Startsignal erkennen können, während Zugänge und der Einzugsweg frei bleiben. Plant auch einen geschützten Ort für die Vorbereitung und einen erreichbaren Weg zum Ersatzraum."
			],
			"links": [
				{
					"label": "Musik für eine freie Trauung",
					"href": "/hochzeiten/musik-freie-trauung/"
				}
			]
		},
		{
			"title": "2. Gästezahl und Hörsituation besprechen",
			"body": [
				"Draußen unterscheidet sich die Hörsituation von einem geschlossenen Raum. Nennt Gästezahl und Sitzordnung sowie mögliche Geräusche aus der Umgebung. Für einen Sektempfang ist zusätzlich wichtig, ob die Gäste nahe beieinander stehen oder sich über eine größere Fläche verteilen.",
				"Wir prüfen vorab, ob akustische Viola passt oder dezente Verstärkung sinnvoll ist. Falls Technik vorgesehen ist, werden Platz, Versorgung und Zuständigkeit mit der Location geklärt. Die Anlage für eine Rede ist nicht automatisch schon das passende Setup für das Instrument."
			],
			"links": [
				{
					"label": "Musik zum Sektempfang planen",
					"href": "/hochzeiten/sektempfang/"
				}
			]
		},
		{
			"title": "3. Einen konkreten Plan B vereinbaren",
			"body": [
				"Legt einen geeigneten Ersatzort fest und prüft, wie Gäste und Musikerin dorthin wechseln können. Eine vage Zusage wie „irgendwo drinnen geht es schon“ reicht für den Ablauf nicht. Der alternative Standort und seine Hörsituation werden ebenfalls besprochen.",
				"Eine benannte Kontaktperson stimmt mit Location und Musikerin ab, wann nach dem vereinbarten Wetterplan gewechselt wird. Für Wege und einen möglichen neuen Aufbau wird Zeit eingeplant. Der Wechsel muss in der Ablaufplanung Platz haben, bevor Gäste bereits sitzen."
			]
		},
		{
			"title": "4. Trauung und Empfang als zwei Spielorte planen",
			"body": [
				"Soll nach der Zeremonie auch beim Sektempfang Musik erklingen, nennt beide Plätze und die Wege dazwischen. Ein Umzug mit Instrument und gegebenenfalls Technik benötigt eine abgesprochene Unterbrechung. Spielzeit, Pause, Aufbau und mögliche Wartezeit werden als Teile des Umfangs vereinbart.",
				"Für eine Anfrage helfen Datum, genaue Adresse, Gästezahl, die beiden Standorte, gewünschte Musikzeiten und der Ersatzort. Nennt eine erreichbare Kontaktperson und eure Wunschstücke. So lässt sich der Auftritt mit Ablauf, Vorbereitung und Preisrahmen prüfen."
			],
			"links": [
				{
					"label": "Musik nach der Trauung bis zum Dinner planen",
					"href": "/ratgeber/musikplanung-hochzeitsfeier/"
				},
				{
					"label": "Hochzeitsmusik persönlich anfragen",
					"href": "/anfragen/"
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
			"label": "Ablaufplan für die Trauungsmusik",
			"href": "/ratgeber/musik-zur-trauung/"
		},
		{
			"label": "Musik für eine freie Trauung",
			"href": "/hochzeiten/musik-freie-trauung/"
		},
		{
			"label": "Viola-Hörbeispiele",
			"href": "/portfolio/"
		}
	],
	"nextStep": {
		"label": "Außenauftritt und Termin abstimmen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Kannst du bei einer Hochzeit draußen spielen?",
			"answer": "Das ist nach Abstimmung von Wetter, geschütztem Standort, Untergrund und Ablauf möglich. Für ungeeignete Außenbedingungen wird vorab ein geeigneter Ersatzort vereinbart."
		},
		{
			"question": "Reicht ein Platz unter einem Baum?",
			"answer": "Ein schöner Hintergrund genügt für die Planung nicht. Wir prüfen, ob der tatsächliche Standort trocken, schattig, geschützt und stabil ist und ob ein erreichbarer Ersatzort zur Verfügung steht."
		},
		{
			"question": "Ist im Freien immer Verstärkung nötig?",
			"answer": "Das hängt von Gästezahl, Sitzordnung, Abstand und Geräuschen aus der Umgebung ab. Ob die Viola akustisch spielen kann oder Verstärkung sinnvoll ist, wird vor der Buchung eingeschätzt."
		},
		{
			"question": "Kannst du nach der Trauung zum Sektempfang wechseln?",
			"answer": "Das kann vereinbart werden. Dafür werden die beiden Plätze, der Weg, Aufbau und eine passende Unterbrechung eingeplant. Ein Ortswechsel ist Teil des abgestimmten Umfangs."
		},
		{
			"question": "Wer entscheidet bei schlechtem Wetter über den Ersatzort?",
			"answer": "Vorab wird eine Kontaktperson benannt. Sie stimmt den Wechsel nach dem vereinbarten Wetterplan mit Location und Musikerin ab und informiert die Beteiligten über die Ablaufänderung."
		}
	]
},
{
	"slug": "taufmusik-planen",
	"title": "Musik zur Taufe planen",
	"shortTitle": "Taufmusik: Ablauf und Stücke",
	"seoTitle": "Musik zur Taufe planen: Ablauf & Wunschstücke",
	"seoDescription": "Taufmusik mit Solo-Viola planen: Musikmomente mit der Gemeinde klären, Wunschstücke prüfen und Gesang, Instrumentalmusik sowie Empfang aufeinander abstimmen.",
	"intent": "Musikalische Wünsche für die Taufe vorbereiten und Einsätze mit Gemeinde, Musikerin und Familie abstimmen.",
	"cluster": "Taufe",
	"serviceSlug": "taufen",
	"heroImage": "/uploads/_DSC7458.webp",
	"heroImageAlt": "Kim Marie Borger mit Viola und Bogen, Blick auf das Instrument",
	"kicker": "Taufe vorbereiten",
	"lead": "Ein persönliches Lied oder ein Instrumentalstück kann die Taufe musikalisch begleiten. Für die Planung helfen ein abgestimmter Ablauf, eine überschaubare Stückauswahl und eine klare Absprache mit der Gemeinde.",
	"summary": "Von der ersten Liedidee zum abgestimmten Ablauf: Fragen fürs Taufgespräch, Musikmomente, Wunschstücke und anschließender Empfang.",
	"keyPoints": [
		"Die musikalischen Möglichkeiten werden im Taufgespräch geklärt.",
		"Gemeinsamer Gesang und ein Solo-Instrumentalstück erfüllen unterschiedliche Aufgaben.",
		"Wunschstücke werden auf Eignung und nötige Vorbereitung geprüft."
	],
	"sections": [
		{
			"title": "1. Den Rahmen mit der Gemeinde klären",
			"body": [
				"Findet die Taufe in einem regulären Gottesdienst oder in einer eigenen Feier statt? Gibt es weitere Taufen am selben Termin? Die Form der Feier bestimmt mit, wie viel Raum für eure musikalischen Wünsche vorhanden ist. Fragt im Taufgespräch nach den vorgesehenen Musikstellen und den zuständigen Ansprechpartner:innen.",
				"Besprecht auch, welche Kirchenmusik bereits eingeplant ist und wie eine zusätzliche Solo-Viola eingebunden werden kann. Für ein freies Willkommensfest wird der musikalische Ablauf stattdessen mit der gastgebenden und der moderierenden Person abgestimmt."
			],
			"links": [
				{
					"label": "evangelisch.de: Das erwartet Sie im Taufgespräch",
					"href": "https://tbapp.evangelisch.de/taufbegleiter/244751/das-erwartet-sie-im-taufgespraech"
				},
				{
					"label": "katholisch.de: Checkliste fürs Taufgespräch (PDF)",
					"href": "https://www.katholisch.de/media/pdf/katholisch-de_Checkliste_Taufgespraech.pdf"
				}
			]
		},
		{
			"title": "2. Musikmomente auswählen, nicht jeden Abschnitt füllen",
			"body": [
				"Einzug, ein eigener Moment zum Zuhören und Auszug können mögliche Stellen sein. Welche davon tatsächlich passen, wird mit der Gemeinde vereinbart. Für gesprochene Worte und die Taufhandlung klären wir, wo Stille sinnvoll ist und wo ein Musikeinsatz ausdrücklich vorgesehen wird.",
				"Haltet die Reihenfolge mit ungefährer Länge der Stücke fest. Eine Kontaktperson gibt das Signal für den Beginn. Wenn sich ein Abschnitt verlängert, hilft diese Absprache mehr als ein Ablauf, der ausschließlich auf feste Uhrzeiten vertraut."
			],
			"links": [
				{
					"label": "Solo-Viola im Taufgottesdienst",
					"href": "/taufen/musik-gottesdienst-taufe/"
				}
			]
		},
		{
			"title": "3. Wunschlied, Gemeindegesang und Instrumentalstück unterscheiden",
			"body": [
				"Wenn alle mitsingen sollen, müssen Liedauswahl und Begleitung mit der Gemeinde geklärt werden. Ein Solo-Stück gibt dagegen einen Moment zum Zuhören. Für die Anfrage sollte deshalb deutlich sein, welche Aufgabe eure Liedidee in der Feier übernehmen soll.",
				"Für ein persönliches Wunschstück schickt Titel und gewünschte Version. Kim Marie Borger prüft, ob die Melodie für Solo-Viola passt, welche Noten vorliegen und wie viel Vorbereitung nötig ist. Vorhandenes Repertoire ist ohne Aufpreis möglich; zusätzliche Bearbeitung oder neue Notation wird vorab vereinbart."
			],
			"links": [
				{
					"label": "Den Klang der Viola in Hörbeispielen kennenlernen",
					"href": "/portfolio/"
				}
			]
		},
		{
			"title": "4. Spielort, Empfang und Anfrage zusammenbringen",
			"body": [
				"Klärt mit der Gemeinde den Platz für die Musikerin, Ankunft, Zugang und die vorhandene Hörsituation. Gästezahl, Licht und mögliche Technik werden vorab besprochen. Für die erste Anfrage helfen Datum, Uhrzeit, genaue Adresse, Ablauf, Wunschstücke und die Kontaktperson der Gemeinde.",
				"Soll nach der Taufe beim Empfang Musik erklingen, wird das als eigener Abschnitt geplant. Nennt den zweiten Ort und die gewünschten Spielzeiten. Anfahrt, Vorbereitung, Wartezeiten und ein möglicher Ortswechsel fließen in den vereinbarten Umfang ein. Bei einem Empfang draußen werden Wetterschutz und eine Alternative abgestimmt."
			],
			"links": [
				{
					"label": "Musik für Taufe und Willkommensfest",
					"href": "/taufen/"
				},
				{
					"label": "Taufmusik persönlich anfragen",
					"href": "/anfragen/"
				}
			]
		}
	],
	"internalLinks": [
		{
			"label": "Taufmusik mit Solo-Viola",
			"href": "/taufen/"
		},
		{
			"label": "Musik im Taufgottesdienst",
			"href": "/taufen/musik-gottesdienst-taufe/"
		},
		{
			"label": "Hörproben im Portfolio",
			"href": "/portfolio/"
		}
	],
	"nextStep": {
		"label": "Musikmomente und Termin anfragen",
		"href": "/anfragen/"
	},
	"faqs": [
		{
			"question": "Wie viele Musikstücke braucht eine Taufe?",
			"answer": "Eine feste Anzahl passt nicht zu jeder Feier. Einzug, ein eigenes Instrumentalstück und Auszug können mögliche Stellen sein. Die Auswahl richtet sich nach dem Ablauf und wird mit der Gemeinde abgestimmt."
		},
		{
			"question": "Können wir ein persönliches Lied wünschen?",
			"answer": "Ja. Nennt Titel und gewünschte Version. Die Musikerin prüft Eignung für Solo-Viola, vorhandene Noten und Vorbereitung; bei einer kirchlichen Taufe wird auch der Einsatz mit der Gemeinde abgestimmt."
		},
		{
			"question": "Begleitest du den Gemeindegesang mit der Viola?",
			"answer": "Gemeinsamer Gesang braucht eine gesonderte Absprache mit der Gemeinde und den bereits beteiligten Kirchenmusiker:innen. Bei der Anfrage klären wir, ob ein Solo-Instrumentalstück oder eine musikalische Zusammenarbeit gemeint ist."
		},
		{
			"question": "Kann beim Empfang nach der Taufe auch Musik gespielt werden?",
			"answer": "Das kann als zusätzlicher Abschnitt vereinbart werden. Spielzeiten, Empfangsort, Wege, mögliche Wartezeit und bei einem Außenauftritt die Wetteralternative werden vorab geklärt."
		},
		{
			"question": "Welche Angaben helfen für die erste Anfrage?",
			"answer": "Datum, Uhrzeit, genaue Adresse, Form der Feier, Gästezahl, Ablauf, Wunschstücke und eine Kontaktperson der Gemeinde helfen bei der Einschätzung. Ein anschließender Empfang wird ebenfalls genannt."
		}
	]
},
{
  "cluster": "Unterricht",
  "serviceSlug": "unterricht",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "slug": "geigen-probestunde",
  "title": "Eine Geigen- oder Bratschen-Probestunde vorbereiten",
  "shortTitle": "Checkliste für die Probestunde",
  "seoTitle": "Geigenunterricht Probestunde: Vorbereitung & Ablauf",
  "seoDescription": "Geigen- oder Bratschen-Probestunde vorbereiten: Instrument, Vorerfahrung, Lernziel und Termine klären. Bei Kim Marie Borger kostenlos und unverbindlich.",
  "intent": "Den ersten Termin für Geige oder Bratsche vorbereiten und offene Fragen vor regelmäßigem Unterricht klären.",
  "kicker": "Vor der ersten Stunde",
  "lead": "Für eine Probestunde brauchst du noch kein fertiges Vorspiel. Wichtiger sind dein Ausgangspunkt, deine musikalischen Wünsche und eine vorher geklärte Instrumentenfrage.",
  "summary": "Mitbringliste, Fragen und organisatorische Absprachen für die kostenlose Probestunde auf Geige oder Bratsche.",
  "keyPoints": [
    "Instrument und Vorbereitung vor dem Termin klären.",
    "Vorerfahrung und ein persönliches Lernziel nennen.",
    "Nach der Probestunde gemeinsam über regelmäßigen Unterricht entscheiden."
  ],
  "sections": [
    {
      "title": "1. Deinen Ausgangspunkt in wenigen Sätzen nennen",
      "body": [
        "Hast du noch nie ein Streichinstrument gespielt, kommst du von der Geige zur Bratsche oder möchtest du nach einer Pause zurückkehren? Diese Information hilft bei der Vorbereitung. Notenkenntnisse oder ein vorbereitetes Stück sind für eine erste Anfrage keine Voraussetzung.",
        "Sag auch, welche Musik dich interessiert. Ein Stückwunsch, ein Ensembleziel oder der Wunsch, zunächst einen sicheren Ton zu spielen, gibt dem Gespräch eine Richtung. Für Kinder sind Alter und bisherige musikalische Erfahrungen hilfreich."
      ]
    },
    {
      "title": "2. Instrument, Bogen und Noten absprechen",
      "body": [
        "Wenn ein Instrument vorhanden ist, teile es vor dem Termin mit. Instrument, Bogen, bisherige Noten und vertrautes Zubehör können hilfreich sein. Ob du etwas mitbringen sollst, wird für die vereinbarte Probestunde geklärt.",
        "Ohne eigenes Instrument sprich die Frage vorher an. Kaufe nicht allein wegen des ersten Termins ein unbekanntes Instrument. Größe, Handhabung und Zustand sollten fachlich eingeschätzt werden; ein Leih- oder Mietinstrument ist keine automatisch zugesagte Leistung von Kim."
      ],
      "links": [
        {
          "label": "Das erste Instrument für Geige oder Bratsche auswählen",
          "href": "/ratgeber/geige-bratsche-instrument-start/"
        }
      ]
    },
    {
      "title": "3. Ort und Zeit mit deinem Alltag verbinden",
      "body": [
        "Der Unterrichtsschwerpunkt liegt in Köln, Düsseldorf und Umgebung. Nenne deinen Ausgangsort und mögliche Zeitfenster, damit Unterrichtsort und Format persönlich abgestimmt werden können. Eine Ortsseite beschreibt das Einsatzgebiet und keinen garantierten freien Termin.",
        "Überlege, welche Zeit zwischen den Stunden für das Üben verfügbar ist. Stundenlänge, Preis und regelmäßiger Rhythmus sind variabel und werden vor einer Buchung vereinbart. Du kannst die Probestunde nutzen, um diese Punkte zu besprechen."
      ],
      "links": [
        {
          "label": "Unterricht in Köln",
          "href": "/unterricht/koeln/"
        },
        {
          "label": "Unterricht in Düsseldorf",
          "href": "/unterricht/duesseldorf/"
        }
      ]
    },
    {
      "title": "4. Nach der Probestunde in Ruhe entscheiden",
      "body": [
        "Die Probestunde bei Kim Marie Borger ist kostenlos und unverbindlich. Sie dient dem gegenseitigen Kennenlernen und der Orientierung über Instrument, Lernziel und Rahmen. Danach entscheiden beide Seiten, ob regelmäßiger Unterricht passt.",
        "Halte anschließend fest, welcher erste Lernschritt sinnvoll erscheint, wie Unterricht und Üben in deine Woche passen und welche Bedingungen vereinbart wurden. Wenn Fragen offenbleiben, kläre sie vor der regelmäßigen Buchung."
      ]
    }
  ],
  "internalLinks": [
    {
      "label": "Geigen- und Bratschenunterricht",
      "href": "/unterricht/"
    },
    {
      "label": "Unterricht für Erwachsene",
      "href": "/unterricht/geigenunterricht-erwachsene/"
    },
    {
      "label": "Geigenunterricht für Kinder",
      "href": "/unterricht/geigenunterricht-kinder/"
    }
  ],
  "nextStep": {
    "label": "Kostenlose Probestunde persönlich anfragen",
    "href": "/anfragen/"
  },
  "faqs": [
    {
      "question": "Muss ich für die Probestunde Noten lesen können?",
      "answer": "Nein. Nenne bei der Anfrage deine Vorerfahrung. Der Einstieg und die Vorbereitung werden so abgestimmt, dass sie zu deinem aktuellen Lernstand passen."
    },
    {
      "question": "Brauche ich schon eine eigene Geige oder Bratsche?",
      "answer": "Teile vor dem Termin mit, ob ein Instrument vorhanden ist. Die Instrumentenfrage wird persönlich geklärt. Ein Leih- oder Mietinstrument wird nicht automatisch zugesagt."
    },
    {
      "question": "Was kann ich mitbringen, wenn ich schon gespielt habe?",
      "answer": "Nach Absprache können Instrument, Bogen, bisherige Noten oder ein vertrautes Stück helfen, deinen Ausgangspunkt zu erkennen. Ein vorbereitetes Vorspiel ist keine Voraussetzung für die Anfrage."
    },
    {
      "question": "Was kostet die Probestunde?",
      "answer": "Bei Kim Marie Borger ist die Probestunde kostenlos und unverbindlich. Preise und Stundenlängen für regelmäßigen Unterricht werden individuell vereinbart."
    },
    {
      "question": "Verpflichte ich mich danach zu regelmäßigem Unterricht?",
      "answer": "Die Probestunde dient dem gegenseitigen Kennenlernen. Danach entscheiden wir gemeinsam, ob Unterricht und Rahmen für beide Seiten passen. Die kostenlose Probestunde ist unverbindlich."
    }
  ]
},
{
  "cluster": "Unterricht",
  "serviceSlug": "unterricht",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "slug": "geige-bratsche-instrument-start",
  "title": "Das erste Instrument für Geige oder Bratsche auswählen",
  "shortTitle": "Das erste Instrument auswählen",
  "seoTitle": "Geige oder Bratsche für Anfänger: kaufen, mieten, leihen",
  "seoDescription": "Vor dem Unterricht Größe, Zustand und Zubehör für Geige oder Bratsche klären. Entscheidungshilfe zum Kaufen, Mieten oder Leihen ohne pauschale Produktempfehlung.",
  "intent": "Die Beschaffung eines passenden ersten Instruments vor dem Unterricht vorbereiten.",
  "kicker": "Instrumentenwahl",
  "lead": "Für den Anfang muss das Instrument zu dir und zum vorgesehenen Unterricht passen. Größe, Zustand und Zubehör klärst du am besten vor einem Kauf oder Mietvertrag mit einer Lehrkraft oder einem Fachgeschäft.",
  "summary": "Instrumentengröße, vorhandene Instrumente und Fragen für Kauf, Miete oder Leihe vor dem Unterricht sortieren.",
  "keyPoints": [
    "Instrumentenart und Größe vor der Beschaffung klären.",
    "Ein vorhandenes Instrument fachlich ansehen lassen.",
    "Kauf, Miete und Leihe samt Zubehör und Bedingungen vergleichen."
  ],
  "sections": [
    {
      "title": "1. Instrumentenart und Handhabung zuerst klären",
      "body": [
        "Geige und Bratsche unterscheiden sich unter anderem in Klang und Größe. Wenn du noch unentschieden bist, beginne mit deinen Klangvorstellungen und dem Gespräch über den Unterricht. Bratsche und Viola bezeichnen dasselbe Instrument.",
        "Bei Kindern ebenso wie bei Erwachsenen sollte die Handhabung des konkreten Instruments geprüft werden. Eine Größenangabe im Angebot ersetzt das Ausprobieren nicht. Lege dich deshalb nicht allein anhand von Alter oder Körpergröße auf ein Instrument fest."
      ],
      "links": [
        {
          "label": "Geige und Bratsche: Klang und Unterschiede",
          "href": "/ratgeber/bratsche-geige-unterschied/"
        }
      ]
    },
    {
      "title": "2. Kaufen, mieten oder leihen bewusst vergleichen",
      "body": [
        "Beim Kauf gehört das Instrument dir; bei Miete oder Leihe gelten die jeweiligen Bedingungen des Anbieters. Vergleiche, was enthalten ist, wie lange du dich bindest, wie ein Größenwechsel geregelt wird und welche Kosten bei Schäden oder Rückgabe entstehen können.",
        "Musikschulische Leihangebote können an einen Unterrichtsplatz und verfügbare Instrumente gebunden sein. Die Rheinische Musikschule Köln beschreibt zum Beispiel Beratung durch die Instrumentallehrkraft und anschließende Verfügbarkeitsprüfung. Daraus ergibt sich kein Anspruch auf ein Leihinstrument bei Kim oder einer anderen Anbieterin."
      ],
      "links": [
        {
          "label": "Stadt Köln: Bedingungen zum Instrumentenverleih",
          "href": "https://www.stadt-koeln.de/leben-in-koeln/rheinische-musikschule/instrumentenverleih"
        }
      ]
    },
    {
      "title": "3. Ein vorhandenes Instrument mitprüfen lassen",
      "body": [
        "Wenn bereits eine Geige oder Bratsche vorhanden ist, notiere Herkunft, Größe und bekannte Besonderheiten. Teile vor der Probestunde mit, ob auch Bogen, Etui und Zubehör vorhanden sind. Bei längerer Lagerung oder einem unklaren Zustand ist eine fachliche Einschätzung sinnvoll.",
        "Auch beim Neukauf hilft sachkundige Begleitung: Yamaha empfiehlt Anfänger:innen die Beratung durch ein vertrauenswürdiges Fachgeschäft und nach Möglichkeit eine fachkundige Person bei der Auswahl. Entscheidend bleibt das konkret ausprobierte Instrument."
      ],
      "links": [
        {
          "label": "Yamaha: Ein Instrument mit fachkundiger Beratung auswählen",
          "href": "https://www.yamaha.com/en/musical_instrument_guide/violin/selection/"
        }
      ]
    },
    {
      "title": "4. Zubehör und ersten Unterricht zusammen abstimmen",
      "body": [
        "Frage, ob Bogen, Etui und benötigtes Zubehör im Angebot enthalten sind und was noch fehlt. Schulterstütze und weitere Anpassungen sollten zum Instrument und zur Person passen. Eine lange allgemeine Einkaufsliste ist für die erste Anfrage nicht nötig.",
        "Für den Unterricht bei Kim helfen die Instrumentenangaben, dein Lernstand und der Ausgangsort in Köln, Düsseldorf oder Umgebung. Vor dem Termin klärst du, was mitgebracht wird. Preis und Stundenlänge werden individuell vereinbart; die Probestunde ist kostenlos und unverbindlich."
      ],
      "links": [
        {
          "label": "Checkliste für die Probestunde",
          "href": "/ratgeber/geigen-probestunde/"
        }
      ]
    }
  ],
  "internalLinks": [
    {
      "label": "Geigen- und Bratschenunterricht",
      "href": "/unterricht/"
    },
    {
      "label": "Geigenunterricht für Kinder",
      "href": "/unterricht/geigenunterricht-kinder/"
    },
    {
      "label": "Bratschenunterricht",
      "href": "/unterricht/bratschenunterricht/"
    }
  ],
  "nextStep": {
    "label": "Instrument und Probestunde abstimmen",
    "href": "/anfragen/"
  },
  "faqs": [
    {
      "question": "Soll ich schon vor der Probestunde ein Instrument kaufen?",
      "answer": "Kläre zuerst Instrumentenart, Größe, Handhabung und Vorbereitung. Teile bei der Anfrage mit, ob schon ein Instrument vorhanden ist. Ein spontaner Kauf ist für die Anfrage nicht nötig."
    },
    {
      "question": "Ist Mieten für Anfänger:innen immer besser als Kaufen?",
      "answer": "Das hängt von Instrument, Nutzungsdauer und den Bedingungen des Anbieters ab. Vergleiche den Gesamtumfang, Größenwechsel, Rückgabe und mögliche Zusatzkosten."
    },
    {
      "question": "Verleiht Kim selbst Instrumente?",
      "answer": "Ein eigener Instrumentenverleih ist hier nicht zugesagt. Wenn du kein Instrument hast, sprich die Frage vor dem Termin an, damit die Vorbereitung persönlich geklärt wird."
    },
    {
      "question": "Kann ich eine Geige aus der Familie mitbringen?",
      "answer": "Teile Größe und bekannten Zustand vor dem Termin mit. Nach Absprache kann ein vorhandenes Instrument für die erste Orientierung hilfreich sein; seine Eignung muss am konkreten Instrument geprüft werden."
    },
    {
      "question": "Reicht eine Instrumentengröße nach Alterstabelle?",
      "answer": "Eine Tabelle kann zur Orientierung dienen. Für die Auswahl zählen die Handhabung und die fachliche Einschätzung am konkreten Instrument, besonders bei Kindern."
    }
  ]
},
{
  "slug": "hochzeitsmusik-kosten",
  "title": "Hochzeitsmusik: Kosten und Leistungsumfang klären",
  "shortTitle": "Hochzeitsmusik: Kosten und Leistungsumfang klären",
  "seoTitle": "Hochzeitsmusik: Kosten und Leistungsumfang klären",
  "seoDescription": "Was beeinflusst den Preis für Live-Viola zur Hochzeit? Trauung, Empfang, Anfahrt und Vorbereitung mit einer Anfragevorlage planen.",
  "intent": "Was beeinflusst den Preis für Live-Viola zur Hochzeit? Trauung, Empfang, Anfahrt und Vorbereitung mit einer Anfragevorlage planen.",
  "cluster": "Hochzeit",
  "serviceSlug": "hochzeiten",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Hochzeit",
  "lead": "Was beeinflusst den Preis für Live-Viola zur Hochzeit? Trauung, Empfang, Anfahrt und Vorbereitung mit einer Anfragevorlage planen.",
  "summary": "Was beeinflusst den Preis für Live-Viola zur Hochzeit? Trauung, Empfang, Anfahrt und Vorbereitung mit einer Anfragevorlage planen.",
  "keyPoints": [
    "Trauung, Empfang und Dinner getrennt beschreiben",
    "Vorbereitung, Anfahrt und Zeit dazwischen berücksichtigen",
    "Angebote anhand desselben Ablaufs vergleichen"
  ],
  "sections": [
    {
      "title": "Trauung, Empfang und Dinner getrennt beschreiben",
      "body": [
        "Für die Zeremonie zählen ausgewählte Musikmomente und ihre Vorbereitung. Ein anschließender Empfang braucht ein weiteres Zeitfenster; beim Dinner kommen Spielblöcke und Redepausen hinzu. Nennt deshalb zuerst die Abschnitte, die ihr musikalisch begleiten möchtet.",
        "Wenn Trauung und Feier an verschiedenen Orten stattfinden, plant den Wechsel mit ein. Auch ein längerer Abstand bis zum Dinner verändert den Zeitraum vor Ort. Erst dieser Ablauf macht den gewünschten Leistungsumfang verständlich."
      ]
    },
    {
      "title": "Vorbereitung, Anfahrt und Zeit dazwischen berücksichtigen",
      "body": [
        "Der Aufwand umfasst mehr als die Minuten, in denen Musik zu hören ist. Vorbereitung, Anfahrt und die vereinbarten Zeiten vor Ort gehören in die Abstimmung. Bei getrennten Einsätzen sollten auch Wartephasen und ein möglicher zweiter Spielort sichtbar sein.",
        "Ein Wunschstück aus vorhandenem Repertoire ist ohne Aufpreis möglich. Muss Musik neu eingerichtet oder notiert werden, wird der zusätzliche Aufwand vorher besprochen. Auch eine größere Besetzung oder besondere Technik braucht eine eigene Prüfung."
      ]
    },
    {
      "title": "Angebote anhand desselben Ablaufs vergleichen",
      "body": [
        "Gebt bei mehreren Anfragen denselben Zeitplan und dieselben Einsatzorte an. Fragt, welche Spielphasen, Vorbereitung und Wege enthalten sind und wie Änderungen behandelt werden. Ein einzelnes Zeremoniestück und mehrere Stunden Begleitung sind unterschiedliche Umfänge.",
        "Für Kim Marie Borger gibt es hier keine erfundene Pauschale. Der konkrete Preis wird persönlich nach Termin, Ort und musikalischer Aufgabe vereinbart. Die kostenlose Anfrage hilft zuerst, Verfügbarkeit und Rahmen zu prüfen."
      ]
    },
    {
      "title": "Vorlage für eure Anfrage und Budgetplanung",
      "body": [
        "Zum Kopieren: Datum: … · Trauform und Location: … · Musikmomente mit Uhrzeiten: … · Empfang oder Dinner: … · zweiter Spielort: … · Wunschstücke: … · Kontaktperson: … · Außenplatz und Ersatzort: …",
        "Ergänzt euren vorgesehenen Budgetrahmen, falls er bereits feststeht. Markiert, welche Angaben bestätigt sind und welche noch offen bleiben. Ihr bekommt dann eine Rückmeldung zum möglichen Umfang und zu den Konditionen für euren Tag."
      ],
      "links": [
        {
          "label": "Anfrage mit euren Eckdaten",
          "href": "/anfragen/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Warum steht hier kein fester Preis?",
      "answer": "Termin, Ort, Umfang, Vorbereitung und weitere Absprachen unterscheiden sich. Ein belastbares Angebot entsteht aus eurem konkreten Ablauf."
    },
    {
      "question": "Kosten Wunschstücke zusätzlich?",
      "answer": "Vorhandenes Repertoire ist ohne Aufpreis möglich. Neue Bearbeitung oder Notation wird vorab geprüft und gesondert vereinbart."
    },
    {
      "question": "Zählt auch Zeit ohne Musik?",
      "answer": "Wartezeiten zwischen vereinbarten Einsätzen und Ortswechsel können zum Aufwand gehören. Ihr klärt sie im Angebot, damit der gesamte Zeitraum nachvollziehbar ist."
    },
    {
      "question": "Wie bekommen wir ein konkretes Angebot?",
      "answer": "Schickt Datum, Spielorte, gewünschte Musikabschnitte, ungefähre Zeiten und gegebenenfalls Wunschstücke. Ein fertiger Ablaufplan ist für den ersten Kontakt nicht erforderlich."
    }
  ],
  "internalLinks": [
    {
      "label": "Leistungsumfang kennenlernen",
      "href": "/hochzeiten/"
    },
    {
      "label": "Hörproben der Viola",
      "href": "/portfolio/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "trauermusik-kosten",
  "title": "Trauermusik: Kosten und Einsatzumfang klären",
  "shortTitle": "Trauermusik: Kosten und Einsatzumfang klären",
  "seoTitle": "Trauermusik: Kosten und Einsatzumfang klären",
  "seoDescription": "Preisfaktoren für Trauermusik mit Viola: Halle, Kirche oder Grab, Anfahrt und Vorbereitung. Eine kurze Vorlage hilft bei der Anfrage.",
  "intent": "Preisfaktoren für Trauermusik mit Viola: Halle, Kirche oder Grab, Anfahrt und Vorbereitung. Eine kurze Vorlage hilft bei der Anfrage.",
  "cluster": "Trauerfeier",
  "serviceSlug": "beerdigungen",
  "heroImage": "/uploads/_DSC7353.webp",
  "heroImageAlt": "Kim Marie Borger mit ihrer Viola am See in der Abenddämmerung",
  "kicker": "Trauerfeier",
  "lead": "Preisfaktoren für Trauermusik mit Viola: Halle, Kirche oder Grab, Anfahrt und Vorbereitung. Eine kurze Vorlage hilft bei der Anfrage.",
  "summary": "Preisfaktoren für Trauermusik mit Viola: Halle, Kirche oder Grab, Anfahrt und Vorbereitung. Eine kurze Vorlage hilft bei der Anfrage.",
  "keyPoints": [
    "Halle, Kirche und Grab als einzelne Einsätze klären",
    "Vorbereitung, Anfahrt und Zeit dazwischen berücksichtigen",
    "Angebote anhand desselben Ablaufs vergleichen"
  ],
  "sections": [
    {
      "title": "Halle, Kirche und Grab als einzelne Einsätze klären",
      "body": [
        "Ein Stück zu Beginn der Trauerfeier hat einen anderen Umfang als mehrere Momente und ein zweiter Einsatz an der Grabstelle. Nennt, wo Musik gebraucht wird; eine Stückliste darf zunächst offen sein.",
        "Beim Weg von der Halle zum Grab berücksichtigen wir Zeit, Transport und einen geeigneten Standort. Das Bestattungshaus kann diese Angaben übernehmen, wenn die Familie die weitere Organisation abgeben möchte."
      ]
    },
    {
      "title": "Vorbereitung, Anfahrt und Zeit dazwischen berücksichtigen",
      "body": [
        "Der Aufwand umfasst mehr als die Minuten, in denen Musik zu hören ist. Vorbereitung, Anfahrt und die vereinbarten Zeiten vor Ort gehören in die Abstimmung. Bei getrennten Einsätzen sollten auch Wartephasen und ein möglicher zweiter Spielort sichtbar sein.",
        "Ein Wunschstück aus vorhandenem Repertoire ist ohne Aufpreis möglich. Muss Musik neu eingerichtet oder notiert werden, wird der zusätzliche Aufwand vorher besprochen. Auch eine größere Besetzung oder besondere Technik braucht eine eigene Prüfung."
      ]
    },
    {
      "title": "Angebote anhand desselben Ablaufs vergleichen",
      "body": [
        "Gebt bei mehreren Anfragen denselben Zeitplan und dieselben Einsatzorte an. Fragt, welche Spielphasen, Vorbereitung und Wege enthalten sind und wie Änderungen behandelt werden. Ein einzelnes Zeremoniestück und mehrere Stunden Begleitung sind unterschiedliche Umfänge.",
        "Für Kim Marie Borger gibt es hier keine erfundene Pauschale. Der konkrete Preis wird persönlich nach Termin, Ort und musikalischer Aufgabe vereinbart. Die kostenlose Anfrage hilft zuerst, Verfügbarkeit und Rahmen zu prüfen."
      ]
    },
    {
      "title": "Vorlage für eure Anfrage und Budgetplanung",
      "body": [
        "Kurze Vorlage: Termin und Uhrzeit: … · Trauerort oder Friedhof: … · Musik in Halle, Kirche oder am Grab: … · Wunschstück, falls vorhanden: … · Kontakt zum Bestattungshaus: …",
        "Diese wenigen Angaben reichen für den ersten Austausch. Weitere Details können danach mit einer festen Kontaktperson geklärt werden. Kurzfristige Verfügbarkeit und geeignete Fassungen werden geprüft, bevor eine Zusage erfolgt."
      ],
      "links": [
        {
          "label": "Anfrage mit euren Eckdaten",
          "href": "/anfragen/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Warum steht hier kein fester Preis?",
      "answer": "Termin, Ort, Umfang, Vorbereitung und weitere Absprachen unterscheiden sich. Ein belastbares Angebot entsteht aus eurem konkreten Ablauf."
    },
    {
      "question": "Kosten Wunschstücke zusätzlich?",
      "answer": "Vorhandenes Repertoire ist ohne Aufpreis möglich. Neue Bearbeitung oder Notation wird vorab geprüft und gesondert vereinbart."
    },
    {
      "question": "Zählt auch Zeit ohne Musik?",
      "answer": "Wartezeiten zwischen vereinbarten Einsätzen und Ortswechsel können zum Aufwand gehören. Ihr klärt sie im Angebot, damit der gesamte Zeitraum nachvollziehbar ist."
    },
    {
      "question": "Wie bekommen wir ein konkretes Angebot?",
      "answer": "Nennt Termin, Uhrzeit, Ort und gewünschte Einsatzstellen. Eine Kontaktperson beim Bestattungshaus kann die weiteren Angaben übermitteln."
    }
  ],
  "internalLinks": [
    {
      "label": "Leistungsumfang kennenlernen",
      "href": "/beerdigungen/"
    },
    {
      "label": "Hörproben der Viola",
      "href": "/portfolio/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "geige-bratsche-ueben-alltag",
  "title": "Geige und Bratsche im Alltag üben",
  "shortTitle": "Geige und Bratsche im Alltag üben",
  "seoTitle": "Geige und Bratsche im Alltag üben",
  "seoDescription": "Üben zwischen den Unterrichtsstunden: ein klares Ziel, kurze Aufgaben und eine ausfüllbare Übenotiz für Geige oder Bratsche.",
  "intent": "Üben zwischen den Unterrichtsstunden: ein klares Ziel, kurze Aufgaben und eine ausfüllbare Übenotiz für Geige oder Bratsche.",
  "cluster": "Unterricht",
  "serviceSlug": "unterricht",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Unterricht",
  "lead": "Üben zwischen den Unterrichtsstunden: ein klares Ziel, kurze Aufgaben und eine ausfüllbare Übenotiz für Geige oder Bratsche.",
  "summary": "Üben zwischen den Unterrichtsstunden: ein klares Ziel, kurze Aufgaben und eine ausfüllbare Übenotiz für Geige oder Bratsche.",
  "keyPoints": [
    "Ein konkretes Ziel für die nächste Einheit wählen",
    "Hören, Rhythmus und Bogen getrennt betrachten",
    "Übezeit an die tatsächliche Woche anpassen"
  ],
  "sections": [
    {
      "title": "Ein konkretes Ziel für die nächste Einheit wählen",
      "body": [
        "„Das Stück üben“ ist ein großes Vorhaben. Eine kleinere Aufgabe kann heißen: den Rhythmus einer Stelle verstehen, einen Übergang zwischen zwei Saiten wiederholen oder den Beginn mit ruhigem Bogen spielen. Wähle den Schwerpunkt zusammen mit deiner Lehrkraft.",
        "Notiere, woran du eine Veränderung hören oder erkennen möchtest. Ein kurzer Ausschnitt gibt dir die Möglichkeit, denselben Vorgang aufmerksam zu wiederholen. Er ersetzt nicht das spätere Zusammenspiel der gesamten Phrase."
      ],
      "links": []
    },
    {
      "title": "Hören, Rhythmus und Bogen getrennt betrachten",
      "body": [
        "Wenn eine Stelle noch nicht gelingt, unterscheiden sich mögliche Ursachen. Ist die Notenfolge unklar, stimmt der Rhythmus noch nicht oder braucht die Bogenbewegung Aufmerksamkeit? Im Unterricht lässt sich klären, welche Aufgabe zuerst sinnvoll ist.",
        "Du kannst vereinbarte Rhythmen zunächst sprechen oder klopfen und beim Spielen einen kurzen Ausschnitt untersuchen. Ein Metronom ist ein Hilfsmittel für einen gewählten Schwerpunkt, keine Vorgabe, jede Übeeinheit gleich aufzubauen. Umfang und Schwierigkeit bleiben an deinem Lernstand ausgerichtet."
      ],
      "links": []
    },
    {
      "title": "Übezeit an die tatsächliche Woche anpassen",
      "body": [
        "Plane Zeitfenster, die zwischen Arbeit, Schule und anderen Terminen wirklich möglich sind. Eine überschaubare Aufgabe ist auch an einem kurzen Tag machbar. Du musst nicht jede Sitzung mit dem ganzen Stück beginnen.",
        "Für Kinder hilft eine gemeinsame Absprache, wer an die Aufgabe erinnert und wann das Instrument bereitliegt. Erwachsene können notieren, welche Tage regelmäßig frei sind. Wenn ein Plan im Alltag nicht funktioniert, wird er im Unterricht angepasst."
      ],
      "links": [
        {
          "label": "Unterricht für Kinder",
          "href": "/unterricht/geigenunterricht-kinder/"
        },
        {
          "label": "Unterricht für Erwachsene",
          "href": "/unterricht/geigenunterricht-erwachsene/"
        }
      ]
    },
    {
      "title": "Eine Übenotiz zum Kopieren nutzen",
      "body": [
        "Vorlage: Datum: … · heutiges Ziel: … · Stelle oder Takte: … · vereinbarte Vorgehensweise: … · was wurde klarer: … · Frage für die nächste Stunde: …",
        "Diese Vorlage ist eine allgemeine Planungshilfe und kein persönlich festgelegter Übeplan. Bring die Notiz zum nächsten Termin mit. So kann aus einer konkreten Beobachtung die nächste passende Aufgabe entstehen."
      ],
      "links": [
        {
          "label": "Lernziel in der Probestunde besprechen",
          "href": "/ratgeber/geigen-probestunde/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Wie lange sollte ich täglich üben?",
      "answer": "Die passende Dauer hängt von Lernstand, Aufgabe und Alltag ab. Vereinbare einen realistischen Umfang im Unterricht; hier wird keine universelle Minutenzahl vorgegeben."
    },
    {
      "question": "Was mache ich, wenn eine Stelle nicht besser wird?",
      "answer": "Notiere den Ausschnitt und deine Frage. Die Lehrkraft kann unterscheiden, ob Rhythmus, Tonfolge, Bogen oder ein anderer Schwerpunkt zuerst bearbeitet werden sollte."
    },
    {
      "question": "Brauche ich immer ein Metronom?",
      "answer": "Es kann für einen bestimmten Rhythmusschwerpunkt sinnvoll sein. Ob und wie es eingesetzt wird, richtet sich nach der vereinbarten Aufgabe."
    },
    {
      "question": "Wie passe ich die Übenotiz an meinen Unterricht an?",
      "answer": "Nimm die vereinbarte Aufgabe aus deiner Stunde als Ziel und notiere Beobachtungen und Fragen dazu. Dein persönlicher Lern- und Übeplan entsteht im Unterricht."
    }
  ],
  "internalLinks": [
    {
      "label": "Geigen- und Bratschenunterricht",
      "href": "/unterricht/"
    },
    {
      "label": "Nach einer Pause wieder einsteigen",
      "href": "/ratgeber/geige-wiedereinstieg/"
    }
  ],
  "nextStep": {
    "label": "Probestunde anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "geige-wiedereinstieg",
  "title": "Nach einer Pause wieder Geige spielen",
  "shortTitle": "Nach einer Pause wieder Geige spielen",
  "seoTitle": "Nach einer Pause wieder Geige spielen",
  "seoDescription": "Wiedereinstieg auf Geige oder Bratsche: Instrument prüfen, frühere Erfahrungen einordnen und ein realistisches erstes Lernziel vereinbaren.",
  "intent": "Wiedereinstieg auf Geige oder Bratsche: Instrument prüfen, frühere Erfahrungen einordnen und ein realistisches erstes Lernziel vereinbaren.",
  "cluster": "Unterricht",
  "serviceSlug": "unterricht",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Unterricht",
  "lead": "Wiedereinstieg auf Geige oder Bratsche: Instrument prüfen, frühere Erfahrungen einordnen und ein realistisches erstes Lernziel vereinbaren.",
  "summary": "Wiedereinstieg auf Geige oder Bratsche: Instrument prüfen, frühere Erfahrungen einordnen und ein realistisches erstes Lernziel vereinbaren.",
  "keyPoints": [
    "Das vorhandene Instrument vor dem Start prüfen lassen",
    "Frühere Erfahrungen ohne Vorspieldruck beschreiben",
    "Ein erstes Ziel wählen, das zum heutigen Alltag passt"
  ],
  "sections": [
    {
      "title": "Das vorhandene Instrument vor dem Start prüfen lassen",
      "body": [
        "Wenn Geige oder Bratsche lange im Kasten lag, ist ein fachlicher Blick auf Zustand und Spielbarkeit sinnvoll. Dazu gehören auch Bogen und Zubehör. Versuche nicht, unbekannte Schäden selbst zu reparieren oder allein deshalb sofort ein neues Instrument zu kaufen.",
        "Teile vor der Probestunde mit, welches Instrument vorhanden ist und wann es zuletzt gespielt wurde. Falls du keines mehr hast, wird die Vorbereitung für den Termin persönlich geklärt. Miete oder Leihe ist keine automatisch zugesagte Leistung von Kim."
      ],
      "links": [
        {
          "label": "Instrument kaufen, mieten oder leihen",
          "href": "/ratgeber/geige-bratsche-instrument-start/"
        }
      ]
    },
    {
      "title": "Frühere Erfahrungen ohne Vorspieldruck beschreiben",
      "body": [
        "Wie lange hast du gespielt, welche Noten kennst du noch und was hat dir früher Freude gemacht? Alte Hefte oder ein vertrautes Stück helfen, den Ausgangspunkt zu erkennen. Eine Pause bedeutet nicht, dass jeder Bereich wieder auf demselben Stand beginnt.",
        "Vielleicht liest du Noten noch sicher, während Bogenführung oder Orientierung auf dem Griffbrett mehr Aufmerksamkeit brauchen. In der Probestunde wird daraus eine passende erste Aufgabe. Du musst dich nicht an deiner früheren schwierigsten Leistung messen."
      ],
      "links": []
    },
    {
      "title": "Ein erstes Ziel wählen, das zum heutigen Alltag passt",
      "body": [
        "Ein vertrautes Stück wieder sicher spielen, einen warmen Ton finden oder später im Ensemble mitwirken: Nenne den Wunsch möglichst konkret. Für den Anfang wird ein erreichbarer Teil davon gewählt. Ein Konzertziel kann längerfristig bleiben.",
        "Dauer, Rhythmus und Preis des Unterrichts werden individuell vereinbart. Im Raum Köln, Düsseldorf und Umgebung wird auch der konkrete Ort abgestimmt. Plane die Zeit zwischen den Terminen mit ein, damit die Aufgabe in deiner Woche Platz findet."
      ],
      "links": [
        {
          "label": "Geigenunterricht für Erwachsene",
          "href": "/unterricht/geigenunterricht-erwachsene/"
        },
        {
          "label": "Bratschenunterricht für Erwachsene",
          "href": "/unterricht/bratschenunterricht-erwachsene/"
        }
      ]
    },
    {
      "title": "Eine einfache Wiedereinstiegsnotiz mitbringen",
      "body": [
        "Vorlage: Früheres Instrument und Unterricht: … · letzter aktiver Zeitraum: … · vorhandene Noten und Instrument: … · Musik, die ich wieder spielen möchte: … · mögliche Termine und Übezeiten: … · offene Fragen: …",
        "Die Notiz dient der Orientierung. Sie ist kein Versprechen, in einer festen Anzahl von Wochen den früheren Stand zu erreichen. Nach dem ersten Termin entscheiden wir gemeinsam, ob Unterricht und Rahmen für beide Seiten passen."
      ],
      "links": [
        {
          "label": "Kostenlose Probestunde vorbereiten",
          "href": "/ratgeber/geigen-probestunde/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Muss ich nach Jahren Pause von vorn anfangen?",
      "answer": "Das wird anhand deiner vorhandenen Kenntnisse und Spielpraxis eingeschätzt. Verschiedene Bereiche können unterschiedliche Aufmerksamkeit brauchen."
    },
    {
      "question": "Soll ich mein altes Instrument sofort ersetzen?",
      "answer": "Lass Zustand und Eignung fachlich prüfen, bevor du dich für Reparatur, Miete oder Neukauf entscheidest."
    },
    {
      "question": "Brauche ich ein vorbereitetes Vorspiel?",
      "answer": "Für die erste Anfrage nicht. Vorhandene Noten und ein vertrautes Stück können helfen; die konkrete Vorbereitung wird persönlich vereinbart."
    },
    {
      "question": "Wie schnell erreiche ich meinen früheren Stand?",
      "answer": "Dafür gibt es keine pauschale Zusage. Ausgangspunkt, Lernziel und verfügbare Übezeit bestimmen den individuellen Weg."
    }
  ],
  "internalLinks": [
    {
      "label": "Unterricht kennenlernen",
      "href": "/unterricht/"
    },
    {
      "label": "Üben im Alltag planen",
      "href": "/ratgeber/geige-bratsche-ueben-alltag/"
    }
  ],
  "nextStep": {
    "label": "Probestunde anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "musik-kirchliche-trauung-planen",
  "title": "Kirchliche Trauungsmusik gemeinsam planen",
  "shortTitle": "Kirchliche Trauungsmusik gemeinsam planen",
  "seoTitle": "Kirchliche Trauungsmusik gemeinsam planen",
  "seoDescription": "Kirchenmusik, Solo-Viola und Gemeindegesang abstimmen: Fragen an die Gemeinde und eine Vorlage für Stücke, Zuständigkeiten und Startsignale.",
  "intent": "Kirchenmusik, Solo-Viola und Gemeindegesang abstimmen: Fragen an die Gemeinde und eine Vorlage für Stücke, Zuständigkeiten und Startsignale.",
  "cluster": "Hochzeit",
  "serviceSlug": "hochzeiten",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Hochzeit",
  "lead": "Kirchenmusik, Solo-Viola und Gemeindegesang abstimmen: Fragen an die Gemeinde und eine Vorlage für Stücke, Zuständigkeiten und Startsignale.",
  "summary": "Kirchenmusik, Solo-Viola und Gemeindegesang abstimmen: Fragen an die Gemeinde und eine Vorlage für Stücke, Zuständigkeiten und Startsignale.",
  "keyPoints": [
    "Den Ablauf der eigenen Gemeinde als Grundlage nehmen",
    "Gemeindegesang und Solo-Stücke getrennt aufführen",
    "Wunschstück, Position und Signal mit den Beteiligten klären"
  ],
  "sections": [
    {
      "title": "Den Ablauf der eigenen Gemeinde als Grundlage nehmen",
      "body": [
        "Fragt nach dem Ablauf eurer Trauung und den möglichen Musikstellen. Ein Wortgottesdienst und eine Trauung innerhalb einer Messe können verschiedene Beiträge vorsehen. Die konkrete Gemeinde klärt den Rahmen.",
        "Die Kirchenmusik Kaarst empfiehlt, den Organisten bereits beim Beginn der Planung einzubeziehen. Das ist eine hilfreiche Orientierung, aber keine allgemeine Zusage zu bestimmten Stücken in jeder Kirche. Nehmt den zuständigen Kontakt eurer Traukirche in die Abstimmung auf."
      ],
      "links": [
        {
          "label": "Hinweise der Kirchenmusik Kaarst",
          "href": "https://gemeinden.erzbistum-koeln.de/kirchenmusik_kaarst/Hochzeit/index.html"
        }
      ]
    },
    {
      "title": "Gemeindegesang und Solo-Stücke getrennt aufführen",
      "body": [
        "Beim Gemeindegesang brauchen Gäste eine singbare Auswahl und passende Begleitung. Ein instrumentales Solo-Stück gibt dagegen Raum zum Zuhören. Notiert, wer welchen Beitrag übernimmt: Kirchenmusik, Chor, Gesang oder Viola.",
        "Eine gemeinsame Besetzung muss musikalisch und organisatorisch vorbereitet werden. Noten, Tonart und mögliche Probe werden gesondert vereinbart. Bucht ein Solo-Instrument deshalb nicht automatisch als vollständigen Ersatz für alle musikalischen Aufgaben des Gottesdienstes."
      ],
      "links": []
    },
    {
      "title": "Wunschstück, Position und Signal mit den Beteiligten klären",
      "body": [
        "Nennt persönliche Stückwünsche und die gewünschte Stelle. Die Gemeinde prüft den gottesdienstlichen Rahmen; Kim prüft die Viola-Fassung. Ein Werk kann für einen eigenen Hörmoment passen und für eine andere Stelle ungeeignet sein.",
        "Besprecht außerdem den Spielplatz, die Sicht zur leitenden Person und das Ende des Stücks. Beim Einzug zählen Weg und Reihenfolge, beim Auszug der Abschluss der Zeremonie. Dazwischen müssen Worte und gemeinsame Lieder verständlich bleiben."
      ],
      "links": [
        {
          "label": "Einzug vorbereiten",
          "href": "/hochzeiten/musik-brauteinzug/"
        },
        {
          "label": "Auszug planen",
          "href": "/hochzeiten/musik-auszug/"
        }
      ]
    },
    {
      "title": "Eine gemeinsame Einsatzliste zum Kopieren nutzen",
      "body": [
        "Vorlage je Beitrag: Ablaufstelle: … · Stück und Fassung: … · zuständige Musiker:innen: … · Startsignal von: … · gewünschtes Ende oder Dauer: … · Zustimmung der Gemeinde: … · noch offene Frage: …",
        "Fügt Datum, Kirche, Uhrzeit und den Kontakt zur Kirchenmusik hinzu. Ein anschließender Empfang erhält einen eigenen Abschnitt mit Spielort und Zeitfenster. Die bestätigte Liste wird vor dem Hochzeitstag mit allen musikalisch Beteiligten abgestimmt."
      ],
      "links": [
        {
          "label": "Kirchliche Trauung mit Viola anfragen",
          "href": "/hochzeiten/musik-kirchliche-trauung/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Wer muss an der Musikplanung beteiligt werden?",
      "answer": "Das Paar, die zuständige Gemeinde und Kirchenmusik sowie die gebuchten Musiker:innen. Für jeden Beitrag sollte eine zuständige Person klar sein."
    },
    {
      "question": "Darf unser Lieblingslied in der Kirche gespielt werden?",
      "answer": "Die Gemeinde klärt den gottesdienstlichen Rahmen. Zusätzlich wird die geeignete Viola-Fassung und notwendige Vorbereitung geprüft."
    },
    {
      "question": "Übernimmt Solo-Viola den gesamten Gemeindegesang?",
      "answer": "Das ist keine automatische Leistung. Gemeinsame Begleitung braucht passende Noten, Tonart, Beteiligte und eine eigene Vereinbarung."
    },
    {
      "question": "Brauchen wir für jeden Einsatz ein Signal?",
      "answer": "Eine eindeutig vereinbarte Stelle oder zuständige Person hilft. Vor allem Einzug und Ende der Zeremonie sollten musikalisch klar abgestimmt sein."
    }
  ],
  "internalLinks": [
    {
      "label": "Hochzeitsmusik kennenlernen",
      "href": "/hochzeiten/"
    },
    {
      "label": "Kosten und Leistungsumfang",
      "href": "/ratgeber/hochzeitsmusik-kosten/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "live-musik-firmenevent-kosten",
  "title": "Live-Musik beim Firmenevent: Kosten klären",
  "shortTitle": "Live-Musik beim Firmenevent: Kosten klären",
  "seoTitle": "Live-Musik beim Firmenevent: Kosten klären",
  "seoDescription": "Kostenfaktoren für Live-Viola beim Firmenevent: Musikaufgabe, Zeitplan, Aufbau, Technik und Ortswechsel mit einer Briefingvorlage abstimmen.",
  "intent": "Kostenfaktoren für Live-Viola beim Firmenevent: Musikaufgabe, Zeitplan, Aufbau, Technik und Ortswechsel mit einer Briefingvorlage abstimmen.",
  "cluster": "Firmenevent",
  "serviceSlug": "firmenfeiern",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Firmenevent",
  "lead": "Kostenfaktoren für Live-Viola beim Firmenevent: Musikaufgabe, Zeitplan, Aufbau, Technik und Ortswechsel mit einer Briefingvorlage abstimmen.",
  "summary": "Kostenfaktoren für Live-Viola beim Firmenevent: Musikaufgabe, Zeitplan, Aufbau, Technik und Ortswechsel mit einer Briefingvorlage abstimmen.",
  "keyPoints": [
    "Musikaufgabe und Zeitraum unterscheiden",
    "Zugang, Aufbau und Technik früh klären",
    "Repertoire und gewünschte Besetzung im Umfang festhalten"
  ],
  "sections": [
    {
      "title": "Musikaufgabe und Zeitraum unterscheiden",
      "body": [
        "Ein Empfang, mehrere Dinner-Spielphasen und ein eigener Bühnenmoment sind verschiedene Umfänge. Nennt die Aufgabe der Musik und den Zeitraum, in dem sie gebraucht wird. Auch Pausen zwischen Reden oder Menüphasen gehören in den Ablauf.",
        "Wenn mehrere Orte oder Räume beteiligt sind, führt sie getrennt auf. Ein längerer Zeitraum vor Ort besteht nicht nur aus hörbarer Spielzeit. Vorbereitung, Bereitschaft zwischen Einsätzen und mögliche Wechsel müssen im Angebot nachvollziehbar sein."
      ],
      "links": []
    },
    {
      "title": "Zugang, Aufbau und Technik früh klären",
      "body": [
        "Für die Location helfen genaue Adresse, Aufbauzugang, Park- oder Haltemöglichkeit, Etage und Kontaktperson. Bei Messen kommen Akkreditierung und Veranstaltervorgaben hinzu. Diese Angaben beeinflussen, welcher Rahmen zuverlässig geplant werden kann.",
        "Raumgröße, Gästeverteilung und Umgebung bestimmen, ob Solo-Viola akustisch geeignet ist oder Technik abgestimmt werden muss. Eine große Anlage, ein eigener Techniker oder zusätzliche Musiker:innen sind keine automatisch enthaltenen Leistungen."
      ],
      "links": [
        {
          "label": "Musik rund um die Messe",
          "href": "/firmenfeiern/musik-messe/"
        }
      ]
    },
    {
      "title": "Repertoire und gewünschte Besetzung im Umfang festhalten",
      "body": [
        "Vorhandenes Repertoire ist ohne Aufpreis möglich. Ein neu einzurichtendes Wunschstück wird auf Noten, Solo-Fassung und Vorbereitungszeit geprüft. Eine größere Besetzung braucht passende Kolleg:innen und bestätigte Verfügbarkeit.",
        "Der Preis wird individuell für den Termin und den vereinbarten Leistungsumfang kalkuliert. Vergleicht Angebote anhand desselben Briefings: Spielphasen, Pausen, Anfahrt, Vorbereitung, Technik und Konditionen für Änderungen sollten erkennbar sein."
      ],
      "links": []
    },
    {
      "title": "Briefingvorlage für Office- und Eventteams",
      "body": [
        "Zum Kopieren: Unternehmen und Anlass: … · Datum: … · Location und Räume: … · Gästezahl: … · Musikaufgabe: … · Spielphasen und Reden: … · Aufbauzugang: … · Technik vor Ort: … · Ortswechsel: … · Wunschstücke: … · Ansprechpartner:in und Rechnungsdaten: …",
        "Markiert bestätigte Angaben und offene Fragen. Ein vorhandener Budgetrahmen kann helfen, passende Optionen zu prüfen. Die erste Anfrage ist kostenlos und unverbindlich; verbindliche Konditionen entstehen aus der persönlichen Abstimmung."
      ],
      "links": [
        {
          "label": "Briefing an Kim weitergeben",
          "href": "/fuer-eventplaner/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Gibt es einen festen Stundenpreis?",
      "answer": "Hier wird keine allgemeine Pauschale behauptet. Termin, Aufgabe, Vorbereitung und Zeit vor Ort ergeben das individuelle Angebot."
    },
    {
      "question": "Was zählt bei mehreren Spielphasen?",
      "answer": "Der vereinbarte Zeitraum, Spielphasen, Pausen und mögliche Wechsel werden gemeinsam betrachtet. Das Angebot soll den gesamten Rahmen verständlich abbilden."
    },
    {
      "question": "Ist Technik enthalten?",
      "answer": "Notwendige Technik und Zuständigkeiten werden vor der Buchung abgestimmt. Eine große Beschallung wird nicht automatisch zugesagt."
    },
    {
      "question": "Können wir zuerst einen Budgetrahmen nennen?",
      "answer": "Ja. Gebt dazu Datum, Location, Musikaufgabe und Zeitplan an, damit passende Möglichkeiten geprüft werden können."
    }
  ],
  "internalLinks": [
    {
      "label": "Live-Musik für Firmenfeiern",
      "href": "/firmenfeiern/"
    },
    {
      "label": "Empfangsmusik",
      "href": "/firmenfeiern/empfangsmusik-firmenevent/"
    },
    {
      "label": "Dinnermusik",
      "href": "/firmenfeiern/dinnermusik-firmenevent/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "live-musik-gartenfest-planen",
  "title": "Live-Musik beim Gartenfest planen",
  "shortTitle": "Live-Musik beim Gartenfest planen",
  "seoTitle": "Live-Musik beim Gartenfest planen",
  "seoDescription": "Gästeverteilung, Spielplatz, Wetterschutz und Ersatzraum für Live-Viola im Garten prüfen. Eine Briefingvorlage hilft Gastgeber:innen.",
  "intent": "Gästeverteilung, Spielplatz, Wetterschutz und Ersatzraum für Live-Viola im Garten prüfen. Eine Briefingvorlage hilft Gastgeber:innen.",
  "cluster": "Geburtstag",
  "serviceSlug": "geburtstage",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Geburtstag",
  "lead": "Gästeverteilung, Spielplatz, Wetterschutz und Ersatzraum für Live-Viola im Garten prüfen. Eine Briefingvorlage hilft Gastgeber:innen.",
  "summary": "Gästeverteilung, Spielplatz, Wetterschutz und Ersatzraum für Live-Viola im Garten prüfen. Eine Briefingvorlage hilft Gastgeber:innen.",
  "keyPoints": [
    "Die Musikaufgabe und den Hörbereich festlegen",
    "Einen trockenen Schattenplatz auswählen",
    "Den Plan B als tatsächlich nutzbaren Ort prüfen"
  ],
  "sections": [
    {
      "title": "Die Musikaufgabe und den Hörbereich festlegen",
      "body": [
        "Soll Musik das Ankommen begleiten oder versammelt sich die Runde zu einem persönlichen Stück? Nennt Gästezahl und die Bereiche, in denen Menschen stehen oder sitzen. Ein einzelner akustischer Spielort erreicht nicht automatisch den ganzen Garten.",
        "Bei einem eigenen Hörmoment kann eine kurze Ankündigung helfen. Für Begleitung neben Gesprächen prüfen wir Position und Umgebungslärm. Musik steht weder im Serviceweg noch direkt zwischen den wichtigsten Gesprächsgruppen."
      ]
    },
    {
      "title": "Einen trockenen Schattenplatz auswählen",
      "body": [
        "Die Viola ist ein empfindliches Instrument und braucht geeignete Bedingungen. Prüft trockenen Schutz, Schatten im geplanten Zeitfenster, sicheren Untergrund und Wind. Ein Platz, der morgens geschützt aussieht, kann beim späteren Musikblock in direkter Sonne liegen.",
        "Plant Zugang und Transportweg sowie ausreichend freien Raum für Instrument und Musikerin. Gastgeber:innen klären die örtlichen Vorgaben zu Lautstärke und Zeiten und sprechen bei Bedarf mit Location oder Nachbarschaft."
      ]
    },
    {
      "title": "Den Plan B als tatsächlich nutzbaren Ort prüfen",
      "body": [
        "Ein möglicher Ersatzraum muss erreichbar, verfügbar und für die Gäste geeignet sein. Klärt, wer bei einer Wetteränderung entscheidet und wie viel Zeit für den Wechsel gebraucht wird. Eine bloße Idee für später schützt das Instrument noch nicht.",
        "Stimmen Standort oder Wetter nicht, wird Außenmusik nicht pauschal zugesagt. Die passende Alternative gehört in die persönliche Absprache. Auch eine Änderung des Zeitplans kann den vereinbarten Spielumfang betreffen."
      ],
      "links": [
        {
          "label": "Musik beim Gartenfest anfragen",
          "href": "/geburtstage/musik-gartenfest/"
        }
      ]
    },
    {
      "title": "Briefingvorlage für Gastgeber:innen",
      "body": [
        "Zum Kopieren: Datum und Adresse: … · Gästezahl und Bereiche: … · Musikaufgabe: … · Spielphasen: … · Reden oder Geschenke: … · geschützter Standort: … · Ersatzraum: … · Zugang: … · Entscheidung und Signal durch: … · Wunschstücke: …",
        "Kennzeichnet offene Punkte vor der Anfrage. Ein Gartenfest nach Taufe oder Willkommensfest kann ebenfalls einen eigenen Musikabschnitt bekommen. Zeitpunkt, Vorbereitung und Wege werden für diesen Anlass vereinbart."
      ],
      "links": [
        {
          "label": "Musik nach der Taufe",
          "href": "/taufen/musik-familienfeier-taufe/"
        },
        {
          "label": "Segnung oder freies Willkommensfest",
          "href": "/taufen/musik-segnung/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Reicht ein Sonnenschirm als Plan B?",
      "answer": "Der konkrete Schutz muss Trockenheit, Schatten, Wind und sicheren Stand gewährleisten. Eine geeignete Alternative wird persönlich geprüft; ein beliebiger Schirm ist keine pauschale Zusage."
    },
    {
      "question": "Kann bei Regen einfach weitergespielt werden?",
      "answer": "Die Viola braucht trockenen Schutz und geeignete Bedingungen. Ein nutzbarer Ersatzort wird vorab abgestimmt."
    },
    {
      "question": "Wie verteilen wir Musik und Gespräche?",
      "answer": "Beschreibt Gästezahl und Gartenbereiche. Ein eigener Hörmoment kann die Runde sammeln; Begleitmusik braucht eine passende Position und Lautstärke."
    },
    {
      "question": "Wer entscheidet über den Standortwechsel?",
      "answer": "Vorher wird eine zuständige Person benannt. Sie stimmt Wetter, Wechselzeit und den weiteren Ablauf mit Kim ab."
    }
  ],
  "internalLinks": [
    {
      "label": "Geburtstagsmusik kennenlernen",
      "href": "/geburtstage/"
    },
    {
      "label": "Hörproben",
      "href": "/portfolio/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
},
{
  "slug": "solo-viola-oder-ensemble",
  "title": "Solo-Viola oder Ensemble: Welche Besetzung passt?",
  "shortTitle": "Solo-Viola oder Ensemble: Welche Besetzung passt?",
  "seoTitle": "Solo-Viola oder Ensemble: Welche Besetzung passt?",
  "seoDescription": "Soloklang, Raum und musikalische Aufgabe vergleichen. Duo oder Ensemble werden mit geeigneten Kolleg:innen und bestätigter Verfügbarkeit vereinbart.",
  "intent": "Soloklang, Raum und musikalische Aufgabe vergleichen. Duo oder Ensemble werden mit geeigneten Kolleg:innen und bestätigter Verfügbarkeit vereinbart.",
  "cluster": "Hochzeit",
  "serviceSlug": "hochzeiten",
  "heroImage": "/uploads/_DSC7270.webp",
  "heroImageAlt": "Kim Marie Borger steht mit ihrer Viola am See",
  "kicker": "Hochzeit",
  "lead": "Soloklang, Raum und musikalische Aufgabe vergleichen. Duo oder Ensemble werden mit geeigneten Kolleg:innen und bestätigter Verfügbarkeit vereinbart.",
  "summary": "Soloklang, Raum und musikalische Aufgabe vergleichen. Duo oder Ensemble werden mit geeigneten Kolleg:innen und bestätigter Verfügbarkeit vereinbart.",
  "keyPoints": [
    "Den Soloklang zuerst in den Hörproben kennenlernen",
    "Raum und Musikaufgabe gemeinsam betrachten",
    "Weitere Besetzung ausdrücklich vereinbaren"
  ],
  "sections": [
    {
      "title": "Den Soloklang zuerst in den Hörproben kennenlernen",
      "body": [
        "Eine einzelne Viola trägt eine melodische Linie mit einer eigenen Klangfarbe. Die vorhandenen Aufnahmen geben euch einen Eindruck davon. Ein bekanntes Lied mit Gesang, Schlagzeug oder großem Arrangement klingt als Solofassung anders.",
        "Nennt deshalb nicht nur den Songtitel, sondern auch die Wirkung, die euch wichtig ist. Manche Wünsche passen zu einer klaren Melodie, andere brauchen harmonische Begleitung oder weitere Stimmen. Die konkrete Fassung wird vor der Zusage geprüft."
      ],
      "links": [
        {
          "label": "Fünf veröffentlichte Hörproben",
          "href": "/portfolio/"
        }
      ]
    },
    {
      "title": "Raum und Musikaufgabe gemeinsam betrachten",
      "body": [
        "Ein einzelner Trauungsmoment, dezente Begleitung beim Empfang und ein angekündigtes Konzertstück brauchen verschiedene Hörsituationen. Kleine ruhige Räume können für akustische Solo-Musik geeignet sein; große oder laute Bereiche werden gesondert geprüft.",
        "Mehr Musiker:innen lösen nicht automatisch jedes Raumproblem. Position, Gästeverteilung und Technik müssen zum Format passen. Gebt an, ob Gespräche weiterlaufen oder alle Gäste zuhören sollen."
      ]
    },
    {
      "title": "Weitere Besetzung ausdrücklich vereinbaren",
      "body": [
        "Ein Duo oder kleines Ensemble kann für einen bestimmten Wunsch geprüft werden. Dafür braucht es passende Kolleg:innen, verfügbare Termine, geeignete Noten und abgestimmte Vorbereitung. Eine in einer Rezension genannte frühere Zusammenarbeit ist keine Zusage für dieselbe Besetzung bei jedem Termin.",
        "Das Angebot nennt den vereinbarten Umfang und die Besetzung. Weitere Musiker:innen, gemeinsame Vorbereitung und gegebenenfalls Technik werden vor der Buchung besprochen. Solo-Viola bleibt der Ausgangspunkt der Anfrage."
      ],
      "links": [
        {
          "label": "Echte Kundenstimmen",
          "href": "/kundenstimmen/"
        }
      ]
    },
    {
      "title": "Die passenden Angaben für die Besetzungsfrage senden",
      "body": [
        "Vorlage: Anlass: … · Datum und Location: … · Raum und Gästezahl: … · Musik zum Zuhören oder neben Gesprächen: … · gewünschte Stücke: … · vorhandene Technik: … · Zeitfenster: … · gewünschte Besetzung: …",
        "Mit diesen Angaben kann Kim musikalische Möglichkeiten und Verfügbarkeit prüfen. Ihr müsst nicht vorher selbst Instrumente zusammenstellen. Wichtig ist, dass der tatsächliche Klang und der geplante Einsatz zu eurem Anlass passen."
      ],
      "links": [
        {
          "label": "Hochzeitsmusik buchen",
          "href": "/hochzeiten/hochzeitsmusik-buchen/"
        },
        {
          "label": "Briefing für Eventteams",
          "href": "/fuer-eventplaner/"
        }
      ]
    }
  ],
  "faqs": [
    {
      "question": "Kann die Viola eine Trauung allein begleiten?",
      "answer": "Solo-Viola kann vereinbarte instrumentale Momente übernehmen. Die konkrete Fassung, Einsatzstelle und Raumsituation werden geprüft."
    },
    {
      "question": "Ist Duo oder Ensemble immer verfügbar?",
      "answer": "Nein. Passende Kolleg:innen, Termin und Vorbereitung müssen bestätigt sein. Eine zusätzliche Besetzung wird ausdrücklich vereinbart."
    },
    {
      "question": "Braucht ein großer Raum automatisch mehr Musiker:innen?",
      "answer": "Besetzung und Raumwirkung hängen auch von Position, Umgebung und Technik ab. Der konkrete Rahmen wird geprüft."
    },
    {
      "question": "Können wir zunächst nur ein Lied nennen?",
      "answer": "Ja. Titel, Interpret:in und gewünschter Einsatz helfen bei der Prüfung, ob Solo-Viola oder eine andere Besetzung sinnvoll ist."
    }
  ],
  "internalLinks": [
    {
      "label": "Hochzeitsmusik",
      "href": "/hochzeiten/"
    },
    {
      "label": "Firmenevents",
      "href": "/firmenfeiern/"
    },
    {
      "label": "Salonkonzert",
      "href": "/konzerte/musik-salonkonzert/"
    }
  ],
  "nextStep": {
    "label": "Termin und Ablauf anfragen",
    "href": "/anfragen/"
  }
}
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
					'Ratgeber zur Musikplanung für Hochzeit, Taufe, Trauerfeier, Geburtstag und Firmenevent sowie zum Geigen- und Bratschenunterricht.',
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
