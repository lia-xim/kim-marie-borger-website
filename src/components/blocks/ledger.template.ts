import type { Template } from 'tinacms';

export const ledgerBlockSchema: Template = {
	name: 'ledger',
	label: 'Anlässe-Liste (Bordeaux)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Anlässe', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Anlass' }) },
			fields: [
				{ type: 'string', name: 'title', label: 'Anlass' },
				{ type: 'string', name: 'text', label: 'Beschreibung' },
			],
		},
	],
};
