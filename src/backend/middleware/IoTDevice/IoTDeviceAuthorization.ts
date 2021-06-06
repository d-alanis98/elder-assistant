import { Response, NextFunction } from 'express';
//Domain
import IoTDevice, { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
import IoTDeviceNotFound from '../../../application/IoTDevice/domain/exceptions/IoTDeviceNotFound';
import NotAuthorizedToModifyIoTDevice from '../../../application/IoTDevice/domain/exceptions/NotAuthorizedToModifyIoTDevice';
//Use cases
import FindIoTDevice from '../../../application/IoTDevice/application/find/FindIoTDevice';
//Request contract
import { RequestWithUser } from '../User/UserAuthentication';
//Controller helpers
import UserControllerHelpers from '../../controllers/Shared/User/UserControllerHelpers';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom middleware to handle the IoTDevice authorization.
 */
export default class IoTDeviceAuthorization {
    
    /**
     * Method to validate that the user owns the device.
     * Also, the device data is attached to the request to avoid executing the use case again.
     * @param {RequestWithIoTDevice} request Request with additional data.
     * @param {Response} _ Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateDeviceOwnership = async (
        request: RequestWithIoTDevice, 
        _: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            //We extract data from the request
            const userId = UserControllerHelpers.getUserIdFromRequest(request);
            const deviceId = request.params.deviceId || request.body.deviceId;
            //We get the device
            const device = await IoTDeviceAuthorization.getDeviceById(deviceId);
            //We validate that the user owns the device
            if(device.ownedBy && device.ownedBy.toString() !== userId)
                throw new NotAuthorizedToModifyIoTDevice();
            //We attach the device data to the request
            IoTDeviceAuthorization.addDeviceToRequest(request, device);
            next();
        } catch(error) {
            next(error);
        }
    }

    //Internal methods
    /**
     * Method to get the IoT device executing the search by ID use case.
     * @param deviceId Id of the device.
     * @returns 
     */
    private static getDeviceById = async (deviceId: string) => {
        //We get and execute the use case to find the device by owner user
        const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
        const device = await findIoTDevice.run({ id: deviceId });
        //We validate the device
        if(!device)
            throw new IoTDeviceNotFound();
        return device;
    }

    /**
     * Method to add the IoT device data to the request object.
     * @param {RequestWithIoTDevice} request Request with IoTDevice data not present yet.
     * @param {IoTDevice} device Device data to add to the request.
     */
    private static addDeviceToRequest = async (request: RequestWithIoTDevice, device: IoTDevice) => {
        request.iotDevice = device.toPrimitives();
    }
}


export interface RequestWithIoTDevice extends RequestWithUser {
    iotDevice?: IoTDevicePrimitives;
}