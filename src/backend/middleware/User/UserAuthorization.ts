import { Response, NextFunction } from 'express';
//Domain
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';
import UserWithoutPermission from '../../../application/UserAuthentication/domain/exceptions/UserWithoutPermission';
//Extended request
import { RequestWithUser } from './UserAuthentication';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Express authorization middleware based on JWT.
 */
export default class UserAuthorization {
    //Facade
    /**
     * Middleware to validate that the user is of ADMINISTRATOR type.
     * @param {RequestWithUser} request Express request with the user data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateAdminRole = (request: RequestWithUser, response: Response, next: NextFunction): void => {
        UserAuthorization.validateRole(request, response, next, AllowedUserTypes.ADMINISTRATOR);
    }

    /**
     * Middleware to validate that the user is of PRIMARY type.
     * @param {RequestWithUser} request Express request with the user data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validatePrimaryRole = (request: RequestWithUser, response: Response, next: NextFunction): void => {
        UserAuthorization.validateRole(request, response, next, AllowedUserTypes.PRIMARY);
    }

    //Helpers (internal use)

    /**
     * Middleware to validate that the user is of certain type.
     * @param {RequestWithUser} request Express request with the user data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    private static validateRole = (request: RequestWithUser, response: Response, next: NextFunction, role: string): void => {
        const { user } = request;
        if(!user)
            return next(new UserWithoutPermission());
        //We get the user type
        const { type } = user;
        if(type !== role)
            return next(new UserWithoutPermission());
        next();
    }

}