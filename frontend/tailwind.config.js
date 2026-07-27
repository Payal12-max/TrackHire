export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      colors: {
        paper: '#EAEBE3',
        ink: '#20242B',
        inkSoft: '#63697A',
        card: '#FFFFFF',
        line: '#D6D4C6',
        teal: {
          DEFAULT: '#0F6E56',
          light: '#DCEBE4'
        },
        amber: {
          DEFAULT: '#B0791F',
          light: '#F1E4C7'
        },
        rust: {
          DEFAULT: '#A33F2B',
          light: '#F1DCD4'
        },
        board: {
          navy: '#131C26',
          navySoft: '#1B2733',
          amber: '#F2B237'
        }
      }
    }
  },
  plugins: []
};
