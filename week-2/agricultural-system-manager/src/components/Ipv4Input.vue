<template>
    <div ref="inputEl">
        <div class="flex">
            <el-input
                class="mr-2px"
                v-model="inputValue"
                @keydown="onKeydown"
                :formatter="format"
                :disabled="props.disabled"
            />
            <el-button
                v-bind="buttonProps"
                @mousedown="$event.preventDefault()"
                @click="connect"
                :disabled="props.disabled"
                plain
                >连接</el-button
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const IPV4_PATTERN = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/

interface Props {
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    (el: 'connect', ip: string): void
}>()

const inputEl = ref<HTMLElement | null>(null)
const inputValue = ref('')
const ipAddress = computed(() => inputValue.value.replace(/[^0-9.]/g, ''))
const buttonProps = computed(() => {
    if (ipAddress.value.match(IPV4_PATTERN)) {
        return { type: 'primary' }
    } else {
        return { type: 'info', disabled: true }
    }
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
    val ||= event.key === 'Enter'
    return val
}

function onKeydown(event: KeyboardEvent) {
    if (!allow(event)) {
        event.preventDefault()
    }

    inputValue.value = format(inputValue.value)

    const quads = inputValue.value.split('.')
    const inputInner = inputEl.value?.querySelector('input')

    switch (event.key) {
        case '.':
            if (quads.length === 4) {
                event.preventDefault()
                return
            }
            if (inputValue.value.endsWith('.')) {
                inputValue.value += '0'
            }
            break
        case 'Enter':
            connect()
            return
        case 'Backspace':
            if (inputValue.value.endsWith('.')) {
                const value = inputValue.value
                inputValue.value = value.substring(0, value.length - 1)
            }
            break
        default:
            if (quads[quads.length - 1].length === 3) {
                inputValue.value += '.'
            }
            if (event.key === '0' && inputValue.value.endsWith('.') && quads.length < 4) {
                setTimeout(() => {
                    inputInner?.dispatchEvent(new KeyboardEvent('keydown', { key: '.' }))
                })
            }
            break
    }

    if (event.key.match(/[0-9.]/)) {
        inputValue.value += event.key
        event.preventDefault()
    }
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

function connect() {
    if (props.disabled) return
    emit('connect', ipAddress.value)
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
