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
          '400': '#FED457',
          '500': '#FBBF24',
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
        sans: '"Pixelated MS Sans Serif", "Arial Narrow", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        mono: 'DOS, Monaco, Menlo, Consolas, "Courier New", monospace',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: [
            {
              color: theme('colors.black'),
              '[class~="lead"]': {
                color: theme('colors.black'),
              },
              a: {
                color: theme('colors.blue.500'),
              },
              strong: {
                color: theme('colors.black'),
              },
              'ol > li::before': {
                color: theme('colors.gray.400'),
              },
              'ul > li::before': {
                backgroundColor: theme('colors.gray.300'),
              },
              hr: {
                borderColor: theme('colors.gray.100'),
              },
              blockquote: {
                color: theme('colors.black'),
                borderLeftColor: theme('colors.gray.100'),
              },
              h1: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.yellow.400'),
              },
              h2: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.yellow.400'),
              },
              h3: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.blue.500'),
              },
              h4: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.blue.500'),
              },
              'figure figcaption': {
                color: theme('colors.black'),
              },
              code: {
                color: theme('colors.black'),
              },
              'a code': {
                color: theme('colors.blue.500'),
              },
              pre: {
                color: theme('colors.gray.100'),
                backgroundColor: theme('colors.gray.800'),
              },
              thead: {
                color: theme('colors.black'),
                borderBottomColor: theme('colors.gray.200'),
              },
              'tbody tr': {
                borderBottomColor: theme('colors.gray.100'),
              },
            },
          ],
        },
        white: {
          css: [
            {
              color: theme('colors.white'),
              '[class~="lead"]': {
                color: theme('colors.white'),
              },
              a: {
                color: theme('colors.white'),
              },
              strong: {
                color: theme('colors.white'),
              },
              'ol > li::before': {
                color: theme('colors.white'),
              },
              'ul > li::before': {
                backgroundColor: theme('colors.white'),
              },
              hr: {
                borderColor: theme('colors.white'),
              },
              blockquote: {
                color: theme('colors.white'),
                borderLeftColor: theme('colors.white'),
              },
              h1: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.white'),
              },
              h2: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.white'),
              },
              h3: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.white'),
              },
              h4: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.white'),
              },
              'figure figcaption': {
                color: theme('colors.white'),
              },
              code: {
                color: theme('colors.white'),
              },
              'a code': {
                color: theme('colors.white'),
              },
              pre: {
                color: theme('colors.white'),
              },
              thead: {
                color: theme('colors.white'),
                borderBottomColor: theme('colors.white'),
              },
              'tbody tr': {
                borderBottomColor: theme('colors.white'),
              },
            },
          ],
        },
      }),
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
