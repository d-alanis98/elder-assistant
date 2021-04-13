//Domain
import IoTDeviceData, { IoTDeviceDataPrimitives } from '../../domain/IoTDeviceData';
//Domain exceptions
import UnexistingIoTDeviceData from '../../domain/exceptions/UnexistingIoTDeviceData';
//Data repository contract
import { IoTDeviceDataRepository } from '../../domain/IoTDeviceDataRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';

/**
 * @author Damián Alanís Ramírez
 * @version 2.4.3
 * @description Search IoTDeviceData records use case.
 */
export default class SearchIoTDeviceData {
    private readonly iotDeviceDataRepository: IoTDeviceDataRepository;

    constructor(iotDeviceDataRepository: IoTDeviceDataRepository) {
        this.iotDeviceDataRepository = iotDeviceDataRepository;
    }

    /**
     * Entry point for the search by device ID use case.
     * @param {string} deviceId IoT device ID.
     * @returns 
     */
    byDeviceId = async ({ 
        limit,
        deviceId, 
        startingAt,
    }: SearchParameters) => {
        //We search all the records in the repository with pagination
        const deviceDataRecords: Nullable<any> = await this.iotDeviceDataRepository.searchAllPaginated(
            { deviceId },
            { limit, startingAt } //We provide the starting point, derivated from the pagination, to get the consequent page
        );
        if(!deviceDataRecords)
            throw new UnexistingIoTDeviceData();
        //We return the data records
        return deviceDataRecords;
    }

    //Facade helpers
    /**
     * Method to get the IoTDeviceData records in their primitive values representation.
     * @param {IoTDeviceData[]} deviceDataRecords Array of IoTDeviceData records.
     * @returns 
     */
    static getDataRecordsInPrimitiveValues = (deviceDataRecords: IoTDeviceData[]): IoTDeviceDataPrimitives[] => (
        deviceDataRecords.map((deviceData: IoTDeviceData) => (
            deviceData.toPrimitives()
        ))
    );
}


interface SearchParameters {
    limit: number | undefined;
    deviceId: string;
    startingAt: string | undefined;
}