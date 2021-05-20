//Chat message domain
import ChatMessage from '../../../application/ChatMessage/domain/ChatMessage';
import { ValidChatMessageTypes } from '../../../application/ChatMessage/domain/value-objects/ChatMessageContent';
//Chat message use cases
import CreateChatMessage from '../../../application/ChatMessage/application/create/CreateChatMessage';
//Chat message repository contract
import ChatMessageRepository from '../../../application/ChatMessage/domain/ChatMessageRepository';
//Shared domain
import Uuid from '../../../application/Shared/domain/value-object/Uuid';
//User mock data
import { primaryUser } from '../../Shared/domain/User/testUsers';
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/Persistence/InMemoryRepository';

//Global variables
let createChatMessage: CreateChatMessage;
let createdChatMessage: ChatMessage;
let chatMessageRepository: ChatMessageRepository = new InMemoryRepository<ChatMessage>();

//Base data
const chatMessageData = {
    from: primaryUser.id.toString(),
    chatId: Uuid.random().toString(),
    content: {
        type: ValidChatMessageTypes.TEXT,
        content: 'Test message'
    }
}

//We initialize the use case
beforeAll(async () => {
    createChatMessage = new CreateChatMessage(chatMessageRepository);
    //We run the use case
    createdChatMessage = await createChatMessage.run(chatMessageData);
});

//We test the chat message creation by the use case
it('Chat message is created successfully by the use case', () => {
    expect(createdChatMessage.toPrimitives()).toMatchObject(chatMessageData)
});

//We test the chat message primitives persistence in the chat message repository
it('Chat message is stored correctly in the data repository', async () => {
    const createdChatInDatabase = chatMessageRepository.search(createdChatMessage.id.toString());
    expect(createdChatMessage.toPrimitives()).toMatchObject(createdChatInDatabase);
})