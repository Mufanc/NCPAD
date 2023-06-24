<template>
    <div>
        <div>{{ props.title }}</div>
        <ul>
            <slot />
        </ul>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
}>()
</script>

<style scoped lang="less"></style>
