//Domain
import Subscription from './Subscription';
//Shared
import { Nullable } from '../../Shared/domain/Nullable';
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Subscription repository contract.
 */
export default interface SubscriptionRepository extends DataRepository<Subscription> {
    //We are going to use the defined methods in DataRepository<T>, we don't need another one
    search(filter: Object): Promise<Nullable<Subscription>>;
    searchAll(filter: Object): Promise<Nullable<Subscription[]>>;
}