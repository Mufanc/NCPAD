<template>
    <el-button
        v-bind="buttonStyle"
        @click="update"
        @mousedown="$event.preventDefault()"
        :disabled="props.disabled"
        plain
        ><slot
    /></el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    (ev: 'update:modelValue', val: boolean): void
}>()

const buttonStyle = computed(() => {
    return props.modelValue ? { type: 'success' } : {}
})

function update() {
    emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped></style>
