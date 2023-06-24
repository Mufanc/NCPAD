<template>
    <List title="专家控制参数范围">
        <ListItem v-for="ty in DEVICE_TYPES"
            >{{ SENSOR_NAME[DEVICE2SENSOR[ty]] }}{{ getTriggerType(ty) }} {{ deviceParams[ty]
            }}{{ SENSOR_UNIT[DEVICE2SENSOR[ty]] }} 开启{{ DEVICE_NAME[ty] }}</ListItem
        >
    </List>
</template>

<script setup lang="ts">
import {
    DEVICE_NAME,
    DEVICE_TYPES,
    DEVICE2SENSOR,
    SENSOR_NAME,
    SENSOR_UNIT,
} from '@/common/constants'
import List from '@/components/dashboard/List.vue'
import ListItem from '@/components/dashboard/ListItem.vue'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'

const { deviceParams } = storeToRefs(useConfigStore())

function getTriggerType(ty: string): string {
    if (ty === 'cool') return '高于'
    return '低于'
}
</script>

<style scoped lang="less"></style>
