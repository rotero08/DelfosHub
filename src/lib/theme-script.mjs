import { createHash } from 'node:crypto';

// Runs inline in <head> before the first paint so a saved light theme never flashes dark.
// It is the only inline script on the site; astro.config.mjs allows it in the Content
// Security Policy by hash, so editing this string keeps the policy in step automatically.
export const themeScript =
	'try{document.documentElement.dataset.theme=localStorage.getItem("theme")==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}';

export const themeScriptHash = `sha256-${createHash('sha256').update(themeScript).digest('base64')}`;
