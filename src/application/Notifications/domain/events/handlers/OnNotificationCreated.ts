//Domain
import Notification from '../../Notification';
//Domain event
import NotificationCreated from '../NotificationCreated';
//Web sockets manager
import WebSocketClients from '../../../../Shared/infrastructure/WebSockets/WebSocketClients';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Handler for the NotificationCreated domain event.
 */
export default class OnNotificationCreated {

    /**
     * Entry point of the event handler.
     * @param {NotificationCreated} event Emitted event.
     */
    public handle = async (event: NotificationCreated) => {
        //We emmit the data through the notification channels, WebSockets by default
        /**
         * @todo Get other notification channels preferences by user and emmit the notification
         */
        await this.emmitNotificationThroughWebSockets(event.notificationData);
    }

    /**
     * Method to emmit the notification through WebSockets.
     * @param {Notification} notification Created notification.
     */
    private emmitNotificationThroughWebSockets = async (
        notification: Notification
    ) => {
        WebSocketClients.emitDataToUsers(
            notification.toPrimitives().recipients,
            'Notification',
            notification.toPrimitives()
        );
    }
}