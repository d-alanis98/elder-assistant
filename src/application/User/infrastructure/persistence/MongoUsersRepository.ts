//User domain
import User from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserRepository from '../../domain/UserRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Infrastructure
import { DataRepository } from '../../../Shared/infrastructure/Persistence/DataRepository';
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.6
 * @description Mongo DB repository for the Users collection.
 */
export class MongoUsersRepository extends MongoRepository<User> implements UserRepository, DataRepository<User> {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'Users';

    /**
     * Creates a new document (user) in the collection.
     * @param {User} user 
     * @returns 
     */
    public create = async (user: User): Promise<void> => {
        return this.createInCollection(user);
    }

    /**
     * Searchs a user in the collection, by ID.
     * @param {string} id ID of the user.
     * @returns 
     */
    public search = async (id: UserId): Promise<Nullable<User>> => {
        const document = await this.findInCollection(id.toString());
        //We return the user, creating it from primitives, if the document exists, otherwise returning null
        return document 
            ? User.fromPrimitives({
                _id: id.toString(), 
                ...document,
            }) 
            : null;
    }

    /**
     * Updates a user
     * @param {User} user The user instance with the data to save 
     * @returns 
     */
     public update = async (user: User): Promise<void> => {
        return await this.updateInCollection(user.id.toString(), user);
    }


    public delete = async (id: UserId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }


    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    protected moduleName = (): string => this.COLLECTION;
}
