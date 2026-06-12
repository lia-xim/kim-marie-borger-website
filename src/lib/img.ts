/**
 * Helfer für Vercel Image Optimization (/_vercel/image).
 * Auf Vercel gebaute Seiten bekommen srcset mit AVIF/WebP-Transcoding und
 * responsiven Breiten; lokale Builds liefern das Originalbild aus.
 */
import manifest from './image-manifest.json';

/** Muss exakt mit imagesConfig.sizes in astro.config.mjs übereinstimmen. */
export const IMAGE_SIZES = [320, 640, 960, 1280, 1600, 2000];

export const onVercel = Boolean(process.env.VERCEL);

type Dims = { width?: number; height?: number };
const dimsMap = manifest as Record<string, Dims>;

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
