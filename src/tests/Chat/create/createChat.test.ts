//Chat domain
import Chat from '../../../application/Chat/domain/Chat'
//Chat use case
import CreateChat from '../../../application/Chat/application/create/CreateChat'
//Chat repository contract
import ChatRepository from '../../../application/Chat/domain/ChatRepository';
//Mock data
import { primaryUser } from '../../Shared/domain/User/testUsers'
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/Persistence/InMemoryRepository'

//Global variables
let createChat: CreateChat;
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
    createChat = new CreateChat(chatRepository);
    //We invoke the use case
    createdChat = await createChat.run(chatData, primaryUser);
});

//We test the chat creation by the use case
it('Chat is created successfully', async () => {
    expect(createdChat.toPrimitives()).toMatchObject(chatData);
});

//We test the chat primitives persistence in the chat repository
it('Chat is stored correctly in the data repository', async () => {
    const createdChatInDatabase = chatRepository.search(createdChat.id.toString());
    expect(createdChat.toPrimitives()).toMatchObject(createdChatInDatabase);
})