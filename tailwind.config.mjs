/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '2rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '3.5rem',
			'7xl': '4.5rem',
			'8xl': '6rem',
			'9xl': '7.5rem',
		},
		extend: {
			fontFamily: {
				'serif': ['Cormorant', ...defaultTheme.fontFamily.serif],
				'sans': ['Inter', ...defaultTheme.fontFamily.sans],
			},
			maxWidth: {
				'8xl': '1312px',
      },
      screens: {
        '8xl': '1312px',
			}
		},
	},
	plugins: [],
}
