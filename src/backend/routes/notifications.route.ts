import { Router } from 'express';
//Middlewares
import UserAuthentication from '../middleware/User/UserAuthentication';
//Controllers
import NotificationsController from '../controllers/Notifications/NotificationsController';


export const register = (router: Router) => {
    const notificationsController: NotificationsController = new NotificationsController();
    //Get notifications history by userID
    router.get(
        '/notifications',
        UserAuthentication.validateAuthToken,
        notificationsController.run.bind(notificationsController)
    );
}