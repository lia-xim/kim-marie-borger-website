import type { Template } from 'tinacms';

export const quoteBlockSchema: Template = {
	name: 'quote',
	label: 'Großes Zitat (Bordeaux)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'before', label: 'Zitat (Anfang)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'mark', label: 'Markiertes Wort' },
		{ type: 'string', name: 'after', label: 'Zitat (Ende)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'attribution', label: 'Zuschreibung' },
	],
};
