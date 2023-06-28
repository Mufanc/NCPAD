;
// import { Server, Socket, createServer } from 'net'

import { Sensor, SensorData } from "@/common/device-utils";
import { Protocol } from "@/common/protocol";
import { useConfigStore } from "@/store/configs";
import { Ref } from "vue";


const { Server, Socket, createServer } = window.require('net')

type Server = typeof Server
type Socket = typeof Socket

export class AgriServer {
    static #instance?: AgriServer

    static init() {
        if (!this.#instance) {
            this.#instance = new AgriServer()
        }
    }

    private readonly server: Server

    private constructor() {
        const configs = useConfigStore()
        const sensor: Ref<SensorData> = Sensor.instance().loadAll()

        this.server = createServer((client: Socket) => {
            console.log(`New client connection from: ${client.remoteAddress}:${client.remotePort}`)

            client.on('data', (buffer: Buffer) => {
                const frame = Protocol.decode(buffer)
                if (!frame) return
                frame.command.ty = 1 // Set to ACK
                switch (frame.command.op) {
                    case 1: // READ
                        const [buffer] = Protocol.encode(
                            frame.command,
                            JSON.stringify({
                                baseNo: configs.baseNo,
                                automaticMode: configs.automaticMode,
                                standbyMode: configs.standbyMode,
                                devSwitches: configs.devSwitches,
                                sensor: sensor.value,
                                params: configs.deviceParams,
                            }),
                            frame.frameNo
                        )
                        client.write(buffer)
                        break
                    case 2: // WRITE
                        const [key, value] = JSON.parse(frame.message)
                        if (key === 'devSwitches') {
                            for (const i in configs.devSwitches) {
                                configs.devSwitches[i] = value[i]
                            }
                        } else {
                            Reflect.set(configs, key, value)
                        }
                        client.write(Protocol.encode(frame.command, '', frame.frameNo)[0])
                        break
                    case 3: // SET
                        const params = JSON.parse(frame.message)
                        for (const [key, val] of Object.entries(params)) {
                            Reflect.set(configs.deviceParams, key, val)
                        }
                        client.write(Protocol.encode(frame.command, '', frame.frameNo)[0])
                        break
                }
            })
        })

        this.server.listen(Protocol.PORT)
    }
}