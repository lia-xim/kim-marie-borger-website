import type { CmsConfig } from './data';
import { canonicalUrl } from './url';

export type SchemaNode = Record<string, unknown>;

export const SCHEMA_CONTEXT = 'https://schema.org';
export const SITE_LANGUAGE = 'de';
export const DEFAULT_PERSON_IMAGE = '/uploads/mq0uvvd3-20250327-DSC01769.webp';

export const CORE_SERVICE_SLUGS = [
	'hochzeiten',
	'beerdigungen',
	'geburtstage',
	'taufen',
	'konzerte',
	'firmenfeiern',
	'unterricht',
] as const;

export type CoreServiceSlug = typeof CORE_SERVICE_SLUGS[number];

export const COUNTRY_AREA = {
	'@type': 'Country',
	name: 'Deutschland',
};

export const CORE_SERVICE_SCHEMA: Record<CoreServiceSlug, {
	name: string;
	serviceType: string;
	description: string;
}> = {
	hochzeiten: {
		name: 'Hochzeitsmusik mit Live-Viola',
		serviceType: 'Hochzeitsmusik',
		description: 'Live-Viola für Trauung, Empfang, Dinner und persönliche Hochzeitsmomente.',
	},
	beerdigungen: {
		name: 'Trauermusik für Beerdigungen und Trauerfeiern',
		serviceType: 'Trauermusik',
		description: 'Würdevolle Viola-Begleitung für Trauerfeier, Beerdigung, Bestattung und Abschied.',
	},
	geburtstage: {
		name: 'Live-Musik für Geburtstage und private Feiern',
		serviceType: 'Geburtstagsmusik und private Feiern',
		description: 'Solo-Viola für Geburtstage, Gartenfeste, Dinner, Empfang und musikalische Überraschungen.',
	},
	taufen: {
		name: 'Musikalische Begleitung von Taufen',
		serviceType: 'Taufmusik',
		description: 'Sanfte Live-Viola für Taufe, Segnung, Gottesdienst und Familienfeier.',
	},
	konzerte: {
		name: 'Konzerte und Veranstaltungen mit Viola',
		serviceType: 'Viola-Konzerte und Kulturveranstaltungen',
		description: 'Kuratierte Viola-Programme für Konzert, Vernissage, Lesung, Kulturabend und besondere Events.',
	},
	firmenfeiern: {
		name: 'Live-Musik für Firmenfeiern und Empfänge',
		serviceType: 'Live-Musik für Business-Events',
		description: 'Dezente Live-Viola für Empfang, Dinner, Jubiläum, Messe und repräsentative Business-Anlässe.',
	},
	unterricht: {
		name: 'Bratschen- und Musikunterricht',
		serviceType: 'Bratschenunterricht und Violaunterricht',
		description: 'Individueller Bratschen- und Violaunterricht für Kinder, Erwachsene, Anfänger:innen und Fortgeschrittene.',
	},
};

export function pageUrl(site: URL, pathname: string): string {
	return canonicalUrl(site, pathname).href;
}

export function schemaId(site: URL, pathname: string, fragment: string): string {
	const url = canonicalUrl(site, pathname);
	url.hash = fragment;
	return url.href;
}

export function nodeRef(id: string): SchemaNode {
	return { '@id': id };
}

export function personId(site: URL): string {
	return schemaId(site, '/', 'person');
}

export function websiteId(site: URL): string {
	return schemaId(site, '/', 'website');
}

export function offerCatalogId(site: URL): string {
	return schemaId(site, '/', 'offer-catalog');
}

export function profilePageId(site: URL): string {
	return schemaId(site, '/ueber-mich/', 'profile');
}

export function webPageId(site: URL, pathname: string): string {
	return schemaId(site, pathname, 'webpage');
}

export function breadcrumbId(site: URL, pathname: string): string {
	return schemaId(site, pathname, 'breadcrumb');
}

export function faqPageId(site: URL, pathname: string): string {
	return schemaId(site, pathname, 'faq');
}

export function pageOfferId(site: URL, pathname: string): string {
	return schemaId(site, pathname, 'offer');
}

export function coreServiceId(site: URL, slug: string): string {
	return schemaId(site, `/${slug}/`, 'service');
}

export function coreOfferId(site: URL, slug: string): string {
	return schemaId(site, '/', `offer-${slug}`);
}

export function serviceMetadata(slug: string) {
	return CORE_SERVICE_SCHEMA[slug as CoreServiceSlug];
}

export function graphJsonLd(graph: Array<SchemaNode | undefined>): SchemaNode {
	return {
		'@context': SCHEMA_CONTEXT,
		'@graph': graph.filter(Boolean),
	};
}

function validHttpUrl(value: unknown): value is string {
	if (typeof value !== 'string' || !value.trim()) return false;
	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
}

export function sameAsUrls(config?: CmsConfig | null): string[] {
	return [config?.footer?.instagram, config?.footer?.youtube].filter(validHttpUrl);
}

