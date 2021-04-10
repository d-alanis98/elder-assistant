import { Request, Response } from 'express';
import httpStatus from 'http-status';
//Extended requests
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//IoTDevice domain
import IoTDevice, { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
//Use cases
import FindIoTDevice from '../../../application/IoTDevice/application/find/FindIoTDevice';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';
//Controller helpers
import UserControllerHelpers from '../Shared/User/UserControllerHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Controller for the find IoT device use cases.
 */
export default class IoTDeviceFindController extends Controller {
    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async (request: Request, response: Response): Promise<void> => {
        try {
            //We get the parameters from the request
            const { deviceId } = request.params;
            //We get an instance of the use case from the dependencies container
            const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
            //We execute the use case logic
            const device: IoTDevice = await findIoTDevice.run({ id: deviceId });
            //We send the response with the new device data
            response.status(httpStatus.OK).send(device.toPrimitives());
        } catch (exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * Entry point for the controller for the search devices by user ID.
     * @param {RequestWithUser} request Request with user data.
     * @param {Response} response Express response.
     */
    findByUserId = async (request: RequestWithUser, response: Response): Promise<void> => {
        try {
            const userId: string = UserControllerHelpers.getUserIdFromRequest(request);
            //We get an instance of the use case from the dependencies container
            const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
            //We get the device
            const devices: IoTDevice[] = await findIoTDevice.byUserId({ userId });
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
}