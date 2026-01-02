/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f0f23',
                'neon-purple': '#9933FF',
                'neon-blue': '#00CCDD',
                'neon-gold': '#FFD700',
                'neon-orange': '#FF6633',
                'neon-pink': '#FF00FF',
            },
            boxShadow: {
                // Thinner shadows for mobile clarity
                'neon-purple': '0 0 5px rgba(153, 51, 255, 0.5), 0 0 15px rgba(153, 51, 255, 0.3)',
                'neon-blue': '0 0 5px rgba(0, 204, 221, 0.5), 0 0 15px rgba(0, 204, 221, 0.3)',
                'neon-gold': '0 0 5px rgba(255, 215, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.3)',
                'neon-orange': '0 0 5px rgba(255, 102, 51, 0.5), 0 0 15px rgba(255, 102, 51, 0.3)',
                'neon-pink': '0 0 5px rgba(255, 0, 255, 0.5), 0 0 15px rgba(255, 0, 255, 0.3)',
                // Stronger shadows for active state (also slightly refined)
                'neon-purple-strong': '0 0 8px rgba(153, 51, 255, 0.6), 0 0 20px rgba(153, 51, 255, 0.4), 0 0 40px rgba(153, 51, 255, 0.2)',
                'neon-blue-strong': '0 0 8px rgba(0, 204, 221, 0.6), 0 0 20px rgba(0, 204, 221, 0.4), 0 0 40px rgba(0, 204, 221, 0.2)',
                'neon-gold-strong': '0 0 8px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)',
                'neon-pink-strong': '0 0 8px rgba(255, 0, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)',
                'cyan-strong': '0 0 8px rgba(34, 211, 238, 0.6), 0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2)',
            }
        },
    },
    plugins: [],
}
