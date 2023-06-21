const { Socket: TcpClient, Server: TcpServer } = window.require('net') // TCP
const { Socket: UdpSocketRaw, createSocket } = window.require('dgram') // UDP

// import { Socket as TcpClient, Server as TcpServer } from 'net'
// import { Socket as UdpSocketRaw } from 'dgram'

type TcpClient = typeof TcpClient
type TcpServer = typeof TcpServer
type UdpSocketRaw = typeof UdpSocketRaw
type ProtocolType = 'TCP' | 'UDP'

export { Protocol } from './protocol'

export abstract class Socket {
    static create(protocol: ProtocolType): Socket {
        switch (protocol) {
            case 'TCP':
                return new TcpSocket()
            case 'UDP':
                return new UdpSocket()
        }
    }

    abstract address(): [string, number]
    abstract listen(port: number, callback: () => void): void
    abstract connect(host: string, port: number, callback?: () => void): void
    abstract send(data: string | Buffer): void
    abstract onAccept(callback: (arg0: Socket | Buffer) => void): void
    abstract close(): void
    abstract onClose(callback: () => void): void
}

class TcpSocket extends Socket {
    #raw?: TcpClient | TcpServer

    constructor(client?: TcpClient) {
        super()
        client && (this.#raw = client)
    }

    address(): [string, number] {
        const raw = this.#raw as TcpClient
        return [raw?.remoteAddress!, raw?.remotePort!]
    }

    listen(port: number, callback: () => void) {
        this.#raw = new TcpServer()
        this.#raw.listen(port, '0.0.0.0', callback)
    }

    connect(host: string, port: number, callback: () => void): void {
        this.#raw = new TcpClient()
        this.#raw.connect(port, host, callback)
    }

    send(data: string | Buffer) {
        const raw = this.#raw as TcpClient
        raw?.write(data)
    }

    onAccept(callback: (arg0: Socket | Buffer) => void) {
        if (this.#raw instanceof TcpServer) {
            this.#raw?.on('connection', (client: TcpClient) => callback(new TcpSocket(client)))
        } else {
            this.#raw?.on('data', callback)
        }
    }

    close() {
        if (this.#raw instanceof TcpServer) {
            this.#raw.close()
        } else {
            this.#raw?.end()
        }
    }

    onClose(callback: () => void) {
        this.#raw?.on('close', callback)
    }
}

class UdpSocket extends Socket {
    #raw: UdpSocketRaw
    #bound: boolean = false
    #isServer?: boolean

    constructor(socket?: UdpSocketRaw) {
        super()
        this.#raw = socket || createSocket('udp4')
    }

    address(): [string, number] {
        const info = this.#isServer ? this.#raw.address() : this.#raw.remoteAddress()
        return [info.address, info.port]
    }

    close(): void {}

    connect(host: string, port: number, callback: () => void): void {
        this.#raw.connect(port, host, callback)
        this.#isServer = false
    }

    listen(port: number, callback: () => void): void {
        if (!this.#bound) {
            this.#raw.bind(port, () => {
                this.#bound = true
                callback()
            })
        } else {
            callback()
        }
        this.#isServer = true
    }

    onAccept(callback: (arg0: Socket | Buffer) => void): void {
        this.#raw.on('message', callback)
    }

    onClose(callback: () => void): void {}

    send(data: string | Buffer): void {
        this.#raw.send(data, () => {
            this.#raw.disconnect()
        })
    }
}
