<template>
    <el-button @click="update" @mousedown="$event.preventDefault()" size="small">{{
        props.names[props.modelValue | 0]
    }}</el-button>
</template>

<script setup lang="ts">
const props = defineProps<{
    names: [string, string]
    modelValue: boolean
}>()

const emit = defineEmits<{
    (ev: 'update:modelValue', val: boolean): void
}>()

function update() {
    emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped lang="less"></style>
