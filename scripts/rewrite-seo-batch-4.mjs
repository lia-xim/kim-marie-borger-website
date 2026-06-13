import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STATUS = 'rewritten-batch-4-review-needed';
const BATCH_NOTE = 'Batch 4: Tauf-Topicseiten mit getrenntem Intent, eigenen Ablaufpunkten, FAQs, Kontaktcopy und Bildbeschreibungen differenziert. Fachlich im CMS final prüfen.';

const COPY_REPLACEMENTS = [
	[/Fuer/g, 'Für'], [/fuer/g, 'für'],
	[/Dafuer/g, 'Dafür'], [/dafuer/g, 'dafür'],
	[/Ueber/g, 'Über'], [/ueber/g, 'über'],
	[/Pruef/g, 'Prüf'], [/pruef/g, 'prüf'],
	[/Klaer/g, 'Klär'], [/klaer/g, 'klär'],
	[/Staerk/g, 'Stärk'], [/staerk/g, 'stärk'],
	[/Persoen/g, 'Persön'], [/persoen/g, 'persön'],
	[/Waerm/g, 'Wärm'], [/waerm/g, 'wärm'],
	[/Waehr/g, 'Währ'], [/waehr/g, 'währ'],
	[/Stueck/g, 'Stück'], [/stueck/g, 'stück'],
	[/Wuensch/g, 'Wünsch'], [/wuensch/g, 'wünsch'],
	[/Ueb/g, 'Üb'], [/ueb/g, 'üb'],
	[/Moecht/g, 'Möcht'], [/moecht/g, 'möcht'],
	[/Moeg/g, 'Mög'], [/moeg/g, 'mög'],
	[/Koenn/g, 'Könn'], [/koenn/g, 'könn'],
	[/Hoer/g, 'Hör'], [/hoer/g, 'hör'],
	[/Fuehl/g, 'Fühl'], [/fuehl/g, 'fühl'],
	[/Fuehr/g, 'Führ'], [/fuehr/g, 'führ'],
	[/Gaest/g, 'Gäst'], [/gaest/g, 'gäst'],
	[/Gespraech/g, 'Gespräch'], [/gespraech/g, 'gespräch'],
	[/Atmosphaere/g, 'Atmosphäre'], [/atmosphaere/g, 'atmosphäre'],
	[/Oeff/g, 'Öff'], [/oeff/g, 'öff'],
	[/Laeng/g, 'Läng'], [/laeng/g, 'läng'],
	[/Beruehr/g, 'Berühr'], [/beruehr/g, 'berühr'],
	[/Natuer/g, 'Natür'], [/natuer/g, 'natür'],
	[/Einsaetz/g, 'Einsätz'], [/einsaetz/g, 'einsätz'],
	[/Anschliess/g, 'Anschließ'], [/anschliess/g, 'anschließ'],
	[/Spaet/g, 'Spät'], [/spaet/g, 'spät'],
	[/Hauef/g, 'Häuf'], [/hauef/g, 'häuf'],
	[/Haeuf/g, 'Häuf'], [/haeuf/g, 'häuf'],
];

function normalizeGermanCopy(value) {
	if (typeof value === 'string') {
		return COPY_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
	}
	if (Array.isArray(value)) {
		return value.map(normalizeGermanCopy);
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeGermanCopy(entry)]));
	}
	return value;
}

function fileFor(service, slug) {
	return path.join(ROOT, 'src/content/seo-pages', service, `${slug}.json`);
}

function noteFor(doc) {
	const notes = normalizeGermanCopy(doc.editorNotes ?? '')
		.split(/\n{2,}/)
		.map((note) => note.trim())
		.filter(Boolean);
	return [...new Set([...notes.filter((note) => note !== BATCH_NOTE), BATCH_NOTE])].join('\n\n');
}

