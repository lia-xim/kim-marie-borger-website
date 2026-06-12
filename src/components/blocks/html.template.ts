import type { Template } from 'tinacms';

export const htmlBlockSchema: Template = {
	name: 'html',
	label: 'HTML (Sonderfall)',
	fields: [
		{
			type: 'string', name: 'html', label: 'HTML-Code',
			ui: { component: 'textarea' },
			description: 'Escape-Luke für Sonderfälle — wird unverändert ausgegeben.',
		},
	],
};
