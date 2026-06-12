import type { Template } from 'tinacms';

export const schedBlockSchema: Template = {
	name: 'sched',
	label: 'Beispiel-Abend (Uhrzeit-Slots)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Zeit-Slots', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Slot' }) },
			fields: [
				{ type: 'string', name: 'time', label: 'Uhrzeit (z. B. 18:30)' },
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
			],
		},
		{ type: 'string', name: 'footnote', label: 'Hinweis unter den Slots', ui: { component: 'textarea' } },
	],
};
