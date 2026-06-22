import {
	breadcrumbListNode,
	coreServiceId,
	coreServiceNode,
	faqPageId,
	graphJsonLd,
	nodeRef,
	pageUrl,
	personId,
	schemaId,
	webPageId,
	webPageNode,
} from './schema';
import { canonicalUrl } from './url';

export interface RatgeberLink {
	label: string;
	href: string;
	note?: string;
}

export interface RatgeberSection {
	title: string;
	body: string[];
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
	cluster: 'Hochzeit' | 'Trauerfeier' | 'Unterricht';
	serviceSlug: 'hochzeiten' | 'beerdigungen' | 'unterricht';
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
		title: 'Musik zur Trauung planen',
		shortTitle: 'Musik zur Trauung',
		seoTitle: 'Musik zur Trauung planen | Ablauf, Stücke & Live-Viola',
		seoDescription:
			'Ratgeber zur Musik bei der Trauung: Einzug, Ringtausch, Ja-Wort, Unterschrift und Auszug sinnvoll mit Live-Viola planen.',
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
		title: 'Musik im Standesamt',
		shortTitle: 'Musik im Standesamt',
		seoTitle: 'Musik im Standesamt | Live-Musik zur Trauung planen',
		seoDescription:
			'Was bei Musik im Standesamt wichtig ist: kurze Abläufe, passende Stücke, Abstimmung mit dem Standesamt und Live-Viola ohne großen Aufbau.',
		intent: 'Paare möchten wissen, ob und wie Live-Musik im Standesamt organisatorisch funktioniert.',
		cluster: 'Hochzeit',
		serviceSlug: 'hochzeiten',
		heroImage: '/uploads/mq0uvv7v-20250327-DSC01550.webp',
		heroImageAlt: 'Kim Marie Borger spielt Viola im Abendlicht',
		kicker: 'Standesamt',
		lead:
			'Standesamtliche Trauungen sind oft kurz. Gerade deshalb kann ein einzelnes live gespieltes Stück den Raum sofort persönlicher und festlicher machen.',
		summary:
			'Für Paare, die eine schlichte standesamtliche Trauung musikalisch aufwerten möchten, ohne den Ablauf zu überladen.',
		keyPoints: [
			'Vorher klären, ob und wann Live-Musik im Raum erlaubt ist.',
			'Ein bis drei kurze Stücke sind meist ausreichend.',
			'Solo-Viola braucht wenig Platz und keinen großen technischen Aufbau.',
		],
		sections: [
			{
				title: 'Was ist im Standesamt realistisch?',
				body: [
					'Viele Standesämter erlauben Live-Musik, wenn sie kurz und gut abgestimmt ist. Wichtig sind Raum, Zeitfenster, Zugang und die Frage, ob Musik vor, während oder nach der offiziellen Trauung möglich ist.',
					'Eine Solo-Viola ist organisatorisch unaufwendig: ein Platz, ein Stuhl und ein klarer Ablauf reichen in vielen Situationen aus.',
				],
			},
			{
				title: 'Welche Stellen eignen sich?',
				body: [
					'Der Einzug, die Unterschrift und der Auszug sind die häufigsten Einsatzpunkte. Wenn die Trauung sehr kurz ist, reicht ein Stück zum Einzug oder ein persönliches Lied nach dem Ja-Wort.',
					'Die Stücke sollten nicht zu lang geplant werden. Besser ist eine klare Fassung, die bei Bedarf natürlich enden kann.',
				],
			},
			{
				title: 'Was sollte vorab geklärt werden?',
				body: [
					'Fragt beim Standesamt nach Dauer, erlaubten Musikmomenten und Ankunftszeit. Auch die Raumakustik und der Platz für die Musikerin sind relevant.',
					'Wenn danach ein Sektempfang oder Fototermin folgt, kann die Musik dort weitergeführt werden. So entsteht ein ruhiger Übergang vom offiziellen Teil in den gemeinsamen Tag.',
				],
			},
		],
		internalLinks: [
			{ label: 'Musik Standesamt Hochzeit', href: '/hochzeiten/musik-standesamt/', note: 'passende Themenseite' },
			{ label: 'Hochzeitsmusik', href: '/hochzeiten/' },
			{ label: 'Musik zur Unterschrift', href: '/hochzeiten/musik-unterschrift-standesamt/' },
			{ label: 'Musik zum Auszug', href: '/hochzeiten/musik-auszug/' },
		],
		nextStep: { label: 'Termin im Standesamt anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Ist Live-Musik im Standesamt erlaubt?',
				answer:
					'Das entscheidet das jeweilige Standesamt. In vielen Fällen ist es möglich, wenn Dauer und Ablauf vorher abgestimmt werden.',
			},
			{
				question: 'Wie viele Stücke braucht eine standesamtliche Trauung?',
				answer:
					'Oft reichen ein bis drei Stücke: Einzug, Unterschrift und Auszug. Bei sehr kurzen Terminen kann auch ein einzelnes Wunschlied genügen.',
			},
			{
				question: 'Braucht Solo-Viola Technik im Standesamt?',
				answer:
					'In kleinen bis mittleren Räumen meist nicht. Bei größeren Sälen kann die Akustik vorab eingeschätzt werden.',
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
		title: 'Trauermusik-Repertoire auswählen',
		shortTitle: 'Trauermusik Repertoire',
		seoTitle: 'Trauermusik Repertoire | Stücke für Beerdigung',
		seoDescription:
			'Orientierung für Trauermusik-Repertoire: klassische Stücke, Ave Maria, Amazing Grace, Lieblingslieder und ruhige Instrumentalmusik.',
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
		title: 'Musik zur Trauerfeier planen',
		shortTitle: 'Musik zur Trauerfeier',
		seoTitle: 'Musik zur Trauerfeier | Ablauf & Stückauswahl',
		seoDescription:
			'Ratgeber zur Musik bei der Trauerfeier: Ablauf, Stückauswahl, Abstimmung mit Bestattungshaus, Kirche oder Trauerredner:in.',
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
		title: 'Bratschenunterricht für Erwachsene',
		shortTitle: 'Bratsche lernen',
		seoTitle: 'Bratschenunterricht für Erwachsene | Bratsche lernen',
		seoDescription:
			'Bratsche lernen als Erwachsene:r: Einstieg, Üben, Instrument, Unterrichtsrhythmus und realistische Ziele im Bratschenunterricht.',
		intent: 'Erwachsene überlegen, ob sie Bratsche lernen können und wie der Einstieg realistisch gelingt.',
		cluster: 'Unterricht',
		serviceSlug: 'unterricht',
		heroImage: '/uploads/mq0uz91n-violin-6635935_1280.webp',
		heroImageAlt: 'Nahaufnahme eines Streichinstruments',
		kicker: 'Unterricht',
		lead:
			'Bratsche lernen ist auch als Erwachsene:r möglich. Wichtig sind ein ruhiger Einstieg, ein passendes Instrument und Ziele, die zum Alltag passen.',
		summary:
			'Für Erwachsene, die mit Bratsche oder Viola beginnen, wieder einsteigen oder vom Geigenunterricht wechseln möchten.',
		keyPoints: [
			'Der Anfang braucht Geduld mit Haltung, Bogen und Klang.',
			'Kurze regelmäßige Übezeiten sind wirksamer als seltene lange Einheiten.',
			'Eine Probestunde hilft, Instrument, Ziele und Unterrichtsrhythmus zu klären.',
		],
		sections: [
			{
				title: 'Ist Bratsche als Erwachsener realistisch?',
				body: [
					'Ja, wenn der Einstieg sinnvoll aufgebaut wird. Erwachsene bringen oft ein gutes Verständnis für Musik, Motivation und klare Ziele mit. Gleichzeitig braucht das Instrument Geduld, weil Klang, Intonation und Haltung Zeit brauchen.',
					'Der Unterricht sollte nicht wie ein starres Kinderprogramm funktionieren. Sinnvoller ist ein Aufbau, der Körpergefühl, Hörtraining und musikalische Interessen verbindet.',
				],
			},
			{
				title: 'Was braucht man für den Start?',
				body: [
					'Zu Beginn müssen Instrumentengröße, Bogen, Schulterstütze und Haltung passen. Gerade bei Bratsche ist die körperliche Balance wichtig, weil das Instrument größer ist als eine Geige.',
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
			{ label: 'Bratschenunterricht', href: '/unterricht/' },
			{ label: 'Bratschenunterricht Erwachsene', href: '/unterricht/bratschenunterricht-erwachsene/' },
			{ label: 'Bratsche lernen', href: '/unterricht/bratsche-lernen/' },
			{ label: 'Viola Unterricht', href: '/unterricht/viola-unterricht/' },
		],
		nextStep: { label: 'Probestunde anfragen', href: '/anfragen/' },
		faqs: [
			{
				question: 'Kann man als Erwachsene:r noch Bratsche lernen?',
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
					'Ruhige Wissensseiten zur musikalischen Planung von Hochzeit, Trauerfeier und Bratschenunterricht.',
				url,
				inLanguage: 'de',
				mainEntity: {
					'@type': 'ItemList',
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
	const serviceUrl = canonicalUrl(site, `/${page.serviceSlug}/`).href;

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
			{
				'@type': 'Service',
				'@id': `${serviceUrl}#service`,
				name: page.cluster,
				url: serviceUrl,
				provider: { '@id': new URL('/#person', site).href },
				inLanguage: 'de',
			},
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
