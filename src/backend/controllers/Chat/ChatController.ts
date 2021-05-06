import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import Chat from '../../../application/Chat/domain/Chat';
//Use cases
import SearchChat from '../../../application/Chat/application/search/SearchChat';
//Domain exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { chatDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Controller to handle Chat entity requests.
 */
export default class ChatController extends Controller {

    /**
     * Entry point for the controller. Gets the chats a user belongs to.
     * @param {RequestWithUser} request Request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            const userId = this.getUserIdOrFail(request);
            //We get and execute the use case
            const searchChat: SearchChat = container.get(chatDependencies.UseCases.SearchChat);
            const chats: Chat[] = await searchChat.byMemberId({ id: userId });
            //We send the response
            response.status(httpStatus.OK).send(
                chats.map(chat => chat.toPrimitives())
            );
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Helpers
    /**
     * Method to get the user ID from the request data. If not present, we throw an exception.
     * @param {RequestWithUser} request Request with user data.
     * @returns 
     */
    private getUserIdOrFail = (request: RequestWithUser): string  => {
        if(!request.user)
            throw new UserNotAuthenticated();
        return request.user._id;
    }
}