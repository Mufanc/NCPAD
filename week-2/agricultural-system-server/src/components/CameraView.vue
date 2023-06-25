<template>
    <div
        class="bg-black box-border"
        :style="{ padding: padding + 'px' }"
        ref="container"
        v-loading="loading"
        element-loading-background="transparent"
    >
        <div class="no-video-box" :class="{ pause: standbyMode }">
            <span ref="ball" class="no-video">No Video!</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store/configs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

const padding = 10

const ball = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)

const moveX = ref(0)
const moveY = ref(0)

const bounceTranslateX = computed(() => `translateX(${moveX.value}px)`)
const bounceTranslateY = computed(() => `translateY(${moveY.value}px)`)

const bounceAnimationX = computed(() => `bounce-x linear ${moveX.value / 50}s infinite`)
const bounceAnimationY = computed(() => `bounce-y linear ${moveY.value / 50}s infinite`)

const { standbyMode } = storeToRefs(useConfigStore())

const noVideo = ref<'initial' | 'hidden'>('hidden')
const loading = ref(true)
let loadingTimer: number | null = null

watch(
    standbyMode,
    value => {
        if (value) {
            noVideo.value = 'hidden'
            loading.value = false
            loadingTimer && window.clearTimeout(loadingTimer)
        } else {
            loading.value = true
            loadingTimer = window.setTimeout(() => {
                loading.value = false
                window.setTimeout(() => (noVideo.value = 'initial'), 1000)
            }, 5000)
        }
    },
    { immediate: true }
)

onMounted(() => {
    const elb = ball.value!
    const elc = container.value!
    const observer = new ResizeObserver(() => {
        moveX.value = elc.clientWidth - elb.clientWidth - 2 * padding
        moveY.value = elc.clientHeight - elb.clientHeight - 2 * padding
    })
    observer.observe(elb)
    observer.observe(elc)
})
</script>

<style>
@keyframes bounce-x {
    0%,
    100% {
        transform: translateX(0);
    }
    50% {
        transform: v-bind(bounceTranslateX);
    }
}

@keyframes bounce-y {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: v-bind(bounceTranslateY);
    }
}
</style>

<style scoped lang="less">
.no-video-box {
    animation: v-bind(bounceAnimationY);

    &.pause {
        animation-play-state: paused;
    }
}

.no-video {
    @apply color-white inline-block;
    font-size: 4em;
    animation: v-bind(bounceAnimationX);
    visibility: v-bind(noVideo);

    &:is(.pause > *) {
        animation-play-state: paused;
    }
}
</style>
