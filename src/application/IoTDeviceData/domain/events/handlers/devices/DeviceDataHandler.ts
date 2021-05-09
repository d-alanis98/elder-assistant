//Domain events
import CreatedIoTDeviceData from '../../CreatedIoTDeviceData';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Contract for the Device data handlers.
 */
export default interface DeviceDataHandler {
    onCreated(event: CreatedIoTDeviceData): Promise<void>;
}