import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { contrast, INK } from './lib/color';

// Every text a visitor reads exists in both languages.
const text = z.object({ en: z.string().min(1), es: z.string().min(1) });
const lang = z.enum(['en', 'es', 'ja']);
const web = z.url({ protocol: /^https$/ });

/** A YAML or JSON list. Entries keep their file order and get their id from `idOf`. */
function list(path: string, idOf: (entry: Record<string, unknown>) => unknown) {
	return file(path, {
		parser: (source) =>
			((parse(source) ?? []) as Record<string, unknown>[]).map((entry, order) => ({
				...entry,
				id: String(idOf(entry)),
				order,
			})),
	});
}

const projects = defineCollection({
	loader: list('content/projects.yaml', (e) => e.id),
	schema: z.object({
		order: z.number(),
		name: z.string(),
		glyph: z.string().min(1).max(3),
		url: web,
		color: z
			.string()
			.regex(/^#[0-9a-f]{6}$/i, 'Use a six-digit hex colour such as "#ff5c3e".')
			.refine((c) => contrast(c, INK) >= 4.5, {
				message: 'Too dark: dark text must stay readable on top of the project colour. Pick a brighter one.',
			}),
		language: lang,
		kind: text,
		description: text,
		facts: z.array(text).max(4).default([]),
		feed: z
			.object({
				type: z.enum(['rss', 'sitemap']),
				url: web,
				match: z.string().optional(),
				titleSuffix: z.string().optional(),
			})
			.optional(),
	}),
});

const minis = defineCollection({
	loader: list('content/minis.yaml', (e) => e.id),
	schema: z.object({
		order: z.number(),
		name: z.union([z.string(), text]),
		description: text,
		stack: z.array(z.string()).max(4).default([]),
		status: text.optional(),
		url: web.optional(),
		repo: web.optional(),
	}),
});

const post = {
	title: z.string(),
	url: web,
	date: z.coerce.date(),
	project: z.string(),
	lang,
	summary: z.string().optional(),
	gloss: text.partial().optional(),
	pinned: z.boolean().optional(),
};

// Posts collected by `pnpm sync`. Generated: edit writing.yaml instead.
const writingSynced = defineCollection({
	loader: list('content/writing.synced.json', (e) => e.url),
	schema: z.object({ order: z.number(), ...post }),
});

// Posts added by hand, or partial entries that adjust a synced post with the same url.
const writingManual = defineCollection({
	loader: list('content/writing.yaml', (e) => e.url),
	schema: z.object({ order: z.number(), ...post }).partial().required({ url: true }),
});

const experience = defineCollection({
	loader: file('content/experience.yaml', { parser: (source) => ({ main: parse(source) }) }),
	schema: z.object({
		note: text,
		focus: text,
		timeline: z.array(z.object({ when: text, role: text, detail: text })),
		skills: z.array(z.object({ name: text, items: z.array(z.string()) })),
		languages: z.array(z.object({ name: text, level: text })),
	}),
});

const about = defineCollection({
	loader: glob({ base: 'content/about', pattern: '*.md' }),
	schema: z.object({
		contact: z.string().optional(),
		contactUrl: z.union([z.literal(''), z.string().regex(/^(https:\/\/|mailto:)/)]).optional(),
		contactLabel: z.string().optional(),
	}),
});

export const collections = { projects, minis, writingSynced, writingManual, experience, about };
