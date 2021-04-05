import { Request, Response, NextFunction } from 'express';
//Domain
import AuthorizationNotProvided from '../../../application/Shared/domain/exceptions/AuthorizationNotProvided';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 1.3.3
 * @description Express authentication middleware based on JWT.
 */
export default class UserAuthentication {
    /**
     * Middleware to validate the signature of the JWT token of the request.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        //We get the token from the request
        const { headers: { authorization } } = request;
        if(!authorization)
            next(new AuthorizationNotProvided());
        //We get the authenticator
        try {
            const authenticator = container.get(dependencies.Authenticator);
            await authenticator.authenticateAuthToken(authorization);
            next();
        } catch(error) {
            next(error);
        }
    }
}