import type { APIRoute } from 'astro';

// Generated so the sitemap address always follows `url` in site.config.mjs.
export const GET: APIRoute = ({ site }) =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
