import type { Template } from 'tinacms';

export const heroHomeBlockSchema: Template = {
	name: 'heroHome',
	label: 'Hero (Startseite)',
	fields: [
		{
			type: 'object', name: 'image', label: 'Hintergrundbild',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{ type: 'string', name: 'rail', label: 'Seitliche Laufschrift' },
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'nameLine1', label: 'Name — Zeile 1' },
		{ type: 'string', name: 'nameLine2', label: 'Name — Zeile 2 (kursiv)' },
		{ type: 'string', name: 'taglineBefore', label: 'Slogan (Anfang)' },
		{ type: 'string', name: 'taglineAccent', label: 'Slogan (Akzent, golden)' },
		{ type: 'string', name: 'sub', label: 'Untertitel', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'primaryCta', label: 'Haupt-Button',
			fields: [
				{ type: 'string', name: 'label', label: 'Beschriftung' },
				{ type: 'string', name: 'link', label: 'Link' },
			],
		},
		{
			type: 'object', name: 'secondaryCta', label: 'Zweiter Link',
			fields: [
				{ type: 'string', name: 'label', label: 'Beschriftung' },
				{ type: 'string', name: 'link', label: 'Link' },
			],
		},
	],
};
