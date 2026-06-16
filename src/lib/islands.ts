/**
 * Island registry — single source of truth for every editable region the
 * bridge can refresh. Each entry maps a URL slug under `/tina-island/...`
 * to a fetcher + component + wrapper.
 */
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';

import type { ConfigQuery, PageQuery, SeoPageQuery } from '../../tina/__generated__/types';
import type { CmsConfig, CmsPage } from './data';
import PageBody from '../components/islands/PageBody.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getConfig, getPage, getSeoPage } from './data';
import { buildLocalSeoPage, getLocalSeoPage } from './local-seo';
import { buildTopicSeoPage, getTopicSeoPage } from './topic-seo';
import { getSeoPageOverride, type SeoPageKind, type SeoPageOverride } from './seo-overrides';

interface SeoPageIslandPayload {
	basePage: QueryResult<PageQuery>;
	seoPage: QueryResult<SeoPageQuery>;
	pageKind: SeoPageKind;
	serviceSlug: string;
	pageSlug: string;
}

async function fetchSeoPageIsland(params: URLSearchParams): Promise<SeoPageIslandPayload> {
	const pageKind = (params.get('pageKind') ?? 'topic') as SeoPageKind;
	const serviceSlug = params.get('serviceSlug') ?? '';
	const pageSlug = params.get('pageSlug') ?? '';
	const localPage = pageKind === 'local' ? getLocalSeoPage(serviceSlug, pageSlug) : undefined;
	const topicPage = pageKind === 'topic' ? getTopicSeoPage(serviceSlug, pageSlug) : undefined;
	const baseSlug = localPage?.service.baseSlug ?? topicPage?.baseSlug ?? serviceSlug;
	const [basePage, seoPage] = await Promise.all([
		getPage(baseSlug, {}),
		getSeoPage(serviceSlug, pageSlug, { priority: 'primary' }),
	]);

	return { basePage, seoPage, pageKind, serviceSlug, pageSlug };
}

function propsFromSeoPageIsland(data: unknown): { data?: CmsPage } {
	const payload = data as SeoPageIslandPayload;
	const baseData = payload.basePage.data?.page;
	const override = (payload.seoPage.data?.seoPage as unknown as SeoPageOverride | undefined)
		?? getSeoPageOverride(payload.pageKind, payload.serviceSlug, payload.pageSlug);
	if (!baseData || !override) return { data: baseData as CmsPage | undefined };

	const localPage = payload.pageKind === 'local'
		? getLocalSeoPage(payload.serviceSlug, payload.pageSlug)
		: undefined;
	const topicPage = payload.pageKind === 'topic'
		? getTopicSeoPage(payload.serviceSlug, payload.pageSlug)
		: undefined;

	if (localPage) return { data: buildLocalSeoPage(localPage, baseData, override) };
	if (topicPage) return { data: buildTopicSeoPage(topicPage, baseData, override) };
	return { data: baseData as CmsPage | undefined };
}

export const islands: IslandRegistry = {
	page: {
		fetch: (_request, params) => getPage(params.get('slug') ?? 'home'),
		component: PageBody,
		wrapper: { tag: 'main' },
		propsFromData: (data) => ({
			data: (data as QueryResult<PageQuery>).data?.page as CmsPage | undefined,
		}),
	},
	seoPage: {
		fetch: (_request, params) => fetchSeoPageIsland(params),
		component: PageBody,
		wrapper: { tag: 'main' },
		propsFromData: propsFromSeoPageIsland,
	},
	global: {
		fetch: () => getConfig(),
		component: Header,
		wrapper: { tag: 'div' },
		propsFromData: (data) => ({
			config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined,
		}),
	},
	'global-footer': {
		fetch: () => getConfig(),
		component: Footer,
		wrapper: { tag: 'div' },
		propsFromData: (data) => ({
			config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined,
		}),
	},
};
