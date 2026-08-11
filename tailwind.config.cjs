/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

// Shared component classes referenced via `@apply` in multiple CSS entry files
// (e.g. main.css defines `.link`, while markdown.css does `@apply link`).
// Tailwind resolves cross-file `@apply` against registered custom classes, and
// registration depends on file processing order. Because Vite may process the
// CSS entries in ANY order, such references fail nondeterministically in CI.
// Moving these definitions into the config registers them before any file is
// processed, making `@apply` order-independent. They must NOT nest `@apply`
// (Tailwind rejects applying a component class from another component rule).
const sharedComponentsPlugin = function ({ addComponents }) {
	const expandAnimation = {
		position: "relative",
		zIndex: 0,
		"&:active": { backgroundImage: "none" },
		"&::before": {
			position: "absolute",
			inset: 0,
			borderRadius: "inherit",
			transform: "scale(0.85)",
			zIndex: -10,
			transitionProperty:
				"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
			transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		"&:hover::before": { transform: "scale(1)", backgroundColor: "var(--btn-plain-bg-hover)" },
		"&:active::before": { backgroundColor: "var(--btn-plain-bg-active)" },
	};
	const linkBase = {
		...expandAnimation,
		margin: "-0.25rem",
		padding: "0.25rem",
		borderRadius: "0.375rem",
		transitionDuration: "150ms",
	};
	addComponents({
		".expand-animation": expandAnimation,
		".link": linkBase,
		".link-lg": { ...linkBase, margin: "-0.375rem", padding: "0.375rem" },
		".btn-regular-dark": {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "oklch(0.45 0.01 var(--hue))",
			"&:hover": { backgroundColor: "oklch(0.50 0.01 var(--hue))" },
			"&:active": { backgroundColor: "oklch(0.55 0.01 var(--hue))" },
			".dark &": { backgroundColor: "oklch(0.30 0.02 var(--hue))" },
			".dark &:hover": { backgroundColor: "oklch(0.35 0.03 var(--hue))" },
			".dark &:active": { backgroundColor: "oklch(0.40 0.03 var(--hue))" },
			"&.success": { backgroundColor: "oklch(0.75 0.14 var(--hue))" },
			".dark &.success": { backgroundColor: "oklch(0.75 0.14 var(--hue))" },
		},
	});
};

module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
	darkMode: "class", // allows toggling dark mode manually
	theme: {
		extend: {
			screens: {
				"1.5xl": "1500px",
			},
			fontFamily: {
				sans: ["LXGWWenKai", "sans-serif", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), sharedComponentsPlugin],
};
