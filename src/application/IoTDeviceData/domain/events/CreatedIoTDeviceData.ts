//IoTDeviceData domain
import IoTDeviceData from '../IoTDeviceData';
//Domain events
import DomainEvent from '../../../Shared/domain/events/DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.1
 * @description Event that is emitted when aN IoT device data record is created.
 */
export default class CreatedIoTDeviceData extends DomainEvent {
    readonly deviceData: IoTDeviceData;

    constructor(deviceData: IoTDeviceData) {
        super();
        this.deviceData = deviceData;
    }

    getAggregateId = () => this.deviceData.id; 
}