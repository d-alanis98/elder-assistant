import { NextFunction, Request, Response } from 'express';
//User domain
import { UserPrimitives } from '../../../application/User/domain/User';
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';
//IoTDevice domain
import { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
//Subscription domain
import { SubscriptionPrimitives } from '../../../application/Subscriptions/domain/Subscription';
//Helpers
import UserControllerHelpers from '../../controllers/Shared/User/UserControllerHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 2.1.1
 * @description Class to define a middleware container, we define the middleares to apply depending on the user type, ie: if
 * the user is of primary type, we apply the middlewares provided in the first array passed by contructor, othwerwise, if
 * the user is of secondary type, we apply the middlewares of the second array.
 */
export default class MiddlewareGroup {
    //Members
    private readonly primaryUserMiddlewares: CustomMiddleware[];
    private readonly secondaryUserMiddlewares: CustomMiddleware[];

    constructor(
        primaryUserMiddlewares: CustomMiddleware[],
        secondaryUserMiddlewares: CustomMiddleware[]
    ) {
        this.primaryUserMiddlewares = primaryUserMiddlewares;
        this.secondaryUserMiddlewares = secondaryUserMiddlewares;
    }

    /**
     * Method to apply the respective middlewares by user type.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    apply = async (
        request: RequestWithAdditionalData, 
        response: Response, 
        next: NextFunction
    ) => {
        try {
            //We get the user type from the request (attached in the UserAuthentication middleware)
            const userType = UserControllerHelpers.getUserTypeFromRequest(request);
            //We get and validate the middleware group to apply
            await this.applyMiddlewares(
                this.getMidlewaresToApply(userType),
                request, 
                response, 
                next
            );
        } catch(error) {
            next(error);
        }
    }

    /**
     * Method to get the middlewares to apply array based on the user type.
     * @param {string} userType User type.
     * @returns 
     */
    getMidlewaresToApply = (userType: string) => (
        userType === AllowedUserTypes.PRIMARY
            ? this.primaryUserMiddlewares
            : this.secondaryUserMiddlewares
    );

    /**
     * Method to apply the middlewares in a chained way.
     * @param {CustomMiddleware} middlewaresToApply Middlewares to apply for the user type.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    private applyMiddlewares = async (middlewaresToApply: CustomMiddleware[], request: RequestWithAdditionalData, response: Response, next: NextFunction) => {
        const numberOfMiddlewares = middlewaresToApply.length;
        for(let iterator = 0; iterator < numberOfMiddlewares; iterator++) {
            const currentMiddleware = middlewaresToApply[iterator];
            //The next function is going to be the next middleware, except for the last middleware, this will receive the next function
            const followingMiddleware = iterator + 1 <= numberOfMiddlewares - 1 
                ? async () => middlewaresToApply[iterator + 1] 
                : next;
            //We await for the middleware execution
            await currentMiddleware(request, response, followingMiddleware);
        }
    }
}

//Types
interface RequestWithAdditionalData extends Request {
    user?: UserPrimitives;
    iotDevice?: IoTDevicePrimitives;
    subscription?: SubscriptionPrimitives;
    [additionalKeys: string]: any;
}

type CustomMiddleware = (
    request: RequestWithAdditionalData, 
    response: Response, 
    next: NextFunction
) => Promise<void> | void;