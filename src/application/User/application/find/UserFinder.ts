//User domain
import User from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserNotFound from '../../domain/exceptions/UserNotFound';
import UserRepository from '../../domain/UserRepository';
//Shared domain
import { QueryParameters } from '../../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.2
 * @description Find user use case abstraction, it returns a User instance if the provided userId was found in the repository
 * or throws an exception if it wasn't.
 */
export default class UserFinder {
    //Constants
    private readonly DEFAULT_USERS_LIMIT = 25;
    //Member properties
    private readonly dataRepository: UserRepository;

    constructor(dataRepository: UserRepository) {
        this.dataRepository = dataRepository;
    }

    /**
     * Entry point for the use case. It receives the user id wether as string or as a UserId value object, performing the
     * transformation to UserId in case it comes as string. 
     * Then, it searchs the user by its id in the repository and return the reference if it was found, otherwise it throws
     * an exception.
     * @param {string|UserId} id 
     * @returns 
     */
    find = async (id: string | UserId): Promise<User> => {
        //We handle the user ID, making it consisitently a UserId instance
        const userId = id instanceof UserId ? id : new UserId(id);
        //We search the user in the repository
        const user = await this.dataRepository.search(userId);
        //We validate the user, if it is null we thrown a not found exception
        if(!user)
            throw new UserNotFound();
        //We return the found user 
        return user;
    }

    /**
     * Method to get all the users by name and lastname match.
     * @param {string} name User name.
     * @param {number} limit Query results limit.
     * @param {string} lastName User last name.
     * @param {string} startingAt Query start point. 
     * @returns 
     */
    getAllUsers = async ({
        name: userName,
        limit: userLimit,
        lastName: userLastName,
        startingAt,
    }: getAllUserParameters) => {
        //We set the default parameters
        const name = userName || '';
        const limit = userLimit || this.DEFAULT_USERS_LIMIT;
        const lastName = userLastName || '';
        //We set the filters
        const filters = {
            name: { $regex: name, $options: 'i' },
            lastName: { $regex: lastName, $options: 'i'}
        };
        //We get the paginated records
        const paginatedData = await this.dataRepository.searchAllPaginated(
            filters,
            { limit, startingAt }
        );
        //We validate the result
        if(!paginatedData)
            throw new UserNotFound();
        //We return the paginated data
        return paginatedData;
    }

}

//Props
interface getAllUserParameters extends QueryParameters {
    name: string;
    lastName: string;
}