export interface Command {
    op: 1 | 2 | 3 // READ WRITE SET
    ty: 0 | 1 // REQ ACK
}

export class Command {
    static READ: Command = { op: 1, ty: 0 }
    static WRITE: Command = { op: 2, ty: 0 }
    static SET: Command = { op: 3, ty: 0 }
}

export interface FrameInfo {
    frameNo: number
    message: string
    command: Command
}

export class Protocol {
    static PORT = 21168

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

    static encode(command: Command, message: String, fno: number = 0): [Buffer, number] {
        if (!fno) this.fno += 1 // 帧号递增

        const fnoSend = fno || this.fno
        const data = Buffer.from(message)
        const data_len = 4 + 1 + data.length + 1 + 1 // FNO(4B) + COMM(1B) + DATA + EOT(1B) + CRC(1B)

        const output = Buffer.alloc(this.BOF.length + 2 + data_len) // BOF(4B) + DLEN(2B) + ...
        let offset = 0

        offset += this.BOF.copy(output, offset)
        offset = output.writeUint16LE(data_len, offset)
        offset = output.writeUInt32LE(fnoSend, offset)
        offset = output.writeUint8(command.op | (command.ty * 0xa0), offset)
        offset += data.copy(output, offset)
        offset = output.writeUint8(this.EOT, offset)

        output.writeUint8(this.#crc(output), offset)

        return [output, fnoSend]
    }

    static decode(buffer: Buffer): FrameInfo | null {
        const last = buffer.length - 1
        if (buffer[last] != this.#crc(buffer.subarray(0, last))) {
            return null
        }

        const len = buffer.readUint16LE(4) - 7
        const comm = buffer.readUint8(10)

        // noinspection JSBitwiseOperatorUsage
        return {
            frameNo: buffer.readUint32LE(6),
            message: buffer.subarray(11, 11 + len).toString(),
            command: {
                op: (comm & 0x0f) as any,
                ty: comm & 0xa0 ? 1 : 0,
            },
        }
    }
}
