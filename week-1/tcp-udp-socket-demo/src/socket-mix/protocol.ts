export interface FrameInfo {
    frameNo: number
    command: number
    commandType: 'REQ' | 'ACK'
    message: string
}

export class Protocol {
    static BOF = Buffer.from([0xff, 0x55, 0xff, 0xaa])
    static EOT = 0xfe

    static fno = 0

    static #crc(buffer: Buffer): number {
        let result = 0
        for (let i = 0; i < buffer.length; i++) {
            result = (result + buffer[i]) & 0xff
        }
        return result
    }

    static #encode(command: number, message: String, ack: boolean, fno: number): Buffer {
        if (ack) command |= 0xa0

        const data = Buffer.from(message)
        const data_len = 4 + 1 + data.length + 1 + 1 // FNO(4B) + COMM(1B) + DATA + EOT(1B) + CRC(1B)

        const output = Buffer.alloc(this.BOF.length + 2 + data_len) // BOF(4B) + DLEN(2B) + ...
        let offset = 0

        offset += this.BOF.copy(output, offset)
        offset = output.writeUint16LE(data_len, offset)
        offset = output.writeUInt32LE(fno || this.fno, offset)
        offset = output.writeUint8(command, offset)
        offset += data.copy(output, offset)
        offset = output.writeUint8(this.EOT, offset)

        output.writeUint8(this.#crc(output), offset)

        if (!fno) this.fno += 1 // 帧号递增
        return output
    }

    static command(op: number, message: String) {
        return this.#encode(op, message, false, 0) // 自动分配 FNO
    }

    static reply(info: FrameInfo, message: String) {
        return this.#encode(info.command | 0xa0, message, true, info.frameNo)
    }

    static decode(buffer: Buffer): FrameInfo | null {
        const last = buffer.length - 1
        if (buffer[last] != this.#crc(buffer.subarray(0, last))) {
            return null
        }

        const len = buffer.readUint16LE(4) - 7
        const comm = buffer.readUint8(10)

        return {
            frameNo: buffer.readUint32LE(6),
            command: comm % 0x10,
            commandType: comm >> 4 ? 'ACK' : 'REQ',
            message: buffer.subarray(11, 11 + len).toString(),
        }
    }
}
