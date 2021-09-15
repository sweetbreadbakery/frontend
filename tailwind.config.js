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
        lighten: {
          '50':  'rgba(255,255,255,0.05)',
          '100': 'rgba(255,255,255,0.10)',
          '200': 'rgba(255,255,255,0.20)',
          '300': 'rgba(255,255,255,0.30)',
          '400': 'rgba(255,255,255,0.40)',
          '500': 'rgba(255,255,255,0.50)',
          '600': 'rgba(255,255,255,0.60)',
          '700': 'rgba(255,255,255,0.70)',
          '800': 'rgba(255,255,255,0.80)',
          '900': 'rgba(255,255,255,0.90)',
        },
        darken: {
          '50':  'rgba(0,0,0,0.05)',
          '100': 'rgba(0,0,0,0.10)',
          '200': 'rgba(0,0,0,0.20)',
          '300': 'rgba(0,0,0,0.30)',
          '400': 'rgba(0,0,0,0.40)',
          '500': 'rgba(0,0,0,0.50)',
          '600': 'rgba(0,0,0,0.60)',
          '700': 'rgba(0,0,0,0.70)',
          '800': 'rgba(0,0,0,0.80)',
          '900': 'rgba(0,0,0,0.90)',
        },
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
        teal: {
          '50': '#d5f4f6',
          '100': '#bceef1',
          '200': '#b8edf0',
          '300': '#b4ecef',
          '400': '#68d9df',
          '500': '#29bac1',
          '600': '#21969c',
          '700': '#1b797e',
          '800': '#155d61',
          '900': '#0d3d3f',
        },
        cyan: colors.cyan,
        sky: colors.sky,
        blue: {
          "50": "#d8eef9",
          "100": "#bde2f4",
          "200": "#8dcdec",
          "300": "#58b5e4",
          "400": "#28a0dc",
          "500": "#1c7bab",
          "600": "#17658c",
          "700": "#124f6e",
          "800": "#0c364b",
          "900": "#07202c",
        },
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
        brown: {
          '50': '#928885',
          '100': '#776e6c',
          '200': '#706765',
          '300': '#675f5c',
          '400': '#5d5755',
          '500': '#494240',
          '600': '#403a38',
          '700': '#322d2b',
          '800': '#2b2726',
          '900': '#1d191a',
        },
      },
      container: {
        center: true,
      },
      fontFamily: {
        heading: '"cp_fontregular", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        sans: '"Pixelated MS Sans Serif", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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
                color: theme('colors.yellow.400'),
              },
              h2: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.yellow.400'),
              },
              h3: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.yellow.400'),
              },
              h4: {
                fontFamily: theme('fontFamily.heading'),
                color: theme('colors.yellow.400'),
              },
              'figure figcaption': {
                color: theme('colors.white'),
              },
              code: {
                margin: '0 .4em',
                padding: '.2em .4em',
                fontSize: '85%',
                wordWrap: 'break-word',
                backgroundColor: theme('colors.gray.800'),
                borderRadius: '6px',
                color: theme('colors.white'),
              },
              'a code': {
                color: theme('colors.white'),
              },
              'pre > code': {
                margin: '0',
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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
