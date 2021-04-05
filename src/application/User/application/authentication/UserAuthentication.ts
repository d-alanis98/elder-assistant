//User domain
import User from '../../domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
import UserEmail from '../../domain/value-objects/UserEmail';
import UserPassword from '../../domain/value-objects/UserPassword';
import UserRepository from '../../domain/UserRepository';
import UserWithWrongCredentials from '../../domain/exceptions/UserWithWrongCredentials';
//Use cases
import UserFinder from '../find/UserFinder';
//Infrastructure
import SecurityManager from '../../../Shared/infrastructure/Security/SecurityManager';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies from '../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 2.4.6
 * @description User authentication use case abstraction, it handles the authentication of the user, given an email and a 
 * password in plain text, it makes use of the password hasher to compare the stored hashed password and resolve if the 
 * credentials are correct, throwing an exception if they don't match.
 */
export default class UserAuthentication {
    private readonly dataRepository: UserRepository;

    constructor(dataRepository: UserRepository) {
        this.dataRepository = dataRepository;
    }

    /**
     * Entry point for the use case.
     * @param {UserCredentials} credentials User credentials, which may be of string type.
     */
    public run = async ({
        email,
        password
    }: UserCredentials): Promise<string> => {
        //We force the credentials to be value-objects, for consistency
        const { email: userEmail, password: userPassword }: UserCredentials = this.normalizeCredentials({ email, password });
        //We get the user's ID
        const userId: UserId = await this.getUserId(userEmail);
        //We get the user in the database, making use of the use case UserFinder
        const user: User = await this.getUser(userId);
        //We set the stored password in a variable, it is safe to make the cast to UserPassword because this field will always exist in DB.
        const storedPassword: UserPassword = <UserPassword> user.password;
        //We validate the password, if it does not match, we throw a UserWithWrongCredentials exception
        if(!(await this.comparePasswords(userPassword, storedPassword)))
            throw new UserWithWrongCredentials();
        //We return the authentication token for the user
        return await this.generateToken(user); 
    }

    /**
     * Method that generates a token with the Authenticator dependency.
     * @param {User} user User data to store in the token. 
     * @returns 
     */
    private generateToken = async (user: User): Promise<string> => {
        //We get all the user properties except from the password (even if it is a hash we don't want to expose it).
        const userWithoutPassword: User = User.getUserWithoutPassword(user);
        //We use the authenticator to sign and generate the token
        const authenticator = container.get(dependencies.Authenticator);
        //We generate the token that stores the user data
        return await authenticator.signAuthToken(userWithoutPassword);
    }

    /**
     * Method that returns a uniform object of user credentials, with value-objects instead of primitive values (if present)
     * for consistency.
     * @param {UserCredentials} credentials User credentials, which may be of string type.
     * @returns 
     */
    private normalizeCredentials = ({
        email,
        password
    }: UserCredentials) => ({
        email: email instanceof UserEmail 
            ? email 
            : new UserEmail(email),
        password: password instanceof UserPassword 
            ? password 
            : new UserPassword(password)
    });

    /**
     * Method to get the UserId of the user by the hash of it's email.
     * @param {UserEmail} email Email of the user 
     * @returns 
     */
    private getUserId = async (email: UserEmail): Promise<UserId> => {
        //We get the email hasher from the dependencies container
        const emailHasher: SecurityManager = container.get(dependencies.EmailHasher);
        //We hash the email to get the user ID
        const hash = await emailHasher.encrypt(email.toString());
        //We return the user id value object instance
        return new UserId(hash);
    }

    /**
     * Finds the user in the repository by it's id and returns a User instance, if it does not exist, throws a UserNotFound 
     * exception.
     * @param {UserId} userId Id of the user. 
     * @returns 
     */
    private getUser = async (userId: UserId): Promise<User> => {
        const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
        return await userFinder.find(userId);
    }

    /**
     * Method that compares the recived plain text password and the hashed password stored in the repository, making
     * use of the PasswordHasher dependency.
     * @param {UserPassword} receivedPassword The plain text password received from the request.
     * @param {UserPassword} storedPassword The stored hashed password of the user.
     * @returns 
     */
    private comparePasswords = async (receivedPassword: UserPassword, storedPassword: UserPassword): Promise<Boolean> => {
        const passwordHasher: SecurityManager = container.get(dependencies.PasswordHasher);
        if(passwordHasher.compare)
            return await passwordHasher.compare(receivedPassword.toString(), storedPassword.toString());
        return false;
    }
}

export interface UserCredentials {
    email: string | UserEmail,
    password: string | UserPassword
};