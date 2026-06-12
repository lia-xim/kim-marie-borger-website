import type { Template } from 'tinacms';

export const timelineBlockSchema: Template = {
	name: 'timeline',
	label: 'Ablauf (Timeline)',
	fields: [
		{
			type: 'string', name: 'bg', label: 'Hintergrund',
			options: [
				{ label: 'Rosé', value: 'rose' },
				{ label: 'Ohne', value: 'none' },
			],
		},
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Stationen', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Station' }) },
			fields: [
				{ type: 'string', name: 'kicker', label: 'Kennung (z. B. Der Anfang)' },
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
				{ type: 'string', name: 'piece', label: 'Musikstück (optional)' },
			],
		},
	],
};
