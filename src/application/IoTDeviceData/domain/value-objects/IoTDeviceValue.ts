/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoT device data value object.
 */
export default class IoTDeviceDataValue {
    readonly value: IoTDeviceDataType;

    constructor(value: IoTDeviceDataType) {
        this.value = value;
    }
}


export type IoTDeviceDataType = string | Object;