import type { APIRoute } from 'astro';
import {
	getContactDeliveryConfig,
	getContactOutboxConfig,
	retryOutboxRecords,
} from '../../lib/contact-delivery';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const secret = str(import.meta.env.CRON_SECRET, 300) || str(import.meta.env.CONTACT_RETRY_SECRET, 300);
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return json({ error: 'unauthorized' }, 401);
	}

	const outboxConfig = getContactOutboxConfig(import.meta.env);
	if (!outboxConfig) {
		return json({ error: 'outbox-not-configured' }, 503);
	}

	const deliveryConfig = getContactDeliveryConfig(import.meta.env);
	if (!deliveryConfig) {
		return json({ error: 'delivery-not-configured' }, 503);
	}

	const result = await retryOutboxRecords(outboxConfig, deliveryConfig);
	return json({ ok: true, ...result }, 200);
};

export const POST = GET;

function str(value: unknown, max: number): string {
	return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function json(payload: unknown, status: number): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
