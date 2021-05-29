//Device data handler specification
import DeviceDataHandler from './DeviceDataHandler';
//Domain events
import CreatedIoTDeviceData from '../../CreatedIoTDeviceData';
//IoTDevice use cases
import FindIoTDevice from '../../../../../IoTDevice/application/find/FindIoTDevice';
//User domain
import User from '../../../../../User/domain/User';
//WebSockets
import WebSocketClients from '../../../../../Shared/infrastructure/WebSockets/WebSocketClients';
//Shared domain
import Logger from '../../../../../Shared/domain/Logger';
//Dependency injection
import container from '../../../../../../backend/dependency-injection';
import dependencies, { iotDeviceDependencies } from '../../../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 2.1.1
 * @description Basic handler for IoTDevice data create and update events. It sends the updated value through web sockets
 * to the allowed users (the owner and the subscribers with the corresponding permissions).
 */
export default class BaseHandler implements DeviceDataHandler {

    /**
     * Method to perform the base actions on a created record event. The default action is to notify via web sockets
     * to all the corresponding users.
     * @param {CreatedIoTDeviceData} event Event fired after the creation of an IoT device data record.
     */
    onCreated = async (event: CreatedIoTDeviceData) => {
        this.sendDataThroughWebSocket(event);
    }

    //Internal methods
    /**
     * Method to send the data via web sockets to the corresponding users.
     * @param {CreatedIoTDeviceData} event Event fired after the creation of an IoT device data record.@param event 
     */
    protected sendDataThroughWebSocket = async (event: CreatedIoTDeviceData) => {
        const logger: Logger = container.get(dependencies.Logger);
        try {
            //We get the users to notify
            const usersToNotify: User[] = await this.getUsersToNotify(event);
            //We extract only the ID in primitive value (string) of the users to notify.
            const usersIDToNotify = usersToNotify.map(user => user.id.toString());
            //We extract the data to send and serialize it
            const dataToSend = this.extractDataFromEvent(event);
            //We send the data
            WebSocketClients.emitDataToUsers(
                usersIDToNotify,
                'IoTDeviceData',
                dataToSend
            );
            //We log the action
            logger.info(`Data for the event [${dataToSend.key}] was succesfully sent via web sockets.`);
        } catch(error) {
            //We log the error
            logger.error(error.message);
        }
        
    }

    private extractDataFromEvent = (event: CreatedIoTDeviceData) => ({
        key: event.deviceData.key.toString(),
        value: event.deviceData.value.value,
    });

    private getUsersToNotify = async (event: CreatedIoTDeviceData): Promise<User[]> => {
        const { deviceData: { deviceId } } = event;
        //We get and execute the FindIoTDevice use case.
        const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
        const ownerUser: User = await findIoTDevice.findOwnerByDeviceId(deviceId);
        //TODO: Get subscriptors allowed to see the activity
        return [ownerUser];
    }
}