/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/*.{html,js,ts,css,vue}',
        './src/**/*.{html,js,ts,css,vue}'
    ],
    mode: 'jit',
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient( 100% 100% at 50% 0%, var(--tw-gradient-stops) )',
            }
        },
    },
    plugins: [],
}
