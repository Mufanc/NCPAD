<template>
    <div class="box flex flex-col">
        <InputView class="flex-grow-1" v-model="logs" hint="还没有日志" readonly />
        <InputView class="flex-grow-1" v-model="message" hint="发送点什么……" />
        <div class="flex">
            <el-radio-group v-model="mode" :disabled="connected">
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
                <el-button :disabled="!connected || !message" @click="send">发送信息</el-button>
                <el-button :disabled="!connected" @click="end">断开连接</el-button>
                <el-button :disabled="connected" @click="begin">开始连接</el-button>
            </div>
            <div v-else class="flex-grow-1">
                <span>端口号：</span>
                <el-input
                    v-model="port"
                    class="mono w-5em"
                    input-style="text-align: center;"
                ></el-input>
                <el-button :disabled="!connected" @click="end">停止接收</el-button>
                <el-button :disabled="connected || !message" @click="begin">启动接收</el-button>
            </div>
            <el-button @click="quit" type="danger" plain>退出</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputView from '@/components/InputView.vue'
import { Socket } from '@/socket-mix'
import { computedAsync } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'

const { ipcRenderer } = window.require('electron')

const logs = ref('') // 日志
const message = ref('') // 要发送的信息

async function env(name: string, def: string) {
    return (await ipcRenderer.invoke('GET-ENV', name)) || def
}

const wrap = computedAsync(async () => (await env('WRAP', '0')) === '1') // 是否启用自定义协议
const protocol = computedAsync(async () => (wrap.value ? 'CUSTOM' : await env('PROTOCOL', 'TCP')))
const mode = computedAsync(async () => env('MODE', 'CLIENT')) // 工作模式（服务端/客户端）
const operation = ref(0) // 操作（R/W/S）

const address = ref('127.0.0.1:21168') // 服务端地址
const port = ref(21168) // 服务端监听端口号

const connected = ref(false)

watchEffect(() => {
    const isServer = mode.value === 'SERVER'
    const protocolName = wrap.value ? '自定义' : `${protocol.value} `
    const localType = wrap.value ? (isServer ? '受控端' : '主控端') : isServer ? '服务端' : '客户端'
    ipcRenderer.send('SET-TITLE', `${protocolName}协议通信程序 - ${localType}`)
})

function quit() {
    ipcRenderer.send('EXIT')
}

function logPrint(message: string) {
    logs.value += message + '\n'
}

function formatTime(time: Date) {
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')
    const millis = time.getMilliseconds().toString().padStart(3, '0')
    return `${hours}:${minutes}:${seconds}.${millis}`
}

function formatBuffer(buffer: Buffer) {
    const hex = []
    for (let i = 0; i < buffer.length; i++) {
        hex.push(buffer[i].toString(16).padStart(2, '0'))
    }
    return hex.join(' ')
}

const socket = computed(() => {
    const pro = protocol.value
    return pro ? Socket.create(pro) : null
})

function begin() {
    if (mode.value == 'SERVER') {
        socket.value?.listen(port.value, () => {
            logPrint('服务端启动，等待客户端连接……')
            connected.value = true
        })
    } else {
        const [host, port] = address.value.split(':')
        socket.value?.connect(host, Number(port), () => {
            logPrint('连接成功！')
            connected.value = true
        })
    }

    function bufferPrint(buffer: Buffer, host: string, port: number) {
        logPrint(`数据来源：${host}:${port}`)
        logPrint(`当前数据包时间：${formatTime(new Date())}`)
        logPrint(`当前数据包长度：${buffer.length} 字节`)
        logPrint('当前数据包内容：')
        logPrint(formatBuffer(buffer))
    }

    socket.value?.onAccept(inc => {
        if (inc instanceof Socket) {
            const [host, port] = inc.address()

            logPrint(`客户端：${host}；远程端口：${port}`)

            inc.onClose(() => {
                logPrint('客户端断开连接！')
            })

            inc.onAccept(arg0 => {
                bufferPrint(arg0 as Buffer, host, port)
                inc.send(message.value)
            })
        } else {
            const [host, port] = address.value.split(':')
            bufferPrint(inc, host, Number(port))
        }
    })

    socket.value?.onClose(() => {
        logPrint('连接断开！')
        connected.value = false
    })
}

function send() {
    socket.value?.send(message.value)
    connected.value = true
}

function end() {
    socket.value?.close()
    if (mode.value === 'SERVER') {
        connected.value = false
    }
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
