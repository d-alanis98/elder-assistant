import EnumValueObject from '../../../Shared/domain/value-object/EnumValueObject';
//Domain exceptions
import IoTDeviceTypeNotValid from '../exceptions/IoTDeviceTypeNotValid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoT device type value object.
 */
export default class IoTDeviceType extends EnumValueObject<string> {
    constructor(type: string) {
        super(type, Object.values(IoTDeviceValidTypes))
    }

    /**
     * Handler of non valid type exception.
     * @param deviceType The not valid device type.
     */
    public throwErrorForInvalidValue = (deviceType: string) => {
        throw new IoTDeviceTypeNotValid(deviceType);
    }
}

export enum IoTDeviceValidTypes {
    WEARABLE = 'WEARABLE',
    PILLBOX = 'PILLBOX'
};