import type { Template } from 'tinacms';

export const heroPageBlockSchema: Template = {
	name: 'heroPage',
	label: 'Hero (Unterseite)',
	fields: [
		{
			type: 'object', name: 'image', label: 'Hintergrundbild',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' }, description: 'Zeilenumbruch = neue Zeile auf der Seite.' },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{ type: 'string', name: 'badge', label: 'Badge (z. B. „Erstgespräch kostenlos“)' },
	],
};
