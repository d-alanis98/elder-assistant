import { Request, Response, NextFunction } from 'express';
//Domain
import { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
import AuthorizationNotProvided from '../../../application/Shared/domain/exceptions/AuthorizationNotProvided';
//Extended request
import { RequestWithIoTDevice } from './IoTDeviceAuthorization';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Express authentication middleware based on JWT.
 */
export default class IoTDeviceAuthentication {
    //Facade

    /**
     * Middleware to validate the signature of a JWT authentication token of the request.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateToken = async (
        request: RequestWithIoTDevice,
        _: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            //We get the token from the request
            const authorization = IoTDeviceAuthentication.getAuthorizationHeader(request);
            //We get the authenticator and execute it
            const authenticator = container.get(dependencies.Authenticator);
            const iotDevice: IoTDevicePrimitives = await authenticator.authenticateIoTDeviceToken(authorization);
            //We attach the device data to the request
            request.iotDevice = iotDevice;
            next();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Helper method to get the authorization header, or throw an error if it is not present.
     * @param {Request} request Express request.
     * @returns 
     */
    private static getAuthorizationHeader = (request: Request): string => {
        const { headers: { authorization } } = request;
        if (!authorization)
            throw new AuthorizationNotProvided();
        return authorization;
    }
}
