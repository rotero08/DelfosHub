// Interface text in both languages. Content (projects, posts, experience, about) lives in
// content/; this file only holds the fixed words of the page itself.

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Text = Record<Locale, string>;

/** The five sections, in page order. `id` is the anchor and never changes with language. */
export const sections = ['projects', 'writing', 'minis', 'experience', 'about'] as const;
export type Section = (typeof sections)[number];

export const ui = {
	en: {
		title: 'DelfosT · Code, writing and learning in public',
		description:
			'The home of everything DelfosT makes: a blog about Japan and Japanese, a self-study piano guide, mini projects and experience.',
		skip: 'Skip to content',
		home: 'DelfosT, back to the top',
		menu: 'Menu',
		close: 'Close',
		sectionsLabel: 'Sections',
		indexLabel: 'Index of this page',
		eyebrow: 'Personal hub',
		tagline: 'Code, writing and learning in public.',
		intro:
			'Home base for everything I make: a blog about Japan and Japanese, a piano guide for self-taught players, and the smaller experiments in between.',
		nav: {
			projects: 'Projects',
			writing: 'Writing',
			minis: 'Mini projects',
			experience: 'Experience',
			about: 'About',
		},
		navShort: { minis: 'Mini' },
		hint: {
			projects: 'Main quests. Each one is its own site.',
			writing: 'The latest notes from the blogs.',
			minis: 'Side quests. Small tools and experiments.',
			experience: 'The short version.',
			about: 'Who is behind the name.',
		},
		visit: 'Visit site',
		writtenIn: { en: 'in English', es: 'in Spanish', ja: 'in Japanese' },
		langName: { en: 'English', es: 'Spanish', ja: 'Japanese' },
		moreOn: 'More on',
		open: 'Open',
		source: 'Source',
		focus: 'Focus',
		timeline: 'Path',
		skills: 'Skills',
		languages: 'Languages',
		contact: 'Contact',
		themeSwitch: 'Light theme',
		otherLang: 'Español',
		otherLangLabel: 'Leer en español',
		toTop: 'Back to top',
		privacyOff: 'No cookies. No trackers.',
		privacyOn: 'No cookies. Visits and clicks are counted anonymously.',
		colophon: 'Built by hand.',
	},
	es: {
		title: 'DelfosT · Código, escritura y aprendizaje en público',
		description:
			'La casa de todo lo que hace DelfosT: un blog sobre Japón y el japonés, una guía de piano para autodidactas, mini proyectos y experiencia.',
		skip: 'Saltar al contenido',
		home: 'DelfosT, volver arriba',
		menu: 'Menú',
		close: 'Cerrar',
		sectionsLabel: 'Secciones',
		indexLabel: 'Índice de esta página',
		eyebrow: 'Hub personal',
		tagline: 'Código, escritura y aprendizaje en público.',
		intro:
			'La base de todo lo que hago: un blog sobre Japón y el japonés, una guía de piano para autodidactas y los experimentos pequeños que salen por el camino.',
		nav: {
			projects: 'Proyectos',
			writing: 'Escritos',
			minis: 'Mini proyectos',
			experience: 'Experiencia',
			about: 'Sobre mí',
		},
		navShort: { minis: 'Mini' },
		hint: {
			projects: 'Misiones principales. Cada una es su propio sitio.',
			writing: 'Las últimas notas de los blogs.',
			minis: 'Misiones secundarias. Herramientas y experimentos pequeños.',
			experience: 'La versión corta.',
			about: 'Quién está detrás del nombre.',
		},
		visit: 'Visitar sitio',
		writtenIn: { en: 'en inglés', es: 'en español', ja: 'en japonés' },
		langName: { en: 'inglés', es: 'español', ja: 'japonés' },
		moreOn: 'Más en',
		open: 'Abrir',
		source: 'Código',
		focus: 'Enfoque',
		timeline: 'Camino',
		skills: 'Habilidades',
		languages: 'Idiomas',
		contact: 'Contacto',
		themeSwitch: 'Tema claro',
		otherLang: 'English',
		otherLangLabel: 'Read in English',
		toTop: 'Volver arriba',
		privacyOff: 'Sin cookies. Sin rastreadores.',
		privacyOn: 'Sin cookies. Las visitas y los clics se cuentan de forma anónima.',
		colophon: 'Hecho a mano.',
	},
} as const;

/** Address of the home page in a language. */
export const homeOf = (lang: Locale) => (lang === 'en' ? '/' : `/${lang}/`);

/** "08 Oct 2026" / "08 oct 2026". Dates are calendar days, so they are read as UTC. */
export function formatDate(date: Date, lang: Locale) {
	return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	})
		.format(date)
		.replace(/\./g, '');
}
