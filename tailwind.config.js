const colors = require('tailwindcss/colors');
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
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        blueGray: colors.blueGray,
        coolGray: colors.coolGray,
        gray: colors.gray,
        trueGray: colors.trueGray,
        warmGray: colors.warmGray,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: {
          '50':  '#FFFBEB',
          '100': '#FEF3C7',
          '200': '#FEEAA8',
          '300': '#FCD34D',
          '400': '#FBBF24',
          '500': '#FED457',
          '600': '#F4B14D',
          '700': '#B45309',
          '800': '#92400E',
          '900': '#78350F',
        },
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        lightBlue: colors.lightBlue,
        blue: {
          '50':  '#EFF6FF',
          '100': '#B3EBEF',
          '200': '#75B9E2',
          '300': '#5FBAE7',
          '400': '#60A5FA',
          '500': '#1C7BAC',
          '600': '#234883',
          '700': '#23427D',
          '800': '#08293C',
          '900': '#05202F',
        },
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
      },
      container: {
        center: true,
      },
      fontFamily: {
        heading: '"cp_fontregular", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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
