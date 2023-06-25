<template>
    <div class="flex items-center justify-between">
        <h1 class="inline-block">🌿 农业基地智能监控系统现场控制软件</h1>
        <LocalInfo class="info" :id="baseNo" />
    </div>
</template>

<script setup lang="ts">
import LocalInfo from '@/components/LocalInfo.vue'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'

const { baseNo } = storeToRefs(useConfigStore())
</script>

<style scoped lang="less">
h1 {
    @apply bg-green bg-opacity-50 px-1em py-0\.3em mt-10px;
    border-radius: 2em;
}
</style>
