import type { Template } from 'tinacms';

export const videoFeatureBlockSchema: Template = {
	name: 'videoFeature',
	label: 'Video (YouTube)',
	fields: [
		{ type: 'string', name: 'anchorId', label: 'Anker-ID (technisch, optional)' },
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'youtubeId', label: 'YouTube-Video-ID (leer = Platzhalter)' },
		{
			type: 'object', name: 'poster', label: 'Vorschaubild',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{ type: 'string', name: 'capTitle', label: 'Bildunterschrift — Titel (fett)' },
		{ type: 'string', name: 'capText', label: 'Bildunterschrift — Zusatz' },
		{ type: 'string', name: 'sideKicker', label: 'Seitentext — Überzeile' },
		{ type: 'string', name: 'sideTitle', label: 'Seitentext — Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'sideLead', label: 'Seitentext — Absatz', ui: { component: 'textarea' } },
		{ type: 'string', name: 'linkLabel', label: 'Link — Beschriftung' },
		{ type: 'string', name: 'linkHref', label: 'Link — Ziel' },
	],
};
