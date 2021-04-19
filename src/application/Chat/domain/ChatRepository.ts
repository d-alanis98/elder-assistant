//Chat domain
import Chat from './Chat';
import ChatId from './value-objects/ChatId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
//Data repository base contract
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Interface that specifies the contract for the ChatRepository implementation.
 */
export default interface ChatRepository extends DataRepository<Chat> {
    //Ee use the base CRUD operations of data repository, but we define the protorype for the search method
    search(id: ChatId | Object): Promise<Nullable<Chat>>;
}