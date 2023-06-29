<template>
    <div class="h-full flex flex-col box-border">
        <div class="flex flex-col flex-grow-1">
            <Logcat ref="logcat" class="flex-grow-1" />
        </div>
        <div class="flex items-center justify-between py-10px">
            <SerialSelect v-model="path" />
            <div>
                <el-button v-show="!serial" @click="open(path)" :disabled="!path"
                    >打开串口</el-button
                >
                <el-button v-show="serial" @click="close" :disabled="!path" type="warning" plain
                    >关闭串口</el-button
                >
                <el-button @click="dialog = true" :disabled="!!serial">串口设置</el-button>
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
</template>

<script setup lang="ts">
import fs from 'fs/promises'
import BaudSelect from '@/components/pages-serial/BaudSelect.vue'
import Logcat from '@/components/pages-serial/Logcat.vue'
import SerialSelect from '@/components/pages-serial/SerialSelect.vue'
import { ElMessage } from 'element-plus'
import { SerialPort } from 'serialport'
import sudo from 'sudo-prompt'
import { ref, toRaw } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import { Env } from '@/common/env'
import EventBus from '@/common/event-bus'
import { bufferToString } from '@/common/utils'

const dialog = ref(false)
const logcat = ref<InstanceType<typeof Logcat> | null>(null)

const path = ref('')
const serial = ref<SerialPort | null>(null)
const baud = ref(115200)

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
        EventBus.emit('SET-BEGIN-TIME', new Date().getTime())
    })
    serial.value = sp

    sp.on('data', (buffer: Buffer) => {
        const env = Env.unpack(buffer)

        logcat.value?.log(bufferToString(buffer) + (env ? '[\u2713]' : '[\u2717]'))

        if (env) EventBus.emit('SENSOR-UPDATE', env)
    })

    sp.on('close', () => close())
}

function close() {
    serial.value?.isOpen && toRaw(serial.value)?.close()
    serial.value = null
    EventBus.emit('SET-BEGIN-TIME', 0)
}
</script>

<style scoped></style>
