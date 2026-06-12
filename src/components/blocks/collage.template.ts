import type { Template } from 'tinacms';

export const collageBlockSchema: Template = {
	name: 'collage',
	label: 'Polaroid-Collage',
	fields: [
		{ type: 'string', name: 'anchorId', label: 'Anker-ID (technisch, optional)' },
		{ type: 'string', name: 'eyebrow', label: 'Überzeile (optional)' },
		{ type: 'string', name: 'title', label: 'Überschrift (optional)' },
		{ type: 'string', name: 'lead', label: 'Einleitung (optional)', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'items', label: 'Polaroids', list: true,
			ui: { itemProps: (item) => ({ label: item?.label ?? 'Polaroid' }) },
			fields: [
				{
					type: 'object', name: 'image', label: 'Bild',
					fields: [
						{ type: 'image', name: 'src', label: 'Bild' },
						{ type: 'string', name: 'alt', label: 'Alt-Text' },
					],
				},
				{ type: 'string', name: 'tag', label: 'Etikett (oben)' },
				{ type: 'string', name: 'label', label: 'Bildunterschrift' },
			],
		},
		{ type: 'string', name: 'ribbon', label: 'Schleifentext' },
		{ type: 'string', name: 'footerLabel', label: 'Link darunter — Beschriftung' },
		{ type: 'string', name: 'footerHref', label: 'Link darunter — Ziel' },
	],
};
