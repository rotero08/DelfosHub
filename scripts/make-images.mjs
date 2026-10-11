// Regenerates the images in public/ that are derived from something else:
//
//   og.png                the social preview card, from scripts/og/template.html
//   favicon-32.png        from public/favicon.svg
//   apple-touch-icon.png  from public/favicon.svg
//
// Run it with `pnpm images` after changing the favicon, the colours or the name. The card
// needs a Chromium-family browser on this machine; set CHROME_PATH if it is not found.
// Every file is re-encoded by sharp, which drops all metadata.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = (name) => join(root, 'public', name);

// Icons
const icon = join(root, 'public/favicon.svg');
await sharp(icon, { density: 300 }).resize(32, 32).png().toFile(out('favicon-32.png'));
await sharp(icon, { density: 600 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
console.log('icons written');

// Social card
const browser = [
	process.env.CHROME_PATH,
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
	'/usr/bin/google-chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/brave-browser',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((path) => path && existsSync(path));

if (!browser) {
	console.warn('No Chromium-family browser found: og.png was left as it is. Set CHROME_PATH to regenerate it.');
	process.exit(0);
}

const chrome = await puppeteer.launch({ executablePath: browser, headless: true });
try {
	const page = await chrome.newPage();
	await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
	await page.goto(new URL('./og/template.html', import.meta.url).href, { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);
	const shot = await page.screenshot({ type: 'png' });
	await sharp(shot).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out('og.png'));
	console.log('og.png written');
} finally {
	await chrome.close();
}
