//User domain
import User from '../../../application/User/domain/User';
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';
//Repository contract
import UserRepository from '../../../application/User/domain/UserRepository';
//Use cases
import UserCreator from '../../../application/User/application/create/UserCreator';
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/Persistence/InMemoryRepository';


//Global variables
const userRepository: UserRepository = new InMemoryRepository<User>();
const userCreator: UserCreator = new UserCreator(userRepository);
let createdUser: User;

//Mock user data
export const userData = {
    name: 'John',
    type: AllowedUserTypes.PRIMARY,
    email: 'johhdoe@test.com',
    password: '123456789',
    lastName: 'Doe',
    dateOfBirth: new Date().toISOString()
}

//We set up the use case
beforeAll(async () => {
    //Use case execution
    createdUser = await userCreator.run(userData);
});

//We test the user creation by the use case
it('User is created successfully', () => {
    //We ignore the password, because the password in the created user is not stored in plain text, so it is not comparable
    const { password, ...userDataWithoutPassword } = userData;
    expect(createdUser.toPrimitives()).toMatchObject(userDataWithoutPassword);
});

//We test the user primitives persistence in the user repository
it('User is stored correctly in the data repository', async () => {
    const createdUserInDatabase = await userRepository.search(createdUser.id.toString());
    expect(createdUserInDatabase).toMatchObject(createdUser.toPrimitives());
});
