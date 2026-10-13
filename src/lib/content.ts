import { getCollection, getEntry, render } from 'astro:content';
import site from '../../site.config.mjs';
import type { Locale } from '../i18n/ui';

const inOrder = <T extends { data: { order: number } }>(entries: T[]) =>
	entries.sort((a, b) => a.data.order - b.data.order);

// The account behind the source links. It comes from the environment, never from the repository.
if (site.github.owner && !/^[A-Za-z0-9-]{1,39}$/.test(site.github.owner)) {
	throw new Error('HUB_GITHUB_OWNER is not a valid account name.');
}
const repoUrl = (repo?: string) => (repo && site.github.owner ? `https://github.com/${site.github.owner}/${repo}` : undefined);

export async function getProjects() {
	return inOrder(await getCollection('projects')).map((entry) => ({
		id: entry.id,
		...entry.data,
		repoUrl: repoUrl(entry.data.repo),
	}));
}

export async function getMinis() {
	return inOrder(await getCollection('minis')).map(({ id, data }) => ({
		id,
		...data,
		// A tile links to its public address when it has one; its source is a separate link.
		href: data.url,
		repoUrl: repoUrl(data.repo),
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
