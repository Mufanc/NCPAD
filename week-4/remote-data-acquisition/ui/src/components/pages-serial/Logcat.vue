<template>
    <div class="input-view">
        <textarea ref="input" class="input" placeholder="还没有日志……" :value="logs" readonly />
        <el-button @click="logs = ''" class="clear-button" type="danger" plain round>
            <template #icon>
                <div class="i-mdi:close" />
            </template>
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const logs = ref('')

const input = ref<HTMLTextAreaElement | null>(null)
const opacity = computed(() => (logs.value ? 1 : 0))

watch(
    logs,
    () => {
        input.value && (input.value.scrollTop = input.value.scrollHeight)
    },
    { flush: 'post' }
)

function log(message: string) {
    logs.value += message + '\n'
    logs.value += '-'.repeat(50) + '\n'
}

defineExpose({ log })
</script>

<style scoped lang="less">
.input-view {
    position: relative;

    .input {
        @apply w-full h-full;
        box-sizing: border-box;
        resize: none;
        padding: 0.5em;
        font-family: 'Source Code Pro', monospace;
        scroll-behavior: smooth;

        &:focus-visible {
            outline: var(--el-color-success-light-3) auto 1px;

            & + .clear-button {
                opacity: v-bind(opacity);
            }
        }
    }

    .clear-button {
        position: absolute;
        right: 5px;
        top: 5px;
        transition: opacity 0.2s ease-in-out !important;
        opacity: 0;
    }
}
</style>
