<template>
    <div class="flex items-center">
        <div class="flex items-center justify-center flex-grow-1">
            <DevSwitch
                v-for="i in range(names.length)"
                v-model="devSwitches[i]"
                :name="names[i]"
                :disabled="isDisabled(i)"
            />
        </div>
        <DevSettings />
    </div>
</template>

<script setup lang="ts">
import { DEVICE_NAME, DEVICE_TYPES } from '@/common/constants'
import { range } from '@/common/range'
import DevSettings from '@/components/footer/DevSettings.vue'
import DevSwitch from '@/components/footer/DevSwitch.vue'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'

const { devSwitches, automaticMode, standbyMode } = storeToRefs(useConfigStore())

const names = DEVICE_TYPES.map(ty => DEVICE_NAME[ty])
devSwitches.value = reactive(new Array(names.length).fill(false))

function isDisabled(index: number) {
    if (automaticMode.value || standbyMode.value) return true
    if (index === 0) return devSwitches.value[1]
    if (index === 1) return devSwitches.value[0]
    return false
}
</script>

<style scoped lang="less"></style>
