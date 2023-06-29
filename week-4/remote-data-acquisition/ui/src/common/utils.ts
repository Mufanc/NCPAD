import { Command } from '@/common/protocol'

export function bufferToString(buffer: Buffer): string {
    return buffer
        .toString('hex')
        .toUpperCase()
        .replace(/(.{2})/g, '$1 ')
}

export function getCommandType(command: Command): string {
    const name = ['读', '写', '设置'][command.op - 1]
    const type = ['指令', '应答'][command.ty]
    return name + type
}
