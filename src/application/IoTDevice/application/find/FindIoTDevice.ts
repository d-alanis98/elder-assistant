//Device domain
import IoTDevice from '../../domain/IoTDevice';
import IoTDeviceId from '../../domain/value-objects/IoTDeviceId';
//User domain
import User from '../../../User/domain/User';
//User use cases
import UserFinder from '../../../User/application/find/UserFinder';
//Domain exceptions
import IoTDeviceNotFound from '../../domain/exceptions/IoTDeviceNotFound';
import IoTDeviceNotOwnedByAnyUser from '../../domain/exceptions/IoTDeviceNotOwnedByAnyUser';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies from '../../../Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 2.4.3
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

    /**
     * Use case to get the owner of a device by its ID.
     * @param deviceId Id of the device whom owner we want to find.
     * @returns {Promise<User>} A promise that resolves to the owner of the device.
     */
    findOwnerByDeviceId = async (deviceId: IoTDeviceId): Promise<User> => {
        const device = await this.iotDeviceRepository.search(deviceId);
        //We validate the device is not null
        if(!device)
            throw new IoTDeviceNotFound();
        //We get the owner
        const { ownedBy } = device;
        //We validate the owner existance
        if(!ownedBy)
            throw new IoTDeviceNotOwnedByAnyUser();
        //We get the user finder from the dependencies container
        const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
        //We execute the use case
        return await userFinder.find(ownedBy);
    }

}

interface IoTDeviceIDPrimitive {
    id: string;
}

interface IoTDeviceOwnedByUser {
    userId: string;
}