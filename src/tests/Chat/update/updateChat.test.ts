//Chat domain
import Chat from '../../../application/Chat/domain/Chat';
//Domain exceptions
import UserIsChatMemberAlready from '../../../application/Chat/domain/exceptions/UserIsChatMemberAlready';
//Use cases
import CreateChat from '../../../application/Chat/application/create/CreateChat';
import UpdateChat from '../../../application/Chat/application/update/UpdateChat';
//Mock repository
import ChatMockRepository from '../../Shared/infrastructure/Chat/ChatMockRepository';
//Repository contract
import ChatRepository from '../../../application/Chat/domain/ChatRepository';
//Mock users
import { primaryUser, secondaryUser } from '../../Shared/domain/User/testUsers';

//Global variables
const chatRepository: ChatRepository = new ChatMockRepository();
let updateChat: UpdateChat;
let createdChat: Chat;

//We set up the tests creating a mock chat first
beforeAll(async () => {
    //Chat mock data
    const chatData = {
        name: 'Test user chat',
        ownedBy: primaryUser.id.toString(),
    };
    //We create a mock chat
    createdChat = await new CreateChat(chatRepository).run(chatData, primaryUser);  
    //We set up the update chat use case
    updateChat = new UpdateChat(chatRepository);  
})

//We test the addition of a user to a chat
it('User is added to the chat scuccessfully', async () => {
    const updatedChat = await updateChat.addUserToChat({
        chatId: createdChat.id,
        userToAdd: secondaryUser
    });
    expect(updatedChat).toBeDefined();
    expect(updatedChat.toPrimitives().members).toContainEqual(secondaryUser.toPrimitives());
});

//We test that it's not possible to add a user who is already a member of the chat
it('An exception is thrown if we attemp to add a user that is already a chat member', async () => {
    try {
        await updateChat.addUserToChat({
            chatId: createdChat.id,
            userToAdd: secondaryUser
        });
    } catch(exception) {
        expect(exception).toBeInstanceOf(UserIsChatMemberAlready);
    }
});

//We test the removal of a user from the chat
it('The user is removed from the chat successfully', async () => {
    const updatedChat = await updateChat.removeUserFromChat({
        chatId: createdChat.id,
        userToRemove: secondaryUser
    });
    expect(updatedChat).toBeDefined();
    expect(updatedChat.toPrimitives().members).not.toContainEqual(secondaryUser.toPrimitives());
});