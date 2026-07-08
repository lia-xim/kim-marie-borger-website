export type InquiryAttribution = {
	firstPath: string;
	firstPageType: string;
	firstPageService: string;
	firstPageSlug: string;
	firstReferrer: string;
	firstUtmSource: string;
	firstUtmMedium: string;
	firstUtmCampaign: string;
	firstUtmContent: string;
	firstUtmTerm: string;
	firstHasGclid: boolean;
	firstHasFbclid: boolean;
	firstHasMsclkid: boolean;
	lastPath: string;
	lastPageType: string;
	lastPageService: string;
	lastPageSlug: string;
	lastReferrer: string;
	lastUtmSource: string;
	lastUtmMedium: string;
	lastUtmCampaign: string;
	lastUtmContent: string;
	lastUtmTerm: string;
	lastHasGclid: boolean;
	lastHasFbclid: boolean;
	lastHasMsclkid: boolean;
	firstSeenAt: string;
	lastSeenAt: string;
	lastCtaText: string;
	lastCtaArea: string;
	lastCtaTarget: string;
	lastCtaKind: string;
	lastInteractionAt: string;
	audioEngaged: boolean;
	audioLastTrack: string;
	audioLastIndex: string;
};

export type Inquiry = {
	name: string;
	email: string;
	occasion: string;
	date: string;
	place: string;
	requestedMusic: string;
	scope: string;
	sourcePage: string;
	sourceContext: string;
	formVariant: string;
	message: string;
	attribution?: InquiryAttribution;
};

type ResendEmailPayload = {
	from: string;
	to: string[];
	reply_to?: string;
	subject: string;
	text: string;
	html?: string;
};

type DeliveryChannel = {
	attempts: number;
	lastAttemptAt?: string;
	sentAt?: string;
	resendId?: string;
	lastError?: string;
	skippedAt?: string;
	skipReason?: string;
};

export type ContactOutboxRecord = {
	id: string;
	createdAt: string;
	updatedAt: string;
	status: 'pending' | 'sent' | 'failed';
	attempts: number;
	inquiry: Inquiry;
	delivery: {
		internal: DeliveryChannel;
		confirmation: DeliveryChannel;
		alert: DeliveryChannel;
	};
	lastError?: string;
};

export type ContactDeliveryConfig = {
	apiKey: string;
	to: string;
	from: string;
	configuredFrom: string;
	replyTo: string;
	alertTo: string;
	alertAfterAttempts: number;
};

export type ContactOutboxConfig = {
	restUrl: string;
	restToken: string;
	prefix: string;
	retentionSeconds: number;
	batchSize: number;
};

export type ContactAnalyticsConfig = {
	hostUrl: string;
	websiteId: string;
	hostname: string;
	userAgent: string;
};

export type ContactAnalyticsDeliveryStatus = 'sent' | 'queued' | 'confirmation_failed';

export type DeliveryResult = {
	ok: boolean;
	record: ContactOutboxRecord;
	errors: string[];
};

type RedisCommand = Array<string | number>;

const BRAND_NAME = 'Kim Marie Borger';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FALLBACK_FROM_EMAIL = 'Website <onboarding@resend.dev>';
const DEFAULT_ALERT_EMAIL = 'matthiasramahi@web.de';
const DEFAULT_ALERT_AFTER_ATTEMPTS = 2;
const DEFAULT_UMAMI_HOST_URL = 'https://analytics.contextter.com';
const DEFAULT_UMAMI_HOSTNAME = 'www.kim-marie-borger.de';

export function getRuntimeEnv(metaEnv: Record<string, unknown>): Record<string, unknown> {
	return {
		...metaEnv,
		...(typeof process !== 'undefined' ? process.env : {}),
	};
}

export function readInquiry(body: Record<string, unknown>): Inquiry {
	return {
		name: str(body.name, 200),
		email: str(body.email, 200),
		occasion: str(body.anlass, 200),
		date: str(body.datum, 200),
		place: str(body.ort, 300),
		requestedMusic: str(body.wunschmusik, 500),
		scope: str(body.umfang, 300),
		sourcePage: str(body.seite, 500),
		sourceContext: str(body.seitenkontext, 300),
		formVariant: str(body.formularvariante, 300),
		message: str(body.nachricht, 5000),
		attribution: readAttribution(body),
	};
}

export function validateInquiry(inquiry: Inquiry): boolean {
	return Boolean(inquiry.name && inquiry.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email));
}

export function getContactDeliveryConfig(env: Record<string, unknown>): ContactDeliveryConfig | null {
	const apiKey = str(env.RESEND_API_KEY, 1000);
	const to = str(env.CONTACT_TO_EMAIL, 300);
	if (!apiKey || !to) return null;

	const configuredFrom = senderAddress(str(env.CONTACT_FROM_EMAIL, 300));
	return {
		apiKey,
		to,
		from: configuredFrom || FALLBACK_FROM_EMAIL,
		configuredFrom,
		replyTo: str(env.CONTACT_REPLY_EMAIL, 300) || to,
		alertTo: str(env.CONTACT_ALERT_EMAIL, 300) || DEFAULT_ALERT_EMAIL,
		alertAfterAttempts: positiveInt(env.CONTACT_ALERT_AFTER_ATTEMPTS, DEFAULT_ALERT_AFTER_ATTEMPTS),
	};
}

