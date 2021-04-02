//Shared
import { Nullable } from '../../Shared/domain/Nullable';
//User
import User from './User';
import UserId from '../../Shared/domain/modules/User/UserId';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description User repository abstraction.
 */
export default interface UserRepository {
    save(user: User): Promise<void>;

    search(id: UserId): Promise<Nullable<User>>;
}
