/**
 * Per-collection data loaders + the data shapes they return.
 *
 * Loaders prefer the generated Tina client in development so the editor overlay
 * keeps working. Static production builds read the checked-in content files
 * directly; this keeps `astro build` independent from a local Tina GraphQL
 * process.
 */
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, extname, join } from 'node:path';
import { requestWithMetadata } from '@tinacms/astro/data';
import type { QueryResult } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';
import {
	ConfigDocument,
	PageConnectionDocument,
	PageDocument,
	SeoPageDocument,
	type ConfigQuery,
	type PageConnectionQuery,
	type PageQuery,
	type SeoPageQuery,
} from '../../tina/__generated__/types';
import { getSeoPageOverrideByPath } from './seo-overrides';

type Matter = (input: string) => { data: Record<string, unknown> };

const require = createRequire(import.meta.url);
const matter = require('gray-matter') as Matter;
const contentRoot = join(process.cwd(), 'src', 'content');

const blockTypenameByTemplate: Record<string, string> = {
	audioSketch: 'PageBlocksAudioSketch',
	cards: 'PageBlocksCards',
	collage: 'PageBlocksCollage',
	contactCard: 'PageBlocksContactCard',
	ctaBand: 'PageBlocksCtaBand',
	elegy: 'PageBlocksElegy',
	faq: 'PageBlocksFaq',
	heroHome: 'PageBlocksHeroHome',
	heroPage: 'PageBlocksHeroPage',
	html: 'PageBlocksHtml',
	instagram: 'PageBlocksInstagram',
	learnDeck: 'PageBlocksLearnDeck',
	ledger: 'PageBlocksLedger',
	legal: 'PageBlocksLegal',
	marquee: 'PageBlocksMarquee',
	moods: 'PageBlocksMoods',
	programme: 'PageBlocksProgramme',
	quote: 'PageBlocksQuote',
	sched: 'PageBlocksSched',
	setlist: 'PageBlocksSetlist',
	solemn: 'PageBlocksSolemn',
	split: 'PageBlocksSplit',
	statement: 'PageBlocksStatement',
	steps: 'PageBlocksSteps',
	testimonials: 'PageBlocksTestimonials',
	timeline: 'PageBlocksTimeline',
	triptych: 'PageBlocksTriptych',
	videoFeature: 'PageBlocksVideoFeature',
	words: 'PageBlocksWords',
};

function useLocalContent() {
	return process.env.KMB_CONTENT_SOURCE === 'local' || process.env.NODE_ENV === 'production';
}

function systemInfo(collection: string, relativePath: string) {
	const extension = extname(relativePath).replace(/^\./, '');
	const filename = basename(relativePath, extname(relativePath));
	const normalizedRelativePath = relativePath.replaceAll('\\', '/');
	return {
		__typename: 'SystemInfo' as const,
		filename,
		basename: filename,
		hasReferences: false,
		breadcrumbs: normalizedRelativePath.split('/'),
		path: `${collection}/${normalizedRelativePath}`,
		relativePath: normalizedRelativePath,
		extension,
	};
}

function withBlockTypenames(value: unknown): unknown {
	if (Array.isArray(value)) return value.map((item) => withBlockTypenames(item));
	if (!value || typeof value !== 'object') return value;

	const source = value as Record<string, unknown>;
	const template = typeof source._template === 'string' ? source._template : undefined;
	const next: Record<string, unknown> = {};
	for (const [key, nested] of Object.entries(source)) {
		if (key === '_template') continue;
		next[key] = withBlockTypenames(nested);
	}
	if (template && blockTypenameByTemplate[template]) {
		next.__typename = blockTypenameByTemplate[template];
	}
	return next;
}

async function localConfig() {
	const relativePath = 'config.json';
	const raw = await readFile(join(contentRoot, 'config', relativePath), 'utf8');
	return requestWithMetadata({
		data: {
			config: {
				__typename: 'Config',
				id: 'content/config/config.json',
				...JSON.parse(raw),
				_sys: systemInfo('config', relativePath),
			},
		},
		query: ConfigDocument,
		variables: { relativePath },
	}) as Promise<QueryResult<ConfigQuery>>;
}