export function getContactOutboxConfig(env: Record<string, unknown>): ContactOutboxConfig | null {
	const restUrl = str(env.CONTACT_OUTBOX_REST_URL, 1000) || str(env.KV_REST_API_URL, 1000);
	const restToken = str(env.CONTACT_OUTBOX_REST_TOKEN, 1000) || str(env.KV_REST_API_TOKEN, 1000);
	if (!restUrl || !restToken) return null;

	return {
		restUrl: restUrl.replace(/\/+$/, ''),
		restToken,
		prefix: str(env.CONTACT_OUTBOX_PREFIX, 120) || 'kmb:contact',
		retentionSeconds: positiveInt(env.CONTACT_OUTBOX_RETENTION_DAYS, 90) * 24 * 60 * 60,
		batchSize: positiveInt(env.CONTACT_OUTBOX_BATCH_SIZE, 10),
	};
}

export function getContactAnalyticsConfig(env: Record<string, unknown>): ContactAnalyticsConfig | null {
	const websiteId = str(env.UMAMI_WEBSITE_ID, 120) || str(env.PUBLIC_UMAMI_WEBSITE_ID, 120);
	if (!websiteId) return null;

	return {
		hostUrl: (str(env.UMAMI_HOST_URL, 1000) || DEFAULT_UMAMI_HOST_URL).replace(/\/+$/, ''),
		websiteId,
		hostname: str(env.UMAMI_HOSTNAME, 300) || DEFAULT_UMAMI_HOSTNAME,
		userAgent: str(env.UMAMI_SERVER_USER_AGENT, 300) || 'KimMarieBorgerWebsite/1.0',
	};
}

export function createOutboxRecord(inquiry: Inquiry): ContactOutboxRecord {
	const now = new Date().toISOString();
	return {
		id: crypto.randomUUID(),
		createdAt: now,
		updatedAt: now,
		status: 'pending',
		attempts: 0,
		inquiry,
		delivery: {
			internal: { attempts: 0 },
			confirmation: { attempts: 0 },
			alert: { attempts: 0 },
		},
	};
}

export function markOutboxError(record: ContactOutboxRecord, error: string): ContactOutboxRecord {
	return {
		...record,
		status: 'failed',
		updatedAt: new Date().toISOString(),
		lastError: error,
	};
}

export async function deliverContactRecord(
	record: ContactOutboxRecord,
	config: ContactDeliveryConfig,
): Promise<DeliveryResult> {
	const next = cloneRecord(record);
	ensureDeliveryState(next);
	const now = new Date().toISOString();
	const errors: string[] = [];
	next.attempts += 1;
	next.updatedAt = now;

	if (!next.delivery.internal.sentAt) {
		const internal = next.delivery.internal;
		internal.attempts += 1;
		internal.lastAttemptAt = now;
		const result = await sendResendEmail(
			config.apiKey,
			createInternalEmail(next.inquiry, { from: config.from, to: config.to }),
			`${next.id}:internal`,
		);

		if (result.ok) {
			internal.sentAt = now;
			internal.resendId = result.id;
			delete internal.lastError;
		} else {
			internal.lastError = result.error;
			errors.push(`internal: ${result.error}`);
			next.status = 'failed';
			next.lastError = errors.join('; ');
			await sendFailureAlertIfNeeded(next, config, errors);
			return { ok: false, record: next, errors };
		}
	}

	if (config.configuredFrom) {
		if (!next.delivery.confirmation.sentAt) {
			const confirmation = next.delivery.confirmation;
			confirmation.attempts += 1;
			confirmation.lastAttemptAt = now;
			const result = await sendResendEmail(
				config.apiKey,
				createConfirmationEmail(next.inquiry, {
					from: config.configuredFrom,
					replyTo: config.replyTo,
				}),
				`${next.id}:confirmation`,
			);

			if (result.ok) {
				confirmation.sentAt = now;
				confirmation.resendId = result.id;
				delete confirmation.lastError;
			} else {
				confirmation.lastError = result.error;
				errors.push(`confirmation: ${result.error}`);
			}
		}
	} else if (!next.delivery.confirmation.skippedAt) {
		next.delivery.confirmation.skippedAt = now;
		next.delivery.confirmation.skipReason = 'CONTACT_FROM_EMAIL not configured';
	}

	if (errors.length) {
		next.status = 'failed';
		next.lastError = errors.join('; ');
		await sendFailureAlertIfNeeded(next, config, errors);
		return { ok: false, record: next, errors };
	}

	next.status = 'sent';
	delete next.lastError;
	return { ok: true, record: next, errors };
}

