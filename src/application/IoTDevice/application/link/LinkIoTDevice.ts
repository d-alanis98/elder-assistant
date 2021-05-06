//Domain
import User from '../../../User/domain/User';
import IoTDevice from '../../domain/IoTDevice';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';
//Use cases
import UserFinder from '../../../User/application/find/UserFinder';
import FindIoTDevice from '../find/FindIoTDevice';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies, { iotDeviceDependencies } from '../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 1.3.1
 * @description Link Iot device use cases abstractions.
 */
export default class LinkIoTDevice {
    private readonly iotDeviceRepository: IoTDeviceRepository;

    //We inject the repository
    constructor(iotDeviceRepository: IoTDeviceRepository) {
        this.iotDeviceRepository = iotDeviceRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} userId User ID.
     * @param {string} deviceId Device to link ID. 
     */
    run = async ({
        userId, 
        deviceId, 
    }: IoTDeviceLinkPrimitives) => {
        //We get the device finder use case and search the device
        const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
        const device: IoTDevice = await findIoTDevice.run({ id: deviceId });
        //We get the user finder use case and search the user.
        const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
        const user: User = await userFinder.find(userId);
        //We set the device owner
        const deviceWithOwner: IoTDevice = this.getDeviceWithOwner(device, user);
        //We update the device data with owner in the repository
        this.iotDeviceRepository.update(deviceWithOwner);
        //We return the device with owner
        return deviceWithOwner;
    }

    /**
     * Method to get a new IoTDevice instance with the owner property set to the user's ID.
     * @param {IoTDevice} device IoT device to link.
     * @param {User} user User who will own the device.
     * @returns 
     */
    private getDeviceWithOwner = (device: IoTDevice, user: User) => new IoTDevice(
        device.id,
        device.name,
        device.type,
        user.id,
        device.eventkeys,
        device.configuration
    );

}

interface IoTDeviceLinkPrimitives {
    userId: string;
    deviceId: string;
}