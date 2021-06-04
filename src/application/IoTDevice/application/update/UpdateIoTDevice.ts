//Domain
import IoTDevice, { UpdateIoTDeviceParameters } from '../../domain/IoTDevice';
import IoTDeviceName from '../../domain/value-objects/IoTDeviceName';
import IoTDeviceConfiguration from '../../domain/value-objects/IoTDeviceConfiguration';
//Domain events
import UpdatedIoTDevice from '../../domain/events/UpdatedIoTDevice';
//Use cases
import FindIoTDevice from '../find/FindIoTDevice';
//Shared domain
import DomainEventsHandler from '../../../Shared/domain/events/DomainEventsHandler';
//Repository contracts
import UserRepository from '../../../User/domain/UserRepository';
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Update IoT device use case.
 */
export default class UpdateIoTDevice {
    private readonly usersRepository: UserRepository;
    private readonly iotDeviceRepository: IoTDeviceRepository;

    constructor(
        usersRepository: UserRepository,
        iotDeviceRepository: IoTDeviceRepository
    ){
        this.usersRepository = usersRepository;
        this.iotDeviceRepository = iotDeviceRepository;
    }

    /**
     * Entry point of the use case.
     * @param {string} _id Id of the device to update.
     * @param {string} name Updated name of the device.
     * @param {string} configuration Updated configuration of the device.
     * @returns 
     */
    run = async ({
        _id,
        name,
        restoreOwner,
        configuration
    }: UpdateIoTDeviceParameters): Promise<IoTDevice> => {
        const iotDevice = await this.getDeviceById(_id);
        //We get the updated IoT device data
        const updatedIoTDevice = this.getUpdatedDeviceData(
            iotDevice,
            name,
            restoreOwner,
            configuration
        );
        //We save the updated device to the repository
        await this.iotDeviceRepository.update(updatedIoTDevice);
        //We dispatch the UpdatedIoTDevice event
        this.dispatchDomainEvent(updatedIoTDevice);
        //We return the updated device
        return updatedIoTDevice;
    }

    //Internal helpers

    /**
     * Method to get the device's data by it's ID.
     * @param {string} deviceId Device identifier.
     * @returns 
     */
    private getDeviceById = async (deviceId: string): Promise<IoTDevice> => {
        const findIoTDevice: FindIoTDevice = new FindIoTDevice(this.usersRepository, this.iotDeviceRepository);
        return await findIoTDevice.run({ id: deviceId });
    }

    /**
     * 
     * @param {IoTDevice} device IoT device to update.
     * @param {string} updatedName Updated device name.
     * @param {null} restoreOwner Updated owner (set to null or keep the original).
     * @param {Object} updatedConfiguration Updated device configuration.
     * @returns 
     */
    private getUpdatedDeviceData = (
        device: IoTDevice,
        updatedName?: string,
        restoreOwner?: Boolean,
        updatedConfiguration?: Object
    ) => new IoTDevice(
        device.id,
        updatedName 
            ? new IoTDeviceName(updatedName) 
            : device.name,
        device.type,
        restoreOwner
            ? null
            : device.ownedBy,
        device.eventkeys,
        updatedConfiguration 
            ? new IoTDeviceConfiguration(updatedConfiguration) 
            : device.configuration
    );

    /**
     * Method to create and dispatch the UpdatedIoTDevice domain event.
     * @param {IoTDevice} updatedIoTDevice Updated IoT device instance.
     */
    private dispatchDomainEvent = (updatedIoTDevice: IoTDevice) => {
        //We generate and dispatch the domain event
        updatedIoTDevice.addDomainEvent(new UpdatedIoTDevice(updatedIoTDevice));
        DomainEventsHandler.dispatchEventsForAggregate(updatedIoTDevice.id);
    }
}