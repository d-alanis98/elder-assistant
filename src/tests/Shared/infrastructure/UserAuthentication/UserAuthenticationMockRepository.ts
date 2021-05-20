//User authentication domain
import UserAuthentication from '../../../../application/UserAuthentication/domain/UserAuthentication';
//Repository contract
import UserAuthenticationRepository from '../../../../application/UserAuthentication/domain/UserAuthenticationRepository';
//Mock repository
import InMemoryRepository from '../Persistence/InMemoryRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mock user authentication repository implementing in-memory data storage.
 */
export default class UserAuthenticationMockRepository 
    extends InMemoryRepository<UserAuthentication> 
    implements UserAuthenticationRepository {
    constructor() {
        super();
    }

    /**
     * Method to determine if the token record exists or not.
     * @param {string} token Token to search for.
     * @returns 
     */
    hasRefreshToken = async (token: string): Promise<boolean> => {
        const record = await this.search({ token: token });
        return record !== null && record !== undefined;
    }
}