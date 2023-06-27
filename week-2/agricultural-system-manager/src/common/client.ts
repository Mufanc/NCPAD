// import { Socket } from 'net'
import { ClientInfo, DeviceThreshold } from '@/common/constants'
import { Command, FrameInfo, Protocol } from '@/common/protocol'
import { toRaw } from 'vue'

const { Socket } = window.require('net')

type Socket = typeof Socket

export class AgriClient {
    static TIMEOUT = 5000

    private readonly ipaddr: string
    private readonly socket: Socket

    constructor(ip: string, onclose: (error?: boolean) => void) {
        this.ipaddr = ip
        this.socket = new Socket()
        this.socket.connect(Protocol.PORT, ip, () => {
            console.log(`Tcp connected to ${ip}:${Protocol.PORT}`)
        })
        this.socket.on('close', onclose)
    }

    private wait(fno: number, callback: (frame: FrameInfo) => void) {
        const listener = (buffer: Buffer) => {
            const frame = Protocol.decode(buffer)
            if (!frame) return
            if (frame.frameNo === fno && frame.command.ty === 1) {
                this.socket.off('data', listener)
                callback(frame)
            }
        }

        this.socket.on('data', listener)
    }

    async read(): Promise<ClientInfo> {
        const socket = toRaw(this.socket)

        return new Promise((resolve, reject) => {
            const [buffer, fno] = Protocol.encode(Command.READ, '')
            socket.write(buffer)

            this.wait(fno, frame => {
                resolve({
                    ipaddr: this.ipaddr,
                    ...JSON.parse(frame.message),
                })
            })

            setTimeout(() => reject('Read timeout!'), AgriClient.TIMEOUT)
        })
    }

    async write(key: string, value: any): Promise<void> {
        const socket = toRaw(this.socket)

        return new Promise((resolve, reject) => {
            const [buffer, fno] = Protocol.encode(Command.WRITE, JSON.stringify([key, value]))
            socket.write(buffer)

            this.wait(fno, () => resolve())

            setTimeout(() => reject('Write timeout!'), AgriClient.TIMEOUT)
        })
    }

    async set(value: DeviceThreshold): Promise<void> {
        const socket = toRaw(this.socket)

        return new Promise((resolve, reject) => {
            const [buffer, fno] = Protocol.encode(Command.SET, JSON.stringify(value))
            socket.write(buffer)

            this.wait(fno, () => resolve())

            setTimeout(() => reject('Set timeout!'), AgriClient.TIMEOUT)
        })
    }
}
