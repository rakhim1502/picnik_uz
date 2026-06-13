/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#2C5530",
                    sand: "#F4F1EA",
                    dark: "#1A1A1A",
                    accent: "#E85D04",
                }
            }
        },
    },
    plugins: [],
}