export function siteEntityJsonLd(site: URL, config?: CmsConfig | null): SchemaNode {
	const email = config?.contact?.email?.trim();
	const sameAs = sameAsUrls(config);
	const person = personId(site);

	return graphJsonLd([
		{
			'@type': 'Person',
			'@id': person,
			name: config?.brand?.name ?? 'Kim Marie Borger',
			jobTitle: 'Bratschistin',
			hasOccupation: {
				'@type': 'Occupation',
				name: 'Bratschistin',
			},
			description: config?.seo?.description,
			email: email ? `mailto:${email}` : undefined,
			url: pageUrl(site, '/ueber-mich/'),
			image: new URL(DEFAULT_PERSON_IMAGE, site).href,
			mainEntityOfPage: nodeRef(profilePageId(site)),
			knowsLanguage: [SITE_LANGUAGE],
			contactPoint: email ? {
				'@type': 'ContactPoint',
				email,
				contactType: 'booking request',
				areaServed: 'DE',
				availableLanguage: [SITE_LANGUAGE],
			} : undefined,
			hasOfferCatalog: nodeRef(offerCatalogId(site)),
			...(sameAs.length ? { sameAs } : {}),
			knowsAbout: ['Viola', 'Bratsche', 'Hochzeitsmusik', 'Trauermusik', 'Kammermusik', 'Musikunterricht'],
			award: [
				'Jugend musiziert Regionalwettbewerb 2023: 1. Preis',
				'Jugend musiziert Landeswettbewerb 2023: 1. Preis',
				'Jugend musiziert Bundeswettbewerb 2023: 4. Preis',
				'Jugend musiziert Regionalwettbewerb 2025: 1. Preis',
				'Jugend musiziert Landeswettbewerb 2025: 2. Preis',
			],
		},
		{
			'@type': 'WebSite',
			'@id': websiteId(site),
			name: config?.seo?.title ?? 'Kim Marie Borger · Viola',
			url: pageUrl(site, '/'),
			inLanguage: SITE_LANGUAGE,
			publisher: nodeRef(person),
			about: nodeRef(person),
		},
	]);
}

export function offerCatalogNode(site: URL): SchemaNode {
	return {
		'@type': 'OfferCatalog',
		'@id': offerCatalogId(site),
		name: 'Leistungen von Kim Marie Borger',
		url: pageUrl(site, '/leistungen/'),
		itemListElement: CORE_SERVICE_SLUGS.map((slug, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: coreOfferNode(site, slug),
		})),
	};
}

export function coreOfferNode(site: URL, slug: CoreServiceSlug): SchemaNode {
	const service = CORE_SERVICE_SCHEMA[slug];

	return {
		'@type': 'Offer',
		'@id': coreOfferId(site, slug),
		name: service.name,
		url: pageUrl(site, `/${slug}/`),
		offeredBy: nodeRef(personId(site)),
		itemOffered: nodeRef(coreServiceId(site, slug)),
		areaServed: COUNTRY_AREA,
	};
}

export function coreServiceNode(site: URL, slug: string, description?: string): SchemaNode | undefined {
	const service = serviceMetadata(slug);
	if (!service) return undefined;

	return {
		'@type': 'Service',
		'@id': coreServiceId(site, slug),
		name: service.name,
		description: description ?? service.description,
		serviceType: service.serviceType,
		provider: nodeRef(personId(site)),
		areaServed: COUNTRY_AREA,
		url: pageUrl(site, `/${slug}/`),
		offers: nodeRef(coreOfferId(site, slug)),
		inLanguage: SITE_LANGUAGE,
	};
}

export function pageOfferNode(
	site: URL,
	pathname: string,
	options: {
		name: string;
		description?: string;
		serviceSlug: string;
		areaServed?: SchemaNode;
	},
): SchemaNode {
	return {
		'@type': 'Offer',
		'@id': pageOfferId(site, pathname),
		name: options.name,
		description: options.description,
		url: pageUrl(site, pathname),
		offeredBy: nodeRef(personId(site)),
		itemOffered: nodeRef(coreServiceId(site, options.serviceSlug)),
		...(options.areaServed ? { areaServed: options.areaServed } : {}),
		inLanguage: SITE_LANGUAGE,
	};
}

export function breadcrumbListNode(
	site: URL,
	pathname: string,
	items: Array<{ name: string; item: string }>,
): SchemaNode {
	return {
		'@type': 'BreadcrumbList',
		'@id': breadcrumbId(site, pathname),
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.item,
		})),
	};
}

export function webPageNode(
	site: URL,
	pathname: string,
	options: {
		type?: 'WebPage' | 'ProfilePage' | 'ContactPage' | 'CollectionPage';
		name: string;
		description?: string;
		mainEntityId?: string;
		aboutIds?: string[];
	},
): SchemaNode {
	const type = options.type ?? 'WebPage';
	const id = type === 'ProfilePage' ? profilePageId(site) : webPageId(site, pathname);
	const about = options.aboutIds?.map(nodeRef);

	return {
		'@type': type,
		'@id': id,
		url: pageUrl(site, pathname),
		name: options.name,
		description: options.description,
		inLanguage: SITE_LANGUAGE,
		isPartOf: nodeRef(websiteId(site)),
		...(options.mainEntityId ? { mainEntity: nodeRef(options.mainEntityId) } : {}),
		...(about && about.length === 1 ? { about: about[0] } : {}),
		...(about && about.length > 1 ? { about } : {}),
		...(pathname !== '/' ? { breadcrumb: nodeRef(breadcrumbId(site, pathname)) } : {}),
	};
}
