// Site-wide settings. Everything a visitor reads lives in content/; this file only holds
// the handful of switches that are not content.
export default {
	// The only name that ever appears on the site.
	name: 'DelfosT',

	// Public address of the hub. Canonical URLs, the sitemap and the social preview are built
	// from it. This is a placeholder until the domain exists: change it before the first deploy.
	url: 'https://hub.delfost.workers.dev',

	// How many entries the Writing section shows.
	writingLimit: 6,

	privacy: {
		// Mini projects can carry a `repo:` address in content/minis.yaml. While this is false
		// those addresses are never rendered, because a code-hosting profile can reveal more
		// than the pseudonym does. Turn it on once the profile behind them is safe to show.
		showRepoLinks: false,
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
