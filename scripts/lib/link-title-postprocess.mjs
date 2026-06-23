import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as parse5 from 'parse5';

function walkHtmlFiles(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) walkHtmlFiles(file, files);
		else if (file.endsWith('.html')) files.push(file);
	}
	return files;
}

function getAttr(node, name) {
	return node.attrs?.find((attr) => attr.name === name)?.value;
}

function setAttr(node, name, value) {
	const existing = node.attrs?.find((attr) => attr.name === name);
	if (existing) {
		existing.value = value;
		return;
	}
	node.attrs = [...(node.attrs ?? []), { name, value }];
}

function textContent(node) {
	if (node.nodeName === '#text') return node.value ?? '';
	if (node.tagName === 'script' || node.tagName === 'style') return '';
	return (node.childNodes ?? []).map(textContent).join(' ');
}

function cleanTitle(value) {
	const title = String(value ?? '')
		.replace(/(?:→|â†’|›|»)+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return title.length > 180 ? `${title.slice(0, 177).trim()}...` : title;
}

function titleFromHref(href) {
	if (!href) return '';
	if (href.startsWith('mailto:')) return href.slice('mailto:'.length);
	if (href.startsWith('tel:')) return href.slice('tel:'.length);
	try {
		const url = new URL(href, 'https://kim-marie-borger.com');
		return url.pathname === '/' ? 'Startseite' : url.pathname.replace(/^\/|\/$/g, '').replace(/[-/]+/g, ' ');
	} catch {
		return href;
	}
}

function addTitlesToNode(node) {
	let added = 0;
	if (node.tagName === 'a' && getAttr(node, 'href') && !getAttr(node, 'title')) {
		const title = cleanTitle(getAttr(node, 'aria-label') || textContent(node) || titleFromHref(getAttr(node, 'href')));
		if (title) {
			setAttr(node, 'title', title);
			added += 1;
		}
	}
	for (const child of node.childNodes ?? []) added += addTitlesToNode(child);
	return added;
}

export function addMissingLinkTitles({ dir, logger } = {}) {
	const root = typeof dir === 'string' ? dir : fileURLToPath(dir);
	let touchedFiles = 0;
	let addedTitles = 0;

	for (const file of walkHtmlFiles(root)) {
		const before = readFileSync(file, 'utf8');
		const doc = parse5.parse(before);
		const added = addTitlesToNode(doc);
		if (added === 0) continue;
		writeFileSync(file, parse5.serialize(doc));
		touchedFiles += 1;
		addedTitles += added;
	}

	logger?.info?.(`Added ${addedTitles} missing link title attributes across ${touchedFiles} HTML files`);
	return { touchedFiles, addedTitles };
}
