import type { Template } from 'tinacms';

export const learnDeckBlockSchema: Template = {
	name: 'learnDeck',
	label: 'Lernkarten (Unterricht)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Karten', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Karte' }) },
			fields: [
				{
					type: 'string', name: 'tone', label: 'Farbvariante',
					options: [
						{ label: 'Standard (hell)', value: 'none' },
						{ label: 'Rosé', value: 't-rose' },
						{ label: 'Olive', value: 't-olive' },
						{ label: 'Bordeaux', value: 't-bordeaux' },
					],
				},
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
			],
		},
	],
};
