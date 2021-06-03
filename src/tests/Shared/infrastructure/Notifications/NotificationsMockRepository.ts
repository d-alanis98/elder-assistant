//Domain
import Notification from '../../../../application/Notifications/domain/Notification';
//Mock repository implementation
import InMemoryRepository from '../Persistence/InMemoryRepository';
//Mock users
import { primaryUser, secondaryUser } from '../../domain/User/testUsers';

export default class NotificationsMockRepository 
    extends InMemoryRepository<Notification> {

}

export const testNotificationPrimitives = {
    type: 'SYSTEM',
    content: 'Testing notifications',
    recipients: [
        primaryUser.id.toString(),
        secondaryUser.id.toString(),
    ]
}

export const testNotification = Notification.fromPrimitives(
    testNotificationPrimitives
);