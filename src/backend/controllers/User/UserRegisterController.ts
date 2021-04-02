import { Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import httpStatus from 'http-status';
//User domain
import User from '../../../application/User/domain/User';
import UserId from '../../../application/Shared/domain/modules/User/UserId';
import UserRepository from '../../../application/User/domain/UserRepository';
import UserAlreadyExists from '../../../application/User/domain/exceptions/UserAlreadyExists';
//Shared
import Logger from '../../../application/Shared/domain/Logger';
import UserName from '../../../application/User/domain/value-objects/UserName';
import UserType from '../../../application/User/domain/value-objects/UserType';
import UserEmail from '../../../application/User/domain/value-objects/UserEmail';
import UserPassword from '../../../application/User/domain/value-objects/UserPassword';
import UserLastName from '../../../application/User/domain/value-objects/UserLastName';
import NotValidParameters from '../../../application/Shared/domain/exceptions/NotValidParameters';
import InvalidArgumentError from '../../../application/Shared/domain/exceptions/InvalidArgumentError';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
//Infrastructure
import SecurityManager from '../../../application/Shared/infrastructure/Security/SecurityManager';


/**
 * @author Damián Alanís Ramírez
 * @version 1.0.1
 * @description Controller for the register use case.
 */
export default class UserRegisterController extends Controller<User> {
    //Constants
    /**
     * @todo Move this constants to a module or file, to access them in a more convenient way across the app
     */
    private readonly LOGGER_IDENTIFIER           = 'Shared.Logger';
    private readonly SECURITY_MANAGER_IDENTIFIER = 'Shared.SecurityManager';

    constructor(dataRepository: UserRepository) {
        super(dataRepository);
    }

    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async (request: Request, response: Response) => {
        //We get the data from the request body
        const { name, email, type, lastName, password } = request.body;
        try {
            //We validate the request
            this.validate(request);
            //We create a new user
            const user = await this.createUser(name, type, email, password, lastName);
            //We save the user to the respository
            await this.dataRepository.save(user);
            response.status(httpStatus.OK).send(user);
        } catch(error) {
            this.handleExceptions(error, response);
        }
    }

    /**
     * 
     * @param {Request} request Express request 
     */
    private validate = (request: Request) => {
        const errors: ValidationError[] = this.validateRequest(request);
        if(errors.length !== 0)
            throw new NotValidParameters(errors);
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
        //We get the security manager from the dependencies container
        const securityManager: SecurityManager = container.get(this.SECURITY_MANAGER_IDENTIFIER);
        return {
            //We set the user id, which is a hash of the email
            id: await securityManager.encrypt(email),
            //Also, we set the password hash to save in the repository 
            password: await securityManager.encrypt(password)
        }
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
    private createUser = async (
        name: string,
        type: string,
        email: string,
        password: string,
        lastName: string
    ) => {
        //We get the hashed parameters (email for the user id and password)
        const { id, password: hashedPassword } = await this.getHashedParameters(email, password);
        //We validate the non existance of the user
        await this.validateUserDoesNotExist(id);
        //We return the new user instance
        return new User(
            new UserId(id),
            new UserName(name),
            new UserType(type),
            new UserEmail(email),
            new UserPassword(hashedPassword),
            new UserLastName(lastName)
        );
    }

    /**
     * Method that performs the validation of the user's non existance, calling the search method by id of the data repository.
     * @param {string} userId User ID (the hashed email). 
     */
    private validateUserDoesNotExist = async (userId: string): Promise<void> => {
        let user = await this.dataRepository.search(userId);
        if(user)
            throw new UserAlreadyExists(userId);
    }

    /**
     * Method that handles the different exceptions that could be thrown.
     * @param {Error} error Exception.
     * @param {Response} response Express response.
     */
    private handleExceptions = (error: Error, response: Response) => {
        //User already exists or invalid argument while creating a value object (length constraints)
        if(error instanceof UserAlreadyExists || error instanceof InvalidArgumentError)
            response.status(httpStatus.BAD_REQUEST).send(error.message);
        //Validation error
        else if(error instanceof NotValidParameters)
            response.status(httpStatus.BAD_REQUEST).json(error.errors);
        //Server error
        else response.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
        //We log the error
        const logger: Logger = container.get(this.LOGGER_IDENTIFIER);
        logger.error(error);
    }
}