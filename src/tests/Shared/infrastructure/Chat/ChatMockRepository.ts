//Chat domain
import Chat, { ChatPrimitives } from '../../../../application/Chat/domain/Chat';
//Repository contract
import ChatRepository from '../../../../application/Chat/domain/ChatRepository';
//Shared domain
import { Nullable } from '../../../../application/Shared/domain/Nullable';
//Mock repository implementation
import InMemoryRepository from '../Persistence/InMemoryRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Chat mock repository with in-memory storage implementation.
 */
export default class ChatMockRepository extends InMemoryRepository<Chat> implements ChatRepository {
    search = async (id: any): Promise<Nullable<Chat>> => {
        const document: ChatPrimitives = await super.search(id);
        return document
            ? Chat.fromPrimitives(document)
            : undefined;
    }
}