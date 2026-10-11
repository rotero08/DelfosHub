import { getCollection, getEntry, render } from 'astro:content';
import site from '../../site.config.mjs';
import type { Locale } from '../i18n/ui';

const inOrder = <T extends { data: { order: number } }>(entries: T[]) =>
	entries.sort((a, b) => a.data.order - b.data.order);

export async function getProjects() {
	return inOrder(await getCollection('projects')).map((entry) => ({ id: entry.id, ...entry.data }));
}

export async function getMinis() {
	return inOrder(await getCollection('minis')).map(({ id, data }) => ({
		id,
		...data,
		// A tile links to its public address, or to its source only when that is allowed.
		href: data.url ?? (site.privacy.showRepoLinks ? data.repo : undefined),
		isRepo: !data.url && site.privacy.showRepoLinks && Boolean(data.repo),
	}));
}

/** Synced posts with hand-written entries layered on top, newest first, pinned ones leading. */
export async function getWriting() {
	const byUrl = new Map<string, Record<string, unknown>>();
	for (const { data } of await getCollection('writingSynced')) byUrl.set(data.url, { ...data });
	for (const { data } of await getCollection('writingManual')) {
		const given = Object.fromEntries(Object.entries(data).filter(([key, v]) => v !== undefined && key !== 'order'));
		byUrl.set(data.url, { ...byUrl.get(data.url), ...given });
	}

	type Post = (Awaited<ReturnType<typeof getCollection<'writingSynced'>>>)[number]['data'];
	const complete = [...byUrl.values()].filter(
		(p): p is Post => Boolean(p.title && p.date && p.project && p.lang),
	);

	return complete
		.sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false) || b.date.getTime() - a.date.getTime())
		.slice(0, site.writingLimit);
}

export async function getExperience() {
	const entry = await getEntry('experience', 'main');
	if (!entry) throw new Error('content/experience.yaml is missing or empty.');
	return entry.data;
}

export async function getAbout(lang: Locale) {
	const entry = await getEntry('about', lang);
	if (!entry) throw new Error(`content/about/${lang}.md is missing.`);
	const { Content } = await render(entry);
	return { Content, ...entry.data };
}
