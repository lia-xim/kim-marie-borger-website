type MediaUploadOptions = {
	directory: string;
	file: File;
};

type MediaItem = {
	type: 'file' | 'dir';
	id: string;
	filename: string;
	directory: string;
	src?: string;
	thumbnails?: Record<string, string>;
	new?: boolean;
};

type MediaList = {
	items: MediaItem[];
	nextOffset?: string | number | null;
};

type MediaListOptions = {
	directory?: string;
	limit?: number;
	offset?: string | number;
	thumbnailSizes?: { w: number; h: number }[];
	filesOnly?: boolean;
};

type MediaStoreLike = {
	accept?: string;
	maxSize?: number;
	persist(files: MediaUploadOptions[]): Promise<MediaItem[]>;
	list?(options?: MediaListOptions): Promise<MediaList>;
};

type TinaCmsLike = {
	media?: {
		store?: MediaStoreLike & { __kmbOptimizedUpload?: boolean };
	};
	alerts?: {
		info(message: string, timeout?: number): (() => void) | void;
		success(message: string, timeout?: number): (() => void) | void;
		warn(message: string, timeout?: number): (() => void) | void;
	};
};

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2000;
const WEBP_QUALITY = 0.78;
const LARGE_UNOPTIMIZED_IMAGE_BYTES = 3 * 1024 * 1024;
const SUPPORTED_RASTER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const RAW_CAMERA_EXTENSION = /\.(arw|cr2|cr3|dng|nef|orf|raf|raw|rw2)$/i;

type OptimizedUpload = {
	file: File;
	optimized: boolean;
	before: number;
	after: number;
	dimensions?: string;
};

export function installOptimizedMediaUpload(cms: TinaCmsLike): TinaCmsLike {
	const store = cms.media?.store;
	if (!store?.persist || store.__kmbOptimizedUpload) return cms;

	const persist = store.persist.bind(store);
	const list = store.list?.bind(store);
	store.__kmbOptimizedUpload = true;
	store.maxSize = Math.max(store.maxSize ?? 0, MAX_UPLOAD_BYTES);

	if (list) {
		store.list = async (options) => normalizeMediaList(await list(options));
	}

	store.persist = async (items) => {
		const dismissOptimize = cms.alerts?.info(
			`${items.length} Datei${items.length === 1 ? '' : 'en'} werden lokal vorbereitet ...`,
			0,
		);
		const processed = await Promise.all(
			items.map(async (item) => ({
				...item,
				...(await optimizeUploadFile(item.file)),
			})),
		);
		dismissOptimize?.();

		const optimized = processed.filter((item) => item.optimized);
		if (optimized.length > 0) {
			const before = optimized.reduce((sum, item) => sum + item.before, 0);
			const after = optimized.reduce((sum, item) => sum + item.after, 0);
			cms.alerts?.info(
				`${optimized.length} Bild${optimized.length === 1 ? '' : 'er'} lokal optimiert: ${formatBytes(before)} -> ${formatBytes(after)}. Upload startet danach.`,
				9000,
			);

			for (const item of optimized) {
				console.info(
					`[Tina media] ${item.file.name}: ${formatBytes(item.before)} -> ${formatBytes(item.after)}${item.dimensions ? ` (${item.dimensions})` : ''}`,
				);
			}
		}

		const uploadItems = processed.map(({ optimized: _optimized, before: _before, after: _after, dimensions: _dimensions, ...item }) => item);
		const dismissUpload = cms.alerts?.info(
			`${uploadItems.length} Datei${uploadItems.length === 1 ? '' : 'en'} werden zu Tina hochgeladen ...`,
			0,
		);

		try {
			const uploaded = normalizeMediaItems(await persist(uploadItems));
			const resolved = await resolveUploadedItems(uploaded, uploadItems, list);
			dismissUpload?.();
			cms.alerts?.success(
				`${resolved.length} Datei${resolved.length === 1 ? '' : 'en'} hochgeladen. Vorschau und Auswahl wurden aktualisiert.`,
				8000,
			);
			return resolved;
		} catch (error) {
			dismissUpload?.();
			throw error;
		}
	};

	return cms;
}

