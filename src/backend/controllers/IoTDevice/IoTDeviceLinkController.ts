import { Response } from 'express';
import httpStatus from 'http-status';
//Extended request
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//IoTDevice domain
import IoTDevice from '../../../application/IoTDevice/domain/IoTDevice';
//Use cases
import LinkIoTDevice from '../../../application/IoTDevice/application/link/LinkIoTDevice';
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
 * @description Controller for the link IoT device use cases.
 */
export default class IoTDeviceLinkController extends Controller {
    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async(request: RequestWithUser, response: Response): Promise<void> => {
        try {
            //We get the parameters from the request
            const { deviceId } = request.params;
            const userId: string = UserControllerHelpers.getUserIdFromRequest(request);
            //We get an instance of the use case from the dependencies container
            const linkIoTDevice: LinkIoTDevice = container.get(iotDeviceDependencies.UseCases.LinkIoTDevice);
            //We execute the use case logic
            const device: IoTDevice = await linkIoTDevice.run({ deviceId, userId });
            //We send the response with the new device data
            response.status(httpStatus.OK).send(device.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }
}