//Domain
import Notification from '../../../application/Notifications/domain/Notification';
//Domain exceptions
import NotificationTypeNotValid from '../../../application/Notifications/domain/exceptions/NotificationTypeNotValid';
//Use cases
import CreateNotification from '../../../application/Notifications/application/create/CreateNotification';
//Mock repository
import NotificationsMockRepository, { testNotificationPrimitives } from '../../Shared/infrastructure/Notifications/NotificationsMockRepository';

//Global variables
const notificationsRepository = new NotificationsMockRepository();
const createNotification: CreateNotification = new CreateNotification(notificationsRepository);
let createdNotification: Notification;

beforeAll(async () => {
    //We execute the use case and store the result
    createdNotification = await createNotification.run(
        testNotificationPrimitives
    );
});

//We test the notification creation by the use case.
it('The notification is created successfully by the use case', () => {
    expect(createdNotification.toPrimitives()).toMatchObject(testNotificationPrimitives);
});

//We test the notification type verification
it('Not valid notification types throws an exception', async () => {
    try {
        const testNotificationWithWrongType = {
            type: 'NOT_VALID',
            content: 'This should throw an exception',
            recipients: testNotificationPrimitives.recipients
        }
        await createNotification.run(testNotificationWithWrongType);
    } catch(exception) {
        expect(exception).toBeInstanceOf(NotificationTypeNotValid);
    }
});