//User domain
import UserAuthentication from './UserAuthentication';
//Common
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description User repository abstraction.
 */
export default interface UserAuthenticationRepository extends DataRepository<UserAuthentication>{
    //We only need the base methods of DataRepository interface (CRUD operations)
}
