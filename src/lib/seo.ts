import type { CmsPage } from './data';
import {
	breadcrumbListNode,
	coreServiceId,
	coreServiceNode,
	graphJsonLd,
	offerCatalogId,
	offerCatalogNode,
	pageUrl,
	personId,
	webPageNode,
} from './schema';

/**
 * Strukturierte Daten für die Startseite: offizielle Personenseite plus
 * sichtbarer Leistungskatalog aus den Startseiten-Kacheln.
 */
export function homeJsonLd(site: URL, pageTitle: string, pageDescription?: string): object {
	return graphJsonLd([
		webPageNode(site, '/', {
			name: pageTitle,
			description: pageDescription,
			mainEntityId: personId(site),
			aboutIds: [personId(site), offerCatalogId(site)],
		}),
		offerCatalogNode(site),
	]);
}

/**
 * Strukturierte Daten für CMS-Unterseiten: BreadcrumbList und WebPage immer,
 * Core-Service nur auf den sieben sichtbaren Anlass-/Leistungsseiten.
 */
export function subpageJsonLd(site: URL, slug: string, pageTitle: string, pageDescription?: string): object {
	const pagePath = `/${slug}/`;
	const page = pageUrl(site, pagePath);
	const breadcrumb = breadcrumbListNode(site, pagePath, [
		{ name: 'Start', item: pageUrl(site, '/') },
		{ name: pageTitle, item: page },
	]);
	const service = coreServiceNode(site, slug);
	const isAboutPage = slug === 'ueber-mich';
	const isCatalogPage = slug === 'leistungen';
	const isContactPage = slug === 'anfragen';
	const pageNode = webPageNode(site, pagePath, {
		type: isAboutPage ? 'ProfilePage' : isCatalogPage ? 'CollectionPage' : isContactPage ? 'ContactPage' : 'WebPage',
		name: pageTitle,
		description: pageDescription,
		mainEntityId: isAboutPage
			? personId(site)
			: isCatalogPage
				? offerCatalogId(site)
				: service
					? coreServiceId(site, slug)
					: undefined,
		aboutIds: service ? [personId(site), coreServiceId(site, slug)] : [personId(site)],
	});

	return graphJsonLd([
		breadcrumb,
		pageNode,
		service,
		isCatalogPage ? offerCatalogNode(site) : undefined,
	]);
}

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
