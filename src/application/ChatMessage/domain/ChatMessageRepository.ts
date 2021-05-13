//Domain
import ChatMessage from './ChatMessage';
import ChatMessageId from './value-objects/ChatMessageId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import PaginatedDataResult from '../../Shared/domain/requests/PaginatedDataResult';
//Base repository contract
import { DataRepository, QueryParameters } from '../../Shared/infrastructure/Persistence/DataRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Interface that specifies the contract for the ChatMessageRepository implementation.
 */
export default interface ChatMessageRepository extends DataRepository<ChatMessage> {
    //We use the base CRUD operations of data repository, but we define the prototype for the search method and make it required
    search(id: ChatMessageId | Object): Promise<Nullable<ChatMessage>>;
    searchAllPaginated(filter: Object, queryParameters?: QueryParameters): Promise<Nullable<PaginatedChatMessages>>;
}

//Types
export type PaginatedChatMessages = PaginatedDataResult<ChatMessage>;