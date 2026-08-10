import type { CmsPage } from './data';
import { applySeoPageOverride, type SeoPageOverride } from './seo-overrides';
import {
	breadcrumbListNode,
	coreServiceId,
	courseNode,
	graphJsonLd,
	pageOfferNode,
	pageUrl,
	personId,
	webPageNode,
} from './schema';

type PageData = NonNullable<CmsPage>;
type AnyBlock = Record<string, any>;

export type LocalServiceSlug =
	| 'hochzeiten'
	| 'beerdigungen'
	| 'firmenfeiern'
	| 'geburtstage'
	| 'taufen'
	| 'konzerte'
	| 'unterricht';

export interface LocalSeoService {
	slug: LocalServiceSlug;
	baseSlug: string;
	parentLabel: string;
	keyword: string;
	serviceType: string;
	linkHeading: string;
}

export interface LocalSeoLocation {
	name: string;
	slug: string;
	kind: 'city' | 'county' | 'region' | 'state';
	locative: string;
	cue: string;
}

export interface LocalSeoPage {
	service: LocalSeoService;
	location: LocalSeoLocation;
}

export interface LocalSeoLocationHubGroup {
	title: string;
	description: string;
	pages: LocalSeoPage[];
}

export const LOCAL_SERVICES: LocalSeoService[] = [
	{
		slug: 'hochzeiten',
		baseSlug: 'hochzeiten',
		parentLabel: 'Hochzeit',
		keyword: 'Hochzeitsmusik',
		serviceType: 'Hochzeitsmusik mit Live-Viola',
		linkHeading: 'Hochzeitsmusik vor Ort',
	},
	{
		slug: 'beerdigungen',
		baseSlug: 'beerdigungen',
		parentLabel: 'Beerdigung / Trauerfeier',
		keyword: 'Trauermusik',
		serviceType: 'Trauermusik für Beerdigungen und Trauerfeiern',
		linkHeading: 'Trauermusik vor Ort',
	},
	{
		slug: 'firmenfeiern',
		baseSlug: 'firmenfeiern',
		parentLabel: 'Firmenfeier',
		keyword: 'Live Musik Firmenevent',
		serviceType: 'Live-Musik für Firmenfeiern und Business-Events',
		linkHeading: 'Firmenevents vor Ort',
	},
	{
		slug: 'geburtstage',
		baseSlug: 'geburtstage',
		parentLabel: 'Geburtstag',
		keyword: 'Live Musik Geburtstag',
		serviceType: 'Live-Musik für Geburtstage und private Feiern',
		linkHeading: 'Geburtstagsmusik vor Ort',
	},
	{
		slug: 'taufen',
		baseSlug: 'taufen',
		parentLabel: 'Taufe',
		keyword: 'Taufmusik',
		serviceType: 'Musik zur Taufe mit Live-Viola',
		linkHeading: 'Taufmusik vor Ort',
	},
	{
		slug: 'konzerte',
		baseSlug: 'konzerte',
		parentLabel: 'Konzert / Event',
		keyword: 'Viola Konzert',
		serviceType: 'Konzerte und Events mit Viola',
		linkHeading: 'Konzerte & Events vor Ort',
	},
	{
		slug: 'unterricht',
		baseSlug: 'unterricht',
		parentLabel: 'Unterricht',
		keyword: 'Geigenunterricht',
		serviceType: 'Geigen- und Bratschenunterricht',
		linkHeading: 'Geigenunterricht vor Ort',
	},
];

