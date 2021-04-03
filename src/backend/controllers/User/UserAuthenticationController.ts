import { Request, Response } from 'express';
import httpStatus from 'http-status';
//User domain
import UserNotFound from '../../../application/User/domain/exceptions/UserNotFound';
import UserWithWrongCredentials from '../../../application/User/domain/exceptions/UserWithWrongCredentials';
//Use cases
import UserAuthentication from '../../../application/User/application/authentication/UserAuthentication';
//Base
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.0.1
 * @description Controller for the authentication use case.
 */
export default class UserAuthenticationController extends Controller {
    
    /**
     * Entry point of the controller actions.
     * @param {Request} request Express request. 
     * @param {Response} response Express response.
     */
    public run = async (request: Request, response: Response) => {
        const { email, password } = request.body;
        //We handle the request
        try {
            //We validate the request
            this.validateRequest(request);
            //We get the user authenticator from the dependencies container
            const userAuthentication: UserAuthentication = container.get(dependencies.UserAuthenticationUseCase);
            //We await the token resolution
            const token: string = await userAuthentication.run({ email, password });
            //Finally, we send the token
            response.status(httpStatus.OK).send(token);
        } catch(error) {
            this.handleExceptions(error, response);
        }
    }

    /**
     * Exception handler for domain exceptions, as well as the base exceptions of all the controllers.
     * @param {Error} error Exception.
     * @param {Response} response Express response.
     */
    private handleExceptions = (error: Error, response: Response) => {
        if(error instanceof UserNotFound)
            response.status(httpStatus.NOT_FOUND).send(error.message);
        else if(error instanceof UserWithWrongCredentials)
            response.status(httpStatus.UNAUTHORIZED).send(error.message);
        //We handle the base exceptions (InvalidArgument, NotValidParameters or InternalServerError)
        else this.handleBaseExceptions(error, response);
    }
}