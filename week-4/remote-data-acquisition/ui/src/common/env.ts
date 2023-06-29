import { verify } from 'crypto'

export interface Env {
    v1: number // 第一路电压
    v2: number // 第二路电压
    T: number // 温度
    ill: number // 光照强度
}

export class Env {
    private static verify(buffer: Buffer) {
        if (buffer.length !== 7 || buffer[0] !== 0xa5) return false
        const checksum = buffer.subarray(0, buffer.length - 1).reduce((a, b) => (a + b) & 0xff)
        return buffer[buffer.length - 1] === checksum
    }

    static unpack(buffer: Buffer): Env | null {
        if (!this.verify(buffer)) return null

        const keys: Array<keyof Env> = ['v1', 'v2', 'T', 'ill']
        const entries = keys.map((key, i) => {
            const p = (buffer[i + 1] << 2) + ((buffer[5] >> (i * 2)) % 4)
            switch (key) {
                case 'v1':
                case 'v2':
                    return [key, p / 10]
                case 'T':
                    return [key, -p / 15 + 58]
                case 'ill':
                    return [key, p]
            }
        })

        return Object.fromEntries(entries)
    }
}
