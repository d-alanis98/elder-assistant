//Device domain
import IoTDevice, { NewIoTDevicePrimitives } from '../../domain/IoTDevice';
import IoTDeviceId from '../../domain/value-objects/IoTDeviceId';
import IoTDeviceType from '../../domain/value-objects/IoTDeviceType';
import IoTDeviceEventKeys from '../../domain/value-objects/IoTDeviceEventKeys';
//Repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies from '../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 3.4.1
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
    }: NewIoTDevicePrimitives): Promise<IoTDeviceResponse> => {
        //We create a new IoTDevice instance with a random ID.
        const device: IoTDevice = this.getNewDeviceWithId({ 
            name, 
            type, 
            eventKeys 
        });
        //We save the device in the repository
        await this.iotDeviceRepository.create(device);
        //We get the authentication token of the device
        const token = await this.getDeviceAuthToken(device);
        //We return the device
        return {
            token,
            device,
        };
    }
    //Internal helpers

    /**
     * Method to generate a random device ID.
     * @returns {string} Device ID.
     */
    private generateDeviceId = () => IoTDeviceId.random().toString();

    /**
     * Method to get a new IoTDevice instance from the primitive values received.
     * @param name Device name.
     * @param type Device type.
     * @returns 
     */
    private getNewDeviceWithId = ({        
        name, 
        type,
        eventKeys
    }: NewIoTDevicePrimitives): IoTDevice => (
        IoTDevice.fromPrimitives({
            _id: this.generateDeviceId(),
            name,
            type,
            eventKeys: eventKeys || IoTDeviceEventKeys.getDefaultIoTDeviceEventKeys(new IoTDeviceType(type))
        })
    );

    /**
     * Method that generates a token with the Authenticator dependency.
     * @param {IoTDevice} createdIoTDevice IoT device data to store in the token. 
     * @returns 
     */
    private getDeviceAuthToken = async (createdIoTDevice: IoTDevice) => {
        //We get and execut the authenticator
        const authenticator = container.get(dependencies.Authenticator);
        return await authenticator.signIoTDeviceToken(createdIoTDevice);
    }

}

//Types
interface IoTDeviceResponse {
    token: string;
    device: IoTDevice;
}