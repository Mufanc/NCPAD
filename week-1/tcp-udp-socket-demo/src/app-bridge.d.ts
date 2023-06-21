export interface AppBridge {
    exit()
    getEnv(name: string): string | undefined
    setTitle(name: string)
}

declare global {
    interface Window {
        appBridge: AppBridge
    }
}
