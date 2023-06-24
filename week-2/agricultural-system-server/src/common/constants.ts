import { DeviceThreshold, SensorData } from '@/common/device-utils'

export const SENSOR_TYPES: Array<keyof SensorData> = [
    'airTemperature',
    'airHumidity',
    'soilTemperature',
    'soilHumidity',
    'lightIntensity',
    'co2Concentration',
]

export const SENSOR_NAME: { [key in keyof SensorData]: string } = {
    airTemperature: '空气温度',
    airHumidity: '空气湿度',
    soilTemperature: '土壤温度',
    soilHumidity: '土壤湿度',
    lightIntensity: '光照强度',
    co2Concentration: 'CO₂ 浓度',
}

export const SENSOR_UNIT: { [key in keyof SensorData]: string } = {
    airTemperature: '℃',
    airHumidity: '%',
    soilTemperature: '℃',
    soilHumidity: '%',
    lightIntensity: 'LUX',
    co2Concentration: 'PPM',
}

export const DEVICE_TYPES: Array<keyof DeviceThreshold> = [
    'heat',
    'cool',
    'humidify',
    'water',
    'light',
    'fertilizer',
]

export const DEVICE_NAME: { [key in keyof DeviceThreshold]: string } = {
    heat: '加温',
    cool: '降温',
    humidify: '加湿',
    water: '浇水',
    light: '补光',
    fertilizer: '气肥',
}

export const DEVICE2SENSOR: { [key in keyof DeviceThreshold]: keyof SensorData } = {
    heat: 'airTemperature',
    cool: 'airTemperature',
    humidify: 'airHumidity',
    water: 'soilHumidity',
    light: 'lightIntensity',
    fertilizer: 'co2Concentration',
}
