//User
import User, { NewUserPrimitives } from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserName from '../../domain/value-objects/UserName';
import UserType from '../../domain/value-objects/UserType';
import UserEmail from '../../domain/value-objects/UserEmail';
import UserPassword from '../../domain/value-objects/UserPassword';
import UserLastName from '../../domain/value-objects/UserLastName';
import UserDateOfBirth from '../../domain/value-objects/UserDateOfBirth';
//Domain exceptions
import UserAlreadyExists from '../../domain/exceptions/UserAlreadyExists';
//Repositories
import UserRepository from '../../domain/UserRepository';
//Helpers
import SecurityManager from '../../../Shared/infrastructure/Security/SecurityManager';
//Dependency injection
import container from '../../../../backend/dependency-injection';
//Constants
import dependencies from '../../../Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 2.3.2
 * @description Create user use case abstraction. It handles the validation of user non existance in the repository, throwing
 * and exception when the user already exists and creating a new User instance otherwise, as well as saving it to the repository.
 */
export default class UserCreator {

    private readonly dataRepository: UserRepository;

    constructor(dataRepository: UserRepository) {
        this.dataRepository = dataRepository;
    }

    /**
     * Method that returns a new user instance if the user did not exist, otherwise, it throws an exception.
     * @param {string} name User name.
     * @param {string} type User type.
     * @param {string} email User email.
     * @param {string} password User password.
     * @param {string} lastName User last name.
     * @returns 
     */
    run = async ({
        name,
        type,
        email,
        password,
        lastName,
        dateOfBirth
    }: NewUserPrimitives): Promise<User> => {
        //We get the hashed parameters (email for the user id and password)
        const { id, password: hashedPassword } = await this.getHashedParameters(email, password);
        //We create the user id
        const userId = new UserId(id);
        //We validate the non existance of the user
        await this.validateUserDoesNotExist(userId);
        //We return the new user instance
        const user: User = new User(
            userId,
            new UserName(name),
            new UserType(type),
            new UserEmail(email),
            new UserPassword(hashedPassword),
            new UserLastName(lastName),
            new UserDateOfBirth(dateOfBirth)
        );
        //We save the user in the repository
        await this.dataRepository.create(user);
        //Finally, we return the user instance
        return user;
    }

    /**
     * Method that returns an object with the user ID (hashed email) and the hashed password.
     * @param {string} email User email to be hashed to create the id.
     * @param {string} password User password to be hashed.
     * @returns {Object}
     */
    private getHashedParameters = async (
        email: string,
        password: string
    ) => {
        //We get the security managers from the dependencies container
        const emailHasher: SecurityManager = container.get(dependencies.EmailHasher);
        const passwordHasher: SecurityManager = container.get(dependencies.PasswordHasher); 
        return {
            //We set the user id, which is a hash of the email
            id: await emailHasher.encrypt(email),
            //Also, we set the password hash to save in the repository 
            password: await passwordHasher.encrypt(password)
        }
    }

    /**
     * Method that performs the validation of the user's non existance, calling the search method by id of the data repository.
     * @param {string} userId User ID (the hashed email). 
     */
    private validateUserDoesNotExist = async (userId: UserId): Promise<void> => {
        let user = await this.dataRepository.search(userId);
        if (user)
            throw new UserAlreadyExists();
    }



}