import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description IoT device file attachment value object.
 */
export default class IoTDeviceFilePath extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}