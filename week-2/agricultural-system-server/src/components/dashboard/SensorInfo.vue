<template>
    <List title="传感器采集采参数显示">
        <ListItem v-for="(ty, i) in SENSOR_TYPES">
            <el-popover :width="400">
                <template #reference>
                    <div>
                        当前{{ SENSOR_NAME[ty] }}：
                        <el-tag
                            effect="plain"
                            class="w-6em"
                            v-bind="styles[i] ? { type: 'danger' } : {}"
                            >{{ values[ty] }}{{ SENSOR_UNIT[ty] }}</el-tag
                        >
                    </div>
                </template>
                <SensorChart
                    class="w-full h-300px"
                    :curve="history[ty]"
                    :y-label="SENSOR_UNIT[ty]"
                    :title="`${SENSOR_NAME[ty]}（${SENSOR_UNIT[ty]}）`"
                />
            </el-popover>
        </ListItem>
    </List>
</template>

<script setup lang="ts">
import { DEVICE_TYPES, SENSOR_NAME, SENSOR_TYPES, SENSOR_UNIT } from '@/common/constants'
import { DeviceThreshold, Sensor, SensorData } from '@/common/device-utils'
import List from '@/components/dashboard/List.vue'
import ListItem from '@/components/dashboard/ListItem.vue'
import SensorChart from '@/components/dashboard/SensorChart.vue'
import { useConfigStore } from '@/store/configs'
import { reactive, toRaw, watch } from 'vue'

const configs = useConfigStore()

const values = Sensor.instance().loadAll()
const styles = reactive(new Array(SENSOR_TYPES.length).fill(false))

const history: { [key in keyof SensorData]: number[] } = reactive({
    airTemperature: [],
    airHumidity: [],
    soilTemperature: [],
    soilHumidity: [],
    lightIntensity: [],
    co2Concentration: [],
})

function clear() {
    for (let i = 0; i < SENSOR_TYPES.length; i++) {
        styles[i] = false
    }
}

function sync(sensorType: keyof SensorData, deviceType: keyof DeviceThreshold, value: boolean) {
    const devSwitches = configs.devSwitches
    styles[SENSOR_TYPES.indexOf(sensorType)] ||= devSwitches[DEVICE_TYPES.indexOf(deviceType)] =
        value
}

watch(values, value => {
    if (!configs.automaticMode) return

    const deviceParams = configs.deviceParams
    const valueRaw: SensorData = toRaw(value)

    for (const ty of SENSOR_TYPES) {
        history[ty].push(valueRaw[ty])
        if (history[ty].length > 60) history[ty].shift()
    }

    clear()
    sync('airTemperature', 'heat', value.airTemperature < deviceParams.heat)
    sync('airTemperature', 'cool', value.airTemperature > deviceParams.cool)
    sync('airHumidity', 'humidify', value.airHumidity < deviceParams.humidify)
    sync('soilHumidity', 'water', value.soilHumidity < deviceParams.water)
    sync('lightIntensity', 'light', value.lightIntensity < deviceParams.light)
    sync('co2Concentration', 'fertilizer', value.co2Concentration < deviceParams.fertilizer)
})
</script>

<style scoped lang="less"></style>