export const LOCAL_LOCATIONS: LocalSeoLocation[] = [
	{
		name: 'Düsseldorf',
		slug: 'duesseldorf',
		kind: 'city',
		locative: 'in Düsseldorf',
		cue: 'zwischen Standesamt, Altstadt, Rheinufer, Schloss Benrath und modernen Eventlocations',
	},
	{
		name: 'Erkrath',
		slug: 'erkrath',
		kind: 'city',
		locative: 'in Erkrath',
		cue: 'zwischen Neandertal, Hochdahl, Unterfeldhaus und der Nähe zu Düsseldorf',
	},
	{
		name: 'Ratingen',
		slug: 'ratingen',
		kind: 'city',
		locative: 'in Ratingen',
		cue: 'zwischen historischer Altstadt, Hösel, Lintorf und dem Düsseldorfer Norden',
	},
	{
		name: 'Köln',
		slug: 'koeln',
		kind: 'city',
		locative: 'in Köln',
		cue: 'zwischen Rhein, Altstadt, Belgischem Viertel und besonderen Locations im Rheinland',
	},
	{
		name: 'Essen',
		slug: 'essen',
		kind: 'city',
		locative: 'in Essen',
		cue: 'zwischen Baldeneysee, Villa Hügel, Rüttenscheid und urbanen Orten im Ruhrgebiet',
	},
	{
		name: 'Dortmund',
		slug: 'dortmund',
		kind: 'city',
		locative: 'in Dortmund',
		cue: 'zwischen Phoenix-See, Innenstadt, Westfalenhallen und festlichen Räumen im Ruhrgebiet',
	},
	{
		name: 'Duisburg',
		slug: 'duisburg',
		kind: 'city',
		locative: 'in Duisburg',
		cue: 'zwischen Innenhafen, Rhein, Landschaftspark und Rhein-Ruhr-Atmosphäre',
	},
	{
		name: 'Bochum',
		slug: 'bochum',
		kind: 'city',
		locative: 'in Bochum',
		cue: 'zwischen Stiepel, Ruhrtal, Innenstadt und besonderen Räumen rund um die Jahrhunderthalle',
	},
	{
		name: 'Wuppertal',
		slug: 'wuppertal',
		kind: 'city',
		locative: 'in Wuppertal',
		cue: 'zwischen Elberfeld, Barmen, grünen Höhen und der Weite des Bergischen Landes',
	},
	{
		name: 'Leverkusen',
		slug: 'leverkusen',
		kind: 'city',
		locative: 'in Leverkusen',
		cue: 'zwischen Schloss Morsbroich, Rhein, Opladen und der Nähe zu Köln und Düsseldorf',
	},
	{
		name: 'Oberhausen',
		slug: 'oberhausen',
		kind: 'city',
		locative: 'in Oberhausen',
		cue: 'zwischen Gasometer, Centro, Schloss Oberhausen und zentralen Orten im Ruhrgebiet',
	},
	{
		name: 'Krefeld',
		slug: 'krefeld',
		kind: 'city',
		locative: 'in Krefeld',
		cue: 'zwischen Linn, Stadtwald, Seidenweberhaus und dem Niederrhein',
	},
	{
		name: 'Mönchengladbach',
		slug: 'moenchengladbach',
		kind: 'city',
		locative: 'in Mönchengladbach',
		cue: 'zwischen Schloss Rheydt, Kaiser-Friedrich-Halle, Wickrath und dem linken Niederrhein',
	},
	{
		name: 'Moers',
		slug: 'moers',
		kind: 'city',
		locative: 'in Moers',
		cue: 'zwischen Schlosspark, Altstadt, Niederrhein und kurzen Wegen nach Duisburg',
	},
	{
		name: 'Gelsenkirchen',
		slug: 'gelsenkirchen',
		kind: 'city',
		locative: 'in Gelsenkirchen',
		cue: 'zwischen Schloss Horst, Buer, Revierparks und gewachsenen Orten im Ruhrgebiet',
	},
	{
		name: 'Bergisch Gladbach',
		slug: 'bergisch-gladbach',
		kind: 'city',
		locative: 'in Bergisch Gladbach',
		cue: 'zwischen Bensberg, Refrath, Köln-Nähe und dem Eingang ins Bergische Land',
	},
	{
		name: 'Solingen',
		slug: 'solingen',
		kind: 'city',
		locative: 'in Solingen',
		cue: 'zwischen Schloss Burg, Müngsten, Gräfrath und bergischen Feierräumen',
	},
	{
		name: 'Remscheid',
		slug: 'remscheid',
		kind: 'city',
		locative: 'in Remscheid',
		cue: 'zwischen Lennep, Müngsten, Eschbachtal und dem Bergischen Land',
	},
	{
		name: 'Mettmann',
		slug: 'mettmann',
		kind: 'city',
		locative: 'in Mettmann',
		cue: 'zwischen Altstadt, Neandertal und den kurzen Wegen im Kreis Mettmann',
	},
	{
		name: 'Hilden',
		slug: 'hilden',
		kind: 'city',
		locative: 'in Hilden',
		cue: 'zwischen Stadtpark, alter Innenstadt und der Nähe zu Düsseldorf, Erkrath und Langenfeld',
	},
	{
		name: 'Dormagen',
		slug: 'dormagen',
		kind: 'city',
		locative: 'in Dormagen',
		cue: 'zwischen Zons, Rhein, Knechtsteden und dem Rhein-Kreis Neuss',
	},
	{
		name: 'Neuss',
		slug: 'neuss',
		kind: 'city',
		locative: 'in Neuss',
		cue: 'zwischen Quirinus-Münster, Rhein, Hafen und der direkten Nähe zu Düsseldorf',
	},
	{
		name: 'Meerbusch',
		slug: 'meerbusch',
		kind: 'city',
		locative: 'in Meerbusch',
		cue: 'zwischen Büderich, Lank, Rheinwiesen und stilvollen Orten am linken Niederrhein',
	},
	{
		name: 'Haan',
		slug: 'haan',
		kind: 'city',
		locative: 'in Haan',
		cue: 'zwischen Gartenstadt, Gruiten, Hilden und dem Bergischen Übergang',
	},
	{
		name: 'Langenfeld',
		slug: 'langenfeld',
		kind: 'city',
		locative: 'in Langenfeld',
		cue: 'zwischen Düsseldorf, Köln, Monheim und Leichlingen',
	},
	{
		name: 'Monheim am Rhein',
		slug: 'monheim-am-rhein',
		kind: 'city',
		locative: 'in Monheim am Rhein',
		cue: 'zwischen Rheinpromenade, Altstadt, Baumberg und der Achse Düsseldorf-Köln',
	},
	{
		name: 'Velbert',
		slug: 'velbert',
		kind: 'city',
		locative: 'in Velbert',
		cue: 'zwischen Langenberg, Neviges, Niederberg und grünen Höhen nahe Essen und Wuppertal',
	},
	{
		name: 'Wülfrath',
		slug: 'wuelfrath',
		kind: 'city',
		locative: 'in Wülfrath',
		cue: 'zwischen Niederberg, Mettmann, Velbert und dem Kalksteinrevier',
	},
	{
		name: 'Heiligenhaus',
		slug: 'heiligenhaus',
		kind: 'city',
		locative: 'in Heiligenhaus',
		cue: 'zwischen Abtsküche, Ratingen, Velbert und den ruhigen Orten im Niederbergischen',
	},
	{
		name: 'Mülheim an der Ruhr',
		slug: 'muelheim-an-der-ruhr',
		kind: 'city',
		locative: 'in Mülheim an der Ruhr',
		cue: 'zwischen Ruhrtal, Schloss Broich, Altstadt und kurzen Wegen nach Essen und Duisburg',
	},
	{
		name: 'Bottrop',
		slug: 'bottrop',
		kind: 'city',
		locative: 'in Bottrop',
		cue: 'zwischen Stadtgarten, Kirchhellen, Ruhrgebiet und dem Übergang zum Münsterland',
	},
	{
		name: 'Herne',
		slug: 'herne',
		kind: 'city',
		locative: 'in Herne',
		cue: 'zwischen Schloss Strünkede, Wanne-Eickel, Bochum und Recklinghausen',
	},
	{
		name: 'Hagen',
		slug: 'hagen',
		kind: 'city',
		locative: 'in Hagen',
		cue: 'zwischen Hohenlimburg, Volmetal, Ruhrgebiet und dem Rand des Sauerlands',
	},
	{
		name: 'Aachen',
		slug: 'aachen',
		kind: 'city',
		locative: 'in Aachen',
		cue: 'zwischen Dom, Altstadt, Kurpark und besonderen Orten im Dreiländereck',
	},
	{
		name: 'Bonn',
		slug: 'bonn',
		kind: 'city',
		locative: 'in Bonn',
		cue: 'zwischen Rhein, Südstadt, Bad Godesberg und feierlichen Räumen der Beethovenstadt',
	},
	{
		name: 'Münster',
		slug: 'muenster',
		kind: 'city',
		locative: 'in Münster',
		cue: 'zwischen Prinzipalmarkt, Aasee, Altstadt und dem Münsterland',
	},
	{
		name: 'Bielefeld',
		slug: 'bielefeld',
		kind: 'city',
		locative: 'in Bielefeld',
		cue: 'zwischen Sparrenburg, Altstadt, Teutoburger Wald und Ostwestfalen',
	},
	{
		name: 'Paderborn',
		slug: 'paderborn',
		kind: 'city',
		locative: 'in Paderborn',
		cue: 'zwischen Dom, Paderquellen, Schloss Neuhaus und Ostwestfalen',
	},
	{
		name: 'Siegen',
		slug: 'siegen',
		kind: 'city',
		locative: 'in Siegen',
		cue: 'zwischen Oberem Schloss, Unterem Schloss, Siegerland und waldigen Höhen',
	},
	{
		name: 'Iserlohn',
		slug: 'iserlohn',
		kind: 'city',
		locative: 'in Iserlohn',
		cue: 'zwischen Waldstadt, Seilersee, Sauerland-Rand und Märkischem Kreis',
	},
	{
		name: 'Unna',
		slug: 'unna',
		kind: 'city',
		locative: 'in Unna',
		cue: 'zwischen Hellweg, Altstadt, Dortmund-Nähe und östlichem Ruhrgebiet',
	},
	{
		name: 'Recklinghausen',
		slug: 'recklinghausen',
		kind: 'city',
		locative: 'in Recklinghausen',
		cue: 'zwischen Altstadt, Vest, Ruhrgebiet und Münsterland-Übergang',
	},
	{
		name: 'Rhein-Kreis Neuss',
		slug: 'rhein-kreis-neuss',
		kind: 'county',
		locative: 'im Rhein-Kreis Neuss',
		cue: 'rund um Neuss, Dormagen, Meerbusch, Kaarst, Grevenbroich und den Rhein',
	},
	{
		name: 'Kreis Mettmann',
		slug: 'kreis-mettmann',
		kind: 'county',
		locative: 'im Kreis Mettmann',
		cue: 'rund um Erkrath, Ratingen, Mettmann, Hilden, Haan, Velbert und Wülfrath',
	},
	{
		name: 'Rheinland',
		slug: 'rheinland',
		kind: 'region',
		locative: 'im Rheinland',
		cue: 'zwischen Düsseldorf, Köln, Bonn, Niederrhein und Rhein-Ruhr',
	},
	{
		name: 'Ruhrgebiet',
		slug: 'ruhrgebiet',
		kind: 'region',
		locative: 'im Ruhrgebiet',
		cue: 'zwischen Essen, Dortmund, Bochum, Duisburg, Gelsenkirchen und den Städten an der Ruhr',
	},
	{
		name: 'Rhein-Ruhr',
		slug: 'rhein-ruhr',
		kind: 'region',
		locative: 'in der Region Rhein-Ruhr',
		cue: 'zwischen Rheinland und Ruhrgebiet, mit kurzen Wegen nach Düsseldorf, Köln, Essen und Dortmund',
	},
	{
		name: 'Bergisches Land',
		slug: 'bergisches-land',
		kind: 'region',
		locative: 'im Bergischen Land',
		cue: 'zwischen Wuppertal, Solingen, Remscheid, Bergisch Gladbach und grünen Höhen',
	},
	{
		name: 'Nordrhein-Westfalen',
		slug: 'nordrhein-westfalen',
		kind: 'state',
		locative: 'in Nordrhein-Westfalen',
		cue: 'von Rheinland und Ruhrgebiet bis Bergisches Land, Münsterland, Ostwestfalen und Sauerland',
	},
];