export async function saveOutboxRecord(config: ContactOutboxConfig, record: ContactOutboxRecord): Promise<void> {
	const key = outboxEntryKey(config, record.id);
	const commands: RedisCommand[] = [
		['SET', key, JSON.stringify(record), 'EX', config.retentionSeconds],
	];

	if (record.status === 'sent') {
		commands.push(['ZREM', outboxIndexKey(config), record.id]);
	} else {
		commands.push(['ZADD', outboxIndexKey(config), Date.parse(record.updatedAt), record.id]);
	}

	await redisPipeline(config, commands);
}

export async function retryOutboxRecords(
	outboxConfig: ContactOutboxConfig,
	deliveryConfig: ContactDeliveryConfig,
): Promise<{ processed: number; sent: number; failed: number; results: Array<{ id: string; status: string; errors: string[] }> }> {
	const records = await loadRetryableRecords(outboxConfig, outboxConfig.batchSize);
	const results: Array<{ id: string; status: string; errors: string[] }> = [];

	for (const record of records) {
		const result = await deliverContactRecord(record, deliveryConfig);
		await saveOutboxRecord(outboxConfig, result.record);
		results.push({
			id: result.record.id,
			status: result.record.status,
			errors: result.errors,
		});
	}

	return {
		processed: results.length,
		sent: results.filter((result) => result.status === 'sent').length,
		failed: results.filter((result) => result.status !== 'sent').length,
		results,
	};
}

async function sendFailureAlertIfNeeded(
	record: ContactOutboxRecord,
	config: ContactDeliveryConfig,
	errors: string[],
): Promise<void> {
	if (record.attempts < config.alertAfterAttempts) return;

	ensureDeliveryState(record);
	const alert = record.delivery.alert;
	if (alert.sentAt) return;

	const now = new Date().toISOString();
	alert.attempts += 1;
	alert.lastAttemptAt = now;

	const result = await sendResendEmail(
		config.apiKey,
		createFailureAlertEmail(record, errors, {
			from: config.from,
			to: config.alertTo,
			replyTo: config.replyTo,
		}),
		`${record.id}:alert`,
	);

	record.updatedAt = new Date().toISOString();
	if (result.ok) {
		alert.sentAt = now;
		alert.resendId = result.id;
		delete alert.lastError;
		return;
	}

	alert.lastError = result.error;
	errors.push(`alert: ${result.error}`);
	record.lastError = errors.join('; ');
}

export async function trackContactServerEvent(
	config: ContactAnalyticsConfig,
	record: ContactOutboxRecord,
	deliveryStatus: ContactAnalyticsDeliveryStatus,
): Promise<void> {
	const response = await fetch(`${config.hostUrl}/api/send`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': config.userAgent,
		},
		body: JSON.stringify({
			type: 'event',
			payload: {
				hostname: config.hostname,
				language: 'de-DE',
				referrer: record.inquiry.attribution?.lastReferrer || record.inquiry.attribution?.firstReferrer || '',
				url: analyticsUrl(record.inquiry.sourcePage),
				title: 'Kontaktformular',
				website: config.websiteId,
				name: 'contact_form_server_success',
				data: contactAnalyticsData(record, deliveryStatus),
			},
		}),
	});
	const text = await response.text();
	if (!response.ok) throw new Error(`Umami ${response.status}: ${text.slice(0, 500)}`);
}

function readAttribution(body: Record<string, unknown>): InquiryAttribution {
	return {
		firstPath: str(body.attribution_first_path, 500),
		firstPageType: str(body.attribution_first_page_type, 120),
		firstPageService: str(body.attribution_first_page_service, 120),
		firstPageSlug: str(body.attribution_first_page_slug, 300),
		firstReferrer: str(body.attribution_first_referrer, 500),
		firstUtmSource: str(body.attribution_first_utm_source, 180),
		firstUtmMedium: str(body.attribution_first_utm_medium, 180),
		firstUtmCampaign: str(body.attribution_first_utm_campaign, 220),
		firstUtmContent: str(body.attribution_first_utm_content, 220),
		firstUtmTerm: str(body.attribution_first_utm_term, 220),
		firstHasGclid: bool(body.attribution_first_has_gclid),
		firstHasFbclid: bool(body.attribution_first_has_fbclid),
		firstHasMsclkid: bool(body.attribution_first_has_msclkid),
		lastPath: str(body.attribution_last_path, 500),
		lastPageType: str(body.attribution_last_page_type, 120),
		lastPageService: str(body.attribution_last_page_service, 120),
		lastPageSlug: str(body.attribution_last_page_slug, 300),
		lastReferrer: str(body.attribution_last_referrer, 500),
		lastUtmSource: str(body.attribution_last_utm_source, 180),
		lastUtmMedium: str(body.attribution_last_utm_medium, 180),
		lastUtmCampaign: str(body.attribution_last_utm_campaign, 220),
		lastUtmContent: str(body.attribution_last_utm_content, 220),
		lastUtmTerm: str(body.attribution_last_utm_term, 220),
		lastHasGclid: bool(body.attribution_last_has_gclid),
		lastHasFbclid: bool(body.attribution_last_has_fbclid),
		lastHasMsclkid: bool(body.attribution_last_has_msclkid),
		firstSeenAt: str(body.attribution_first_seen_at, 80),
		lastSeenAt: str(body.attribution_last_seen_at, 80),
		lastCtaText: str(body.attribution_last_cta_text, 220),
		lastCtaArea: str(body.attribution_last_cta_area, 140),
		lastCtaTarget: str(body.attribution_last_cta_target, 300),
		lastCtaKind: str(body.attribution_last_cta_kind, 120),
		lastInteractionAt: str(body.attribution_last_interaction_at, 80),
		audioEngaged: bool(body.attribution_audio_engaged),
		audioLastTrack: str(body.attribution_audio_last_track, 220),
		audioLastIndex: str(body.attribution_audio_last_index, 40),
	};
}

