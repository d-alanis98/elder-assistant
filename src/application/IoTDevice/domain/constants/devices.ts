//Domain
import { IoTDeviceValidTypes } from '../value-objects/IoTDeviceType';

export const deviceEventKeys = {
    [IoTDeviceValidTypes.PILLBOX]: [
        'CurrentDosis',
        'DosisSchedule'
    ],
    [IoTDeviceValidTypes.WEARABLE]: [
        'Location',
        'PanicAlert',
        'HeartRate'
    ]
}