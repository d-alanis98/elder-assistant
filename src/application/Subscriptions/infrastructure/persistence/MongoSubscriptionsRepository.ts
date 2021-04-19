//Subscription domain
import Subscription from '../../domain/Subscription';
import SubscriptionId from '../../domain/value-objects/SubscriptionId';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import SubscriptionRepository from '../../domain/SubscriptionsRepository';
//Mongo base repository
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.2
 * @description Mongo DB repository for the Subscription collection.
 */
export default class MongoSubscriptionsRepository
    extends MongoRepository<Subscription>
    implements SubscriptionRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'Subscriptions';

    /**
     * Searchs a subscription in the collection, by the provided filter.
     * @param {Object} filter Filter to apply to the query.
     * @returns 
     */
    search = async (filter: Object): Promise<Nullable<Subscription>> => {
        const document = await this.findInCollection(filter);
        //We return the subscription, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? Subscription.fromPrimitives(document)
            : null;
    }

    /**
     * Searchs all the subscriptions in the collection matching the provided filter.
     * @param {Object} filter Filter to apply to the query.
     * @returns 
     */
    searchAll = async (filter: Object): Promise<Nullable<Subscription[]>> => {
        const documents = await this.findAllInCollection(filter);
        //We return the documents
        return documents && Array.isArray(documents)
            ? documents.map(document => Subscription.fromPrimitives(document))
            : null;
    }

    /**
     * Creates a new document (subscription) in the collection.
     * @param {Subscription} subscription The subscription domain entity instance.
     * @returns 
     */
    create = async (subscription: Subscription) => {
        return this.createInCollection(subscription);
    }

    /**
     * Updates a subscription in the repository.
     * @param {Subscription} subscription The subscription instance with the data to save 
     * @returns 
     */
    public update = async (subscription: Subscription): Promise<void> => {
        return await this.updateInCollection(subscription.id.toString(), subscription);
    }

    /**
     * Deletes a subscription from the repository.
     * @param {SubscriptionId} id ID of the subscription.
     */
    public delete = async (id: SubscriptionId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }

    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    moduleName = () => this.COLLECTION;


}