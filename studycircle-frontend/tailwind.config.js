// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Ajuste os caminhos conforme a estrutura do seu projeto
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Se você tiver a pasta pages, adicione essa linha.
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}