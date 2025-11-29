import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          fg: '#c9d1d9',
          green: '#3fb950',
          cyan: '#58d6ff',
          blue: '#58a6ff',
          yellow: '#d29922',
          orange: '#ff7b72',
          purple: '#bc8cff',
          border: '#30363d',
          accent: '#1f6feb',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
