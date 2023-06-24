<template>
    <List title="控制设备工作状态">
        <ListItem v-for="(ty, i) in DEVICE_TYPES"
            >当前{{ DEVICE_NAME[ty] }}开关状态：{{ devSwitches[i] ? '开' : '关' }}</ListItem
        >
    </List>
</template>

<script setup lang="ts">
import { DEVICE_NAME, DEVICE_TYPES } from '@/common/constants'
import List from '@/components/dashboard/List.vue'
import ListItem from '@/components/dashboard/ListItem.vue'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'

const { devSwitches } = storeToRefs(useConfigStore())
</script>

<style scoped lang="less"></style>
