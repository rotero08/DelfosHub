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

	// Analytics: Umami Cloud, which counts page views and clicks without cookies and without
	// following anyone around. `websiteId` is the ID from the Umami dashboard (Websites, the
	// site, Edit). Empty it and the page carries no tracker and makes no request to anyone.
	// `script` and `host` are Umami Cloud's addresses: where the tracker comes from and where it
	// reports (the security policy allows exactly these two). The tracker is told to honour Do
	// Not Track.
	analytics: {
		umami: {
			websiteId: '386e6888-7d66-403d-89a6-d2242bbfbd22',
			script: 'https://cloud.umami.is/script.js',
			host: 'https://gateway.umami.is',
		},
	},
};
