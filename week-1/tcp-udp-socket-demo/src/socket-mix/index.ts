const { Socket: TcpClient, Server: TcpServer } = window.require('net') // TCP
type TcpClient = typeof TcpClient
type TcpServer = typeof TcpServer
// import { Socket as UdpSocketSys } from 'node:dgram'  // UDP

type ProtocolType = 'TCP' | 'UDP' | 'CUSTOM'

export abstract class Socket {
    static create(protocol: ProtocolType): Socket {
        switch (protocol) {
            case 'TCP':
                return new TcpSocket()
            case 'UDP':
                throw 'Not Implemented!'
            // return new UdpSocket();
            case 'CUSTOM':
                throw 'Not Implemented!'
            // return new WrapSocket();
        }
    }

    abstract address(): [string, number]
    abstract listen(port: number, callback: () => void): void
    abstract connect(host: string, port: number, callback: () => void): void
    abstract send(message: string): void
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
        return [this.#raw.remoteAddress, this.#raw.remotePort]
    }

    listen(port: number, callback: () => void) {
        this.#raw = new TcpServer()
        this.#raw.listen(port, '0.0.0.0', callback)
    }

    connect(host: string, port: number, callback: () => void): void {
        this.#raw = new TcpClient()
        this.#raw.connect(port, host, callback)
    }

    send(message: string) {
        this.#raw.write(message)
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

// class UdpSocket extends Socket {
//
// }
//
// class WrapSocket extends Socket {
//
// }
