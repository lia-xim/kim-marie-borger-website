import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE_FILE = path.resolve('seo/keyword-research-2026-06-13.csv');
const OPPORTUNITY_FILE = path.resolve('seo/keyword-opportunities.csv');
const REPORT_FILE = path.resolve('seo/keyword-opportunity-analysis.md');

const SERVICE_LABELS = {
	hochzeiten: 'Hochzeit',
	beerdigungen: 'Beerdigung / Trauerfeier',
	geburtstage: 'Geburtstag / private Feier',
	unterricht: 'Unterricht',
	firmenfeiern: 'Firmenfeier / Business Event',
	taufen: 'Taufe',
	konzerte: 'Konzert / Kultur Event',
};

const CITY_SLUGS = [
	['mülheim an der ruhr', 'muelheim-an-der-ruhr'],
	['bergisch gladbach', 'bergisch-gladbach'],
	['mönchengladbach', 'moenchengladbach'],
	['recklinghausen', 'recklinghausen'],
	['düsseldorf', 'duesseldorf'],
	['leverkusen', 'leverkusen'],
	['oberhausen', 'oberhausen'],
	['gelsenkirchen', 'gelsenkirchen'],
	['remscheid', 'remscheid'],
	['duisburg', 'duisburg'],
	['bochum', 'bochum'],
	['wuppertal', 'wuppertal'],
	['krefeld', 'krefeld'],
	['solingen', 'solingen'],
	['mettmann', 'mettmann'],
	['hilden', 'hilden'],
	['dormagen', 'dormagen'],
	['neuss', 'neuss'],
	['meerbusch', 'meerbusch'],
	['langenfeld', 'langenfeld'],
	['monheim', 'monheim-am-rhein'],
	['velbert', 'velbert'],
	['wülfrath', 'wuelfrath'],
	['heiligenhaus', 'heiligenhaus'],
	['bottrop', 'bottrop'],
	['herne', 'herne'],
	['hagen', 'hagen'],
	['aachen', 'aachen'],
	['bonn', 'bonn'],
	['münster', 'muenster'],
	['bielefeld', 'bielefeld'],
	['paderborn', 'paderborn'],
	['siegen', 'siegen'],
	['iserlohn', 'iserlohn'],
	['unna', 'unna'],
	['ratingen', 'ratingen'],
	['erkrath', 'erkrath'],
	['essen', 'essen'],
	['dortmund', 'dortmund'],
	['moers', 'moers'],
	['köln', 'koeln'],
];

const REGION_SLUGS = [
	['nordrhein-westfalen', 'nordrhein-westfalen'],
	['rhein-kreis neuss', 'rhein-kreis-neuss'],
	['kreis mettmann', 'kreis-mettmann'],
	['bergisches land', 'bergisches-land'],
	['rhein-ruhr', 'rhein-ruhr'],
	['ruhrgebiet', 'ruhrgebiet'],
	['rheinland', 'rheinland'],
	['nrw', 'nordrhein-westfalen'],
];

function parseCsv(text) {
	const [headerLine, ...lines] = text.trim().split(/\r?\n/);
	const headers = headerLine.split(',');
	return lines
		.filter(Boolean)
		.map((line) => {
			const cells = line.split(',');
			const row = Object.fromEntries(headers.map((header, index) => [header, clean(cells[index] ?? '')]));
			return {
				...row,
				volume: Number(row.volume || 0),
				kd: Number(row.kd || 0),
				cpc: Number(row.cpc || 0),
				competition_index: Number(row.competition_index || 0),
				chances_score: Number(row.chances_score || 0),
				trend_30d_pct: Number(cleanPercent(row.trend_30d_pct)),
				trend_90d_pct: Number(cleanPercent(row.trend_90d_pct)),
				trend_6m_pct: Number(cleanPercent(row.trend_6m_pct)),
				trend_12m_pct: Number(cleanPercent(row.trend_12m_pct)),
			};
		});
}

