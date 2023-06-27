<template>
    <el-container class="h-full">
        <el-header>
            <Header />
        </el-header>
        <el-container class="px-10px py-10px">
            <div class="w-full h-full flex flex-col">
                <el-row :gutter="10">
                    <el-col :span="12"><Controller /></el-col>
                    <el-col :span="12"><Controller /></el-col>
                </el-row>
                <el-row :gutter="10" class="mt-10px">
                    <el-col :span="12"><Controller /></el-col>
                    <el-col :span="12"><Controller /></el-col>
                </el-row>
            </div>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import Controller from '@/components/Controller.vue'
import Header from '@/components/Header.vue'
</script>

<style scoped lang="less">
.el-row {
    flex-grow: 1;
}

.el-col > * {
    height: 100%;
}

:global(:is(html, body)) {
    @apply w-full, h-full;
    margin: 0;
}

:global(#app) {
    @apply w-full, h-full;
}
</style>
