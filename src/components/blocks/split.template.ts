import type { Template } from 'tinacms';

export const splitBlockSchema: Template = {
	name: 'split',
	label: 'Text & Bild (zweispaltig)',
	fields: [
		{ type: 'string', name: 'anchorId', label: 'Anker-ID (technisch, optional)' },
		{
			type: 'string', name: 'bg', label: 'Hintergrund',
			options: [
				{ label: 'Ohne', value: 'none' },
				{ label: 'Papier (hell)', value: 'paper2' },
				{ label: 'Rosé', value: 'rose' },
			],
		},
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lede', label: 'Hervorgehobener erster Absatz (optional)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'paragraphs', label: 'Weitere Absätze', list: true, ui: { component: 'textarea' } },
		{
			type: 'object', name: 'image', label: 'Bild',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{
			type: 'object', name: 'secondImage', label: 'Zweites Bild (nur Variante „twin“)',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{ type: 'string', name: 'seal', label: 'Siegel-Text (optional, Umbrüche möglich)', ui: { component: 'textarea' } },
		{ type: 'boolean', name: 'imageFirst', label: 'Bild links (vor dem Text)' },
		{
			type: 'string', name: 'figureClass', label: 'Bild-Rahmenform (technisch)',
			description: 'z. B. arch, circle, cut, sharp, soft-corner — leer = Standard',
		},
		{ type: 'string', name: 'aspect', label: 'Bild-Seitenverhältnis (z. B. 4/5, optional)' },
		{ type: 'string', name: 'titleWidth', label: 'Max. Titelbreite (technisch, Standard 18ch)' },
		{
			type: 'object', name: 'ctas', label: 'Buttons/Links', list: true,
			ui: { itemProps: (item) => ({ label: item?.label ?? 'Link' }) },
			fields: [
				{ type: 'string', name: 'label', label: 'Beschriftung' },
				{ type: 'string', name: 'link', label: 'Ziel' },
				{
					type: 'string', name: 'style', label: 'Stil',
					options: [
						{ label: 'Button (Umriss)', value: 'btn-ghost' },
						{ label: 'Button (gefüllt)', value: 'btn-solid' },
						{ label: 'Textlink', value: 'link-line' },
					],
				},
			],
		},
	],
};
