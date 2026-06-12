import type { Template } from 'tinacms';

export const moodsBlockSchema: Template = {
	name: 'moods',
	label: 'Stimmungen (drei Listen)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'moods', label: 'Stimmungen', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Stimmung' }) },
			fields: [
				{ type: 'string', name: 'title', label: 'Titel' },
				{
					type: 'object', name: 'items', label: 'Stücke', list: true,
					ui: { itemProps: (item) => ({ label: item?.title ?? 'Stück' }) },
					fields: [
						{ type: 'string', name: 'title', label: 'Stück' },
						{ type: 'string', name: 'note', label: 'Anmerkung' },
					],
				},
			],
		},
	],
};
