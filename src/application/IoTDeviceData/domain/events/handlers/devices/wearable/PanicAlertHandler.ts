//Domain
import NotificationSettings from '../../../../../../NotificationSettings/domain/NotificationSettings';
//Domain events
import CreatedIoTDeviceData from '../../../CreatedIoTDeviceData';
//Use cases
import SearchNotificationSettings from '../../../../../../NotificationSettings/application/search/SearchNotificationSettings';
//Base handler
import BaseHandler from '../BaseHandler';
//Push notifications manager
import PushNotificationEmitter from '../../../../../../Shared/infrastructure/PushNotifications/PushNotificationsEmitter';
//Dependency injection
import container from '../../../../../../../backend/dependency-injection';
import dependencies, { notificationSettingsDependencies } from '../../../../../../Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Handler for the Panic Alert event.
 */
export default class PanicAlertHandler extends BaseHandler {

    /**
     * Handler method.
     * @param {CreatedIoTDeviceData} event Emitted event.
     */
    onCreated = async (event: CreatedIoTDeviceData) => {
        //We execute the base handler (send data through WS)
        this.sendDataThroughWebSocket(event);
        //We emit the push notifications
        this.emitPushNotifications(event);
    }

    /**
     * Method to emit the push notification.
     * @param {CreatedIoTDeviceData} event Emitted event.
     */
    private readonly emitPushNotifications = async (event: CreatedIoTDeviceData) => {
        //First, we get the suers to notify
        const usersToNotify = await this.getIdOfUsersToNotify(event);
        //Then, we get the user device tokens
        const deviceTokens = await this.getUserDeviceTokens(usersToNotify);
        //We get the owner user data
        const ownerUser = this.getOwnerUserData();
        //We emit the push notification
        new PushNotificationEmitter(
            container.get(dependencies.Logger),
            deviceTokens,
            {
                title: 'Alerta de pánico',
                body: `Alerta de pánico generada por el usuario ${ ownerUser?.name } ${ ownerUser?.lastName}. Presione la notificacion para ver la alerta en la aplicación`
            }
        ).emit();
    }   

    /**
     * Method to get the device tokens of the users, to emit notifications to each one of their registered devices.
     * @param {string[]} usersToNotify ID's of the users to notify.
     * @returns 
     */
    private getUserDeviceTokens = async (usersToNotify: string[]) => {
        const notificationSettings = await this.getNotificationSettings(usersToNotify);
        //We return all the device tokens (all the recipients)
        return this.getDeviceTokensFromNotificationSettings(notificationSettings);
    }

    /**
     * Methodto get the notification settings of each user to notify.
     * @param {string[]} usersToNotify ID's of the users to notify. 
     * @returns 
     */
    private getNotificationSettings = async (usersToNotify: string[]) => {
        //We get the use case
        const searchNotificationSettings: SearchNotificationSettings = container.get(
            notificationSettingsDependencies.UseCases.SearchNotificationSettings
        );
        //We get the notification settings of every user
        let notificationSettings = [];
        for(const userId of usersToNotify) {
            try {
                const result = await searchNotificationSettings.byUserId(userId);
                notificationSettings.push(result);
            } catch {
                continue;
            }
        }
        //We return the result when all promises resolve
        return notificationSettings;
    }

    /**
     * Method to extract the tokens from the notification settings of each user.
     * @param {NotificationSettings} notificationSettings Notification settings of the users.
     * @returns 
     */
    private getDeviceTokensFromNotificationSettings = (notificationSettings: NotificationSettings[]) => (
        notificationSettings.reduce((accumulated: string[], current) => (
            accumulated.concat(current.deviceTokens?.value || [])
        ), [])
    );

    /**
     * Method to get te user primitives of the owner user.
     * @returns {Object}
     */
    private getOwnerUserData = () => {
        const ownerUser = this.ownerUser;
        return ownerUser?.toPrimitives();
    }
}