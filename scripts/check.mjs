// The safety net. Run it with `pnpm check` before publishing; the pre-commit hook runs the
// quick part of it (`--staged`) on every commit.
//
//   1. Private terms   nothing in the project, the built site or the commit history may
//                      contain a term from the private list (real name, personal addresses).
//   2. Image metadata  no image carries EXIF, XMP or IPTC data.
//   3. Built pages     every page has its security policy and nothing that would break it.
//   4. Weight          a report of what a visitor downloads.
//
// The private list is deliberately NOT in this repository: a file here would publish the
// very words it protects. It lives at ~/.config/delfost-hub/private-terms.txt (or wherever
// HUB_PRIVATE_TERMS points): one term per line, matched without regard to case. A line
// starting with "?" only warns. Without the file, check 1 is skipped with a notice.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';
import site from '../site.config.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const staged = process.argv.includes('--staged');
const SKIP = new Set(['node_modules', '.git', '.astro', '.wrangler']);
const IMAGE = /\.(png|jpe?g|webp|avif|gif|tiff?)$/i;

const errors = [];
const warnings = [];
const rel = (path) => relative(root, path) || '.';

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		if (SKIP.has(entry.name)) return [];
		const path = join(dir, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

const git = (...args) => {
	try {
		return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
	} catch {
		return '';
	}
};
const inRepo = existsSync(join(root, '.git'));

const files = staged
	? git('diff', '--cached', '--name-only', '--diff-filter=ACMR')
			.split('\n')
			.filter(Boolean)
			.map((name) => join(root, name))
			.filter(existsSync)
	: walk(root);

// ---------- 1. Private terms ----------
const termsFile = process.env.HUB_PRIVATE_TERMS ?? join(homedir(), '.config/delfost-hub/private-terms.txt');
if (existsSync(termsFile)) {
	const terms = readFileSync(termsFile, 'utf8')
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line, i) => ({
			// Reports name a term by its line position, never by its text: logs can be public.
			label: `private term ${i + 1}`,
			soft: line.startsWith('?'),
			needle: line.replace(/^\?/, '').trim().toLowerCase(),
		}))
		.filter((term) => term.needle);

	// The GitHub account is public on purpose (site.config.mjs), so its own name is not held against a
	// file: a private term that happens to sit inside it is still found wherever it appears outside it.
	const publicNames = [site.github.owner].filter(Boolean).map((name) => name.toLowerCase());
	const scan = (where, text) => {
		let haystack = text.toLowerCase();
		for (const name of publicNames) haystack = haystack.split(name).join(' ');
		for (const term of terms) {
			if (haystack.includes(term.needle)) (term.soft ? warnings : errors).push(`${where}: contains ${term.label}`);
		}
	};

	for (const file of files) {
		scan(`${rel(file)} (file name)`, rel(file));
		// latin1 keeps every byte, so text hidden inside binary files is found too.
		scan(rel(file), readFileSync(file, 'latin1'));
	}

	if (inRepo) {
		scan('git identity (user.name)', git('config', 'user.name'));
		scan('git identity (user.email)', git('config', 'user.email'));
		if (!staged) scan('git history (authors, committers, messages)', git('log', '--all', '--format=%an %ae %cn %ce %B'));
	}
	console.log(`private terms: checked ${files.length} files against ${terms.length} terms`);
} else {
	console.log(`private terms: SKIPPED, no list at ${termsFile}`);
}

if (inRepo && !git('config', 'user.name').trim()) {
	warnings.push('git identity: user.name is not set for this repository (run: git config user.name DelfosT)');
}

// ---------- 2. Image metadata ----------
for (const file of files.filter((f) => IMAGE.test(f))) {
	const meta = await sharp(file).metadata();
	const found = ['exif', 'xmp', 'iptc'].filter((key) => meta[key]);
	if (found.length) errors.push(`${rel(file)}: carries ${found.join(', ')} metadata (re-export it, or run it through sharp)`);
}

if (!staged) {
	// ---------- 3. Built pages ----------
	const dist = join(root, 'dist');
	if (!existsSync(dist)) {
		errors.push('dist/ is missing: run `pnpm build` first');
	} else {
		const built = walk(dist);
		const allowed = new Set([new URL(site.url).host]);
		if (site.analytics.umami.websiteId) allowed.add(new URL(site.analytics.umami.script).host);

		for (const file of built.filter((f) => f.endsWith('.html'))) {
			const html = readFileSync(file, 'utf8');
			const name = rel(file);
			if (!/http-equiv="content-security-policy"/i.test(html)) errors.push(`${name}: no Content Security Policy`);
			if (/<[^>]+\sstyle=/i.test(html)) errors.push(`${name}: has a style attribute, which the policy blocks`);
			if (/<[^>]+\son[a-z]+=/i.test(html)) errors.push(`${name}: has an inline event handler, which the policy blocks`);
			if (/target="_blank"(?![^>]*rel="[^"]*noopener)/i.test(html)) errors.push(`${name}: a new-tab link lacks rel="noopener"`);
			// Source links exist only while an account is set (see site.config.mjs).
			if (!site.github.owner && /(?:github|gitlab|bitbucket|codeberg)\.(?:com|org)/i.test(html)) {
				errors.push(`${name}: links to a code-hosting site although no GitHub account is set`);
			}
			// Anything the browser fetches on its own must come from this site.
			for (const [, url] of html.matchAll(/<(?:script|img|source|iframe|link(?=[^>]*rel="(?:stylesheet|preload|icon|apple-touch-icon)"))[^>]*?(?:src|href)="(https?:\/\/[^"]+)"/gi)) {
				if (!allowed.has(new URL(url).host)) errors.push(`${name}: loads ${url} from another site`);
			}
		}
		const headers = existsSync(join(dist, '_headers')) ? readFileSync(join(dist, '_headers'), 'utf8') : '';
		if (!headers) errors.push('dist/_headers is missing: security headers would not be sent');
		else if (!/Content-Security-Policy:.*default-src 'none'.*script-src/.test(headers)) {
			errors.push('dist/_headers: the full policy was not written (build with `pnpm build`, which runs scripts/write-headers.mjs)');
		}

		// ---------- 4. Weight ----------
		const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
		const sum = (list) => list.reduce((total, f) => total + statSync(f).size, 0);
		const home = readFileSync(join(dist, 'index.html'));
		const homeGzip = gzipSync(home).length;
		const scripts = built.filter((f) => /\.m?js$/.test(f));
		const fonts = built.filter((f) => f.endsWith('.woff2'));
		console.log(`weight: home page ${kb(home.length)} (${kb(homeGzip)} compressed), scripts ${kb(sum(scripts))}, fonts ${kb(sum(fonts))} in ${fonts.length} files`);
		if (homeGzip > 30 * 1024) warnings.push(`home page is ${kb(homeGzip)} compressed, over the 30 kB budget`);
		if (sum(scripts) > 15 * 1024) warnings.push(`scripts total ${kb(sum(scripts))}, over the 15 kB budget`);
	}
}

for (const warning of warnings) console.warn(`warning  ${warning}`);
for (const error of errors) console.error(`ERROR    ${error}`);
console.log(errors.length ? `\n${errors.length} problem(s) found.` : '\nAll checks passed.');
process.exit(errors.length ? 1 : 0);
