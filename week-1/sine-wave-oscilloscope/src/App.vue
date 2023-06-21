<template>
    <div class="flex flex-col h-full">
        <v-chart class="w-full flex-grow-1" :option="option" autoresize />
        <div class="w-full">
            <button class="draw-button" @click="draw">绘制曲线</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'

use([SVGRenderer, LineChart, TitleComponent, GridComponent])

function generate() {
    const sample = []

    for (let x = 0; x <= 10; x += 0.01) {
        sample.push([x, Math.sin(2 * Math.PI * x)])
    }

    return sample
}

function rangeAxis(name: string, min: number, max: number) {
    return {
        name,
        min,
        max,
        minorTick: {
            show: true,
        },
        minorSplitLine: {
            show: true,
        },
    }
}

const data = ref<number[][]>([])

const option = computed(() => {
    return {
        title: {
            text: 'y = sin(2πx)',
            left: 'center',
        },
        xAxis: rangeAxis('x', 0, 10),
        yAxis: rangeAxis('y', -1.1, 1.1),
        series: [
            {
                type: 'line',
                showSymbol: false,
                clip: true,
                data: data.value,
            },
        ],
    }
})

function draw() {
    data.value = generate()
}
</script>

<style scoped>
.draw-button {
    @apply mx-auto block;
    background: linear-gradient(135deg, #6e8efb, #a777e3);;
    border: none;
    color: white;
    padding: 1em 2.5em;
    text-align: center;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    margin-bottom: 1em;
    outline: none;
}

:global(:is(html, body)) {
    @apply w-full, h-full;
    margin: 0;
}

:global(#app) {
    @apply w-full, h-full;
}
</style>