function contactAnalyticsData(
	record: ContactOutboxRecord,
	deliveryStatus: ContactAnalyticsDeliveryStatus,
): Record<string, string | number | boolean> {
	const inquiry = record.inquiry;
	return cleanAnalyticsData({
		delivery_status: deliveryStatus,
		outbox_status: record.status,
		delivery_attempts: record.attempts,
		internal_sent: Boolean(record.delivery.internal.sentAt),
		confirmation_sent: Boolean(record.delivery.confirmation.sentAt),
		confirmation_skipped: Boolean(record.delivery.confirmation.skippedAt),
		source_page: inquiry.sourcePage,
		source_context: inquiry.sourceContext,
		form_variant: inquiry.formVariant,
		selected_occasion: inquiry.occasion,
		occasion_selected: Boolean(inquiry.occasion),
		has_date: Boolean(inquiry.date),
		has_place: Boolean(inquiry.place),
		has_music: Boolean(inquiry.requestedMusic),
		has_scope: Boolean(inquiry.scope),
		message_bucket: messageBucket(inquiry.message),
		optional_fields_count: optionalFieldsCount(inquiry),
		...attributionAnalyticsData(inquiry.attribution),
	});
}

function attributionAnalyticsData(attribution?: InquiryAttribution): Record<string, string | number | boolean> {
	if (!attribution) return {};
	return cleanAnalyticsData({
		attribution_first_path: attribution.firstPath,
		attribution_first_page_type: attribution.firstPageType,
		attribution_first_page_service: attribution.firstPageService,
		attribution_first_page_slug: attribution.firstPageSlug,
		attribution_first_referrer: attribution.firstReferrer,
		attribution_first_utm_source: attribution.firstUtmSource,
		attribution_first_utm_medium: attribution.firstUtmMedium,
		attribution_first_utm_campaign: attribution.firstUtmCampaign,
		attribution_first_utm_content: attribution.firstUtmContent,
		attribution_first_utm_term: attribution.firstUtmTerm,
		attribution_first_has_gclid: attribution.firstHasGclid,
		attribution_first_has_fbclid: attribution.firstHasFbclid,
		attribution_first_has_msclkid: attribution.firstHasMsclkid,
		attribution_last_path: attribution.lastPath,
		attribution_last_page_type: attribution.lastPageType,
		attribution_last_page_service: attribution.lastPageService,
		attribution_last_page_slug: attribution.lastPageSlug,
		attribution_last_referrer: attribution.lastReferrer,
		attribution_last_utm_source: attribution.lastUtmSource,
		attribution_last_utm_medium: attribution.lastUtmMedium,
		attribution_last_utm_campaign: attribution.lastUtmCampaign,
		attribution_last_utm_content: attribution.lastUtmContent,
		attribution_last_utm_term: attribution.lastUtmTerm,
		attribution_last_has_gclid: attribution.lastHasGclid,
		attribution_last_has_fbclid: attribution.lastHasFbclid,
		attribution_last_has_msclkid: attribution.lastHasMsclkid,
		attribution_first_seen_at: attribution.firstSeenAt,
		attribution_last_seen_at: attribution.lastSeenAt,
		attribution_last_cta_text: attribution.lastCtaText,
		attribution_last_cta_area: attribution.lastCtaArea,
		attribution_last_cta_target: attribution.lastCtaTarget,
		attribution_last_cta_kind: attribution.lastCtaKind,
		attribution_last_interaction_at: attribution.lastInteractionAt,
		attribution_audio_engaged: attribution.audioEngaged,
		attribution_audio_last_track: attribution.audioLastTrack,
		attribution_audio_last_index: attribution.audioLastIndex,
	});
}

function analyticsUrl(sourcePage: string): string {
	if (!sourcePage) return '/anfragen/';
	try {
		const url = new URL(sourcePage, 'https://www.kim-marie-borger.de');
		return url.pathname.replace(/\/$/, '') || '/';
	} catch {
		return sourcePage.startsWith('/') ? sourcePage.split(/[?#]/)[0] || '/' : '/anfragen/';
	}
}

function optionalFieldsCount(inquiry: Inquiry): number {
	return [
		inquiry.occasion,
		inquiry.date,
		inquiry.place,
		inquiry.requestedMusic,
		inquiry.scope,
		inquiry.message,
	].filter(Boolean).length;
}

function messageBucket(message: string): string {
	const length = message.trim().length;
	if (!length) return 'empty';
	if (length <= 80) return 'short';
	if (length <= 240) return 'medium';
	return 'long';
}

function cleanAnalyticsData(
	data: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	const cleanData: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined) continue;
		if (typeof value === 'boolean' || typeof value === 'number') {
			cleanData[key] = value;
			continue;
		}
		const text = value.replace(/\s+/g, ' ').trim();
		if (text) cleanData[key] = text.slice(0, 220);
	}
	return cleanData;
}

