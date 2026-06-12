import type { Template } from 'tinacms';

export const contactCardBlockSchema: Template = {
	name: 'contactCard',
	label: 'Kontakt & Anfrage-Formular',
	fields: [
		{ type: 'string', name: 'anchorId', label: 'Anker-ID (technisch, optional)' },
		{
			type: 'string', name: 'bg', label: 'Hintergrund',
			options: [
				{ label: 'Ohne', value: 'none' },
				{ label: 'Papier (hell)', value: 'paper2' },
			],
		},
		{
			type: 'string', name: 'hinweis', label: 'Hinweis',
			ui: { component: 'textarea' },
			description: 'Die Texte dieser Sektion werden zentral unter „Globale Einstellungen → Kontakt & Anfrage-Box“ gepflegt, weil sie auf fast allen Seiten identisch erscheinen.',
		},
	],
};
