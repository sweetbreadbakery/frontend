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
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
