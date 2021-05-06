//Chat domain
import Chat from './Chat';
import ChatId from './value-objects/ChatId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
//Data repository base contract
import { DataRepository, QueryParameters } from '../../Shared/infrastructure/Persistence/DataRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Interface that specifies the contract for the ChatRepository implementation.
 */
export default interface ChatRepository extends DataRepository<Chat> {
    //We use the base CRUD operations of data repository, but we define the protorype for the search method
    search(id: ChatId | Object): Promise<Nullable<Chat>>;
    searchAll(filter: ChatId | Object, queryParameters?: QueryParameters): Promise<Nullable<Chat[]>>;
}