<template>
    <div class="input-view">
        <textarea
            ref='input'
            class="input"
            :placeholder="props.hint"
            :value="props.modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            :readonly='props.readonly'
        />
        <el-button @click="clear" class='clear-button' type='danger' plain round>
            <template #icon>
                <div class="i-mdi:close" />
            </template>
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Props {
    modelValue: string
    hint: string
    readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    readonly: false,
})

const emit = defineEmits<{
    (ev: 'update:modelValue', val: string): void
}>()

const input = ref<HTMLTextAreaElement | null>(null)
const opacity = computed(() => props.modelValue ? 1 : 0)

function clear() {
    emit('update:modelValue', '')
}
</script>

<style scoped lang="less">
.input-view {
    position: relative;

    .input {
        @apply w-full h-full;
        box-sizing: border-box;
        resize: none;
        padding: 0.5em;
        font-family: 'Noto Sans SC', sans-serif !important;

        &:focus-visible {
            outline: var(--el-color-success) auto 1px;

            & + .clear-button {
                opacity: v-bind(opacity);
            }
        }
    }

    .clear-button {
        position: absolute;
        right: 5px;
        top: 5px;
        transition: opacity .2s ease-in-out !important;
        opacity: 0;
    }
}
</style>
