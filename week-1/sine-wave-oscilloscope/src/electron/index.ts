import { app, BrowserWindow } from 'electron'

app.on('ready', async () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        resizable: false,
    })

    if (process.env['VITE_DEV_SERVER_URL']) {
        await win.loadURL(process.env['VITE_DEV_SERVER_URL'])
    } else {
        await win.loadFile('dist/index.html')
    }
})