export function getLocalService(slug: string): LocalSeoService | undefined {
	return LOCAL_SERVICES.find((service) => service.slug === slug);
}

export function hasLocalService(slug: string): boolean {
	return Boolean(getLocalService(slug));
}

export function getLocalLocation(slug: string): LocalSeoLocation | undefined {
	return LOCAL_LOCATIONS.find((location) => location.slug === slug);
}

export function getLocalSeoPages(): LocalSeoPage[] {
	return LOCAL_SERVICES.flatMap((service) =>
		LOCAL_LOCATIONS.map((location) => ({ service, location })),
	);
}

export function getLocalSeoPagesForService(serviceSlug: string): LocalSeoPage[] {
	const service = getLocalService(serviceSlug);
	if (!service) return [];
	return LOCAL_LOCATIONS.map((location) => ({ service, location }));
}

const PRIMARY_LOCATION_SLUGS = [
	'duesseldorf',
	'koeln',
	'wuppertal',
	'essen',
	'dortmund',
	'duisburg',
	'neuss',
	'ratingen',
	'kreis-mettmann',
	'rheinland',
	'bergisches-land',
	'rhein-ruhr',
];

const LOCATION_HUB_GROUPS = [
	{
		title: 'Düsseldorf und Kreis Mettmann',
		description: 'Nahe Orte rund um Düsseldorf, Erkrath, Ratingen und das direkte Umfeld.',
		slugs: [
			'duesseldorf',
			'erkrath',
			'ratingen',
			'mettmann',
			'hilden',
			'haan',
			'langenfeld',
			'monheim-am-rhein',
			'velbert',
			'wuelfrath',
			'heiligenhaus',
			'kreis-mettmann',
		],
	},
	{
		title: 'Köln, Rheinland und Rhein-Kreis Neuss',
		description: 'Rheinische Städte und Regionen zwischen Köln, Neuss, Leverkusen und Bonn.',
		slugs: [
			'koeln',
			'leverkusen',
			'bergisch-gladbach',
			'dormagen',
			'neuss',
			'meerbusch',
			'moenchengladbach',
			'krefeld',
			'moers',
			'bonn',
			'aachen',
			'rhein-kreis-neuss',
			'rheinland',
		],
	},
	{
		title: 'Wuppertal und Bergisches Land',
		description: 'Bergische Orte mit kurzen Wegen nach Wuppertal, Solingen und Remscheid.',
		slugs: [
			'wuppertal',
			'solingen',
			'remscheid',
			'bergisches-land',
		],
	},
	{
		title: 'Ruhrgebiet und Rhein-Ruhr',
		description: 'Großstädte und Regionen im Ruhrgebiet und im weiteren Rhein-Ruhr-Raum.',
		slugs: [
			'essen',
			'dortmund',
			'duisburg',
			'bochum',
			'oberhausen',
			'gelsenkirchen',
			'muelheim-an-der-ruhr',
			'bottrop',
			'herne',
			'hagen',
			'recklinghausen',
			'ruhrgebiet',
			'rhein-ruhr',
		],
	},
	{
		title: 'Weitere NRW-Orte',
		description: 'Weitere relevante Orte und Regionen in Nordrhein-Westfalen.',
		slugs: [
			'muenster',
			'bielefeld',
			'paderborn',
			'siegen',
			'iserlohn',
			'unna',
			'nordrhein-westfalen',
		],
	},
];

const LOCAL_CONTEXT_SLUGS: Record<string, string[]> = {
	duesseldorf: ['koeln', 'wuppertal', 'neuss', 'ratingen', 'kreis-mettmann', 'rheinland'],
	koeln: ['duesseldorf', 'wuppertal', 'leverkusen', 'bergisch-gladbach', 'rheinland', 'rhein-ruhr'],
	wuppertal: ['duesseldorf', 'koeln', 'solingen', 'remscheid', 'bergisches-land', 'kreis-mettmann'],
};

