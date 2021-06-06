import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user that is not the user attempts to update it.
 */
export default class NotAuthorizedToModifyIoTDevice extends ErrorWithStatusCode {
    constructor() {
        super('Only the owner of the device can modify it');
        //We set the status code
        this.statusCode = httpStatus.FORBIDDEN;
    }
}