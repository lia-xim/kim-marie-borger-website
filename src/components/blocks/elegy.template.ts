import type { Template } from 'tinacms';

export const elegyBlockSchema: Template = {
	name: 'elegy',
	label: 'Elegie (Zitat & Absätze)',
	fields: [
		{ type: 'string', name: 'quote', label: 'Zitat', ui: { component: 'textarea' } },
		{
			// "passages" statt "paragraphs": Feldnamen teilen sich über alle
			// Block-Templates einen GraphQL-Namensraum; "paragraphs" ist im
			// split-Block eine String-Liste.
			type: 'object', name: 'passages', label: 'Absätze', list: true,
			ui: { itemProps: (item) => ({ label: item?.strong ?? 'Absatz' }) },
			fields: [
				{ type: 'string', name: 'strong', label: 'Fette Zwischenüberschrift' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
			],
		},
	],
};