async function loadRetryableRecords(config: ContactOutboxConfig, limit: number): Promise<ContactOutboxRecord[]> {
	const ids = await redisCommand(config, ['ZRANGE', outboxIndexKey(config), 0, Math.max(0, limit - 1)]);
	if (!Array.isArray(ids)) return [];

	const records: ContactOutboxRecord[] = [];
	for (const id of ids) {
		if (typeof id !== 'string') continue;
		const raw = await redisCommand(config, ['GET', outboxEntryKey(config, id)]);
		if (typeof raw !== 'string') {
			await redisCommand(config, ['ZREM', outboxIndexKey(config), id]);
			continue;
		}

		try {
			const record = JSON.parse(raw) as ContactOutboxRecord;
			if (record.status !== 'sent') records.push(record);
		} catch {
			await redisCommand(config, ['ZREM', outboxIndexKey(config), id]);
		}
	}

	return records;
}

function createFailureAlertEmail(
	record: ContactOutboxRecord,
	errors: string[],
	options: { from: string; to: string; replyTo: string },
): ResendEmailPayload {
	const inquiry = record.inquiry;
	const shortId = record.id.slice(0, 8);
	const subject = `Kontaktformular-Alarm: Anfrage ${shortId} nach ${record.attempts} Versuchen fehlgeschlagen`;

	return {
		from: options.from,
		to: [options.to],
		reply_to: options.replyTo,
		subject,
		text: [
			subject,
			'',
			`Outbox-ID: ${record.id}`,
			`Status: ${record.status}`,
			`Erstellt: ${record.createdAt}`,
			`Aktualisiert: ${record.updatedAt}`,
			`Versuche: ${record.attempts}`,
			`Interne E-Mail gesendet: ${record.delivery.internal.sentAt || 'nein'}`,
			`Bestätigung gesendet: ${record.delivery.confirmation.sentAt || 'nein'}`,
			'',
			'Letzte Fehler:',
			...(errors.length ? errors : [record.lastError || 'Unbekannter Fehler']),
			'',
			'Kontakt:',
			`Name: ${inquiry.name}`,
			`E-Mail: ${inquiry.email}`,
			`Anlass: ${inquiry.occasion || inquiry.formVariant || '(nicht angegeben)'}`,
			`Datum / Zeitraum: ${inquiry.date || '(nicht angegeben)'}`,
			`Ort / Location: ${inquiry.place || '(nicht angegeben)'}`,
			`Quelle: ${inquiry.sourcePage || '(nicht angegeben)'}`,
			'',
			'Nachricht:',
			inquiry.message || '(keine Nachricht)',
		].join('\n'),
		html: emailShell({
			preheader: `Kontaktformular-Anfrage ${shortId} konnte nicht vollständig zugestellt werden.`,
			kicker: 'Zustellproblem',
			title: 'Kontaktformular braucht Aufmerksamkeit',
			intro: 'Eine Anfrage konnte trotz mehrerer Zustellversuche nicht vollständig per E-Mail zugestellt werden. Sie liegt weiterhin in der Outbox und wird erneut versucht.',
			badge: `${record.attempts} Versuche`,
			body: `
				${summaryPanel([
					['Outbox-ID', record.id],
					['Status', record.status],
					['Fehler', errors.join('; ') || record.lastError || 'Unbekannter Fehler'],
				])}
				${sectionTitle('Kontakt')}
				${detailsTable(detailRows(inquiry, true))}
				${sectionTitle('Betrieb')}
				${detailsTable([
					['Erstellt', record.createdAt],
					['Aktualisiert', record.updatedAt],
					['Interne E-Mail gesendet', record.delivery.internal.sentAt || 'nein'],
					['Bestätigung gesendet', record.delivery.confirmation.sentAt || 'nein'],
					['Quelle', inquiry.sourcePage],
				])}
				${messageBlock(inquiry.message, 'Nachricht')}
				${noticeBox('Bitte Outbox, Resend und Vercel-Logs prüfen. Falls nötig, die anfragende Person manuell kontaktieren.')}
			`,
			footer: 'Automatischer Betriebsalarm der Website.',
		}),
	};
}

