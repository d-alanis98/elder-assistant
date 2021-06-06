//Domain
import User from '../../../User/domain/User';
import IoTDevice from '../../domain/IoTDevice';
//Domain exceptions
import IoTDeviceIsLinkedToAnotherUser from '../../domain/exceptions/IoTDeviceIsLinkedToAnotherUser';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';
//User domain
import UserRepository from '../../../User/domain/UserRepository';
//Use cases
import UserFinder from '../../../User/application/find/UserFinder';
import FindIoTDevice from '../find/FindIoTDevice';


/**
 * @author Damián Alanís Ramírez
 * @version 2.4.3
 * @description Link Iot device use cases abstractions.
 */
export default class LinkIoTDevice {
    private readonly usersRepository: UserRepository;
    private readonly iotDeviceRepository: IoTDeviceRepository;

    //We inject the repository
    constructor(
        usersRepository: UserRepository,
        iotDeviceRepository: IoTDeviceRepository
    ) {
        this.usersRepository = usersRepository;
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
        const findIoTDevice: FindIoTDevice = new FindIoTDevice(this.usersRepository, this.iotDeviceRepository);
        const device: IoTDevice = await findIoTDevice.run({ id: deviceId });
        //We verify that the device is available for the link process
        this.verifyDeviceIsNotLinkedToAnotherUser(device);
        //We get the user finder use case and search the user.
        const userFinder: UserFinder = new UserFinder(this.usersRepository);
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

    /**
     * Method to verify if a device is not already linked to another user.
     * @param {IoTDevice} device IoT device to link.
     */
    private verifyDeviceIsNotLinkedToAnotherUser = (device: IoTDevice) => {
        //We verify that the device has not an owner already
        if(device.ownedBy)
            throw new IoTDeviceIsLinkedToAnotherUser();
    }

}

interface IoTDeviceLinkPrimitives {
    userId: string;
    deviceId: string;
}