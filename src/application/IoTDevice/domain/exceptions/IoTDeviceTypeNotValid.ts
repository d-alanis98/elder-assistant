/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when we try to create a non valid IoT device type.
 */
 export default class IoTDeviceTypeNotValid extends Error {
    constructor(deviceType: string) {
        super(`IoT device type <${deviceType}> is not valid`);
    }
}