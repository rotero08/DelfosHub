// Site-wide settings. Everything a visitor reads lives in content/; this file only holds
// the handful of switches that are not content.
export default {
	// The only name that ever appears on the site.
	name: 'DelfosT',

	// Public address of the hub. Canonical URLs, the sitemap and the social preview are built
	// from it. It is the workers.dev address of the Worker named in wrangler.jsonc; change it
	// when the hub gets its own domain.
	url: 'https://hub.delfost.workers.dev',

	// How many entries the Writing section shows.
	writingLimit: 6,

	// Links to the source code of projects. Content names only the repository (`repo:` in
	// projects.yaml and minis.yaml); the account is never written in this repository, because a
	// code-hosting account can reveal more than the pseudonym does. A build shows the links only
	// when the environment variable HUB_GITHUB_OWNER is set: in the build settings on Cloudflare
	// to publish them, or in the shell for a local look. Unset, no link to a code-hosting site
	// exists anywhere in the output, and `pnpm check` verifies that.
	github: {
		owner: process.env.HUB_GITHUB_OWNER ?? '',
	},

	// Both stay empty until the Cloudflare stage. While they are empty the site ships no
	// analytics code at all.
	analytics: {
		// Path of the endpoint that receives click events, for example '/e'.
		clickEndpoint: '',
		// Token of the Cloudflare Web Analytics beacon (page views, referrers, Web Vitals).
		cloudflareBeaconToken: '',
	},
};
