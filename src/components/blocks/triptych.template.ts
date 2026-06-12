import type { Template } from 'tinacms';

export const triptychBlockSchema: Template = {
	name: 'triptych',
	label: 'Dreispalter (I–III)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Spalten', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Spalte' }) },
			fields: [
				{ type: 'string', name: 'rom', label: 'Nummer (z. B. I.)' },
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'text', label: 'Text', ui: { component: 'textarea' } },
			],
		},
	],
};