function createInternalEmail(inquiry: Inquiry, options: { from: string; to: string }): ResendEmailPayload {
	const label = inquiryLabel(inquiry);
	const subject = `Neue ${subjectText(label)} über die Website von ${subjectText(inquiry.name)}`;
	const replySubject = `Antwort auf deine Anfrage bei ${BRAND_NAME}`;
	const replyHref = `mailto:${escapeAttr(inquiry.email)}?subject=${encodeURIComponent(replySubject)}`;
	const rows = detailRows(inquiry, true);
	const attributionRows = emailAttributionRows(inquiry);

	return {
		from: options.from,
		to: [options.to],
		reply_to: inquiry.email,
		subject,
		text: createInternalText(inquiry),
		html: emailShell({
			preheader: `${subjectText(inquiry.name)} hat eine Anfrage über die Website gesendet.`,
			kicker: 'Neue Anfrage',
			title: label,
			intro: `${oneLine(inquiry.name)} hat das Kontaktformular ausgefüllt. Die Antwortadresse ist direkt als Reply-To gesetzt.`,
			badge: label,
			body: `
				${summaryPanel([
					['Name', inquiry.name],
					['E-Mail', inquiry.email],
					['Anlass', inquiry.occasion || inquiry.formVariant || inquiry.sourceContext],
				])}
				${sectionTitle('Anfragedetails')}
				${detailsTable(rows)}
				${messageBlock(inquiry.message, 'Nachricht')}
				${sectionTitle('Quelle')}
				${detailsTable([
					['Seite', inquiry.sourcePage],
					['Seitenkontext', inquiry.sourceContext],
					['Formularvariante', inquiry.formVariant],
				])}
				${attributionRows.length ? `${sectionTitle('Attribution')}${detailsTable(attributionRows)}` : ''}
				${buttonLink(replyHref, 'Direkt antworten')}
			`,
			footer: 'Diese E-Mail wurde automatisch über das Kontaktformular der Website erstellt.',
		}),
	};
}

function createConfirmationEmail(inquiry: Inquiry, options: { from: string; replyTo: string }): ResendEmailPayload {
	const firstName = oneLine(inquiry.name).split(/\s+/)[0] || inquiry.name;
	const replySubject = `Ergänzung zu meiner Anfrage bei ${BRAND_NAME}`;
	const replyHref = `mailto:${escapeAttr(options.replyTo)}?subject=${encodeURIComponent(replySubject)}`;

	return {
		from: options.from,
		to: [inquiry.email],
		reply_to: options.replyTo,
		subject: `Danke für deine Anfrage bei ${BRAND_NAME}`,
		text: createConfirmationText(inquiry, options.replyTo),
		html: emailShell({
			preheader: 'Deine E-Mail ist angekommen.',
			kicker: 'Anfrage erhalten',
			title: `Danke, ${firstName}`,
			intro: 'Deine E-Mail ist angekommen. Ich melde mich so bald wie möglich persönlich bei dir zurück.',
			badge: 'Anfrage angekommen',
			body: `
				${noticeBox(`Falls du noch etwas ergänzen möchtest, antworte einfach auf diese E-Mail oder schreibe direkt an ${options.replyTo}.`)}
				${buttonLink(replyHref, 'Ergänzung senden')}
			`,
			footer: `${BRAND_NAME} · Viola, Unterricht und Musik für besondere Anlässe`,
		}),
	};
}

function createInternalText(inquiry: Inquiry): string {
	const attributionRows = emailAttributionRows(inquiry);
	return [
		`Name: ${inquiry.name}`,
		`E-Mail: ${inquiry.email}`,
		`Anlass: ${inquiry.occasion || '(nicht angegeben)'}`,
		`Datum / Zeitraum: ${inquiry.date || '(nicht angegeben)'}`,
		`Ort / Location: ${inquiry.place || '(nicht angegeben)'}`,
		`Wunschmusik / Stücke: ${inquiry.requestedMusic || '(nicht angegeben)'}`,
		`Umfang / Dauer: ${inquiry.scope || '(nicht angegeben)'}`,
		'',
		'Quelle:',
		`Seite: ${inquiry.sourcePage || '(nicht angegeben)'}`,
		`Seitenkontext: ${inquiry.sourceContext || '(nicht angegeben)'}`,
		`Formularvariante: ${inquiry.formVariant || '(nicht angegeben)'}`,
		...(attributionRows.length
			? [
				'',
				'Attribution:',
				...attributionRows.map(([label, value]) => `${label}: ${value}`),
			]
			: []),
		'',
		'Nachricht:',
		inquiry.message || '(keine Nachricht)',
		'',
	].join('\n');
}

function createConfirmationText(inquiry: Inquiry, replyTo: string): string {
	return [
		`Hallo ${oneLine(inquiry.name)},`,
		'',
		'vielen Dank für deine Anfrage. Deine E-Mail ist angekommen.',
		'Ich melde mich so bald wie möglich persönlich bei dir zurück.',
		'',
		`Falls du noch etwas ergänzen möchtest, antworte einfach auf diese E-Mail oder schreibe direkt an ${replyTo}.`,
		'',
		'Herzliche Grüße',
		BRAND_NAME,
	].join('\n');
}

