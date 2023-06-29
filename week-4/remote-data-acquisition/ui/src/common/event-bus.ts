import { Env } from '@/common/env'
import mitt from 'mitt'

type Events = {
    'SENSOR-UPDATE': Env
    'SET-BEGIN-TIME': number
    'GET-BEGIN-TIME': void
    'GET-BEGIN-TIME-ACK': number
}

export default mitt<Events>()
