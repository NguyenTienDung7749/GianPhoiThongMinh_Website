/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        lava: {
          red: '#ff2200',
          orange: '#ff5500',
          yellow: '#ffae00',
        },
        hell: {
          black: '#0a0a0a',
          blood: '#1a0000',
        }
      },
      boxShadow: {
        'lava': '0 0 20px rgba(255, 34, 0, 0.5)',
        'fire': '0 0 30px rgba(255, 85, 0, 0.6)',
        'lava-lg': '0 0 40px rgba(255, 34, 0, 0.7)',
      },
      animation: {
        'pulse-lava': 'pulse-lava 2s ease-in-out infinite',
        'flicker': 'flicker 0.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-lava': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 34, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 85, 0, 0.8)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow': {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 34, 0, 0.8)' },
          '50%': { textShadow: '0 0 20px rgba(255, 85, 0, 1)' },
        },
      },
      backgroundImage: {
        'hell-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        'lava-gradient': 'linear-gradient(180deg, #ff2200 0%, #ff5500 50%, #ffae00 100%)',
      }
    },
  },
  plugins: [],
}
