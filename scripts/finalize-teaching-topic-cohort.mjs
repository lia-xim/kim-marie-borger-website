import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/seo-pages/unterricht');
const STATUS = 'manual-intent-differentiated-2026-07-29';

const rewrites = {
	'geige-unterricht': {
		intentCluster: 'unterricht:regelmaessiger-geigenunterricht',
		heroTitle: 'Geigenunterricht mit einem klaren Ziel für jede Stunde.',
		heroLead: 'Regelmäßiger Unterricht für alle, die nicht nur Stücke wiederholen, sondern Klang, Haltung und Sicherheit nachvollziehbar weiterentwickeln möchten.',
		seal: 'Geige\nStunde für Stunde\nweiterkommen',
		sections: [
			{
				eyebrow: 'Die Probestunde',
				title: 'Zuerst hören, dann planen.',
				lede: 'In der ersten Stunde geht es nicht darum, möglichst viel Stoff unterzubringen. Ich möchte hören und sehen, was bereits funktioniert und wo das Spielen unnötig schwer wird.',
				paragraphs: [
					'Wir schauen auf Instrument, Haltung, Bogenweg, linke Hand und Rhythmus. Wer schon spielt, bringt am besten ein Stück oder eine Stelle mit, die gerade Fragen aufwirft.',
					'Danach legen wir ein erstes Ziel fest. Das kann ein freierer Ton, eine sichere Griffstelle, ein besser lesbarer Rhythmus oder der Wiedereinstieg in ein früher gespieltes Stück sein.',
					'So entsteht kein Standardprogramm, sondern ein Unterrichtsweg, der zum tatsächlichen Stand passt.',
				],
			},
			{
				eyebrow: 'In der Stunde',
				title: 'Eine Priorität, die hörbar wird.',
				lede: 'Eine gute Unterrichtsstunde hat einen roten Faden. Wir wählen einen Schwerpunkt und übertragen ihn direkt in Musik.',
				paragraphs: [
					'Ich erkläre eine Bewegung oder Klangidee, spiele sie vor und lasse Zeit zum Ausprobieren. Rückmeldung gibt es so konkret, dass du den Unterschied selbst hören oder spüren kannst.',
					'Technik bleibt dabei kein isoliertes Training. Ein Bogenwechsel, eine Griffverbindung oder eine rhythmische Stelle wird immer an einem musikalischen Zusammenhang geübt.',
					'Wenn ein Ansatz nicht funktioniert, suchen wir einen anderen. Unterricht soll Probleme verständlicher machen, nicht zusätzliche Rätsel erzeugen.',
				],
			},
			{
				eyebrow: 'Zwischen den Terminen',
				title: 'Üben ohne vages „noch einmal spielen“.',
				lede: 'Am Ende der Stunde ist klar, welche wenigen Aufgaben bis zum nächsten Termin wichtig sind.',
				paragraphs: [
					'Zu jeder Aufgabe gehört ein hörbares oder spürbares Ziel: etwa ein ruhiger Bogenkontakt, eine saubere Verbindung oder ein Rhythmus, der ohne Stocken läuft.',
					'Kurze, wiederholbare Abschnitte sind meist hilfreicher als ein kompletter Durchlauf mit denselben Unsicherheiten. Der Übeplan wird deshalb an die verfügbare Zeit angepasst.',
					'Beim nächsten Termin prüfen wir zuerst, was sich verändert hat, und entscheiden dann über den nächsten Schritt.',
				],
			},
			{
				eyebrow: 'Passt das?',
				title: 'Regelmäßigkeit ist wichtiger als Tempo.',
				lede: 'Diese Seite richtet sich an Menschen, die kontinuierliche Begleitung suchen und zwischen den Stunden selbst weiterarbeiten möchten.',
				paragraphs: [
					'Du musst weder vorspielen können noch ein bestimmtes Niveau erreicht haben. Wichtig ist die Bereitschaft, Fragen offen anzuschauen und kleine Veränderungen zu wiederholen.',
					'Wenn du erst klären möchtest, ob die Geige überhaupt zu dir passt, ist die Seite „Geige lernen“ der passendere Einstieg. Für Kinder und Erwachsene gibt es außerdem eigene Entscheidungshilfen.',
					'In der Anfrage helfen Alter, Vorerfahrung, Instrument, Ziel und ein realistischer Terminrhythmus.',
				],
			},
		],
		faq: [
			['Was unterscheidet regelmäßigen Geigenunterricht von einer einzelnen Beratung?', 'Im regelmäßigen Unterricht bauen die Stunden aufeinander auf. Veränderungen bei Klang, Haltung, Rhythmus und Repertoire werden überprüft und Schritt für Schritt weitergeführt.'],
			['Muss ich ein Stück vorspielen?', 'Nein. Wenn du bereits spielst, ist ein aktuelles Stück hilfreich, aber keine Prüfung. Anfänger:innen können ohne vorbereitetes Repertoire beginnen.'],
			['Wie sieht eine Übeaufgabe aus?', 'Sie benennt eine konkrete Stelle, eine Vorgehensweise und ein hörbares oder spürbares Ziel. So ist zu Hause klar, woran du arbeitest.'],
			['Kann der Schwerpunkt im Verlauf wechseln?', 'Ja. Lernziele verändern sich. Wir überprüfen regelmäßig, ob Technik, Stückauswahl und Unterrichtsrhythmus noch zum Alltag und zum musikalischen Ziel passen.'],
			['Welche Angaben gehören in die erste Anfrage?', 'Hilfreich sind Alter, Vorerfahrung, vorhandenes Instrument, aktuelles Ziel, mögliche Termine und die Zeit, die zwischen zwei Stunden realistisch zum Üben bleibt.'],
		],
		contactTitle: 'Regelmäßigen Geigenunterricht anfragen',
		contactLead: 'Schreib mir, was du gerade spielst oder neu lernen möchtest und wo es hakt. Dann klären wir, ob eine Probestunde und welcher Unterrichtsrhythmus sinnvoll sind.',
		focus: [
			['Hören', 'Bestandsaufnahme', 'Erkennen, was schon trägt', 'Wir beginnen bei deinem tatsächlichen Klang und nicht bei einem vorgegebenen Lehrplan.'],
			['Verstehen', 'Rückmeldung', 'Eine Änderung nachvollziehen', 'Hinweise werden vorgespielt, ausprobiert und so formuliert, dass du sie selbst überprüfen kannst.'],
			['Übertragen', 'Musik', 'Technik im Stück anwenden', 'Jeder technische Schwerpunkt bekommt sofort einen musikalischen Zusammenhang.'],
			['Fortsetzen', 'Übeplan', 'Mit wenigen Aufgaben weiterarbeiten', 'Zwischen den Terminen bleibt eine überschaubare Priorität statt einer langen Wunschliste.'],
		],
	},
	'geigenunterricht-anfaenger': {
		intentCluster: 'unterricht:geigenunterricht-erster-einstieg',
		heroTitle: 'Geigenunterricht für Anfänger:innen: vom ersten Kontakt zum eigenen Ton.',
		heroLead: 'Du brauchst weder Notenkenntnisse noch musikalische Vorerfahrung. Entscheidend ist ein passendes Instrument und ein Einstieg, bei dem eine Sache nach der anderen verständlich wird.',
		seal: 'Anfangen\nzuhören\nweiterprobieren',
		sections: [
			{
				eyebrow: 'Vor dem Start',
				title: 'Das Instrument muss zuerst zum Menschen passen.',
				lede: 'Bevor die erste Melodie entsteht, prüfen wir Größe, Schultergefühl, Bogenhaltung und die Frage, ob ein eigenes oder geliehenes Instrument vorhanden ist.',
				paragraphs: [
					'Ein ungeeignetes Instrument erschwert Bewegungen, die am Anfang ohnehin neu sind. Deshalb lohnt sich die Klärung vor einem Kauf.',
					'Notenlesen ist keine Voraussetzung. Erste Zeichen und Rhythmen werden dann eingeführt, wenn sie beim Spielen unmittelbar helfen.',
					'In der Probestunde darfst du herausfinden, wie sich Geige und Bogen überhaupt anfühlen. Ein fertiger Ton wird nicht erwartet.',
				],
			},
			{
				eyebrow: 'Die ersten Grundlagen',
				title: 'Halten, streichen, hören.',
				lede: 'Am Anfang greifen viele neue Bewegungen ineinander. Wir trennen sie zunächst, damit weder Arme noch Kopf alles gleichzeitig lösen müssen.',
				paragraphs: [
					'Offene Saiten machen hörbar, wie Kontaktstelle, Bogengeschwindigkeit und Gewicht den Ton verändern. Die linke Hand kommt dazu, sobald die Grundbewegung ruhiger wird.',
					'Pausen gehören zum Lernen. Eine entspannte Wiederholung ist wertvoller als viele Durchgänge mit festgehaltenem Atem oder verkrampften Schultern.',
					'Erste kleine Melodien verbinden Gehör, Rhythmus und Bewegung. Sie sind kein Endziel, sondern ein verständlicher Rahmen für neue Fähigkeiten.',
				],
			},
			{
				eyebrow: 'Üben zu Hause',
				title: 'Kurz genug, um wirklich wiederzukommen.',
				lede: 'Für Anfänger:innen zählt nicht eine beeindruckende Übedauer, sondern eine Aufgabe, die am nächsten Tag noch nachvollziehbar ist.',
				paragraphs: [
					'Wir teilen das Üben in kleine Abschnitte: Instrument vorbereiten, eine Bewegung prüfen, eine kurze Stelle spielen und am Ende noch einmal bewusst zuhören.',
					'Ein Fehler ist zunächst Information. Wir suchen die Stelle, an der die Bewegung oder Vorstellung unklar wird, statt das ganze Stück schneller zu wiederholen.',
					'Der Umfang wächst mit der Sicherheit. Niemand muss zu Beginn einen fortgeschrittenen Übealltag imitieren.',
				],
			},
			{
				eyebrow: 'Der passende nächste Schritt',
				title: 'Anfänger:in ist ein Lernstand, keine Altersgruppe.',
				lede: 'Kinder, Jugendliche und Erwachsene können neu beginnen, brauchen aber unterschiedliche Erklärungen, Instrumentengrößen und Alltagspläne.',
				paragraphs: [
					'Für Kinder ist die Rolle der Eltern wichtig. Erwachsene profitieren oft von einer sehr bewussten Erklärung und einem realistischen Umgang mit begrenzter Zeit.',
					'Wenn du schon länger spielst und kontinuierliche Begleitung suchst, passt die Seite zum regelmäßigen Geigenunterricht besser.',
					'Für die erste Anfrage genügen Alter, vorhandenes Instrument, mögliche Vorerfahrung und der Wunsch, den du mit der Geige verbindest.',
				],
			},
		],
		faq: [
			['Brauche ich vor der ersten Stunde eine eigene Geige?', 'Nicht zwingend. Wichtig ist, vor einem Kauf oder einer Miete die passende Größe und den Zustand des Instruments zu klären.'],
			['Muss ich Noten lesen können?', 'Nein. Noten und Rhythmuszeichen werden schrittweise mit dem verbunden, was du gerade spielst und hörst.'],
			['Ist ein schiefer Ton am Anfang normal?', 'Der Ton reagiert auf viele neue Bewegungen. Im Unterricht lernst du, welche Veränderung am Bogen oder an der linken Hand hörbar etwas bewirkt.'],
			['Wie viel sollte ich am Anfang üben?', 'Die Aufgabe muss regelmäßig und konzentriert wiederholbar sein. Wir planen Dauer und Umfang passend zu Alter, Alltag und Aufmerksamkeit statt nach einer pauschalen Zahl.'],
			['Was sollte ich zur Probestunde mitbringen?', 'Falls vorhanden: Instrument, Bogen, Zubehör und Noten. Ohne Instrument klären wir vorab, welche Lösung für die Probestunde möglich ist.'],
		],
		contactTitle: 'Den Einstieg in die Geige besprechen',
		contactLead: 'Sag mir kurz, für wen der Unterricht gedacht ist, ob bereits ein Instrument vorhanden ist und was dich an der Geige interessiert. Dann planen wir den ersten sinnvollen Schritt.',
		focus: [
			['Start', 'Instrument', 'Größe und Haltung prüfen', 'Ein passendes Instrument schafft die Grundlage dafür, dass neue Bewegungen überhaupt entspannt gelernt werden können.'],
			['Ton', 'Bogen', 'Ursache und Wirkung hören', 'Offene Saiten zeigen sehr direkt, wie der Bogen den Klang verändert.'],
			['Hand', 'Griffe', 'Töne schrittweise finden', 'Die linke Hand wird aufgebaut, ohne die grundlegende Balance am Instrument zu verlieren.'],
			['Alltag', 'Wiederholung', 'Eine kleine Routine entwickeln', 'Üben soll klar genug sein, dass du selbstständig wieder anfangen kannst.'],
		],
	},
	'geigenunterricht-erwachsene': {
		intentCluster: 'unterricht:geigenunterricht-erwachsene',
		heroTitle: 'Geigenunterricht für Erwachsene – neu anfangen oder wieder einsteigen.',
		heroLead: 'Erwachsene bringen Neugier, Erwartungen und einen vollen Alltag mit. Der Unterricht verbindet diese Voraussetzungen mit einem Lernweg, der weder kindlich erklärt noch künstlich beschleunigt wird.',
		seal: 'Erwachsene\nneu oder wieder\nmit eigenem Ziel',
		sections: [
			{
				eyebrow: 'Neustart oder Rückkehr',
				title: 'Vorerfahrung zählt, bestimmt aber nicht alles.',
				lede: 'Manche Erwachsene halten zum ersten Mal eine Geige. Andere erinnern sich an Unterricht aus der Schulzeit, aber nicht mehr an jede Bewegung.',
				paragraphs: [
					'Beim Wiedereinstieg prüfen wir, was der Körper noch kennt und welche alten Gewohnheiten heute eher bremsen. Niemand muss an genau der Stelle weitermachen, an der früher aufgehört wurde.',
					'Wer neu beginnt, erhält erwachsenengerechte Erklärungen und darf technische Zusammenhänge verstehen. Trotzdem bleibt Hören wichtiger als ein theoretischer Vortrag.',
					'Das erste Ziel entsteht aus deiner Motivation: ein bestimmtes Stück, gemeinsames Musizieren, ein freierer Klang oder einfach die Freude an einem neuen Instrument.',
				],
			},
			{
				eyebrow: 'Körper und Klang',
				title: 'Nicht gegen das Instrument arbeiten.',
				lede: 'Erwachsene versuchen häufig, neue Bewegungen besonders kontrolliert auszuführen. Zu viel Kontrolle kann Schultern, Hände und Bogen jedoch fest machen.',
				paragraphs: [
					'Wir suchen eine Haltung, die zum eigenen Körper passt, und unterscheiden notwendige Stabilität von unnötiger Spannung.',
					'Der Ton wird nicht durch Kraft „schön gemacht“. Kontaktstelle, Bogenweg und Bewegungsfreiheit lassen sich gezielt hören und verändern.',
					'Bei Beschwerden ersetzt Unterricht keine medizinische Behandlung. Bewegungen können aber so angepasst werden, dass Warnsignale früh ernst genommen werden.',
				],
			},
			{
				eyebrow: 'Ein voller Kalender',
				title: 'Üben muss in eine echte Woche passen.',
				lede: 'Ein Plan ist nur hilfreich, wenn er neben Arbeit, Familie und anderen Verpflichtungen wiederholbar bleibt.',
				paragraphs: [
					'Wir vereinbaren kleine Prioritäten, die auch an kurzen Tagen möglich sind. An ruhigeren Tagen kann daraus eine längere musikalische Einheit werden.',
					'Unterbrechungen sind kein moralisches Versagen. Nach einer vollen Woche klären wir, was trotzdem hängen geblieben ist, und setzen dort wieder an.',
					'Ein realistischer Terminrhythmus schützt die Freude besser als ein ambitionierter Plan, der nach wenigen Wochen nicht mehr funktioniert.',
				],
			},
			{
				eyebrow: 'Eigene Musik',
				title: 'Stücke dürfen einen persönlichen Grund haben.',
				lede: 'Erwachsene wissen oft sehr genau, welche Musik sie berührt. Wünsche werden deshalb nicht bis zu einem abstrakten „später“ vertagt.',
				paragraphs: [
					'Wir prüfen, welcher Ausschnitt oder welches Arrangement zum aktuellen Stand passt und welche Technik das Stück verlangt.',
					'Klassische Grundlagen, Filmmusik, Melodien oder Ensembleliteratur können nebeneinanderstehen, wenn sie den Lernweg sinnvoll unterstützen.',
					'In der Anfrage helfen Vorerfahrung, Instrument, Wunschstücke, zeitlicher Rahmen und die Frage, ob du neu beginnst oder wieder einsteigst.',
				],
			},
		],
		faq: [
			['Bin ich zu alt, um Geige zu lernen?', 'Ein Einstieg ist auch im Erwachsenenalter möglich. Lernweg und Tempo richten sich nach Körpergefühl, Vorerfahrung, Ziel und verfügbarer Zeit.'],
			['Was passiert bei einem Wiedereinstieg?', 'Wir prüfen zuerst, was noch sicher ist und wo alte Gewohnheiten oder fehlende Grundlagen das Spielen erschweren. Daraus entsteht ein neuer Ausgangspunkt.'],
			['Muss ich täglich lange üben?', 'Nein. Regelmäßige, klare Aufgaben sind wichtiger als eine pauschale lange Dauer. Der Plan wird an deine tatsächliche Woche angepasst.'],
			['Kann ich ein Wunschstück mitbringen?', 'Ja. Wir schauen, ob das Original, ein Ausschnitt oder eine angepasste Fassung zum aktuellen Stand passt.'],
			['Was, wenn ich sehr selbstkritisch bin?', 'Im Unterricht wird Rückmeldung konkret und überprüfbar. Ziel ist nicht, jeden Ton sofort zu bewerten, sondern Ursachen zu verstehen und Fortschritt hörbar zu machen.'],
		],
		contactTitle: 'Geigenunterricht für Erwachsene anfragen',
		contactLead: 'Schreib mir, ob du neu anfängst oder wieder einsteigst, welche Musik du spielen möchtest und welcher Rhythmus in deinem Alltag realistisch ist.',
		focus: [
			['Biografie', 'Ausgangspunkt', 'Die eigene Vorgeschichte nutzen', 'Frühere Erfahrungen, heutige Motivation und mögliche Unsicherheiten gehören in die Planung.'],
			['Körper', 'Bewegung', 'Spannung rechtzeitig erkennen', 'Haltung und Bogenführung werden an den eigenen Körper angepasst.'],
			['Zeit', 'Routine', 'Eine echte Woche planen', 'Die Aufgaben müssen auch neben Beruf und Familie wiederholbar bleiben.'],
			['Musik', 'Wunschstücke', 'Persönliche Ziele hörbar machen', 'Repertoire wird so gewählt oder angepasst, dass es motiviert und technisch weiterführt.'],
		],
	},
	'geigenunterricht-kinder': {
		intentCluster: 'unterricht:geigenunterricht-kinder',
		heroTitle: 'Geigenunterricht für Kinder: neugierig beginnen, verlässlich begleiten.',
		heroLead: 'Kindgerechter Unterricht heißt nicht, Anforderungen zu verstecken. Bewegungen, Hören und kleine musikalische Aufgaben werden so erklärt, dass ein Kind selbst versteht, was es ausprobieren kann.',
		seal: 'Kinder\nNeugier und Ruhe\nmit Begleitung',
		sections: [
			{
				eyebrow: 'Ist der Zeitpunkt passend?',
				title: 'Nicht nur das Alter entscheidet.',
				lede: 'Für den Einstieg sind Neugier, Konzentrationsspanne, Körpergefühl und die Bereitschaft wichtig, eine kleine Aufgabe mehrmals zu versuchen.',
				paragraphs: [
					'Eine Probestunde zeigt mehr als eine feste Altersgrenze. Das Kind darf Instrument und Bogen kennenlernen, zuhören und eine erste Bewegung ausprobieren.',
					'Wenn das Interesse nur von Erwachsenen ausgeht, sprechen wir offen darüber. Dauerhafte Motivation lässt sich nicht verordnen.',
					'Ein späterer Start kann die bessere Entscheidung sein. Die Probestunde ist deshalb Orientierung und keine Prüfung.',
				],
			},
			{
				eyebrow: 'Instrument und Bewegung',
				title: 'Die Geige muss körperlich handhabbar sein.',
				lede: 'Größe, Gewicht, Schultergefühl und die Länge des Bogens beeinflussen, ob ein Kind entspannt lernen kann.',
				paragraphs: [
					'Vor einem Kauf sollte geklärt werden, welche Instrumentengröße passt. Ein zu großes Instrument macht viele Bewegungen unnötig schwer.',
					'Im Unterricht wechseln Hörspiele, Rhythmus, Bewegung und kurze Spielphasen. Erklärungen bleiben konkret und werden direkt ausprobiert.',
					'Sauberkeit entsteht schrittweise. Zuerst soll das Kind Unterschiede hören und eine Bewegung wiedererkennen können.',
				],
			},
			{
				eyebrow: 'Rolle der Eltern',
				title: 'Unterstützen, ohne jede Probe zu kontrollieren.',
				lede: 'Eltern brauchen genug Einblick, um zu Hause helfen zu können, aber das Instrument soll nicht zum täglichen Konflikt werden.',
				paragraphs: [
					'Nach der Stunde sind wenige Aufgaben klar benannt. Bei jüngeren Kindern kann eine erwachsene Person helfen, die Reihenfolge zu erinnern oder das Instrument sicher vorzubereiten.',
					'Korrigieren in jedem Moment ist nicht nötig. Besser ist eine ruhige Übezeit, in der das Kind selbst hören und ausprobieren darf.',
					'Wenn etwas regelmäßig zu Frust führt, gehört diese Beobachtung in die nächste Stunde. Dann verändern wir Aufgabe, Umfang oder Erklärung.',
				],
			},
			{
				eyebrow: 'Motivation',
				title: 'Fortschritt soll für das Kind erkennbar sein.',
				lede: 'Ein Lernziel wirkt besser, wenn es nicht nur Erwachsenen wichtig ist.',
				paragraphs: [
					'Kleine Melodien, Rhythmusaufgaben und persönliche Musikwünsche geben neuen Bewegungen einen hörbaren Sinn.',
					'Lob bleibt konkret: etwa für einen ruhigen Bogenweg, aufmerksames Zuhören oder eine Stelle, die selbstständig gelöst wurde.',
					'Für die Anfrage helfen Alter, bisheriger Kontakt mit Musik, vorhandenes Instrument, Interessen und mögliche Termine.',
				],
			},
		],
		faq: [
			['Ab welchem Alter ist Geigenunterricht sinnvoll?', 'Eine pauschale Altersgrenze reicht nicht. Neugier, Aufmerksamkeit, Körpergefühl und passende Instrumentengröße werden in einer Probestunde gemeinsam betrachtet.'],
			['Müssen Eltern beim Üben helfen?', 'Bei jüngeren Kindern oft ja, vor allem beim Vorbereiten des Instruments und Erinnern der Aufgabe. Die Verantwortung soll aber schrittweise beim Kind wachsen.'],
			['Sollte vor der Probestunde eine Geige gekauft werden?', 'Nein. Die passende Größe sollte zuerst fachlich geklärt werden, damit ein ungeeignetes Instrument den Einstieg nicht erschwert.'],
			['Was, wenn mein Kind nicht üben möchte?', 'Dann ist wichtig zu verstehen, ob Aufgabe, Zeitpunkt, Umfang oder das grundsätzliche Interesse nicht passen. Der Unterrichtsplan kann angepasst werden; Motivation lässt sich nicht erzwingen.'],
			['Werden auch Wunschlieder gespielt?', 'Ja, wenn eine passende Fassung gefunden werden kann. Wünsche können sehr motivierend sein und werden mit den gerade wichtigen Grundlagen verbunden.'],
		],
		contactTitle: 'Geigenunterricht für ein Kind anfragen',
		contactLead: 'Nenne mir Alter, musikalische Vorerfahrung, vorhandenes Instrument und das Interesse des Kindes. Dann können wir eine Probestunde sinnvoll vorbereiten.',
		focus: [
			['Bereit?', 'Probestunde', 'Interesse und Aufmerksamkeit beobachten', 'Der Einstieg wird nicht allein aus dem Geburtsdatum abgeleitet.'],
			['Passend?', 'Instrument', 'Größe und Handhabung klären', 'Ein geeignetes Instrument erleichtert Haltung, Bogenweg und selbstständiges Lernen.'],
			['Verstanden?', 'Aufgabe', 'In Bildern, Klang und Bewegung erklären', 'Das Kind soll selbst wissen, was es als Nächstes ausprobieren kann.'],
			['Begleitet?', 'Eltern', 'Hilfe ohne Dauerkontrolle', 'Eltern erhalten klare Hinweise, während musikalische Verantwortung langsam beim Kind wächst.'],
		],
	},
	'musikunterricht-geige': {
		intentCluster: 'unterricht:musikverstaendnis-geige',
		heroTitle: 'Musikunterricht mit der Geige: hören, lesen und gestalten.',
		heroLead: 'Hier steht nicht nur die Spieltechnik im Mittelpunkt. Geige, Rhythmus, Notenbild, Gehör und musikalischer Ausdruck werden als zusammenhängende Sprache gelernt.',
		seal: 'Geige\nMusik verstehen\nund gestalten',
		sections: [
			{
				eyebrow: 'Mehr als Griff und Bogen',
				title: 'Warum klingt eine Phrase wie eine Frage oder eine Antwort?',
				lede: 'Musikunterricht beginnt dort, wo Technik eine musikalische Bedeutung bekommt.',
				paragraphs: [
					'Wir hören, wie Spannung, Ruhe, Richtung und Gewicht in einer Melodie entstehen. Bogenführung und Fingersatz werden danach ausgewählt, was die Phrase braucht.',
					'Rhythmus wird gesprochen, geklopft und gespielt. Dadurch bleibt er nicht als Rechenaufgabe auf dem Papier stehen.',
					'Noten zeigen mehr als Tonhöhen. Wiederholungen, Artikulation, Dynamik und Form helfen, ein Stück selbstständiger zu verstehen.',
				],
			},
			{
				eyebrow: 'Gehör und Notation',
				title: 'Sehen, hören, überprüfen.',
				lede: 'Notenlesen und Gehörbildung unterstützen einander, wenn beides direkt am Instrument stattfindet.',
				paragraphs: [
					'Kurze Motive werden zuerst gehört und anschließend im Notenbild wiedergefunden – oder umgekehrt.',
					'Intonation wird nicht nur mit „höher“ oder „tiefer“ korrigiert. Wir hören Beziehungen zwischen Tönen und vergleichen, wie sich eine Stelle im musikalischen Zusammenhang anfühlt.',
					'Theorie kommt genau dann dazu, wenn sie eine aktuelle Frage beantwortet. Begriffe ohne Anwendung bleiben draußen.',
				],
			},
			{
				eyebrow: 'Stil und Repertoire',
				title: 'Ein Stück hat eine Herkunft und eine Spielweise.',
				lede: 'Klassische Musik, Filmmusik oder eine persönliche Melodie stellen unterschiedliche Fragen an Klang, Puls und Artikulation.',
				paragraphs: [
					'Wir vergleichen Aufnahmen, lesen Hinweise in den Noten und probieren verschiedene Lösungen aus.',
					'Eine Interpretation muss nicht kopiert werden. Wichtig ist, Entscheidungen hören und begründen zu können.',
					'Technische Übungen werden aus dem Repertoire abgeleitet oder gezielt dorthin zurückgeführt.',
				],
			},
			{
				eyebrow: 'Für wen?',
				title: 'Für Lernende, die Zusammenhänge verstehen möchten.',
				lede: 'Diese Ausrichtung passt, wenn Fragen nach Rhythmus, Noten, Form und Ausdruck genauso wichtig sind wie die sichere Bewegung am Instrument.',
				paragraphs: [
					'Für einen vollständigen Neueinstieg ist die Anfänger-Seite konkreter. Wer vor allem regelmäßige technische Begleitung sucht, findet sie unter „Geige Unterricht“.',
					'Musikalisches Verständnis ist kein Fortgeschrittenenthema. Auch ein erstes kleines Stück kann bewusst gehört und gestaltet werden.',
					'In der Anfrage helfen Lernstand, Notenkenntnisse, Repertoire und die musikalischen Fragen, die du gerade mitbringst.',
				],
			},
		],
		faq: [
			['Ist das Musiktheorieunterricht?', 'Theorie ist enthalten, aber immer mit Hören und Spielen verbunden. Es geht nicht um Begriffe ohne Anwendung.'],
			['Brauche ich bereits Notenkenntnisse?', 'Nein. Notenlesen kann von Anfang an aufgebaut oder bei vorhandenen Lücken neu mit dem Instrument verbunden werden.'],
			['Wird trotzdem an Technik gearbeitet?', 'Ja. Haltung, Bogen und Intonation bleiben wichtig, werden aber aus der musikalischen Aufgabe heraus betrachtet.'],
			['Kann ich Musik aus verschiedenen Stilen mitbringen?', 'Ja. Unterschiedliche Stücke helfen sogar, Artikulation, Rhythmus und Klangvorstellung bewusst zu vergleichen.'],
			['Für wen ist diese Seite nicht der beste Einstieg?', 'Wer ausschließlich klären möchte, wie der allererste Geigenstart abläuft, findet auf der Anfänger-Seite eine gezieltere Antwort.'],
		],
		contactTitle: 'Musikunterricht mit der Geige anfragen',
		contactLead: 'Beschreibe kurz deinen Lernstand, deine Notenkenntnisse und welche musikalische Frage oder welches Stück du besser verstehen möchtest.',
		focus: [
			['Puls', 'Rhythmus', 'Zeit körperlich verstehen', 'Sprechen, Klopfen und Spielen verbinden das Notenbild mit einer stabilen Bewegung.'],
			['Beziehung', 'Gehör', 'Töne im Zusammenhang hören', 'Intonation wird über hörbare Beziehungen statt nur über einzelne Korrekturen entwickelt.'],
			['Struktur', 'Notation', 'Form im Notentext erkennen', 'Zeichen und Wiederholungen helfen, ein Stück selbstständiger zu erschließen.'],
			['Aussage', 'Interpretation', 'Eine musikalische Entscheidung treffen', 'Klang und Artikulation werden danach gewählt, was die Phrase ausdrücken soll.'],
		],
	},
	'bratsche-unterricht': {
		intentCluster: 'unterricht:regelmaessiger-bratschenunterricht',
		heroTitle: 'Bratschenunterricht für einen tragfähigen, warmen Klang.',
		heroLead: 'Regelmäßige Begleitung für Bratschist:innen, die Bogenkontakt, linke Hand, Altschlüssel und musikalische Sicherheit gezielt weiterentwickeln möchten.',
		seal: 'Bratsche\nKlang tragen\nsicher spielen',
		sections: [
			{
				eyebrow: 'Ausgangspunkt',
				title: 'Bratsche neu beginnen oder von der Geige wechseln.',
				lede: 'Die Bratsche ähnelt der Geige, reagiert aber nicht in jeder Bewegung gleich. Größe, Saitenansprache und die eigene Klangvorstellung brauchen Aufmerksamkeit.',
				paragraphs: [
					'Wer von der Geige kommt, bringt viel mit, muss aber nicht jede Gewohnheit unverändert übertragen. Wir prüfen Bogenkontakt, Griffabstände und die Balance des Instruments neu.',
					'Wer direkt mit der Bratsche beginnt, baut Haltung, Ton und Notation ohne Umweg auf.',
					'In der Probestunde klären wir, welches Instrument vorhanden ist, wie es sich körperlich anfühlt und welches musikalische Ziel im Vordergrund steht.',
				],
			},
			{
				eyebrow: 'Tonbildung',
				title: 'Die tiefen Saiten brauchen Kontakt, keine Härte.',
				lede: 'Ein voller Bratschenklang entsteht aus einem passenden Verhältnis von Bogenweg, Geschwindigkeit, Gewicht und Kontaktstelle.',
				paragraphs: [
					'Wir hören, wann der Ton trägt und wann mehr Druck ihn nur enger macht. Die Veränderung wird direkt auf langen Tönen und im aktuellen Stück erprobt.',
					'Saitenwechsel werden so vorbereitet, dass der Klang nicht an jedem Übergang abreißt.',
					'Die linke Hand bleibt beweglich, damit größere Griffabstände nicht durch unnötiges Festhalten kompensiert werden.',
				],
			},
			{
				eyebrow: 'Lesen und Zusammenspiel',
				title: 'Altschlüssel und innere Stimme sicher erfassen.',
				lede: 'Der Altschlüssel wird nicht als isolierte Zusatzaufgabe behandelt, sondern mit Griff, Ton und musikalischem Verlauf verbunden.',
				paragraphs: [
					'Kurze Lesemuster helfen, vertraute Griffbilder aufzubauen. Bei einem Wechsel von der Geige trennen wir bewusst alte Lesereflexe von der neuen Notation.',
					'Ensemble- oder Orchesterstellen können einbezogen werden. Gerade Mittelstimmen verlangen ein gutes Gefühl für Puls, Harmonie und die Stimmen um sie herum.',
					'So entsteht Sicherheit nicht nur beim Alleinspielen, sondern auch in der musikalischen Funktion der Bratsche.',
				],
			},
			{
				eyebrow: 'Regelmäßiger Weg',
				title: 'Unterricht, der am aktuellen Repertoire ansetzt.',
				lede: 'Der Schwerpunkt kann zwischen Klang, Technik, Lesesicherheit und Vorbereitung auf Zusammenspiel wechseln.',
				paragraphs: [
					'Jede Stunde endet mit wenigen klaren Aufgaben und einer Vorstellung davon, woran Fortschritt hörbar wird.',
					'Wenn du erst herausfinden möchtest, ob die Bratsche zu dir passt, ist „Bratsche lernen“ der passendere Einstieg. Altersbezogene Fragen werden auf den Kinder- und Erwachsenenseiten beantwortet.',
					'Für eine Anfrage helfen Vorerfahrung, Instrument, aktuelle Stücke, Ensemblebezug und mögliche Unterrichtstermine.',
				],
			},
		],
		faq: [
			['Kann ich von der Geige zur Bratsche wechseln?', 'Ja. Viele Grundlagen lassen sich nutzen, während Größe, Ansprache, Griffabstände und Altschlüssel bewusst neu eingeordnet werden.'],
			['Wird der Altschlüssel im Unterricht erklärt?', 'Ja. Er wird direkt mit Griffbildern, Hören und dem aktuellen Repertoire verbunden.'],
			['Kann ich Orchesterstellen mitbringen?', 'Ja. Ensemble- und Orchesterliteratur eignet sich gut, um Puls, Klangfunktion, Lesesicherheit und technische Fragen zusammenzubringen.'],
			['Brauche ich bereits eine eigene Bratsche?', 'Für regelmäßiges Üben wird ein passendes Instrument benötigt. Vor Kauf oder Miete sollte Größe und Spielbarkeit geklärt werden.'],
			['Was sollte in meiner Anfrage stehen?', 'Hilfreich sind Vorerfahrung auf Bratsche oder Geige, Instrument, Repertoire, Ziel, Ensemblebezug und mögliche Termine.'],
		],
		contactTitle: 'Regelmäßigen Bratschenunterricht anfragen',
		contactLead: 'Schreib mir, ob du direkt mit der Bratsche beginnst, von der Geige wechselst oder an konkretem Repertoire arbeitest. Dann planen wir die Probestunde.',
		focus: [
			['Balance', 'Instrument', 'Größe und Haltung abstimmen', 'Die Bratsche soll getragen werden, ohne dass Schulter und linke Hand dauerhaft festhalten.'],
			['Resonanz', 'Bogen', 'Tiefe Saiten frei ansprechen', 'Bogenweg und Kontakt werden so angepasst, dass der Ton trägt statt gedrückt zu wirken.'],
			['Orientierung', 'Altschlüssel', 'Lesen mit Hören verbinden', 'Notation wird direkt in Griffbilder und musikalische Zusammenhänge übersetzt.'],
			['Funktion', 'Ensemble', 'Die innere Stimme gestalten', 'Puls, Harmonie und das Hören auf andere Stimmen gehören zum Bratschenspiel.'],
		],
	},
	'bratschenunterricht-anfaenger': {
		intentCluster: 'unterricht:bratsche-erster-einstieg',
		heroTitle: 'Bratschenunterricht für Anfänger:innen: mit Ruhe in den tiefen Klang.',
		heroLead: 'Ein Einstieg ohne vorausgesetzte Notenkenntnisse – vom passenden Instrument über den ersten Bogenkontakt bis zu kleinen Melodien im Altschlüssel.',
		seal: 'Bratsche\nvon Grund auf\nwarm im Klang',
		sections: [
			{
				eyebrow: 'Instrument wählen',
				title: 'Bratsche ist nicht einfach „eine größere Geige“.',
				lede: 'Bratschen unterscheiden sich in Größe und Spielgefühl. Für den Einstieg zählt, ob das Instrument körperlich gut handhabbar ist und sauber anspricht.',
				paragraphs: [
					'Vor einem Kauf oder einer Miete sollten Armlänge, Schultergefühl und Zustand des Instruments geprüft werden.',
					'Wer zwischen Geige und Bratsche schwankt, darf Klang und Haltung vergleichen. Die Entscheidung muss nicht nur aus Gewohnheit für das bekanntere Instrument fallen.',
					'Zur ersten Stunde sind keine Notenkenntnisse erforderlich. Neugier auf den tieferen Klang ist ein guter Anfang.',
				],
			},
			{
				eyebrow: 'Erster Ton',
				title: 'Resonanz finden statt Lautstärke erzwingen.',
				lede: 'Die C- und G-Saite reagieren besonders deutlich darauf, wie der Bogen die Saite berührt.',
				paragraphs: [
					'Wir beginnen mit offenen Saiten und hören, wie Kontaktstelle und Bogengeschwindigkeit den Ton öffnen oder bremsen.',
					'Die linke Hand wird später ergänzt, ohne dass das Instrument zwischen Schulter und Hand eingeklemmt werden muss.',
					'Kleine Pausen helfen, Bewegungen wahrzunehmen. Ein voller Ton entsteht nicht durch möglichst viel Kraft.',
				],
			},
			{
				eyebrow: 'Altschlüssel',
				title: 'Neue Zeichen direkt mit Klang verbinden.',
				lede: 'Der Altschlüssel wird von Anfang an in kleinen Portionen eingeführt und unmittelbar auf der Bratsche gespielt.',
				paragraphs: [
					'Einzelne Töne, kurze Muster und erste Melodien machen die Notation überschaubar.',
					'Wer schon einen anderen Schlüssel kennt, darf zunächst langsam umdenken. Schnelles Raten hilft weniger als ein verlässliches neues Griffbild.',
					'Rhythmus wird gesprochen und bewegt, bevor Noten und Bogen alles gleichzeitig leisten sollen.',
				],
			},
			{
				eyebrow: 'Zu Hause',
				title: 'Eine kleine Klangroutine aufbauen.',
				lede: 'Anfänger:innen brauchen Aufgaben, die ohne Lehrkraft erneut begonnen werden können.',
				paragraphs: [
					'Wir halten fest, wie Instrument und Bogen vorbereitet werden, welche Saite oder Stelle im Mittelpunkt steht und worauf du hören sollst.',
					'Kurze Wiederholungen mit Aufmerksamkeit sind sinnvoller als ein langer Durchlauf, der immer an derselben Stelle scheitert.',
					'Für die Anfrage helfen Alter, vorhandenes Instrument, musikalische Vorerfahrung und die Frage, warum dich gerade die Bratsche interessiert.',
				],
			},
		],
		faq: [
			['Kann ich ohne vorherige Geige mit der Bratsche anfangen?', 'Ja. Die Bratsche kann direkt als erstes Streichinstrument gelernt werden. Geige ist keine Voraussetzung.'],
			['Wie finde ich die passende Bratschengröße?', 'Größe und Spielgefühl sollten fachlich geprüft werden. Armlänge allein reicht nicht; auch Schultergefühl, Gewicht und Zustand des Instruments zählen.'],
			['Ist der Altschlüssel schwer?', 'Er ist zunächst ungewohnt, kann aber schrittweise mit Tönen und Griffbildern auf der Bratsche verbunden werden.'],
			['Brauche ich Notenkenntnisse?', 'Nein. Notenlesen und Rhythmus werden zusammen mit dem Instrument aufgebaut.'],
			['Was passiert in der Probestunde?', 'Wir betrachten Instrument, Haltung, Klanginteresse und eine erste Bewegung. Es geht um Orientierung, nicht um eine Leistungskontrolle.'],
		],
		contactTitle: 'Mit der Bratsche anfangen',
		contactLead: 'Sag mir, ob schon ein Instrument vorhanden ist, welche musikalische Erfahrung du mitbringst und was dich am Bratschenklang anspricht.',
		focus: [
			['Wahl', 'Größe', 'Ein handhabbares Instrument finden', 'Passende Maße und gute Spielbarkeit verhindern, dass der Einstieg unnötig schwer wird.'],
			['Kontakt', 'Bogen', 'Tiefe Saiten zum Schwingen bringen', 'Der Klang wird über Kontakt und Bewegung entwickelt, nicht über groben Druck.'],
			['Lesen', 'Altschlüssel', 'Ein neues Notenbild aufbauen', 'Kleine Muster verbinden Zeichen, Griff und gehörten Ton.'],
			['Routine', 'Üben', 'Selbst wieder anfangen können', 'Die Aufgabe enthält eine klare Reihenfolge und ein hörbares Ziel.'],
		],
	},
	'bratschenunterricht-erwachsene': {
		intentCluster: 'unterricht:bratschenunterricht-erwachsene',
		heroTitle: 'Bratschenunterricht für Erwachsene: eigener Klang, eigener Lernweg.',
		heroLead: 'Für Erwachsene, die neu beginnen, von der Geige wechseln oder nach einer Pause wieder Bratsche spielen möchten – mit realistischen Aufgaben und Raum für persönliche Musik.',
		seal: 'Erwachsene\nBratschenklang\nohne Zeitdruck',
		sections: [
			{
				eyebrow: 'Warum Bratsche?',
				title: 'Der tiefere Klang darf der eigentliche Grund sein.',
				lede: 'Viele Erwachsene entdecken die Bratsche bewusst wegen ihrer warmen Mittellage oder ihrer Rolle im Zusammenspiel.',
				paragraphs: [
					'Wer neu beginnt, muss nicht zuerst Geige lernen. Wer wechselt, bringt Technik und Gehör mit, darf die neue Größe und Ansprache aber eigenständig kennenlernen.',
					'In der Probestunde vergleichen wir Erwartung und tatsächliches Spielgefühl. Auch die Frage nach einem passenden Instrument gehört dazu.',
					'Das Ziel kann ein Ensemble, ein bestimmtes Werk, der Wiedereinstieg oder einfach ein eigener resonanter Ton sein.',
				],
			},
			{
				eyebrow: 'Bewegung',
				title: 'Mehr Instrument verlangt nicht automatisch mehr Kraft.',
				lede: 'Erwachsene reagieren auf die größere Bauweise manchmal mit festem Greifen oder hochgezogener Schulter.',
				paragraphs: [
					'Wir verteilen das Gewicht so, dass linke Hand und Nacken beweglich bleiben.',
					'Der Bogen erhält genug Kontakt für die tieferen Saiten, ohne den Ton zusammenzudrücken.',
					'Individuelle körperliche Grenzen werden ernst genommen. Unterricht ersetzt keine medizinische Abklärung, kann aber unnötige Spannung sichtbar machen.',
				],
			},
			{
				eyebrow: 'Vorerfahrung nutzen',
				title: 'Geigenkenntnisse helfen – und dürfen neu sortiert werden.',
				lede: 'Beim Wechsel sind Griffgefühl, Bogenführung und musikalische Erfahrung wertvoll. Altschlüssel und größere Abstände brauchen dennoch eine eigene Lernphase.',
				paragraphs: [
					'Wir trennen Lesefehler von technischen Fragen, damit nicht jedes Problem gleichzeitig bearbeitet werden muss.',
					'Frühere Stücke können auf der Bratsche neu entdeckt werden, sofern eine passende Fassung vorhanden ist.',
					'Wer nach längerer Pause zurückkehrt, beginnt nicht bei null. Wir suchen die Fähigkeiten, die noch zuverlässig abrufbar sind.',
				],
			},
			{
				eyebrow: 'Alltag und Repertoire',
				title: 'Musik, die den Aufwand wert ist.',
				lede: 'Ein voller Erwachsenenalltag braucht einen Unterricht, dessen Aufgaben überschaubar und musikalisch sinnvoll bleiben.',
				paragraphs: [
					'Ensembleliteratur, Solostücke oder persönliche Wünsche können den roten Faden bilden.',
					'Der Übeplan unterscheidet zwischen kurzer Erhaltung, gezielter Problemlösung und längerer musikalischer Arbeit.',
					'Für die Anfrage helfen Vorerfahrung, Instrument, Wunschrepertoire, Ensemblepläne und ein realistischer Terminrhythmus.',
				],
			},
		],
		faq: [
			['Kann ich als Erwachsene:r direkt Bratsche lernen?', 'Ja. Ein vorheriger Geigenweg ist nicht erforderlich. Instrumentengröße und Lernplan werden passend zum Einstieg gewählt.'],
			['Was ist beim Wechsel von der Geige anders?', 'Größe, Ansprache, Griffabstände und Altschlüssel werden neu eingeordnet. Viele musikalische und technische Grundlagen bleiben hilfreich.'],
			['Kann ich nach langer Pause wieder einsteigen?', 'Ja. Wir prüfen, was noch vorhanden ist, und bauen von dort aus einen neuen Lernrhythmus auf.'],
			['Ist die Bratsche körperlich anstrengender?', 'Das Spielgefühl ist anders. Eine passende Instrumentengröße, gute Balance und freie Bewegungen sind deshalb besonders wichtig.'],
			['Kann ich Ensembleliteratur vorbereiten?', 'Ja. Stimmen aus Ensemble oder Orchester können Teil des Unterrichts sein und verbinden Technik mit der realen musikalischen Funktion.'],
		],
		contactTitle: 'Bratschenunterricht für Erwachsene anfragen',
		contactLead: 'Schreib mir, ob du neu beginnst, von der Geige wechselst oder wieder einsteigst und welche Musik du mit der Bratsche spielen möchtest.',
		focus: [
			['Motiv', 'Klang', 'Den eigenen Grund ernst nehmen', 'Der warme Bratschenklang oder der Wunsch nach Zusammenspiel kann den Lernweg tragen.'],
			['Balance', 'Körper', 'Größe ohne Festhalten ausgleichen', 'Instrument und Bewegung werden so abgestimmt, dass Hände und Schultern frei bleiben.'],
			['Transfer', 'Geige', 'Erfahrung sinnvoll übersetzen', 'Vorhandene Fähigkeiten werden genutzt, ohne Unterschiede der Bratsche zu übergehen.'],
			['Alltag', 'Rhythmus', 'Machbare Aufgaben vereinbaren', 'Üben bekommt eine Form, die neben Arbeit und Familie bestehen kann.'],
		],
	},
	'bratschenunterricht-kinder': {
		intentCluster: 'unterricht:bratschenunterricht-kinder',
		heroTitle: 'Bratschenunterricht für Kinder: passt der tiefe Klang zum Kind?',
		heroLead: 'Eine Probestunde klärt Neugier, Instrumentengröße und Spielgefühl. Der Unterricht verbindet kindgerechte Schritte mit dem eigenständigen Charakter der Bratsche.',
		seal: 'Kinder\nBratsche entdecken\npassend begleitet',
		sections: [
			{
				eyebrow: 'Interesse',
				title: 'Die Bratsche darf eine bewusste Wahl sein.',
				lede: 'Nicht jedes Kind muss automatisch mit der Geige beginnen. Manche reagieren gerade auf den dunkleren, tieferen Klang der Bratsche.',
				paragraphs: [
					'In der Probestunde hören und vergleichen wir, ohne eine Entscheidung zu erzwingen.',
					'Entscheidend sind echtes Interesse, Aufmerksamkeit und die Bereitschaft, eine Bewegung mehrmals auszuprobieren.',
					'Wenn das Instrument noch nicht passt, kann ein späterer Einstieg sinnvoller sein. Die Probestunde ist Orientierung.',
				],
			},
			{
				eyebrow: 'Größe',
				title: 'Das Instrument muss sicher handhabbar bleiben.',
				lede: 'Bei Kindern ist die Auswahl einer passenden Bratsche besonders wichtig, weil Gewicht, Länge und Bogen die Bewegungsfreiheit beeinflussen.',
				paragraphs: [
					'Vor Kauf oder Miete sollte die Größe geprüft werden. Ein Kind soll das Instrument nicht durch ständiges Festhalten sichern müssen.',
					'Haltung wird über kurze Bewegungsaufgaben aufgebaut. Klang, Rhythmus und Pausen wechseln einander ab.',
					'Die tiefen Saiten reagieren gut, wenn der Bogen ruhig Kontakt findet. Kraft ist keine Ersatzlösung für ein ungeeignetes Instrument.',
				],
			},
			{
				eyebrow: 'Lernen',
				title: 'Altschlüssel in kleinen musikalischen Schritten.',
				lede: 'Notation wird nicht als trockene Besonderheit der Bratsche vorgestellt, sondern direkt gespielt und gehört.',
				paragraphs: [
					'Einzelne Töne, Muster und kleine Melodien schaffen wiedererkennbare Griffbilder.',
					'Rhythmus kann zuerst gesprochen oder bewegt werden. Dadurch bleibt Aufmerksamkeit für Instrument und Bogen.',
					'Das Kind erhält Aufgaben, die es selbst erklären kann. Was nur Erwachsene verstanden haben, ist zu Hause schwer wiederholbar.',
				],
			},
			{
				eyebrow: 'Begleitung',
				title: 'Eltern schaffen den Rahmen, das Kind macht Musik.',
				lede: 'Bei jüngeren Kindern helfen Eltern beim sicheren Umgang mit dem Instrument und bei einer ruhigen Übezeit.',
				paragraphs: [
					'Nach der Stunde sind Reihenfolge und Ziel der Aufgabe klar. Dauer und Umfang richten sich nach Aufmerksamkeit und Alltag.',
					'Wenn Motivation oder Körpergefühl kippen, wird nicht einfach mehr Druck aufgebaut. Die Beobachtung gehört in den Unterricht.',
					'Für die Anfrage helfen Alter, musikalische Erfahrung, vorhandenes Instrument und die Frage, warum sich das Kind für die Bratsche interessiert.',
				],
			},
		],
		faq: [
			['Können Kinder direkt mit der Bratsche beginnen?', 'Ja, wenn Interesse, Instrumentengröße und körperliche Handhabung passen. Ein vorheriger Geigenunterricht ist nicht zwingend.'],
			['Wie wird die richtige Größe gefunden?', 'Instrument und Bogen sollten fachlich angepasst werden. Entscheidend sind nicht nur Alter oder Körpergröße, sondern das tatsächliche Spielgefühl.'],
			['Ist der Altschlüssel für Kinder zu schwierig?', 'Er kann von Anfang an in kleinen Griff- und Klangmustern gelernt werden. Die Notation wird direkt mit dem Instrument verbunden.'],
			['Welche Rolle haben Eltern?', 'Sie unterstützen bei Instrumentenpflege, Überoutine und Erinnerung. Das musikalische Ausprobieren und die wachsende Verantwortung bleiben beim Kind.'],
			['Was, wenn mein Kind doch lieber Geige spielen möchte?', 'Dann ist ein ehrlicher Vergleich sinnvoll. Die Probestunde soll eine passende Instrumentenwahl ermöglichen und keine einmal getroffene Entscheidung verteidigen.'],
		],
		contactTitle: 'Bratschenunterricht für ein Kind anfragen',
		contactLead: 'Nenne mir Alter, bisherige Musikerfahrung, vorhandenes Instrument und was das Kind am Bratschenklang interessiert. Dann bereiten wir die Probestunde vor.',
		focus: [
			['Hören', 'Instrumentenwahl', 'Den tieferen Klang vergleichen', 'Das Kind darf herausfinden, ob die Bratsche musikalisch wirklich anspricht.'],
			['Tragen', 'Größe', 'Ein handhabbares Instrument finden', 'Gute Balance verhindert, dass neue Bewegungen durch unnötiges Gewicht blockiert werden.'],
			['Lesen', 'Altschlüssel', 'Zeichen sofort spielen', 'Kurze Muster verbinden Notation, Griff und gehörten Ton.'],
			['Begleiten', 'Eltern', 'Einen ruhigen Rahmen schaffen', 'Eltern helfen bei Organisation und Sicherheit, ohne jede musikalische Entscheidung zu übernehmen.'],
		],
	},
	'musikunterricht-bratsche': {
		intentCluster: 'unterricht:musikverstaendnis-bratsche',
		heroTitle: 'Musikunterricht mit der Bratsche: Mittelstimmen verstehen und gestalten.',
		heroLead: 'Bratschentechnik, Altschlüssel, Harmonie, Rhythmus und Zusammenspiel werden gemeinsam betrachtet – für alle, die nicht nur ihre Stimme bewältigen, sondern ihre musikalische Funktion hören möchten.',
		seal: 'Bratsche\nHarmonie hören\nZusammenspiel verstehen',
		sections: [
			{
				eyebrow: 'Die Rolle der Bratsche',
				title: 'Eine Mittelstimme ist kein musikalischer Rest.',
				lede: 'Die Bratsche verbindet oft Rhythmus, Harmonie und melodische Übergänge. Ihre Wirkung wird besonders deutlich, wenn man die Stimmen um sie herum hört.',
				paragraphs: [
					'Im Unterricht betrachten wir, welche Töne eine Harmonie tragen, wann eine Figur antreibt und wo die Bratsche eine Melodie übernimmt.',
					'Ein scheinbar einfacher Begleitrhythmus braucht Sicherheit und Aufmerksamkeit für andere Stimmen.',
					'Diese musikalische Funktion beeinflusst Klang, Artikulation und Gewicht stärker als eine pauschale Anweisung wie „mehr spielen“.',
				],
			},
			{
				eyebrow: 'Partitur und Altschlüssel',
				title: 'Die eigene Stimme im Ganzen lesen.',
				lede: 'Altschlüssel, Rhythmus und Form werden mit dem musikalischen Umfeld verbunden.',
				paragraphs: [
					'Wir markieren Einsätze, Wiederholungen, harmonische Wendepunkte und Stellen, an denen eine andere Stimme Orientierung gibt.',
					'Kurze Partiturausschnitte können helfen zu verstehen, warum ein Einsatz oder eine Artikulation genau so notiert ist.',
					'Lesesicherheit entsteht nicht nur durch Tempo, sondern durch wiedererkennbare Muster und eine Vorstellung vom nächsten Klang.',
				],
			},
			{
				eyebrow: 'Ensemble hören',
				title: 'Zählen, atmen und reagieren.',
				lede: 'Zusammenspiel verlangt mehr als die eigene Stimme fehlerfrei abzuspielen.',
				paragraphs: [
					'Wir üben, Puls auch in Pausen zu behalten, Einsätze vorzubereiten und auf klangliche Veränderungen zu reagieren.',
					'Aufnahmen oder andere Stimmen können als Bezug dienen. Ziel ist, die eigene Aufgabe nicht isoliert wahrzunehmen.',
					'Technische Stellen werden danach sortiert, ob sie Rhythmus, Intonation, Bogenkoordination oder Lesesicherheit verlangen.',
				],
			},
			{
				eyebrow: 'Eigene Interpretation',
				title: 'Musikalische Entscheidungen begründen können.',
				lede: 'Auch eine innere Stimme hat Richtung, Spannung und Charakter.',
				paragraphs: [
					'Wir vergleichen verschiedene Klanglösungen und hören, welche davon die musikalische Funktion unterstützt.',
					'Theorie bleibt nah am Repertoire: Akkorde, Form oder Stimmführung werden dort erklärt, wo sie eine echte Spielentscheidung erleichtern.',
					'In der Anfrage helfen Lernstand, Notenkenntnisse, Ensemble oder Repertoire und die Stellen, deren musikalische Aufgabe unklar ist.',
				],
			},
		],
		faq: [
			['Ist das normaler Bratschenunterricht?', 'Technik bleibt Bestandteil, der Schwerpunkt liegt jedoch stärker auf Notation, Harmonie, Rhythmus und der musikalischen Funktion im Zusammenspiel.'],
			['Kann ich eine Orchester- oder Ensemblestimme mitbringen?', 'Ja. Konkrete Stimmen sind eine gute Grundlage, um Lesesicherheit, Einsätze, Klangfunktion und technische Fragen gemeinsam zu bearbeiten.'],
			['Muss ich Harmonielehre können?', 'Nein. Harmonische Zusammenhänge werden direkt an hörbaren Stellen im Repertoire erklärt.'],
			['Wird mit Partitur gearbeitet?', 'Wenn es für eine Stelle hilfreich ist, können Ausschnitte anderer Stimmen oder einer Partitur einbezogen werden.'],
			['Für wen passt diese Ausrichtung?', 'Für Bratschist:innen, die ihre Stimme im musikalischen Ganzen besser verstehen und selbstständiger gestalten möchten.'],
		],
		contactTitle: 'Musikunterricht mit der Bratsche anfragen',
		contactLead: 'Beschreibe deinen Lernstand, dein Ensemble oder aktuelles Repertoire und welche Stelle du technisch oder musikalisch besser verstehen möchtest.',
		focus: [
			['Fundament', 'Harmonie', 'Tragende Töne hören', 'Die Bratsche verbindet Stimmen und prägt harmonische Bewegungen.'],
			['Zeit', 'Rhythmus', 'Puls auch in Pausen halten', 'Sichere Einsätze entstehen aus innerem Puls und dem Hören auf andere.'],
			['Übersicht', 'Partitur', 'Die eigene Stimme einordnen', 'Andere Stimmen erklären oft, warum Artikulation oder Dynamik so gesetzt sind.'],
			['Aussage', 'Interpretation', 'Eine Mittelstimme gestalten', 'Klang und Gewicht folgen einer musikalischen Aufgabe statt einer pauschalen Lautstärke.'],
		],
	},
};

