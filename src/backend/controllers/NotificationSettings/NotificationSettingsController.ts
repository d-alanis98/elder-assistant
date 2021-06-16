import httpStatus from 'http-status';
import { Response } from 'express';
//Use cases
import CreateNotificationSettings from '../../../application/NotificationSettings/application/create/CreateNotificationSettings';
//Base controller
import Controller from '../Controller';
//Helpers
import UserControllerHelpers from '../Shared/User/UserControllerHelpers';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Dependency injection
import container from '../../dependency-injection';
import { notificationSettingsDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Controller to handle notification settings use cases requests.
 */
export default class NotificationSettingsController extends Controller {
    /**
     * Method to handle de device token registration for push notifications.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We extract the user data from the request
            const userId = UserControllerHelpers.getUserIdFromRequest(request);
            //We get the device token
            const { deviceToken } = request.body;
            //We get and execute execute the use case
            const createNotificationSettings: CreateNotificationSettings = container.get(
                notificationSettingsDependencies.UseCases.CreateNotificationSettings
            );
            const notificationSettings = await createNotificationSettings.registerDeviceToken(
                userId,
                deviceToken
            );
            //We send the notification settings data
            response.status(httpStatus.OK).send(notificationSettings.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }
}