<template>
    <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

const props = defineProps<{
    title: string
    yLabel: string
    duration: number
    data: [number, number][]
}>()

use([SVGRenderer, LineChart, TitleComponent, GridComponent])

const option = computed(() => {
    return {
        title: {
            text: props.title,
            left: 'center',
        },
        xAxis: {
            name: '时间（秒）',
            min: props.data[0]?.[0],
            max: props.data[0]?.[0] + props.duration,
            minorTick: {
                show: true,
            },
        },
        yAxis: {
            name: props.yLabel,
            minorTick: {
                show: true,
            },
        },
        series: [
            {
                type: 'line',
                smooth: 1,
                showSymbol: false,
                clip: true,
                data: props.data,
            },
        ],
    }
})
</script>

<style scoped></style>
