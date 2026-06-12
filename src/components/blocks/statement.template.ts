import type { Template } from 'tinacms';

export const statementBlockSchema: Template = {
	name: 'statement',
	label: 'Statement (große Aussage)',
	fields: [
		{
			type: 'string', name: 'bg', label: 'Hintergrund',
			options: [
				{ label: 'Papier (hell)', value: 'paper2' },
				{ label: 'Rosé', value: 'rose' },
				{ label: 'Ohne', value: 'none' },
			],
		},
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'titleBefore', label: 'Aussage (Anfang)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'highlight', label: 'Hervorgehobenes Wort' },
		{ type: 'string', name: 'titleAfter', label: 'Aussage (Ende)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Zusatztext (optional)', ui: { component: 'textarea' } },
		{ type: 'boolean', name: 'showNotation', label: 'Notenlinien-Grafik anzeigen' },
		{
			type: 'string', name: 'size', label: 'Schriftgröße der Aussage',
			options: [
				{ label: 'Groß (Standard)', value: 'l' },
				{ label: 'Mittel', value: 'm' },
			],
		},
		{ type: 'boolean', name: 'svgFirst', label: 'Notenlinien vor dem Zusatztext' },
	],
};
