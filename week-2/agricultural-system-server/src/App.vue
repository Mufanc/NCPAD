<template>
    <el-container class="h-full">
        <el-header class="bg-yellow"> </el-header>
        <el-container class="px-10px">
            <el-container>
                <el-main class="relative">
                    <div class="mask" :class="{ hide: !standbyMode }"></div>
                    <CameraView class="w-full h-full" />
                </el-main>
                <el-divider class="mt-10px mb-0" />
                <el-footer>
                    <DevSwitchGroup class="w-full h-full" />
                </el-footer>
            </el-container>
            <el-divider direction="vertical" class="h-full" />
            <el-aside class="flex flex-col">
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
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'

const { ipcRenderer } = window.require('electron')
const { automaticMode, standbyMode } = storeToRefs(useConfigStore())

/**
 * Todo:
 * - [ ] 以图形化界面显示本农业基地的各种传感采集数据、各个设备开关状态、工作状态、参数设置情况
 * - [x] 能够对工作状态进行切换（手动/自动、运行/待机）
 * - [x] 能够对设备开关状态进行切换（加温、降温、加湿、浇水、补光、气肥）
 * - [x] 能够对工作参数进行设置（空气湿度、空气温度、土壤湿度、光照强度、CO2 浓度）
 * - [ ] 当采集数据达到设置的工作参数阈值时,能够自动切换设备开关状态
 * - [x] 模拟产生传感器数据
 */

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

    &:nth-child(2n) {
        background-color: #79bbff;
    }

    &:nth-child(2n + 1) {
        background-color: #a0cfff;
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
