import type { Template } from 'tinacms';

export const legalBlockSchema: Template = {
	name: 'legal',
	label: 'Rechtstext (Impressum/Datenschutz)',
	fields: [
		{ type: 'string', name: 'title', label: 'Seitenüberschrift' },
		{ type: 'string', name: 'intro', label: 'Einleitung (optional)', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'sections', label: 'Abschnitte', list: true,
			ui: { itemProps: (item) => ({ label: item?.heading ?? 'Abschnitt' }) },
			fields: [
				{ type: 'string', name: 'heading', label: 'Zwischenüberschrift (optional)' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' }, description: 'Leerzeilen erzeugen Absätze.' },
			],
		},
	],
};
