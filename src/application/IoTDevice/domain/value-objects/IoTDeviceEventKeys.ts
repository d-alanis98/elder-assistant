//Value objects
import IoTDeviceType, { IoTDeviceValidTypes } from './IoTDeviceType';
//Constants
import { deviceEventKeys } from '../constants/devices';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description IoT device event keys value object.
 */
export default class IoTDeviceEventKeys {
    readonly values: string[];

    constructor(values: string[]) {
        this.values = values;
    }
    /**
     * Method to get the default event keys from the deviceEventKeys dictionary, which relates the device type with the
     * existing event keys for that device.
     * @param {IoTDeviceValidTypes} deviceType IoT device type.
     * @returns 
     */
    static getDefaultIoTDeviceEventKeys = (_deviceType: IoTDeviceType) => {
        const deviceType: IoTDeviceValidTypes = <IoTDeviceValidTypes>_deviceType.value;
        const eventKeys = deviceEventKeys[deviceType];
        return eventKeys || [];
    }

}