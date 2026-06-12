import type { CmsPage } from './data';

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
export function subpageJsonLd(site: URL, slug: string, pageTitle: string): object {
	const graph: object[] = [
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Start', item: site.href },
				{ '@type': 'ListItem', position: 2, name: pageTitle, item: new URL(`/${slug}/`, site).href },
			],
		},
	];
	const service = SERVICE_PAGES[slug];
	if (service) {
		graph.push({
			'@type': 'Service',
			name: service,
			serviceType: service,
			provider: { '@id': new URL('/#person', site).href },
			areaServed: { '@type': 'Country', name: 'Deutschland' },
			url: new URL(`/${slug}/`, site).href,
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
