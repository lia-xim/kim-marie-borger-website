import type { Template } from 'tinacms';

export const testimonialsBlockSchema: Template = {
	name: 'testimonials',
	label: 'Kundenstimmen (mehrere)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Kleine Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift' },
		{ type: 'string', name: 'lead', label: 'Einleitung (optional)', ui: { component: 'textarea' } },
		{
			type: 'string', name: 'bg', label: 'Hintergrund',
			options: [
				{ label: 'Ohne', value: 'none' },
				{ label: 'Papier (hell)', value: 'paper2' },
				{ label: 'Bordeaux (dunkel)', value: 'bordeaux' },
			],
		},
		{
			type: 'object',
			name: 'voices',
			label: 'Stimmen',
			list: true,
			description:
				'Nur echte, tatsächlich erhaltene Rückmeldungen eintragen. Erfundene oder fremde Bewertungen sind wettbewerbswidrig und können abgemahnt werden.',
			ui: { itemProps: (item) => ({ label: item?.author ?? 'Stimme' }) },
			fields: [
				{ type: 'string', name: 'text', label: 'Bewertungstext', required: true, ui: { component: 'textarea' } },
				{ type: 'string', name: 'author', label: 'Name / Paar', required: true },
				{ type: 'string', name: 'occasion', label: 'Anlass (z. B. Freie Trauung)' },
				{ type: 'string', name: 'place', label: 'Ort (z. B. Düsseldorf)' },
				{
					type: 'string',
					name: 'date',
					label: 'Datum (JJJJ-MM oder JJJJ-MM-TT)',
					description: 'Wird für strukturierte Daten genutzt und als Jahr angezeigt.',
				},
				{
					type: 'number',
					name: 'rating',
					label: 'Sterne (1–5)',
					description: 'Nur ausfüllen, wenn eine echte Sternebewertung vorliegt. Ohne Sterne erscheint kein Bewertungs-Markup.',
				},
				{
					type: 'string',
					name: 'source',
					label: 'Quelle',
					options: [
						{ label: 'Google-Unternehmensprofil', value: 'Google' },
						{ label: 'Direkt per E-Mail / Karte', value: 'Direkt' },
						{ label: 'Instagram', value: 'Instagram' },
						{ label: 'Hochzeitsportal', value: 'Portal' },
					],
				},
			],
		},
		{ type: 'string', name: 'ctaLabel', label: 'Link-Text (optional)' },
		{ type: 'string', name: 'ctaHref', label: 'Link-Ziel (optional)' },
	],
};
