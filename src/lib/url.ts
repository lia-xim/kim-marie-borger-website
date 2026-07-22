const EXTERNAL_PROTOCOLS = ['http:', 'https:'];

export function normalizeInternalPath(pathname: string): string {
	let path = pathname || '/';

	if (path.endsWith('/index.html')) {
		path = path.slice(0, -'index.html'.length);
	} else if (path.endsWith('.html')) {
		path = path.slice(0, -'.html'.length);
	}

	if (!path.startsWith('/')) path = `/${path}`;
	if (path === '' || path === '/') return '/';

	return path.endsWith('/') ? path : `${path}/`;
}

export function normalizeHref(href: string | null | undefined, fallback = '#'): string {
	if (!href) return fallback;
	if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
	if (href.startsWith('//')) return href;

	try {
		const url = new URL(href, 'https://example.local');
		const isExternal = EXTERNAL_PROTOCOLS.includes(url.protocol) && url.origin !== 'https://example.local';
		if (isExternal) return href;

		if (/\.[a-z0-9]{2,8}$/i.test(url.pathname) && !url.pathname.endsWith('.html')) {
			return `${url.pathname}${url.search}${url.hash}`;
		}

		return `${normalizeInternalPath(url.pathname)}${url.search}${url.hash}`;
	} catch {
		return href;
	}
}

export function canonicalUrl(site: URL | string, pathname: string): URL {
	return new URL(normalizeInternalPath(pathname), site);
}

/** Digits only, without the leading `+` — the form wa.me and tel: links need. */
function phoneDigits(value: string | null | undefined): string {
	return (value ?? '').replace(/[^\d]/g, '');
}

/** `+4915904955240` → `tel:+4915904955240`. Returns undefined for empty/unusable input. */
export function telHref(value: string | null | undefined): string | undefined {
	const digits = phoneDigits(value);
	return digits.length >= 6 ? `tel:+${digits}` : undefined;
}

/** `+4915904955240` → `+49 159 04955240`. Falls back to the raw value for non-German numbers. */
export function formatPhone(value: string | null | undefined): string {
	const digits = phoneDigits(value);
	if (!digits) return '';
	const german = digits.match(/^49(1\d{2})(\d+)$/);
	if (german) return `+49 ${german[1]} ${german[2]}`;
	return `+${digits}`;
}

/** `+4915904955240` → `https://wa.me/4915904955240`, optionally with a prefilled message. */
export function whatsappHref(value: string | null | undefined, text?: string): string | undefined {
	const digits = phoneDigits(value);
	if (digits.length < 6) return undefined;
	const query = text ? `?text=${encodeURIComponent(text)}` : '';
	return `https://wa.me/${digits}${query}`;
}

/** Accepts a full URL or a bare handle and always returns a canonical profile URL. */
export function instagramHref(value: string | null | undefined): string | undefined {
	const raw = (value ?? '').trim();
	if (!raw) return undefined;
	if (/^https?:\/\//i.test(raw)) return raw;
	const handle = raw.replace(/^@/, '').replace(/\/+$/, '');
	return handle ? `https://www.instagram.com/${handle}/` : undefined;
}

/** `https://www.instagram.com/kimmarie_event_musician/` → `@kimmarie_event_musician` */
export function instagramHandle(value: string | null | undefined): string | undefined {
	const href = instagramHref(value);
	if (!href) return undefined;
	try {
		const handle = new URL(href).pathname.replace(/\//g, '');
		return handle ? `@${handle}` : undefined;
	} catch {
		return undefined;
	}
}