async function localPage(slug: string, options?: { priority?: 'primary' }) {
	const relativePath = `${slug}.mdx`;
	const raw = await readFile(join(contentRoot, 'page', relativePath), 'utf8');
	const parsed = matter(raw);
	const page = {
		__typename: 'Page' as const,
		id: `content/page/${relativePath}`,
		...(withBlockTypenames(parsed.data) as Record<string, unknown>),
		_sys: systemInfo('page', relativePath),
	} as PageQuery['page'];
	return requestWithMetadata(
		{
			data: { page },
			query: PageDocument,
			variables: { relativePath },
		},
		options,
	) as Promise<QueryResult<PageQuery>>;
}

async function localSeoPage(
	serviceSlug: string,
	pageSlug: string,
	options?: { priority?: 'primary' },
): Promise<QueryResult<SeoPageQuery>> {
	const relativePath = `${serviceSlug}/${pageSlug}.json`;
	const fallback = getSeoPageOverrideByPath(serviceSlug, pageSlug);
	if (!fallback) return requestWithMetadata(null, options) as Promise<QueryResult<SeoPageQuery>>;
	return requestWithMetadata(
		{
			data: {
				seoPage: {
					__typename: 'SeoPage',
					id: `content/seo-pages/${relativePath}`,
					...fallback,
					_sys: systemInfo('seoPage', relativePath),
				},
			},
			query: SeoPageDocument,
			variables: { relativePath },
		},
		options,
	) as Promise<QueryResult<SeoPageQuery>>;
}

async function localPageConnection(): Promise<PageQuery['page'][]> {
	const files = (await readdir(join(contentRoot, 'page')))
		.filter((file) => extname(file) === '.mdx')
		.sort();
	const edges = files.map((file, index) => {
		const relativePath = file.replaceAll('\\', '/');
		return {
			__typename: 'PageConnectionEdges',
			cursor: String(index),
			node: {
				__typename: 'Page',
				id: `content/page/${relativePath}`,
				seoTitle: '',
				seoDescription: null,
				bodyClass: null,
				blocks: null,
				_sys: systemInfo('page', relativePath),
			},
		};
	});
	const result = await requestWithMetadata({
		data: {
			pageConnection: {
				__typename: 'PageConnection',
				totalCount: edges.length,
				pageInfo: {
					__typename: 'PageInfo',
					hasPreviousPage: false,
					hasNextPage: false,
					startCursor: edges[0]?.cursor ?? '',
					endCursor: edges.at(-1)?.cursor ?? '',
				},
				edges,
			},
		},
		query: PageConnectionDocument,
		variables: {},
	}) as QueryResult<PageConnectionQuery>;
	return (result.data.pageConnection.edges ?? [])
		.flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export const getConfig = async (): Promise<QueryResult<ConfigQuery>> => {
	if (useLocalContent()) return localConfig();
	return requestWithMetadata(client.queries.config({ relativePath: 'config.json' })) as Promise<QueryResult<ConfigQuery>>;
};

export const getPage = async (
	slug: string,
	options: { priority?: 'primary' } = { priority: 'primary' },
): Promise<QueryResult<PageQuery>> => {
	if (useLocalContent()) return localPage(slug, options);
	return requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), options) as Promise<QueryResult<PageQuery>>;
};

export const getSeoPage = async (
	serviceSlug: string,
	pageSlug: string,
	options?: { priority?: 'primary' },
): Promise<QueryResult<SeoPageQuery>> => {
	if (useLocalContent()) return localSeoPage(serviceSlug, pageSlug, options);
	const relativePath = `${serviceSlug}/${pageSlug}.json`;
	try {
		const result = await client.queries.seoPage({ relativePath });
		return await requestWithMetadata(result, options) as QueryResult<SeoPageQuery>;
	} catch {
		return localSeoPage(serviceSlug, pageSlug, options);
	}
};

export async function listPages(): Promise<PageQuery['page'][]> {
	if (useLocalContent()) return localPageConnection();
	try {
		const result = await client.queries.pageConnection();
		return (result.data.pageConnection.edges ?? [])
			.flatMap((edge) => (edge?.node ? [edge.node] : []));
	} catch {
		return localPageConnection();
	}
}

export type CmsConfig = ConfigQuery['config'];
export type CmsPage = PageQuery['page'];
export type CmsSeoPage = SeoPageQuery['seoPage'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;
