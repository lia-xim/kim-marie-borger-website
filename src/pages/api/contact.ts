import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Contact form endpoint. Sends the request via Resend (https://resend.com).
 * Required env vars (set in Vercel → Project → Environment Variables):
 *   RESEND_API_KEY      — API key from resend.com
 *   CONTACT_TO_EMAIL    — where enquiries are delivered
 *   CONTACT_FROM_EMAIL  — verified sender, e.g. "Website <anfrage@domain.de>"
 *                         (optional; falls back to Resend's onboarding sender)
 * Without RESEND_API_KEY the endpoint answers 503 and the client shows a
 * fallback message pointing to direct e-mail.
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

	const name = str(body.name, 200);
	const email = str(body.email, 200);
	const occasion = str(body.anlass, 200);
	const date = str(body.datum, 200);
	const place = str(body.ort, 300);
	const message = str(body.nachricht, 5000);

	if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'validation' }, 422);
	}

	const apiKey = import.meta.env.RESEND_API_KEY;
	const to = import.meta.env.CONTACT_TO_EMAIL;
	if (!apiKey || !to) {
		return json({ error: 'not-configured' }, 503);
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: import.meta.env.CONTACT_FROM_EMAIL || 'Website <onboarding@resend.dev>',
			to: [to],
			reply_to: email,
			subject: `Neue Anfrage über die Website von ${name}`,
			text: [
				`Name: ${name}`,
				`E-Mail: ${email}`,
				`Anlass: ${occasion || '(nicht angegeben)'}`,
				`Datum / Zeitraum: ${date || '(nicht angegeben)'}`,
				`Ort / Location: ${place || '(nicht angegeben)'}`,
				'',
				'Nachricht:',
				message || '(keine Nachricht)',
				'',
			].join('\n'),
		}),
	});

	if (!res.ok) {
		console.error('Resend error', res.status, await res.text());
		return json({ error: 'send-failed' }, 502);
	}

	return json({ ok: true }, 200);
};

function str(value: unknown, max: number): string {
	return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function json(payload: unknown, status: number): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
