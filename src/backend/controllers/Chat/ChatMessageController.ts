import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import ChatMessage from '../../../application/ChatMessage/domain/ChatMessage';
import { ChatMessageFileParameters, ValidChatMessageTypes } from '../../../application/ChatMessage/domain/value-objects/ChatMessageContent';
//Domain events
import ChatMessageCreated from '../../../application/ChatMessage/domain/events/ChatMessageCreated';
import OnChatMessageCreated from '../../../application/ChatMessage/domain/events/OnChatMessageCreated';
//Use cases
import CreateChatMessage from '../../../application/ChatMessage/application/create/CreateChatMessage';
import SearchChatMessage from '../../../application/ChatMessage/application/search/SearchChatMessage';
//Exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Base controller
import Controller from '../Controller';
//Query result contracts
import { PaginatedChatMessages } from '../../../application/ChatMessage/domain/ChatMessageRepository';
//Dependency injection
import container from '../../dependency-injection';
import { chatMessageDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 4.4.2
 * @description Controller to handle chat message requests.
 */
export default class ChatMessageController extends Controller {

    /**
     * Entry point for the controller (create use case).
     * @param {RequestWithData} request Request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const { chatId } = request.params;
            const { type, content } = request.body;
            const userId = this.getUserIdFromRequest(request);
            //We set the message content with the expected structure
            const messageContent = this.getMessageStructure({ type, content });
            //We get the use case 
            const createChatMessage: CreateChatMessage = container.get(chatMessageDependencies.UseCases.CreateChatMessage);
            //We execute the use case
            const chatMessage: ChatMessage = await createChatMessage.run({ 
                from: userId, 
                chatId, 
                content: messageContent 
            });
            //We send the response
            response.status(httpStatus.OK).send(chatMessage.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * Handler for the searchAll request.
     * @param {RequestWithData} request Request with user data.
     * @param {Response} response Express response.
     */
    searchAll = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const { chatId } = request.params;
            const { limit: limitParam, startingAt: startingAtParam } = request.query;
            //We clean the query parameters
            const limit = limitParam ? Number(limitParam) : undefined;
            const startingAt = startingAtParam ? startingAtParam.toString() : undefined;
            //We get and execute the use case
            const searchChatMessage: SearchChatMessage = container.get(chatMessageDependencies.UseCases.SearchChatMessage);
            const messageRecords: PaginatedChatMessages = await searchChatMessage.getAllMessages({
                limit,
                chatId, 
                startingAt
            }); 
            //We get the primitive records
            const messagePrimitiveRecords = SearchChatMessage.getDataRecordsInPrimitiveValues(messageRecords.data);
            //We send the response
            response.status(httpStatus.OK).send({
                ...messageRecords,
                data: messagePrimitiveRecords
            });
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * We register the event handlers for this entity.
     */
    registerEventHandlers() {
        this.onDomainEvent(ChatMessageCreated.name, event => new OnChatMessageCreated(event).handle());
    }

    //Internal helpers
    /**
     * Method to get the ID of the user from the request object.
     */
    private getUserIdFromRequest = (request: RequestWithUser): string => {
        const { user } = request;
        if(!user)
            throw new UserNotAuthenticated();
        return user._id;
    }

    /**
     * Method to get the message content object in the required structure.
     * @param {string|undefined} type The message type.
     * @param {string|ChatMessageFileParameters} content The message content.
     * @returns 
     */
    private getMessageStructure = ({ 
        type, 
        content 
    }: ChatMessageRequestData) => ({
        type: type || ValidChatMessageTypes.TEXT, 
        content 
    })
}

interface ChatMessageRequestData {
    type?: ValidChatMessageTypes;
    content: string | ChatMessageFileParameters 
}