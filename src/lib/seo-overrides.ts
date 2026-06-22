import type { CmsPage } from './data';
import type { LocalServiceSlug } from './local-seo';
import { SEO_FIELD_SOURCES } from './tina-fields';

type PageData = NonNullable<CmsPage>;
type AnyBlock = Record<string, any>;

const SYSTEM_PATCH_KEYS = new Set([
	'__typename',
	'_sys',
	'_internalSys',
	'_values',
	'_internalValues',
	'_content_source',
	'_tina_metadata',
]);

export type SeoPageKind = 'local' | 'topic';

export interface SeoOverrideItem {
	time?: string;
	kicker?: string;
	title?: string;
	text?: string;
	detail?: string;
	piece?: string;
}

export interface SeoOverrideSplitSection {
	eyebrow?: string;
	title?: string;
	lede?: string;
	paragraphs?: string[];
	image?: {
		src?: string;
		alt?: string;
	};
	imageFirst?: boolean;
	figureClass?: string;
	aspect?: string;
	titleWidth?: string;
}

export interface SeoOverrideElegyPassage {
	strong?: string;
	text?: string;
}

export interface SeoOverrideSolemnCard {
	rom?: string;
	title?: string;
	poet?: string;
	list?: string[];
	linkLabel?: string;
	href?: string;
}

export interface SeoOverrideFaq {
	question?: string;
	answer?: string;
	open?: boolean;
}

export interface SeoImageAltOverride {
	src: string;
	alt: string;
}

export interface SeoPageOverride {
	pageKind: SeoPageKind;
	serviceSlug: LocalServiceSlug;
	pageSlug: string;
	route: string;
	targetKeyword?: string;
	intentCluster?: string;
	priority?: 'P1' | 'P2' | 'P3';
	status?: string;
	enabled?: boolean;
	seoTitle?: string;
	seoDescription?: string;
	hero?: {
		eyebrow?: string;
		title?: string;
		lead?: string;
		badge?: string;
	};
	split?: {
		eyebrow?: string;
		title?: string;
		lede?: string;
		paragraphs?: string[];
		sections?: SeoOverrideSplitSection[];
		seal?: string;
	};
	focus?: {
		eyebrow?: string;
		title?: string;
		lead?: string;
		heading?: string;
		subtitle?: string;
		items?: SeoOverrideItem[];
		footnote?: string;
	};
	elegy?: {
		quote?: string;
		passages?: SeoOverrideElegyPassage[];
	};
	solemn?: {
		eyebrow?: string;
		title?: string;
		lead?: string;
		cards?: SeoOverrideSolemnCard[];
		listLabel?: string;
		list?: string[];
	};
	faq?: {
		eyebrow?: string;
		title?: string;
		items?: SeoOverrideFaq[];
	};
	contact?: {
		eyebrow?: string;
		title?: string;
		lead?: string;
		checklist?: string[];
		notes?: string[];
		defaultOccasion?: string;
		sourceLabel?: string;
		formEyebrow?: string;
		formTitle?: string;
		formSuccess?: string;
	};
	imageAlts?: SeoImageAltOverride[];
	editorNotes?: string;
}

const overrideModules = import.meta.glob('../content/seo-pages/**/*.json', {
	eager: true,
	import: 'default',
}) as Record<string, SeoPageOverride>;

export function getSeoPageOverride(
	pageKind: SeoPageKind,
	serviceSlug: string,
	pageSlug: string,
): SeoPageOverride | undefined {
	const override = getSeoPageOverrideByPath(serviceSlug, pageSlug);
	if (!override || override.enabled === false) return undefined;
	if (override.pageKind !== pageKind) return undefined;
	if (override.serviceSlug !== serviceSlug || override.pageSlug !== pageSlug) return undefined;
	return override;
}

export function getSeoPageOverrideByPath(
	serviceSlug: string,
	pageSlug: string,
): SeoPageOverride | undefined {
	const override = overrideModules[`../content/seo-pages/${serviceSlug}/${pageSlug}.json`];
	if (!override || override.enabled === false) return undefined;
	if (override.serviceSlug !== serviceSlug || override.pageSlug !== pageSlug) return undefined;
	return override;
}

export function mergeSeoPageOverrides(
	fallback?: SeoPageOverride,
	primary?: SeoPageOverride,
): SeoPageOverride | undefined {
	if (!fallback) return primary;
	if (!primary) return fallback;
	const merged: SeoPageOverride = {
		...fallback,
		...primary,
		seoTitle: primary.seoTitle ?? fallback.seoTitle,
		seoDescription: primary.seoDescription ?? fallback.seoDescription,
	};
	const hero = mergeObject(fallback.hero, primary.hero);
	const split = mergeObject(fallback.split, primary.split);
	const focus = mergeObject(fallback.focus, primary.focus);
	const elegy = mergeObject(fallback.elegy, primary.elegy);
	const solemn = mergeObject(fallback.solemn, primary.solemn);
	const faq = mergeObject(fallback.faq, primary.faq);
	const contact = mergeContact(fallback.contact, primary.contact);

	if (hero) merged.hero = hero;
	if (split) merged.split = split;
	if (focus) merged.focus = focus;
	if (elegy) merged.elegy = elegy;
	if (solemn) merged.solemn = solemn;
	if (faq) merged.faq = faq;
	if (contact) merged.contact = contact;
	merged.imageAlts = primary.imageAlts?.length ? primary.imageAlts : fallback.imageAlts;
	merged.editorNotes = primary.editorNotes ?? fallback.editorNotes;
	return merged;
}

