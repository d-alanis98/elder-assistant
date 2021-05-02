//Device domain
import IoTDevice, { NewIoTDevicePrimitives } from '../../domain/IoTDevice';
import IoTDeviceId from '../../domain/value-objects/IoTDeviceId';
import IoTDeviceType from '../../domain/value-objects/IoTDeviceType';
import IoTDeviceEventKeys from '../../domain/value-objects/IoTDeviceEventKeys';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 2.3.1
 * @description Create Iot device use case abstraction.
 */
export default class CreateIoTDevice {
    private readonly iotDeviceRepository: IoTDeviceRepository;

    //We inject the repository
    constructor(iotDeviceRepository: IoTDeviceRepository) {
        this.iotDeviceRepository = iotDeviceRepository;
    }

    run = async ({
        name,
        type,
        eventKeys
    }: NewIoTDevicePrimitives) => {
        //We create a new IoTDevice instance with a random ID.
        const device: IoTDevice = this.getNewDeviceWithId({ 
            name, 
            type, 
            eventKeys 
        });
        //We save the device in the repository
        await this.iotDeviceRepository.create(device);
        //We return the device
        return device;
    }

    /**
     * Method to generate a random device ID.
     * @returns {string} Device ID.
     */
    generateDeviceId = () => IoTDeviceId.random();

    /**
     * Method to get a new IoTDevice instance from the primitive values received.
     * @param name Device name.
     * @param type Device type.
     * @returns 
     */
    getNewDeviceWithId = ({        
        name, 
        type,
        eventKeys
    }: NewIoTDevicePrimitives): IoTDevice => (
        IoTDevice.fromPrimitives({
            _id: this.generateDeviceId().toString(),
            name,
            type,
            eventKeys: eventKeys || IoTDeviceEventKeys.getDefaultIoTDeviceEventKeys(new IoTDeviceType(type))
        })
    );

}