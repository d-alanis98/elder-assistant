import { Request, Response } from 'express';
import httpStatus from 'http-status';
//Domain
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData';
//Shared domain
import { Nullable } from '../../../application/Shared/domain/Nullable';
//Use cases
import SearchIoTDeviceData from '../../../application/IoTDeviceData/application/search/SearchIoTDeviceData';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { iotDeviceDependencies } from '../../../application/Shared/domain/constants/dependencies';
//Pagination contract
import PaginatedDataResult from '../../../application/Shared/domain/requests/PaginatedDataResult';

/**
 * @author Damián Alanís Ramírez
 * @version 3.7.5
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
            const { startingAt: startingAtParam, recordsPerPage } = request.query;
            //We get the starting point for pagination, if not provided, we will get the first page (the most recent data)
            const limit = recordsPerPage ? Number(recordsPerPage) : undefined;
            const startingAt = startingAtParam ? startingAtParam.toString() : undefined;
            //We get the use case and execute it
            const searchIoTDeviceData: SearchIoTDeviceData = container.get(iotDeviceDependencies.UseCases.SearchIoTDeviceData);
            const deviceDataRecords: PaginatedDataResult<IoTDeviceData> = await searchIoTDeviceData.byDeviceId({ limit, deviceId, startingAt });
            //We get the primitive records
            const deviceDataPrimitiveRecords = SearchIoTDeviceData.getDataRecordsInPrimitiveValues(deviceDataRecords.data);
            //We send the device data records
            response.status(httpStatus.OK).send({
                ...deviceDataRecords,
                data: deviceDataPrimitiveRecords
            });
        } catch(error) {
            this.handleBaseExceptions(error, response);
        }
    }

    /**
     * Request handler to get the last record by device ID and event key.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     */
    searchLastRecordByDeviceIDAndEventType = async (request: Request, response: Response): Promise<void> => {
        try {
            //We get the data from the request
            const { deviceId } = request.params;
            const { eventKey: queryEventKey } = request.query;
            //We retrieve the query parameter
            const eventKey = queryEventKey ? queryEventKey.toString() : undefined;
            //We get the use case and execute it
            const searchIoTDeviceData: SearchIoTDeviceData = container.get(iotDeviceDependencies.UseCases.SearchIoTDeviceData);
            const deviceDataRecord: Nullable<IoTDeviceData> = await searchIoTDeviceData.lastRecordByDeviceIdAndEventType({ 
                eventKey,
                deviceId
            });
            //We send the response
            response.status(httpStatus.OK).send(deviceDataRecord 
                ? deviceDataRecord.toPrimitives()
                : null
            );
        } catch(error) {
            this.handleBaseExceptions(error, response);
        }
    }

}