const RELATED_SERVICE_SLUGS: Record<LocalServiceSlug, LocalServiceSlug[]> = {
	hochzeiten: ['beerdigungen', 'taufen', 'geburtstage', 'firmenfeiern'],
	beerdigungen: ['hochzeiten', 'taufen', 'konzerte', 'geburtstage'],
	firmenfeiern: ['konzerte', 'hochzeiten', 'geburtstage', 'unterricht'],
	geburtstage: ['hochzeiten', 'taufen', 'konzerte', 'firmenfeiern'],
	taufen: ['hochzeiten', 'geburtstage', 'beerdigungen', 'unterricht'],
	konzerte: ['firmenfeiern', 'hochzeiten', 'geburtstage', 'unterricht'],
	unterricht: ['konzerte', 'hochzeiten', 'taufen', 'firmenfeiern'],
};

function pagesForServiceAndLocationSlugs(serviceSlug: string, locationSlugs: string[]): LocalSeoPage[] {
	const service = getLocalService(serviceSlug);
	if (!service) return [];
	return locationSlugs.flatMap((slug) => {
		const location = getLocalLocation(slug);
		return location ? [{ service, location }] : [];
	});
}

export function getPrimaryLocalSeoPagesForService(serviceSlug: string): LocalSeoPage[] {
	return pagesForServiceAndLocationSlugs(serviceSlug, PRIMARY_LOCATION_SLUGS);
}

export function serviceLocationsHubPath(serviceOrSlug: LocalSeoService | string): string {
	const slug = typeof serviceOrSlug === 'string' ? serviceOrSlug : serviceOrSlug.slug;
	return `/${slug}/orte/`;
}

export function getLocationHubGroupsForService(serviceSlug: string): LocalSeoLocationHubGroup[] {
	const grouped = LOCATION_HUB_GROUPS.map((group) => ({
		title: group.title,
		description: group.description,
		pages: pagesForServiceAndLocationSlugs(serviceSlug, group.slugs),
	})).filter((group) => group.pages.length > 0);

	const known = new Set(LOCATION_HUB_GROUPS.flatMap((group) => group.slugs));
	const missing = getLocalSeoPagesForService(serviceSlug)
		.filter((page) => !known.has(page.location.slug));
	if (missing.length > 0) {
		grouped.push({
			title: 'Weitere Orte',
			description: 'Zusätzliche Ortsseiten für diesen Leistungsbereich.',
			pages: missing,
		});
	}
	return grouped;
}

export function getContextLocalSeoPagesForService(
	serviceSlug: string,
	currentLocationSlug: string,
): LocalSeoPage[] {
	const contextSlugs = LOCAL_CONTEXT_SLUGS[currentLocationSlug] ?? PRIMARY_LOCATION_SLUGS;
	return pagesForServiceAndLocationSlugs(
		serviceSlug,
		contextSlugs.filter((slug) => slug !== currentLocationSlug),
	).slice(0, 8);
}

export function getRelatedLocalSeoPagesForLocation(
	serviceSlug: string,
	locationSlug: string,
): LocalSeoPage[] {
	const location = getLocalLocation(locationSlug);
	if (!location) return [];
	const service = getLocalService(serviceSlug);
	if (!service) return [];
	return RELATED_SERVICE_SLUGS[service.slug]
		.flatMap((slug) => {
			const relatedService = getLocalService(slug);
			return relatedService ? [{ service: relatedService, location }] : [];
		})
		.slice(0, 4);
}

export function getLocalSeoPagesForLocation(locationSlug: string): LocalSeoPage[] {
	const location = getLocalLocation(locationSlug);
	if (!location) return [];
	return LOCAL_SERVICES.map((service) => ({ service, location }));
}

export function getLocalSeoPage(serviceSlug: string, locationSlug: string): LocalSeoPage | undefined {
	const service = getLocalService(serviceSlug);
	const location = getLocalLocation(locationSlug);
	return service && location ? { service, location } : undefined;
}

export function localPagePath(service: LocalSeoService, location: LocalSeoLocation): string {
	return `/${service.slug}/${location.slug}/`;
}

export function keywordLabel(service: LocalSeoService, location: LocalSeoLocation): string {
	switch (service.slug) {
		case 'hochzeiten':
			return `Hochzeitsmusik ${location.name}`;
		case 'beerdigungen':
			return `Trauermusik ${location.name}`;
		case 'firmenfeiern':
			return `Live Musik Firmenevent ${location.name}`;
		case 'geburtstage':
			return `Live Musik Geburtstag ${location.name}`;
		case 'taufen':
			return `Taufmusik ${location.name}`;
		case 'konzerte':
			return `Viola Konzert ${location.name}`;
		case 'unterricht':
			return `Geigenunterricht ${location.name}`;
	}
}

function compactLocalSeoTitle(serviceSlug: LocalServiceSlug, locationName: string): string | undefined {
	switch (serviceSlug) {
		case 'hochzeiten':
			return `Hochzeitsmusik ${locationName} | Viola für Trauung`;
		case 'beerdigungen':
			return `Trauermusik ${locationName} | Viola für Abschied`;
		case 'firmenfeiern':
			return `Live Musik Firmenevent ${locationName} | Live-Viola fürs Event`;
		case 'geburtstage':
			return `Live Musik Geburtstag ${locationName} | Viola für Feiern`;
		case 'taufen':
			return `Taufmusik ${locationName} | Viola zur Taufe`;
		case 'konzerte':
			return `Viola Konzert ${locationName} | Viola für Events`;
		case 'unterricht':
			return `Geigenunterricht ${locationName} | Geige lernen`;
	}
}

function compactLocalSeoDescription(
	serviceSlug: LocalServiceSlug,
	keyword: string,
	locative: string,
): string | undefined {
	switch (serviceSlug) {
		case 'hochzeiten':
			return `${keyword}: Solo-Viola für Trauung, Empfang und Dinner ${locative}. Anfrage kostenlos, Preis nach Rahmen.`;
		case 'beerdigungen':
			return `${keyword}: würdevolle Viola für Trauerfeier, Beerdigung und Abschied ${locative}. Schnelle Rückmeldung.`;
		case 'firmenfeiern':
			return `${keyword}: Solo-Viola für Empfang, Dinner, Jubiläum und Messe ${locative}. Anfrage kostenlos.`;
		case 'geburtstage':
			return `${keyword}: Solo-Viola für Geburtstag, Dinner, Empfang und Überraschung ${locative}. Anfrage kostenlos.`;
		case 'taufen':
			return `${keyword}: sanfte Viola für Taufe, Segnung und Familienfeier ${locative}. Anfrage kostenlos.`;
		case 'konzerte':
			return `${keyword}: kuratiertes Viola-Programm für Vernissage, Lesung und Kulturabend ${locative}. Anfrage kostenlos.`;
		case 'unterricht':
			return `${keyword}: Geigen- und Bratschenunterricht für Kinder, Erwachsene und Wiedereinstieg ${locative}. Probestunde kostenlos.`;
	}
}

