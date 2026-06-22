import type { Collection } from 'tinacms';

const itemFields = [
	{ type: 'string' as const, name: 'time', label: 'Zeit / Ablaufpunkt' },
	{ type: 'string' as const, name: 'kicker', label: 'Kleine Kennung' },
	{ type: 'string' as const, name: 'title', label: 'Titel' },
	{ type: 'string' as const, name: 'text', label: 'Text', ui: { component: 'textarea' } },
	{ type: 'string' as const, name: 'detail', label: 'Detail / Programmtext', ui: { component: 'textarea' } },
	{ type: 'string' as const, name: 'piece', label: 'Stueck / Hinweis' },
];

const elegyPassageFields = [
	{ type: 'string' as const, name: 'strong', label: 'Fetter Einstieg' },
	{ type: 'string' as const, name: 'text', label: 'Text', ui: { component: 'textarea' } },
];

const solemnCardFields = [
	{ type: 'string' as const, name: 'rom', label: 'Kleine Kennung' },
	{ type: 'string' as const, name: 'title', label: 'Titel' },
	{ type: 'string' as const, name: 'poet', label: 'Text', ui: { component: 'textarea' } },
	{ type: 'string' as const, name: 'list', label: 'Liste', list: true },
	{ type: 'string' as const, name: 'linkLabel', label: 'Link-Beschriftung' },
	{ type: 'string' as const, name: 'href', label: 'Link-Ziel' },
];

const faqFields = [
	{ type: 'string' as const, name: 'question', label: 'Frage' },
	{ type: 'string' as const, name: 'answer', label: 'Antwort', ui: { component: 'textarea' } },
	{ type: 'boolean' as const, name: 'open', label: 'Standardmaessig geoeffnet' },
];

const splitSectionFields = [
	{ type: 'string' as const, name: 'eyebrow', label: 'Ueberzeile' },
	{ type: 'string' as const, name: 'title', label: 'Ueberschrift', ui: { component: 'textarea' } },
	{ type: 'string' as const, name: 'lede', label: 'Hervorgehobener Absatz', ui: { component: 'textarea' } },
	{ type: 'string' as const, name: 'paragraphs', label: 'Absatztexte', list: true, ui: { component: 'textarea' } },
	{
		type: 'object' as const,
		name: 'image',
		label: 'Bild',
		fields: [
			{ type: 'image' as const, name: 'src', label: 'Bild' },
			{ type: 'string' as const, name: 'alt', label: 'Alt-Text' },
		],
	},
	{ type: 'boolean' as const, name: 'imageFirst', label: 'Bild links anzeigen' },
	{ type: 'string' as const, name: 'figureClass', label: 'Bild-Rahmenform' },
	{ type: 'string' as const, name: 'aspect', label: 'Bild-Seitenverhaeltnis' },
	{ type: 'string' as const, name: 'titleWidth', label: 'Max. Titelbreite' },
];

