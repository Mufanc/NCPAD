<template>
    <div>
        <div class="display-none">
            <span class="i-mdi:numeric-0-box"></span>
            <span class="i-mdi:numeric-1-box"></span>
            <span class="i-mdi:numeric-2-box"></span>
            <span class="i-mdi:numeric-3-box"></span>
            <span class="i-mdi:numeric-4-box"></span>
            <span class="i-mdi:numeric-5-box"></span>
            <span class="i-mdi:numeric-6-box"></span>
            <span class="i-mdi:numeric-7-box"></span>
            <span class="i-mdi:numeric-8-box"></span>
            <span class="i-mdi:numeric-9-box"></span>
        </div>
        <div class="icon inline-block" :class="[`i-mdi:numeric-${props.n}-box`]"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ n: number }>()
</script>

<style scoped lang="less">
.icon {
    font-size: 1.2em;
}
</style>
