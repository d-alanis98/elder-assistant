//User domain
import User from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserRepository from '../../domain/UserRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';
import { DataRepository } from '../../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Mongo DB repository for the Users collection.
 */
export class MongoUsersRepository extends MongoRepository<User> implements UserRepository, DataRepository<User> {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'Users';

    /**
     * 
     * @param {User} user The user instance with the data to save 
     * @returns 
     */
    public save(user: User): Promise<void> {
        return this.persist(user.id.toString(), user);
    }

    public async search(id: UserId): Promise<Nullable<User>> {
        const collection = await this.collection();
        const document = await collection.findOne({ _id: id.toString() });
        //We return the user, creating it from primitives, if the document exists, otherwise returning null
        return document 
            ? User.fromPrimitives({
                _id: id.toString(), 
                ...document,
            }) 
            : null;
    }

    protected moduleName = (): string => this.COLLECTION;
}
