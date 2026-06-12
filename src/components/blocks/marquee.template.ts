import type { Template } from 'tinacms';

export const marqueeBlockSchema: Template = {
	name: 'marquee',
	label: 'Laufband (Begriffe)',
	fields: [
		{
			// "lines" statt "items": Feldnamen teilen sich über alle Block-Templates
			// einen GraphQL-Namensraum; "items" ist überall eine Objekt-Liste.
			type: 'string', name: 'lines', label: 'Begriffe', list: true,
			description: 'Die Begriffe laufen als Endlos-Band über die Seite (für die Schleife wird der Inhalt automatisch verdoppelt).',
		},
	],
};
