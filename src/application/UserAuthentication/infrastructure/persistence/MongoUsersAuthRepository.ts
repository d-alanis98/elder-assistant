//User domain
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserAuthentication from '../../domain/UserAuthentication';
import UserAuthenticationRepository from '../../domain/UserAuthenticationRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Infrastructure
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';
import AggregateRoot from '../../../Shared/domain/AggregateRoot';




/**
 * @author Damián Alanís Ramírez
 * @version 1.3.3
 * @description Mongo DB repository for the Users collection.
 */
export class MongoUsersAuthRepository extends MongoRepository<UserAuthentication> implements UserAuthenticationRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'UserAuthentication';

    /**
     * Creates a new document (user) in the collection.
     * @param {User} user 
     * @returns 
     */
    public create = async (user: UserAuthentication): Promise<void> => {
        return this.createInCollection(user);
    }

    /**
     * Searchs a user in the collection, by ID.
     * @param {string} id ID of the user.
     * @returns 
     */
    public search = async (id: UserId): Promise<Nullable<UserAuthentication>> => {
        const document = await this.findInCollection(id.toString());
        //We return the user, creating it from primitives, if the document exists, otherwise returning null
        return document 
            ? UserAuthentication.fromPrimitives({
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
    public update = async (user: UserAuthentication): Promise<void> => (
        await this.updateInCollection(user.id.toString(), user)
    );

    /**
     * Deletes an UserAuthentication entry.
     * @param {UserId} id User id. 
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



interface ExtendedData extends UserAuthentication {
    date: Date | string | number;
}