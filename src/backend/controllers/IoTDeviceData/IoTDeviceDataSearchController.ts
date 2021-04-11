import { Request, Response } from 'express';
import httpStatus from 'http-status';
//IoTDeviceData domain
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData';
//Use cases
import SearchIoTDeviceData from '../../../application/IoTDeviceData/application/search/SearchIoTDeviceData';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';



/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Controller to handle the create IoT device data request.
 */
export default class IoTDeviceDataSearchController extends Controller {
    
    /**
     * Entry point for the controller.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     */
    run = async (request: Request, response: Response): Promise<void> => {
        try {
            //We get the data from the request
            const { deviceId } = request.params;
            //We get the use case and execute it
            const searchIoTDeviceData: SearchIoTDeviceData = container.get(iotDeviceDependencies.UseCases.SearchIoTDeviceData);
            const deviceDataRecords: IoTDeviceData[] = await searchIoTDeviceData.byDeviceId(deviceId);
            //We get the primitive records
            const deviceDataPrimitiveRecords = SearchIoTDeviceData.getDataRecordsInPrimitiveValues(deviceDataRecords);
            //We send the device data records
            response.status(httpStatus.CREATED).send(deviceDataPrimitiveRecords);
        } catch(error) {
            this.handleBaseExceptions(error, response);
        }
    }
}