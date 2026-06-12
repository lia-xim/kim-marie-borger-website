import type { Template } from 'tinacms';

export const wordsBlockSchema: Template = {
	name: 'words',
	label: 'Drei Worte',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{
			type: 'object', name: 'items', label: 'Worte', list: true,
			ui: { itemProps: (item) => ({ label: item?.word ?? 'Wort' }) },
			fields: [
				{ type: 'string', name: 'word', label: 'Wort' },
				{ type: 'string', name: 'note', label: 'Anmerkung', ui: { component: 'textarea' } },
			],
		},
	],
};