function clean(value) {
	return String(value ?? '').replace(/^'+/, '').trim();
}

function cleanPercent(value) {
	const cleaned = clean(value);
	return cleaned === '' || cleaned === '-' ? 0 : cleaned;
}

function norm(value) {
	return String(value ?? '').toLowerCase().normalize('NFC').trim();
}

function slugify(value) {
	return norm(value)
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function detectPlace(keyword) {
	const k = norm(keyword);
	for (const [name, slug] of [...CITY_SLUGS, ...REGION_SLUGS]) {
		if (new RegExp(`(^|\\s)${escapeRegExp(name)}($|\\s)`, 'i').test(k)) {
			return { name, slug, type: REGION_SLUGS.some(([, regionSlug]) => regionSlug === slug) ? 'region' : 'city' };
		}
	}
	return null;
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function classifyCluster(keyword) {
	const k = norm(keyword);
	if (/geburtstag|ständchen|geburtstags|private feier|familienfeier|gartenfest/.test(k)) return 'geburtstage';
	if (/trauer|beerdigung|bestattung|abschied|am grab/.test(k)) return 'beerdigungen';
	if (/hochzeit|trauung|braut|standesamt|einzug|auszug|ringtausch|ja-wort/.test(k)) return 'hochzeiten';
	if (/taufe|kommunion|konfirmation|taufmusik/.test(k)) return 'taufen';
	if (/firmenevent|firmenfeier|messe|gala|business|eröffnung/.test(k)) return 'firmenfeiern';
	if (/konzert|lesung|vernissage|violakonzert|bratschenkonzert|viola konzert|bratsche konzert|live musik konzert/.test(k)) return 'konzerte';
	if (/event/.test(k)) return 'konzerte';
	if (/geige|geigen|violine|violin|bratsche|bratschen|viola|unterricht|lernen|musikunterricht/.test(k)) return 'unterricht';
	return 'sonstige';
}

function topicFor(keyword, cluster, place) {
	const k = norm(keyword);
	if (place) return `${cluster}-${place.slug}`;

	if (cluster === 'geburtstage') {
		if (/ständchen|geburtstagsständchen/.test(k)) return 'geburtstagsstaendchen';
		if (/private feier|familienfeier|gartenfest/.test(k)) return 'private-feier';
		return 'geburtstagsmusik';
	}

	if (cluster === 'unterricht') {
		if (/geige|geigen|violine|violin/.test(k)) return 'geigenunterricht';
		if (/bratsche|bratschen|viola/.test(k)) return 'bratschenunterricht';
		return 'musikunterricht';
	}

	if (cluster === 'beerdigungen') {
		if (/amazing grace|ave maria|klassische|moderne|instrumentalmusik/.test(k)) return 'trauermusik-repertoire';
		return 'trauermusik';
	}

	if (cluster === 'hochzeiten') {
		if (/nrw|nordrhein/.test(k)) return 'hochzeitsmusik-nordrhein-westfalen';
		if (/standesamt/.test(k)) return 'musik-standesamt-hochzeit';
		if (/freie trauung/.test(k)) return 'musik-freie-trauung';
		if (/kirchliche trauung/.test(k)) return 'musik-kirchliche-trauung';
		if (/trauung/.test(k)) return 'musik-zur-trauung';
		if (/braut|einzug/.test(k)) return 'musik-brauteinzug';
		if (/auszug/.test(k)) return 'musik-auszug-hochzeit';
		if (/sektempfang/.test(k)) return 'musik-sektempfang-hochzeit';
		if (/dinner|hochzeitsfeier|hintergrundmusik/.test(k)) return 'musik-hochzeitsfeier';
		return 'hochzeitsmusik';
	}

	if (cluster === 'firmenfeiern') {
		if (/messe/.test(k)) return 'musik-messe';
		if (/gala/.test(k)) return 'musik-gala';
		return 'musik-firmenfeier';
	}

	if (cluster === 'taufen') {
		if (/kommunion/.test(k)) return 'musik-kommunion';
		if (/konfirmation/.test(k)) return 'musik-konfirmation';
		return 'taufmusik';
	}

	if (cluster === 'konzerte') {
		if (/vernissage/.test(k)) return 'musik-vernissage';
		if (/lesung/.test(k)) return 'musik-lesung';
		if (/viola|bratsche/.test(k)) return 'viola-konzert';
		return 'live-musik-konzert';
	}

	return slugify(keyword);
}

function urlFor(topic, cluster, place) {
	if (place && cluster !== 'sonstige') return `https://kim-marie-borger.com/${cluster}/${place.slug}/`;

	const planned = {
		geburtstagsstaendchen: '/geburtstage/geburtstagsstaendchen/',
		'private-feier': '/geburtstage/private-feier/',
		geigenunterricht: '/unterricht/geigenunterricht/',
		'bratschenunterricht': '/unterricht/',
		'trauermusik-repertoire': '/beerdigungen/trauermusik-repertoire/',
		'hochzeitsmusik-nordrhein-westfalen': '/hochzeiten/nordrhein-westfalen/',
		'musik-standesamt-hochzeit': '/hochzeiten/musik-standesamt/',
		'musik-freie-trauung': '/hochzeiten/musik-freie-trauung/',
		'musik-kirchliche-trauung': '/hochzeiten/musik-kirchliche-trauung/',
		'musik-zur-trauung': '/hochzeiten/musik-zur-trauung/',
		'musik-brauteinzug': '/hochzeiten/musik-brauteinzug/',
		'musik-auszug-hochzeit': '/hochzeiten/musik-auszug/',
		'musik-sektempfang-hochzeit': '/hochzeiten/sektempfang/',
		'musik-hochzeitsfeier': '/hochzeiten/hochzeitsfeier/',
		'musik-messe': '/firmenfeiern/musik-messe/',
		'musik-gala': '/firmenfeiern/musik-gala/',
		'musik-kommunion': '/taufen/',
		'musik-konfirmation': '/taufen/',
		'musik-vernissage': '/konzerte/',
		'musik-lesung': '/konzerte/',
		'viola-konzert': '/konzerte/',
		'live-musik-konzert': '/konzerte/',
	};

	const main = {
		geburtstage: '/geburtstage/',
		unterricht: '/unterricht/',
		beerdigungen: '/beerdigungen/',
		hochzeiten: '/hochzeiten/',
		firmenfeiern: '/firmenfeiern/',
		taufen: '/taufen/',
		konzerte: '/konzerte/',
	};

	return `https://kim-marie-borger.com${planned[topic] ?? main[cluster] ?? '/'}`;
}

function needsTeachingOfferConfirmation(keyword, cluster, topic) {
	const k = norm(keyword);
	return cluster === 'unterricht'
		&& (/geige|geigen|violine|violin|musikunterricht/.test(k) || /geigenunterricht|musikunterricht/.test(topic))
		&& !/bratsche|bratschen|viola/.test(k);
}

function decisionFor(keyword, topic, cluster, place) {
	if (needsTeachingOfferConfirmation(keyword, cluster, topic)) return 'requires-offer-confirmation';
	if (place) return place.type === 'region' ? 'map-to-region-page' : 'map-to-existing-local-page';
	if ([
		'geburtstagsstaendchen',
		'private-feier',
		'geigenunterricht',
		'trauermusik-repertoire',
		'musik-standesamt-hochzeit',
		'musik-freie-trauung',
		'musik-kirchliche-trauung',
		'musik-zur-trauung',
		'musik-brauteinzug',
		'musik-auszug-hochzeit',
		'musik-sektempfang-hochzeit',
		'musik-hochzeitsfeier',
		'musik-messe',
		'musik-gala',
	].includes(topic)) return 'planned-topic-page';
	return 'optimize-existing-main-page';
}

function priorityFor(row, decision) {
	let score = 0;
	if (row.volume >= 1000) score += 5;
	else if (row.volume >= 250) score += 4;
	else if (row.volume >= 90) score += 3;
	else if (row.volume >= 30) score += 2;
	else score += 1;

	if (row.cpc >= 2) score += 1;
	if (/commercial|transactional/i.test(row.intent)) score += 1;
	if (decision === 'requires-offer-confirmation') score += 1;

	if (score >= 5) return 'P1';
	if (score >= 3) return 'P2';
	return 'P3';
}

function noteFor(row, cluster, topic, decision, place) {
	if (decision === 'requires-offer-confirmation') {
		return 'Nur optimieren, wenn Geige/Violine wirklich angeboten wird; sonst Suchversprechen nicht sauber.';
	}
	if (place) return `Lokale Variante auf bestehende ${SERVICE_LABELS[cluster] ?? cluster}-Ortsseite mappen.`;
	if (decision === 'planned-topic-page') return 'Eigene Themen-/Intent-Seite empfohlen, weil Suchintention eigenständig ist.';
	if (topic === 'trauermusik-repertoire') return 'Repertoire-/Ratgeberintent nicht mit Buchungsseite kannibalisieren.';
	return 'Auf bestehende Hauptleistungsseite konsolidieren; keine separate URL pro Synonym.';
}

function csvEscape(value) {
	const text = value === null || value === undefined ? '' : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

function groupBy(values, keyFn) {
	const groups = new Map();
	for (const value of values) {
		const key = keyFn(value);
		groups.set(key, [...(groups.get(key) ?? []), value]);
	}
	return groups;
}

function average(values) {
	if (!values.length) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function euro(value) {
	return value ? value.toFixed(2) : '';
}

const sourceText = readFileSync(SOURCE_FILE, 'utf8');
const rawRows = parseCsv(sourceText);
const opportunities = rawRows.map((row) => {
	const cluster = classifyCluster(row.keyword);
	const place = detectPlace(row.keyword);
	const canonicalIntent = topicFor(row.keyword, cluster, place);
	const recommendedUrl = urlFor(canonicalIntent, cluster, place);
	const decision = decisionFor(row.keyword, canonicalIntent, cluster, place);
	const priority = priorityFor(row, decision);
	return {
		keyword: row.keyword,
		language: row.language || 'unknown',
		country: row.country || 'de',
		intent: row.intent || 'unknown',
		volume: row.volume,
		kd: row.kd,
		cpc_eur: euro(row.cpc),
		competition: row.competition,
		chances_score: row.chances_score,
		trend_30d_pct: row.trend_30d_pct,
		trend_90d_pct: row.trend_90d_pct,
		trend_6m_pct: row.trend_6m_pct,
		trend_12m_pct: row.trend_12m_pct,
		cluster,
		canonical_intent: canonicalIntent,
		recommended_url: recommendedUrl,
		decision,
		priority,
		place: place?.name ?? '',
		place_slug: place?.slug ?? '',
		cannibalization_group: `${cluster}:${canonicalIntent}`,
		reason: noteFor(row, cluster, canonicalIntent, decision, place),
	};
});

const columns = [
	'keyword',
	'language',
	'country',
	'intent',
	'volume',
	'kd',
	'cpc_eur',
	'competition',
	'chances_score',
	'trend_30d_pct',
	'trend_90d_pct',
	'trend_6m_pct',
	'trend_12m_pct',
	'cluster',
	'canonical_intent',
	'recommended_url',
	'decision',
	'priority',
	'place',
	'place_slug',
	'cannibalization_group',
	'reason',
];

writeFileSync(
	OPPORTUNITY_FILE,
	`${columns.join(',')}\n${opportunities
		.sort((a, b) => b.volume - a.volume || a.keyword.localeCompare(b.keyword, 'de'))
		.map((row) => columns.map((column) => csvEscape(row[column])).join(','))
		.join('\n')}\n`,
);

const byCluster = [...groupBy(opportunities, (row) => row.cluster).entries()]
	.map(([cluster, rows]) => ({
		cluster,
		rows,
		count: rows.length,
		volume: rows.reduce((sum, row) => sum + row.volume, 0),
		avgCpc: average(rows.filter((row) => row.cpc_eur).map((row) => Number(row.cpc_eur))),
	}))
	.sort((a, b) => b.volume - a.volume);

const byIntent = [...groupBy(opportunities, (row) => row.cannibalization_group).entries()]
	.map(([group, rows]) => ({
		group,
		rows,
		volume: rows.reduce((sum, row) => sum + row.volume, 0),
		url: rows[0].recommended_url,
		priority: rows.some((row) => row.priority === 'P1') ? 'P1' : rows.some((row) => row.priority === 'P2') ? 'P2' : 'P3',
		decision: rows[0].decision,
	}))
	.sort((a, b) => b.volume - a.volume);

const topIntents = byIntent.slice(0, 30);
const p1Intents = byIntent.filter((intent) => intent.priority === 'P1');
const offerChecks = byIntent.filter((intent) => intent.rows.some((row) => row.decision === 'requires-offer-confirmation'));
const plannedPages = byIntent.filter((intent) => intent.rows.some((row) => row.decision === 'planned-topic-page'));

const report = `# Keyword Opportunity Mapping

Stand: 2026-06-13

Quelle: \`seo/keyword-research-2026-06-13.csv\` mit ${rawRows.length} Keyword-Zeilen. Diese Datei ersetzt die vorher falsch kopierten Keyworddaten.

Ziel: pro Suchintention genau eine Ziel-URL. Synonyme und nahe Varianten werden in \`cannibalization_group\` zusammengefuehrt, damit wir keine Seiten gegeneinander optimieren.

## Gesamtbild

| Cluster | Keywords | Gesamtvolumen | Avg CPC |
| --- | ---: | ---: | ---: |
${byCluster.map((group) => `| ${SERVICE_LABELS[group.cluster] ?? group.cluster} | ${group.count} | ${group.volume} | ${group.avgCpc ? group.avgCpc.toFixed(2) : '-'} EUR |`).join('\n')}

## Wichtigste Intent-Gruppen

| Prioritaet | Intent-Gruppe | Volumen | Ziel-URL | Entscheidung | Beispielkeywords |
| --- | --- | ---: | --- | --- | --- |
${topIntents.map((intent) => {
	const examples = intent.rows
		.sort((a, b) => b.volume - a.volume)
		.slice(0, 4)
		.map((row) => `${row.keyword} (${row.volume})`)
		.join('; ');
	return `| ${intent.priority} | ${intent.group} | ${intent.volume} | ${intent.url} | ${intent.decision} | ${examples} |`;
}).join('\n')}

## Was sich gegenueber der falschen Kopie aendert

- Geburtstag ist ploetzlich ein grosser Cluster: \`geburtstagsstaendchen\` allein hat 3600 Suchvolumen und transactional Intent.
- Unterricht bleibt sehr stark, aber der sichtbare Markt sucht ueberwiegend nach \`Geigenunterricht\`, \`Geige Unterricht\`, \`Geige lernen\` und \`Violinunterricht\`.
- Trauer ist ein grosser Hauptcluster: \`Trauermusik\`, \`Musik fuer Beerdigung\`, \`Musik fuer Trauerfeier\`.
- Hochzeit ist nicht nur lokal wichtig, sondern vor allem als Head- und Moment-Cluster: \`Hochzeitsmusik\`, \`Musik Hochzeit\`, \`Live Musik Hochzeit\`, \`Musik zur Trauung\`, \`Standesamt\`.
- Lokale Stadtkeywords bleiben wertvoll, sind aber nicht der groesste Teil des Suchvolumens.

## P1-Zielrichtungen

${p1Intents.map((intent) => `- ${intent.group}: ${intent.url} (${intent.volume} Volumen)`).join('\n')}

## Fachliche Freigabe benoetigt

${offerChecks.length > 0 ? offerChecks.map((intent) => `- ${intent.group}: ${intent.url} (${intent.volume} Volumen)`).join('\n') : '- Keine.'}

Die Geigen-/Violin-Keywords duerfen nur aggressiv optimiert werden, wenn Kim Marie tatsaechlich Geigenunterricht beziehungsweise Violinunterricht anbietet. Falls nicht, sollte die Website eher auf Bratsche/Viola fokussieren und die Geigenbegriffe nur erklaerend aufnehmen.

## Empfohlene neue Themen-/Intent-Seiten

${plannedPages.map((intent) => `- ${intent.group}: ${intent.url} (${intent.volume} Volumen)`).join('\n')}

## Naechste Umsetzung

1. Fachlich klaeren: Geigenunterricht ja/nein.
2. P1-Hauptcluster textlich umbauen: Geburtstagstaendchen, Trauermusik, Hochzeitsmusik, Geigenunterricht.
3. Fuer P1-Intent-Seiten eigene Textprofile bauen, damit der Local-SEO-Tracker nicht mehr 95-99% Template-Gleichheit meldet.
4. Lokale Seiten danach anhand der Stadtkeywords und der P1-Hauptintenttexte ausbauen.
`;

writeFileSync(REPORT_FILE, report);

console.log(`Keyword opportunities built from ${rawRows.length} source rows.`);
console.log(`- ${path.relative(process.cwd(), OPPORTUNITY_FILE).replace(/\\/g, '/')}`);
console.log(`- ${path.relative(process.cwd(), REPORT_FILE).replace(/\\/g, '/')}`);
console.log(`Clusters: ${byCluster.map((group) => `${group.cluster}:${group.volume}`).join(', ')}`);
