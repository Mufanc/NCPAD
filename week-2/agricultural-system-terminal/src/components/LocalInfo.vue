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
        <div class="flex items-center">
            <span class="font-bold">基地号：</span>
            <div
                class="w-2.5em h-2.5em inline-block color-orange"
                :class="[`i-mdi:numeric-${props.id}-box`]"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ id: number }>()
</script>

<style scoped lang="less"></style>
