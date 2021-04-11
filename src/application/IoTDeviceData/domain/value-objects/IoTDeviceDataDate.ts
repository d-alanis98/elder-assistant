import DateValueObject from '../../../Shared/domain/value-object/DateValueObject';


/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description IoT device data date value object.
 */
export default class IoTDeviceDataDate extends DateValueObject {
    constructor(date: string | Date | number) {
        super(date);
    }
    /**
     * We override the toString method to get the ISO string date suitable for most of the Database Managers
     * @returns The ISO string date
     */
    toString = (): string => this.toISOString();
}