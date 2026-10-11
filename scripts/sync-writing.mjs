// Collects the newest posts of every project that has a `feed` in content/projects.yaml
// and writes them to content/writing.synced.json, which the Writing section reads.
//
//   pnpm sync          fetch only posts that are not in the file yet
//   pnpm sync --full   fetch everything again (picks up edited titles and dates)
//
// It never fails a build: if a site cannot be reached, the posts already saved are kept.

import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';

const PROJECTS = new URL('../content/projects.yaml', import.meta.url);
const OUTPUT = new URL('../content/writing.synced.json', import.meta.url);
const KEEP_PER_PROJECT = 30;
const full = process.argv.includes('--full');

const decode = (s) =>
	s
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;|&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.trim();

const tag = (xml, name) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))?.[1];
const day = (value) => {
	const d = new Date(value ?? '');
	return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

async function get(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(10_000), redirect: 'follow' });
	if (!res.ok) throw new Error(`${res.status} from ${url}`);
	return res.text();
}

/** RSS 2.0 or Atom. */
async function fromFeed(project) {
	const xml = await get(project.feed.url);
	const items = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
	return items.flatMap((item) => {
		const title = tag(item, 'title');
		const url = item.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? tag(item, 'link');
		const date = day(tag(item, 'pubDate') ?? tag(item, 'published') ?? tag(item, 'updated'));
		if (!title || !url || !date) return [];
		const summary = tag(item, 'description') ?? tag(item, 'summary');
		return [
			{
				title: decode(title),
				url: decode(url),
				date,
				summary: summary ? decode(summary).replace(/<[^>]+>/g, '').slice(0, 220) : undefined,
			},
		];
	});
}

/** A sitemap plus one request per new post, reading its title, description and <time>. */
async function fromSitemap(project, known) {
	const { url, match, titleSuffix = '' } = project.feed;
	const pattern = new RegExp(match ?? '.');
	const xml = await get(url);
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
		.map((m) => decode(m[1]))
		.filter((u) => pattern.test(new URL(u).pathname));

	const posts = [];
	const queue = urls.filter((u) => full || !known.has(u));
	posts.push(...urls.filter((u) => !full && known.has(u)).map((u) => known.get(u)));

	// A few at a time: these are small personal sites.
	while (queue.length) {
		const batch = await Promise.all(
			queue.splice(0, 4).map(async (u) => {
				try {
					const html = await get(u);
					const title = tag(html, 'title');
					const date = day(html.match(/<time[^>]*datetime="([^"]+)"/i)?.[1]);
					if (!title || !date) return null;
					const summary = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
					let clean = decode(title);
					if (titleSuffix && clean.endsWith(titleSuffix)) clean = clean.slice(0, -titleSuffix.length);
					return { title: clean, url: u, date, summary: summary ? decode(summary) : undefined };
				} catch (error) {
					console.warn(`  skipped ${u} (${error.message})`);
					return known.get(u) ?? null;
				}
			}),
		);
		posts.push(...batch.filter(Boolean));
	}
	return posts;
}

const projects = parse(await readFile(PROJECTS, 'utf8')) ?? [];
const previous = JSON.parse(await readFile(OUTPUT, 'utf8').catch(() => '[]'));
const result = [];

for (const project of projects) {
	const saved = previous.filter((p) => p.project === project.id);
	if (!project.feed) continue;
	try {
		const known = new Map(saved.map((p) => [p.url, p]));
		const found =
			project.feed.type === 'rss' ? await fromFeed(project) : await fromSitemap(project, known);
		const posts = found
			.map((p) => ({ ...p, project: project.id, lang: project.language }))
			.sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url))
			.slice(0, KEEP_PER_PROJECT);
		result.push(...posts);
		const fresh = posts.filter((p) => !known.has(p.url)).length;
		console.log(`${project.id}: ${posts.length} posts (${fresh} new)`);
	} catch (error) {
		// Offline, or the site is down: keep what was saved last time.
		result.push(...saved);
		console.warn(`${project.id}: could not sync (${error.message}), kept ${saved.length} saved posts`);
	}
}

const next = `${JSON.stringify(result, null, '\t')}\n`;
if (next !== `${JSON.stringify(previous, null, '\t')}\n`) await writeFile(OUTPUT, next);
