import type { Template } from 'tinacms';

export const ctaBandBlockSchema: Template = {
	name: 'ctaBand',
	label: 'CTA-Band (Olive)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{ type: 'string', name: 'ctaLabel', label: 'Button — Beschriftung' },
		{ type: 'string', name: 'ctaHref', label: 'Button — Ziel' },
	],
};
