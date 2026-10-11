// Runs after `astro build`. Astro writes a complete Content Security Policy into every page
// as a <meta> tag, with a hash for each inline script and style. A policy sent as a response
// header is stronger (it covers the whole document and is what security scanners read), so
// this copies the pages' policies into dist/_headers, the file Cloudflare turns into headers.
//
// Unknown addresses are answered with the 404 page under any path, so one policy has to fit
// every page: the header carries the union of what the pages allow. Each page keeps its own
// <meta> policy as well, and browsers enforce both, so a page is never allowed more than it
// declares for itself.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const headersFile = join(dist, '_headers');
// Cloudflare ignores header lines longer than 2,000 characters.
const LIMIT = 2000;

const walk = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
	);

/** "a 'x'; b 'y'" becomes Map { a => Set('x'), b => Set('y') }, merged into `into`. */
function collect(policy, into, { override = true } = {}) {
	for (const part of policy.split(';')) {
		const [name, ...sources] = part.trim().split(/\s+/);
		if (!name || (!override && into.has(name))) continue;
		const set = into.get(name) ?? new Set();
		for (const source of sources) set.add(source);
		into.set(name, set);
	}
}

const merged = new Map();
const pages = walk(dist).filter((file) => file.endsWith('.html'));
for (const page of pages) {
	const policy = readFileSync(page, 'utf8').match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
	if (!policy) throw new Error(`${page} has no Content Security Policy <meta>; is security.csp still on in astro.config.mjs?`);
	collect(policy.replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&'), merged);
}

// Keep the directives that only a header can carry (frame-ancestors and friends), which
// are written by hand in public/_headers.
const headers = readFileSync(headersFile, 'utf8');
const written = headers.match(/^[ \t]+Content-Security-Policy:[ \t]*(.*)$/m);
if (!written) throw new Error('public/_headers has no Content-Security-Policy line to extend.');
collect(written[1], merged, { override: false });

const line = [...merged]
	.map(([name, sources]) => {
		// 'none' only means something on its own.
		if (sources.size > 1) sources.delete("'none'");
		return [name, ...sources].join(' ');
	})
	.join('; ');

if (line.length + 'Content-Security-Policy: '.length > LIMIT) {
	throw new Error(`The combined policy is ${line.length} characters, over Cloudflare's ${LIMIT} per header line. Give the largest page its own rule in public/_headers.`);
}

writeFileSync(headersFile, headers.replace(written[0], `  Content-Security-Policy: ${line}`));
console.log(`_headers: policy for ${pages.length} pages written (${line.length} characters)`);
