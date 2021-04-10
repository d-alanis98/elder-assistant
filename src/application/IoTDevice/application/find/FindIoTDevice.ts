//Device domain
import IoTDevice from '../../domain/IoTDevice';
import IoTDeviceId from '../../domain/value-objects/IoTDeviceId';
//Domain exceptions
import IoTDeviceNotFound from '../../domain/exceptions/IoTDeviceNotFound';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Find Iot device use cases abstractions.
 */
export default class FindIoTDevice {
    private readonly iotDeviceRepository: IoTDeviceRepository;

    //We inject the repository
    constructor(iotDeviceRepository: IoTDeviceRepository) {
        this.iotDeviceRepository = iotDeviceRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} id Device ID.
     * @returns 
     */
    run = async ({ 
        id 
    }: IoTDeviceIDPrimitive) => {
        //We create a new IoTDevice instance with a random ID.
        const device: Nullable<IoTDevice> = await this.iotDeviceRepository.search(new IoTDeviceId(id));
        //If no device was found, we throw an exception
        if(!device)
            throw new IoTDeviceNotFound();
        else return device;
    }

    /**
     * Entry point for the search by user id use case.
     * @param {string} userId User ID.
     * @returns 
     */
    byUserId = async ({
        userId
    }: IoTDeviceOwnedByUser): Promise<IoTDevice[]> => {
        const devices = await this.iotDeviceRepository.searchAll({ ownedBy: userId });
        if(!devices)
            throw new IoTDeviceNotFound();
        return devices;
    }

}

interface IoTDeviceIDPrimitive {
    id: string;
}

interface IoTDeviceOwnedByUser {
    userId: string;
}