import { NextFunction, Request, Response } from 'express';
//User domain
import { UserPrimitives } from '../../../application/User/domain/User';
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
//IoTDevice domain
import { IoTDevicePrimitives } from '../../../application/IoTDevice/domain/IoTDevice';
//Subscription domain
import { SubscriptionPrimitives } from '../../../application/Subscriptions/domain/Subscription';
//Middlewares
import UserAuthentication from '../User/UserAuthentication';
//Helpers
import UserControllerHelpers from '../../controllers/Shared/User/UserControllerHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Class to define a middleware container, we define the middleares to apply depending on the user type, ie: if
 * the user is of primary type, we apply the middlewares provided in the first array passed by contructor, othwerwise, if
 * the user is of secondary type, we apply the middlewares of the second array.
 */
export default class MiddlewareGroup {
    //Constants
    private readonly middlewaresByUserType: MiddlewaresByUserTypeDictionary;
    //Members
    private readonly primaryUserMiddlewares: CustomMiddleware[];
    private readonly secondaryUserMiddlewares: CustomMiddleware[];

    constructor(
        primaryUserMiddlewares: CustomMiddleware[],
        secondaryUserMiddlewares: CustomMiddleware[]
    ) {
        this.primaryUserMiddlewares = primaryUserMiddlewares;
        this.secondaryUserMiddlewares = secondaryUserMiddlewares;
        //We set the middlewares by user type
        this.middlewaresByUserType = {
            [AllowedUserTypes.PRIMARY]: this.forPrimaryUser,
            [AllowedUserTypes.SECONDARY]: this.forSecondaryUser
        }
    }

    /**
     * Method to apply the base and the conditional middlewares.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    apply = (
        request: RequestWithAdditionalData, 
        response: Response, 
        next: NextFunction
    ) => {
        try {
            this.baseValidations(request, response, next);
            this.applyConditionsByUserType(request, response, next);
            next();
        } catch(error) {
            next(error);
        }
    }

    /**
     * Method to apply the respective middlewares by user type.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    applyConditionsByUserType = (
        request: RequestWithAdditionalData, 
        response: Response, 
        next: NextFunction
    ) => {
        //We get the user type from the request (attached in the UserAuthentication middleware)
        const userType = UserControllerHelpers.getUserTypeFromRequest(request);
        //We get and validate the middleware group to apply
        const middlewaresByUserType = this.middlewaresByUserType[userType];
        if(!middlewaresByUserType)
            throw new UserNotAuthenticated();
        //We execute the middleware group
        middlewaresByUserType(request, response, next);
    }
 
    /**
     * Method to apply all the middlewares of the primary user middlewares array.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    forPrimaryUser = (
        request: RequestWithAdditionalData, 
        response: Response, 
        next: NextFunction
    ) => {
        //We apply the specified middlewares for primary user
        this.primaryUserMiddlewares.forEach(middleware => middleware(request, response, next));
    }

    /**
     * Method to apply all the middlewares of the secondary user middlewares array.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    forSecondaryUser = (
        request: RequestWithAdditionalData, 
        response: Response, 
        next: NextFunction
    ) => {
        //We apply the specified middlewares for secondary user
        this.secondaryUserMiddlewares.forEach(middleware => middleware(request, response, next));
    }

    //Internal helpers
    /**
     * Method to apply the base middlewares for both users.
     * @param {RequestWithAdditionalData} request Express request with additional data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function. 
     */
    private baseValidations = (
        request: Request, 
        response: Response, 
        next: NextFunction
    ) => {
        UserAuthentication.validateAuthToken(request, response, next);
    }
}

//Types
interface RequestWithAdditionalData extends Request {
    user?: UserPrimitives;
    iotDevice?: IoTDevicePrimitives;
    subscription?: SubscriptionPrimitives;
}

interface MiddlewaresByUserTypeDictionary {
    [userType: string]: CustomMiddleware;
}

type CustomMiddleware = (
    request: RequestWithAdditionalData, 
    response: Response, 
    next: NextFunction
) => void;