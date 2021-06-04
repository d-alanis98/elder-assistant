import { Request, Response } from 'express';
import httpStatus from 'http-status';
//IoTDevice domain
import IoTDevice from '../../../application/IoTDevice/domain/IoTDevice';
//Use cases
import CreateIoTDevice from '../../../application/IoTDevice/application/create/CreateIoTDevice';
import UpdateIoTDevice from '../../../application/IoTDevice/application/update/UpdateIoTDevice';
//Domain events and event handlers
import UpdatedIoTDevice from '../../../application/IoTDevice/domain/events/UpdatedIoTDevice';
import OnUpdatedIoTDevice from '../../../application/IoTDevice/domain/events/handlers/OnUpdatedIoTDevice';
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

    /**
     * Method to request the execution of the UpdateIoTDevice use case.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    update = async (request: Request, response: Response) => {
        try {
            //We extract the data from the request
            const { deviceId } = request.params;
            const { name, configuration } = request.body;
            //We get and execute the use case
            const updateIoTDevice: UpdateIoTDevice = container.get(iotDeviceDependencies.UseCases.UpdateIoTDevice);
            const updatedIoTDevice: IoTDevice = await updateIoTDevice.run({
                _id: deviceId,
                name,
                configuration
            });
            //We attach the updated device data to the response
            response.status(httpStatus.OK).send(updatedIoTDevice.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * We register the domain event handlers.
     */
    protected registerEventHandlers() {
        //Handler for the updated device event.
        this.onDomainEvent(UpdatedIoTDevice.name, new OnUpdatedIoTDevice().handle);
    }
}