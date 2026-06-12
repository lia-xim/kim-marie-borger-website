import type { Template } from 'tinacms';

export const setlistBlockSchema: Template = {
	name: 'setlist',
	label: 'Repertoire-Liste',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift' },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Stücke', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Stück' }) },
			fields: [
				{ type: 'string', name: 'title', label: 'Titel' },
				{ type: 'string', name: 'by', label: 'Komponist / Hinweis' },
				{ type: 'boolean', name: 'you', label: 'Hervorheben („Euer Lied“)' },
			],
		},
	],
};
