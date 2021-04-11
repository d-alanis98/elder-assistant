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
 * @version 1.3.2
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
    byDeviceId = async (deviceId: string) => {
        //We search all the records in the repository
        const deviceDataRecords: Nullable<IoTDeviceData[]> = await this.iotDeviceDataRepository.searchAll({ deviceId });
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