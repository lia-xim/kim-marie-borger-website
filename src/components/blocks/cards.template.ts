import type { Template } from 'tinacms';

export const cardsBlockSchema: Template = {
	name: 'cards',
	label: 'Karten-Galerie (Anlässe)',
	fields: [
		{ type: 'string', name: 'anchorId', label: 'Anker-ID (technisch, optional)' },
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Karten', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Karte' }) },
			fields: [
				{
					type: 'object', name: 'image', label: 'Bild (leer = Textkarte)',
					fields: [
						{ type: 'image', name: 'src', label: 'Bild' },
						{ type: 'string', name: 'alt', label: 'Alt-Text' },
					],
				},
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'poet', label: 'Zitat / Beschreibung', ui: { component: 'textarea' } },
				{ type: 'string', name: 'linkLabel', label: 'Link-Beschriftung' },
				{ type: 'string', name: 'href', label: 'Link-Ziel' },
			],
		},
		{ type: 'string', name: 'footerLabel', label: 'Link unter der Galerie — Beschriftung' },
		{ type: 'string', name: 'footerHref', label: 'Link unter der Galerie — Ziel' },
	],
};
