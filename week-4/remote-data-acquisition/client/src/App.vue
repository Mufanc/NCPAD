<template>
    <div class="px-20px py-10px w-full h-full box-border">
        <el-tabs v-model="active" class="w-full h-full flex flex-col">
            <el-tab-pane label="实时数据曲线显示" name="plot">
                <PlotPage />
            </el-tab-pane>
            <el-tab-pane label="串口接收信息显示" name="serial">
                <SerialPage />
            </el-tab-pane>
            <el-tab-pane label="网络收发信息显示" name="net"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import PlotPage from '@/pages/PlotPage.vue'
import SerialPage from '@/pages/SerialPage.vue'
import { ref } from 'vue'

const active = ref('serial')
</script>
<style scoped>
:deep(.el-tabs__content) {
    flex-grow: 1;

    > .el-tab-pane {
        height: 100%;
    }
}

:global(:is(html, body)) {
    @apply w-full, h-full;
    margin: 0;
}

:global(#app) {
    @apply w-full, h-full;
}
</style>
