module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './index.html',
      './resources/**/*.{html,svg,vue,js}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
