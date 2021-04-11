import { Request, Response } from 'express';
import httpStatus from 'http-status';
//IoTDeviceData domain
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData';
//Use cases
import CreateIoTDeviceData from '../../../application/IoTDeviceData/application/create/CreateIoTDeviceData';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';
//Domain events
import CreatedIoTDeviceData from '../../../application/IoTDeviceData/domain/events/CreatedIoTDeviceData';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Controller to handle the create IoT device data request.
 */
export default class IoTDeviceDataCreateController extends Controller {
    /**
     * Entry point for the controller.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     */
    run = async (request: Request, response: Response): Promise<void> => {
        try {
            //We perform the validation of the request (it must contain key and value in the body)
            this.validateRequest(request);
            //We get the data from the request
            const { key, value } = request.body;
            const { deviceId } = request.params;
            //We get the use case and execute it
            const createIoTDeviceData: CreateIoTDeviceData = container.get(iotDeviceDependencies.UseCases.CreateIoTDeviceData);
            const iotDeviceData: IoTDeviceData = await createIoTDeviceData.run({ key, value, deviceId });
            //We send the device data record (with the generated ID), as record
            response.status(httpStatus.CREATED).send(iotDeviceData.toPrimitives());
        } catch(error) {
            this.handleBaseExceptions(error, response);
        }
    }

    /**
     * @todo Finish. Here we need to validate the record limit business rule, as well, we need to determine the 
     * data key, to pass it to a service that determines if an specific action needs to be fired after that (i.e:
     * sending a notification, mail, data through websocket etc).
     * We register the event handlers, in this case, we are interested in the CreatedIoTDeviceData
     */
    registerEventHandlers() {
        this.onDomainEvent('CreatedIoTDeviceData', (event: CreatedIoTDeviceData) => {
            //We get the deviceId from the event data
            const { deviceData: { deviceId } } = event;
            //We log the value
            console.log(`Device ID: ${deviceId.toString()}`);
            //Here we'd invoke the search all events by deviceId use case, and count the registers, to know if we
            //are exceeding the limit established in the business rules. In that case, we are getting the oldest register
            //and we'll delete it.
        });
    }

}