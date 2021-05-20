//User domain
import User from '../../../application/User/domain/User';
//Repository contract
import UserRepository from '../../../application/User/domain/UserRepository';
//Use cases
import UserFinder from '../../../application/User/application/find/UserFinder';
//Mock repository
import mockUsersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
//Mock user
import { primaryUser } from '../../Shared/domain/User/testUsers';

//Global variables
const userRepository: UserRepository = mockUsersRepository;
const userFinder: UserFinder = new UserFinder(userRepository);
let foundUser: User;


//We test the user search by it's ID
it('User is found successfully by it\'s ID', async () => {
    foundUser = await userFinder.find(primaryUser.id.toString());
    //We ignore the password, because the password in the created user is not stored in plain text, so it is not comparable
    expect(foundUser.toPrimitives()).toMatchObject(primaryUser.toPrimitives());
});
