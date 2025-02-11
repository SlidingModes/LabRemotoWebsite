/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: ['selector', '[data-theme="dark"]'],
	content: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {}
	},
	plugins: []
};
