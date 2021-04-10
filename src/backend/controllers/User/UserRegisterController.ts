import { Request, Response } from 'express';
import httpStatus from 'http-status';
//User domain
import User from '../../../application/User/domain/User';
import UserCreator from '../../../application/User/application/create/UserCreator';
import UserAlreadyExists from '../../../application/User/domain/exceptions/UserAlreadyExists';
//Shared
import Logger from '../../../application/Shared/domain/Logger';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
//Constants
import dependencies from '../../../application/Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 1.5.3
 * @description Controller for the register use case.
 */
export default class UserRegisterController extends Controller {
    /**
     * Entry point for the controller actions.
     * @param {Request} request Express request 
     * @param {Response} response Express response
     */
    run = async (request: Request, response: Response) => {
        //We get the data from the request body
        const { name, email, type, lastName, password, dateOfBirth } = request.body;
        try {
            //We validate the request
            this.validateRequest(request);
            //We get a UserCreator (use case) instance from the dependencies cotainer
            const userCreator: UserCreator = container.get(dependencies.UserCreateUseCase);
            //We create a new user
            const user: User = await userCreator.run({ name, email, type, lastName, password, dateOfBirth });
            //We get the user data without the password
            const userWithoutPassword: User = User.getUserWithoutPassword(user);
            //We send the response with the user data in JSON
            response.status(httpStatus.OK).json(userWithoutPassword.toPrimitives());
        } catch(error) {
            this.handleExceptions(error, response);
        }
    }

    /**
     * Method that handles the different exceptions that could be thrown.
     * @param {Error} error Exception.
     * @param {Response} response Express response.
     */
    private handleExceptions = (error: Error, response: Response) => {
        //User already exists
        if(error instanceof UserAlreadyExists)
            response.status(httpStatus.BAD_REQUEST).send(error.message);
        //Base exceptions
        else this.handleBaseExceptions(error, response);
        //We log the error
        const logger: Logger = container.get(dependencies.Logger);
        logger.error(error);
    }

}