export function localSeoTitle(page: LocalSeoPage, override?: SeoPageOverride): string {
	if (override?.seoTitle && override.seoTitle.length <= 68) return override.seoTitle;
	const { service, location } = page;
	const compactTitle = compactLocalSeoTitle(service.slug, location.name);
	if (compactTitle) return compactTitle;
	switch (service.slug) {
		case 'hochzeiten':
			return `Hochzeitsmusik ${location.name} | Viola für Trauung & Empfang`;
		case 'beerdigungen':
			return `Trauermusik ${location.name} | Viola für Beerdigung & Abschied`;
		case 'firmenfeiern':
			return `Firmenevent ${location.name} | Live-Viola für Empfang & Dinner`;
		case 'geburtstage':
			return `Live Musik Geburtstag ${location.name} | Viola für private Feiern`;
		case 'taufen':
			return `Taufmusik ${location.name} | Musik zur Taufe mit Viola`;
		case 'konzerte':
			return `Viola Konzert ${location.name} | Musik für Event & Kulturabend`;
		case 'unterricht':
			return `Geigenunterricht ${location.name} | Geige lernen`;
	}
}

export function localSeoDescription(page: LocalSeoPage, override?: SeoPageOverride): string {
	if (override?.seoDescription && override.seoDescription.length <= 170) return override.seoDescription;
	const { service, location } = page;
	const compactDescription = compactLocalSeoDescription(service.slug, keywordLabel(service, location), location.locative);
	if (compactDescription) return compactDescription;
	switch (service.slug) {
		case 'hochzeiten':
			return `Hochzeitsmusik ${location.locative}: Live-Viola für Einzug, Trauung, Ringtausch, Auszug, Sektempfang und Dinner. Persönlich abgestimmt mit Wunschlied.`;
		case 'beerdigungen':
			return `Trauermusik ${location.locative}: würdevolle Viola-Begleitung für Trauerfeier, Beerdigung, Bestattung und letzten Abschied. Behutsam und zuverlässig.`;
		case 'firmenfeiern':
			return `Live Musik für Firmenevents ${location.locative}: dezente Viola für Empfang, Dinner, Jubiläum, Messe, Eröffnung und repräsentative Business-Anlässe.`;
		case 'geburtstage':
			return `Live Musik zum Geburtstag ${location.locative}: Viola für private Feiern, Gartenfeste, Sektempfang, Dinner und musikalische Überraschungen.`;
		case 'taufen':
			return `Taufmusik ${location.locative}: sanfte Live-Viola für Taufe, Segnung, Willkommensfest, Gottesdienst und Familienfeier. Warm, ruhig und persönlich.`;
		case 'konzerte':
			return `Viola Konzert ${location.locative}: kuratierte Musik für Vernissage, Lesung, Salonkonzert, Kulturabend und besondere Events.`;
		case 'unterricht':
			return `Geigenunterricht ${location.locative}: individueller Geigen-, Bratschen- und Musikunterricht für Anfänger, Kinder, Erwachsene und Fortgeschrittene.`;
	}
}

export function buildLocalSeoPage(page: LocalSeoPage, basePage: PageData, override?: SeoPageOverride): PageData {
	const clone = JSON.parse(JSON.stringify(basePage)) as PageData;
	clone.bodyClass = [clone.bodyClass, 'page-local-seo'].filter(Boolean).join(' ');
	clone.blocks = (clone.blocks ?? [])
		.filter(Boolean)
		.map((block) => rewriteBlock(block as AnyBlock, page) as any);
	const merged = applySeoPageOverride(clone, override);
	merged.seoTitle = localSeoTitle(page, override);
	merged.seoDescription = localSeoDescription(page, override);
	return merged;
}

function areaServedForLocation(location: LocalSeoLocation) {
	const type = location.kind === 'city'
		? 'City'
		: location.kind === 'region'
			? 'Place'
			: 'AdministrativeArea';

	return { '@type': type, name: location.name };
}

export function localSeoJsonLd(site: URL, page: LocalSeoPage, override?: SeoPageOverride): object {
	const { service, location } = page;
	const pathname = localPagePath(service, location);
	const offer = pageOfferNode(site, pathname, {
		name: `${service.serviceType} ${location.locative}`,
		description: localSeoDescription(page, override),
		serviceSlug: service.slug,
		areaServed: areaServedForLocation(location),
	});
	const offerId = offer['@id'] as string;

	return graphJsonLd([
		breadcrumbListNode(site, pathname, [
			{ name: 'Start', item: pageUrl(site, '/') },
			{ name: service.parentLabel, item: pageUrl(site, `/${service.baseSlug}/`) },
			{ name: keywordLabel(service, location), item: pageUrl(site, pathname) },
		]),
		webPageNode(site, pathname, {
			name: keywordLabel(service, location),
			description: localSeoDescription(page, override),
			mainEntityId: offerId,
			aboutIds: [personId(site), coreServiceId(site, service.slug)],
		}),
		offer,
		// Unterricht ist das groesste Keyword-Cluster; Course-Markup ist dort das
		// einzige Rich-Result-Format, das Google fuer diese Seiten anbietet.
		service.slug === 'unterricht'
			? courseNode(site, pathname, {
					name: keywordLabel(service, location),
					description: localSeoDescription(page, override),
					areaServed: areaServedForLocation(location),
				})
			: undefined,
	]);
}

function rewriteBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	switch (page.service.slug) {
		case 'hochzeiten':
			return rewriteWeddingBlock(block, page);
		case 'beerdigungen':
			return rewriteFuneralBlock(block, page);
		case 'firmenfeiern':
			return rewriteCorporateBlock(block, page);
		case 'geburtstage':
			return rewriteBirthdayBlock(block, page);
		case 'taufen':
			return rewriteBaptismBlock(block, page);
		case 'konzerte':
			return rewriteConcertBlock(block, page);
		case 'unterricht':
			return rewriteTeachingBlock(block, page);
	}
}

function rewriteWeddingBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Hochzeit ${location.locative}`,
				title: `Hochzeitsmusik ${location.locative}\nfür Trauung & Empfang.`,
				lead: `Live-Viola für Einzug, Ja-Wort, Ringtausch, Auszug, Sektempfang und Dinner - passend zu eurem Tag ${location.locative}.`,
				badge: 'Erstgespräch kostenlos & unverbindlich',
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Eure Trauung ${location.locative},\nals Musik erzählt.`,
				lede: `Ob ${location.cue}: Eine Hochzeit lebt von Momenten, die nicht wiederholbar sind. Live gespielte Viola macht genau diese Augenblicke größer, wärmer und persönlicher.`,
				paragraphs: [
					`Gemeinsam planen wir die Musik für euren Ablauf ${location.locative}: Einzug der Braut, Ringtausch, Ja-Wort, Unterschrift, Auszug, Gratulationen oder Sektempfang. So entsteht kein Standardprogramm, sondern ein musikalischer roter Faden für euren Tag.`,
					`Klassische Stücke, moderne Songs oder euer Lieblingslied arrangiere ich so, dass es zur Location, zur Zeremonie und zu euch passt. Gerade als Solo-Viola bleibt die Musik elegant, nah und nie zu laut.`,
				],
				seal: 'euer\nLieblingslied\nlive',
			};
		case 'PageBlocksTimeline':
			return {
				...block,
				eyebrow: 'Der musikalische Ablauf',
				title: `Von Einzug bis Sektempfang\n${location.locative}.`,
				lead: `Für jede Phase eurer Hochzeit ${location.locative} wähle ich mit euch Stücke, die den Moment tragen, ohne ihn zu überladen.`,
				items: [
					{
						kicker: 'Der Anfang',
						title: 'Einzug',
						text: 'Getragen, festlich und mit genug Ruhe für den Moment, in dem alle aufstehen.',
						piece: 'z. B. Canon in D · Pachelbel',
					},
					{
						kicker: 'Das Versprechen',
						title: 'Trauung & Ringe',
						text: 'Leise Musik für Ringtausch, Ja-Wort oder Unterschrift - flexibel abgestimmt auf den Ablauf.',
						piece: 'z. B. Marry You · Bruno Mars',
					},
					{
						kicker: 'Der Jubel',
						title: 'Auszug',
						text: 'Hell, leicht und festlich, wenn aus der Zeremonie der erste gemeinsame Schritt wird.',
						piece: 'z. B. Salut d’Amour · Elgar',
					},
					{
						kicker: 'Das Ankommen',
						title: 'Sektempfang & Dinner',
						text: `Dezente Live-Musik für Glückwünsche, Gespräche und den Empfang ${location.locative}.`,
						piece: 'moderne Arrangements nach Wunsch',
					},
				],
			};
		case 'PageBlocksSetlist':
			return {
				...block,
				title: `Repertoire für eure Hochzeit ${location.locative}.`,
				lead: 'Klassisch, modern oder sehr persönlich: Die Auswahl entsteht aus eurer Geschichte, euren Wünschen und dem Charakter der Location.',
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Hochzeitsmusik ${location.locative}.`,
				items: [
					{
						question: `Spielst du Hochzeitsmusik ${location.locative}?`,
						answer: `Ja. Ich begleite Hochzeiten ${location.locative} und stimme Ablauf, Stücke und Einsätze vorab mit euch, der Location, dem Standesamt, der Kirche oder der Traurednerin ab.`,
						open: true,
					},
					{
						question: 'Passt Viola zu Standesamt, Kirche und freier Trauung?',
						answer: 'Ja. Die Viola klingt warm, elegant und nah an der menschlichen Stimme. Sie passt besonders gut zu Einzug, Ringtausch, Ja-Wort, Unterschrift und Auszug.',
					},
					{
						question: 'Können wir unser Lieblingslied hören?',
						answer: 'Sehr gern. Wenn das Stück musikalisch passt, arrangiere ich es für Solo-Viola und binde es an der Stelle ein, an der es für euch am meisten bedeutet.',
					},
					{
						question: 'Wie früh sollten wir anfragen?',
						answer: `Für Hochzeiten ${location.locative} lohnt sich eine frühe Anfrage, besonders für Samstage in der Saison. Wenn euer Datum steht, könnt ihr unverbindlich schreiben.`,
					},
				],
			};
		default:
			return block;
	}
}

function rewriteFuneralBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Beerdigung & Trauerfeier ${location.locative}`,
				title: `Trauermusik ${location.locative}\nfür einen würdevollen Abschied.`,
				lead: `Warme Viola-Klänge für Trauerfeier, Beerdigung, Bestattung oder Abschied ${location.locative} - behutsam, ruhig und zuverlässig.`,
			};
		case 'PageBlocksElegy':
			return {
				...block,
				quote: 'Ein einzelner warmer Klang kann halten, was in schweren Momenten kaum aussprechbar ist.',
				passages: [
					{
						strong: 'Worum es geht',
						text: `Trauermusik ${location.locative} braucht keine große Geste, sondern einen Klang, der trägt. Die Viola ist dunkel, warm und zurückhaltend - passend für Trauerhalle, Kirche, Kapelle, Friedhof oder freie Abschiedsfeier.`,
					},
					{
						strong: 'Wie es abläuft',
						text: `Ihr oder das Bestattungshaus meldet euch mit Datum, Ort und gewünschtem Rahmen. Danach kläre ich Einsätze, Stücke und Ablauf direkt und unaufdringlich, damit die Familie entlastet ist.`,
					},
					{
						strong: 'Auch kurzfristig',
						text: `Abschiede lassen sich oft nicht lange planen. Für Trauerfeiern ${location.locative} prüfe ich kurzfristige Anfragen schnell und ehrlich.`,
					},
				],
			};
		case 'PageBlocksSolemn':
			return {
				...block,
				eyebrow: `In schweren Stunden ${location.locative}`,
				title: 'Ihr müsst euch um die Musik nicht kümmern.',
				cards: [
					{
						rom: 'Vorab',
						title: 'Ruhige Absprache',
						poet: `Ein kurzes Gespräch genügt - gern auch über Bestattungshaus, Pfarrer:in oder Trauerredner:in ${location.locative}.`,
					},
					{
						rom: 'Am Tag',
						title: 'Stille Gegenwart',
						poet: 'Die Musik ist präsent, aber nie aufdringlich. Sie begleitet den Moment, ohne ihn zu überdecken.',
					},
				],
				listLabel: `Oft gewünschte Stücke für Trauerfeiern ${location.locative}`,
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Trauermusik ${location.locative}.`,
				items: [
					{
						question: `Begleitest du Trauerfeiern ${location.locative}?`,
						answer: `Ja. Ich spiele Trauermusik ${location.locative} in Trauerhallen, Kirchen, Kapellen, am Grab oder bei freien Abschiedsfeiern.`,
						open: true,
					},
					{
						question: 'Kannst du dich mit dem Bestattungshaus abstimmen?',
						answer: 'Ja. Ablauf, Einsätze, Ankunft und Stückauswahl kläre ich gern direkt mit Bestatter:in, Pfarrer:in oder Trauerredner:in.',
					},
					{
						question: 'Welche Stücke passen zur Beerdigung?',
						answer: 'Häufig gewünscht sind Ave Maria, Air, Méditation, Amazing Grace oder ein persönliches Lieblingsstück, das behutsam für Viola arrangiert wird.',
					},
					{
						question: 'Sind kurzfristige Anfragen möglich?',
						answer: `Oft ja. Gerade bei Beerdigungen ${location.locative} melde ich mich schnell zurück, damit ihr Planungssicherheit bekommt.`,
					},
				],
			};
		default:
			return block;
	}
}

function rewriteCorporateBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Firmenevent ${location.locative}`,
				title: `Live Musik für Firmenevents\n${location.locative}.`,
				lead: `Stilvolle Viola für Empfang, Dinner, Firmenjubiläum, Messe, Eröffnung oder Kundenevent ${location.locative} - dezent, hochwertig und planbar.`,
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Business-Events ${location.locative}\nbrauchen Atmosphäre.`,
				paragraphs: [
					`Ob ${location.cue}: Ein Firmenevent braucht Musik, die den Raum öffnet, aber Gespräche möglich lässt. Solo-Viola wirkt hochwertig, persönlich und deutlich eleganter als laute Hintergrundbeschallung.`,
					`Ich stimme Dauer, Lautstärke, Repertoire und Einsätze vorab mit euch ab - vom Ankommen der Gäste über Dinner und Reden bis zu einem kurzen Programmpunkt. Eine reguläre Rechnung für die Buchhaltung ist selbstverständlich.`,
				],
			};
		case 'PageBlocksSched':
			return {
				...block,
				eyebrow: `Ablauf ${location.locative}`,
				title: 'So kann euer Event klingen.',
				items: [
					{
						time: '18:30',
						title: 'Empfang',
						text: `Elegante Live-Musik, während Gäste ${location.locative} ankommen, begrüßt werden und ins Gespräch finden.`,
					},
					{
						time: '20:00',
						title: 'Dinner',
						text: 'Dezente Begleitung zwischen Gängen, Reden und Gesprächen - präsent, aber nie im Vordergrund.',
					},
					{
						time: '21:30',
						title: 'Programmpunkt',
						text: 'Ein kurzes, kuratiertes Viola-Set als besonderer Moment für Jubiläum, Ehrung oder Eröffnung.',
					},
				],
				footnote: `Zeiten beispielhaft - der Ablauf richtet sich nach eurem Programm ${location.locative}.`,
			};
		case 'PageBlocksLedger':
			return {
				...block,
				eyebrow: 'Anlässe',
				title: `Für Unternehmen\n${location.locative}.`,
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Live Musik für Firmenevents ${location.locative}.`,
				items: [
					{
						question: `Spielst du auf Firmenfeiern ${location.locative}?`,
						answer: `Ja. Ich begleite Firmenfeiern, Empfänge, Dinners, Messen, Eröffnungen und Jubiläen ${location.locative} mit Solo-Viola.`,
						open: true,
					},
					{
						question: 'Ist die Musik eher Hintergrund oder Programmpunkt?',
						answer: 'Beides ist möglich. Die Viola kann dezent Atmosphäre schaffen oder als kuratierter kurzer Auftritt einen offiziellen Moment rahmen.',
					},
					{
						question: 'Bekommen wir eine Rechnung?',
						answer: 'Ja, selbstverständlich mit allen notwendigen Angaben für die Buchhaltung.',
					},
					{
						question: 'Wie wird die Lautstärke geplant?',
						answer: 'Akustisch ist die Viola angenehm und gesprächsfreundlich. Für größere Räume oder Events bespreche ich bei Bedarf dezente Verstärkung.',
					},
				],
			};
		default:
			return block;
	}
}

function rewriteBirthdayBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Geburtstag & private Feier ${location.locative}`,
				title: `Live Musik zum Geburtstag\n${location.locative}.`,
				lead: `Solo-Viola für Geburtstage, Gartenfeste, private Feiern, Sektempfang, Dinner und musikalische Überraschungen ${location.locative}.`,
			};
		case 'PageBlocksMarquee':
			return {
				...block,
				lines: [
					`Geburtstag ${location.locative}`,
					'Runder Geburtstag',
					'Gartenfest',
					'Überraschungsständchen',
					'Dinner unter Freunden',
					'Sektempfang',
				],
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Ein Fest ${location.locative},\ndas persönlich klingt.`,
				paragraphs: [
					`Ob ${location.cue}: Live-Musik macht einen Geburtstag sofort persönlicher. Die Viola kann festlich empfangen, ein Lieblingslied als Überraschung spielen oder ein Dinner warm begleiten.`,
					`Ich plane mit euch, ob die Musik offen angekündigt wird oder als musikalisches Geburtstagsgeschenk beginnt. Vom kurzen Ständchen bis zu mehreren Sets über den Abend ist alles möglich.`,
				],
			};
		case 'PageBlocksMoods':
			return {
				...block,
				eyebrow: `Die Musik ${location.locative}`,
				title: 'Drei Stimmungen für euer Fest.',
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Live Musik zum Geburtstag ${location.locative}.`,
				items: [
					{
						question: `Spielst du auf Geburtstagen ${location.locative}?`,
						answer: `Ja. Ich begleite Geburtstage und private Feiern ${location.locative} mit Solo-Viola - vom kurzen Ständchen bis zur längeren Empfangs- oder Dinnermusik.`,
						open: true,
					},
					{
						question: 'Kann die Musik eine Überraschung sein?',
						answer: 'Ja. Ankunft, Einsatz und erstes Stück stimme ich diskret mit einer Vertrauensperson ab.',
					},
					{
						question: 'Welche Musik passt zu einer privaten Feier?',
						answer: 'Festliche Klassik, moderne Arrangements, Filmmusik oder das Lieblingslied des Geburtstagskinds - je nachdem, welcher Moment entstehen soll.',
					},
					{
						question: 'Spielst du auch draußen?',
						answer: 'Bei trockenem Wetter sehr gern. Ein schattiger Platz, ein Stuhl und genug Ruhe für das Instrument reichen meistens aus.',
					},
				],
			};
		default:
			return block;
	}
}

function rewriteBaptismBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Taufe ${location.locative}`,
				title: `Taufmusik ${location.locative}\nfür einen warmen Anfang.`,
				lead: `Sanfte Live-Viola für Taufe, Segnung, Willkommensfest, Gottesdienst und Familienfeier ${location.locative}.`,
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Ein kleiner Mensch,\nein großer Tag ${location.locative}.`,
				paragraphs: [
					`Ob ${location.cue}: Eine Taufe braucht Musik, die nicht glänzen will, sondern wärmt. Die Viola klingt ruhig, weich und feierlich, ohne den Gottesdienst oder das Kind zu überfordern.`,
					`Ich stimme die Stücke mit euch und bei Bedarf mit Pfarrer:in oder freier Rednerin ab - für Einzug, Taufhandlung, Segen, Auszug oder einen anschließenden Empfang.`,
				],
			};
		case 'PageBlocksTriptych':
			return {
				...block,
				eyebrow: `Im Gottesdienst ${location.locative}`,
				title: 'Drei Momente, die Musik tragen kann.',
			};
		case 'PageBlocksStatement':
			return {
				...block,
				eyebrow: 'Das persönliche Lied',
				titleBefore: `Vielleicht beginnt die Taufe\n${location.locative} mit einem Lied.`,
				lead: 'Ein Familienlied, ein Wiegenlied oder ein Stück von eurer Hochzeit kann für Viola arrangiert werden und wird so zum persönlichen Klang dieses Tages.',
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Taufmusik ${location.locative}.`,
				items: [
					{
						question: `Begleitest du Taufen ${location.locative}?`,
						answer: `Ja. Ich spiele bei Taufen, Segnungen, Willkommensfesten und Familienfeiern ${location.locative} - in Kirche, Gemeindehaus, Garten oder privatem Rahmen.`,
						open: true,
					},
					{
						question: 'Welche Stücke passen zur Taufe?',
						answer: 'Sanfte Klassiker wie Ave Maria, Air, Wiegenlieder oder ein persönliches Familienlied passen besonders gut.',
					},
					{
						question: 'Stimmst du dich mit der Kirche ab?',
						answer: 'Ja. Wenn gewünscht, kläre ich Einsätze und Ablauf direkt mit Pfarrer:in, Musiker:in oder freier Rednerin.',
					},
					{
						question: 'Kannst du nach der Taufe weiter spielen?',
						answer: 'Ja. Auf Wunsch begleite ich auch Empfang, Kaffee oder Familienfeier im Anschluss.',
					},
				],
			};
		default:
			return block;
	}
}

function rewriteConcertBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Konzert & Event ${location.locative}`,
				title: `Viola Konzert ${location.locative}\nfür besondere Bühnen.`,
				lead: `Kuratierte Viola-Programme für Vernissage, Lesung, Salonkonzert, Kulturabend, Empfang oder Event ${location.locative}.`,
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Ein Programm ${location.locative},\ndas zum Raum passt.`,
				paragraphs: [
					`Ob ${location.cue}: Ein Konzert- oder Kulturabend braucht Dramaturgie. Ich stelle Programme zusammen, die mit dem Raum, dem Publikum und dem Anlass arbeiten - von klassischer Tiefe bis zu modernen Arrangements.`,
					`Möglich sind kurze musikalische Rahmen von etwa 30 Minuten, ein Salonkonzert mit Pause oder ein konzentrierter Programmpunkt für Vernissage, Lesung, Empfang oder private Veranstaltung.`,
				],
			};
		case 'PageBlocksProgramme':
			return {
				...block,
				eyebrow: `Beispielprogramm ${location.locative}`,
				title: 'So könnte der Abend aussehen.',
				footnote: `Jedes Programm wird für Raum, Publikum und Anlass ${location.locative} neu kuratiert.`,
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Viola Konzerten ${location.locative}.`,
				items: [
					{
						question: `Spielst du Konzerte und Events ${location.locative}?`,
						answer: `Ja. Ich gestalte Viola-Programme für Konzerte, Vernissagen, Lesungen, Kulturabende, private Events und Empfänge ${location.locative}.`,
						open: true,
					},
					{
						question: 'Wie lang ist ein Programm?',
						answer: 'Je nach Format sind kurze Rahmenprogramme, 30 bis 60 Minuten oder ein längerer Konzertabend mit Pause möglich.',
					},
					{
						question: 'Kannst du Stücke anmoderieren?',
						answer: 'Ja. Kurze persönliche Anmoderationen können ein Programm zugänglicher und lebendiger machen.',
					},
					{
						question: 'Brauchst du Technik?',
						answer: 'In vielen Räumen reicht akustisches Spiel. Für größere Säle oder Events bespreche ich dezente Verstärkung.',
					},
				],
			};
		default:
			return block;
	}
}

function rewriteTeachingBlock(block: AnyBlock, page: LocalSeoPage): AnyBlock {
	const { location } = page;
	switch (block.__typename) {
		case 'PageBlocksHeroPage':
			return {
				...block,
				eyebrow: `Unterricht ${location.locative}`,
				title: `Geigenunterricht ${location.locative}\nmit Ruhe & Struktur.`,
				lead: `Geige und Bratsche lernen für Kinder, Erwachsene, Anfänger:innen und Fortgeschrittene ${location.locative} - mit geduldigem Aufbau und kostenloser Probestunde.`,
				badge: 'Probestunde kostenlos & unverbindlich',
			};
		case 'PageBlocksSplit':
			return {
				...block,
				eyebrow: 'Worum es geht',
				title: `Geige oder Bratsche lernen ${location.locative},\nohne Druck.`,
				paragraphs: [
					`Ob ${location.cue}: Geigenunterricht und Bratschenunterricht funktionieren dann gut, wenn Haltung, Bogenführung, Klang und Üben von Anfang an verständlich aufgebaut werden. Genau darauf liegt der Fokus.`,
					`Der Unterricht richtet sich an Kinder, Erwachsene, Anfänger:innen, Wiedereinsteiger:innen und Fortgeschrittene. Wir arbeiten in deinem Tempo, mit klaren Übungen und Stücken, die dich wirklich interessieren.`,
				],
			};
		case 'PageBlocksLearnDeck':
			return {
				...block,
				eyebrow: `Unterrichtsinhalte ${location.locative}`,
				title: 'Was wir Schritt für Schritt aufbauen.',
			};
		case 'PageBlocksFaq':
			return {
				...block,
				eyebrow: 'Gut zu wissen',
				title: `Häufige Fragen zu Geigenunterricht ${location.locative}.`,
				items: [
					{
						question: `Bietest du Geigenunterricht ${location.locative} an?`,
						answer: `Ja. Ich biete individuellen Geigen-, Bratschen- und Violaunterricht ${location.locative} beziehungsweise nach Absprache im passenden Rahmen an.`,
						open: true,
					},
					{
						question: 'Ist der Unterricht für Anfänger:innen geeignet?',
						answer: 'Ja. Gerade der Anfang ist wichtig: Haltung, Bogenführung, Rhythmus und Ton werden ruhig und verständlich aufgebaut.',
					},
					{
						question: 'Unterrichtest du Kinder und Erwachsene?',
						answer: 'Ja. Kinder, Jugendliche, Erwachsene, Wiedereinsteiger:innen und Fortgeschrittene können mit einem passenden Ziel arbeiten.',
					},
					{
						question: 'Gibt es eine Probestunde?',
						answer: 'Ja. Die Probestunde ist kostenlos und unverbindlich, damit du in Ruhe schauen kannst, ob der Unterricht passt.',
					},
				],
			};
		default:
			return block;
	}
}
