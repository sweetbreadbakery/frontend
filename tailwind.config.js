const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './index.html',
      './resources/**/*.{html,svg,vue,js}',
    ],
  },
  darkMode: 'media',
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        sans: '"Pixelated MS Sans Serif", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      screens: {
        'xs': '375px',
        ...defaultTheme.screens,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