function emailAttributionRows(inquiry: Inquiry): Array<[string, string]> {
	const attribution = inquiry.attribution;
	if (!attribution) return [];
	const utmFirst = attributionLabel([
		attribution.firstUtmSource,
		attribution.firstUtmMedium,
		attribution.firstUtmCampaign,
	]);
	const utmLast = attributionLabel([
		attribution.lastUtmSource,
		attribution.lastUtmMedium,
		attribution.lastUtmCampaign,
	]);
	const lastCta = attributionLabel([
		attribution.lastCtaKind,
		attribution.lastCtaArea,
		attribution.lastCtaText,
		attribution.lastCtaTarget,
	]);
	const audio = attribution.audioEngaged || attribution.audioLastTrack
		? attributionLabel([
			attribution.audioEngaged ? 'Audio abgespielt' : 'Audio ausgewählt',
			attribution.audioLastTrack,
			attribution.audioLastIndex ? `Track ${attribution.audioLastIndex}` : '',
		])
		: '';

	const rows: Array<[string, string]> = [
		['Erster Einstieg', attribution.firstPath],
		['Letzte Seite vor Anfrage', attribution.lastPath],
		['Erste Quelle', attribution.firstReferrer],
		['Letzte Quelle', attribution.lastReferrer],
		['UTM erster Einstieg', utmFirst],
		['UTM letzter Einstieg', utmLast],
		['Letzte CTA', lastCta],
		['Portfolio-Audio', audio],
	];
	return rows.filter(([, value]) => Boolean(value));
}

function attributionLabel(parts: string[]): string {
	return parts.map((part) => oneLine(part)).filter(Boolean).join(' · ');
}

function detailRows(inquiry: Inquiry, includeContact: boolean): Array<[string, string]> {
	const rows: Array<[string, string]> = [
		['Anlass', inquiry.occasion || inquiry.formVariant || inquiry.sourceContext],
		['Datum / Zeitraum', inquiry.date],
		['Ort / Location', inquiry.place],
		['Wunschmusik / Stücke', inquiry.requestedMusic],
		['Umfang / Dauer', inquiry.scope],
	];

	if (includeContact) {
		return [
			['Name', inquiry.name],
			['E-Mail', inquiry.email],
			...rows,
		];
	}

	return rows;
}

function inquiryLabel(inquiry: Inquiry): string {
	return oneLine(inquiry.occasion || inquiry.formVariant || inquiry.sourceContext || 'Anfrage');
}

function emailShell(parts: {
	preheader: string;
	kicker: string;
	title: string;
	intro: string;
	badge: string;
	body: string;
	footer: string;
}): string {
	return `<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>${escapeHtml(parts.title)}</title>
	</head>
	<body style="margin:0;padding:0;background:#f7f1ec;color:#2f2320;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
		<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(parts.preheader)}</div>
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#f7f1ec;margin:0;padding:32px 16px;">
			<tr>
				<td align="center">
					<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#fffaf6;border:1px solid #e4d7ce;border-radius:18px;overflow:hidden;box-shadow:0 18px 48px rgba(88,58,48,0.12);">
						<tr>
							<td style="background:#482c2c;padding:28px 32px;color:#fffaf6;">
								<div style="font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:0.12em;color:#dfc8b6;">${escapeHtml(parts.kicker)}</div>
								<h1 style="margin:10px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:40px;font-weight:500;color:#fffaf6;">${escapeHtml(parts.title)}</h1>
								<div style="display:inline-block;margin-top:4px;padding:7px 12px;border-radius:999px;background:#fffaf6;color:#482c2c;font-size:13px;line-height:18px;font-weight:700;">${escapeHtml(parts.badge)}</div>
							</td>
						</tr>
						<tr>
							<td style="padding:30px 32px 10px;">
								<p style="margin:0 0 22px;font-size:16px;line-height:25px;color:#4a3934;">${escapeHtml(parts.intro)}</p>
								${parts.body}
							</td>
						</tr>
						<tr>
							<td style="padding:22px 32px 30px;">
								<p style="margin:0;border-top:1px solid #eadfd7;padding-top:18px;font-size:12px;line-height:18px;color:#8a7369;">${escapeHtml(parts.footer)}</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;
}

function summaryPanel(rows: Array<[string, string]>): string {
	return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin:0 0 24px;background:#f3e8df;border-radius:14px;">
		<tr>
			<td style="padding:18px 20px;">
				${rows.map(([label, value]) => `
					<div style="margin:0 0 10px;">
						<div style="font-size:11px;line-height:16px;text-transform:uppercase;letter-spacing:0.08em;color:#7d6257;">${escapeHtml(label)}</div>
						<div style="font-size:17px;line-height:24px;color:#2f2320;font-weight:700;">${escapeHtml(display(value))}</div>
					</div>
				`).join('')}
			</td>
		</tr>
	</table>`;
}

function sectionTitle(title: string): string {
	return `<h2 style="margin:24px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;font-weight:500;color:#482c2c;">${escapeHtml(title)}</h2>`;
}

