<template>
    <div class="px-20px py-10px w-full h-full box-border">
        <el-tabs v-model="activeTab" class="w-full h-full flex flex-col">
            <el-tab-pane v-if="mode === 'SERVER'" label="串口接收信息显示" name="SERIAL">
                <SerialPage />
            </el-tab-pane>
            <el-tab-pane v-if="mode === 'SERVER'" label="网络收发信息显示" name="NET-SERVER">
                <NetServerPage />
            </el-tab-pane>
            <el-tab-pane v-if="mode === 'CLIENT'" label="网络收发信息显示" name="NET-CLIENT">
                <NetClientPage />
            </el-tab-pane>
            <el-tab-pane label="实时数据曲线显示" name="FIGURE">
                <FigurePage />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import FigurePage from '@/pages/FigurePage.vue'
import NetClientPage from '@/pages/NetClientPage.vue'
import NetServerPage from '@/pages/NetServerPage.vue'
import SerialPage from '@/pages/SerialPage.vue'
import { ipcRenderer } from 'electron'
import { computed, onMounted, ref } from 'vue'

const mode = ref('SERVER')
const activeTab = ref('SERIAL')

async function environ(name: string): Promise<string | null> {
    return (await ipcRenderer.invoke('GET-ENV', name)) || null
}

onMounted(async () => {
    mode.value = (await environ('MODE')) === 'CLIENT' ? 'CLIENT' : 'SERVER'
    if (mode.value === 'CLIENT') activeTab.value = 'NET-CLIENT'
    ipcRenderer.send(
        'SET-TITLE',
        `远程数据采集系统 - ${mode.value === 'SERVER' ? '发送端' : '接收端'}`
    )
})
</script>
<style scoped>
:deep(.el-tabs__content) {
    flex-grow: 1;

    :deep(& .el-tab-pane) {
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
