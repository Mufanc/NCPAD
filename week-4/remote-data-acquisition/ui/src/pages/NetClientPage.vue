<template>
    <div class="h-full flex flex-col box-border">
        <div class="flex flex-col flex-grow-1">
            <Logcat ref="logcat" class="flex-grow-1" />
        </div>
        <div class="flex items-center py-10px justify-between">
            <div>
                发送端 IP：
                <Ipv4Input v-model="ipaddr" class="inline-block" />
            </div>
            <div>
                <el-button @click="connect" v-show="!connected" :disabled="!ipaddr"
                    >发起连接</el-button
                >
                <el-button @click="close" v-show="connected" type="warning" plain
                    >断开连接</el-button
                >
                <el-button @click="launch" v-show="!active" :disabled="!connected"
                    >开始采集</el-button
                >
                <el-button @click="stop" v-show="active" type="warning" plain>停止采集</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Socket } from 'net'
import EventBus from '@/common/event-bus'
import { Command, Protocol } from '@/common/protocol'
import { bufferToString, getCommandType } from '@/common/utils'
import Ipv4Input from '@/components/pages-network/Ipv4Input.vue'
import Logcat from '@/components/pages-serial/Logcat.vue'
import { ref } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'

const logcat = ref<InstanceType<typeof Logcat> | null>(null)

const ipaddr = ref('')
const socket = new Socket()
const connected = ref(false)
const active = ref(false)
let loopTimer: number | null = null

socket.on('close', () => {
    stop()
    connected.value = false
})

socket.on('error', err => {
    ElMessage.error(err.message)
})

socket.on('data', buffer => {
    const frame = Protocol.decode(buffer)
    if (!frame) {
        logcat.value?.log('数据帧 CRC 校验失败！')
        return
    }

    logcat.value?.log(`${getCommandType(frame.command)}：${bufferToString(buffer)}`)

    switch (frame.command.op) {
        case 1:
            const buffer = Buffer.alloc(10)
            frame.message.copy(buffer)

            function rf(off: number) {
                const val = buffer.readFloatBE(off)
                buffer.writeUint32LE(0, off)
                console.log(val)
                return val
            }

            EventBus.emit('SENSOR-UPDATE', {
                v2: rf(6),
                v1: rf(4),
                ill: rf(2),
                T: rf(0),
            })
            break
        case 2:
            break
        case 3:
            const begin = Number(frame.message.readBigUint64LE())
            if (begin === 0) {
                ElMessage.error('发送端未开启数据采集！')
                break
            }
            active.value = true
            EventBus.emit('SET-BEGIN-TIME', begin)
            loopTimer = window.setInterval(
                () => socket.write(Protocol.encode(Command.READ, Buffer.alloc(0))),
                250
            )
            break
    }
})

function connect() {
    socket.connect(21168, '127.0.0.1', () => {
        connected.value = true
        logcat.value?.log('连接成功！')
    })
}

function close() {
    socket.end()
}

function launch() {
    socket.write(Protocol.encode(Command.SET, Buffer.alloc(0)))
}

function stop() {
    active.value = false
    loopTimer && window.clearInterval(loopTimer)
}
</script>

<style scoped></style>
