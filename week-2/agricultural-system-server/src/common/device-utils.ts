import { RandomCurve } from '@/common/mock'
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
        this.#mocks = {
            airTemperature: new RandomCurve(-10, 60),
            airHumidity: new RandomCurve(10, 100),
            soilTemperature: new RandomCurve(-10, 60),
            soilHumidity: new RandomCurve(10, 100),
            lightIntensity: new RandomCurve(100, 50000),
            co2Concentration: new RandomCurve(0, 1000),
        }

        this.#caches = ref(this.#reload())
        window.setInterval(() => (this.#caches.value = this.#reload()), 1000)
    }

    #reload(): SensorData {
        return Object.fromEntries(
            Object.entries(this.#mocks).map(([key, mock]) => [key, mock.next()])
        ) as any
    }

    loadAll(): Ref<SensorData> {
        return this.#caches
    }

    // loadAirTemperature(): number {
    //     return this.#caches.airTemperature
    // }
    //
    // loadAirHumidity(): number {
    //     return this.#caches.airHumidity
    // }
    //
    // loadSoilTemperature(): number {
    //     return this.#caches.soilTemperature
    // }
    //
    // loadSoilHumidity(): number {
    //     return this.#caches.soilHumidity
    // }
    //
    // loadLightIntensity(): number {
    //     return this.#caches.lightIntensity
    // }
    //
    // loadCo2Concentration(): number {
    //     return this.#caches.co2Concentration
    // }
}