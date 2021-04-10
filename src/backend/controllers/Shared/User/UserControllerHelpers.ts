//Extended request
import { RequestWithUser } from '../../../middleware/User/UserAuthentication';
//Domain exceptions
import UserNotAuthenticated from '../../../../application/User/domain/exceptions/UserNotAuthenticated';


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
        const { user } = request;
        if (!user)
            throw new UserNotAuthenticated();
        return user._id;
    }
}