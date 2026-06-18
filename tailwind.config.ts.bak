import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Habilita el modo oscuro basado en clases
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      colors: {
        dark: {
          100: '#121212', // Define tus colores para modo oscuro
          200: '#1a1a1a', // Agrega más colores según sea necesario
          // Agrega más colores según sea necesario
        },
        "baseGray": "#686868",
        "baseGreen": "#32D583",
        'baseBlack': 'rgba(0, 0, 0, 0.9)',
        "baseBlue": "#037db8",
        "baseAlert": "#ff464a"
      },
      screens: {
        'mdsm': '768px', //  breakpoint personalizado
      },
      boxShadow: {
        white: '0 4px .5px rgba(255, 255, 255, 0.9)',
      },
    },
  },
  plugins: [],
};
export default config;
