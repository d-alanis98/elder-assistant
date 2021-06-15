import { Response } from 'express';
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
import OnCreatedIoTDeviceData from '../../../application/IoTDeviceData/domain/events/handlers/OnCreatedIoTDeviceData';
//Extended request
import { RequestWithIoTDevice } from '../../middleware/IoTDevice/IoTDeviceAuthorization';
//Helpers
import IoTDeviceRequestHelpers from '../Shared/IoTDevice/IoTDeviceRequestHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 3.5.2
 * @description Controller to handle the create IoT device data request.
 */
export default class IoTDeviceDataCreateController extends Controller {
    /**
     * Entry point for the controller.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithIoTDevice, response: Response): Promise<void> => {
        try {
            //We get the file from the request
            const { file } = request;
            //We get the data from the request
            const { key, value } = request.body;
            const { _id: deviceId } = IoTDeviceRequestHelpers.getIoTDeviceDataFromRequest(request);
            //We get the use case and execute it
            const createIoTDeviceData: CreateIoTDeviceData = container.get(iotDeviceDependencies.UseCases.CreateIoTDeviceData);
            const iotDeviceData: IoTDeviceData = await createIoTDeviceData.run({ 
                key, 
                value, 
                deviceId,
                filePath: file?.filename 
            });
            //We send the device data record (with the generated ID), as record
            response.status(httpStatus.CREATED).send(iotDeviceData.toPrimitives());
        } catch(error) {
            this.handleBaseExceptions(error, response);
        }
    }

    /**
     * We register the event handlers for this entity.
     * @todo Finish. Here we need to validate the record limit business rule.
     */
    registerEventHandlers() {
        this.onDomainEvent(CreatedIoTDeviceData.name, new OnCreatedIoTDeviceData().handle);
    }

}