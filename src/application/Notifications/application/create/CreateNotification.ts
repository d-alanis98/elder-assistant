//Domain
import Notification, { NotificationCreateRequest } from '../../domain/Notification';
//Domain events
import NotificationCreated from '../../domain/events/NotificationCreated';
//Repository contract
import NotificationRepository from '../../domain/NotificationsRepository';
//Events handler
import DomainEventsHandler from '../../../Shared/domain/events/DomainEventsHandler';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Create notification use case.
 */
export default class CreateNotification {
    private readonly notificationsRepository: NotificationRepository;

    constructor(notificationsRepository: NotificationRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} type Notification type.
     * @param {any} content Notification content.
     * @param {string[]} recipients Notification recipients. 
     * @returns 
     */
    public run = async ({
        type,
        content,
        recipients
    }: NotificationCreateRequest): Promise<Notification> => {
        //We create the notification instance
        const notification = Notification.fromPrimitives({
            type, 
            content, 
            recipients
        });
        //We persist it in the repository
        await this.notificationsRepository.create(notification);
        //We generate and dispatch the domain event
        notification.addDomainEvent(new NotificationCreated(notification));
        DomainEventsHandler.dispatchEventsForAggregate(notification.id);
        //We return the created notification
        return notification;
    }
}