function detailsTable(rows: Array<[string, string]>): string {
	return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 18px;">
		${rows.map(([label, value]) => `
			<tr>
				<td style="width:38%;padding:10px 12px 10px 0;border-bottom:1px solid #eadfd7;font-size:13px;line-height:19px;color:#7d6257;vertical-align:top;">${escapeHtml(label)}</td>
				<td style="padding:10px 0;border-bottom:1px solid #eadfd7;font-size:14px;line-height:21px;color:#2f2320;vertical-align:top;">${escapeHtml(display(value))}</td>
			</tr>
		`).join('')}
	</table>`;
}

function messageBlock(message: string, title: string): string {
	return `${sectionTitle(title)}
		<div style="margin:0 0 22px;padding:16px 18px;background:#fff;border:1px solid #eadfd7;border-radius:14px;font-size:15px;line-height:23px;color:#352824;">
			${message ? nl2br(escapeHtml(message)) : '<span style="color:#8a7369;">Keine Nachricht angegeben.</span>'}
		</div>`;
}

function noticeBox(message: string): string {
	return `<div style="margin:26px 0 8px;padding:16px 18px;background:#482c2c;border-radius:14px;color:#fffaf6;font-size:15px;line-height:23px;">${escapeHtml(message)}</div>`;
}

function buttonLink(href: string, label: string): string {
	return `<div style="margin:28px 0 8px;">
		<a href="${href}" style="display:inline-block;background:#482c2c;color:#fffaf6;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:14px;line-height:20px;font-weight:700;">${escapeHtml(label)}</a>
	</div>`;
}

async function sendResendEmail(
	apiKey: string,
	payload: ResendEmailPayload,
	idempotencyKey: string,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
	try {
		const response = await fetch(RESEND_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'Idempotency-Key': idempotencyKey.slice(0, 256),
			},
			body: JSON.stringify(payload),
		});
		const text = await response.text();

		if (!response.ok) {
			return { ok: false, error: `Resend ${response.status}: ${text.slice(0, 500)}` };
		}

		try {
			const data = JSON.parse(text) as { id?: string };
			return { ok: true, id: data.id };
		} catch {
			return { ok: true };
		}
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

async function redisCommand(config: ContactOutboxConfig, command: RedisCommand): Promise<unknown> {
	const response = await fetch(config.restUrl, {
		method: 'POST',
		headers: redisHeaders(config),
		body: JSON.stringify(command),
	});
	const text = await response.text();
	if (!response.ok) throw new Error(`Outbox REST ${response.status}: ${text.slice(0, 500)}`);
	const data = JSON.parse(text) as { result?: unknown; error?: string };
	if (data.error) throw new Error(data.error);
	return data.result;
}

async function redisPipeline(config: ContactOutboxConfig, commands: RedisCommand[]): Promise<void> {
	const response = await fetch(`${config.restUrl}/pipeline`, {
		method: 'POST',
		headers: redisHeaders(config),
		body: JSON.stringify(commands),
	});
	const text = await response.text();
	if (!response.ok) throw new Error(`Outbox pipeline ${response.status}: ${text.slice(0, 500)}`);
	const data = JSON.parse(text) as Array<{ result?: unknown; error?: string }>;
	const failed = data.find((entry) => entry.error);
	if (failed?.error) throw new Error(failed.error);
}

function redisHeaders(config: ContactOutboxConfig): Record<string, string> {
	return {
		Authorization: `Bearer ${config.restToken}`,
		'Content-Type': 'application/json',
	};
}

function outboxEntryKey(config: ContactOutboxConfig, id: string): string {
	return `${config.prefix}:entry:${id}`;
}

function outboxIndexKey(config: ContactOutboxConfig): string {
	return `${config.prefix}:retry`;
}

function cloneRecord(record: ContactOutboxRecord): ContactOutboxRecord {
	return JSON.parse(JSON.stringify(record)) as ContactOutboxRecord;
}

function ensureDeliveryState(record: ContactOutboxRecord): void {
	record.delivery = {
		internal: record.delivery?.internal ?? { attempts: 0 },
		confirmation: record.delivery?.confirmation ?? { attempts: 0 },
		alert: record.delivery?.alert ?? { attempts: 0 },
	};
}

function positiveInt(value: unknown, fallback: number): number {
	const parsed = Number.parseInt(str(value, 20), 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function str(value: unknown, max: number): string {
	if (typeof value === 'string') return value.trim().slice(0, max);
	if (typeof value === 'number' && Number.isFinite(value)) return String(value).slice(0, max);
	return '';
}

function bool(value: unknown): boolean {
	return value === true || value === 1 || value === '1' || value === 'true';
}

function display(value: string): string {
	return value || 'Nicht angegeben';
}

function oneLine(value: string): string {
	return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function subjectText(value: string): string {
	return oneLine(value).replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

function senderAddress(value: string): string {
	const clean = oneLine(value);
	if (!clean) return '';
	if (/^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/.test(clean)) {
		return `${BRAND_NAME} <${clean}>`;
	}
	return clean;
}

function nl2br(value: string): string {
	return value.replace(/\r?\n/g, '<br>');
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeAttr(value: string): string {
	return escapeHtml(value).replace(/`/g, '&#96;');
}
