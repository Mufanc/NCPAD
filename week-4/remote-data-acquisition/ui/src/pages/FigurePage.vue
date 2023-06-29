<template>
    <div class="w-full h-full flex flex-col">
        <el-row :gutter="10" class="h-50%">
            <el-col :span="12">
                <Figure
                    title="温度曲线"
                    y-label="温度值（℃）"
                    :data="data.T"
                    :duration="DURATION"
                />
            </el-col>
            <el-col :span="12">
                <Figure
                    title="光照强度曲线"
                    y-label="光照强度（LUX）"
                    :data="data.ill"
                    :duration="DURATION"
                />
            </el-col>
        </el-row>
        <el-row :gutter="10" class="h-50% mt-10px">
            <el-col :span="12">
                <Figure
                    title="第一路电压曲线"
                    y-label="电压（V）"
                    :data="data.v1"
                    :duration="DURATION"
                />
            </el-col>
            <el-col :span="12">
                <Figure
                    title="第二路电压曲线"
                    y-label="电压（V）"
                    :data="data.v2"
                    :duration="DURATION"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { Env } from '@/common/env'
import EventBus from '@/common/event-bus'
import Figure from '@/components/pages-figure/Figure.vue'
import { onMounted, reactive, ref, watch } from 'vue'

const DURATION = 30

const begin = ref(0)
const data: { [K in keyof Env]: [number, Env[K]][] } = reactive({
    v1: [],
    v2: [],
    T: [],
    ill: [],
})

function update<K extends keyof Env>(key: K, env: Env) {
    data[key].push([(new Date().getTime() - begin.value) / 1000, env[key]])
    while (data[key][data[key].length - 1][0] - data[key][0][0] > DURATION) {
        data[key].shift()
    }
}

EventBus.on('SENSOR-UPDATE', (env: Env) => {
    update('v1', env)
    update('v2', env)
    update('T', env)
    update('ill', env)
})

EventBus.on('SET-BEGIN-TIME', val => {
    begin.value = val
})

EventBus.on('GET-BEGIN-TIME', () => {
    EventBus.emit('GET-BEGIN-TIME-ACK', begin.value)
})
</script>

<style scoped></style>
