import type { Template } from 'tinacms';

export const programmeBlockSchema: Template = {
	name: 'programme',
	label: 'Beispielprogramm (gedruckt)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'heading', label: 'Programm-Kopfzeile (z. B. „Programm“)' },
		{ type: 'string', name: 'subtitle', label: 'Programm-Titel (z. B. „Ein Abend mit der Viola“)' },
		{
			type: 'object', name: 'items', label: 'Programmzeilen', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Programmzeile' }) },
			fields: [
				{ type: 'boolean', name: 'pause', label: 'Pause-Zeile (statt Stück)' },
				{ type: 'string', name: 'title', label: 'Titel (bei Pause: Pause-Text, z. B. „— Pause —“)' },
				{ type: 'string', name: 'detail', label: 'Komponist / Zusatz' },
			],
		},
		{ type: 'string', name: 'footnote', label: 'Hinweis unter dem Programm', ui: { component: 'textarea' } },
	],
};
