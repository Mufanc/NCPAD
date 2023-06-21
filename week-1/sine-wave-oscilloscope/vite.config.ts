import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron'

export default defineConfig({
    plugins: [
        Vue(),
        UnoCSS(),
        Electron({
            entry: 'src/electron/index.ts',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
})
