//Chat message domain
import ChatMessage from '../../../application/ChatMessage/domain/ChatMessage';
import { ValidChatMessageTypes } from '../../../application/ChatMessage/domain/value-objects/ChatMessageContent';
//Chat message use cases
import SearchChatMessage from '../../../application/ChatMessage/application/search/SearchChatMessage';
import CreateChatMessage from '../../../application/ChatMessage/application/create/CreateChatMessage';
//Chat message repository contract
import ChatMessageRepository from '../../../application/ChatMessage/domain/ChatMessageRepository';
//Shared domain
import Uuid from '../../../application/Shared/domain/value-object/Uuid';
//User mock data
import { primaryUser } from '../../Shared/domain/User/testUsers';
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/persistence/InMemoryRepository';

//Global variables
let searchChatMessage: SearchChatMessage;
let createdChatMessage: ChatMessage;
let chatMessageRepository: ChatMessageRepository = new InMemoryRepository<ChatMessage>();

//Base data
const chatId: string = Uuid.random().toString();
const chatMessageData = {
    from: primaryUser.id.toString(),
    chatId: chatId,
    content: {
        type: ValidChatMessageTypes.TEXT,
        content: 'Test message'
    }
}

//We initialize the use case
beforeAll(async () => {
    const createChatMessage: CreateChatMessage = new CreateChatMessage(chatMessageRepository);
    //We run the use case
    createdChatMessage = await createChatMessage.run(chatMessageData);
    //We create the search use case
    searchChatMessage = new SearchChatMessage(chatMessageRepository);
});

//We test the chat message search
it('Chat message is present in the chat messages list', async () => {
    //We get all the messages
    const messages = await searchChatMessage.getAllMessages({
        limit: 10,
        chatId,
        startingAt: undefined
    });
    expect(messages.data).toContainEqual(createdChatMessage.toPrimitives());
})