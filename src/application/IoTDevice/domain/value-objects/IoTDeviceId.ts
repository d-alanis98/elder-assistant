import Uuid from '../../../Shared/domain/value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description IoT device ID value object.
 */
export default class IoTDeviceId extends Uuid {
    constructor(value: string) {
        super(value);
    }
}