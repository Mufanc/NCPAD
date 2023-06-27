<template>
    <el-button
        type="primary"
        @click="showPopup = true"
        @mousedown="$event.preventDefault()"
        :disabled="standbyMode"
        >参数设置<span class="i-mdi:cog ml-0.2em"></span
    ></el-button>
    <el-dialog
        v-model="showPopup"
        title="专家参数设置"
        align-center
        width="550px"
        @closed="caches = refresh()"
    >
        <el-form :model="caches" inline label-width="120px">
            <el-form-item label="本机基地号">
                <el-radio-group v-model.number="caches.baseNo" size="small">
                    <el-radio-button v-for="i in range(10)" :label="i" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="加温温度阈值">
                <el-input v-model.number="caches.heat" size="small"
                    ><template #suffix>℃</template></el-input
                >
            </el-form-item>
            <el-form-item label="降温温度阈值">
                <el-input v-model.number="caches.cool" size="small"
                    ><template #suffix>℃</template></el-input
                >
            </el-form-item>
            <el-form-item label="空气湿度阈值">
                <el-input v-model.number="caches.humidify" size="small"
                    ><template #suffix>%</template></el-input
                >
            </el-form-item>
            <el-form-item label="土壤湿度阈值">
                <el-input v-model.number="caches.water" size="small"
                    ><template #suffix>%</template></el-input
                >
            </el-form-item>
            <el-form-item label="光照强度阈值">
                <el-input v-model.number="caches.light" size="small"
                    ><template #suffix>LUX</template></el-input
                >
            </el-form-item>
            <el-form-item label="CO₂ 浓度阈值">
                <el-input v-model.number="caches.fertilizer" size="small"
                    ><template #suffix>PPM</template></el-input
                >
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showPopup = false">取消</el-button>
            <el-button type="primary" @click="save()">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { DeviceThreshold } from '@/common/device-utils'
import { range } from '@/common/range'
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'
import { ref, toRaw } from 'vue'

const showPopup = ref(false)

const configs = useConfigStore()
const { standbyMode, baseNo } = storeToRefs(configs)

type ConfigType = DeviceThreshold & { baseNo: number }

// Todo: Form rules --> https://element-plus.org/zh-CN/component/form.html#%E8%A1%A8%E5%8D%95%E6%A0%A1%E9%AA%8C
const caches = ref<ConfigType>(refresh())

function refresh() {
    return {
        baseNo: baseNo.value,
        ...configs.deviceParams,
    }
}

function save() {
    const newConfigs = toRaw(caches.value)

    baseNo.value = newConfigs.baseNo
    for (const [key, value] of Object.entries(newConfigs)) {
        if (key === 'baseNo') continue
        Reflect.set(configs.deviceParams, key, value)
    }

    showPopup.value = false
}
</script>

<style scoped lang="less">
:deep(.el-input) {
    display: inline-block;
    width: 100px;
}
</style>