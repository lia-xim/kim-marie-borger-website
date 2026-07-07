import type { APIRoute } from 'astro';
import type { ContactAnalyticsDeliveryStatus, ContactOutboxRecord } from '../../lib/contact-delivery';
import {
	createOutboxRecord,
	deliverContactRecord,
	getContactAnalyticsConfig,
	getContactDeliveryConfig,
	getContactOutboxConfig,
	markOutboxError,
	readInquiry,
	saveOutboxRecord,
	trackContactServerEvent,
	validateInquiry,
} from '../../lib/contact-delivery';

export const prerender = false;

/**
 * Contact form endpoint. If CONTACT_OUTBOX_REST_URL/KV_REST_API_URL is
 * configured, the inquiry is persisted before delivery so failed Resend calls
 * can be retried by /api/contact-retry.
 */
export const POST: APIRoute = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid-json' }, 400);
	}

	// Honeypot: real users never fill this hidden field.
	if (typeof body.website === 'string' && body.website.trim() !== '') {
		return json({ ok: true }, 200);
	}

	const inquiry = readInquiry(body);
	if (!validateInquiry(inquiry)) {
		return json({ error: 'validation' }, 422);
	}

	const outboxConfig = getContactOutboxConfig(import.meta.env);
	let outboxSaved = false;
	let record = createOutboxRecord(inquiry);

	if (outboxConfig) {
		try {
			await saveOutboxRecord(outboxConfig, record);
			outboxSaved = true;
		} catch (error) {
			console.error('Contact outbox initial write failed', error);
		}
	}

	const deliveryConfig = getContactDeliveryConfig(import.meta.env);
	if (!deliveryConfig) {
		if (outboxConfig && outboxSaved) {
			record = markOutboxError(record, 'Resend is not configured');
			await saveOutboxSafely(outboxConfig, record);
		}
		return json({ error: 'not-configured' }, 503);
	}

	const result = await deliverContactRecord(record, deliveryConfig);
	record = result.record;

	if (outboxConfig && outboxSaved) {
		await saveOutboxSafely(outboxConfig, record);
	}

	if (result.ok) {
		await trackContactAnalyticsSafely(record, 'sent');
		return json({ ok: true, queued: false }, 200);
	}

	console.error('Contact delivery failed', result.errors);

	if (outboxConfig && outboxSaved) {
		await trackContactAnalyticsSafely(record, 'queued');
		return json({ ok: true, queued: true }, 200);
	}

	if (record.delivery.internal.sentAt) {
		await trackContactAnalyticsSafely(record, 'confirmation_failed');
		return json({ ok: true, queued: false, warning: 'confirmation-failed' }, 200);
	}

	return json({ error: 'send-failed' }, 502);
};

async function trackContactAnalyticsSafely(
	record: ContactOutboxRecord,
	deliveryStatus: ContactAnalyticsDeliveryStatus,
): Promise<void> {
	const analyticsConfig = getContactAnalyticsConfig(import.meta.env);
	if (!analyticsConfig) return;
	try {
		await trackContactServerEvent(analyticsConfig, record, deliveryStatus);
	} catch (error) {
		console.error('Contact analytics event failed', error);
	}
}

async function saveOutboxSafely(
	config: NonNullable<ReturnType<typeof getContactOutboxConfig>>,
	record: Parameters<typeof saveOutboxRecord>[1],
): Promise<void> {
	try {
		await saveOutboxRecord(config, record);
	} catch (error) {
		console.error('Contact outbox update failed', error);
	}
}

function json(payload: unknown, status: number): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
