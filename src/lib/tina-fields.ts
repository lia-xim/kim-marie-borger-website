import { tinaField } from '@tinacms/astro/tina-field';

export const SEO_FIELD_SOURCES = '_seoFieldSources';

type AnyRecord = Record<string, any>;

export function tinaFieldFrom(object: unknown, property?: string, index?: number): string {
	const record = object as AnyRecord | null | undefined;
	const source = property && record?.[SEO_FIELD_SOURCES]?.[property]
		? record[SEO_FIELD_SOURCES][property]
		: object;

	if (!property) return tinaField(source as any);
	if (typeof index === 'number') return tinaField(source as any, property as any, index);
	return tinaField(source as any, property as any);
}