async function optimizeUploadFile(file: File): Promise<OptimizedUpload> {
	if (RAW_CAMERA_EXTENSION.test(file.name)) {
		throw new Error(`"${file.name}" ist ein Kamera-RAW. Bitte als JPEG exportieren; der CMS-Upload wandelt es dann in WebP um.`);
	}

	if (!isSupportedRaster(file)) {
		if (file.type.startsWith('image/') && file.size > LARGE_UNOPTIMIZED_IMAGE_BYTES) {
			throw new Error(`"${file.name}" kann im Browser nicht sicher optimiert werden. Bitte als JPEG, PNG, WebP oder AVIF hochladen.`);
		}
		return unchanged(file);
	}

	try {
		const decoded = await decodeImage(file);
		const { canvas, dimensions } = drawResized(decoded);
		const blob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
		decoded.close?.();

		if (!blob || blob.size === 0) return unchanged(file);

		const nextFile = new File([blob], webpName(file.name), {
			type: 'image/webp',
			lastModified: file.lastModified,
		});

		return {
			file: nextFile,
			optimized: true,
			before: file.size,
			after: nextFile.size,
			dimensions,
		};
	} catch (error) {
		if (file.size > LARGE_UNOPTIMIZED_IMAGE_BYTES) {
			throw new Error(`"${file.name}" konnte nicht optimiert werden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
		}
		return unchanged(file);
	}
}

function isSupportedRaster(file: File): boolean {
	return SUPPORTED_RASTER_TYPES.has(file.type) || /\.(jpe?g|png|webp|avif)$/i.test(file.name);
}

function unchanged(file: File): OptimizedUpload {
	return {
		file,
		optimized: false,
		before: file.size,
		after: file.size,
	};
}

async function decodeImage(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close?: () => void }> {
	if ('createImageBitmap' in window) {
		const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
		return {
			source: bitmap,
			width: bitmap.width,
			height: bitmap.height,
			close: () => bitmap.close(),
		};
	}

	const url = URL.createObjectURL(file);
	try {
		const image = await new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.decoding = 'async';
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
			img.src = url;
		});
		return {
			source: image,
			width: image.naturalWidth,
			height: image.naturalHeight,
			close: () => URL.revokeObjectURL(url),
		};
	} catch (error) {
		URL.revokeObjectURL(url);
		throw error;
	}
}

function drawResized(decoded: { source: CanvasImageSource; width: number; height: number }): { canvas: HTMLCanvasElement; dimensions: string } {
	const longestEdge = Math.max(decoded.width, decoded.height);
	const scale = Math.min(1, MAX_IMAGE_EDGE / longestEdge);
	const width = Math.max(1, Math.round(decoded.width * scale));
	const height = Math.max(1, Math.round(decoded.height * scale));
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d', { alpha: true });
	if (!ctx) throw new Error('Canvas ist im Browser nicht verfuegbar.');
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(decoded.source, 0, 0, width, height);
	return { canvas, dimensions: `${decoded.width}x${decoded.height} -> ${width}x${height}` };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('WebP-Erzeugung fehlgeschlagen.'));
				return;
			}
			resolve(blob);
		}, type, quality);
	});
}

function webpName(name: string): string {
	return name.replace(/\.[^.]+$/, '') + '.webp';
}

async function resolveUploadedItems(uploaded: MediaItem[], items: MediaUploadOptions[], list?: MediaStoreLike['list']): Promise<MediaItem[]> {
	if (uploaded.length >= items.length || !list) return uploaded;

	const found = new Map(uploaded.map((item) => [item.filename, item]));
	const directories = new Map<string, string[]>();
	for (const item of items) {
		if (found.has(item.file.name)) continue;
		const dir = normalizeDirectory(item.directory);
		const bucket = directories.get(dir) ?? [];
		bucket.push(item.file.name);
		directories.set(dir, bucket);
	}

	for (const [directory, filenames] of directories) {
		let offset: string | number | undefined;
		let pages = 0;
		while (filenames.some((name) => !found.has(name)) && pages < 10) {
			const page = normalizeMediaList(await list({
				directory,
				limit: 100,
				offset,
				thumbnailSizes: [
					{ w: 75, h: 75 },
					{ w: 400, h: 400 },
					{ w: 1000, h: 1000 },
				],
			}));
			for (const entry of page.items) {
				if (entry.type === 'file' && filenames.includes(entry.filename)) {
					found.set(entry.filename, entry);
				}
			}
			if (!page.nextOffset) break;
			offset = page.nextOffset;
			pages++;
		}
	}

	return items.map((item) => found.get(item.file.name) ?? fallbackMediaItem(item));
}

function normalizeMediaList(list: MediaList): MediaList {
	return {
		...list,
		items: normalizeMediaItems(list.items),
	};
}

function normalizeMediaItems(items: MediaItem[]): MediaItem[] {
	return items.map(withPreviewFallback);
}

function withPreviewFallback(item: MediaItem): MediaItem {
	if (item.type !== 'file' || !isPreviewableImage(item.src ?? item.filename)) return item;

	const directPreview = item.src;
	if (!directPreview) return item;

	const thumbnails = { ...(item.thumbnails ?? {}) };
	for (const key of ['75x75', '400x400', '1000x1000']) {
		if (!thumbnails[key] || /\.(webp|avif)(\?.*)?$/i.test(thumbnails[key])) {
			thumbnails[key] = directPreview;
		}
	}

	return {
		...item,
		thumbnails,
	};
}

function fallbackMediaItem(item: MediaUploadOptions): MediaItem {
	const directory = normalizeDirectory(item.directory);
	const src = `/uploads/${directory ? `${directory}/` : ''}${item.file.name}`;
	return withPreviewFallback({
		type: 'file',
		id: item.file.name,
		filename: item.file.name,
		directory,
		src,
		thumbnails: {
			'75x75': src,
			'400x400': src,
			'1000x1000': src,
		},
	});
}

function normalizeDirectory(directory: string | undefined): string {
	return (directory ?? '').replace(/^\/+|\/+$/g, '').replace(/^uploads\/?/, '');
}

function isPreviewableImage(src: string): boolean {
	return /\.(gif|jpe?g|png|svg|webp|avif)(\?.*)?$/i.test(src);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
