import type { CmsPage } from './data';
import { canonicalUrl } from './url';

/** Anlass-Seiten mit eigenem Service-Schema (Slug → Dienstleistung). */
const SERVICE_PAGES: Record<string, string> = {
	hochzeiten: 'Hochzeitsmusik mit Live-Viola',
	beerdigungen: 'Trauermusik für Beerdigungen und Trauerfeiern',
	geburtstage: 'Live-Musik für Geburtstage und private Feiern',
	taufen: 'Musikalische Begleitung von Taufen',
	konzerte: 'Konzerte und Veranstaltungen mit Viola',
	firmenfeiern: 'Live-Musik für Firmenfeiern und Empfänge',
	unterricht: 'Bratschen- und Musikunterricht',
};

/**
 * Strukturierte Daten für Unterseiten: BreadcrumbList immer,
 * Service-Schema zusätzlich auf den Anlass-Seiten.
 */
export function subpageJsonLd(site: URL, slug: string, pageTitle: string, pageDescription?: string): object {
	const pageUrl = canonicalUrl(site, `/${slug}/`).href;
	const graph: object[] = [
		{
			'@type': 'BreadcrumbList',
			'@id': `${pageUrl}#breadcrumb`,
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Start', item: site.href },
				{ '@type': 'ListItem', position: 2, name: pageTitle, item: pageUrl },
			],
		},
	];
	const service = SERVICE_PAGES[slug];
	if (service) {
		graph.push({
			'@type': 'Service',
			'@id': `${pageUrl}#service`,
			name: service,
			description: pageDescription,
			serviceType: service,
			provider: { '@id': new URL('/#person', site).href },
			areaServed: { '@type': 'Country', name: 'Deutschland' },
			url: pageUrl,
			inLanguage: 'de',
		});
	}
	return { '@context': 'https://schema.org', '@graph': graph };
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
