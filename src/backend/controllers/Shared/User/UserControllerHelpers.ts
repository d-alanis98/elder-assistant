//Extended request
import { RequestWithUser } from '../../../middleware/User/UserAuthentication';
//Domain exceptions
import UserNotAuthenticated from '../../../../application/User/domain/exceptions/UserNotAuthenticated';
import { UserPrimitives } from '../../../../application/User/domain/User';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Helper methods for controllers that make use of User domain.
 */
export default class UserControllerHelpers {
    /**
     * Helper method to get the user ID from the user data contained in the request instance.
     * @param {RequestWithUser} request Request with user data.
     * @returns 
     */
    static getUserIdFromRequest = (request: RequestWithUser): string => {
        return UserControllerHelpers.getUserDataFromRequest(request)._id;
    }

    /**
     * Helper method to get the user data contained in the request instance.
     * @param {RequestWithUser} request Request with user data.
     * @returns 
     */
    static getUserDataFromRequest = (request: RequestWithUser): UserPrimitives => {
        const { user } = request;
        if (!user)
            throw new UserNotAuthenticated();
        return user;
    }
}