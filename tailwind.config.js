/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "royal-plum": "var(--royal-plum)",
        "mustard-yellow": "var(--mustard-yellow)",
        "lavender": "var(--lavender)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        'sans': ['var(--font-nunito)', 'var(--font-inter)', 'var(--font-poppins)', 'var(--font-open-sans)', 'var(--font-lato)', 'var(--font-geist)', 'Arial', 'sans-serif'],
        'mono': ['var(--font-geist-mono)', 'monospace'],
        'nunito': ['var(--font-nunito)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'open-sans': ['var(--font-open-sans)', 'sans-serif'],
        'lato': ['var(--font-lato)', 'sans-serif'],
        'geist': ['var(--font-geist)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