function mergeObject<T extends object>(fallback?: T, primary?: T): T | undefined {
	if (!fallback) return primary;
	if (!primary) return fallback;
	return { ...fallback, ...primary };
}

function mergeContact(
	fallback?: SeoPageOverride['contact'],
	primary?: SeoPageOverride['contact'],
): SeoPageOverride['contact'] | undefined {
	const contact = mergeObject(fallback, primary);
	if (!contact) return contact;
	const notes = mergeStringList(fallback?.notes, primary?.notes);
	if (notes?.length) contact.notes = notes;
	return contact;
}

function mergeStringList(fallback?: string[], primary?: string[]): string[] | undefined {
	const values = [...(fallback ?? []), ...(primary ?? [])]
		.filter((value): value is string => typeof value === 'string' && value.trim() !== '');
	const seen = new Set<string>();
	const merged = values.filter((value) => {
		const key = value.trim().toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	return merged.length ? merged : primary?.length ? primary : fallback;
}

export function applySeoPageOverride(data: PageData, override?: SeoPageOverride): PageData {
	if (!override) return data;
	const clone = { ...data };
	if (override.seoTitle) clone.seoTitle = override.seoTitle;
	if (override.seoDescription) clone.seoDescription = override.seoDescription;
	clone.blocks = (clone.blocks ?? [])
		.filter(Boolean)
		.map((block) => applyBlockOverride(block as AnyBlock, override) as any);
	return clone;
}

function applyBlockOverride(block: AnyBlock, override: SeoPageOverride): AnyBlock {
	let next = block;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			next = applyObject(block, override.hero);
			break;
		case 'PageBlocksSplit':
			next = applyObject(block, override.split);
			break;
		case 'PageBlocksTimeline':
		case 'PageBlocksSched':
		case 'PageBlocksProgramme':
		case 'PageBlocksTriptych':
		case 'PageBlocksMoods':
		case 'PageBlocksLedger':
		case 'PageBlocksSetlist':
		case 'PageBlocksLearnDeck':
			next = applyObject(block, override.focus);
			break;
		case 'PageBlocksElegy':
			next = applyElegyOverride(block, override);
			break;
		case 'PageBlocksSolemn':
			next = applySolemnOverride(block, override);
			break;
		case 'PageBlocksFaq':
			next = applyObject(block, override.faq);
			break;
		case 'PageBlocksContactCard':
			next = override.contact ? { ...block, contact: override.contact } : block;
			break;
		default:
			next = block;
	}

	if (!override.imageAlts?.length) return next;
	return applyImageAltOverrides(next, override.imageAlts);
}

function applyObject<T extends AnyBlock>(block: T, patch?: Record<string, unknown>): T {
	if (!patch) return block;
	const cleanPatch = Object.fromEntries(
		Object.entries(patch).filter(([key, value]) => {
			if (SYSTEM_PATCH_KEYS.has(key)) return false;
			if (Array.isArray(value)) return value.length > 0;
			return value !== undefined && value !== null && value !== '';
		}),
	);
	if (!Object.keys(cleanPatch).length) return block;
	return withSeoFieldSources({ ...block, ...cleanPatch }, patch, Object.keys(cleanPatch));
}

function withSeoFieldSources<T extends AnyBlock>(
	block: T,
	source: Record<string, unknown> | undefined,
	fields: string[],
): T {
	if (!source || !('_content_source' in source)) return block;
	return {
		...block,
		[SEO_FIELD_SOURCES]: {
			...(block[SEO_FIELD_SOURCES] ?? {}),
			...Object.fromEntries(fields.map((field) => [field, source])),
		},
	};
}

function applyElegyOverride(block: AnyBlock, override: SeoPageOverride): AnyBlock {
	if (override.elegy) {
		const next = {
			...block,
			quote: override.elegy.quote ?? block.quote,
			passages: override.elegy.passages?.length ? override.elegy.passages : block.passages,
		};
		return withSeoFieldSources(next, override.elegy as unknown as Record<string, unknown>, ['quote', 'passages']);
	}
	if (!override.focus) return block;
	return {
		...block,
		quote: override.split?.lede ?? block.quote,
		passages: override.focus.items?.length
			? override.focus.items.slice(0, 3).map((item) => ({
					strong: item.title,
					text: item.text,
				}))
			: block.passages,
	};
}

function applySolemnOverride(block: AnyBlock, override: SeoPageOverride): AnyBlock {
	if (override.solemn) {
		return applyObject(block, override.solemn as unknown as Record<string, unknown>);
	}
	if (!override.focus) return block;
	return {
		...block,
		eyebrow: override.focus.eyebrow ?? block.eyebrow,
		title: override.focus.title ?? block.title,
		lead: override.focus.lead ?? block.lead,
		cards: override.focus.items?.length
			? override.focus.items.slice(0, 2).map((item) => ({
					rom: item.kicker,
					title: item.title,
					poet: item.text,
				}))
			: block.cards,
	};
}

function applyImageAltOverrides(value: unknown, imageAlts: SeoImageAltOverride[]): any {
	if (Array.isArray(value)) return value.map((item) => applyImageAltOverrides(item, imageAlts));
	if (!value || typeof value !== 'object') return value;

	const object = value as AnyBlock;
	const patched = { ...object };
	if (typeof patched.src === 'string') {
		const match = imageAlts.find((item) => item.src === patched.src);
		if (match?.alt) patched.alt = match.alt;
	}

	for (const [key, nested] of Object.entries(patched)) {
		if (nested && typeof nested === 'object') {
			patched[key] = applyImageAltOverrides(nested, imageAlts);
		}
	}

	return patched;
}
