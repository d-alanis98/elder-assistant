import { Request, Response } from 'express';
import httpStatus from 'http-status';
//IoTDevice domain
import IoTDevice from '../../../application/IoTDevice/domain/IoTDevice';
//Use cases
import CreateIoTDevice from '../../../application/IoTDevice/application/create/CreateIoTDevice';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.1
 * @description Controller for the create IoT device use case.
 */
export default class IoTDeviceCreateController extends Controller {
    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async(request: Request, response: Response): Promise<void> => {
        try {
            //We validate the request
            this.validateRequest(request);
            //We get the parameters from the request
            const { name, type, eventKeys } = request.body;
            //We get an instance of the use case from the dependencies container
            const createIoTDevice: CreateIoTDevice = container.get(iotDeviceDependencies.UseCases.CreateIoTDevice);
            //We execute the use case logic
            const device: IoTDevice = await createIoTDevice.run({ 
                name, 
                type, 
                eventKeys 
            });
            //We send the response with the new device data
            response.status(httpStatus.OK).send(device.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }
}