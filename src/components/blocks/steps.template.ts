import type { Template } from 'tinacms';

export const stepsBlockSchema: Template = {
	name: 'steps',
	label: 'Ablauf-Schritte (I–III)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Schritte', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Schritt' }) },
			fields: [
				{ type: 'string', name: 'num', label: 'Nummer (z. B. I.)' },
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
			],
		},
	],
};
