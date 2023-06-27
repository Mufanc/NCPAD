<template>
    <el-card class="card">
        <Dashboard v-show="connected" class="card-item" :client="info" />
        <div v-show="!connected" class="card-item mask">
            <div class="i-mdi:signal-off w-4em h-4em"></div>
            <div>未连接到终端</div>
            <Ipv4Input class="mt-1em" @connect="connect" :disabled="inputLock" />
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { AgriClient } from '@/common/client'
import { ClientInfo, DeviceThreshold } from '@/common/constants'
import Dashboard from '@/components/Dashboard.vue'
import Ipv4Input from '@/components/Ipv4Input.vue'
import { reactive, ref, toRefs, watch, watchEffect } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'

const connected = ref(false)
let inputLock = false
let updateLock = false
let updateTimer: number | null = null
const client = ref<AgriClient | null>(null)

const info = reactive<ClientInfo>({
    // initialize with zero data
    baseNo: 0,
    ipaddr: '0.0.0.0',
    automaticMode: false,
    standbyMode: false,
    devSwitches: new Array(6).fill(false),
    sensor: {
        airTemperature: 0,
        airHumidity: 0,
        soilTemperature: 0,
        soilHumidity: 0,
        lightIntensity: 0,
        co2Concentration: 0,
    },
    params: {
        heat: 0,
        cool: 0,
        humidify: 0,
        water: 0,
        light: 0,
        fertilizer: 0,
    },
})

const { automaticMode, standbyMode } = toRefs(info)

async function update(key: string, value: any) {
    const chan = client.value
    if (!chan) return
    updateLock = true
    await chan.write(key, value)
    updateLock = false
}

async function set(params: DeviceThreshold) {
    const chan = client.value
    if (!chan) return
    updateLock = true
    await chan.set(params)
    updateLock = false
}

watch(automaticMode, value => update('automaticMode', value))
watch(standbyMode, value => update('standbyMode', value))
watch(info.devSwitches, value => update('devSwitches', value))
watch(info.params, value => set(value))

function connect(ip: string) {
    inputLock = true
    info.ipaddr = ip
    client.value = new AgriClient(ip, error => {
        const message = `与客户机 ${ip} 连接断开`
        error ? ElMessage.error(message) : ElMessage.warning(message)
        client.value = null
        connected.value = false
        inputLock = false
        updateLock = false
    })
}

watchEffect(() => {
    if (client.value !== null) {
        updateTimer = window.setInterval(async () => {
            if (updateLock) return
            const resp: ClientInfo | undefined = await client.value?.read()
            connected.value = true
            if (!resp || updateLock) return
            info.baseNo = resp.baseNo
            info.automaticMode = resp.automaticMode
            info.standbyMode = resp.standbyMode
            for (let i = 0; i < resp.devSwitches.length; i++) {
                info.devSwitches[i] = resp.devSwitches[i]
            }
            info.sensor = resp.sensor
            for (const [key, val] of Object.entries(resp.params)) {
                Reflect.set(info.params, key, val)
            }
        }, 500)
    } else {
        updateTimer && window.clearInterval(updateTimer)
    }
})
</script>

<style scoped lang="less">
.card {
    @apply relative;

    .card-item {
        position: absolute;
        inset: 0;
    }

    .mask {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>
