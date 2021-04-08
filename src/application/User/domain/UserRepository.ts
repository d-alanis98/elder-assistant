//User domain
import User from './User';
//Common
import { DataRepository } from '../../Shared/infrastructure/Persistenc/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.5
 * @description User repository abstraction.
 */
export default interface UserRepository extends DataRepository<User>{
    //We only need the base methods of DataRepository interface (CRUD operations)
}
