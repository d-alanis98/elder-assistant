import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when an IoTDevice does not exist in the respository.
 */
export default class IoTDeviceNotFound extends ErrorWithStatusCode {
    constructor() {
        super('IoT device not found');
        //We set the status code to 404
        this.statusCode = 404;
    }
}