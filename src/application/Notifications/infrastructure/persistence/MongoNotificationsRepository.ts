//Domain
import Notification from '../../domain/Notification';
import NotificationId from '../../domain/value-objects/NotificationId';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import NotificationRepository from '../../domain/NotificationsRepository';
//Query parameters
import { defaultQueryParameters, QueryParameters } from '../../../Shared/infrastructure/Persistence/DataRepository';
//Base repository implementation
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mongo DB repository for the Notifications collection.
 */
export default class MongoNotificationsRepository
    extends MongoRepository<Notification>
    implements NotificationRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'Notifications';
    /**
     * Creates a new document (notification  data entry) in the collection.
     * @param {Notification} notification The notification domain instance.
     * @returns 
     */
    public create = async (notification: Notification): Promise<void> => {
        return this.createInCollection(notification);
    }

    /**
     * Searchs a notification data entry in the collection, by ID.
     * @param {string} id ID of the notification data record.
     * @returns 
     */
    public search = async (id: NotificationId): Promise<Nullable<Notification>> => {
        const document = await this.findInCollection(id.toString());
        //We return the notification, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? Notification.fromPrimitives({
                _id: id.toString(),
                ...document,
            })
            : null;
    }

    /**
     * Method to get all the records in the repository, based on a query, wheter by ID or a different query represented with
     * an object.
     * @param {NotificationId|Object} query Query, wheter the ID of the resoruce of a query represented in an object.
     * @param {QueryParamaters} queryParameters Extra parameters like limit, order, etc.
     * @returns 
     */
    public searchAll = async (query: Object, queryParameters?: QueryParameters): Promise<Nullable<Notification[]>> => {
        //We get the id or query
        //We get the documents
        const documents = await this.findAllInCollection(
            query,
            queryParameters || { order: { issuedAt: -1 } }
        );
        //We return the items
        return documents
            ? documents.map(document => Notification.fromPrimitives(document))
            : null;
    }


    /**
     * Method to get all the results in a paginated way, with the following structure:
     * @param {Object} filters The filters to apply to the query (i.e: get data by deviceID).
     * @param {QueryParameters} queryParameters Parameters for the pagination.
     * @returns 
     */
    public searchAllPaginated = async (filters: Object, queryParameters?: QueryParameters): Promise<Nullable<any>> => {
        const documents = await this.findAllPaginated(
            queryParameters
                ? { ...defaultQueryParameters, ...queryParameters } //We merge the parameters (with the provided parameters overriding the default ones if they exist)
                : defaultQueryParameters,
            filters
        );
        //We return the items
        return documents
            ? ({
                data: documents.data.map(document => Notification.fromPrimitives(document)),
                next: documents.next
            })
            : null;
    }

    /**
     * Updates a notification data record.
     * @param {Notification} notification The notification data instance with the data to save. 
     * @returns 
     */
    public update = async (notification: Notification): Promise<void> => {
        return await this.updateInCollection(notification.id.toString(), notification);
    }

    /**
     * Deletes a notification data entry from the repository.
     * @param {NotificationId} id ID of the notification data.
     */
    public delete = async (id: NotificationId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }


    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    protected moduleName = (): string => this.COLLECTION;

}