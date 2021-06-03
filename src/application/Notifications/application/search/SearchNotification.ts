//Domain
import Notification, { NotificationPrimitives } from '../../domain/Notification';
import NotificationId from '../../domain/value-objects/NotificationId';
//Domain exceptions
import NotificationNotFound from '../../domain/exceptions/NotificationNotFound';
//User domain
import UserId from '../../../Shared/domain/modules/User/UserId';
//Shared domain
import PaginatedDataResult from '../../../Shared/domain/requests/PaginatedDataResult';
//Repository contract
import NotificationRepository from '../../domain/NotificationsRepository';
//Query parameters
import { QueryParameters } from '../../../Shared/infrastructure/Persistence/DataRepository';


/**
 * @author Damian Alanis Ramirez
 * @version 1.2.1
 * @description Search notification use case.
 */
export default class SearchNotification {
    private readonly notificationsRepository: NotificationRepository;

    constructor(notificationsRepository: NotificationRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    /**
     * Method to search a notification by ID.
     * @param {string|NotificationId} id ID of the notification.
     * @returns 
     */
    public byId = async (
        id: string | NotificationId
    ): Promise<Notification> => {
        //We normalize the ID
        const notificationId = id instanceof NotificationId
            ? id
            : new NotificationId(id);
        //We search the notification
        const notification = await this.notificationsRepository.search(notificationId);
        //We validate the notification existance
        if(!notification)
            throw new NotificationNotFound();
        return notification;
    }

    /**
     * Method to get all the notifications of a user.
     * @param id Id of the user.
     * @param queryParameters Query parameters (limit, and startingAt) for the pagination.
     * @returns 
     */
    public getAllByUserId = async (
        id: string | UserId,
        queryParameters?: QueryParameters
    ): Promise<PaginatedDataResult<Notification>> => {
        //We normalize the ID
        const userId = id.toString();
        //We search for the notifications
        const paginatedNotifications = await this.notificationsRepository.searchAllPaginated(
            { recipients: userId },
            queryParameters
        );
        //We validate the notifications
        if(!paginatedNotifications)
            throw new NotificationNotFound();
        return paginatedNotifications;
    }

    //Facade
    /**
     * Method to get the data records in primitive reoresentation.
     * @param {PaginatedDataResult<Notification>} notificationRecords Paginated data collection in aggregate instance form.
     * @returns 
     */
    static getDataRecordsInPrimitiveValues = (
        notificationRecords: PaginatedDataResult<Notification>
    ): PaginatedDataResult<NotificationPrimitives> => ({
        ...notificationRecords,
        data: Notification.getNotificationsListInPrimitiveValues(notificationRecords.data)
    });

}