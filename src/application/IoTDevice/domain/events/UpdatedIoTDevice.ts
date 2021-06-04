//Domain
import IoTDevice from '../IoTDevice';
//Base event
import DomainEvent from '../../../Shared/domain/events/DomainEvent';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event to emmit when an IoT device is updated.
 */
export default class UpdatedIoTDevice extends DomainEvent {
    readonly iotDevice: IoTDevice;

    constructor(iotDevice: IoTDevice) {
        super();
        this.iotDevice = iotDevice;
    }

    getAggregateId = () => this.iotDevice.id;
}