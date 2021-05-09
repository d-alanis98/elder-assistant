//Event to handle
import CreatedIoTDeviceData from '../CreatedIoTDeviceData';
//Handlers dictionary
import DeviceEventHandlers from './devices/DeviceEventHandlers';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Class to handle the created device data event by getting the corresponding handler from the DeviceEventHandlers
 * dictionary and executing, injecting the received event.
 */
export default class OnCreatedIoTDeviceData {
    private readonly deviceEventHandlers: DeviceEventHandlers;

    constructor(){
        this.deviceEventHandlers = new DeviceEventHandlers();
    }

    /**
     * Method to get the adecquate handler for the event based on the eventKey and execute it.
     * @param {CreatedIoTDeviceData} event Event ot handle.
     */
    handle = async (event: CreatedIoTDeviceData) => {
        const { deviceData: { key: eventKey } } = event;
        //We get the handler and execute it
        const handler = this.deviceEventHandlers.handlersDictionary[eventKey.toString()];
        handler?.onCreated(event);
    }
}