import type { Template } from 'tinacms';

export const audioSketchBlockSchema: Template = {
	name: 'audioSketch',
	label: 'Hörproben (Audio-Player)',
	fields: [
		{ type: 'string', name: 'eyebrow', label: 'Überzeile' },
		{ type: 'string', name: 'title', label: 'Überschrift', ui: { component: 'textarea' } },
		{ type: 'string', name: 'lead', label: 'Einleitung', ui: { component: 'textarea' } },
		{ type: 'string', name: 'castLabel', label: 'Zwischenüberschrift (z. B. „Besetzung“)' },
		{ type: 'string', name: 'castText', label: 'Text zur Besetzung', ui: { component: 'textarea' } },
		{
			type: 'object', name: 'art', label: 'Player-Bild (klein)',
			fields: [
				{ type: 'image', name: 'src', label: 'Bild' },
				{ type: 'string', name: 'alt', label: 'Alt-Text' },
			],
		},
		{
			type: 'object', name: 'tracks', label: 'Hörproben', list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? 'Stück' }) },
			fields: [
				{ type: 'string', name: 'title', label: 'Titel', required: true },
				{ type: 'string', name: 'composer', label: 'Komponist / Zusatz' },
				{ type: 'string', name: 'tag', label: 'Etikett (z. B. Trauung)' },
				{ type: 'string', name: 'dur', label: 'Dauer (z. B. 3:05)' },
				{
					type: 'string', name: 'src', label: 'Audio-Datei (Pfad)',
					description:
						'z. B. /uploads/audio/meditation.mp3 — Datei vorher über den Media Manager hochladen (oder von Matthias mit npm run optimize:audio aufbereiten lassen). Leer = Demo-Klangskizze.',
				},
			],
		},
		{
			type: 'string', name: 'note', label: 'Hinweistext unter dem Player',
			ui: { component: 'textarea' },
		},
	],
};
