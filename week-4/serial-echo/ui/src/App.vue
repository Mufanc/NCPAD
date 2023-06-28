<template>
    <el-container class="h-full">
        <el-main class="flex flex-col">
            <InputView class="flex-grow-1" v-model="recv" hint="还没有收到信息……" readonly />
            <InputView class="flex-grow-1 mt-10px" v-model="message" hint="发送点什么……" />
        </el-main>
        <el-footer>
            <div class="h-full flex items-center justify-between">
                <SerialSelect v-model="path" />
                <div>
                    <el-button v-show="!serial" @click="open(path)" :disabled="!path"
                        >打开串口</el-button
                    >
                    <el-button v-show="serial" @click="close" :disabled="!path">关闭串口</el-button>
                    <el-button @click="dialog = true" :disabled="!!serial">串口设置</el-button>
                    <el-button @click="serial?.write(message)" :disabled="!message || !serial"
                        >发送信息</el-button
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
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import fs from 'fs/promises'
import BaudSelect from '@/components/BaudSelect.vue'
import InputView from '@/components/InputView.vue'
import SerialSelect from '@/components/SerialSelect.vue'
import { ipcRenderer } from 'electron'
import { SerialPort } from 'serialport'
import sudo from 'sudo-prompt'
import { ref, toRaw } from 'vue'

const recv = ref('')
const message = ref('Hello, World!')

const path = ref('')
const serial = ref<SerialPort | null>(null)
const baud = ref(2400)

const dialog = ref(false)

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

    const sp = new SerialPort({ path, baudRate: baud.value })
    serial.value = sp

    sp.on('data', (buffer: Buffer) => {
        recv.value += buffer
            .toString('hex')
            .replace(/(.{2})/g, '$1 ')
            .toUpperCase()
    })

    sp.on('close', () => close())
}

function close() {
    serial.value?.isOpen && toRaw(serial.value)?.close()
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
