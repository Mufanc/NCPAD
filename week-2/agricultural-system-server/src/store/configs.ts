import { DeviceThreshold } from '@/common/device-utils'
import { defineStore } from 'pinia'

interface Configs {
    devSwitches: boolean[]
    automaticMode: boolean
    standbyMode: boolean
    baseId: number
    deviceParams: DeviceThreshold
}

export const useConfigStore = defineStore('configs', {
    state: (): Configs => ({
        devSwitches: [],
        automaticMode: true,
        standbyMode: false,
        baseId: 0,
        deviceParams: {
            heat: 10,
            cool: 50,
            humidify: 35,
            water: 30,
            light: 100,
            fertilizer: 200,
        },
    }),
})
