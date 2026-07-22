import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	const sitemap = new URL('/sitemap.xml', site ?? 'https://example.com');
	// /admin und /tina-island tragen bereits X-Robots-Tag: noindex. Das Disallow
	// spart zusaetzlich Crawl-Budget, das sonst in Editor-Routen fliesst.
	const lines = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin/',
		'Disallow: /tina-island/',
		'Disallow: /api/',
		'',
		`Sitemap: ${sitemap.href}`,
		'',
	];
	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
