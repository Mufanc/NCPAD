<template>
    <List title="传感器采集采参数显示">
        <ListItem v-for="ty in SENSOR_TYPES"
            >当前{{ SENSOR_NAME[ty] }}：{{ sensorValues[ty] }}{{ SENSOR_UNIT[ty] }}</ListItem
        >
    </List>
</template>

<script setup lang="ts">
// Todo: draw chart

import { SENSOR_NAME, SENSOR_TYPES, SENSOR_UNIT } from '@/common/constants'
import { Sensor } from '@/common/device-utils'
import List from '@/components/dashboard/List.vue'
import ListItem from '@/components/dashboard/ListItem.vue'

const sensorValues = Sensor.instance().loadAll()
</script>

<style scoped lang="less"></style>
