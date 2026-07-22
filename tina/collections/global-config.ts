import type { Collection } from 'tinacms';

export const GlobalConfigCollection: Collection = {
	name: 'config',
	label: 'Globale Einstellungen',
	path: 'src/content/config',
	format: 'json',
	ui: {
		global: true,
	},
	fields: [
		{
			name: 'seo',
			label: 'SEO (Standard)',
			type: 'object',
			fields: [
				{ name: 'title', label: 'Standard-Titel', type: 'string', required: true },
				{ name: 'description', label: 'Standard-Beschreibung', type: 'string', required: true, ui: { component: 'textarea' } },
			],
		},
		{
			name: 'brand',
			label: 'Marke (Header & Footer)',
			type: 'object',
			fields: [
				{ name: 'name', label: 'Name', type: 'string', required: true },
				{ name: 'sub', label: 'Untertitel im Header', type: 'string' },
			],
		},
		{
			name: 'contact',
			label: 'Kontakt & Anfrage-Box',
			description: 'Texte der Kontakt-Sektion, die auf fast allen Seiten erscheint.',
			type: 'object',
			fields: [
				{ name: 'email', label: 'E-Mail-Adresse', type: 'string', required: true },
				{
					name: 'phone',
					label: 'Telefonnummer',
					type: 'string',
					description: 'International, ohne Leerzeichen, z. B. +4915904955240. Leer lassen, wenn kein Telefon-Link erscheinen soll.',
				},
				{
					name: 'whatsapp',
					label: 'WhatsApp-Nummer',
					type: 'string',
					description: 'International, z. B. +4915904955240. Erzeugt automatisch einen wa.me-Link.',
				},
				{
					name: 'instagram',
					label: 'Instagram-Profil-URL',
					type: 'string',
					description: 'Vollständige URL, z. B. https://www.instagram.com/kimmarie_event_musician/',
				},
				{
					name: 'channelNote',
					label: 'Hinweis zu den Kontaktwegen',
					type: 'string',
					ui: { component: 'textarea' },
					description: 'Kurzer Satz unter den direkten Kontaktwegen, z. B. welcher Weg am schnellsten ist.',
				},
				{ name: 'area', label: 'Einsatzgebiet', type: 'string' },
				{ name: 'eyebrow', label: 'Kleine Überzeile', type: 'string' },
				{ name: 'title', label: 'Überschrift', type: 'string' },
				{ name: 'lead', label: 'Einleitungstext', type: 'string', ui: { component: 'textarea' } },
				{ name: 'checklist', label: 'Anlass-Schlagworte', type: 'string', list: true },
				{ name: 'formEyebrow', label: 'Formular: Überzeile', type: 'string' },
				{ name: 'formTitle', label: 'Formular: Überschrift', type: 'string' },
				{ name: 'formSuccess', label: 'Formular: Erfolgsmeldung', type: 'string', ui: { component: 'textarea' } },
				{
					name: 'asideImage',
					label: 'Hintergrundbild der Kontakt-Box',
					type: 'image',
				},
			],
		},
		{
			name: 'footer',
			label: 'Footer',
			type: 'object',
			fields: [
				{ name: 'text', label: 'Kurzbeschreibung', type: 'string', ui: { component: 'textarea' } },
				{ name: 'sign', label: 'Signatur', type: 'string' },
				{ name: 'instagram', label: 'Instagram-URL', type: 'string' },
				{ name: 'youtube', label: 'YouTube-URL', type: 'string' },
				{ name: 'googleBusinessProfile', label: 'Google-Unternehmensprofil-URL', type: 'string' },
				{ name: 'impressum', label: 'Link Impressum', type: 'string' },
				{ name: 'datenschutz', label: 'Link Datenschutz', type: 'string' },
				{ name: 'agb', label: 'Link AGB', type: 'string' },
			],
		},
	],
};
