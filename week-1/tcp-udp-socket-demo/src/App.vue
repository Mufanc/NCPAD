<template>
    <div class="box flex flex-col">
        <InputView
            v-if="protocol !== 'UDP' || mode == 'RX'"
            class="flex-grow-1"
            v-model="logs"
            hint="还没有日志"
            readonly
        />
        <InputView
            v-if="protocol !== 'UDP' || mode == 'TX'"
            class="flex-grow-1"
            v-model="message"
            :hint="mode == 'TX' ? '发送点什么……' : '响应信息'"
            :readonly="mode == 'RX' && connected"
            :lock="connected"
        />
        <div class="flex">
            <el-radio-group v-model="mode" :disabled="connected">
                <el-radio label="RX">{{ protocol === 'UDP' ? '接收' : '服务' }}端模式</el-radio>
                <el-radio label="TX">{{ protocol === 'UDP' ? '发送' : '客户' }}端模式</el-radio>
            </el-radio-group>
            <el-radio-group v-if="wrap && mode === 'TX'" v-model="command" class="flex-grow-1 justify-end">
                <el-radio-button :label="1">读取</el-radio-button>
                <el-radio-button :label="2">写入</el-radio-button>
                <el-radio-button :label="3">设置</el-radio-button>
            </el-radio-group>
        </div>
        <div class="w-full control-bar">
            <span v-if="mode === 'RX'">端口号：</span>
            <span v-if="mode === 'TX'">{{ protocol === 'UDP' ? '对端' : '服务器' }}地址：</span>
            <el-input v-if="mode === 'TX'" class="mono w-12em" v-model="address"></el-input>
            <el-input
                v-if="mode === 'RX'"
                v-model="port"
                class="mono w-5em"
                input-style="text-align: center;"
            ></el-input>
            <el-button @click="quit" type="danger" plain>退出</el-button>
            <el-button v-if="mode === 'TX'" :disabled="!connected && protocol !== 'UDP'" @click="send"
                >发送信息</el-button
            >
            <el-button v-if="mode === 'TX' && protocol !== 'UDP'" :disabled="!connected" @click="end"
                >断开连接</el-button
            >
            <el-button v-if="mode === 'TX' && protocol !== 'UDP'" :disabled="connected" @click="begin"
                >开始连接</el-button
            >
            <el-button v-if="mode === 'RX'" :disabled="!connected" @click="end">停止接收</el-button>
            <el-button v-if="mode === 'RX'" :disabled="connected || (!message && protocol !== 'UDP')" @click="begin"
                >启动接收</el-button
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import InputView from '@/components/InputView.vue'
import { Protocol, Socket } from '@/socket-mix'
import { computedAsync } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { ref, watch, watchEffect } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import { FrameInfo } from '@/socket-mix/protocol'

const { ipcRenderer } = window.require('electron')

const logs = ref('') // 日志
const message = ref('') // 要发送的信息

async function env(name: string, def: string) {
    return (await ipcRenderer.invoke('GET-ENV', name)) || def
}

const wrap = computedAsync(async () => (await env('WRAP', '0')) === '1') // 是否启用自定义协议
const protocol = computedAsync(async () => await env('PROTOCOL', 'TCP'))
const mode = computedAsync(async () => env('MODE', 'TX')) // 工作模式（服务端/客户端）
const command = ref(1) // 操作（R/W/S）

const address = ref('127.0.0.1:21168') // 服务端地址
const port = ref(21168) // 服务端监听端口号

const connected = ref(false)

watchEffect(() => {
    const isServer = mode.value === 'RX'
    const protocolName = wrap.value ? '自定义' : `${protocol.value} `
    const localType = wrap.value ? (isServer ? '受控端' : '主控端') : isServer ? '服务端' : '客户端'
    if (protocol.value === 'UDP') {
        ipcRenderer.send('SET-TITLE', `${protocolName}协议通信程序`)
    } else {
        ipcRenderer.send('SET-TITLE', `${protocolName}协议通信程序 - ${localType}`)
    }
})

function quit() {
    ipcRenderer.send('EXIT')
}

function parseAddress(): [string, number] {
    const [host, port] = address.value.split(':')
    return [host, Number(port)]
}

function logPrint(message: string) {
    logs.value += message + '\n'
    logs.value += '-'.repeat(50) + '\n'
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
    if (wrap.value) {
        return hex.join(' ')
    } else {
        return `${hex.join(' ')} = "${buffer.toString()}"`
    }
}

let socket: Socket | null
const stop = watch(
    protocol,
    value => {
        if (value) {
            socket = Socket.create(value)
            stop()
        }
    },
    { immediate: true }
)

function begin() {
    if (mode.value == 'RX') {
        console.log('??', socket)
        socket?.listen(port.value, () => {
            logPrint('服务端启动，等待客户端连接……')
            connected.value = true
        })
    } else {
        socket?.connect(...parseAddress(), () => {
            logPrint('连接成功！')
            connected.value = true
        })
    }

    function bufferPrint(buffer: Buffer, host: string, port: number) {
        const output = [
            `数据来源：${host}:${port}`,
            `当前数据包时间：${formatTime(new Date())}`,
            `当前数据包长度：${buffer.length} 字节`,
            '当前数据包内容：',
            formatBuffer(buffer),
        ]
        logPrint(output.join('\n'))
    }

    function framePrint(info: FrameInfo | null) {
        if (!info) {
            logPrint('CRC 校验失败！')
            return
        }

        const names = ['读', '写', '参数设置']
        const types = { REQ: '', ACK: '应答' }

        logPrint(
            `收到${names[info.command - 1]}${types[info.commandType]}指令，字符串内容为：${info.message}，帧号为 ${
                info.frameNo
            }`
        )
    }

    socket?.onAccept(inc => {
        if (inc instanceof Buffer) {
            bufferPrint(inc, ...parseAddress())
            framePrint(Protocol.decode(inc))
            return
        }

        const [host, port] = inc.address()

        logPrint(`客户端：${host}；远程端口：${port}`)

        inc.onClose(() => {
            logPrint('客户端断开连接！')
        })

        inc.onAccept(arg0 => {
            const buffer = arg0 as Buffer
            bufferPrint(buffer, host, port)

            if (!wrap.value) {
                inc.send(message.value)
                return
            }

            const info = Protocol.decode(buffer)
            framePrint(info)

            info && inc.send(Protocol.reply(info, message.value))
        })
    })

    socket?.onClose(() => {
        logPrint('连接断开！')
        connected.value = false
    })
}

function send() {
    const mv = message.value
    if (!mv) {
        ElMessage.error('发送信息不能为空')
        return
    }

    if (!socket) return
    if (protocol.value === 'UDP') {
        socket.connect(...parseAddress(), () => socket?.send(mv))
    } else {
        socket.send(wrap.value ? Protocol.command(command.value, mv) : mv)
    }

    connected.value = true
}

function end() {
    socket?.close()
    if (mode.value === 'RX') {
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
