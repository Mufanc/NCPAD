import { Socket as TcpClient, Server as TcpServer } from 'node:net'  // TCP
// import { Socket as UdpSocket} from 'node:dgram'  // UDP

type ProtocolType = 'TCP' | 'UDP' | 'CUSTOM'

export interface ISocket {
    begin(port: number, addr?: string): void
    end(): void
}

// export interface ISocketConstructor {
//     new(protocol: 'TCP' | 'UDP' | 'CUSTOM'): void
// }

export class Server implements ISocket {
    #protocol: ProtocolType
    #server: TcpServer

    constructor(protocol: ProtocolType) {
        this.#protocol = protocol
        this.#server = new TcpServer()
    }

    begin(port: number, addr?: string): void {
        this.#server.listen(port, addr || '0.0.0.0')
    }

    end(): void {
    }
}

export class Client implements ISocket {
    #protocol: ProtocolType
    #client: TcpClient

    constructor(protocol: ProtocolType) {
        this.#protocol = protocol
        this.#client = new TcpClient()
    }

    begin(port: number, addr: string) {
        this.#client.connect(port, addr)
    }

    end() {

    }
}