function faqItems(entries) {
	return entries.map(([question, answer], index) => ({
		question,
		answer,
		...(index === 0 ? { open: true } : {}),
	}));
}

function focusItems(entries) {
	return entries.map(([time, kicker, title, text]) => ({ time, kicker, title, text }));
}

function updateDocument(slug, rewrite) {
	const file = path.join(CONTENT_DIR, `${slug}.json`);
	if (!existsSync(file)) throw new Error(`Missing teaching topic document: ${file}`);
	const document = JSON.parse(readFileSync(file, 'utf8'));
	const currentSections = document.split?.sections ?? [];

	document.intentCluster = rewrite.intentCluster;
	document.status = STATUS;
	document.hero = {
		...document.hero,
		title: rewrite.heroTitle,
		lead: rewrite.heroLead,
	};
	document.split = {
		...document.split,
		seal: rewrite.seal,
		sections: rewrite.sections.map((section, index) => ({
			...section,
			image: currentSections[index]?.image ?? currentSections[index % currentSections.length]?.image,
			imageFirst: index % 2 === 1,
		})),
	};
	document.faq = {
		...document.faq,
		title: `Fragen zu ${document.targetKeyword}`,
		items: faqItems(rewrite.faq),
	};
	document.contact = {
		...document.contact,
		title: rewrite.contactTitle,
		lead: rewrite.contactLead,
		checklist: [document.targetKeyword, 'Lernstand', 'Instrument', 'Probestunde'],
	};
	document.focus = {
		...document.focus,
		title: `Worum es bei ${document.targetKeyword} konkret geht.`,
		lead: 'Vier Punkte, an denen sich diese Unterrichtsaufgabe von den benachbarten Einstiegen unterscheidet.',
		items: focusItems(rewrite.focus),
		footnote: 'Die genaue Gewichtung entsteht aus Lernstand, Instrument, Ziel und dem Alltag zwischen zwei Terminen.',
	};
	document.editorNotes = `${document.editorNotes ?? ''}\n\nManuell redaktionell differenziert am 29.07.2026: eigenständige Nutzeraufgabe, natürlicher Einstieg, konkrete Lernentscheidungen und passende FAQ; URL bleibt bis zu Query- und Conversiondaten als Messseite bestehen.`.trim();

	writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

for (const [slug, rewrite] of Object.entries(rewrites)) updateDocument(slug, rewrite);

console.log(`Finalized ${Object.keys(rewrites).length} teaching topic pages with status ${STATUS}.`);
