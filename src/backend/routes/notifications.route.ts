import { Router } from 'express';
//Middlewares
import UserAuthentication from '../middleware/User/UserAuthentication';
//Controllers
import NotificationsController from '../controllers/Notifications/NotificationsController';
import NotificationSettingsController from '../controllers/NotificationSettings/NotificationSettingsController';


export const register = (router: Router) => {
    const notificationsController: NotificationsController = new NotificationsController();
    //Get notifications history by userID
    router.get(
        '/notifications',
        UserAuthentication.validateAuthToken,
        notificationsController.run.bind(notificationsController)
    );

    /**
     * Notification settings
     */
    const notificationSettingsController: NotificationSettingsController = new NotificationSettingsController();
    //Register device token for push notifications
    router.post(
        '/notifications/register-token',
        UserAuthentication.validateAuthToken,
        notificationSettingsController.run.bind(notificationSettingsController)
    );
}