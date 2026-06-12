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
			type: 'string', name: 'note', label: 'Hinweistext unter dem Player',
			ui: { component: 'textarea' },
			description: 'Der Player selbst (Playlist, Wellenform) wird technisch befüllt und ist hier nicht editierbar.',
		},
	],
};
