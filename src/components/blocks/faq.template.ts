import type { Template } from 'tinacms';

export const faqBlockSchema: Template = {
	name: 'faq',
	label: 'Häufige Fragen (FAQ)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift' },
		{
			type: 'object', name: 'items', label: 'Fragen', list: true,
			ui: { itemProps: (item) => ({ label: item?.question ?? 'Frage' }) },
			fields: [
				{ type: 'string', name: 'question', label: 'Frage' },
				{ type: 'string', name: 'answer', label: 'Antwort', ui: { component: 'textarea' } },
				{ type: 'boolean', name: 'open', label: 'Standardmäßig geöffnet' },
			],
		},
	],
};
