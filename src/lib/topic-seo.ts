import type { CmsPage } from './data';
import type { LocalServiceSlug } from './local-seo';
import { canonicalUrl } from './url';

type PageData = NonNullable<CmsPage>;
type AnyBlock = Record<string, any>;

interface TopicItem {
	kicker: string;
	title: string;
	text: string;
	piece?: string;
}

interface TopicFaq {
	question: string;
	answer: string;
	open?: boolean;
}

export interface TopicSeoPage {
	serviceSlug: LocalServiceSlug;
	baseSlug: string;
	slug: string;
	label: string;
	linkLabel: string;
	keyword: string;
	intentCluster: string;
	priority: 'P1' | 'P2' | 'P3';
	volume: number;
	seoTitle: string;
	seoDescription: string;
	eyebrow: string;
	heroTitle: string;
	heroLead: string;
	badge?: string;
	splitTitle: string;
	splitLede: string;
	paragraphs: string[];
	focusEyebrow: string;
	focusTitle: string;
	focusLead: string;
	items: TopicItem[];
	faqs: TopicFaq[];
}

export const TOPIC_SEO_PAGES: TopicSeoPage[] = [
	{
		serviceSlug: 'beerdigungen',
		baseSlug: 'beerdigungen',
		slug: 'trauermusik-repertoire',
		label: 'Trauermusik Repertoire',
		linkLabel: 'Trauermusik Repertoire',
		keyword: 'klassische Musik Beerdigung',
		intentCluster: 'beerdigungen:trauermusik-repertoire',
		priority: 'P3',
		volume: 570,
		seoTitle: 'Trauermusik Repertoire | Musik für Beerdigung & Trauerfeier',
		seoDescription:
			'Trauermusik-Repertoire für Beerdigung und Trauerfeier: klassische Musik, Instrumentalmusik, Ave Maria, Amazing Grace und persönliche Stücke mit Viola.',
		eyebrow: 'Repertoire für den Abschied',
		heroTitle: 'Trauermusik-Repertoire für Beerdigung und Trauerfeier.',
		heroLead:
			'Klassische Musik, Instrumentalmusik und persönliche Wunschstücke für einen Abschied, der ruhig, würdevoll und nah bleibt.',
		splitTitle: 'Welche Musik trägt einen Abschied?',
		splitLede:
			'Bei einer Trauerfeier geht es nicht um ein Konzert, sondern um Halt. Ein einzelnes Instrument kann den Raum füllen, ohne zu drängen.',
		paragraphs: [
			'Passende Trauermusik entsteht aus Anlass, Ort und persönlicher Erinnerung: für den Beginn der Feier, eine stille Phase, den Auszug oder den Moment am Grab.',
			'Häufig gewünscht sind Ave Maria, Air, Amazing Grace, Meditation, ruhige klassische Stücke oder ein Lieblingslied, das behutsam für Viola eingerichtet wird.',
		],
		focusEyebrow: 'Stückauswahl',
		focusTitle: 'Vier Wege zur passenden Musik.',
		focusLead:
			'Die Auswahl bleibt überschaubar und wird vorab mit Familie, Bestattungshaus, Kirche oder Trauerredner:in abgestimmt.',
		items: [
			{
				kicker: 'Klassisch',
				title: 'Ruhige Klassiker',
				text: 'Stücke wie Ave Maria, Air oder Meditation schaffen einen vertrauten, würdevollen Rahmen.',
			},
			{
				kicker: 'Persönlich',
				title: 'Lieblingslied',
				text: 'Ein Lied aus dem Leben der verstorbenen Person kann für Viola arrangiert und sehr reduziert gespielt werden.',
			},
			{
				kicker: 'Still',
				title: 'Instrumentalmusik',
				text: 'Ohne Text bleibt Raum für eigene Gedanken, Gebet, Erinnerung und Abschied.',
			},
			{
				kicker: 'Ablauf',
				title: 'Einzug, Mitte, Auszug',
				text: 'Die Musik kann einzelne Momente rahmen oder die gesamte Trauerfeier sanft verbinden.',
			},
		],
		faqs: [
			{
				question: 'Welche Trauermusik passt zu einer Beerdigung?',
				answer:
					'Häufig passen ruhige klassische Stücke, Ave Maria, Amazing Grace, Air, Meditation oder ein persönliches Lieblingslied in einer schlichten Viola-Fassung.',
				open: true,
			},
			{
				question: 'Kann ein Lieblingslied gespielt werden?',
				answer:
					'Ja, wenn das Stück musikalisch für Viola geeignet ist. Ich prüfe es vorab und richte es behutsam für den Anlass ein.',
			},
			{
				question: 'Stimmst du dich mit dem Bestattungshaus ab?',
				answer:
					'Ja. Einsätze, Ankunft, Ablauf und Stückauswahl können direkt mit Bestattungshaus, Kirche oder Trauerredner:in geklärt werden.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-zur-trauung',
		label: 'Musik zur Trauung',
		linkLabel: 'Musik zur Trauung',
		keyword: 'Musik zur Trauung',
		intentCluster: 'hochzeiten:musik-zur-trauung',
		priority: 'P3',
		volume: 350,
		seoTitle: 'Musik zur Trauung | Live Musik für Hochzeit & Ja-Wort',
		seoDescription:
			'Musik zur Trauung mit Live-Viola: Einzug, Ringtausch, Ja-Wort, Unterschrift und Auszug stimmungsvoll begleiten lassen.',
		eyebrow: 'Trauungsmusik',
		heroTitle: 'Musik zur Trauung, die eure Momente verbindet.',
		heroLead:
			'Live-Viola für Einzug, Ja-Wort, Ringtausch, Unterschrift und Auszug - als roter Faden für eure Zeremonie.',
		badge: 'Wunschlied nach Absprache möglich',
		splitTitle: 'Die Trauung braucht musikalische Ruhepunkte.',
		splitLede:
			'Ob freie Trauung, Standesamt oder Kirche: Musik macht sichtbar, wann ein Moment beginnt, wann er gehalten wird und wann er sich lösen darf.',
		paragraphs: [
			'Gemeinsam legen wir fest, welche Stellen musikalisch begleitet werden: Einzug der Braut, Ringtausch, Ja-Wort, Unterschrift, Auszug oder ein besonderer Moment mit eurem Lieblingslied.',
			'Die Viola klingt warm, nah und elegant. Sie passt zu klassischen Stücken genauso wie zu modernen Songs, die für Solo-Viola eingerichtet werden.',
		],
		focusEyebrow: 'Ablauf',
		focusTitle: 'Typische Momente für Musik.',
		focusLead:
			'Die Trauungsmusik wird so geplant, dass sie den Ablauf trägt und niemand vor Ort improvisieren muss.',
		items: [
			{
				kicker: 'Beginn',
				title: 'Einzug',
				text: 'Ein ruhiges oder festliches Stück sammelt die Aufmerksamkeit und gibt dem Einzug Zeit.',
				piece: 'z. B. Canon in D',
			},
			{
				kicker: 'Versprechen',
				title: 'Ringtausch & Ja-Wort',
				text: 'Leise Musik kann einen stillen Moment rahmen, ohne Worte oder Blicke zu überdecken.',
				piece: 'z. B. Meditation',
			},
			{
				kicker: 'Formales',
				title: 'Unterschrift',
				text: 'Ein kurzes Stück füllt die organisatorische Phase und hält die Atmosphäre.',
			},
			{
				kicker: 'Jubel',
				title: 'Auszug',
				text: 'Helle, festliche Musik begleitet den ersten gemeinsamen Schritt nach der Trauung.',
				piece: 'z. B. Salut d’Amour',
			},
		],
		faqs: [
			{
				question: 'Welche Musik eignet sich zur Trauung?',
				answer:
					'Geeignet sind klassische Stücke, moderne Songs oder ein persönliches Lieblingslied. Wichtig ist, dass die Musik zum Ablauf und zur Stimmung der Zeremonie passt.',
				open: true,
			},
			{
				question: 'Kannst du Musik für Einzug, Ringtausch und Auszug spielen?',
				answer:
					'Ja. Diese Momente lassen sich sehr gut mit Solo-Viola begleiten und werden vorab exakt mit euch abgestimmt.',
			},
			{
				question: 'Passt Live-Viola auch zur freien Trauung?',
				answer:
					'Ja. Gerade freie Trauungen profitieren von Musik, die persönlich wirkt und trotzdem flexibel in den Ablauf passt.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-standesamt',
		label: 'Musik Standesamt',
		linkLabel: 'Musik Standesamt',
		keyword: 'Musik für standesamtliche Trauung',
		intentCluster: 'hochzeiten:musik-standesamt-hochzeit',
		priority: 'P3',
		volume: 260,
		seoTitle: 'Musik Standesamt Hochzeit | Live-Viola zur standesamtlichen Trauung',
		seoDescription:
			'Musik für die standesamtliche Trauung: Live-Viola für Einzug, Ringtausch, Unterschrift und Auszug im Standesamt.',
		eyebrow: 'Standesamtliche Trauung',
		heroTitle: 'Musik fürs Standesamt, schlicht und festlich.',
		heroLead:
			'Live-Viola für eine standesamtliche Trauung, die auch in kurzer Zeit persönlich, warm und feierlich klingt.',
		badge: 'Ideal für kurze Zeremonien',
		splitTitle: 'Kleine Zeremonie, großer Moment.',
		splitLede:
			'Im Standesamt ist oft wenig Zeit. Genau deshalb wirkt live gespielte Musik stark: Sie gibt dem Raum sofort Feierlichkeit.',
		paragraphs: [
			'Die Musik kann Einzug, Ringtausch, Unterschrift und Auszug begleiten. Auch ein einzelnes Lieblingslied reicht manchmal, um die Trauung unverwechselbar zu machen.',
			'Ich stimme Länge, Lautstärke, Aufbau und Einsätze vorab mit euch und bei Bedarf mit dem Standesamt ab.',
		],
		focusEyebrow: 'Kurz & präzise',
		focusTitle: 'So passt Musik in den Standesamt-Ablauf.',
		focusLead:
			'Die Stücke werden so gewählt, dass sie auch bei kurzen Zeitfenstern funktionieren.',
		items: [
			{ kicker: 'Ankommen', title: 'Vor Beginn', text: 'Ruhige Musik kann die Gäste empfangen und den Raum öffnen.' },
			{ kicker: 'Einzug', title: 'Der erste Moment', text: 'Ein festliches Stück macht den Eintritt bewusst und persönlich.' },
			{ kicker: 'Unterschrift', title: 'Formales begleiten', text: 'Die Musik hält die Stimmung, während Dokumente unterschrieben werden.' },
			{ kicker: 'Auszug', title: 'Leicht und hell', text: 'Zum Abschluss darf die Musik sichtbar feiern.' },
		],
		faqs: [
			{
				question: 'Ist Live-Musik im Standesamt möglich?',
				answer:
					'Meist ja. Wichtig ist, Dauer und Einsätze vorher mit dem Standesamt abzustimmen. Solo-Viola ist platzsparend und akustisch gut planbar.',
				open: true,
			},
			{
				question: 'Wie viele Stücke braucht man im Standesamt?',
				answer:
					'Oft reichen zwei bis vier kurze Stücke: Einzug, Unterschrift, Auszug und auf Wunsch ein persönliches Lied.',
			},
			{
				question: 'Kann ein moderner Song gespielt werden?',
				answer:
					'Ja, wenn er musikalisch passt und sich für Viola sinnvoll einrichten lässt.',
			},
		],
	},
	{
		serviceSlug: 'geburtstage',
		baseSlug: 'geburtstage',
		slug: 'private-feier',
		label: 'Musik private Feier',
		linkLabel: 'Musik private Feier',
		keyword: 'Musik für private Feier',
		intentCluster: 'geburtstage:private-feier',
		priority: 'P2',
		volume: 170,
		seoTitle: 'Musik für private Feier | Live-Viola für Geburtstag & Familienfeier',
		seoDescription:
			'Live Musik für private Feiern, Familienfeiern, Gartenfeste und Geburtstage: Solo-Viola für Empfang, Dinner und persönliche Momente.',
		eyebrow: 'Private Feier',
		heroTitle: 'Musik für private Feiern, die persönlich klingt.',
		heroLead:
			'Live-Viola für Geburtstag, Familienfeier, Gartenfest, Empfang oder Dinner - dezent, warm und nah am Anlass.',
		splitTitle: 'Nicht lauter, sondern besonderer.',
		splitLede:
			'Bei privaten Feiern soll Musik Menschen zusammenbringen, ohne Gespräche zu überdecken. Solo-Viola schafft genau diesen Rahmen.',
		paragraphs: [
			'Möglich sind kurze musikalische Momente, Empfangsmusik, dezente Begleitung zum Essen oder ein persönliches Lieblingslied als Überraschung.',
			'Die Musik wird auf Raum, Gäste, Tageszeit und Stimmung abgestimmt - vom Gartenfest bis zur Familienfeier im Restaurant.',
		],
		focusEyebrow: 'Formate',
		focusTitle: 'Drei Arten, private Feiern zu begleiten.',
		focusLead:
			'Die Musik kann als kurzer Moment wirken oder die Feier über mehrere Sets atmosphärisch tragen.',
		items: [
			{ kicker: 'Empfang', title: 'Ankommen der Gäste', text: 'Dezente Musik macht den Beginn der Feier festlich und entspannt.' },
			{ kicker: 'Dinner', title: 'Begleitung zum Essen', text: 'Ruhige Stücke schaffen Atmosphäre, ohne Gespräche zu stören.' },
			{ kicker: 'Überraschung', title: 'Persönliches Lied', text: 'Ein Lieblingslied kann als musikalisches Geschenk vorbereitet werden.' },
			{ kicker: 'Gartenfest', title: 'Draußen feiern', text: 'Bei passendem Wetter funktioniert Viola auch im geschützten Außenbereich.' },
		],
		faqs: [
			{
				question: 'Welche Musik passt zu einer privaten Feier?',
				answer:
					'Je nach Anlass passen klassische Stücke, moderne Arrangements, Filmmusik oder ein persönliches Lieblingslied.',
				open: true,
			},
			{
				question: 'Ist die Musik eher Hintergrundmusik oder Programmpunkt?',
				answer:
					'Beides ist möglich. Die Viola kann dezent im Hintergrund spielen oder als kurzer besonderer Moment auftreten.',
			},
			{
				question: 'Spielst du auch bei Gartenfesten?',
				answer:
					'Ja, wenn Wetter und Platz für das Instrument geeignet sind. Ein geschützter, schattiger Ort ist ideal.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'hochzeitsfeier',
		label: 'Musik Hochzeitsfeier',
		linkLabel: 'Musik Hochzeitsfeier',
		keyword: 'Musik für Hochzeitsfeier',
		intentCluster: 'hochzeiten:musik-hochzeitsfeier',
		priority: 'P2',
		volume: 120,
		seoTitle: 'Musik für Hochzeitsfeier | Dinner & Hintergrundmusik mit Viola',
		seoDescription:
			'Musik für Hochzeitsfeier, Dinner und Empfang: dezente Live-Viola als Hintergrundmusik für Gespräche, Essen und festliche Momente.',
		eyebrow: 'Hochzeitsfeier',
		heroTitle: 'Musik für Hochzeitsfeier, Dinner und Empfang.',
		heroLead:
			'Dezente Live-Viola für Sektempfang, Dinner, Hintergrundmusik und kleine Programmpunkte nach der Trauung.',
		splitTitle: 'Die Feier darf klingen, ohne laut zu werden.',
		splitLede:
			'Nach der Trauung braucht Musik eine andere Aufgabe: Sie soll Räume füllen, Gespräche tragen und besondere Momente markieren.',
		paragraphs: [
			'Ob Empfang, Dinner oder Übergang in den Abend: Solo-Viola wirkt hochwertig und persönlich, ohne die Feier zu dominieren.',
			'Die Sets werden in Länge, Stil und Lautstärke an Location, Ablauf und Gäste angepasst.',
		],
		focusEyebrow: 'Feierablauf',
		focusTitle: 'Wo Live-Musik auf der Feier wirkt.',
		focusLead:
			'Die Musik kann flexibel in den Tagesplan eingebunden werden.',
		items: [
			{ kicker: 'Sektempfang', title: 'Glückwünsche', text: 'Musik füllt die Zeit, während Gäste gratulieren und ankommen.' },
			{ kicker: 'Dinner', title: 'Essen begleiten', text: 'Dezente Stücke schaffen eine warme, festliche Atmosphäre.' },
			{ kicker: 'Programmpunkt', title: 'Kurzes Set', text: 'Ein besonderes Stück kann Reden, Geschenke oder Überraschungen rahmen.' },
			{ kicker: 'Übergang', title: 'Vom Tag in den Abend', text: 'Leichte Musik hilft, die Stimmung elegant weiterzuführen.' },
		],
		faqs: [
			{
				question: 'Kann Live-Viola auch Hintergrundmusik zur Hochzeitsfeier sein?',
				answer:
					'Ja. Solo-Viola eignet sich sehr gut für Empfang, Dinner und ruhige Übergänge, weil sie präsent, aber nicht zu laut ist.',
				open: true,
			},
			{
				question: 'Wie lange spielst du bei einer Hochzeitsfeier?',
				answer:
					'Das hängt vom Ablauf ab. Möglich sind kurze Sets oder längere Begleitung für Empfang und Dinner.',
			},
			{
				question: 'Kann die Musik nach der Trauung weitergehen?',
				answer:
					'Ja. Trauung, Sektempfang und Dinner können musikalisch aufeinander abgestimmt werden.',
			},
		],
	},
	{
		serviceSlug: 'firmenfeiern',
		baseSlug: 'firmenfeiern',
		slug: 'musik-messe',
		label: 'Musik Messe',
		linkLabel: 'Musik Messe',
		keyword: 'Musik Messe',
		intentCluster: 'firmenfeiern:musik-messe',
		priority: 'P2',
		volume: 90,
		seoTitle: 'Musik Messe | Live-Musik für Messestand, Empfang & Kundenkontakt',
		seoDescription:
			'Musik für Messe, Messestand und Kundenempfang: dezente Live-Viola für hochwertige Atmosphäre bei Business-Events.',
		eyebrow: 'Messe & Kundenempfang',
		heroTitle: 'Musik für Messe und Business-Empfang.',
		heroLead:
			'Dezente Live-Viola für Messestand, Kundenempfang, Produktpräsentation oder Networking-Situation.',
		splitTitle: 'Business-Musik muss präzise funktionieren.',
		splitLede:
			'Auf einer Messe darf Musik Aufmerksamkeit schaffen, aber Gespräche nicht stören. Solo-Viola wirkt hochwertig und bleibt akustisch kontrollierbar.',
		paragraphs: [
			'Ich stimme Einsatzzeiten, Lautstärke, Repertoire und Pausen so ab, dass die Musik zum Messetag und zum Kundenkontakt passt.',
			'Möglich sind Empfangszeiten, kurze musikalische Akzente oder dezente Begleitung für Stand, Lounge oder Abendveranstaltung.',
		],
		focusEyebrow: 'Business-Formate',
		focusTitle: 'So kann Musik auf der Messe eingesetzt werden.',
		focusLead:
			'Die Musik wird nicht als Dauerbeschallung geplant, sondern als hochwertiger Rahmen für die richtigen Momente.',
		items: [
			{ kicker: 'Stand', title: 'Messestand', text: 'Leise Live-Musik macht den Auftritt einladender und wertiger.' },
			{ kicker: 'Empfang', title: 'Kundenkontakt', text: 'Musik schafft Atmosphäre, während Gäste eintreffen oder warten.' },
			{ kicker: 'Launch', title: 'Präsentation', text: 'Ein kurzes Set kann eine Produktpräsentation oder Eröffnung rahmen.' },
			{ kicker: 'Abend', title: 'Networking', text: 'Zum Ausklang sorgt Viola für einen ruhigen, eleganten Ton.' },
		],
		faqs: [
			{
				question: 'Eignet sich Live-Musik für einen Messestand?',
				answer:
					'Ja, wenn sie dezent geplant ist. Solo-Viola kann hochwertig wirken, ohne Kundengespräche zu überdecken.',
				open: true,
			},
			{
				question: 'Kann die Musik zeitlich in Slots geplant werden?',
				answer:
					'Ja. Kurze Sets mit Pausen sind für Messen oft sinnvoller als durchgehende Musik.',
			},
			{
				question: 'Bekommen wir eine Rechnung für das Unternehmen?',
				answer:
					'Ja, natürlich mit den notwendigen Angaben für die Buchhaltung.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-freie-trauung',
		label: 'Musik freie Trauung',
		linkLabel: 'Musik freie Trauung',
		keyword: 'Musik freie Trauung',
		intentCluster: 'hochzeiten:musik-freie-trauung',
		priority: 'P3',
		volume: 80,
		seoTitle: 'Musik freie Trauung | Live-Viola für persönliche Zeremonien',
		seoDescription:
			'Musik für freie Trauung: Live-Viola für Einzug, Ritual, Ringtausch, Ja-Wort und Auszug mit persönlichem Wunschlied.',
		eyebrow: 'Freie Trauung',
		heroTitle: 'Musik für eure freie Trauung.',
		heroLead:
			'Live-Viola für eine persönliche Zeremonie mit Einzug, Ritual, Ringtausch, Ja-Wort und Auszug.',
		splitTitle: 'Eine freie Trauung lebt von persönlichen Zeichen.',
		splitLede:
			'Musik kann diese Zeichen verbinden: ein Lied für den Einzug, ein ruhiger Moment während des Rituals, ein heller Auszug.',
		paragraphs: [
			'Ich stimme mich mit euch und der Traurednerin oder dem Trauredner ab, damit die Musik an den richtigen Stellen beginnt und endet.',
			'Klassik, moderne Songs oder euer Lieblingslied können für Solo-Viola eingerichtet werden.',
		],
		focusEyebrow: 'Zeremonie',
		focusTitle: 'Musik für die persönlichen Momente.',
		focusLead: 'Freie Trauungen bieten viel Raum für individuelle musikalische Entscheidungen.',
		items: [
			{ kicker: 'Einzug', title: 'Ankommen', text: 'Musik gibt dem Beginn Ruhe und Aufmerksamkeit.' },
			{ kicker: 'Ritual', title: 'Symbolischer Moment', text: 'Ein leises Stück kann ein Ritual oder persönliche Worte rahmen.' },
			{ kicker: 'Ja-Wort', title: 'Versprechen', text: 'Musik kann einen Moment halten, ohne ihn zu erklären.' },
			{ kicker: 'Auszug', title: 'Feiern', text: 'Zum Abschluss darf die Musik hell und gelöst werden.' },
		],
		faqs: [
			{
				question: 'Spielst du bei freien Trauungen?',
				answer:
					'Ja. Freie Trauungen lassen sich sehr gut mit Solo-Viola begleiten, weil der Ablauf individuell geplant werden kann.',
				open: true,
			},
			{
				question: 'Stimmst du dich mit der Traurednerin ab?',
				answer:
					'Ja. Einsätze und Ablauf können direkt abgestimmt werden.',
			},
			{
				question: 'Kann unser Lieblingslied Teil der freien Trauung sein?',
				answer:
					'Sehr gern, wenn es musikalisch für Viola geeignet ist.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-kirchliche-trauung',
		label: 'Musik kirchliche Trauung',
		linkLabel: 'Musik kirchliche Trauung',
		keyword: 'Musik kirchliche Trauung',
		intentCluster: 'hochzeiten:musik-kirchliche-trauung',
		priority: 'P2',
		volume: 80,
		seoTitle: 'Musik kirchliche Trauung | Live-Viola für Kirche & Hochzeit',
		seoDescription:
			'Musik für die kirchliche Trauung: Live-Viola für Einzug, Gebet, Ringtausch, Segen und Auszug in Kirche oder Kapelle.',
		eyebrow: 'Kirchliche Trauung',
		heroTitle: 'Musik für die kirchliche Trauung.',
		heroLead:
			'Live-Viola für Kirche oder Kapelle - warm, festlich und passend zum liturgischen Ablauf.',
		splitTitle: 'Kirchenräume brauchen Klang mit Respekt.',
		splitLede:
			'Die Viola fügt sich gut in kirchliche Räume ein: getragen genug für den Anlass, aber beweglich genug für kurze Einsätze.',
		paragraphs: [
			'Möglich sind Musik zum Einzug, während der Trauung, zum Ringtausch, zum Segen, zur Kommunion oder zum Auszug.',
			'Ich kläre die Auswahl gern mit euch und bei Bedarf mit Pfarrer:in, Organist:in oder Kantor:in.',
		],
		focusEyebrow: 'Kirche',
		focusTitle: 'Musikpunkte im Gottesdienst.',
		focusLead:
			'Die Musik wird so geplant, dass sie zum Ablauf und zum Raum passt.',
		items: [
			{ kicker: 'Einzug', title: 'Festlich beginnen', text: 'Ein getragenes Stück gibt dem Einzug Würde.' },
			{ kicker: 'Ringe', title: 'Trauhandlung', text: 'Leise Musik kann den Ringtausch rahmen.' },
			{ kicker: 'Segen', title: 'Stiller Moment', text: 'Ein ruhiges Stück lässt Raum für Gebet und Sammlung.' },
			{ kicker: 'Auszug', title: 'Feierlicher Abschluss', text: 'Der Auszug darf klar, hell und freudig klingen.' },
		],
		faqs: [
			{
				question: 'Passt Viola zur kirchlichen Trauung?',
				answer:
					'Ja. Die Viola klingt warm und getragen und passt gut zu Kirche, Kapelle und liturgischen Momenten.',
				open: true,
			},
			{
				question: 'Muss die Musik mit der Kirche abgestimmt werden?',
				answer:
					'Meist ja. Ich kann die Einsätze und Stücke mit euch und den zuständigen Personen abstimmen.',
			},
			{
				question: 'Sind klassische und moderne Stücke möglich?',
				answer:
					'Ja, sofern sie zum Rahmen passen und für Solo-Viola sinnvoll eingerichtet werden können.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-auszug',
		label: 'Auszug Hochzeit Musik',
		linkLabel: 'Musik zum Auszug',
		keyword: 'Auszug Hochzeit Musik',
		intentCluster: 'hochzeiten:musik-auszug-hochzeit',
		priority: 'P3',
		volume: 40,
		seoTitle: 'Auszug Hochzeit Musik | Live-Viola für den feierlichen Auszug',
		seoDescription:
			'Musik zum Auszug bei der Hochzeit: festliche Live-Viola für den Abschluss von Standesamt, Kirche oder freier Trauung.',
		eyebrow: 'Auszug Hochzeit',
		heroTitle: 'Musik zum Auszug, wenn aus Ja ein Wir wird.',
		heroLead:
			'Festliche Live-Viola für den Moment, in dem die Zeremonie endet und die Feier beginnt.',
		splitTitle: 'Der Auszug braucht Energie.',
		splitLede:
			'Nach Ringtausch und Ja-Wort darf die Musik heller werden. Sie gibt dem Applaus, den Glückwünschen und dem ersten Schritt nach draußen Schwung.',
		paragraphs: [
			'Die Musik zum Auszug kann klassisch, modern oder persönlich sein. Wichtig ist, dass sie Freude und Bewegung trägt.',
			'Ich plane den Einsatz so, dass der erste Ton genau nach dem richtigen Moment beginnt.',
		],
		focusEyebrow: 'Stimmung',
		focusTitle: 'Was zum Auszug gut funktioniert.',
		focusLead:
			'Der Auszug ist kurz, aber wirkungsvoll. Die Musik darf klar und sofort erkennbar sein.',
		items: [
			{ kicker: 'Festlich', title: 'Klassischer Auszug', text: 'Helle klassische Stücke wirken feierlich und zeitlos.' },
			{ kicker: 'Modern', title: 'Moderner Song', text: 'Ein bekannter Song kann als Viola-Version persönlich und frisch klingen.' },
			{ kicker: 'Timing', title: 'Punktgenauer Start', text: 'Der Einsatz wird mit Ablauf und Moderation abgestimmt.' },
			{ kicker: 'Weiter', title: 'Übergang zum Empfang', text: 'Auf Wunsch geht die Musik direkt in den Sektempfang über.' },
		],
		faqs: [
			{
				question: 'Welche Musik passt zum Auszug bei der Hochzeit?',
				answer:
					'Zum Auszug passen helle, festliche und bewegte Stücke - klassisch oder modern, je nachdem, wie ihr den Moment feiern wollt.',
				open: true,
			},
			{
				question: 'Kann die Musik direkt nach dem Ja-Wort starten?',
				answer:
					'Ja. Der genaue Einsatz wird vorher mit euch und der Zeremonieleitung abgestimmt.',
			},
			{
				question: 'Kannst du danach beim Sektempfang weiterspielen?',
				answer:
					'Ja, der Auszug kann musikalisch in Empfang oder Gratulationen übergehen.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'musik-brauteinzug',
		label: 'Musik Brauteinzug',
		linkLabel: 'Musik Brauteinzug',
		keyword: 'Einzug Braut Musik',
		intentCluster: 'hochzeiten:musik-brauteinzug',
		priority: 'P3',
		volume: 40,
		seoTitle: 'Musik Brauteinzug | Live-Viola für den Einzug der Braut',
		seoDescription:
			'Musik zum Brauteinzug: Live-Viola für den Einzug bei Standesamt, Kirche oder freier Trauung - klassisch, modern oder als Wunschlied.',
		eyebrow: 'Brauteinzug',
		heroTitle: 'Musik zum Brauteinzug, die den Raum still werden lässt.',
		heroLead:
			'Live-Viola für den Einzug der Braut oder des Brautpaares - ruhig, festlich und persönlich abgestimmt.',
		splitTitle: 'Der erste Ton setzt den ganzen Moment.',
		splitLede:
			'Beim Einzug schauen alle in dieselbe Richtung. Die Musik gibt diesem Moment Zeit und macht ihn bewusst.',
		paragraphs: [
			'Möglich sind klassische Stücke, moderne Songs oder euer persönliches Wunschlied als Solo-Viola-Fassung.',
			'Ich stimme Länge und Tempo so ab, dass der Einzug nicht gehetzt wirkt und trotzdem sicher im Ablauf bleibt.',
		],
		focusEyebrow: 'Einzug',
		focusTitle: 'Was für den Brauteinzug wichtig ist.',
		focusLead:
			'Die Musik soll tragen, nicht ziehen. Deshalb sind Tempo und Einsatz entscheidend.',
		items: [
			{ kicker: 'Tempo', title: 'Genug Zeit', text: 'Das Stück wird so gewählt, dass der Weg ruhig gegangen werden kann.' },
			{ kicker: 'Stimmung', title: 'Klassisch oder modern', text: 'Beides ist möglich - wichtig ist die emotionale Passung.' },
			{ kicker: 'Wunschlied', title: 'Persönlicher Bezug', text: 'Ein Lieblingslied kann für Viola arrangiert werden.' },
			{ kicker: 'Ablauf', title: 'Sicherer Einsatz', text: 'Der Start wird mit Trauort, Redner:in oder Kirche abgestimmt.' },
		],
		faqs: [
			{
				question: 'Welche Musik eignet sich für den Brauteinzug?',
				answer:
					'Geeignet sind ruhige, festliche Stücke oder ein persönliches Lieblingslied, das genug Zeit und Spannung für den Einzug gibt.',
				open: true,
			},
			{
				question: 'Kann ein moderner Song zum Einzug gespielt werden?',
				answer:
					'Ja, wenn er sich musikalisch für Solo-Viola arrangieren lässt.',
			},
			{
				question: 'Wie wird die Länge des Einzugs geplant?',
				answer:
					'Ich stimme Tempo, Startpunkt und mögliches Ende vorher mit euch und dem Ablauf der Trauung ab.',
			},
		],
	},
	{
		serviceSlug: 'firmenfeiern',
		baseSlug: 'firmenfeiern',
		slug: 'musik-gala',
		label: 'Musik Gala',
		linkLabel: 'Musik Gala',
		keyword: 'Musik Gala',
		intentCluster: 'firmenfeiern:musik-gala',
		priority: 'P3',
		volume: 40,
		seoTitle: 'Musik Gala | Live-Viola für Gala, Empfang & Dinner',
		seoDescription:
			'Musik für Gala und festliche Business-Events: Live-Viola für Empfang, Dinner, Ehrung, Jubiläum oder Programmpunkt.',
		eyebrow: 'Gala & Dinner',
		heroTitle: 'Musik für Gala und festliche Business-Events.',
		heroLead:
			'Live-Viola für Empfang, Dinner, Ehrung oder Programmpunkt - elegant, dezent und hochwertig.',
		splitTitle: 'Eine Gala braucht Atmosphäre mit Haltung.',
		splitLede:
			'Die Musik soll repräsentativ wirken und trotzdem Raum für Gespräche, Reden und Begegnungen lassen.',
		paragraphs: [
			'Ich plane Musik für Empfang, Dinner, Preisverleihung, Jubiläum oder einen kurzen musikalischen Programmpunkt.',
			'Repertoire, Kleidung, Ablauf und Rechnung werden business-tauglich und verlässlich abgestimmt.',
		],
		focusEyebrow: 'Anlässe',
		focusTitle: 'Wo Viola bei einer Gala passt.',
		focusLead:
			'Die Musik kann dezent begleiten oder einen offiziellen Moment rahmen.',
		items: [
			{ kicker: 'Empfang', title: 'Ankommen', text: 'Elegante Musik setzt sofort einen hochwertigen Ton.' },
			{ kicker: 'Dinner', title: 'Begleitung', text: 'Ruhige Sets zwischen Gängen und Reden halten die Atmosphäre.' },
			{ kicker: 'Ehrung', title: 'Offizieller Moment', text: 'Ein kurzes Stück kann Auszeichnung oder Jubiläum rahmen.' },
			{ kicker: 'Ausklang', title: 'Networking', text: 'Leichte Musik begleitet den Übergang in Gespräche.' },
		],
		faqs: [
			{
				question: 'Passt Solo-Viola zu einer Gala?',
				answer:
					'Ja. Viola wirkt elegant und hochwertig, ohne zu laut oder aufdringlich zu sein.',
				open: true,
			},
			{
				question: 'Kann die Musik beim Dinner im Hintergrund bleiben?',
				answer:
					'Ja. Lautstärke, Dauer und Repertoire werden auf Gespräche und Ablauf abgestimmt.',
			},
			{
				question: 'Ist ein kurzer Programmpunkt möglich?',
				answer:
					'Ja. Ein kurzes, kuratiertes Set kann einen offiziellen Moment besonders machen.',
			},
		],
	},
	{
		serviceSlug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		slug: 'sektempfang',
		label: 'Musik Sektempfang Hochzeit',
		linkLabel: 'Musik Sektempfang',
		keyword: 'Musik für Sektempfang Hochzeit',
		intentCluster: 'hochzeiten:musik-sektempfang-hochzeit',
		priority: 'P3',
		volume: 10,
		seoTitle: 'Musik Sektempfang Hochzeit | Live-Viola für Empfang & Gratulation',
		seoDescription:
			'Musik für den Sektempfang nach der Hochzeit: dezente Live-Viola für Gratulationen, Empfang und Gespräche.',
		eyebrow: 'Sektempfang',
		heroTitle: 'Musik für den Sektempfang nach der Hochzeit.',
		heroLead:
			'Dezente Live-Viola für Gratulationen, Ankommen, Empfang und die ersten Gespräche nach der Trauung.',
		splitTitle: 'Nach der Trauung darf die Musik weitertragen.',
		splitLede:
			'Beim Sektempfang treffen Freude, Bewegung und Gespräche zusammen. Musik hält die Atmosphäre, ohne im Vordergrund zu stehen.',
		paragraphs: [
			'Ich spiele leichte, festliche und gut erkennbare Stücke, die Glückwünsche und Empfang begleiten.',
			'Die Musik kann direkt an den Auszug anschließen oder als eigener Empfangsblock geplant werden.',
		],
		focusEyebrow: 'Empfang',
		focusTitle: 'Warum Live-Musik beim Sektempfang wirkt.',
		focusLead:
			'Gerade ungeplante Übergänge bekommen dadurch einen klaren, angenehmen Rahmen.',
		items: [
			{ kicker: 'Gratulation', title: 'Zeit füllen', text: 'Musik begleitet die Phase, in der viele kurze Begegnungen stattfinden.' },
			{ kicker: 'Atmosphäre', title: 'Leicht bleiben', text: 'Das Repertoire bleibt hell, freundlich und unaufdringlich.' },
			{ kicker: 'Ablauf', title: 'Flexibel', text: 'Die Dauer kann an Fotos, Locationwechsel oder Empfang angepasst werden.' },
			{ kicker: 'Dinner', title: 'Weiterführen', text: 'Auf Wunsch geht die Musik später in Dinnermusik über.' },
		],
		faqs: [
			{
				question: 'Ist Live-Musik beim Sektempfang sinnvoll?',
				answer:
					'Ja. Sie macht die Gratulations- und Empfangsphase angenehm und festlich, ohne Gespräche zu stören.',
				open: true,
			},
			{
				question: 'Kannst du nach dem Auszug weiterspielen?',
				answer:
					'Ja. Auszug und Sektempfang können musikalisch ineinander übergehen.',
			},
			{
				question: 'Wie lange dauert Musik beim Sektempfang?',
				answer:
					'Das hängt vom Ablauf ab. Kurze Sets oder längere Begleitung sind möglich.',
			},
		],
	},
];

export function getTopicSeoPages(): TopicSeoPage[] {
	return TOPIC_SEO_PAGES;
}

export function getTopicSeoPagesForService(serviceSlug: string): TopicSeoPage[] {
	return TOPIC_SEO_PAGES.filter((page) => page.serviceSlug === serviceSlug);
}

export function getTopicSeoPage(serviceSlug: string, topicSlug: string): TopicSeoPage | undefined {
	return TOPIC_SEO_PAGES.find((page) => page.serviceSlug === serviceSlug && page.slug === topicSlug);
}

export function hasTopicService(serviceSlug: string): boolean {
	return getTopicSeoPagesForService(serviceSlug).length > 0;
}

export function topicPagePath(page: TopicSeoPage): string {
	return `/${page.serviceSlug}/${page.slug}/`;
}

export function buildTopicSeoPage(page: TopicSeoPage, basePage: PageData): PageData {
	const clone = JSON.parse(JSON.stringify(basePage)) as PageData;
	clone.seoTitle = page.seoTitle;
	clone.seoDescription = page.seoDescription;
	clone.bodyClass = [clone.bodyClass, 'page-topic-seo'].filter(Boolean).join(' ');
	clone.blocks = (clone.blocks ?? [])
		.filter(Boolean)
		.map((block) => rewriteTopicBlock(block as AnyBlock, page) as any);
	return clone;
}

export function topicSeoJsonLd(site: URL, page: TopicSeoPage): object {
	const url = canonicalUrl(site, topicPagePath(page)).href;
	const parentUrl = canonicalUrl(site, `/${page.baseSlug}/`).href;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumb`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Start', item: site.href },
					{ '@type': 'ListItem', position: 2, name: page.serviceSlug, item: parentUrl },
					{ '@type': 'ListItem', position: 3, name: page.label, item: url },
				],
			},
			{
				'@type': 'Service',
				'@id': `${url}#service`,
				name: page.label,
				description: page.seoDescription,
				serviceType: page.keyword,
				provider: { '@id': new URL('/#person', site).href },
				url,
				inLanguage: 'de',
			},
		],
	};
}

function rewriteTopicBlock(block: AnyBlock, page: TopicSeoPage): AnyBlock {
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: page.eyebrow,
				title: page.heroTitle,
				lead: page.heroLead,
				badge: page.badge ?? block.badge,
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: page.focusEyebrow,
				title: page.splitTitle,
				lede: page.splitLede,
				paragraphs: page.paragraphs,
			};
		case 'PageBlocksTimeline':
		case 'PageBlocksSched':
		case 'PageBlocksProgramme':
		case 'PageBlocksTriptych':
		case 'PageBlocksMoods':
		case 'PageBlocksLedger':
		case 'PageBlocksSetlist':
		case 'PageBlocksLearnDeck':
			return {
				...block,
				eyebrow: page.focusEyebrow,
				title: page.focusTitle,
				lead: page.focusLead,
				items: page.items,
				footnote: page.focusLead,
			};
		case 'PageBlocksElegy':
			return {
				...block,
				quote: page.splitLede,
				passages: page.items.slice(0, 3).map((item) => ({
					strong: item.title,
					text: item.text,
				})),
			};
		case 'PageBlocksSolemn':
			return {
				...block,
				eyebrow: page.focusEyebrow,
				title: page.focusTitle,
				cards: page.items.slice(0, 2).map((item) => ({
					rom: item.kicker,
					title: item.title,
					poet: item.text,
				})),
				listLabel: page.keyword,
			};
		case 'PageBlocksMarquee':
			return {
				...block,
				lines: [page.keyword, page.label, ...page.items.map((item) => item.title)].slice(0, 6),
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu ${page.keyword}.`,
				items: page.faqs,
			};
		default:
			return block;
	}
}
