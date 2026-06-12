/**
 * Helfer für Vercel Image Optimization (/_vercel/image).
 * Auf Vercel gebaute Seiten bekommen srcset mit AVIF/WebP-Transcoding und
 * responsiven Breiten; lokale Builds liefern das Originalbild aus.
 */
import manifest from './image-manifest.json';

/** Muss exakt mit imagesConfig.sizes in astro.config.mjs übereinstimmen. */
export const IMAGE_SIZES = [320, 480, 640, 800, 960, 1280, 1600, 2000];

export const onVercel = Boolean(process.env.VERCEL);

type Dims = { width?: number; height?: number };
const dimsMap = manifest as Record<string, Dims>;

/**
 * Tina Cloud liefert Repo-Medien im Cloud-Modus als assets.tina.io-URLs aus.
 * Dieselbe Datei liegt im Deployment unter /uploads — der lokale Pfad ist
 * cachebar (eigene Header) und durch /_vercel/image optimierbar.
 */
export function normalizeSrc(src: string | undefined | null): string | undefined {
	if (!src) return undefined;
	return src.replace(/^https?:\/\/assets\.tina\.io\/[^/]+\//, '/uploads/');
}

export function imageDims(src: string | undefined | null): Dims | undefined {
	if (!src) return undefined;
	return dimsMap[src.replace(/^\/uploads\//, '')];
}

export function isOptimizable(src: string | undefined | null): src is string {
	return typeof src === 'string' && src.startsWith('/uploads/') && /\.(jpe?g|png)$/i.test(src);
}

export function vercelImg(src: string, width: number, quality = 75): string {
	return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

export function buildSrcset(src: string, quality = 75): { srcset: string; fallback: string } {
	const max = imageDims(src)?.width ?? IMAGE_SIZES[IMAGE_SIZES.length - 1];
	let widths = IMAGE_SIZES.filter((w) => w <= max);
	if (widths.length === 0) widths = [IMAGE_SIZES[0]];
	const srcset = widths.map((w) => `${vercelImg(src, w, quality)} ${w}w`).join(', ');
	return { srcset, fallback: vercelImg(src, widths[widths.length - 1], quality) };
}
