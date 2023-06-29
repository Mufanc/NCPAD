<template>
    <div class="select-box">
        <el-select v-model="serial" placeholder="串口选择" :teleported="false">
            <el-option v-for="op in options" :label="op.label" :value="op.value" />
        </el-select>
    </div>
</template>

<script setup lang="ts">
import { SerialPort } from 'serialport'
import { onMounted, ref, watch } from 'vue'

defineProps<{ modelValue: string }>()

const emit = defineEmits<{
    (ev: 'update:modelValue', val: string): void
}>()

const serial = ref('')
const options = ref<{ value: string; label: string }[]>([])

watch(serial, value => emit('update:modelValue', value))

onMounted(async () => {
    options.value = (await SerialPort.list()).map(it => ({
        value: it.path,
        label: it.path,
    }))
    serial.value = options.value[0].value
})
</script>

<style scoped>
.select-box {
    width: 20ch;

    :deep(*) {
        font-family: 'Source Code Pro', monospace;
    }
}
</style>
