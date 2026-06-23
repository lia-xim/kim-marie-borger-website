import type { CmsPage } from './data';
import { getLocalService, type LocalServiceSlug } from './local-seo';
import { applySeoPageOverride, type SeoPageOverride } from './seo-overrides';
import {
	breadcrumbListNode,
	coreServiceId,
	graphJsonLd,
	pageOfferNode,
	pageUrl,
	personId,
	webPageNode,
} from './schema';

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

const CORE_TOPIC_SEO_PAGES: TopicSeoPage[] = [
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

type TopicTemplateKind =
	| 'wedding-moment'
	| 'wedding-format'
	| 'wedding-style'
	| 'funeral-format'
	| 'funeral-repertoire'
	| 'business-format'
	| 'private-format'
	| 'baptism-format'
	| 'concert-format'
	| 'lesson-format';

interface TopicSeed {
	serviceSlug: LocalServiceSlug;
	slug: string;
	label: string;
	keyword: string;
	kind: TopicTemplateKind;
	priority?: TopicSeoPage['priority'];
	volume?: number;
	angle?: string;
	audience?: string;
}

const GENERATED_TOPIC_SEEDS: TopicSeed[] = [
	// Hochzeit: Hauptangebot, Instrument, Stil, Zeremonie und konkrete Momente.
	{ serviceSlug: 'hochzeiten', slug: 'hochzeitsmusik-buchen', label: 'Hochzeitsmusik buchen', keyword: 'Hochzeitsmusik buchen', kind: 'wedding-format', priority: 'P1', angle: 'für Paare, die Musik früh und verlässlich planen möchten' },
	{ serviceSlug: 'hochzeiten', slug: 'live-musik-hochzeit', label: 'Live Musik Hochzeit', keyword: 'Live Musik Hochzeit', kind: 'wedding-format', priority: 'P1', angle: 'für Trauung, Empfang und Feier aus einer Hand' },
	{ serviceSlug: 'hochzeiten', slug: 'live-musik-hochzeit-buchen', label: 'Live Musik Hochzeit buchen', keyword: 'Live Musik Hochzeit buchen', kind: 'wedding-format', priority: 'P2', angle: 'für eine klare Buchung mit Ablauf, Zeiten und Wunschmusik' },
	{ serviceSlug: 'hochzeiten', slug: 'musikerin-hochzeit', label: 'Musikerin Hochzeit', keyword: 'Musikerin Hochzeit', kind: 'wedding-format', priority: 'P2', angle: 'für eine persönliche Solo-Begleitung mit direkter Abstimmung' },
	{ serviceSlug: 'hochzeiten', slug: 'hochzeitsmusikerin', label: 'Hochzeitsmusikerin', keyword: 'Hochzeitsmusikerin', kind: 'wedding-format', priority: 'P2', angle: 'für Paare, die eine Musikerin für die Zeremonie suchen' },
	{ serviceSlug: 'hochzeiten', slug: 'geigerin-hochzeit', label: 'Geigerin Hochzeit', keyword: 'Geigerin Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für Suchende, die Streicherklang zur Hochzeit meinen' },
	{ serviceSlug: 'hochzeiten', slug: 'violinistin-hochzeit', label: 'Violinistin Hochzeit', keyword: 'Violinistin Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für modernen Streicherklang mit Solo-Viola als warmer Alternative' },
	{ serviceSlug: 'hochzeiten', slug: 'bratschistin-hochzeit', label: 'Bratschistin Hochzeit', keyword: 'Bratschistin Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für den warmen, tieferen Streicherklang der Bratsche' },
	{ serviceSlug: 'hochzeiten', slug: 'viola-hochzeit', label: 'Viola Hochzeit', keyword: 'Viola Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für elegante Hochzeitsmusik mit warmem Solo-Klang' },
	{ serviceSlug: 'hochzeiten', slug: 'bratsche-hochzeit', label: 'Bratsche Hochzeit', keyword: 'Bratsche Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für Paare, die etwas Weicheres als klassische Geige suchen' },
	{ serviceSlug: 'hochzeiten', slug: 'geige-hochzeit', label: 'Geige Hochzeit', keyword: 'Geige Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für Streicherklang zur Hochzeit mit Viola als charaktervoller Stimme' },
	{ serviceSlug: 'hochzeiten', slug: 'streichmusik-hochzeit', label: 'Streichmusik Hochzeit', keyword: 'Streichmusik Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für klassische und moderne Streicher-Atmosphäre' },
	{ serviceSlug: 'hochzeiten', slug: 'streicherin-hochzeit', label: 'Streicherin Hochzeit', keyword: 'Streicherin Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für Solo-Streicherklang ohne großes Ensemble' },
	{ serviceSlug: 'hochzeiten', slug: 'solo-musikerin-hochzeit', label: 'Solo Musikerin Hochzeit', keyword: 'Solo Musikerin Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für reduzierte, persönliche Live-Musik' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-hochzeitszeremonie', label: 'Musik Hochzeitszeremonie', keyword: 'Musik für Hochzeitszeremonie', kind: 'wedding-moment', priority: 'P3', angle: 'für den gesamten Ablauf von Einzug bis Auszug' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-brautpaar', label: 'Musik für Brautpaar', keyword: 'Musik für Brautpaar', kind: 'wedding-moment', priority: 'P3', angle: 'für ein persönliches Lied und besondere Erinnerungsmomente' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-ringtausch', label: 'Musik zum Ringtausch', keyword: 'Musik zum Ringtausch', kind: 'wedding-moment', priority: 'P3', angle: 'für den stillen Moment zwischen Worten und Applaus' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-ja-wort', label: 'Musik zum Ja-Wort', keyword: 'Musik zum Ja-Wort', kind: 'wedding-moment', priority: 'P3', angle: 'für den Moment direkt vor oder nach dem Versprechen' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-nach-ja-wort', label: 'Musik nach dem Ja-Wort', keyword: 'Musik nach Ja-Wort', kind: 'wedding-moment', priority: 'P3', angle: 'für Applaus, Emotion und den ersten gemeinsamen Augenblick' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-unterschrift-standesamt', label: 'Musik Unterschrift Standesamt', keyword: 'Musik Unterschrift Standesamt', kind: 'wedding-moment', priority: 'P3', angle: 'für die formale Phase im Standesamt' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-waehrend-trauung', label: 'Musik während der Trauung', keyword: 'Musik während Trauung', kind: 'wedding-moment', priority: 'P3', angle: 'für Rituale, Lesungen und stille Zwischenmomente' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-hochzeitsempfang', label: 'Musik Hochzeitsempfang', keyword: 'Musik für Hochzeitsempfang', kind: 'wedding-format', priority: 'P3', angle: 'für Gratulationen, Ankommen und erste Gespräche' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-hochzeitsdinner', label: 'Musik Hochzeitsdinner', keyword: 'Musik für Hochzeitsdinner', kind: 'wedding-format', priority: 'P3', angle: 'für Essen, Reden und ruhige Übergänge' },
	{ serviceSlug: 'hochzeiten', slug: 'dinnermusik-hochzeit', label: 'Dinnermusik Hochzeit', keyword: 'Dinnermusik Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für ein festliches Dinner ohne laute Beschallung' },
	{ serviceSlug: 'hochzeiten', slug: 'hintergrundmusik-hochzeit', label: 'Hintergrundmusik Hochzeit', keyword: 'Hintergrundmusik Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für dezente musikalische Atmosphäre' },
	{ serviceSlug: 'hochzeiten', slug: 'klassische-musik-hochzeit', label: 'Klassische Musik Hochzeit', keyword: 'klassische Musik Hochzeit', kind: 'wedding-style', priority: 'P3', angle: 'für zeitlose Stücke und festliche Ruhe' },
	{ serviceSlug: 'hochzeiten', slug: 'moderne-hochzeitsmusik', label: 'Moderne Hochzeitsmusik', keyword: 'moderne Hochzeitsmusik', kind: 'wedding-style', priority: 'P3', angle: 'für Lieblingssongs in einer warmen Viola-Fassung' },
	{ serviceSlug: 'hochzeiten', slug: 'romantische-hochzeitsmusik', label: 'Romantische Hochzeitsmusik', keyword: 'romantische Hochzeitsmusik', kind: 'wedding-style', priority: 'P3', angle: 'für emotionale, aber nicht kitschige Momente' },
	{ serviceSlug: 'hochzeiten', slug: 'emotionale-hochzeitsmusik', label: 'Emotionale Hochzeitsmusik', keyword: 'emotionale Hochzeitsmusik', kind: 'wedding-style', priority: 'P3', angle: 'für Musik, die nahegeht und trotzdem elegant bleibt' },
	{ serviceSlug: 'hochzeiten', slug: 'dezente-hochzeitsmusik', label: 'Dezente Hochzeitsmusik', keyword: 'dezente Hochzeitsmusik', kind: 'wedding-style', priority: 'P3', angle: 'für Paare, die Atmosphäre statt Show suchen' },
	{ serviceSlug: 'hochzeiten', slug: 'elegante-hochzeitsmusik', label: 'Elegante Hochzeitsmusik', keyword: 'elegante Hochzeitsmusik', kind: 'wedding-style', priority: 'P3', angle: 'für hochwertige Locations und ruhige Abläufe' },
	{ serviceSlug: 'hochzeiten', slug: 'instrumentalmusik-hochzeit', label: 'Instrumentalmusik Hochzeit', keyword: 'Instrumentalmusik Hochzeit', kind: 'wedding-style', priority: 'P3', angle: 'für Musik ohne Gesang, die Raum für Worte lässt' },
	{ serviceSlug: 'hochzeiten', slug: 'live-instrumentalmusik-hochzeit', label: 'Live Instrumentalmusik Hochzeit', keyword: 'Live Instrumentalmusik Hochzeit', kind: 'wedding-style', priority: 'P3', angle: 'für eine akustische Begleitung mit persönlichem Klang' },
	{ serviceSlug: 'hochzeiten', slug: 'musik-schloss-hochzeit', label: 'Musik Schloss Hochzeit', keyword: 'Musik für Schloss Hochzeit', kind: 'wedding-format', priority: 'P3', angle: 'für Trauungen und Empfänge in festlichen Räumen' },

	// Beerdigung / Trauerfeier.
	{ serviceSlug: 'beerdigungen', slug: 'trauermusik-buchen', label: 'Trauermusik buchen', keyword: 'Trauermusik buchen', kind: 'funeral-format', priority: 'P1', angle: 'für eine ruhige und verlässliche Abstimmung im Vorfeld' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-trauerfeier', label: 'Musik Trauerfeier', keyword: 'Musik Trauerfeier', kind: 'funeral-format', priority: 'P1', angle: 'für Beginn, Abschiedsworte, Auszug oder Gang zum Grab' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-beerdigung', label: 'Musik Beerdigung', keyword: 'Musik Beerdigung', kind: 'funeral-format', priority: 'P1', angle: 'für einen würdevollen musikalischen Rahmen' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-bestattung', label: 'Musik Bestattung', keyword: 'Musik Bestattung', kind: 'funeral-format', priority: 'P2', angle: 'für Trauerhalle, Kirche, Kapelle oder Friedhof' },
	{ serviceSlug: 'beerdigungen', slug: 'live-musik-trauerfeier', label: 'Live Musik Trauerfeier', keyword: 'Live Musik Trauerfeier', kind: 'funeral-format', priority: 'P2', angle: 'für einen unmittelbaren Klang ohne Playback' },
	{ serviceSlug: 'beerdigungen', slug: 'live-musik-beerdigung', label: 'Live Musik Beerdigung', keyword: 'Live Musik Beerdigung', kind: 'funeral-format', priority: 'P2', angle: 'für eine persönliche Abschiedsfeier' },
	{ serviceSlug: 'beerdigungen', slug: 'musikerin-trauerfeier', label: 'Musikerin Trauerfeier', keyword: 'Musikerin Trauerfeier', kind: 'funeral-format', priority: 'P3', angle: 'für Familien, die eine direkte Ansprechpartnerin suchen' },
	{ serviceSlug: 'beerdigungen', slug: 'trauermusikerin', label: 'Trauermusikerin', keyword: 'Trauermusikerin', kind: 'funeral-format', priority: 'P3', angle: 'für eine behutsame musikalische Begleitung' },
	{ serviceSlug: 'beerdigungen', slug: 'geige-beerdigung', label: 'Geige Beerdigung', keyword: 'Geige Beerdigung', kind: 'funeral-format', priority: 'P3', angle: 'für warmen Streicherklang bei einer Beerdigung' },
	{ serviceSlug: 'beerdigungen', slug: 'viola-beerdigung', label: 'Viola Beerdigung', keyword: 'Viola Beerdigung', kind: 'funeral-format', priority: 'P3', angle: 'für den dunkleren, tragenden Klang der Viola' },
	{ serviceSlug: 'beerdigungen', slug: 'bratsche-beerdigung', label: 'Bratsche Beerdigung', keyword: 'Bratsche Beerdigung', kind: 'funeral-format', priority: 'P3', angle: 'für eine warme Alternative zur Geige' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-abschied', label: 'Musik Abschied', keyword: 'Musik Abschied', kind: 'funeral-format', priority: 'P2', angle: 'für persönliche Erinnerungen und stille Momente' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-letzter-abschied', label: 'Musik letzter Abschied', keyword: 'Musik letzter Abschied', kind: 'funeral-format', priority: 'P3', angle: 'für den letzten gemeinsamen Moment am Ende der Feier' },
	{ serviceSlug: 'beerdigungen', slug: 'musik-am-grab', label: 'Musik am Grab', keyword: 'Musik am Grab', kind: 'funeral-format', priority: 'P3', angle: 'für den Gang zum Grab oder die stille Verabschiedung' },
	{ serviceSlug: 'beerdigungen', slug: 'klassische-musik-beerdigung', label: 'Klassische Musik Beerdigung', keyword: 'klassische Musik Beerdigung', kind: 'funeral-repertoire', priority: 'P3', volume: 140, angle: 'für vertraute Stücke wie Air, Ave Maria oder Meditation' },
	{ serviceSlug: 'beerdigungen', slug: 'instrumentalmusik-trauerfeier', label: 'Instrumentalmusik Trauerfeier', keyword: 'Instrumentalmusik Trauerfeier', kind: 'funeral-repertoire', priority: 'P3', angle: 'für Abschiedsmusik ohne Worte' },
	{ serviceSlug: 'beerdigungen', slug: 'moderne-trauermusik', label: 'Moderne Trauermusik', keyword: 'moderne Trauermusik', kind: 'funeral-repertoire', priority: 'P3', angle: 'für persönliche Lieblingslieder in reduzierter Fassung' },
	{ serviceSlug: 'beerdigungen', slug: 'ave-maria-beerdigung', label: 'Ave Maria Beerdigung', keyword: 'Ave Maria Beerdigung', kind: 'funeral-repertoire', priority: 'P3', volume: 70, angle: 'für einen klassischen, stillen Abschiedsmoment' },
	{ serviceSlug: 'beerdigungen', slug: 'amazing-grace-beerdigung', label: 'Amazing Grace Beerdigung', keyword: 'Amazing Grace Beerdigung', kind: 'funeral-repertoire', priority: 'P3', volume: 70, angle: 'für ein bekanntes Abschiedslied ohne Gesang' },

	// Firmenfeiern / Business.
	{ serviceSlug: 'firmenfeiern', slug: 'live-musik-firmenevent', label: 'Live Musik Firmenevent', keyword: 'Live Musik Firmenevent', kind: 'business-format', priority: 'P2', angle: 'für Empfang, Dinner, Messe oder Kundenevent' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-firmenfeier', label: 'Musik Firmenfeier', keyword: 'Musik Firmenfeier', kind: 'business-format', priority: 'P2', volume: 170, angle: 'für einen hochwertigen, aber gesprächsfreundlichen Rahmen' },
	{ serviceSlug: 'firmenfeiern', slug: 'musikerin-firmenevent', label: 'Musikerin Firmenevent', keyword: 'Musikerin Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für direkte Planung mit einer Solo-Musikerin' },
	{ serviceSlug: 'firmenfeiern', slug: 'eventmusikerin', label: 'Eventmusikerin', keyword: 'Eventmusikerin', kind: 'business-format', priority: 'P3', angle: 'für Business-Events, private Anlässe und Empfänge' },
	{ serviceSlug: 'firmenfeiern', slug: 'viola-firmenevent', label: 'Viola Firmenevent', keyword: 'Viola Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für einen warmen, eleganten Business-Klang' },
	{ serviceSlug: 'firmenfeiern', slug: 'geige-firmenevent', label: 'Geige Firmenevent', keyword: 'Geige Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für Suchende, die Live-Streicher für ein Event meinen' },
	{ serviceSlug: 'firmenfeiern', slug: 'streichmusik-firmenevent', label: 'Streichmusik Firmenevent', keyword: 'Streichmusik Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für repräsentative Atmosphäre ohne Showbühne' },
	{ serviceSlug: 'firmenfeiern', slug: 'instrumentalmusik-firmenevent', label: 'Instrumentalmusik Firmenevent', keyword: 'Instrumentalmusik Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für Empfang und Networking ohne Gesang' },
	{ serviceSlug: 'firmenfeiern', slug: 'hintergrundmusik-firmenevent', label: 'Hintergrundmusik Firmenevent', keyword: 'Hintergrundmusik Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für Gespräche, Empfang und Dinner' },
	{ serviceSlug: 'firmenfeiern', slug: 'dinnermusik-firmenevent', label: 'Dinnermusik Firmenevent', keyword: 'Dinnermusik Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für Galadinner, Kundenessen und interne Feiern' },
	{ serviceSlug: 'firmenfeiern', slug: 'empfangsmusik-firmenevent', label: 'Empfangsmusik Firmenevent', keyword: 'Empfangsmusik Firmenevent', kind: 'business-format', priority: 'P3', angle: 'für Ankommen, Akkreditierung und Begrüßung' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-firmenempfang', label: 'Musik Firmenempfang', keyword: 'Musik Firmenempfang', kind: 'business-format', priority: 'P3', angle: 'für offizielle Gäste und einen wertigen ersten Eindruck' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-kundenempfang', label: 'Musik Kundenempfang', keyword: 'Musik Kundenempfang', kind: 'business-format', priority: 'P3', angle: 'für Wartezeiten, Begegnung und ruhige Atmosphäre' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-business-event', label: 'Musik Business Event', keyword: 'Musik Business Event', kind: 'business-format', priority: 'P3', angle: 'für Business-Events mit klarem Ablauf' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-networking-event', label: 'Musik Networking Event', keyword: 'Musik Networking Event', kind: 'business-format', priority: 'P3', angle: 'für Gespräche ohne akustische Konkurrenz' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-eroeffnung', label: 'Musik Eröffnung', keyword: 'Musik Eröffnung', kind: 'business-format', priority: 'P3', angle: 'für Auftakt, Ribbon-Cut oder feierliche Begrüßung' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-produktpraesentation', label: 'Musik Produktpräsentation', keyword: 'Musik Produktpräsentation', kind: 'business-format', priority: 'P3', angle: 'für Launch, Präsentation und markante Übergänge' },
	{ serviceSlug: 'firmenfeiern', slug: 'musik-jubilaeum', label: 'Musik Jubiläum', keyword: 'Musik Jubiläum', kind: 'business-format', priority: 'P3', angle: 'für Firmenjubiläum, Ehrung und festliche Reden' },

	// Geburtstag / private Feier, ohne den falschen SERP-Intent "Geburtstagsständchen".
	{ serviceSlug: 'geburtstage', slug: 'live-musik-geburtstag', label: 'Live Musik Geburtstag', keyword: 'Live Musik Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für Empfang, Dinner oder einen persönlichen Musikmoment' },
	{ serviceSlug: 'geburtstage', slug: 'musikerin-geburtstag', label: 'Musikerin Geburtstag', keyword: 'Musikerin Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für eine private Feier mit direkter Abstimmung' },
	{ serviceSlug: 'geburtstage', slug: 'viola-geburtstag', label: 'Viola Geburtstag', keyword: 'Viola Geburtstag', kind: 'private-format', priority: 'P3', volume: 30, angle: 'für warmen Solo-Klang zur Geburtstagsfeier' },
	{ serviceSlug: 'geburtstage', slug: 'geige-geburtstag', label: 'Geige Geburtstag', keyword: 'Geige Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für Suchende nach Streicherklang zur privaten Feier' },
	{ serviceSlug: 'geburtstage', slug: 'bratsche-geburtstag', label: 'Bratsche Geburtstag', keyword: 'Bratsche Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für eine warme Alternative zur klassischen Geige' },
	{ serviceSlug: 'geburtstage', slug: 'streichmusik-geburtstag', label: 'Streichmusik Geburtstag', keyword: 'Streichmusik Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für elegante Geburtstagsmusik ohne große Bühne' },
	{ serviceSlug: 'geburtstage', slug: 'instrumentalmusik-geburtstag', label: 'Instrumentalmusik Geburtstag', keyword: 'Instrumentalmusik Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für Begleitung ohne Gesang und ohne Textbindung' },
	{ serviceSlug: 'geburtstage', slug: 'musik-familienfeier', label: 'Musik Familienfeier', keyword: 'Musik Familienfeier', kind: 'private-format', priority: 'P3', angle: 'für generationenübergreifende Feiern' },
	{ serviceSlug: 'geburtstage', slug: 'musik-gartenfeier', label: 'Musik Gartenfeier', keyword: 'Musik Gartenfeier', kind: 'private-format', priority: 'P3', angle: 'für sommerliche Feiern im geschützten Außenbereich' },
	{ serviceSlug: 'geburtstage', slug: 'musik-gartenfest', label: 'Musik Gartenfest', keyword: 'Musik Gartenfest', kind: 'private-format', priority: 'P3', angle: 'für lockere Feiern mit festlichem Klang' },
	{ serviceSlug: 'geburtstage', slug: 'sektempfang-geburtstag', label: 'Musik Sektempfang Geburtstag', keyword: 'Musik Sektempfang Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für Ankommen, Gratulation und erste Gespräche' },
	{ serviceSlug: 'geburtstage', slug: 'dinner-geburtstag', label: 'Musik Dinner Geburtstag', keyword: 'Musik Dinner Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für Essen, Toasts und ruhige Übergänge' },
	{ serviceSlug: 'geburtstage', slug: 'hintergrundmusik-geburtstag', label: 'Hintergrundmusik Geburtstag', keyword: 'Hintergrundmusik Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für dezente Atmosphäre bei privaten Feiern' },
	{ serviceSlug: 'geburtstage', slug: 'musikalische-ueberraschung-geburtstag', label: 'Musikalische Überraschung Geburtstag', keyword: 'musikalische Überraschung Geburtstag', kind: 'private-format', priority: 'P3', angle: 'für ein vorbereitetes Lieblingslied ohne falschen Songlisten-Intent' },
	{ serviceSlug: 'geburtstage', slug: 'musikalisches-geschenk-geburtstag', label: 'Musikalisches Geschenk Geburtstag', keyword: 'musikalisches Geburtstagsgeschenk', kind: 'private-format', priority: 'P3', angle: 'für einen kurzen, persönlichen Live-Musikmoment' },

	// Taufe, Kommunion, Konfirmation.
	{ serviceSlug: 'taufen', slug: 'musik-taufe', label: 'Musik Taufe', keyword: 'Musik Taufe', kind: 'baptism-format', priority: 'P3', volume: 20, angle: 'für Gottesdienst, Segnung und Familienfeier' },
	{ serviceSlug: 'taufen', slug: 'live-musik-taufe', label: 'Live Musik Taufe', keyword: 'Live Musik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für eine warme, persönliche Taufbegleitung' },
	{ serviceSlug: 'taufen', slug: 'musikerin-taufe', label: 'Musikerin Taufe', keyword: 'Musikerin Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für direkte Abstimmung mit Familie und Kirche' },
	{ serviceSlug: 'taufen', slug: 'viola-taufe', label: 'Viola Taufe', keyword: 'Viola Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für sanften Solo-Klang zur Taufe' },
	{ serviceSlug: 'taufen', slug: 'geige-taufe', label: 'Geige Taufe', keyword: 'Geige Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für Suchende nach Streicherklang im Gottesdienst' },
	{ serviceSlug: 'taufen', slug: 'bratsche-taufe', label: 'Bratsche Taufe', keyword: 'Bratsche Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für warmen, ruhigen Klang in Kirche oder Kapelle' },
	{ serviceSlug: 'taufen', slug: 'streichmusik-taufe', label: 'Streichmusik Taufe', keyword: 'Streichmusik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für klassische und moderne Taufmusik' },
	{ serviceSlug: 'taufen', slug: 'instrumentalmusik-taufe', label: 'Instrumentalmusik Taufe', keyword: 'Instrumentalmusik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für Musik ohne Gesang im Taufgottesdienst' },
	{ serviceSlug: 'taufen', slug: 'klassische-musik-taufe', label: 'Klassische Musik Taufe', keyword: 'klassische Musik Taufe', kind: 'baptism-format', priority: 'P3', volume: 10, angle: 'für ruhige Klassiker und traditionelle Momente' },
	{ serviceSlug: 'taufen', slug: 'moderne-musik-taufe', label: 'Moderne Musik Taufe', keyword: 'moderne Musik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für persönliche Lieder in einer sanften Fassung' },
	{ serviceSlug: 'taufen', slug: 'sanfte-musik-taufe', label: 'Sanfte Musik Taufe', keyword: 'sanfte Musik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für ein Kind und eine ruhige Gottesdienst-Atmosphäre' },
	{ serviceSlug: 'taufen', slug: 'emotionale-musik-taufe', label: 'Emotionale Musik Taufe', keyword: 'emotionale Musik Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für Familienmomente ohne Pathos' },
	{ serviceSlug: 'taufen', slug: 'musik-kirche-taufe', label: 'Musik Kirche Taufe', keyword: 'Musik Kirche Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für Kirche, Kapelle und liturgischen Ablauf' },
	{ serviceSlug: 'taufen', slug: 'musik-gottesdienst-taufe', label: 'Musik Gottesdienst Taufe', keyword: 'Musik Gottesdienst Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für Einzug, Segnung und Auszug im Gottesdienst' },
	{ serviceSlug: 'taufen', slug: 'musik-familienfeier-taufe', label: 'Musik Familienfeier Taufe', keyword: 'Musik Familienfeier Taufe', kind: 'baptism-format', priority: 'P3', angle: 'für die Feier nach dem Gottesdienst' },
	{ serviceSlug: 'taufen', slug: 'musik-segnung', label: 'Musik zur Segnung', keyword: 'Musik zur Segnung', kind: 'baptism-format', priority: 'P3', angle: 'für Segnung, Willkommensfest oder freie Zeremonie' },
	{ serviceSlug: 'taufen', slug: 'musik-kommunion', label: 'Musik Kommunion', keyword: 'Musik Kommunion', kind: 'baptism-format', priority: 'P3', volume: 10, angle: 'für Kommunion, Familiengottesdienst und anschließende Feier' },
	{ serviceSlug: 'taufen', slug: 'musik-konfirmation', label: 'Musik Konfirmation', keyword: 'Musik Konfirmation', kind: 'baptism-format', priority: 'P3', volume: 10, angle: 'für Konfirmation, Segen und Familienfeier' },
	{ serviceSlug: 'taufen', slug: 'kirchliche-feier', label: 'Musik kirchliche Feier', keyword: 'Musik kirchliche Feier', kind: 'baptism-format', priority: 'P3', angle: 'für Taufe, Kommunion, Konfirmation und Segnung' },

	// Konzerte / Kultur.
	{ serviceSlug: 'konzerte', slug: 'viola-konzert', label: 'Viola Konzert', keyword: 'Viola Konzert', kind: 'concert-format', priority: 'P2', volume: 90, angle: 'für Salon, Bühne, Kulturabend oder besondere Begegnung' },
	{ serviceSlug: 'konzerte', slug: 'bratschenkonzert', label: 'Bratschenkonzert', keyword: 'Bratschenkonzert', kind: 'concert-format', priority: 'P3', volume: 20, angle: 'für Programme rund um den warmen Klang der Bratsche' },
	{ serviceSlug: 'konzerte', slug: 'bratsche-konzert', label: 'Bratsche Konzert', keyword: 'Bratsche Konzert', kind: 'concert-format', priority: 'P3', angle: 'für klassische und moderne Viola-Programme' },
	{ serviceSlug: 'konzerte', slug: 'live-musik-konzert', label: 'Live Musik Konzert', keyword: 'Live Musik Konzert', kind: 'concert-format', priority: 'P3', angle: 'für kuratierte Konzertmomente statt Hintergrundmusik' },
	{ serviceSlug: 'konzerte', slug: 'klassische-musik-event', label: 'Klassische Musik Event', keyword: 'klassische Musik Event', kind: 'concert-format', priority: 'P3', angle: 'für Kulturformate, Empfänge und besondere Bühnen' },
	{ serviceSlug: 'konzerte', slug: 'live-musik-event', label: 'Live Musik Event', keyword: 'Live Musik Event', kind: 'concert-format', priority: 'P3', angle: 'für kleine Bühnen, Lesungen und Empfänge' },
	{ serviceSlug: 'konzerte', slug: 'musik-vernissage', label: 'Musik Vernissage', keyword: 'Musik Vernissage', kind: 'concert-format', priority: 'P3', volume: 10, angle: 'für Ausstellungseröffnung und ruhige Begegnungen' },
	{ serviceSlug: 'konzerte', slug: 'musik-lesung', label: 'Musik Lesung', keyword: 'Musik Lesung', kind: 'concert-format', priority: 'P3', volume: 10, angle: 'für Übergänge, Pausen und literarische Atmosphäre' },
	{ serviceSlug: 'konzerte', slug: 'musik-kulturabend', label: 'Musik Kulturabend', keyword: 'Musik Kulturabend', kind: 'concert-format', priority: 'P3', angle: 'für Programme mit Gespräch, Text oder Kunst' },
	{ serviceSlug: 'konzerte', slug: 'musik-salonkonzert', label: 'Musik Salonkonzert', keyword: 'Musik Salonkonzert', kind: 'concert-format', priority: 'P3', angle: 'für intime Räume und kuratierte Viola-Programme' },

	// Unterricht: Bratsche/Viola, passend zur bestehenden Leistungsseite.
	{ serviceSlug: 'unterricht', slug: 'bratschenunterricht', label: 'Bratschenunterricht', keyword: 'Bratschenunterricht', kind: 'lesson-format', priority: 'P2', volume: 30, angle: 'für Anfänger:innen, Wiedereinsteiger:innen und Fortgeschrittene' },
	{ serviceSlug: 'unterricht', slug: 'bratsche-lernen', label: 'Bratsche lernen', keyword: 'Bratsche lernen', kind: 'lesson-format', priority: 'P3', volume: 40, angle: 'für einen ruhigen Einstieg in Haltung, Bogen und Klang' },
	{ serviceSlug: 'unterricht', slug: 'viola-lernen', label: 'Viola lernen', keyword: 'Viola lernen', kind: 'lesson-format', priority: 'P3', angle: 'für alle, die den warmen Klang der Viola entdecken möchten' },
	{ serviceSlug: 'unterricht', slug: 'viola-unterricht', label: 'Viola Unterricht', keyword: 'Viola Unterricht', kind: 'lesson-format', priority: 'P3', angle: 'für individuellen Unterricht mit klarer Struktur' },
	{ serviceSlug: 'unterricht', slug: 'bratsche-unterricht', label: 'Bratsche Unterricht', keyword: 'Bratsche Unterricht', kind: 'lesson-format', priority: 'P3', angle: 'für Technik, Klang und musikalisches Verständnis' },
	{ serviceSlug: 'unterricht', slug: 'bratschenunterricht-erwachsene', label: 'Bratschenunterricht Erwachsene', keyword: 'Bratschenunterricht für Erwachsene', kind: 'lesson-format', priority: 'P3', angle: 'für Erwachsene, die neu anfangen oder wieder einsteigen' },
	{ serviceSlug: 'unterricht', slug: 'bratschenunterricht-kinder', label: 'Bratschenunterricht Kinder', keyword: 'Bratschenunterricht für Kinder', kind: 'lesson-format', priority: 'P3', angle: 'für geduldigen Aufbau und kindgerechte Schritte' },
	{ serviceSlug: 'unterricht', slug: 'bratschenunterricht-anfaenger', label: 'Bratschenunterricht Anfänger', keyword: 'Bratschenunterricht Anfänger', kind: 'lesson-format', priority: 'P3', angle: 'für Grundlagen ohne Druck' },
	{ serviceSlug: 'unterricht', slug: 'musikunterricht-bratsche', label: 'Musikunterricht Bratsche', keyword: 'Musikunterricht Bratsche', kind: 'lesson-format', priority: 'P3', angle: 'für Unterricht mit Instrument, Theorie und musikalischer Praxis' },
	{ serviceSlug: 'unterricht', slug: 'musikunterricht-viola', label: 'Musikunterricht Viola', keyword: 'Musikunterricht Viola', kind: 'lesson-format', priority: 'P3', angle: 'für Viola-Unterricht mit persönlichem Lernplan' },
];

const GENERATED_TOPIC_SEO_PAGES = GENERATED_TOPIC_SEEDS.map(createGeneratedTopicPage);

export const TOPIC_SEO_PAGES: TopicSeoPage[] = [
	...CORE_TOPIC_SEO_PAGES,
	...GENERATED_TOPIC_SEO_PAGES.filter(
		(page) =>
			!CORE_TOPIC_SEO_PAGES.some(
				(corePage) => corePage.serviceSlug === page.serviceSlug && corePage.slug === page.slug,
			),
	),
];

function createGeneratedTopicPage(seed: TopicSeed): TopicSeoPage {
	const service = generatedServiceCopy(seed.serviceSlug);
	const kind = generatedKindCopy(seed.kind);
	const angle = seed.angle ?? kind.defaultAngle;

	return {
		serviceSlug: seed.serviceSlug,
		baseSlug: seed.serviceSlug,
		slug: seed.slug,
		label: seed.label,
		linkLabel: seed.label,
		keyword: seed.keyword,
		intentCluster: `${seed.serviceSlug}:${seed.slug}`,
		priority: seed.priority ?? 'P3',
		volume: seed.volume ?? 0,
		seoTitle: `${seed.label} | ${service.seoTitleSuffix}`,
		seoDescription: generatedMetaDescription(seed),
		eyebrow: service.eyebrow,
		heroTitle: `${seed.label}, persönlich geplant und live begleitet.`,
		heroLead: `${service.heroLead} Diese Seite bündelt den Suchintent "${seed.keyword}" ${angle}.`,
		badge: service.badge,
		splitTitle: kind.splitTitle,
		splitLede: `${kind.splitLede} Für ${seed.label.toLowerCase()} zählt vor allem, dass Musik nicht allgemein wirkt, sondern zum konkreten Moment passt.`,
		paragraphs: [
			`${seed.label} wird auf Anlass, Raum, Ablauf und gewünschte Stimmung abgestimmt. So entsteht kein austauschbarer Musikblock, sondern ein klarer musikalischer Rahmen für ${service.context}.`,
			`Die Viola bringt Wärme, Ruhe und Präsenz mit. Sie kann klassisch, modern, dezent oder sehr persönlich klingen - je nachdem, was ${service.audience} für diesen Moment brauchen.`,
			`Wunschstücke, Einsatzzeiten und Übergänge werden vorab besprochen, damit die Musik am Tag selbst sicher eingebunden ist.`,
		],
		focusEyebrow: kind.focusEyebrow,
		focusTitle: `${seed.label}: worauf es ankommt.`,
		focusLead: `Die folgenden Punkte trennen diese Suchintention bewusst von allgemeineren Seiten und helfen bei der Planung.`,
		items: generatedItems(seed, service, kind),
		faqs: generatedFaqs(seed, service, kind),
	};
}

function generatedServiceCopy(serviceSlug: LocalServiceSlug) {
	switch (serviceSlug) {
		case 'hochzeiten':
			return {
				seoTitleSuffix: 'Hochzeitsmusik mit Live-Viola',
				seoDescription: 'Live-Viola für Trauung, Empfang, Dinner oder Hochzeitsfeier',
				eyebrow: 'Hochzeitsmusik',
				heroLead: 'Live-Viola für Hochzeiten mit warmem, elegantem Streicherklang.',
				badge: 'Wunschlied nach Absprache möglich',
				context: 'eure Hochzeit',
				audience: 'ihr',
			};
		case 'beerdigungen':
			return {
				seoTitleSuffix: 'Trauermusik mit Viola',
				seoDescription: 'Trauermusik für Beerdigung, Trauerfeier, Bestattung und Abschied',
				eyebrow: 'Trauermusik',
				heroLead: 'Behutsame Live-Viola für Abschiede, Trauerfeiern und stille Erinnerungsmomente.',
				badge: 'Ruhig und zuverlässig abgestimmt',
				context: 'den Abschied',
				audience: 'Familie und Angehörige',
			};
		case 'firmenfeiern':
			return {
				seoTitleSuffix: 'Live-Musik für Business-Events',
				seoDescription: 'dezente Live-Viola für Firmenevent, Empfang, Messe, Gala und Dinner',
				eyebrow: 'Business Event',
				heroLead: 'Dezente Live-Viola für Business-Events, die hochwertig wirken und Gespräche möglich lassen.',
				badge: 'Business-tauglich planbar',
				context: 'das Event',
				audience: 'Gäste, Kund:innen und Team',
			};
		case 'geburtstage':
			return {
				seoTitleSuffix: 'Live-Musik für private Feiern',
				seoDescription: 'Solo-Viola für Geburtstag, Familienfeier, Dinner, Empfang und private Feier',
				eyebrow: 'Private Feier',
				heroLead: 'Live-Viola für private Feiern, Geburtstage und persönliche Momente.',
				badge: 'Lieblingslied möglich',
				context: 'die private Feier',
				audience: 'Gastgeber:innen und Gäste',
			};
		case 'taufen':
			return {
				seoTitleSuffix: 'Taufmusik mit Live-Viola',
				seoDescription: 'sanfte Live-Viola für Taufe, Segnung, Kommunion, Konfirmation und Familienfeier',
				eyebrow: 'Taufe & kirchliche Feier',
				heroLead: 'Sanfte Live-Viola für Taufe, Segnung und familiäre Gottesdienste.',
				badge: 'Kirche und Ablauf abgestimmt',
				context: 'die kirchliche Feier',
				audience: 'Familie und Gemeinde',
			};
		case 'konzerte':
			return {
				seoTitleSuffix: 'Viola Konzert & Kulturprogramm',
				seoDescription: 'kuratierte Viola-Musik für Konzert, Vernissage, Lesung, Salon und Kulturabend',
				eyebrow: 'Konzert & Kultur',
				heroLead: 'Kuratierte Viola-Programme für Bühnen, Salons, Vernissagen und Kulturabende.',
				badge: 'Programm nach Anlass',
				context: 'das Kulturformat',
				audience: 'Publikum und Veranstalter:innen',
			};
		case 'unterricht':
			return {
				seoTitleSuffix: 'Bratschen- und Violaunterricht',
				seoDescription: 'Bratschenunterricht und Violaunterricht für Kinder, Erwachsene, Anfänger:innen und Fortgeschrittene',
				eyebrow: 'Unterricht',
				heroLead: 'Bratschen- und Violaunterricht mit Ruhe, Struktur und musikalischer Neugier.',
				badge: 'Kostenlose Probestunde',
				context: 'den Unterricht',
				audience: 'Schüler:innen',
			};
	}
}

function generatedMetaDescription(seed: TopicSeed): string {
	const descriptions: Record<LocalServiceSlug, string> = {
		hochzeiten: 'Live-Viola für Trauung, Empfang oder Dinner. Wunschmusik und Timing persönlich abgestimmt.',
		beerdigungen: 'Behutsame Live-Viola für Trauerfeier, Beerdigung und Abschied. Ruhig geplant und persönlich abgestimmt.',
		firmenfeiern: 'Dezente Live-Viola für Empfang, Dinner, Messe oder Business-Event. Hochwertig und gesprächsfreundlich.',
		geburtstage: 'Live-Viola für Geburtstag und private Feier. Dezent, persönlich und passend zu Empfang, Dinner oder Überraschung.',
		taufen: 'Sanfte Live-Viola für Taufe, Segnung und Familienfeier. Mit Kirche und Ablauf passend abgestimmt.',
		konzerte: 'Kuratierte Viola-Musik für Konzert, Vernissage, Lesung oder Kulturabend. Programm passend zum Anlass.',
		unterricht: 'Bratschen- und Violaunterricht mit ruhigem Aufbau, Probestunde und persönlichem Lernplan.',
	};

	return `${seed.keyword}: ${descriptions[seed.serviceSlug]}`;
}

function generatedKindCopy(kind: TopicTemplateKind) {
	switch (kind) {
		case 'wedding-moment':
			return {
				defaultAngle: 'für einen klaren Moment im Ablauf der Trauung',
				focusEyebrow: 'Zeremonie',
				splitTitle: 'Ein einzelner Moment braucht eigenes Timing.',
				splitLede: 'Bei Hochzeiten entscheidet oft der genaue Einsatz: ein erster Ton, ein ruhiger Übergang oder ein heller Abschluss.',
			};
		case 'wedding-format':
			return {
				defaultAngle: 'für eine Hochzeit mit stimmigem musikalischem Rahmen',
				focusEyebrow: 'Format',
				splitTitle: 'Der Rahmen bestimmt, wie Musik wirken soll.',
				splitLede: 'Ob Trauung, Empfang oder Dinner: Die Musik muss zum Ort, zur Gästesituation und zum Ablauf passen.',
			};
		case 'wedding-style':
			return {
				defaultAngle: 'für eine klare musikalische Stilrichtung',
				focusEyebrow: 'Stil',
				splitTitle: 'Der Stil entscheidet über die Atmosphäre.',
				splitLede: 'Klassisch, modern, romantisch oder dezent meint nicht nur Repertoire, sondern auch Lautstärke, Tempo und Präsenz.',
			};
		case 'funeral-format':
			return {
				defaultAngle: 'für einen würdevollen Abschied',
				focusEyebrow: 'Abschied',
				splitTitle: 'Trauermusik muss Halt geben, ohne sich vorzudrängen.',
				splitLede: 'Bei einer Trauerfeier ist Musik ein Rahmen für Erinnerung, Stille und die letzten gemeinsamen Schritte.',
			};
		case 'funeral-repertoire':
			return {
				defaultAngle: 'für die passende Stückauswahl bei einer Trauerfeier',
				focusEyebrow: 'Repertoire',
				splitTitle: 'Die Stückauswahl trägt die Stimmung des Abschieds.',
				splitLede: 'Klassische Stücke, moderne Lieder oder persönliche Musik können den Abschied sehr unterschiedlich färben.',
			};
		case 'business-format':
			return {
				defaultAngle: 'für ein hochwertiges, gesprächsfreundliches Event',
				focusEyebrow: 'Business',
				splitTitle: 'Business-Musik muss repräsentativ und kontrollierbar sein.',
				splitLede: 'Bei Firmenfeiern und Events soll Musik Aufmerksamkeit schaffen, ohne Gespräche oder Ablauf zu stören.',
			};
		case 'private-format':
			return {
				defaultAngle: 'für eine persönliche private Feier',
				focusEyebrow: 'Private Feier',
				splitTitle: 'Private Feiern brauchen Nähe statt Show.',
				splitLede: 'Musik darf den Anlass hervorheben, soll Gespräche aber nicht überdecken oder den Raum dominieren.',
			};
		case 'baptism-format':
			return {
				defaultAngle: 'für eine sanfte kirchliche oder familiäre Feier',
				focusEyebrow: 'Kirchliche Feier',
				splitTitle: 'Taufmusik soll wärmen, nicht überfordern.',
				splitLede: 'Bei Taufe, Segnung, Kommunion oder Konfirmation ist Musik Teil eines ruhigen, familiären Rahmens.',
			};
		case 'concert-format':
			return {
				defaultAngle: 'für ein kuratiertes Kulturformat',
				focusEyebrow: 'Programm',
				splitTitle: 'Konzertmusik braucht Dramaturgie.',
				splitLede: 'Für Vernissagen, Lesungen und Konzertformate wird Musik nicht nur begleitet, sondern bewusst programmiert.',
			};
		case 'lesson-format':
			return {
				defaultAngle: 'für individuellen Unterricht mit klarer Struktur',
				focusEyebrow: 'Lernen',
				splitTitle: 'Guter Unterricht macht Klang verständlich.',
				splitLede: 'Bratsche und Viola brauchen Geduld, Körpergefühl und einen Aufbau, der zum Menschen passt.',
			};
	}
}

function generatedItems(seed: TopicSeed, service: ReturnType<typeof generatedServiceCopy>, kind: ReturnType<typeof generatedKindCopy>): TopicItem[] {
	if (seed.kind === 'lesson-format') {
		return [
			{ kicker: 'Start', title: 'Standort klären', text: `${seed.label} beginnt mit einem Blick auf Erfahrung, Ziele und musikalische Wünsche.` },
			{ kicker: 'Technik', title: 'Klang aufbauen', text: 'Haltung, Bogenführung, Intonation und Übestruktur werden Schritt für Schritt verständlich gemacht.' },
			{ kicker: 'Repertoire', title: 'Passende Stücke', text: 'Die Stückauswahl richtet sich nach Niveau, Geschmack und dem nächsten sinnvollen Lernschritt.' },
			{ kicker: 'Rhythmus', title: 'Dranbleiben', text: 'Regelmäßigkeit und kleine erreichbare Ziele helfen mehr als Druck oder starre Programme.' },
		];
	}

	if (seed.kind === 'concert-format') {
		return [
			{ kicker: 'Programm', title: 'Musikalischer Bogen', text: `${seed.label} braucht Stücke, die zusammen eine klare Dramaturgie ergeben.` },
			{ kicker: 'Raum', title: 'Akustik beachten', text: 'Solo-Viola funktioniert besonders gut, wenn Raumgröße und Atmosphäre mitgedacht werden.' },
			{ kicker: 'Publikum', title: 'Nähe schaffen', text: 'Das Programm kann ruhig, moderiert, klassisch oder modern gestaltet werden.' },
			{ kicker: 'Ablauf', title: 'Sicher einbetten', text: 'Ankunft, Umbau, Pausen und Übergänge werden vorab mit dem Veranstaltungsplan verbunden.' },
		];
	}

	if (seed.kind === 'business-format') {
		return [
			{ kicker: 'Format', title: 'Eventziel verstehen', text: `${seed.label} kann Empfang, Dinner, Präsentation oder Networking gezielt unterstützen.` },
			{ kicker: 'Lautstärke', title: 'Gespräche schützen', text: 'Die Viola bleibt präsent, aber kontrollierbar und angenehm für Business-Situationen.' },
			{ kicker: 'Timing', title: 'Sets planen', text: 'Kurze Sets, Pausen und Einsatzpunkte werden an Programm, Reden und Gästefluss angepasst.' },
			{ kicker: 'Organisation', title: 'Business-ready', text: 'Anfahrt, Kleidung, Rechnung und technische Fragen werden zuverlässig geklärt.' },
		];
	}

	if (seed.kind === 'funeral-format' || seed.kind === 'funeral-repertoire') {
		return [
			{ kicker: 'Anlass', title: 'Würde bewahren', text: `${seed.label} soll tragen, ohne den Abschied musikalisch zu überzeichnen.` },
			{ kicker: 'Stücke', title: 'Persönliche Auswahl', text: 'Klassische Werke, ruhige Instrumentalmusik oder ein Lieblingslied können behutsam eingerichtet werden.' },
			{ kicker: 'Ablauf', title: 'Momente rahmen', text: 'Musik kann Beginn, Stille, Auszug oder den Gang zum Grab begleiten.' },
			{ kicker: 'Abstimmung', title: 'Ruhig klären', text: 'Einsätze werden mit Familie, Bestattungshaus, Kirche oder Trauerredner:in abgestimmt.' },
		];
	}

	if (seed.kind === 'baptism-format') {
		return [
			{ kicker: 'Gottesdienst', title: 'Ablauf respektieren', text: `${seed.label} wird so geplant, dass Musik den liturgischen Rahmen unterstützt.` },
			{ kicker: 'Familie', title: 'Persönlichen Bezug schaffen', text: 'Ein Familienlied oder ein Stück mit Erinnerung kann den Tag persönlicher machen.' },
			{ kicker: 'Klang', title: 'Sanft bleiben', text: 'Die Viola klingt warm und ruhig, ohne Kind, Raum oder Gemeinde zu überfordern.' },
			{ kicker: 'Feier', title: 'Weiter begleiten', text: 'Auf Wunsch passt die Musik auch zur anschließenden Familienfeier.' },
		];
	}

	if (seed.kind === 'private-format') {
		return [
			{ kicker: 'Anlass', title: 'Den Ton treffen', text: `${seed.label} kann festlich, dezent oder als persönlicher Moment geplant werden.` },
			{ kicker: 'Lieblingslied', title: 'Persönlich werden', text: 'Ein Wunschlied lässt sich prüfen und für Solo-Viola vorbereiten.' },
			{ kicker: 'Sets', title: 'Flexibel bleiben', text: 'Kurze Auftritte oder längere Begleitung für Empfang und Dinner sind möglich.' },
			{ kicker: 'Raum', title: 'Atmosphäre halten', text: 'Lautstärke und Repertoire werden an Gäste, Gespräche und Location angepasst.' },
		];
	}

	return [
		{ kicker: 'Moment', title: 'Einsatzpunkt planen', text: `${seed.label} braucht einen klaren musikalischen Anfang und ein sinnvolles Ende.` },
		{ kicker: 'Stimmung', title: 'Repertoire wählen', text: 'Klassische Stücke, moderne Songs oder ein Wunschlied werden passend zum Ablauf ausgewählt.' },
		{ kicker: 'Klang', title: 'Viola als Stimme', text: 'Der warme Klang der Viola bleibt nah, emotional und trotzdem elegant.' },
		{ kicker: 'Ablauf', title: 'Sicher abstimmen', text: `Timing, Dauer und Übergänge werden vorab mit ${service.audience} geklärt.` },
	];
}

function generatedFaqs(seed: TopicSeed, service: ReturnType<typeof generatedServiceCopy>, kind: ReturnType<typeof generatedKindCopy>): TopicFaq[] {
	return [
		{
			question: `Passt ${seed.label} zu ${service.context}?`,
			answer: `Ja. ${seed.label} wird gezielt auf ${service.context}, den Raum und den Ablauf abgestimmt. ${kind.defaultAngle}.`,
			open: true,
		},
		{
			question: 'Kann ein Wunschlied gespielt werden?',
			answer: seed.kind === 'lesson-format'
				? 'Im Unterricht können Wunschstücke einbezogen werden, wenn sie zum aktuellen Lernstand passen oder sinnvoll vorbereitet werden.'
				: 'Ja, wenn das Stück musikalisch für Solo-Viola geeignet ist. Ich prüfe es vorab und bereite eine passende Fassung vor.',
		},
		{
			question: 'Wie wird der Ablauf abgestimmt?',
			answer: `Wir klären vorab Einsatzpunkte, Dauer, gewünschte Stimmung und organisatorische Details, damit ${seed.keyword} am Tag selbst ruhig funktioniert.`,
		},
	];
}

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

export function serviceTopicsHubPath(serviceSlug: string): string {
	return `/${serviceSlug}/themen/`;
}

export function buildTopicSeoPage(page: TopicSeoPage, basePage: PageData, override?: SeoPageOverride): PageData {
	const clone = JSON.parse(JSON.stringify(basePage)) as PageData;
	clone.seoTitle = override?.seoTitle ?? page.seoTitle;
	clone.seoDescription = override?.seoDescription ?? page.seoDescription;
	clone.bodyClass = [clone.bodyClass, 'page-topic-seo'].filter(Boolean).join(' ');
	clone.blocks = (clone.blocks ?? [])
		.filter(Boolean)
		.map((block) => rewriteTopicBlock(block as AnyBlock, page) as any);
	return applySeoPageOverride(clone, override);
}

export function topicSeoJsonLd(site: URL, page: TopicSeoPage, override?: SeoPageOverride): object {
	const parentName = getLocalService(page.serviceSlug)?.parentLabel ?? page.serviceSlug;
	const pathname = topicPagePath(page);
	const description = override?.seoDescription ?? page.seoDescription;
	const offer = pageOfferNode(site, pathname, {
		name: page.label,
		description,
		serviceSlug: page.serviceSlug,
	});
	const offerId = offer['@id'] as string;

	return graphJsonLd([
		breadcrumbListNode(site, pathname, [
			{ name: 'Start', item: pageUrl(site, '/') },
			{ name: parentName, item: pageUrl(site, `/${page.baseSlug}/`) },
			{ name: page.label, item: pageUrl(site, pathname) },
		]),
		webPageNode(site, pathname, {
			name: page.label,
			description,
			mainEntityId: offerId,
			aboutIds: [personId(site), coreServiceId(site, page.serviceSlug)],
		}),
		offer,
	]);
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
