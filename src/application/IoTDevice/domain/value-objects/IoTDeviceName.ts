import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoT device name value object.
 */
export default class IoTDeviceName extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}