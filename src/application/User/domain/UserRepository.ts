//Shared
import { Nullable } from '../../Shared/domain/Nullable';
//User
import User from './User';
import UserId from '../../Shared/domain/modules/User/UserId';
//Common
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.0.3
 * @description User repository abstraction.
 */
export default interface UserRepository extends DataRepository<User> {
    /** 
     * @note The methods are described here, but this is redundant, they can be ommited because the exact same methods
     * are defined into DataRepository with a generic type, that resolves to User in this implementation so they are
     * exactly the same at the end. This is only for reference.
    */

    save(user: User): Promise<void>;

    search(id: UserId): Promise<Nullable<User>>; 
}
