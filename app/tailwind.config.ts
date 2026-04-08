import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sapBlue: '#0A6ED1',
      },
    },
  },
  plugins: [],
}

export default config
