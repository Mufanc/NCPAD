import { RandomCurve } from '@/common/mock'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'

export interface SensorData {
    airTemperature: number
    airHumidity: number
    soilTemperature: number
    soilHumidity: number
    lightIntensity: number
    co2Concentration: number
}

export interface DeviceThreshold {
    heat: number
    cool: number
    humidify: number
    water: number
    light: number
    fertilizer: number
}

export class Sensor {
    static #instance?: Sensor

    static instance(): Sensor {
        !this.#instance && (this.#instance = new Sensor())
        return this.#instance
    }

    readonly #mocks: { [key in keyof SensorData]: RandomCurve }
    readonly #caches: Ref<SensorData>

    private constructor() {
        const { standbyMode } = storeToRefs(useConfigStore())

        this.#mocks = {
            airTemperature: new RandomCurve(-10, 60),
            airHumidity: new RandomCurve(10, 100),
            soilTemperature: new RandomCurve(-10, 60),
            soilHumidity: new RandomCurve(10, 100),
            lightIntensity: new RandomCurve(100, 50000),
            co2Concentration: new RandomCurve(0, 1000),
        }

        this.#caches = ref(this.#reload())
        window.setInterval(() => {
            if (!standbyMode.value) {
                this.#caches.value = this.#reload()
            }
        }, 1000)
    }

    #reload(): SensorData {
        function isInteger(key: string) {
            return key === 'lightIntensity' || key === 'co2Concentration'
        }

        return Object.fromEntries(
            Object.entries(this.#mocks).map(([key, mock]) => {
                const value = mock.next().toFixed(isInteger(key) ? 0 : 2)
                return [key, value]
            })
        ) as any
    }

    loadAll(): Ref<SensorData> {
        return this.#caches
    }
}