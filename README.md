<div align="center">

<img src="public/favicon.svg" width="72" height="72" alt="">

# DelfosT hub

**One place for everything DelfosT makes.**<br>
Projects, writing, small tools and a short About.

<a href="https://hub.delfost.workers.dev"><img src="public/og.png" width="720" alt="The hub: the name DelfosT in large letters over a night sky, with a signpost in front of the moon"></a>

</div>

## What it is

The home page of DelfosT, a pen name, live at [hub.delfost.workers.dev](https://hub.delfost.workers.dev). It links to the two main sites (a blog about Japan and Japanese, and a piano guide), shows the latest notes from the blogs, lists the smaller projects, and keeps a brief page of experience and an About. It is in English and Spanish, light and dark, with no cookies.

## Run it yourself

```sh
corepack pnpm install
corepack pnpm dev
```

Everything a visitor reads lives in `content/`. `corepack pnpm check` builds the site and runs the safety checks before it is published.

The site is built with [Astro](https://astro.build) and hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## License

The code is [MIT](LICENSE).
