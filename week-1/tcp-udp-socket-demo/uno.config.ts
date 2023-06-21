import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            collections: {
                mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
            },
        }),
    ],
    transformers: [transformerDirectives()],
})
