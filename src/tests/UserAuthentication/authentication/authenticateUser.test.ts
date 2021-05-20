//Use cases
import UserCreator from '../../../application/User/application/create/UserCreator';
import UserAuthentication, { UserAuthenticationResponse } from '../../../application/UserAuthentication/application/authentication/UserAuthentication';
//Repository contracts
import UserRepository from '../../../application/User/domain/UserRepository';
import UserAuthenticationRepository from '../../../application/UserAuthentication/domain/UserAuthenticationRepository';
//User domain
import User from '../../../application/User/domain/User';
//Mock repositories
import { UsersMockRepository } from '../../Shared/infrastructure/User/mockUsersRepository';
import UserAuthenticationMockRepository from '../../Shared/infrastructure/UserAuthentication/UserAuthenticationMockRepository';
//User data
import { userData } from '../../User/create/createUser.test';

//Global constants
const userRepository: UserRepository = new UsersMockRepository();
const userAuthenticationRepository: UserAuthenticationRepository = new UserAuthenticationMockRepository();
let createdUser: User;
let userAuthenticator: UserAuthentication;
let userAuthentication: UserAuthenticationResponse;

//User authentication mock data
const userAuthMockData = {
    email: userData.email,
    password: userData.password
};

//Use case set up
beforeAll(async () => {
    //We create a user
    createdUser = await new UserCreator(userRepository).run(userData);
    //We create and execute the use case
    userAuthenticator = new UserAuthentication(userRepository, userAuthenticationRepository);
    userAuthentication = await userAuthenticator.run(userAuthMockData, 'Device', 'Phone');
});

//We test the user authentication
it('User authentication is successful', () => {
    //We remove the password, because the returned user does not contain this data
    const userWithoutPassword = User.getUserWithoutPassword(createdUser);
    expect(userAuthentication.user).toMatchObject(userWithoutPassword.toPrimitives());
});

//We test the refresh token use method
it('User token is refreshed correctly', async () => {
    const userWithoutPassword = User.getUserWithoutPassword(createdUser);
    const newToken = await userAuthenticator.generateAuthenticationToken(userWithoutPassword, userAuthentication.refreshToken);
    expect(newToken).toBeDefined();
})