import httpStatus from 'http-status';
//Base exceptions
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user is requesting to link an already owned IoTDevice.
 */
export default class IoTDeviceIsLinkedToAnotherUser extends ErrorWithStatusCode {
    constructor() {
        super('IoT device is already owned by another user');
        //We set the status code
        this.statusCode = httpStatus.FORBIDDEN;
    }
}