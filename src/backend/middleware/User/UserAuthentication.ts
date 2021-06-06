import { Request, Response, NextFunction } from 'express';
//Domain
import { UserPrimitives } from '../../../application/User/domain/User';
import AuthorizationNotProvided from '../../../application/Shared/domain/exceptions/AuthorizationNotProvided';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 3.5.4
 * @description Express authentication middleware based on JWT.
 */
export default class UserAuthentication {
    //Facade
    /**
     * Middleware to validate the signature of a JWT authentication token of the request.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateAuthToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        UserAuthentication.validateToken(ValidTokenTypes.AUTH_TOKEN)(request, response, next);
    }

    /**
     * Middleware to validate the signature of a JWT refresh token.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateRefreshToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        UserAuthentication.validateToken(ValidTokenTypes.REFRESH_TOKEN)(request, response, next);
    }

    //Helpers (internal use)
    /**
     * Private method to handle token types and validate them. To be accessed by middleware
     * facades.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    private static validateToken = (tokenType: ValidTokenTypes) => async (
        request: RequestWithUser,
        _: Response,
        next: NextFunction
    ): Promise<void> => {
        //We get the token from the request
        const authorization = UserAuthentication.getAuthorizationHeader(request, next);
        //We get the authenticator
        try {
            const authenticator = container.get(dependencies.Authenticator);
            //We handle the token type and authenticate it
            let user;
            switch (tokenType) {
                case ValidTokenTypes.AUTH_TOKEN:
                    user = await authenticator.authenticateAuthToken(authorization);
                    //We attach the user data
                    request.user = user;
                    break;
                case ValidTokenTypes.REFRESH_TOKEN:
                    user = await authenticator.authenticateRefreshToken(authorization);
                    //We attach the user data
                    request.user = user;
                    break;
            }
            next();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Helper method to get the authorization header, or throw an error if it is not present.
     * @param {Request} request Express request.
     * @param {NextFunction} next Express next function.
     * @returns 
     */
    private static getAuthorizationHeader = (request: Request, next: NextFunction): string | undefined => {
        const { headers: { authorization } } = request;
        if (!authorization)
            next(new AuthorizationNotProvided());
        else return authorization;
    }
}

export interface RequestWithUser extends Request {
    user?: UserPrimitives;
}


enum ValidTokenTypes {
    AUTH_TOKEN = 'authenticationToken',
    REFRESH_TOKEN = 'refreshToken',
};