<template>
    <el-container>
        <el-header class="flex items-center justify-between">
            <span style="font-size: 1.5em">
                <NumberIcon :n="client.baseNo" class="inline-block vertical-middle" />号基地 （<code class="ipaddr">{{
                    client.ipaddr
                }}</code
                >）
            </span>
            <div>
                <ButtonSwitch :names="['手动模式', '自动模式']" v-model="props.client.automaticMode" />
                <ButtonSwitch :names="['正在运行', '正在待机']" v-model="props.client.standbyMode" />
            </div>
        </el-header>
        <el-container>
            <div class="flex flex-col w-full h-full p-10px box-border">
                <div class="sensor-view flex-grow-1">
                    <div class="item" v-for="(ty, i) in SENSOR_TYPES">
                        当前{{ SENSOR_NAME[ty] }}：
                        <el-tag effect="plain" class="w-6em" v-bind="dangerStyles[i] ? { type: 'danger' } : {}"
                            >{{ client.sensor[ty] }}{{ SENSOR_UNIT[ty] }}</el-tag
                        >
                    </div>
                </div>
                <el-divider class="my-10px" />
                <el-row>
                    <el-col :span="20" class="flex justify-around">
                        <el-tooltip v-for="(ty, i) in DEVICE_TYPES" placement="top" effect="light">
                            <template #content>
                                <span style="font-size: larger">
                                    {{ SENSOR_NAME[DEVICE2SENSOR[ty]] }}
                                    <b class="color-blue"
                                        >{{ getTriggerTypeName(ty) }} {{ client.params[ty]
                                        }}{{ SENSOR_UNIT[DEVICE2SENSOR[ty]] }}</b
                                    >
                                    开启{{ DEVICE_NAME[ty] }}
                                </span>
                            </template>
                            <div>
                                <DevSwitch v-model="client.devSwitches[i]" :disabled="isDisabled(i)">{{
                                    DEVICE_NAME[ty]
                                }}</DevSwitch>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="2" :offset="2">
                        <DevSettings :params="client.params" />
                    </el-col>
                </el-row>
            </div>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import {
    ClientInfo,
    DEVICE_NAME,
    DEVICE_TYPES,
    DEVICE2SENSOR,
    SENSOR_NAME,
    SENSOR_TYPES,
    SENSOR_UNIT,
    SensorData,
} from '@/common/constants'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import DevSettings from '@/components/DevSettings.vue'
import DevSwitch from '@/components/DevSwitch.vue'
import NumberIcon from '@/components/NumberIcon.vue'
import { reactive, toRefs, watchEffect } from 'vue'

const props = defineProps<{ client: ClientInfo }>()
const { client } = toRefs(props)

const dangerStyles = reactive(new Array(SENSOR_TYPES.length).fill(false))

watchEffect(() => {
    function sync(sensorType: keyof SensorData, value: boolean) {
        dangerStyles[SENSOR_TYPES.indexOf(sensorType)] ||= value
    }

    for (let i = 0; i < SENSOR_TYPES.length; i++) {
        dangerStyles[i] = false
    }

    const { sensor, params } = props.client
    sync('airTemperature', sensor.airTemperature < params.heat)
    sync('airTemperature', sensor.airTemperature > params.cool)
    sync('airHumidity', sensor.airHumidity < params.humidify)
    sync('soilHumidity', sensor.soilHumidity < params.water)
    sync('lightIntensity', sensor.lightIntensity < params.light)
    sync('co2Concentration', sensor.co2Concentration < params.fertilizer)
})

function getTriggerTypeName(ty: string): string {
    if (ty === 'cool') return '高于'
    return '低于'
}

function isDisabled(index: number) {
    if (props.client.automaticMode || props.client.standbyMode) return true
    if (index === 0) return props.client.devSwitches[1]
    if (index === 1) return props.client.devSwitches[0]
    return false
}
</script>

<style scoped lang="less">
.ipaddr {
    font-family: 'Source Code Pro', monospace;
}

.sensor-view {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;

    .item {
        @apply flex justify-center items-center;
        border-radius: 2em;
        box-sizing: content-box;
        margin: 1em;

        &:nth-child(1),
        &:nth-child(4),
        &:nth-child(5) {
            background-color: var(--el-color-primary-light-9);
        }

        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(6) {
            background-color: var(--el-color-primary-light-8);
        }
    }
}
</style>
