//Domain
import IoTDeviceNotFound from '../../../../application/IoTDevice/domain/exceptions/IoTDeviceNotFound';
//Request contract
import { RequestWithIoTDevice } from '../../../middleware/IoTDevice/IoTDeviceAuthorization';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Helper methods for the IoT device entity requests.
 */
export default class IoTDeviceRequestHelpers {

    /**
     * Method to get the device data directly from the request, without needing to perform the existance validation.
     * @param {RequestWithIoTDevice} request Request with IoT device data.
     * @returns 
     */
    static getIoTDeviceDataFromRequest = (request: RequestWithIoTDevice) => {
        const iotDevice = request.iotDevice;
        //We validate the device existance
        if(!iotDevice)
            throw new IoTDeviceNotFound();
        return iotDevice;
    }
}