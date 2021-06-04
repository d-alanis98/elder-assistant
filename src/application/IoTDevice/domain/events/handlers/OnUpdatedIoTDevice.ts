//Domain
import IoTDevice from '../../IoTDevice';
//Domain event
import UpdatedIoTDevice from '../UpdatedIoTDevice';
//Web sockets manager
import WebSocketClients from '../../../../Shared/infrastructure/WebSockets/WebSocketClients';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event handler for the UpdatedIoTDevice domain event.
 */
export default class OnUpdatedIoTDevice {

    /**
     * Entry point for the handler.
     * @param {UpdatedIoTDevice} event Event to handle.
     */
    public handle = async (event: UpdatedIoTDevice) => {
        //We notify through WebSockets to the owner user, in order to silently update the device data 
        this.notifyOwnerUser(event.iotDevice);
    }

    /**
     * Method to send the updated IoT device data to the owner user via WebSockets.
     * @param {IoTDevice} updatedIoTDevice Updated IoT device data.
     * @returns 
     */
    private notifyOwnerUser = (updatedIoTDevice: IoTDevice) => {
        const owner = updatedIoTDevice.toPrimitives().ownedBy;
        //We validate that the device is actually owned by someone
        if(!owner)
            return;
        WebSocketClients.emitDataToUser(
            owner,
            'UpdatedIoTDevice',
            updatedIoTDevice.toPrimitives()
        );
    }
}