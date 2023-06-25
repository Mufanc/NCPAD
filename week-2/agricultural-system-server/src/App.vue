<template>
    <el-container class="h-full">
        <el-header>
            <Header />
        </el-header>
        <el-divider class="my-0 mt-10px" />
        <el-container class="px-10px">
            <el-container>
                <el-main class="relative">
                    <div class="mask" :class="{ hide: !standbyMode }"></div>
                    <CameraView class="w-full h-full" />
                </el-main>
                <el-divider class="mt-10px mb-0" />
                <el-footer>
                    <div class="flex w-full h-full items-center">
                        <DevSwitchGroup class="flex-grow-1" />
                    </div>
                </el-footer>
            </el-container>
            <el-divider direction="vertical" class="h-full" />
            <el-aside class="flex flex-col pt-0.2em">
                <SensorInfo class="dashboard"></SensorInfo>
                <DeviceInfo class="dashboard"></DeviceInfo>
                <ParamsInfo class="dashboard"></ParamsInfo>
                <div class="flex justify-around items-center h-60px">
                    <ButtonSwitch
                        :names="['专家模式', '人工干预']"
                        v-model="automaticMode"
                        :disabled="standbyMode"
                    />
                    <ButtonSwitch :names="['切换待机', '切换运行']" v-model="standbyMode" />
                    <el-button @click="quit" type="danger" plain>关机退出</el-button>
                </div>
            </el-aside>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import CameraView from '@/components/CameraView.vue'
import DeviceInfo from '@/components/dashboard/DeviceInfo.vue'
import ParamsInfo from '@/components/dashboard/ParamsInfo.vue'
import SensorInfo from '@/components/dashboard/SensorInfo.vue'
import DevSwitchGroup from '@/components/footer/DevSwitchGroup.vue'
import Header from '@/components/Header.vue'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'

const { ipcRenderer } = window.require('electron')
const { automaticMode, standbyMode } = storeToRefs(useConfigStore())

function quit() {
    ipcRenderer.send('EXIT')
}
</script>

<style scoped lang="less">
.mask {
    @apply bg-white;
    position: absolute;
    inset: 0;
    transition: all 0.2s ease-in-out;
    opacity: 0.6;

    &.hide {
        opacity: 0;
    }
}

.dashboard {
    flex-grow: 1;
}

:global(:is(html, body)) {
    @apply w-full, h-full;
    margin: 0;
}

:global(#app) {
    @apply w-full, h-full;
}
</style>
