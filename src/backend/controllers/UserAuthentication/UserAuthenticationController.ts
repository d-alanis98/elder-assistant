import { Request, Response } from 'express';
import { parse } from 'platform';
import httpStatus from 'http-status';
//User domain
import User from '../../../application/User/domain/User';
import UserNotFound from '../../../application/User/domain/exceptions/UserNotFound';
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
import UserWithWrongCredentials from '../../../application/User/domain/exceptions/UserWithWrongCredentials';
//User authentication domain
import { AuthenticationDeviceAgent } from '../../../application/UserAuthentication/domain/UserAuthentication';
//Use cases
import UserAuthentication from '../../../application/UserAuthentication/application/authentication/UserAuthentication';
//Base
import Controller from '../Controller';
//Middleware
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 4.8.9
 * @description Controller for the authentication use case.
 */
export default class UserAuthenticationController extends Controller {
    
    /**
     * Entry point of the controller actions.
     * @param {Request} request Express request. 
     * @param {Response} response Express response.
     */
    public run = async (
        request: Request, 
        response: Response
    ): Promise<void> => {
        const { email, password } = request.body;
        //We handle the request
        try {
            //We validate the request
            this.validateRequest(request);
            //We get the user authenticator from the dependencies container
            const userAuthentication: UserAuthentication = container.get(dependencies.UserAuthenticationUseCase);
            //We get the user device agent
            const { deviceName, deviceType }: AuthenticationDeviceAgent = this.getDeviceAgent(request);
            //We await the token resolution
            const tokens: Object = await userAuthentication.run(
                { email, password }, 
                deviceName,
                deviceType
            );
            //Finally, we send the tokens
            response.status(httpStatus.OK).send(tokens);
        } catch(error) {
            this.handleExceptions(error, response);
        }
    }

    /**
     * Method to handle the refresh token action request, where a new authentication
     * token is sent to the user from the signed user data obtained from the refresh
     * token.
     * @param {Request} request Express request. 
     * @param {Response} response Express response.
     */
    public refreshToken = async (
        request: RequestWithUser, 
        response: Response
    ): Promise<void> => {
        try {
            //We get the user authenticator from the dependencies container
            const userAuthentication: UserAuthentication = container.get(dependencies.UserAuthenticationUseCase); 
            //We get the user from the request
            const { user: userData, headers: { authorization } } = request;
            //We validate the user data existance
            if(!userData) 
                throw new UserNotAuthenticated();
            //We create the user from the primitive values
            const user: User = User.fromPrimitives(userData);
            //We retrieve the token (to validate that it exists in the repository)
            const authenticator = container.get(dependencies.Authenticator);
            const refreshToken = authenticator.getToken(authorization);
            //We get the new authorization token
            const authorizationToken: string = await userAuthentication.generateAuthenticationToken(user, refreshToken);
            //Finally, we send the token
            response.status(httpStatus.OK).send(authorizationToken);
        } catch(error) {
            this.handleExceptions(error, response);
        }
    }

    /**
     * Method to get the device from which the user made the request (for the UserAuthentication collection).
     * @param {Request} request 
     * @returns {string} Device name string.
     */
    private getDeviceAgent = (request: Request): AuthenticationDeviceAgent => {
        //We look for the device name in request body
        const { body: { deviceName, deviceType } } = request;
        if(deviceName)
            return { deviceName, deviceType };
        //If it is no present, we get the device name by the user agent header
        const { headers } = request;
        const parser = parse(headers['user-agent']);
        //We return the parsed name of the user agent
        return {
            deviceName: parser?.name || 'other',
            deviceType: 'other'
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