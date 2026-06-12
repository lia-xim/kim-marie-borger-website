import type { Template } from 'tinacms';

export const instagramBlockSchema: Template = {
	name: 'instagram',
	label: 'Instagram-Kacheln',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{ type: 'string', name: 'handle', label: 'Instagram-Handle (ohne @)' },
		{ type: 'string', name: 'url', label: 'Instagram-URL' },
		{
			type: 'object', name: 'tiles', label: 'Kacheln', list: true,
			ui: { itemProps: (item) => ({ label: item?.image?.alt ?? 'Kachel' }) },
			fields: [
				{
					type: 'object', name: 'image', label: 'Bild',
					fields: [
						{ type: 'image', name: 'src', label: 'Bild' },
						{ type: 'string', name: 'alt', label: 'Alt-Text' },
					],
				},
			],
		},
		{ type: 'string', name: 'note', label: 'Hinweis neben dem Folgen-Button' },
	],
};
