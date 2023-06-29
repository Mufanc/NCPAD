<template>
    <div ref="inputEl">
        <div class="flex">
            <el-input
                class="mr-2px"
                v-model="inputRef"
                @keydown="onKeydown"
                :formatter="format"
                :disabled="props.disabled"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import 'element-plus/theme-chalk/el-message.css'

const IPV4_PATTERN = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/

interface Props {
    modelValue: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    (el: 'update:modelValue', ip: string): void
}>()

const inputEl = ref<HTMLElement | null>(null)
const inputRef = ref('')
const ipaddr = computed(() => inputRef.value.replace(/[^0-9.]/g, ''))

watch(ipaddr, value => {
    emit('update:modelValue', value.match(IPV4_PATTERN) ? value : '')
})

function allow(event: KeyboardEvent) {
    let val = false
    val ||= !!event.key.match(/[0-9.]/)
    val ||= event.ctrlKey && event.key === 'a'
    val ||= event.key === 'ArrowUp'
    val ||= event.key === 'ArrowDown'
    val ||= event.key === 'ArrowLeft'
    val ||= event.key === 'ArrowRight'
    val ||= event.key === 'Backspace'
    val ||= event.key === 'Delete'
    return val
}

let cd: number | null = null

function onKeydown(event: KeyboardEvent) {
    if (!allow(event)) {
        event.preventDefault()
    }

    inputRef.value = format(inputRef.value)

    const quads = inputRef.value.split('.')
    const inputInner = inputEl.value?.querySelector('input')

    switch (event.key) {
        case '.':
            if (quads.length === 4) {
                event.preventDefault()
                return
            }
            if (inputRef.value.endsWith('.')) {
                inputRef.value += '0'
            }
            break
        case 'Backspace':
            if (inputRef.value.endsWith('.')) {
                const value = inputRef.value
                inputRef.value = value.substring(0, value.length - 1)
            }
            break
        default:
            if (quads[quads.length - 1].length === 3) {
                inputRef.value += '.'
            }
            if (event.key === '0' && inputRef.value.endsWith('.') && quads.length < 4) {
                setTimeout(() => {
                    inputInner?.dispatchEvent(new KeyboardEvent('keydown', { key: '.' }))
                })
            }
            break
    }

    if (event.key.match(/[0-9.]/)) {
        inputRef.value += event.key
        event.preventDefault()
    }

    cd && window.clearTimeout(cd)
    cd = window.setTimeout(() => (inputRef.value = format(inputRef.value)))
}

function format(value: string) {
    const quads = value.split('.').slice(0, 4)
    return quads
        .map((v, index) => {
            if (v.match(/^\s*$/)) return ''
            v = `${Math.min(Number(v.replace(/^0+/, '')), 255)}`.padStart(2, ' ')
            if (index + 1 !== quads.length) v = v.padEnd(3, ' ')
            return v
        })
        .join('.')
}
</script>

<style scoped lang="less">
.el-input {
    width: fit-content;

    :deep(input) {
        width: 15ch;
        font-family: 'Source Code Pro', monospace;
    }
}
</style>
