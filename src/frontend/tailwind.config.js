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
        'cyber-purple': '#240046',
        'neon-cyan': '#00f2ff',
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
          50: 'oklch(0.97 0.03 200)',
          100: 'oklch(0.94 0.06 200)',
          200: 'oklch(0.88 0.1 200)',
          300: 'oklch(0.88 0.17 200)',
          400: 'oklch(0.83 0.17 200)',
          500: 'oklch(0.78 0.17 200)',
          600: 'oklch(0.7 0.15 200)',
          700: 'oklch(0.6 0.12 200)',
          800: 'oklch(0.45 0.1 200)',
          900: 'oklch(0.3 0.07 200)',
        },
        // Keep indigo as alias pointing to neon-cyan for backward compat
        indigo: {
          DEFAULT: 'oklch(0.88 0.17 200)',
          50: 'oklch(0.97 0.03 200)',
          100: 'oklch(0.94 0.06 200)',
          200: 'oklch(0.88 0.1 200)',
          300: 'oklch(0.88 0.17 200)',
          400: 'oklch(0.83 0.17 200)',
          500: 'oklch(0.78 0.17 200)',
          600: 'oklch(0.7 0.15 200)',
          700: 'oklch(0.6 0.12 200)',
          800: 'oklch(0.45 0.1 200)',
          900: 'oklch(0.3 0.07 200)',
        },
        cyber: {
          purple: '#240046',
          dark: '#0b0e14',
          cyan: '#00f2ff',
          'purple-light': 'oklch(0.3 0.15 290)',
          'purple-mid': 'oklch(0.2 0.12 290)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        success: 'oklch(var(--success))',
        warning: 'oklch(var(--warning))',
        'white-5': 'rgba(255,255,255,0.05)',
        'white-8': 'rgba(255,255,255,0.08)',
        'white-10': 'rgba(255,255,255,0.10)',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
        sora: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
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
        // Neon cyan glows
        neon: '0 0 20px oklch(0.88 0.17 200 / 0.4), 0 0 40px oklch(0.88 0.17 200 / 0.15)',
        'neon-sm': '0 0 10px oklch(0.88 0.17 200 / 0.3), 0 0 20px oklch(0.88 0.17 200 / 0.1)',
        'neon-lg': '0 0 30px oklch(0.88 0.17 200 / 0.5), 0 0 60px oklch(0.88 0.17 200 / 0.2)',
        // Legacy alias
        indigo: '0 0 20px oklch(0.88 0.17 200 / 0.4), 0 0 40px oklch(0.88 0.17 200 / 0.15)',
        'indigo-sm': '0 0 10px oklch(0.88 0.17 200 / 0.3), 0 0 20px oklch(0.88 0.17 200 / 0.1)',
        'cyber-purple': '0 0 20px oklch(0.3 0.15 290 / 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-glow': 'radial-gradient(ellipse at top, oklch(0.88 0.17 200 / 0.12) 0%, transparent 60%)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(36,0,70,0.8) 0%, rgba(11,14,20,0.95) 100%)',
        'indigo-glow': 'radial-gradient(ellipse at top, oklch(0.88 0.17 200 / 0.12) 0%, transparent 60%)',
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
          '0%, 100%': { boxShadow: '0 0 10px oklch(0.88 0.17 200 / 0.3)' },
          '50%': { boxShadow: '0 0 30px oklch(0.88 0.17 200 / 0.7)' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.6' },
        },
        'cyber-scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 3s linear infinite',
        'cyber-scan': 'cyber-scan 4s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
