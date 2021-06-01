//User domain
import User from './User';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import PaginatedDataResult from '../../Shared/domain/requests/PaginatedDataResult';
//Common
import { DataRepository, QueryParameters } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.3.5
 * @description User repository abstraction.
 */
export default interface UserRepository extends DataRepository<User>{
    //We only need the base methods of DataRepository interface (CRUD operations)
    searchAllPaginated(filters: Object, queryParameters?: QueryParameters): Promise<Nullable<PaginatedDataResult<User>>>;
}
