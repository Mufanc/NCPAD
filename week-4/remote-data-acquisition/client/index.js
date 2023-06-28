import { SerialPort } from 'serialport'

;(async () => {
    console.log((await SerialPort.list()).filter(s => s.path.match(/\/dev\/ttyUSB\d+/)))
    const serial = new SerialPort({
        path: '/dev/ttyUSB0',
        baudRate: 2400,
    })
    serial.write('This is a string.')
    serial.on('data', data => {
        console.log(data)
    })
})()
