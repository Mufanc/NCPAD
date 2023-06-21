import { defineConfig, transformerDirectives } from 'unocss'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    transformers: [transformerDirectives()],
})
