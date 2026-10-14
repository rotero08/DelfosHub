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

	// The GitHub account that hosts the code. Content names only a repository (`repo:` in
	// projects.yaml and minis.yaml) and the "Source" links are built from this account and that
	// name. The account is public on purpose (the owner chose to show it); the other private
	// terms still apply, and `pnpm check` does not hold the account's own name against a file.
	// Leave it empty to build a site with no link to a code-hosting site at all.
	github: {
		owner: 'rotero08',
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
