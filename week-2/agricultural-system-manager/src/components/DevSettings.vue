<template>
    <div class="i-mdi:cogs w-1.5em h-full mx-auto" @click="showPopup = true"></div>
    <el-dialog v-model="showPopup" title="专家参数设置" align-center width="550px" @open="caches = refresh()">
        <el-form :model="caches" inline label-width="120px">
            <el-form-item label="加温温度阈值">
                <el-input v-model.number="caches.heat" size="small"><template #suffix>℃</template></el-input>
            </el-form-item>
            <el-form-item label="降温温度阈值">
                <el-input v-model.number="caches.cool" size="small"><template #suffix>℃</template></el-input>
            </el-form-item>
            <el-form-item label="空气湿度阈值">
                <el-input v-model.number="caches.humidify" size="small"><template #suffix>%</template></el-input>
            </el-form-item>
            <el-form-item label="土壤湿度阈值">
                <el-input v-model.number="caches.water" size="small"><template #suffix>%</template></el-input>
            </el-form-item>
            <el-form-item label="光照强度阈值">
                <el-input v-model.number="caches.light" size="small"><template #suffix>LUX</template></el-input>
            </el-form-item>
            <el-form-item label="CO₂ 浓度阈值">
                <el-input v-model.number="caches.fertilizer" size="small"><template #suffix>PPM</template></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showPopup = false">取消</el-button>
            <el-button type="primary" @click="save()">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { DeviceThreshold } from '@/common/constants'
import { ref, toRaw } from 'vue'

const props = defineProps<{ params: DeviceThreshold }>()

const showPopup = ref(false)

// Todo: Form rules --> https://element-plus.org/zh-CN/component/form.html#%E8%A1%A8%E5%8D%95%E6%A0%A1%E9%AA%8C
const caches = ref<DeviceThreshold>(refresh())

function refresh() {
    return { ...props.params }
}

function save() {
    const value = toRaw(caches.value)
    for (const [key, val] of Object.entries(value)) {
        Reflect.set(props.params, key, val)
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