export const SeoPageCollection: Collection = {
	name: 'seoPage',
	label: 'SEO-Landingpages',
	path: 'src/content/seo-pages',
	format: 'json',
	ui: {
		router: ({ document }) => document.route ?? '/',
		filename: {
			readonly: true,
			slugify: (values) => values?.pageSlug ?? 'seo-page',
		},
	},
	fields: [
		{
			name: 'pageKind',
			label: 'Seitentyp',
			type: 'string',
			required: true,
			options: [
				{ label: 'Lokale Seite', value: 'local' },
				{ label: 'Topic-Seite', value: 'topic' },
			],
		},
		{ name: 'serviceSlug', label: 'Leistung', type: 'string', required: true },
		{ name: 'pageSlug', label: 'Slug', type: 'string', required: true },
		{ name: 'route', label: 'URL-Pfad', type: 'string', required: true },
		{ name: 'targetKeyword', label: 'Zielkeyword', type: 'string' },
		{ name: 'intentCluster', label: 'Intent-Cluster', type: 'string' },
		{
			name: 'priority',
			label: 'Prioritaet',
			type: 'string',
			options: ['P1', 'P2', 'P3'],
		},
		{ name: 'status', label: 'Arbeitsstatus', type: 'string' },
		{ name: 'enabled', label: 'Override aktiv', type: 'boolean' },
		{ name: 'seoTitle', label: 'Meta-Titel', type: 'string', isTitle: true, required: true },
		{ name: 'seoDescription', label: 'Meta-Beschreibung', type: 'string', ui: { component: 'textarea' } },
		{
			name: 'hero',
			label: 'Hero',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'H1 / Titel', type: 'string', ui: { component: 'textarea' } },
				{ name: 'lead', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
				{ name: 'badge', label: 'Badge', type: 'string' },
			],
		},
		{
			name: 'split',
			label: 'Haupttext',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'Ueberschrift', type: 'string', ui: { component: 'textarea' } },
				{ name: 'lede', label: 'Hervorgehobener Absatz', type: 'string', ui: { component: 'textarea' } },
				{
					name: 'sections',
					label: 'Bild/Text-Sektionen',
					description: 'Maximal vier Abschnitte. Jeder Abschnitt hat Ueberschrift, hervorgehobenen Absatz, Absatztexte und ein Bild.',
					type: 'object',
					list: true,
					ui: { itemProps: (item) => ({ label: item?.title ?? 'Abschnitt' }) },
					fields: splitSectionFields,
				},
				{ name: 'paragraphs', label: 'Fallback-Absatztexte fuer alte Seiten', type: 'string', list: true, ui: { component: 'textarea' } },
				{ name: 'seal', label: 'Siegel-Text', type: 'string', ui: { component: 'textarea' } },
			],
		},
		{
			name: 'focus',
			label: 'Ablauf / Fokussektion',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'Ueberschrift', type: 'string', ui: { component: 'textarea' } },
				{ name: 'lead', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
				{ name: 'heading', label: 'Programm-Ueberschrift', type: 'string' },
				{ name: 'subtitle', label: 'Programm-Untertitel', type: 'string' },
				{ name: 'items', label: 'Punkte', type: 'object', list: true, ui: { itemProps: (item) => ({ label: item?.title ?? 'Punkt' }) }, fields: itemFields },
				{ name: 'footnote', label: 'Fussnote', type: 'string', ui: { component: 'textarea' } },
			],
		},
		{
			name: 'elegy',
			label: 'Trauer-Textblock',
			type: 'object',
			fields: [
				{ name: 'quote', label: 'Leitsatz', type: 'string', ui: { component: 'textarea' } },
				{ name: 'passages', label: 'Absatzgruppen', type: 'object', list: true, ui: { itemProps: (item) => ({ label: item?.strong ?? 'Absatz' }) }, fields: elegyPassageFields },
			],
		},
		{
			name: 'solemn',
			label: 'Trauer-Ablauf/Repertoire',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'Ueberschrift', type: 'string', ui: { component: 'textarea' } },
				{ name: 'lead', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
				{ name: 'cards', label: 'Karten', type: 'object', list: true, ui: { itemProps: (item) => ({ label: item?.title ?? 'Karte' }) }, fields: solemnCardFields },
				{ name: 'listLabel', label: 'Listen-Ueberschrift', type: 'string' },
				{ name: 'list', label: 'Stuecke / Hinweise', type: 'string', list: true },
			],
		},
		{
			name: 'faq',
			label: 'FAQ',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'Ueberschrift', type: 'string' },
				{ name: 'items', label: 'Fragen', type: 'object', list: true, ui: { itemProps: (item) => ({ label: item?.question ?? 'Frage' }) }, fields: faqFields },
			],
		},
		{
			name: 'contact',
			label: 'Kontakt-CTA fuer diese Seite',
			type: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Ueberzeile', type: 'string' },
				{ name: 'title', label: 'Ueberschrift', type: 'string' },
				{ name: 'lead', label: 'Einleitung', type: 'string', ui: { component: 'textarea' } },
				{ name: 'checklist', label: 'Schlagworte', type: 'string', list: true },
				{ name: 'formEyebrow', label: 'Formular-Ueberzeile', type: 'string' },
				{ name: 'formTitle', label: 'Formular-Ueberschrift', type: 'string' },
				{ name: 'formSuccess', label: 'Erfolgsmeldung', type: 'string', ui: { component: 'textarea' } },
			],
		},
		{
			name: 'imageAlts',
			label: 'Bild-Alt-Texte fuer diese Seite',
			type: 'object',
			list: true,
			ui: { itemProps: (item) => ({ label: item?.src ?? 'Bild' }) },
			fields: [
				{ name: 'src', label: 'Bildpfad', type: 'string' },
				{ name: 'alt', label: 'Alt-Text', type: 'string' },
			],
		},
		{ name: 'editorNotes', label: 'Redaktionsnotizen', type: 'string', ui: { component: 'textarea' } },
	],
};
