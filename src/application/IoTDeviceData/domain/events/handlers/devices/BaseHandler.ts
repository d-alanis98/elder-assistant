//Device data handler specification
import DeviceDataHandler from './DeviceDataHandler';
//Domain events
import CreatedIoTDeviceData from '../../CreatedIoTDeviceData';
//IoTDevice use cases
import FindIoTDevice from '../../../../../IoTDevice/application/find/FindIoTDevice';
//Subscription use cases
import FindSubscription from '../../../../../Subscriptions/application/find/FindSubscription';
//User domain
import User from '../../../../../User/domain/User';
//WebSockets
import WebSocketClients from '../../../../../Shared/infrastructure/WebSockets/WebSocketClients';
//Shared domain
import Logger from '../../../../../Shared/domain/Logger';
//Dependency injection
import container from '../../../../../../backend/dependency-injection';
import dependencies, { iotDeviceDependencies, subscriptionsDependencies } from '../../../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
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
            const usersIDToNotify: string[] = await this.getIdOfUsersToNotify(event);
            //We extract the data to send and serialize it
            const dataToSend = this.extractDataFromEvent(event);
            //We send the data
            WebSocketClients.emitDataToUsers(
                usersIDToNotify,
                'IoTDeviceData',
                dataToSend
            );
        } catch(error) {
            //We log the error
            logger.error(error.message);
        }
        
    }

    /**
     * Method to extract the data from the event and transform it to primitive values.
     * @param {CreatedIoTDeviceData} event Emitted event.
     * @returns 
     */
    private extractDataFromEvent = (event: CreatedIoTDeviceData) => (
        event.deviceData.toPrimitives()
    );

    /**
     * Method to get ehe ID os the users to notify.
     * @param {CreatedIoTDeviceData} event Emitted event.
     * @returns 
     */
    private getIdOfUsersToNotify = async (event: CreatedIoTDeviceData): Promise<string[]> => {
        const { deviceData: { deviceId } } = event;
        //We get and execute the FindIoTDevice use case.
        const findIoTDevice: FindIoTDevice = container.get(iotDeviceDependencies.UseCases.FindIoTDevice);
        const ownerUser: User = await findIoTDevice.findOwnerByDeviceId(deviceId);
        //We get the ID's of the subscriptors to notify
        const subscriptorsToNotify = await this.getAllowedSubscriptorsIds(ownerUser);
        //We return the array of ID's of the users to notify
        return [
            ownerUser.id.toString(), 
            ...subscriptorsToNotify
        ];
    }

    /**
     * Method to get the ID's of the allowed subscriptors, which are the ones with an accepted subscription and the right
     * permissions (receiveNotificationsOnOwnerEvents).
     * @param {User} ownerUser User that owns the device.
     * @returns 
     */
    private getAllowedSubscriptorsIds = async (ownerUser: User): Promise<string[]> => {
        const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
        const allowedSubscriptions = await findSubscription.getAllAcceptedSubscriptions(ownerUser.id.toString());
        //We get the array f
        return allowedSubscriptions.filter(subscription => (
            subscription.permissions?.hasPermission('receiveNotificationsOnOwnerEvents')
        )).map(subscription => subscription.from.toString());
    }
}