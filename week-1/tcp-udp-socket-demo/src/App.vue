<template>
    <div class="box flex flex-col">
        <InputView class="flex-grow-1" v-model="logs" hint="还没有日志" readonly />
        <InputView class="flex-grow-1" v-model="my_data" hint="发送点什么……" />
        <div class="flex">
            <el-radio-group v-model="mode" :disabled='connected'>
                <el-radio label="SERVER">服务端模式</el-radio>
                <el-radio label="CLIENT">客户端模式</el-radio>
            </el-radio-group>
            <el-radio-group v-if="wrap" v-model="operation" class="flex-grow-1 justify-end">
                <el-radio-button :label="0">读取</el-radio-button>
                <el-radio-button :label="1">写入</el-radio-button>
                <el-radio-button :label="2">设置</el-radio-button>
            </el-radio-group>
        </div>
        <div class="w-full control-bar">
            <div v-if="mode === 'CLIENT'" class="flex-grow-1">
                <span>服务器地址：</span>
                <el-input class="mono w-12em" v-model="address"></el-input>
                <el-button :disabled="!connected">发送信息</el-button>
                <el-button :disabled="!connected" @click='end'>断开连接</el-button>
                <el-button :disabled="connected" @click='begin'>开始连接</el-button>
            </div>
            <div v-else class="flex-grow-1">
                <span>端口号：</span>
                <el-input
                    v-model="port"
                    class="mono w-5em"
                    input-style="text-align: center;"
                ></el-input>
                <el-button :disabled="!connected" @click='end'>停止接收</el-button>
                <el-button :disabled="connected" @click='begin'>启动接收</el-button>
            </div>
            <el-button @click="quit" type="danger" plain>退出</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { Client, Server } from '@/socket-mix'
import InputView from '@/components/InputView.vue'
import { computed, ref, watchEffect } from 'vue'

const logs = ref('') // 日志
const my_data = ref('') // 要发送的信息

function env(name: string) {
    return window.appBridge.getEnv(name)
}

const wrap = ref(env('WRAP') === '1') // 是否启用自定义协议
const protocol = computed(() => wrap.value ? 'CUSTOM' : env('PROTOCOL') === 'UDP' ? 'UDP' : 'TCP')
const mode = ref(env('MODE') === 'SERVER' ? 'SERVER' : 'CLIENT') // 工作模式（服务端/客户端）
const operation = ref(0) // 操作（R/W/S）

const address = ref('127.0.0.1:21168') // 服务端地址
const port = ref(21168) // 服务端监听端口号

const connected = ref(false)

watchEffect(() => {
    const isServer = mode.value === 'SERVER'
    const protocolName = wrap.value ? '自定义' : `${protocol.value} `
    const localType = wrap.value ? (isServer ? '受控端' : '主控端') : isServer ? '服务端' : '客户端'
    window.appBridge.setTitle(`${protocolName}协议通信程序 - ${localType}`)
})

function quit() {
    window.appBridge.exit()
}

// const server = computed(() => new Server(protocol.value))
// const client = computed(() => new Client(protocol.value))

function begin() {
    connected.value = true
    // if (mode.value == 'SERVER') {
    //     server.value.begin(port.value)
    // } else {
    //     const [ host, port ] = address.value.split(':')
    //     client.value.begin(Number(port), host)
    // }
}

function end() {
    //
    connected.value = false
}
</script>

<style scoped lang="less">
.box {
    @apply w-full h-full;
    box-sizing: border-box;
    padding: 1em;
    gap: 10px;
    font-size: 0.9em;
}

.control-bar {
    display: flex;

    span {
        display: inline-block;
        vertical-align: bottom;
        line-height: 2;
    }

    .mono :deep(input) {
        font-family: 'Source Code Pro', monospace;
    }

    & .el-button {
        float: right;
        margin-left: 10px;
        width: 6em;
        display: inline-block;
    }
}

:global(:is(html, body)) {
    margin: 0;
}

:global(#app) {
    position: fixed;
    inset: 0;
    font-family: 'Noto Sans SC', 'Noto Color Emoji', sans-serif;
}
</style>
