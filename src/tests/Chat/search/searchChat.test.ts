//Chat domain
import Chat from '../../../application/Chat/domain/Chat'
//Chat use cases
import CreateChat from '../../../application/Chat/application/create/CreateChat'
import SearchChat from '../../../application/Chat/application/search/SearchChat';
//Chat repository contract
import ChatRepository from '../../../application/Chat/domain/ChatRepository';
//Mock data
import { primaryUser } from '../../Shared/domain/User/testUsers'
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/persistence/InMemoryRepository'
import { Nullable } from '../../../application/Shared/domain/Nullable';

//Global variables
let searchChat: SearchChat;
let createdChat: Chat;
let chatRepository: ChatRepository = new InMemoryRepository<Chat>();

//Base data
const chatData = {
    name: 'Test user chat',
    ownedBy: primaryUser.id.toString(),
}

//We initialize the use case
beforeAll(async () => {
    //We create the use case, providing the repository
    const createChat = new CreateChat(chatRepository);
    //We create a chat
    createdChat = await createChat.run(chatData, primaryUser);
    //We create the search use case
    searchChat = new SearchChat(chatRepository);
});

//We test the chat creation by the use case
it('Chat was found by ID', async () => {
    const chat: Nullable<Chat> = await searchChat.byChatId(createdChat.id.toString());
    expect(createdChat.toPrimitives()).toMatchObject(chat?.toPrimitives() || {});
});

//We test the chat primitives persistence in the chat repository
it('Chat was found by owner ID', async () => {
    const chat: Nullable<Chat> = await searchChat.byOwnerId(primaryUser.id.toString());
    expect(createdChat.toPrimitives()).toMatchObject(chat?.toPrimitives() || {});
});