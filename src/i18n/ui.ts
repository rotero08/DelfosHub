// Interface text in both languages. Content (projects, posts, experience, about) lives in
// content/; this file only holds the fixed words of the page itself.

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export type Text = Record<Locale, string>;

/** The five sections, in page order. `id` is the anchor and never changes with language. */
export const sections = ['projects', 'writing', 'minis', 'experience', 'about'] as const;
export type Section = (typeof sections)[number];

/** How deep each section sits, in metres: the page is a descent, the hero is the surface. */
export const depths: Record<Section, number> = { projects: 300, writing: 900, minis: 1700, experience: 2600, about: 3800 };
/** The depth of the very bottom of the page. */
export const bottom = 4200;

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
			writing: 'Field notes from the road: the latest from the blogs.',
			minis: 'Small spells. Tools and experiments that fit in one hand.',
			experience: 'The short version.',
			about: 'Who is behind the name.',
		},
		layer: 'Layer',
		layerNames: { projects: 'The Rim', writing: 'The Canopy', minis: 'The Hollows', experience: 'The Deep Road', about: 'The Heart' },
		depth: 'Depth',
		keys: { move: 'Move', open: 'Open', jump: 'Jump' },
		quest: 'Main quest',
		spell: 'Small spell',
		card: 'Guild card',
		rank: 'Level {n} of 5',
		visit: 'Visit site',
		writtenIn: { en: 'in English', es: 'in Spanish', ja: 'in Japanese' },
		langName: { en: 'English', es: 'Spanish', ja: 'Japanese' },
		moreOn: 'More on',
		open: 'Open',
		source: 'Source',
		focus: 'Focus',
		timeline: 'The road so far',
		skills: 'Skills',
		languages: 'Languages',
		contact: 'Contact',
		themeSwitch: 'Light theme',
		otherLang: 'Español',
		otherLangLabel: 'Leer en español',
		toTop: 'Back to the surface',
		curse: 'The curse of the ascent does not apply here.',
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
			writing: 'Notas de viaje: lo último de los blogs.',
			minis: 'Hechizos pequeños. Herramientas y experimentos que caben en una mano.',
			experience: 'La versión corta.',
			about: 'Quién está detrás del nombre.',
		},
		layer: 'Capa',
		layerNames: { projects: 'El Borde', writing: 'El Dosel', minis: 'Las Cavidades', experience: 'El Camino Hondo', about: 'El Corazón' },
		depth: 'Profundidad',
		keys: { move: 'Mover', open: 'Abrir', jump: 'Saltar' },
		quest: 'Misión principal',
		spell: 'Hechizo pequeño',
		card: 'Tarjeta de gremio',
		rank: 'Nivel {n} de 5',
		visit: 'Visitar sitio',
		writtenIn: { en: 'en inglés', es: 'en español', ja: 'en japonés' },
		langName: { en: 'inglés', es: 'español', ja: 'japonés' },
		moreOn: 'Más en',
		open: 'Abrir',
		source: 'Código',
		focus: 'Enfoque',
		timeline: 'El camino hasta ahora',
		skills: 'Habilidades',
		languages: 'Idiomas',
		contact: 'Contacto',
		themeSwitch: 'Tema claro',
		otherLang: 'English',
		otherLangLabel: 'Read in English',
		toTop: 'Volver a la superficie',
		curse: 'Aquí no rige la maldición del ascenso.',
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
