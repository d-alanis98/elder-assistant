import httpStatus from 'http-status';
//Base exception with status code
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Domain exception for IoTDeviceData, to throw when no records are found.
 */
export default class UnexistingIoTDeviceData extends ErrorWithStatusCode {
    constructor() {
        super('IoT device data does not exist');
        this.statusCode = httpStatus.NOT_FOUND;
    }
}