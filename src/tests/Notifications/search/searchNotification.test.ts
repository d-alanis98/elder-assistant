//Domain
import Notification from '../../../application/Notifications/domain/Notification';
//Use cases
import CreateNotification from '../../../application/Notifications/application/create/CreateNotification';
import SearchNotification from '../../../application/Notifications/application/search/SearchNotification';
//Mock repository implementation
import NotificationsMockRepository, { testNotificationPrimitives } from '../../Shared/infrastructure/Notifications/NotificationsMockRepository'


//Global variables
const notificationsRepository = new NotificationsMockRepository();
const createNotification: CreateNotification = new CreateNotification(notificationsRepository);
let searchNotification: SearchNotification;
let createdNotification: Notification;

beforeAll(async () => {
    //We create the notification
    createdNotification = await createNotification.run(testNotificationPrimitives);
    //We create the search notification use case
    searchNotification = new SearchNotification(notificationsRepository);
});

//We test the notification search by ID
it('Notification is found by ID', async () => {
    const foundNotification = await searchNotification.byId(createdNotification.id);
    expect(foundNotification).toMatchObject(createdNotification.toPrimitives());
});

//We test the notifications search by user ID.
it('User notifications are retrieved successfully', async () => {
    const foundNotifications = await searchNotification.getAllByUserId(testNotificationPrimitives.recipients[0]);
    expect(foundNotifications.data).toContainEqual(createdNotification.toPrimitives());
});