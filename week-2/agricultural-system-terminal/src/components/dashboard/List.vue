<template>
    <div>
        <h3 class="text-center mt-0 mb-0.5em">{{ props.title }}</h3>
        <ul class="list-none p-0 m-0">
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
