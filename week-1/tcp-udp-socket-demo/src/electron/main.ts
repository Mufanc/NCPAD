import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'

app.on('ready', async () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            // nodeIntegration: true,
            // contextIsolation: false
        },
    })

    ipcMain.on('EXIT', () => app.quit())
    ipcMain.on('SET-TITLE', (ev, name) => win.setTitle(name))

    if (process.env['VITE_DEV_SERVER_URL']) {
        await win.loadURL(process.env['VITE_DEV_SERVER_URL'])
    } else {
        await win.loadFile('dist/index.html')
    }
})
