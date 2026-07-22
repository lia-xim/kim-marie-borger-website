import type { Collection } from 'tinacms';
import { heroHomeBlockSchema } from '../../src/components/blocks/heroHome.template';
import { heroPageBlockSchema } from '../../src/components/blocks/heroPage.template';
import { statementBlockSchema } from '../../src/components/blocks/statement.template';
import { cardsBlockSchema } from '../../src/components/blocks/cards.template';
import { solemnBlockSchema } from '../../src/components/blocks/solemn.template';
import { collageBlockSchema } from '../../src/components/blocks/collage.template';
import { splitBlockSchema } from '../../src/components/blocks/split.template';
import { quoteBlockSchema } from '../../src/components/blocks/quote.template';
import { testimonialsBlockSchema } from '../../src/components/blocks/testimonials.template';
import { timelineBlockSchema } from '../../src/components/blocks/timeline.template';
import { setlistBlockSchema } from '../../src/components/blocks/setlist.template';
import { faqBlockSchema } from '../../src/components/blocks/faq.template';
import { contactCardBlockSchema } from '../../src/components/blocks/contactCard.template';
import { htmlBlockSchema } from '../../src/components/blocks/html.template';
import { legalBlockSchema } from '../../src/components/blocks/legal.template';
import { marqueeBlockSchema } from '../../src/components/blocks/marquee.template';
import { elegyBlockSchema } from '../../src/components/blocks/elegy.template';
import { moodsBlockSchema } from '../../src/components/blocks/moods.template';
import { triptychBlockSchema } from '../../src/components/blocks/triptych.template';
import { programmeBlockSchema } from '../../src/components/blocks/programme.template';
import { schedBlockSchema } from '../../src/components/blocks/sched.template';
import { ledgerBlockSchema } from '../../src/components/blocks/ledger.template';
import { learnDeckBlockSchema } from '../../src/components/blocks/learnDeck.template';
import { stepsBlockSchema } from '../../src/components/blocks/steps.template';
import { instagramBlockSchema } from '../../src/components/blocks/instagram.template';
import { wordsBlockSchema } from '../../src/components/blocks/words.template';
import { audioSketchBlockSchema } from '../../src/components/blocks/audioSketch.template';
import { videoFeatureBlockSchema } from '../../src/components/blocks/videoFeature.template';
import { ctaBandBlockSchema } from '../../src/components/blocks/ctaBand.template';

export const PageCollection: Collection = {
	name: 'page',
	label: 'Seiten',
	path: 'src/content/page',
	format: 'mdx',
	ui: {
		router: ({ document }) =>
			document._sys.filename === 'home' ? '/' : `/${document._sys.filename}`,
	},
	fields: [
		{
			name: 'seoTitle',
			label: 'Meta-Titel (SEO)',
			type: 'string',
			isTitle: true,
			required: true,
			description: 'Erscheint im Browser-Tab und in Suchergebnissen — nicht auf der Seite selbst.',
		},
		{
			name: 'seoDescription',
			label: 'Meta-Beschreibung (SEO)',
			type: 'string',
			ui: { component: 'textarea' },
			description: 'Kurzbeschreibung für Suchmaschinen und Social-Media-Vorschauen.',
		},
		{
			name: 'bodyClass',
			label: 'Seiten-Theme (CSS-Klasse)',
			type: 'string',
			description: 'Technisch: Farbstimmung der Seite, z. B. page-hochzeit. Nur ändern, wenn du weißt, was du tust.',
		},
		{
			type: 'object',
			list: true,
			name: 'blocks',
			label: 'Seiten-Abschnitte',
			description: 'Der sichtbare Inhalt der Seite, von oben nach unten.',
			ui: { visualSelector: true },
			templates: [
				heroHomeBlockSchema,
				heroPageBlockSchema,
				statementBlockSchema,
				cardsBlockSchema,
				solemnBlockSchema,
				collageBlockSchema,
				splitBlockSchema,
				quoteBlockSchema,
				testimonialsBlockSchema,
				timelineBlockSchema,
				setlistBlockSchema,
				faqBlockSchema,
				contactCardBlockSchema,
				marqueeBlockSchema,
				elegyBlockSchema,
				moodsBlockSchema,
				triptychBlockSchema,
				programmeBlockSchema,
				schedBlockSchema,
				ledgerBlockSchema,
				learnDeckBlockSchema,
				stepsBlockSchema,
				instagramBlockSchema,
				wordsBlockSchema,
				audioSketchBlockSchema,
				videoFeatureBlockSchema,
				ctaBandBlockSchema,
				legalBlockSchema,
				htmlBlockSchema,
			],
		},
	],
};
