<template>
    <el-select v-model="baud">
        <el-option v-for="op in options" :label="op.label" :value="op.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: number
}>()

const emit = defineEmits<{
    (ev: 'update:modelValue', val: number): void
}>()

const baud = ref(props.modelValue)
watch(baud, val => emit('update:modelValue', val))

const options = [
    110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 56000, 57600, 115200, 128000,
    256000,
].map(it => ({
    value: it,
    label: `${it}`,
}))
</script>

<style scoped></style>
