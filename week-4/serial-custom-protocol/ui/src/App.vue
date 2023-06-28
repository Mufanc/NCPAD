<template>
    <div class="h-full flex flex-col p-20px box-border">
        <div class="flex flex-col flex-grow-1">
            <Logcat ref="logcat" class="flex-grow-1" />
        </div>
        <div>
            <div class="w-full flex my-10px">
                <el-radio-group class="flex-grow-1 justify-end" v-model="op">
                    <el-radio-button :label="1">读取</el-radio-button>
                    <el-radio-button :label="2">写入</el-radio-button>
                    <el-radio-button :label="3">设置</el-radio-button>
                </el-radio-group>
            </div>
            <div class="flex items-center justify-between">
                <SerialSelect v-model="path" />
                <div>
                    <el-button v-show="!serial" @click="open(path)" :disabled="!path"
                        >打开串口</el-button
                    >
                    <el-button v-show="serial" @click="close" :disabled="!path">关闭串口</el-button>
                    <el-button @click="dialog = true" :disabled="!!serial">串口设置</el-button>
                    <el-button @click="command(op)" :disabled="!message || !serial"
                        >发送指令</el-button
                    >
                    <el-button type="danger" @click="ipcRenderer.send('EXIT')" plain
                        >退出程序</el-button
                    >
                    <el-dialog v-model="dialog" title="串口设置" align-center>
                        <el-form>
                            <el-form-item label="波特率">
                                <BaudSelect v-model="baud" />
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import fs from 'fs/promises'
import { Command, Protocol, StreamReader } from '@/common/protocol'
import BaudSelect from '@/components/BaudSelect.vue'
import Logcat from '@/components/Logcat.vue'
import SerialSelect from '@/components/SerialSelect.vue'
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import { SerialPort } from 'serialport'
import sudo from 'sudo-prompt'
import { ref } from 'vue'
import 'element-plus/theme-chalk/el-message.css'

const recv = ref('')
const message = ref('Hello, World!')
const op = ref<Command['op']>(1)

const path = ref('')
const serial = ref<SerialPort | null>(null)
const baud = ref(2400)

const dialog = ref(false)
const logcat = ref<InstanceType<typeof Logcat> | null>(null)

async function chown(path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            await fs.access(path, fs.constants.R_OK | fs.constants.W_OK)
            resolve()
        } catch (err) {
            sudo.exec(`chmod 666 ${path}`, { name: 'chown' }, error =>
                error ? reject() : resolve()
            )
        }
    })
}

async function open(path: string) {
    await chown(path)

    const sp = new SerialPort({ path, baudRate: baud.value }, err => {
        if (err) {
            ElMessage.error(err.message)
            close()
        }
    })
    serial.value = sp

    const reader = new StreamReader(frame => {
        if (!frame) {
            logcat.value?.log('数据帧校验失败！')
            return
        }

        const name = ['读', '写', '设置'][frame.command.op - 1]
        const type = ['', '应答'][frame.command.ty]

        logcat.value?.log(
            `收到${name}${type}指令，字符串内容为：${frame.message}，帧号为：${frame.frameNo}`
        )
    })

    sp.on('data', (buffer: Buffer) => {
        reader.append(buffer)
    })

    sp.on('close', () => close())
}

function command(op: Command['op']) {
    serial.value?.write(Protocol.encode(Command.of(op), `${op}`))
}

function close() {
    serial.value?.isOpen && serial.value?.close()
    serial.value = null
}
</script>

<style scoped>
:global(:is(html, body)) {
    @apply w-full, h-full;
    margin: 0;
}

:global(#app) {
    @apply w-full, h-full;
}
</style>
