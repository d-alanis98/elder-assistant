import httpStatus from 'http-status';
import { Response } from 'express';
//Domain
import Notification from '../../../application/Notifications/domain/Notification';
//Use cases
import SearchNotification from '../../../application/Notifications/application/search/SearchNotification';
//Shared domain
import PaginatedDataResult from '../../../application/Shared/domain/requests/PaginatedDataResult';
//Domain events
import NotificationCreated from '../../../application/Notifications/domain/events/NotificationCreated';
//Domain event handlers
import OnNotificationCreated from '../../../application/Notifications/domain/events/handlers/OnNotificationCreated';
//Base controller
import Controller from '../Controller';
//Helpers
import UserControllerHelpers from '../Shared/User/UserControllerHelpers';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Dependency injection
import container from '../../dependency-injection';
import { notificationsDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Controller to handle notification use cases requests.
 */
export default class NotificationsController extends Controller {
    private readonly searchNotification: SearchNotification;

    constructor() {
        super();
        //We get the use cases
        this.searchNotification = container.get(notificationsDependencies.UseCases.SearchNotification);
    }

    /**
     * Method to handle de notification search by user ID request.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We extract the user data from the request
            const userId = UserControllerHelpers.getUserIdFromRequest(request);
            //We get the pagination parameters
            const { limit: queryLimit, startingAt } = request.query;
            const limit = queryLimit ? Number(queryLimit) : undefined;
            //We execute the use case
            const notifications: PaginatedDataResult<Notification> = await this.searchNotification.getAllByUserId(
                userId,
                { limit, startingAt }
            );
            //We send the data
            response.status(httpStatus.OK).send(
                SearchNotification.getDataRecordsInPrimitiveValues(notifications)
            );
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Event handlers
    /**
     * We register the event handlers for domain events.
     */
    protected registerEventHandlers() {
        //Notificationt creation event
        this.onDomainEvent(NotificationCreated.name, new OnNotificationCreated().handle);
    }
}