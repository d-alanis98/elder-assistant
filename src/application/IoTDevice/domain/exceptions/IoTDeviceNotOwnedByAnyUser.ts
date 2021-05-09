import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a device is not owned by any user.
 */
export default class IoTDeviceNotOwnedByAnyUser extends ErrorWithStatusCode {
    constructor() {
        super('IoT device is not owned by any user');

        this.statusCode = 401;
    }
}