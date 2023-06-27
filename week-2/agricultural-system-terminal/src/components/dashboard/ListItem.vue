<template>
    <li class="list-item"><slot /></li>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.list-item {
    @apply flex justify-center items-center py-0\.2em my-0\.25em;
    border-radius: 2em;
    box-sizing: content-box;

    &:nth-child(2n) {
        background-color: var(--el-color-primary-light-9);
    }

    &:nth-child(2n + 1) {
        background-color: var(--el-color-primary-light-8);
    }
}
</style>
