import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Electron from 'vite-plugin-electron'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins: [
        Vue(),
        UnoCSS(),
        Electron([
            {
                entry: 'src/electron/main.ts',
            },
        ]),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            external: ['net', 'node:net'],
        },
    },
})
