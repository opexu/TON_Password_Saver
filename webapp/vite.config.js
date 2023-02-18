import { fileURLToPath, URL } from 'node:url'
const path = require('node:path')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: 'dist'
    },
    base: ((process.env.GITHUB_REPOSITORY ?? "") + "/").match(/(\/.*)/)?.[1],
    server: {
        port: 3000,
        hot: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    esbuild: {
        //drop: ['console', 'debugger'],
    },
})
