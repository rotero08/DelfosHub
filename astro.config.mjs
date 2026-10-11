import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './site.config.mjs';
import { themeScriptHash } from './src/lib/theme-script.mjs';

// Fonts are files in src/assets/fonts, served by the site itself. Nothing is fetched from a
// font service, at build time or in the browser.
const localFonts = fontProviders.local();
const font = (file) => `./src/assets/fonts/${file}.woff2`;

// Analytics hosts are only allowed once analytics are switched on in site.config.mjs.
const beacon = Boolean(site.analytics.cloudflareBeaconToken);

export default defineConfig({
	site: site.url,
	output: 'static',
	trailingSlash: 'always',
	// One HTML request paints the page: the stylesheet is small enough to travel inside it.
	build: { inlineStylesheets: 'always' },
	devToolbar: { enabled: false },
	// No code blocks on this site, and the highlighter's inline styles would break the policy below.
	markdown: { syntaxHighlight: false },

	i18n: {
		locales: ['en', 'es'],
		defaultLocale: 'en',
		routing: { prefixDefaultLocale: false },
	},

	integrations: [
		sitemap({
			i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
			filter: (page) => !page.includes('/404'),
		}),
	],

	fonts: [
		{
			provider: localFonts,
			name: 'Barlow Condensed',
			cssVariable: '--font-display',
			fallbacks: ['Arial Narrow', 'sans-serif'],
			options: {
				variants: [
					{ weight: 800, style: 'italic', src: [font('barlow-condensed-latin-800-italic')] },
					{ weight: 600, style: 'normal', src: [font('barlow-condensed-latin-600-normal')] },
				],
			},
		},
		{
			provider: localFonts,
			name: 'Alegreya',
			cssVariable: '--font-body',
			fallbacks: ['Georgia', 'serif'],
			options: {
				variants: [
					{ weight: '400 900', style: 'normal', src: [font('alegreya-latin-wght-normal')] },
					{ weight: '400 900', style: 'italic', src: [font('alegreya-latin-wght-italic')] },
				],
			},
		},
	],

	security: {
		// Astro hashes every script and style it emits and writes the policy into each page.
		// Nothing is allowed by default; public/_headers adds the parts a <meta> cannot carry.
		csp: {
			directives: [
				"default-src 'none'",
				"img-src 'self' data:",
				"font-src 'self'",
				`connect-src 'self'${beacon ? ' https://cloudflareinsights.com' : ''}`,
				"manifest-src 'self'",
				"base-uri 'none'",
				"form-action 'none'",
			],
			scriptDirective: {
				hashes: [themeScriptHash],
				resources: ["'self'", ...(beacon ? ['https://static.cloudflareinsights.com'] : [])],
			},
		},
	},
});
