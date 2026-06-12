import type { CmsPage } from './data';

/**
 * Pick the first block image (usually the hero) as the page's social
 * sharing image. Falls back to undefined so BaseHead uses the site default.
 */
export function firstBlockImage(page: CmsPage): string | undefined {
	for (const block of page.blocks ?? []) {
		const src = (block as { image?: { src?: string | null } | null } | null)?.image?.src;
		if (src) return src;
	}
	return undefined;
}
