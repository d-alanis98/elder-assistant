import Uuid from '../../../Shared/domain/value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoT device data ID value object.
 */
export default class IoTDeviceDataId extends Uuid {
    constructor(value: string) {
        super(value);
    }
}