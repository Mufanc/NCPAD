import { app, BrowserWindow, ipcMain } from 'electron'

app.on('ready', async () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1000,
        height: 750,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    ipcMain.on('EXIT', () => app.quit())

    if (process.env['VITE_DEV_SERVER_URL']) {
        await win.loadURL(process.env['VITE_DEV_SERVER_URL'])
    } else {
        await win.loadFile('dist/index.html')
    }
})
