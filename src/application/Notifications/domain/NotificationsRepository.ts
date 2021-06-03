//Domain
import Notification from './Notification';
import NotificationId from './value-objects/NotificationId';
//Base repository specification
import { DataRepository, QueryParameters } from '../../Shared/infrastructure/Persistence/DataRepository';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import PaginatedDataResult from '../../Shared/domain/requests/PaginatedDataResult';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification repository contract.
 */
export default interface NotificationRepository extends DataRepository<Notification> {
    searchAll(
        filter: NotificationId | Object, 
        queryParameters?: QueryParameters
    ): Promise<Nullable<Notification[]>>;

    searchAllPaginated(
        filters: Object, 
        queryParameters?: QueryParameters
    ): Promise<Nullable<PaginatedDataResult<Notification>>>;
}