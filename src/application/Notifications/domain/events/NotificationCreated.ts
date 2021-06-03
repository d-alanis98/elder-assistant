//Domain
import Notification from '../Notification';
//Base event
import DomainEvent from '../../../Shared/domain/events/DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event that is emitted when a notification is created.
 */
export default class NotificationCreated extends DomainEvent {
    readonly notificationData: Notification;

    constructor(notificationData: Notification) {
        super();
        this.notificationData = notificationData;
    }

    getAggregateId = () => this.notificationData.id; 
}