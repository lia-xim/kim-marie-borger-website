/**
 * Per-collection data loaders + the data shapes they return.
 *
 * Loaders call the generated Tina client and pipe the result through
 * `requestWithMetadata()` so the editor overlay flows in when the page
 * renders inside the admin iframe and `tinaField()` has its metadata.
 */
import { requestWithMetadata } from '@tinacms/astro/data';
import type { QueryResult } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';
import { SeoPageDocument, type SeoPageQuery } from '../../tina/__generated__/types';
import { getSeoPageOverrideByPath } from './seo-overrides';

export const getConfig = () =>
	requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));

export const getPage = (
	slug: string,
	options: { priority?: 'primary' } = { priority: 'primary' },
) =>
	requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), options);

export const getSeoPage = async (
	serviceSlug: string,
	pageSlug: string,
	options?: { priority?: 'primary' },
): Promise<QueryResult<SeoPageQuery>> => {
	const relativePath = `${serviceSlug}/${pageSlug}.json`;
	try {
		const result = await client.queries.seoPage({ relativePath });
		return await requestWithMetadata(result, options) as QueryResult<SeoPageQuery>;
	} catch {
		const fallback = getSeoPageOverrideByPath(serviceSlug, pageSlug);
		if (!fallback) return await requestWithMetadata(null, options) as QueryResult<SeoPageQuery>;
		return await requestWithMetadata(
			{
				data: { seoPage: fallback },
				query: SeoPageDocument,
				variables: { relativePath },
			},
			options,
		) as QueryResult<SeoPageQuery>;
	}
};

export async function listPages() {
	const result = await client.queries.pageConnection();
	return (result.data.pageConnection.edges ?? [])
		.flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsPage = Awaited<ReturnType<typeof getPage>>['data']['page'];
export type CmsSeoPage = Awaited<ReturnType<typeof getSeoPage>>['data']['seoPage'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;
