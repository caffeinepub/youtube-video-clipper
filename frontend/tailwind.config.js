/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0B0E14',
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(0.55 0.22 264)',
          foreground: 'oklch(0.98 0.005 264)',
          50: 'oklch(0.95 0.05 264)',
          100: 'oklch(0.9 0.08 264)',
          200: 'oklch(0.8 0.12 264)',
          300: 'oklch(0.7 0.16 264)',
          400: 'oklch(0.62 0.2 264)',
          500: 'oklch(0.55 0.22 264)',
          600: 'oklch(0.48 0.22 264)',
          700: 'oklch(0.4 0.2 264)',
          800: 'oklch(0.3 0.16 264)',
          900: 'oklch(0.2 0.1 264)',
        },
        indigo: {
          DEFAULT: 'oklch(0.55 0.22 264)',
          50: 'oklch(0.95 0.05 264)',
          100: 'oklch(0.9 0.08 264)',
          200: 'oklch(0.8 0.12 264)',
          300: 'oklch(0.7 0.16 264)',
          400: 'oklch(0.62 0.2 264)',
          500: 'oklch(0.55 0.22 264)',
          600: 'oklch(0.48 0.22 264)',
          700: 'oklch(0.4 0.2 264)',
          800: 'oklch(0.3 0.16 264)',
          900: 'oklch(0.2 0.1 264)',
        },
        secondary: {
          DEFAULT: 'oklch(0.18 0.02 264)',
          foreground: 'oklch(0.85 0.01 264)',
        },
        destructive: {
          DEFAULT: 'oklch(0.55 0.22 25)',
          foreground: 'oklch(0.98 0.005 25)',
        },
        muted: {
          DEFAULT: 'oklch(0.16 0.015 264)',
          foreground: 'oklch(0.55 0.02 264)',
        },
        accent: {
          DEFAULT: 'oklch(0.55 0.22 264)',
          foreground: 'oklch(0.98 0.005 264)',
        },
        popover: {
          DEFAULT: 'oklch(0.11 0.015 264)',
          foreground: 'oklch(0.95 0.01 264)',
        },
        card: {
          DEFAULT: 'oklch(0.12 0.015 264)',
          foreground: 'oklch(0.95 0.01 264)',
        },
        success: 'oklch(0.6 0.18 145)',
        warning: 'oklch(0.75 0.18 75)',
        'white-5': 'rgba(255,255,255,0.05)',
        'white-8': 'rgba(255,255,255,0.08)',
        'white-10': 'rgba(255,255,255,0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        indigo: '0 0 20px oklch(0.55 0.22 264 / 0.3)',
        'indigo-sm': '0 0 10px oklch(0.55 0.22 264 / 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'indigo-glow': 'radial-gradient(ellipse at top, oklch(0.55 0.22 264 / 0.15) 0%, transparent 60%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px oklch(0.55 0.22 264 / 0.2)' },
          '50%': { boxShadow: '0 0 25px oklch(0.55 0.22 264 / 0.5)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
