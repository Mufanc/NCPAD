<template>
    <div class="h-full flex flex-col box-border">
        <div class="flex flex-col flex-grow-1">
            <Logcat ref="logcat" class="flex-grow-1" />
        </div>
        <div class="flex items-center py-10px justify-end">
            <div>
                <el-button @click="listen" v-show="!listening">监听网络</el-button>
                <el-button @click="stop" v-show="listening" type="warning" plain
                    >停止监听</el-button
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Server } from 'net'
import { Env } from '@/common/env'
import EventBus from '@/common/event-bus'
import { Protocol } from '@/common/protocol'
import { bufferToString, getCommandType } from '@/common/utils'
import Logcat from '@/components/pages-serial/Logcat.vue'
import { ref } from 'vue'

const env = ref<Env>()
const logcat = ref<InstanceType<typeof Logcat> | null>(null)

EventBus.on('SENSOR-UPDATE', val => (env.value = val))

const server = new Server()
const listening = ref(false)

function listen() {
    server.listen(21168, '0.0.0.0', () => {
        listening.value = true
        logcat.value?.log('服务端启动，等待客户端连接……')

        server.on('connection', client => {
            logcat.value?.log(`客户端：${client.remoteAddress}；远程端口：${client.remotePort}`)

            client.on('data', buffer => {
                const frame = Protocol.decode(buffer)
                if (!frame) {
                    logcat.value?.log('数据帧 CRC 校验失败！')
                    return
                }

                logcat.value?.log(`${getCommandType(frame.command)}：${bufferToString(buffer)}`)

                frame.command.ty = 1 // 设置响应
                switch (frame.command.op) {
                    case 1:
                        const ev = env.value!
                        const buffer = Buffer.alloc(10)

                        buffer.writeFloatBE(ev.T, 0)
                        buffer.writeFloatBE(ev.ill, 2)
                        buffer.writeFloatBE(ev.v1, 4)
                        buffer.writeFloatBE(ev.v2, 6)

                        console.log(buffer)

                        client.write(
                            Protocol.encode(frame.command, buffer.subarray(0, 8), frame.frameNo)
                        )
                        break
                    case 2:
                        break
                    case 3:
                        const listener = (value: number) => {
                            EventBus.off('GET-BEGIN-TIME-ACK', listener)

                            const buffer = Buffer.alloc(8)
                            buffer.writeBigUint64LE(BigInt(value))

                            client.write(Protocol.encode(frame.command, buffer, frame.frameNo))
                        }

                        EventBus.on('GET-BEGIN-TIME-ACK', listener)
                        EventBus.emit('GET-BEGIN-TIME')

                        break
                }
            })

            client.on('close', () => {
                logcat.value?.log(`客户端：${client.remoteAddress}:${client.remotePort} 断开连接！`)
            })
        })
    })
}

function stop() {
    server.once('close', () => logcat.value?.log('服务端关闭！'))
    server.close()
    listening.value = false
}
</script>

<style scoped></style>
