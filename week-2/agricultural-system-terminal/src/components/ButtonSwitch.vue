<template>
    <el-button @click="update" @mousedown="$event.preventDefault()" :disabled="props.disabled">{{
        props.names[props.modelValue | 0]
    }}</el-button>
</template>

<script setup lang="ts">
interface Props {
    names: [string, string]
    modelValue: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    (ev: 'update:modelValue', val: boolean): void
}>()

function update() {
    emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped lang="less"></style>
