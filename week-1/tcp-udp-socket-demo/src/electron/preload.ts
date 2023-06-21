import { type AppBridge } from '@/app-bridge'
import { contextBridge, ipcRenderer } from 'electron'

const api: AppBridge = {
    exit: () => ipcRenderer.send('EXIT'),
    getEnv: (name: string) => process.env[name],
    setTitle: (name: string) => ipcRenderer.send('SET-TITLE', name),
}

contextBridge.exposeInMainWorld('appBridge', api)
