/**
 * Per-collection data loaders + the data shapes they return.
 *
 * Loaders call the generated Tina client and pipe the result through
 * `requestWithMetadata()` so the editor overlay flows in when the page
 * renders inside the admin iframe and `tinaField()` has its metadata.
 */
import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

export const getConfig = () =>
	requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));

export const getPage = (
	slug: string,
	options: { priority?: 'primary' } = { priority: 'primary' },
) =>
	requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), options);

export const getSeoPage = (
	serviceSlug: string,
	pageSlug: string,
	options?: { priority?: 'primary' },
) =>
	requestWithMetadata(
		client.queries.seoPage({ relativePath: `${serviceSlug}/${pageSlug}.json` }),
		options,
	);

export async function listPages() {
	const result = await client.queries.pageConnection();
	return (result.data.pageConnection.edges ?? [])
		.flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsPage = Awaited<ReturnType<typeof getPage>>['data']['page'];
export type CmsSeoPage = Awaited<ReturnType<typeof getSeoPage>>['data']['seoPage'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;
