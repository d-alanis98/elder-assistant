//Domain
import NotificationSettings from '../../domain/NotificationSettings';
//Shared domain
import UserId from '../../../Shared/domain/modules/User/UserId';
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import NotificationSettingsRepository from '../../domain/NotificationSettingsRepository';
//Base repository implementation
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mongo DB repository for the NotificationSettings collection.
 */
export default class MongoNotificationsRepository
    extends MongoRepository<NotificationSettings>
    implements NotificationSettingsRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'NotificationSettings';
    /**
     * Creates a new document (notificationSettings  data entry) in the collection.
     * @param {NotificationSettings} notificationSettings The notificationSettings domain instance.
     * @returns 
     */
    public create = async (notificationSettings: NotificationSettings): Promise<void> => {
        return this.createInCollection(notificationSettings);
    }

    /**
     * Searchs a notification settings data entry in the collection, by user ID.
     * @param {string} id ID of the user that owns the notification settings data record.
     * @returns 
     */
    public search = async (id: UserId): Promise<Nullable<NotificationSettings>> => {
        const document = await this.findInCollection(id.toString());
        //We return the notificationSettings, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? NotificationSettings.fromPrimitives({
                _id: id.toString(),
                ...document,
            })
            : null;
    }

    /**
     * Updates a notification settings data record.
     * @param {NotificationSettings} notificationSettings The notificationSettings data instance with the data to save. 
     * @returns 
     */
    public update = async (notificationSettings: NotificationSettings): Promise<void> => {
        return await this.updateInCollection(notificationSettings.id.toString(), notificationSettings);
    }

    /**
     * Deletes a notification settings data entry from the repository.
     * @param {UserId} id ID of the notificationSettings data.
     */
    public delete = async (id: UserId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }


    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    protected moduleName = (): string => this.COLLECTION;

}