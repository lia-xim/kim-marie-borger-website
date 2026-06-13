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