function update(service, slug, patch) {
	const file = fileFor(service, slug);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const normalizedPatch = normalizeGermanCopy(patch);
	const next = {
		...doc,
		...normalizedPatch,
		status: STATUS,
		editorNotes: noteFor(doc),
	};
	if (normalizedPatch.imageAltBase && Array.isArray(doc.imageAlts)) {
		next.imageAlts = doc.imageAlts.map((item, index) => ({
			...item,
			alt: `${normalizedPatch.imageAltBase} ${index + 1}`,
		}));
	}
	delete next.imageAltBase;
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

function expand(service, slug, expansion) {
	const file = fileFor(service, slug);
	const doc = JSON.parse(readFileSync(file, 'utf8'));
	const normalizedExpansion = normalizeGermanCopy(expansion);
	const next = {
		...doc,
		split: {
			...doc.split,
			paragraphs: [...(doc.split?.paragraphs ?? []), ...(normalizedExpansion.paragraphs ?? [])],
		},
		faq: {
			...doc.faq,
			items: [...(doc.faq?.items ?? []), ...(normalizedExpansion.faqItems ?? [])],
		},
		status: STATUS,
		editorNotes: noteFor(doc),
	};
	writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

update('taufen', 'musik-taufe', {
	targetKeyword: 'Musik Taufe',
	seoTitle: 'Musik Taufe | Live-Viola für Taufe, Segnung & Familie',
	seoDescription: 'Musik zur Taufe mit Live-Viola: ruhig, persönlich und passend zu Gottesdienst, Segnung, Wunschliedern und Familienfeier geplant.',
	hero: {
		eyebrow: 'Taufmusik',
		title: 'Musik zur Taufe, die den Tag ruhig und persönlich zusammenhält.',
		lead: 'Eine Taufe besteht aus vielen leisen Momenten: Ankommen, Segnung, Worte der Familie, vielleicht ein Wunschlied. Die Viola verbindet diese Teile warm und klar, ohne aus der Feier einen Auftritt zu machen.',
		badge: 'Für Taufe, Segnung und Familienmoment',
	},
	split: {
		eyebrow: 'Überblick',
		title: 'Die passende Musik zur Taufe entsteht aus Ablauf, Raum und Familie.',
		lede: 'Wer allgemein nach Musik zur Taufe sucht, steht oft noch am Anfang der Planung. Diese Seite bündelt die grundlegenden Entscheidungen: Wo soll Musik erklingen, wie ruhig darf sie sein und wie persönlich soll das Repertoire werden?',
		paragraphs: [
			'Ich bespreche mit euch, ob die Musik im Gottesdienst, bei einer freien Segnung oder rund um die anschließende Familienfeier wirken soll. Daraus entsteht ein Ablauf, der nicht überladen ist und trotzdem bewusst gestaltet wirkt.',
			'Die Viola eignet sich für Taufen besonders, weil sie weich klingt und auch in kleineren Kirchen, Kapellen oder familiären Räumen nicht hart in den Vordergrund tritt. Sie kann ein klassisches Stück tragen, ein modernes Lied sanft reduzieren oder einen Übergang fast meditativ halten.',
			'Wichtig ist, dass die Musik nicht neben der Taufe steht. Sie soll den Moment der Segnung, die Worte der Eltern und das Miteinander der Gäste unterstützen. Deshalb plane ich Einsätze lieber präzise als pauschal.',
			'Wenn ihr noch unsicher seid, welche Stellen sich eignen, bekommt ihr von mir Vorschläge für einen vollständigen, aber schlanken musikalischen Rahmen.',
		],
	},
	focus: {
		eyebrow: 'Einsatzpunkte',
		title: 'Wo Musik zur Taufe besonders gut wirkt.',
		lead: 'Die meisten Feiern brauchen keine durchgehende Musik. Stärker sind wenige Einsätze, die dem Ablauf Halt geben.',
		items: [
			{ time: 'Ankommen', kicker: 'Vor Beginn', title: 'Ruhiger Klang im Raum', text: 'Ein kurzes Set vor der Feier nimmt Hektik heraus, während Familie und Gäste ihre Plätze finden.' },
			{ time: 'Segnung', kicker: 'Kernmoment', title: 'Musik rund um die Taufe', text: 'Vor oder nach der Segnung kann ein Stück den Moment sammeln, ohne die liturgischen Worte zu überdecken.' },
			{ time: 'Wunschlied', kicker: 'Persönlich', title: 'Ein Lied mit Familienbezug', text: 'Viele Lieder lassen sich für Solo-Viola reduzieren, wenn Melodie und Stimmung zum Anlass passen.' },
			{ time: 'Ausklang', kicker: 'Abschluss', title: 'Sanfter Übergang zur Feier', text: 'Nach dem Gottesdienst oder der Segnung kann Musik den Wechsel in Gratulationen und Familienzeit weich öffnen.' },
		],
		footnote: 'Die genaue Auswahl richtet sich nach Kirche, Pfarrperson, freier Segnung und gewünschter Atmosphäre.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik zur Taufe',
		items: [
			{ question: 'Wie viele Musikstücke sind bei einer Taufe sinnvoll?', answer: 'Häufig reichen zwei bis vier Einsätze. So bleibt die Feier ruhig, und jeder musikalische Moment hat einen klaren Grund.', open: true },
			{ question: 'Kann die Musik auch bei einer freien Segnung gespielt werden?', answer: 'Ja. Bei freien Segnungen lässt sich die Musik oft besonders flexibel um Worte, Rituale und Familienbeiträge legen.' },
			{ question: 'Muss das Repertoire kirchlich sein?', answer: 'Nicht unbedingt. Klassische, geistliche, moderne oder sehr persönliche Stücke sind möglich, solange sie zum Rahmen passen und genehmigt sind.' },
			{ question: 'Sprichst du dich mit Kirche oder Rednerin ab?', answer: 'Ja, wenn es für den Ablauf nötig ist. Ich kann Einsatzpunkte, Aufbau und musikalische Übergänge vorab klären.' },
			{ question: 'Ist Live-Viola für kleine Tauffeiern passend?', answer: 'Gerade dort funktioniert sie gut, weil der Klang persönlich bleibt und keine große technische Bühne braucht.' },
		],
	},
	contact: {
		eyebrow: 'Taufe planen',
		title: 'Möchtest du Musik für eine Taufe anfragen?',
		lead: 'Schick mir Datum, Ort, Art der Feier und erste Liedideen. Ich melde mich mit einer schlanken musikalischen Struktur für euren Tauftag.',
		checklist: ['Taufe oder Segnung', 'Kirche oder Feierort', 'Wunschlieder'],
		formEyebrow: 'Anfrage senden',
		formTitle: 'Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einer passenden Idee für eure Taufmusik.',
	},
	imageAltBase: 'Live-Viola als Musik zur Taufe in einem ruhigen Familienmoment',
});

update('taufen', 'live-musik-taufe', {
	targetKeyword: 'Live Musik Taufe',
	seoTitle: 'Live Musik Taufe | Viola statt Playlist für die Segnung',
	seoDescription: 'Live Musik zur Taufe mit Viola: flexibel im Ablauf, persönlich im Klang und abgestimmt auf Kirche, Segnung und Familie.',
	hero: {
		eyebrow: 'Live statt abgespielt',
		title: 'Live Musik zur Taufe, die auf den Moment reagieren kann.',
		lead: 'Bei einer Taufe läuft selten alles exakt nach Zeitplan. Live-Viola kann warten, atmen, einen Einsatz verlängern oder leiser werden, wenn ein Kind unruhig ist oder Worte mehr Raum brauchen.',
		badge: 'Flexibel für Gottesdienst und Segnung',
	},
	split: {
		eyebrow: 'Live-Charakter',
		title: 'Der Unterschied liegt nicht nur im Klang, sondern im Reagieren.',
		lede: 'Wer nach Live Musik zur Taufe sucht, möchte meist mehr als schöne Hintergrundmusik. Es geht um einen musikalischen Rahmen, der mit dem echten Ablauf mitschwingt und nicht starr aus der Anlage kommt.',
		paragraphs: [
			'Als Live-Musikerin kann ich Einsätze an Blickzeichen, Worte oder Bewegungen im Raum anpassen. Das ist besonders hilfreich, wenn die Taufhandlung etwas länger dauert oder ein Übergang spontaner entsteht als geplant.',
			'Der Klang der Viola bleibt nah und menschlich. Er wirkt feierlich, ohne dass die Taufe wie ein Konzert inszeniert wird. Gerade für Babys, Kinder und ältere Gäste ist diese weiche Präsenz angenehm.',
			'Vorab klären wir, ob die Musik rein akustisch funktioniert oder ob eine dezente Verstärkung sinnvoll ist. In vielen Kirchen und Kapellen reicht die natürliche Akustik aus.',
			'Live Musik kann auch nach der Feier noch einen kurzen Moment begleiten: Gratulationen, Familienfoto oder den Übergang zum Empfang bekommen dadurch eine warme Linie.',
		],
	},
	focus: {
		eyebrow: 'Live-Vorteile',
		title: 'Warum Live-Musik bei Taufen praktisch ist.',
		lead: 'Der Ablauf bleibt menschlich. Musik kann sich anpassen, statt die Feier in ein festes Raster zu drücken.',
		items: [
			{ time: 'Vor dem Start', kicker: 'Timing', title: 'Warten ohne Leerlauf', text: 'Wenn Gäste später kommen oder der Beginn sich verschiebt, kann die Musik ruhig weitertragen.' },
			{ time: 'Während Ritualen', kicker: 'Reaktion', title: 'Dynamik passend zum Moment', text: 'Lautstärke und Tempo lassen sich an Taufhandlung, Kerze oder Segnung anpassen.' },
			{ time: 'Bei Wunschliedern', kicker: 'Arrangement', title: 'Persönliche Melodien live reduziert', text: 'Ein Lied aus der Familie kann so gespielt werden, dass es in den kirchlichen Rahmen passt.' },
			{ time: 'Nach der Feier', kicker: 'Ausklang', title: 'Musik für Gratulationen', text: 'Ein kurzer Live-Ausklang schafft Wärme, während Familie und Paten zusammenkommen.' },
		],
		footnote: 'Die Einsätze werden vorab geplant und am Tag selbst fein auf den Ablauf abgestimmt.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Live Musik zur Taufe',
		items: [
			{ question: 'Warum Live-Musik statt Musik vom Band?', answer: 'Live-Musik kann auf Tempo, Stimmung und kleine Verzögerungen reagieren. Das ist bei familiären Feiern oft der wichtigste Vorteil.', open: true },
			{ question: 'Ist Live-Viola für eine Kirche laut genug?', answer: 'In vielen Kirchen ja. Wenn der Raum groß oder sehr voll ist, kann eine dezente Verstärkung eingeplant werden.' },
			{ question: 'Kannst du spontan länger spielen?', answer: 'In einem vereinbarten Rahmen ja. Gerade vor Beginn oder beim Ausklang plane ich kleine Puffer mit ein.' },
			{ question: 'Braucht Live-Musik viel Aufbauzeit?', answer: 'Nein. Für Solo-Viola ist der Aufbau überschaubar. Ich komme rechtzeitig, stimme mich ein und kläre den Platz im Raum.' },
			{ question: 'Funktioniert das auch bei einer Taufe im Garten oder Zuhause?', answer: 'Ja, wenn ein geschützter Platz vorhanden ist und Wetter, Akustik und Ablauf vorher besprochen werden.' },
		],
	},
	contact: {
		eyebrow: 'Live-Musik anfragen',
		title: 'Soll die Taufe live begleitet werden?',
		lead: 'Schreib mir Ort, Ablauf und ob es Wunschlieder gibt. Ich sage dir, welche Live-Einsätze für eure Taufe sinnvoll sind.',
		checklist: ['Live-Viola', 'Ablauf mit Puffer', 'Wunschlied prüfen'],
		formEyebrow: 'Termin klären',
		formTitle: 'Live Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag für die Live-Begleitung eurer Taufe.',
	},
	imageAltBase: 'Live-Musikerin mit Viola zur Taufmusik',
});

update('taufen', 'musik-gottesdienst-taufe', {
	targetKeyword: 'Musik Gottesdienst Taufe',
	seoTitle: 'Musik Gottesdienst Taufe | Viola für Liturgie & Segnung',
	seoDescription: 'Musik im Taufgottesdienst: Live-Viola für Einzug, Taufhandlung, Fürbitten und Auszug, abgestimmt mit Kirche und Ablauf.',
	hero: {
		eyebrow: 'Taufgottesdienst',
		title: 'Musik für den Taufgottesdienst, die liturgisch mitgeht.',
		lead: 'Im Gottesdienst hat Musik eine Aufgabe: Sie rahmt Worte, Gebete, Segnung und Gemeinde. Die Viola kann diese Stationen klar begleiten, ohne den Ablauf zu stören oder sakrale Momente zu überdecken.',
		badge: 'Für Kirche, Pfarrperson und Familie abgestimmt',
	},
	split: {
		eyebrow: 'Liturgischer Ablauf',
		title: 'Ein Taufgottesdienst braucht präzise musikalische Einsätze.',
		lede: 'Diese Seite richtet sich an Familien, die Musik direkt im Gottesdienst planen. Entscheidend sind nicht möglichst viele Stücke, sondern passende Stellen innerhalb von Liturgie, Lesung, Taufhandlung und Auszug.',
		paragraphs: [
			'Ich stimme die Musik auf den Ablauf der Gemeinde ab. Manche Kirchen haben feste Lieder, andere erlauben freie Instrumentalmusik an bestimmten Punkten. Beides lässt sich gut einbinden, wenn die Reihenfolge früh klar ist.',
			'Vor der Taufhandlung kann Musik den Raum sammeln. Nach der Segnung kann sie den Moment öffnen, während Eltern, Paten oder Gemeinde innerlich noch bei den Worten sind.',
			'Auch Fürbitten, Kerzenritual oder ein Familienbeitrag können musikalisch verbunden werden. Die Viola bleibt dabei beweglich genug, um kurze Wege und kleine Verzögerungen im Gottesdienst aufzufangen.',
			'Wenn bereits Orgel, Gemeindegesang oder Chor eingeplant sind, kann die Solo-Viola einzelne Lücken füllen, statt alles zu doppeln.',
		],
	},
	focus: {
		eyebrow: 'Stationen',
		title: 'Typische Stellen für Musik im Taufgottesdienst.',
		lead: 'Die genaue Platzierung hängt von Gemeinde und Pfarrperson ab. Diese Punkte sind häufig gut integrierbar.',
		items: [
			{ time: 'Einzug', kicker: 'Beginn', title: 'Musik zum Ankommen', text: 'Ein ruhiges Stück vor oder zum Beginn gibt dem Gottesdienst einen feierlichen, aber leichten Auftakt.' },
			{ time: 'Taufhandlung', kicker: 'Segnung', title: 'Rahmen um den Kernmoment', text: 'Direkt unter den Worten bleibt es still; davor oder danach kann Musik den Moment tragen.' },
			{ time: 'Fürbitten', kicker: 'Gebet', title: 'Kurzer verbindender Klang', text: 'Zwischen gesprochenen Beiträgen kann ein sehr reduzierter musikalischer Übergang sinnvoll sein.' },
			{ time: 'Auszug', kicker: 'Abschluss', title: 'Heller Abschluss', text: 'Zum Ende darf die Musik etwas offener werden und den Übergang zu Gratulationen begleiten.' },
		],
		footnote: 'Ich spiele nur dort, wo es liturgisch und organisatorisch mit der Kirche abgestimmt ist.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik im Taufgottesdienst',
		items: [
			{ question: 'Muss die Kirche Live-Musik genehmigen?', answer: 'In der Regel ja. Meist reicht eine kurze Abstimmung mit Pfarrperson, Küsterdienst oder Kirchenmusik, damit Platz und Einsätze klar sind.', open: true },
			{ question: 'Spielst du während der Taufworte?', answer: 'Normalerweise nicht. Die Worte sollen verständlich bleiben. Musik eignet sich eher vor oder nach der Taufhandlung.' },
			{ question: 'Kann die Viola mit Orgel kombiniert werden?', answer: 'Je nach Stück und Kirche ist das möglich. Häufig ist Solo-Viola aber praktischer, wenn der Ablauf flexibel bleiben soll.' },
			{ question: 'Wie früh sollte der Ablauf feststehen?', answer: 'Ideal ist eine grobe Reihenfolge einige Wochen vorher. Kurzfristige Anpassungen sind meist trotzdem möglich.' },
			{ question: 'Welche Musik passt in den Gottesdienst?', answer: 'Klassische, geistliche oder sehr ruhige moderne Stücke funktionieren besonders gut, wenn sie nicht zu showhaft wirken.' },
		],
	},
	contact: {
		eyebrow: 'Gottesdienst planen',
		title: 'Suchst du Musik für einen Taufgottesdienst?',
		lead: 'Schick mir Kirche, Uhrzeit, Ablaufentwurf und mögliche Vorgaben der Gemeinde. Ich bereite passende musikalische Einsatzpunkte vor.',
		checklist: ['Kirche', 'Ablaufentwurf', 'Abstimmung mit Gemeinde'],
		formEyebrow: 'Ablauf senden',
		formTitle: 'Musik für den Taufgottesdienst anfragen',
		formSuccess: 'Danke - ich melde mich mit einer passenden Struktur für den Taufgottesdienst.',
	},
	imageAltBase: 'Live-Viola im Taufgottesdienst als dezente Kirchenmusik',
});

update('taufen', 'musik-kirche-taufe', {
	targetKeyword: 'Musik Kirche Taufe',
	seoTitle: 'Musik Kirche Taufe | Live-Viola für Kirchenraum & Taufe',
	seoDescription: 'Musik in der Kirche zur Taufe: Live-Viola abgestimmt auf Akustik, Liturgie, Wunschlieder und den ruhigen Rahmen der Feier.',
	hero: {
		eyebrow: 'Kirchenraum',
		title: 'Musik in der Kirche zur Taufe, die Raum und Akustik respektiert.',
		lead: 'Eine Kirche verändert Musik. Nachhall, Wege, Sitzordnung und liturgische Vorgaben bestimmen, wie ein Stück wirkt. Deshalb plane ich Taufmusik in der Kirche anders als Musik bei einer freien Familienfeier.',
		badge: 'Für Kirche, Kapelle und Gemeindehaus',
	},
	split: {
		eyebrow: 'Akustik und Ablauf',
		title: 'Kirchenmusik zur Taufe braucht weniger Lautstärke und mehr Ruhe.',
		lede: 'Wer nach Musik in der Kirche zur Taufe sucht, fragt oft nach dem passenden Rahmen: Darf eine Musikerin spielen, wo steht sie, welche Stücke passen in den Raum und wie bleibt der Gottesdienst würdevoll?',
		paragraphs: [
			'Die Viola trägt in vielen Kirchen sehr schön, weil ihr Klang warm bleibt und vom Nachhall nicht hart vergrößert wird. Gleichzeitig braucht sie genug Abstand zu sprechenden Personen, damit Worte klar bleiben.',
			'Ich achte darauf, dass Musik nicht mit Gemeindegesang, Orgel oder liturgischen Teilen konkurriert. Wenn es feste Kirchenlieder gibt, ergänze ich eher die Übergänge oder besondere Momente.',
			'Für Kapellen oder kleinere Kirchen eignet sich ein besonders reduziertes Repertoire. Große Kirchen vertragen dagegen manchmal etwas längere Bögen, wenn der Nachhall genug Zeit zum Ausklingen bekommt.',
			'Vorab klären wir die praktischen Punkte: Platz, Ankunftszeit, Notenständer, eventuelle Verstärkung und die Freigabe der geplanten Stücke.',
		],
	},
	focus: {
		eyebrow: 'Kirchenpraxis',
		title: 'Was in der Kirche vor der Taufe geklärt wird.',
		lead: 'Gute Kirchenmusik beginnt mit einfachen organisatorischen Fragen. Sind sie geklärt, kann der Tag sehr entspannt laufen.',
		items: [
			{ time: 'Vorab', kicker: 'Freigabe', title: 'Stücke mit der Kirche abstimmen', text: 'Nicht jede Gemeinde hat dieselben Vorgaben. Ich helfe, eine passende Auswahl zu formulieren.' },
			{ time: 'Ankunft', kicker: 'Aufbau', title: 'Unauffälliger Platz im Raum', text: 'Die Position soll akustisch sinnvoll sein und gleichzeitig den Ablauf der Taufe nicht blockieren.' },
			{ time: 'Gottesdienst', kicker: 'Balance', title: 'Musik neben Sprache und Orgel', text: 'Die Viola ergänzt vorhandene Elemente und lässt Predigt, Gebet und Taufworte frei.' },
			{ time: 'Nachhall', kicker: 'Akustik', title: 'Genug Zeit zum Ausklingen', text: 'Gerade in Kirchen ist Stille nach einem Stück Teil der Wirkung und sollte mitgedacht werden.' },
		],
		footnote: 'Bei Unsicherheit kann ich eine kurze Formulierung für die Abstimmung mit der Gemeinde vorbereiten.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu Musik in der Kirche zur Taufe',
		items: [
			{ question: 'Darf man eigene Musik in der Kirche spielen lassen?', answer: 'Das entscheidet die jeweilige Gemeinde. Häufig ist Instrumentalmusik möglich, wenn Stücke und Einsatzpunkte vorher abgesprochen werden.', open: true },
			{ question: 'Ist eine Viola in der Kirche zu leise?', answer: 'Meistens nicht. Kirchenakustik trägt den Klang oft gut. In sehr großen Räumen kann eine dezente Verstärkung sinnvoll sein.' },
			{ question: 'Wo steht die Musikerin während der Taufe?', answer: 'Das hängt vom Raum ab. Wichtig ist ein Platz mit gutem Klang, Sichtkontakt und genug Abstand zu Wegen und liturgischen Handlungen.' },
			{ question: 'Kann moderne Musik in der Kirche gespielt werden?', answer: 'Ja, wenn sie zur Feier passt und die Gemeinde zustimmt. Eine ruhige Instrumentalfassung wirkt oft kirchentauglicher als das Original.' },
			{ question: 'Was passiert, wenn die Kirche feste Lieder vorgibt?', answer: 'Dann kann die Viola ergänzend eingesetzt werden, zum Beispiel vor Beginn, nach der Segnung oder zum Auszug.' },
		],
	},
	contact: {
		eyebrow: 'Kirchentaufe anfragen',
		title: 'Planst du eine Taufe in der Kirche?',
		lead: 'Nenne mir Kirche, Stadt, Uhrzeit und ob es Vorgaben zur Musik gibt. Ich schlage dir passende Einsätze für den Kirchenraum vor.',
		checklist: ['Kirchenraum', 'Gemeindevorgaben', 'Akustik'],
		formEyebrow: 'Details senden',
		formTitle: 'Musik in der Kirche zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einem Vorschlag für eure Musik in der Kirche.',
	},
	imageAltBase: 'Viola-Musik in der Kirche zur Taufe mit warmem Raumklang',
});

update('taufen', 'sanfte-musik-taufe', {
	targetKeyword: 'Sanfte Musik Taufe',
	seoTitle: 'Sanfte Musik Taufe | Leise Live-Viola für Kind & Familie',
	seoDescription: 'Sanfte Musik zur Taufe: leise, warme Live-Viola für Segnung, Baby, Familie und ruhige Gottesdienstmomente.',
	hero: {
		eyebrow: 'Sanfte Taufmusik',
		title: 'Sanfte Musik zur Taufe, wenn der Moment zart bleiben soll.',
		lead: 'Manche Taufen brauchen keine große Geste. Ein ruhiger Klang, ein weiches Tempo und genug Stille können stärker sein als ein bekanntes Lied mit viel Pathos.',
		badge: 'Leise, warm und kindgerecht',
	},
	split: {
		eyebrow: 'Ruhiger Klang',
		title: 'Sanfte Taufmusik schützt die Stimmung des Tages.',
		lede: 'Bei sanfter Musik zur Taufe geht es vor allem um Zurückhaltung. Der Klang soll Babys, Kinder und Gäste nicht erschrecken, sondern eine Atmosphäre schaffen, in der Segnung und Familie im Mittelpunkt bleiben.',
		paragraphs: [
			'Die Viola kann sehr weich gespielt werden. Tiefe und mittlere Lagen wirken warm, ohne aufdringlich zu sein. Dadurch passt sie gut in kleine Kirchen, Kapellen, Wohnzimmer oder Feiern mit sehr persönlichem Charakter.',
			'Sanft bedeutet nicht beliebig. Ich wähle Stücke mit klarer Melodie, ruhigem Puls und wenig dramatischen Sprüngen. So entsteht eine Linie, die den Ablauf hält, aber nie auf Effekt zielt.',
			'Gerade rund um die Taufhandlung ist weniger oft besser: ein kurzer Beginn, ein Atemzug, ein leiser Abschluss. Die Musik darf helfen, dass alle kurz still werden.',
			'Wenn Familien unsicher sind, ob ein Wunschlied zu intensiv ist, kann ich eine reduzierte Variante vorschlagen oder einen weicheren Ausschnitt wählen.',
		],
	},
	focus: {
		eyebrow: 'Feinplanung',
		title: 'So bleibt Musik zur Taufe wirklich sanft.',
		lead: 'Sanfte Musik entsteht durch Repertoire, Lautstärke, Tempo und Pausen. Alle vier Punkte werden bewusst gesetzt.',
		items: [
			{ time: 'Repertoire', kicker: 'Auswahl', title: 'Melodien ohne Druck', text: 'Ich bevorzuge Stücke, die tragen, ohne Spannung künstlich aufzubauen.' },
			{ time: 'Lautstärke', kicker: 'Balance', title: 'Nah statt laut', text: 'Die Viola wird so eingesetzt, dass sie präsent bleibt und Gespräche, Gebete oder Kindergeräusche nicht überdeckt.' },
			{ time: 'Tempo', kicker: 'Ruhe', title: 'Genug Zeit für den Moment', text: 'Langsame Tempi geben der Segnung Raum und vermeiden ein gehetztes Gefühl.' },
			{ time: 'Pausen', kicker: 'Stille', title: 'Nicht jede Lücke füllen', text: 'Manchmal wirkt ein Stück stärker, wenn danach bewusst Stille bleibt.' },
		],
		footnote: 'Sanfte Musik eignet sich besonders für kleine Taufen, frühe Uhrzeiten und sehr familiäre Feiern.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu sanfter Musik zur Taufe',
		items: [
			{ question: 'Ist sanfte Musik eher klassisch oder modern?', answer: 'Beides ist möglich. Entscheidend sind Tempo, Tonlage und Arrangement, nicht nur der Ursprung des Liedes.', open: true },
			{ question: 'Kann sanfte Musik trotzdem emotional sein?', answer: 'Ja. Oft wirkt sie gerade deshalb emotional, weil sie nicht drängt und den Moment offen lässt.' },
			{ question: 'Passt das zu einer Taufe mit vielen Kindern?', answer: 'Ja, wenn die Einsätze kurz und klar geplant sind. Sanfte Musik muss nicht absolute Stille verlangen.' },
			{ question: 'Welche Stellen eignen sich besonders?', answer: 'Vor Beginn, nach der Segnung, bei einem Kerzenritual oder als Ausklang nach dem Gottesdienst.' },
			{ question: 'Kann ein sehr bekanntes Lied sanft gespielt werden?', answer: 'Oft ja. Ich reduziere es auf Melodie und Klang, damit es zur Taufe passt und nicht zu groß wirkt.' },
		],
	},
	contact: {
		eyebrow: 'Sanft planen',
		title: 'Soll die Taufmusik besonders ruhig bleiben?',
		lead: 'Schreib mir, welche Stimmung du dir wünschst und ob es ein Lied mit Familienbezug gibt. Ich suche eine sanfte Form dafür.',
		checklist: ['ruhige Stimmung', 'kurze Einsätze', 'sanfte Wunschlieder'],
		formEyebrow: 'Stimmung senden',
		formTitle: 'Sanfte Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einer ruhigen Idee für eure Taufmusik.',
	},
	imageAltBase: 'Sanfte Viola-Musik zur Taufe für Baby und Familie',
});

update('taufen', 'emotionale-musik-taufe', {
	targetKeyword: 'Emotionale Musik Taufe',
	seoTitle: 'Emotionale Musik Taufe | Persönliche Viola für Segnung',
	seoDescription: 'Emotionale Musik zur Taufe mit Live-Viola: persönliche Wunschlieder, warme Momente und fein geplante Einsätze für Familie und Segnung.',
	hero: {
		eyebrow: 'Persönlicher Moment',
		title: 'Emotionale Musik zur Taufe, ohne den Tag zu überladen.',
		lead: 'Eine Taufe ist oft leise emotional: Eltern sehen ihr Kind, Paten stehen nah dabei, Familie hört Worte, die bleiben. Musik darf diese Nähe spürbar machen, ohne den Moment zu inszenieren.',
		badge: 'Für Wunschlieder und Familienbezug',
	},
	split: {
		eyebrow: 'Emotion statt Pathos',
		title: 'Emotionale Taufmusik braucht persönliche Bedeutung.',
		lede: 'Bei emotionaler Musik zur Taufe geht es nicht darum, möglichst traurig oder dramatisch zu klingen. Stark wird Musik, wenn sie einen Bezug zur Familie, zur Geschichte des Kindes oder zu einem bestimmten Satz im Ablauf bekommt.',
		paragraphs: [
			'Ich frage deshalb nicht nur nach Lieblingsliedern, sondern auch nach der Stelle, an der sie wirken sollen. Ein Lied nach der Segnung fühlt sich anders an als ein Lied vor Beginn oder während eines Kerzenrituals.',
			'Die Viola bringt eine menschliche Klangfarbe mit. Sie kann ein modernes Lied so reduzieren, dass der emotionale Kern bleibt, während alles Überladene verschwindet.',
			'Manchmal ist ein kurzes Motiv aus einem Lied genug. Manchmal darf ein ganzes Stück stehen bleiben. Entscheidend ist, dass die Musik dem Moment dient und nicht die Aufmerksamkeit von Kind und Familie wegzieht.',
			'Wenn mehrere Familienmitglieder Ideen haben, helfe ich, daraus eine klare Auswahl zu machen, die nicht zu voll wird.',
		],
	},
	focus: {
		eyebrow: 'Persönliche Stellen',
		title: 'Wo emotionale Musik bei einer Taufe trägt.',
		lead: 'Emotion entsteht häufig durch den richtigen Zeitpunkt. Deshalb wird jeder Einsatz bewusst mit der Geschichte der Familie verbunden.',
		items: [
			{ time: 'Vor Beginn', kicker: 'Erinnerung', title: 'Ein Lied mit Vorgeschichte', text: 'Ein vertrautes Motiv kann schon beim Ankommen zeigen, dass diese Taufe persönlich gedacht ist.' },
			{ time: 'Nach der Segnung', kicker: 'Nähe', title: 'Worte ausklingen lassen', text: 'Direkt nach der Taufhandlung kann Musik den Blick auf Kind, Eltern und Paten sammeln.' },
			{ time: 'Kerze oder Ritual', kicker: 'Symbol', title: 'Musik für ein Zeichen', text: 'Wenn eine Kerze entzündet oder ein Segen gesprochen wird, kann ein kurzer Einsatz die Handlung verbinden.' },
			{ time: 'Familienfeier', kicker: 'Fortsetzung', title: 'Ein warmer Ausklang', text: 'Nach dem offiziellen Teil kann ein Stück die Stimmung in Gratulationen und Begegnung weitertragen.' },
		],
		footnote: 'Persönliche Wunschlieder prüfe ich vorher auf Tonumfang, Wirkung und passende Länge für Solo-Viola.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu emotionaler Musik zur Taufe',
		items: [
			{ question: 'Welche Lieder eignen sich für emotionale Taufmusik?', answer: 'Lieder mit klarer Melodie und persönlichem Bezug funktionieren besonders gut. Das kann klassisch, modern, geistlich oder aus der Familie vertraut sein.', open: true },
			{ question: 'Wird emotionale Musik schnell zu kitschig?', answer: 'Nicht, wenn sie reduziert gespielt und gut platziert wird. Die Viola kann Nähe schaffen, ohne übertrieben zu wirken.' },
			{ question: 'Kann ein Lied für die Paten eingebunden werden?', answer: 'Ja. Ein kurzer Einsatz rund um Patenversprechen, Fürbitten oder Segnung kann sehr stimmig sein.' },
			{ question: 'Wie viele persönliche Lieder sind sinnvoll?', answer: 'Lieber wenige starke Stücke als viele kleine Ideen. Zwei persönliche Einsätze wirken oft klarer als ein zu voller Ablauf.' },
			{ question: 'Kannst du aus einem Popsong eine ruhige Fassung machen?', answer: 'Wenn die Melodie für Viola geeignet ist, ja. Ich wähle eine Tonart und Länge, die in den Taufrahmen passen.' },
		],
	},
	contact: {
		eyebrow: 'Persönlich anfragen',
		title: 'Gibt es ein Lied, das zur Taufe gehören soll?',
		lead: 'Schick mir euren Liedwunsch und die Bedeutung dahinter. Ich prüfe, wie daraus ein stimmiger Taufmoment werden kann.',
		checklist: ['Wunschlied', 'Familienbezug', 'Segnung oder Ritual'],
		formEyebrow: 'Liedidee senden',
		formTitle: 'Emotionale Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einer persönlichen Idee für eure Taufmusik.',
	},
	imageAltBase: 'Emotionale Live-Viola zur Taufe mit persönlichem Wunschlied',
});

update('taufen', 'klassische-musik-taufe', {
	targetKeyword: 'Klassische Musik Taufe',
	seoTitle: 'Klassische Musik Taufe | Viola für Kirche & Segnung',
	seoDescription: 'Klassische Musik zur Taufe mit Live-Viola: feierliche Stücke für Kirche, Segnung, Einzug und Auszug, ruhig und passend arrangiert.',
	hero: {
		eyebrow: 'Klassische Taufmusik',
		title: 'Klassische Musik zur Taufe, wenn der Rahmen zeitlos wirken soll.',
		lead: 'Klassische Stücke geben einer Taufe Würde, ohne laut sein zu müssen. Auf der Viola können bekannte Melodien warm, schlicht und kirchentauglich klingen.',
		badge: 'Zeitlos für Kirche und Segnung',
	},
	split: {
		eyebrow: 'Repertoire',
		title: 'Klassische Taufmusik lebt von Ruhe, Melodie und Maß.',
		lede: 'Wer klassische Musik zur Taufe sucht, wünscht sich meist einen feierlichen Rahmen, der auch in der Kirche selbstverständlich wirkt. Entscheidend ist, die Stücke so auszuwählen, dass sie zur Dauer und Stimmung der Taufe passen.',
		paragraphs: [
			'Nicht jedes klassische Werk eignet sich komplett für eine Taufe. Häufig ist ein gut gewählter Ausschnitt stärker: ein ruhiger Beginn, eine klare Melodie, ein feierlicher Abschluss.',
			'Die Viola kann Werke aus Barock, Klassik oder Romantik in einer kammermusikalischen Farbe spielen. Dadurch bleibt die Musik festlich, aber nicht überdimensioniert.',
			'Für den Einzug oder das Ankommen eignen sich andere Stücke als für die Segnung selbst. Zum Auszug darf die Musik heller werden, während der Kernmoment meist schlichter bleibt.',
			'Wenn die Kirche bestimmte musikalische Vorgaben hat, lassen sich klassische Stücke oft besonders gut abstimmen, weil sie vielen Gemeinden vertraut sind.',
		],
	},
	focus: {
		eyebrow: 'Klassische Momente',
		title: 'So kann klassische Musik die Taufe strukturieren.',
		lead: 'Klassische Musik funktioniert am besten, wenn jedes Stück eine eigene Aufgabe bekommt.',
		items: [
			{ time: 'Einzug', kicker: 'Feierlich', title: 'Klarer Beginn', text: 'Ein ruhiges klassisches Stück kann den Gottesdienst sammeln, ohne zu schwer zu werden.' },
			{ time: 'Segnung', kicker: 'Reduziert', title: 'Schlichte Begleitung', text: 'Nach der Taufhandlung wirkt oft ein kurzer, warmer Ausschnitt stärker als ein großes Werk.' },
			{ time: 'Fürbitten', kicker: 'Verbindung', title: 'Instrumentaler Übergang', text: 'Zwischen gesprochenen Teilen kann eine klassische Melodie den Ablauf ruhig verbinden.' },
			{ time: 'Auszug', kicker: 'Heller', title: 'Freundlicher Abschluss', text: 'Zum Ende darf die Musik offener klingen und die Familie in den nächsten Teil des Tages führen.' },
		],
		footnote: 'Konkrete Stücke werden nach Raum, Länge, Kirchenvorgaben und musikalischer Wirkung ausgewählt.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu klassischer Musik zur Taufe',
		items: [
			{ question: 'Welche klassischen Stücke passen zur Taufe?', answer: 'Geeignet sind ruhige, klare Melodien und festliche Ausschnitte. Ich empfehle Stücke je nach Kirche, Ablauf und gewünschter Stimmung.', open: true },
			{ question: 'Kann klassische Musik auf Solo-Viola vollständig wirken?', answer: 'Ja, wenn die Auswahl zur Besetzung passt. Manche Werke werden arrangiert oder in sinnvollen Ausschnitten gespielt.' },
			{ question: 'Ist klassische Musik zu ernst für eine Taufe?', answer: 'Nicht unbedingt. Es gibt viele helle, warme und schlichte klassische Stücke, die festlich wirken, ohne schwer zu sein.' },
			{ question: 'Kann klassische Musik mit einem modernen Wunschlied kombiniert werden?', answer: 'Ja. Ein klassischer Rahmen und ein persönliches modernes Lied können sehr gut zusammenpassen, wenn die Übergänge geplant sind.' },
			{ question: 'Muss die Kirche die Stücke prüfen?', answer: 'Das hängt von der Gemeinde ab. Bei klassischen Stücken ist die Abstimmung oft unkompliziert, sollte aber trotzdem erfolgen.' },
		],
	},
	contact: {
		eyebrow: 'Klassisch planen',
		title: 'Wünschst du dir klassische Musik zur Taufe?',
		lead: 'Schick mir Kirche, Ablauf und ob du bestimmte Stücke im Kopf hast. Ich stelle dir eine klassische Auswahl für die Taufe zusammen.',
		checklist: ['klassisches Repertoire', 'Kirchenraum', 'Einzug und Auszug'],
		formEyebrow: 'Repertoire anfragen',
		formTitle: 'Klassische Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit passenden klassischen Vorschlägen für eure Taufe.',
	},
	imageAltBase: 'Klassische Viola-Musik zur Taufe in der Kirche',
});

update('taufen', 'moderne-musik-taufe', {
	targetKeyword: 'Moderne Musik Taufe',
	seoTitle: 'Moderne Musik Taufe | Pop & Filmmusik auf Live-Viola',
	seoDescription: 'Moderne Musik zur Taufe mit Live-Viola: persönliche Pop-, Film- oder Lieblingslieder als ruhige Instrumentalfassung für Segnung und Familie.',
	hero: {
		eyebrow: 'Moderne Taufmusik',
		title: 'Moderne Musik zur Taufe, persönlich und trotzdem kirchentauglich.',
		lead: 'Ein modernes Lied kann zur Taufe passen, wenn es nicht wie eine Playlist in den Raum gestellt wird. Auf der Viola wird daraus eine ruhige Instrumentalfassung, die Bedeutung behält und den Rahmen respektiert.',
		badge: 'Für Pop, Film und persönliche Lieder',
	},
	split: {
		eyebrow: 'Arrangement',
		title: 'Moderne Taufmusik braucht eine gute Übersetzung.',
		lede: 'Wer moderne Musik zur Taufe sucht, hat oft ein Lied im Kopf, das emotional zur Familie gehört. Die Aufgabe ist, dieses Lied so zu spielen, dass es im Gottesdienst oder bei einer Segnung natürlich wirkt.',
		paragraphs: [
			'Nicht jeder Popsong passt in voller Länge. Ich prüfe Melodie, Tonumfang, Textbezug und Stimmung und wähle dann einen Ausschnitt, der instrumental trägt.',
			'Die Viola nimmt dem Lied oft den Showcharakter. Ohne Gesang und Beat bleibt die Melodie übrig, und genau dadurch kann ein modernes Stück sehr ruhig und passend werden.',
			'Bei kirchlichen Taufen sollte ein modernes Lied vorher mit der Gemeinde abgestimmt werden. Eine Instrumentalfassung wird häufig leichter akzeptiert als das Original, weil sie weniger dominant wirkt.',
			'Moderne Musik kann auch mit klassischeren Einsätzen kombiniert werden: zum Beispiel ein persönliches Lied nach der Segnung und ein zeitloseres Stück zum Auszug.',
		],
	},
	focus: {
		eyebrow: 'Moderne Einsatzpunkte',
		title: 'Wo moderne Musik zur Taufe gut funktioniert.',
		lead: 'Moderne Lieder wirken besonders stark, wenn sie gezielt und nicht zu häufig eingesetzt werden.',
		items: [
			{ time: 'Vor Beginn', kicker: 'Vertrautheit', title: 'Lieblingslied als Ankommen', text: 'Eine bekannte Melodie kann Familie und Gäste emotional abholen, bevor die Feier beginnt.' },
			{ time: 'Nach der Segnung', kicker: 'Persönlich', title: 'Lied mit Bedeutung', text: 'Direkt nach der Taufe kann ein moderner Song den Familienbezug spürbar machen.' },
			{ time: 'Ritual', kicker: 'Symbol', title: 'Musik zur Kerze oder Segnung', text: 'Ein reduzierter Ausschnitt begleitet eine Handlung, ohne sie zu überdecken.' },
			{ time: 'Ausklang', kicker: 'Leicht', title: 'Heller Übergang zur Feier', text: 'Zum Ende darf moderne Musik freundlicher wirken und den offiziellen Teil öffnen.' },
		],
		footnote: 'Wenn ein Song nicht geeignet ist, schlage ich eine Alternative mit ähnlicher Stimmung vor.',
	},
	faq: {
		eyebrow: 'Gut zu wissen',
		title: 'FAQ zu moderner Musik zur Taufe',
		items: [
			{ question: 'Kann jeder Popsong zur Taufe gespielt werden?', answer: 'Nicht jeder. Manche Songs verlieren instrumental zu viel oder passen textlich nicht zum Anlass. Ich prüfe das ehrlich vorab.', open: true },
			{ question: 'Wie wird aus einem modernen Lied eine Taufversion?', answer: 'Ich reduziere es auf Melodie, passende Tonart und eine sinnvolle Länge. So bleibt es persönlich, aber ruhiger.' },
			{ question: 'Akzeptieren Kirchen moderne Musik?', answer: 'Das ist unterschiedlich. Eine dezente Instrumentalfassung hat oft bessere Chancen, sollte aber mit der Gemeinde abgestimmt werden.' },
			{ question: 'Kann moderne Musik mit klassischer Musik gemischt werden?', answer: 'Ja. Genau diese Mischung ist häufig schön: klassisch für den Rahmen, modern für den persönlichen Moment.' },
			{ question: 'Wann sollte ich den Liedwunsch schicken?', answer: 'Am besten so früh wie möglich, damit Arrangement, Länge und eventuelle Freigabe in Ruhe geklärt werden können.' },
		],
	},
	contact: {
		eyebrow: 'Songidee senden',
		title: 'Hast du ein modernes Lied für die Taufe im Kopf?',
		lead: 'Schick mir den Songtitel und die geplante Stelle im Ablauf. Ich prüfe, ob und wie er als Viola-Fassung zur Taufe passt.',
		checklist: ['Pop oder Film', 'Instrumentalfassung', 'Kirchenfreigabe'],
		formEyebrow: 'Lied prüfen',
		formTitle: 'Moderne Musik zur Taufe anfragen',
		formSuccess: 'Danke - ich melde mich mit einer Einschätzung zu eurem modernen Liedwunsch.',
	},
	imageAltBase: 'Moderne Taufmusik als ruhige Live-Viola-Fassung',
});

expand('taufen', 'musik-taufe', {
	paragraphs: [
		'Bei der Planung achte ich außerdem darauf, dass die Musik nicht nur schön klingt, sondern für alle Beteiligten verständlich eingebunden ist. Eltern, Paten, Pfarrperson und Gäste sollen wissen, wann ein musikalischer Moment beginnt und wann wieder gesprochen wird.',
		'Wenn mehrere Kinder getauft werden oder die Taufe in einen regulären Gemeindegottesdienst eingebettet ist, braucht die Musik noch mehr Maß. Dann wähle ich kurze Einsätze, die nicht den Ablauf verlängern, sondern einzelne Übergänge bewusst ordnen.',
		'Für Familien, die noch keine klare Vorstellung haben, kann ich eine kleine Dramaturgie vorschlagen: ein ruhiger Beginn, ein persönlicher Moment nach der Segnung und ein freundlicher Ausklang. Daraus entsteht eine Taufmusik, die vollständig wirkt und trotzdem leicht bleibt.',
	],
	faqItems: [
		{ question: 'Kann die Musik auch sehr kurzfristig geplant werden?', answer: 'Wenn Termin, Ort und gewünschte Stücke realistisch sind, ist das manchmal möglich. Für Wunschlieder und Kirchenabsprachen ist etwas Vorlauf aber deutlich entspannter.' },
	],
});

expand('taufen', 'live-musik-taufe', {
	paragraphs: [
		'Ein weiterer Vorteil von Live-Musik ist die natürliche Länge. Ein abgespielter Track endet, auch wenn der Moment noch nicht fertig ist. Live kann ein Schluss gehalten, ein Teil wiederholt oder ein Übergang unauffällig verkürzt werden.',
		'Gerade bei Taufen mit Kindern ist diese Beweglichkeit wertvoll. Wenn ein Baby weint, ein Pate noch nach vorn kommt oder eine Kerze nicht sofort brennt, bleibt die Musik ruhig und unterstützt den Ablauf, statt zusätzlichen Druck zu machen.',
		'Ich plane Live-Musik deshalb nicht als Show, sondern als verlässlichen Bestandteil der Feier. Die Familie bekommt vorher klare Vorschläge, und am Tag selbst bleibt genug Spielraum für das, was in einer echten Taufe eben passieren kann.',
	],
	faqItems: [
		{ question: 'Kann Live-Musik einen Ablauf retten, wenn etwas länger dauert?', answer: 'Sie kann Verzögerungen weich auffangen. Natürlich ersetzt Musik keine Organisation, aber sie verhindert oft, dass kleine Pausen unangenehm wirken.' },
	],
});

expand('taufen', 'musik-gottesdienst-taufe', {
	paragraphs: [
		'Besonders wichtig ist die Abstimmung mit den festen Elementen des Gottesdienstes. Wenn Gemeindelieder, Psalm, Predigt oder Fürbitten bereits stehen, suche ich die Stellen, an denen Instrumentalmusik wirklich ergänzt und nicht doppelt.',
		'Für Familien ist diese Planung oft entlastend, weil sie nicht selbst entscheiden müssen, ob ein Stück liturgisch passt. Ich formuliere auf Wunsch auch kurz, wie die Musik in den Ablauf eingetragen werden kann.',
		'Der Taufgottesdienst soll trotz Live-Musik klar bleiben. Deshalb arbeite ich mit eindeutigen Start- und Endpunkten, halte Blickkontakt und vermeide Einsätze, die in Gebete, Segen oder gesprochene Worte hineinlaufen könnten.',
		'Wenn der Gottesdienst mehrere Familien oder Gemeindeteile umfasst, halte ich die musikalischen Beiträge besonders kompakt. So bleibt die Taufe als persönlicher Moment erkennbar, ohne den gesamten Ablauf zu schwer zu machen.',
	],
	faqItems: [
		{ question: 'Kann die Musik in den Ablaufplan der Kirche aufgenommen werden?', answer: 'Ja. Sobald die Einsatzpunkte feststehen, können sie als kurze musikalische Beiträge im Gottesdienstablauf notiert werden.' },
	],
});

expand('taufen', 'musik-kirche-taufe', {
	paragraphs: [
		'In manchen Kirchen ist weniger tatsächlich mehr. Ein einzelnes Instrument kann im Nachhall sehr weit tragen, weshalb ich lieber mit klaren Linien und Pausen arbeite als mit durchgehendem Spiel.',
		'Wenn der Kirchenraum sehr groß ist, prüfe ich, ob eine kleine Verstärkung sinnvoll wäre. Sie soll nicht konzertant wirken, sondern nur dafür sorgen, dass auch die hinteren Reihen den Klang weich und deutlich wahrnehmen.',
		'Auch der Weg durch den Raum spielt eine Rolle. Wenn Eltern, Paten oder Pfarrperson sich während der Taufhandlung bewegen, wird die Musik so gesetzt, dass niemand sich beeilen muss und keine Wege verdeckt werden.',
	],
	faqItems: [
		{ question: 'Kannst du auch in einer sehr kleinen Kapelle spielen?', answer: 'Ja. Gerade kleine Kapellen eignen sich gut, wenn die Stücke kurz, weich und akustisch passend gewählt werden.' },
	],
});

expand('taufen', 'sanfte-musik-taufe', {
	paragraphs: [
		'Sanfte Musik ist außerdem eine gute Wahl, wenn die Familie bewusst keinen großen Auftritt möchte. Die Viola kann den Tag veredeln, ohne Aufmerksamkeit von Kind, Eltern oder Paten wegzunehmen.',
		'Ich vermeide in diesem Setting abrupte Wechsel, sehr hohe Lagen und zu starke Lautstärkeunterschiede. Die Musik bleibt dadurch auch dann angenehm, wenn Kinder im Raum sind oder Gäste sehr nah am Instrument sitzen.',
		'Der Ablauf kann trotzdem festlich sein. Ein stiller Beginn, ein weicher Einsatz nach der Segnung und ein heller Ausklang geben der Taufe Struktur, ohne dass der Tag schwer oder überinszeniert wirkt.',
		'Auch bei sehr schlichten Feiern lohnt sich eine kurze musikalische Planung. Wenn klar ist, welche Stelle Musik bekommt, bleibt der Moment ruhig und niemand muss während der Taufe spontan entscheiden.',
	],
	faqItems: [
		{ question: 'Ist sanfte Musik auch für eine größere Kirche geeignet?', answer: 'Ja, wenn sie akustisch richtig platziert wird. In großen Räumen kann sanfte Musik besonders schön wirken, weil der Nachhall den Klang weich verlängert.' },
	],
});

expand('taufen', 'emotionale-musik-taufe', {
	paragraphs: [
		'Ich achte bei emotionaler Musik besonders auf die Grenze zwischen berührend und zu viel. Ein Tauftag darf nahegehen, soll aber nicht künstlich dramatisiert werden. Diese Balance entsteht durch Länge, Tonlage und Zeitpunkt.',
		'Wenn ein Lied für Eltern oder Großeltern wichtig ist, lässt sich dieser Bezug oft leise erzählen: nicht durch eine lange Ansage, sondern durch einen gut gesetzten musikalischen Moment, den die Familie sofort erkennt.',
		'Emotionale Musik kann auch dann funktionieren, wenn nicht alle Gäste die Bedeutung kennen. Die Melodie trägt den Moment für die Familie, während der restliche Raum einfach eine warme, stimmige Taufmusik erlebt.',
	],
	faqItems: [
		{ question: 'Kann ein Lied eine Überraschung für die Familie sein?', answer: 'Ja, sofern Ablauf und Rechte zur Aufführung geklärt sind. Wichtig ist, dass die Überraschung organisatorisch nicht mit der Kirche kollidiert.' },
	],
});

expand('taufen', 'klassische-musik-taufe', {
	paragraphs: [
		'Klassische Musik eignet sich auch dann, wenn verschiedene Generationen zusammenkommen. Viele Gäste empfinden bekannte klassische Melodien als würdevoll und vertraut, ohne dass sie eine bestimmte persönliche Geschichte kennen müssen.',
		'Für Solo-Viola wähle ich Fassungen, die melodisch klar bleiben. Wenn ein Werk ursprünglich für Orgel, Chor oder großes Ensemble gedacht ist, wird es so reduziert, dass der Charakter erhalten bleibt und die Besetzung glaubwürdig klingt.',
		'Die Auswahl kann bewusst schlicht sein. Ein Taufgottesdienst braucht nicht die größten klassischen Highlights, sondern Stücke, die in den Raum passen und den Moment der Segnung mit Ruhe tragen.',
		'Wenn ihr zwischen mehreren klassischen Stücken schwankt, ordne ich sie nach Wirkung: gesammelt für den Anfang, besonders warm für die Segnung und heller für den Auszug oder die Gratulationen.',
	],
	faqItems: [
		{ question: 'Kannst du konkrete klassische Vorschläge machen?', answer: 'Ja. Nach Kirche, Dauer und gewünschter Stimmung stelle ich eine kurze Auswahl zusammen, aus der ihr entspannt wählen könnt.' },
	],
});

expand('taufen', 'moderne-musik-taufe', {
	paragraphs: [
		'Bei modernen Liedern klären wir außerdem, ob die Bedeutung eher aus dem Text oder aus der Melodie kommt. Wenn vor allem der Text wichtig ist, muss die Instrumentalfassung besonders sorgfältig gewählt werden, damit die Emotion trotzdem verständlich bleibt.',
		'Manchmal ist ein Refrain als kurzer Einsatz stärker als das komplette Lied. So bleibt der Wiedererkennungswert erhalten, ohne dass der Gottesdienst oder die Segnung musikalisch zu lang wird.',
		'Für Familien mit sehr unterschiedlichen Musikgeschmäckern kann moderne Taufmusik eine gute Brücke sein: ein persönliches Lied für Eltern und Paten, kombiniert mit einem ruhigeren Stück für den kirchlichen Rahmen.',
	],
	faqItems: [
		{ question: 'Was passiert, wenn ein gewünschter Song nicht gut auf Viola funktioniert?', answer: 'Dann sage ich das offen und schlage eine Alternative oder einen kürzeren Ausschnitt vor, der dieselbe Stimmung besser trägt.' },
	],
});
