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

    /**
     * @todo
     * Method to determine if a user has roles to see a protected resource. The valid roles are determined by 2 conditions:
     * - If the user is of PRIMARY type, it's id must be the same as the id of the owner of the requested resource (expressed in the URL).
     * - If the user is of SECONDARY type, it must have the specified roles assigned by the owner of the resource (expressed by it's id in the URL). 
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response. 
     * @param {NextFunction} next Express next function.
     */
    static validateAllowedRoles = (roles: string[]) => (request: RequestWithUser, response: Response, next: NextFunction): void => {

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