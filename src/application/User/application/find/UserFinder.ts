//User domain
import User from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserNotFound from '../../domain/exceptions/UserNotFound';
import UserRepository from '../../domain/UserRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.2
 * @description Find user use case abstraction, it returns a User instance if the provided userId was found in the repository
 * or throws an exception if it wasn't.
 */
export default class UserFinder {
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

}