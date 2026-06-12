import type { Template } from 'tinacms';

export const solemnBlockSchema: Template = {
	name: 'solemn',
	label: 'Leise Anlässe (dunkle Sektion)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'cards', label: 'Karten (links & rechts vom Bild)', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Karte' }) },
			fields: [
				{ type: 'string', name: 'rom', label: 'Kleine Kennung (z. B. Trauer)' },
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'poet', label: 'Zitat', ui: { component: 'textarea' } },
				{ type: 'string', name: 'list', label: 'Aufzählung (optional)', list: true },
				{ type: 'string', name: 'linkLabel', label: 'Link-Beschriftung' },
				{ type: 'string', name: 'href', label: 'Link-Ziel' },
			],
		},
		{
			type: 'object', name: 'image', label: 'Bild (Bogen-Rahmen)',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{ type: 'string', name: 'listLabel', label: 'Überschrift der Stück-Liste (optional)' },
		{ type: 'string', name: 'list', label: 'Stück-Liste unter der Sektion (optional)', list: true },
	],
};
