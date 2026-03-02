/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        'cyan-neon': '#00f2ff',
        'purple-deep': '#240046',
        'neon-green': '#CCFF00',
        'purple-mid': '#3d0066',
        'purple-light': '#6600aa',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'Inter', 'sans-serif'],
        sans: ['Rajdhani', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 242, 255, 0.5), 0 0 20px rgba(0, 242, 255, 0.3)',
        'neon-sm': '0 0 5px rgba(0, 242, 255, 0.4), 0 0 10px rgba(0, 242, 255, 0.2)',
        'neon-lg': '0 0 20px rgba(0, 242, 255, 0.6), 0 0 40px rgba(0, 242, 255, 0.3), 0 0 80px rgba(0, 242, 255, 0.1)',
        'purple-glow': '0 0 20px rgba(36, 0, 70, 0.8), 0 0 40px rgba(36, 0, 70, 0.4)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0, 242, 255, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
}
