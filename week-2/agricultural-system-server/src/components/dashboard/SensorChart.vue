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
    curve: number[]
    yLabel: string
    title: string
}>()

use([SVGRenderer, LineChart, TitleComponent, GridComponent])

const option = computed(() => {
    return {
        title: {
            text: props.title,
            left: 'center',
        },
        xAxis: {
            min: 1,
            max: 60,
            minorTick: {
                show: true,
            },
            axisLabel: {
                show: false,
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
                showSymbol: false,
                clip: true,
                data: props.curve.map((x, i) => [i, x]),
            },
        ],
    }
})
</script>

<style scoped lang="less"></style>
