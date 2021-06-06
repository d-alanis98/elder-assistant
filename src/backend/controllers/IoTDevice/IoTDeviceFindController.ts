import { Response } from 'express';
import httpStatus from 'http-status';
//IoTDevice domain
import IoTDevice, { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
//User domain
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';
//Use cases
import FindIoTDevice from '../../../application/IoTDevice/application/find/FindIoTDevice';
//Base controller
import Controller from '../Controller';
//Request contracts
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
import { RequestWithIoTDevice } from '../../middleware/IoTDevice/IoTDeviceAuthorization';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';
//Request helpers
import UserControllerHelpers from '../Shared/User/UserControllerHelpers';
import IoTDeviceRequestHelpers from '../Shared/IoTDevice/IoTDeviceRequestHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.1
 * @description Controller for the find IoT device use cases.
 */
export default class IoTDeviceFindController extends Controller {
    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async (request: RequestWithIoTDevice, response: Response): Promise<void> => {
        try {
            //We get the device data from the request (added to it in the IoTDeviceAuthorization middleware)
            const devicePrimitives = IoTDeviceRequestHelpers.getIoTDeviceDataFromRequest(request);
            //We send the response
            response.status(httpStatus.OK).send(devicePrimitives);
        } catch (exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * Entry point for the controller for the search devices by user ID.
     * @param {RequestWithUser} request Request with user data.
     * @param {Response} response Express response.
     */
    handleDevicesByOwnerRequest = async (request: RequestWithUser, response: Response): Promise<void> => {
        try {
            //We get the user type
            const userType = UserControllerHelpers.getUserIdFromRequest(request);
            //We get the user ID, if the user is of type PRIMARY, the id is in the auth token, otherwise, it is in the URL 
            const userId = userType === AllowedUserTypes.PRIMARY
                ? UserControllerHelpers.getUserIdFromRequest(request)
                : request.params.primaryUserId;
            //We get the devices
            const devices = await this.getDevicesByOwnerUserId(userId);
            //We send the response with the devices owned by the user
            response.status(httpStatus.OK).send(this.getResponseDevices(devices));
        } catch (exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Helpers for internal use
    /**
     * Method to transform IoTDevice instances array to IoTDevicePrimitives array.
     * @param {IoTDevice[]} devices IoTDevices instances to transform in IoTDevicePrimitives[]
     * @returns 
     */
    private getResponseDevices = (devices: IoTDevice[]): IoTDevicePrimitives[] => devices.map(device => (
        device.toPrimitives()
    ));

    /**
     * Method to get the devices by owner user ID.
     * @param {string} ownerId Id of the user that owns the device.
     * @returns 
     */
    private getDevicesByOwnerUserId = async (ownerId: string) => {
        //We get an instance of the use case from the dependencies container
        const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
        //We get the devices
        return await findIoTDevice.byUserId({ userId: ownerId });
    } 
}