//User domain
import User from '../../../../application/User/domain/User';
import UserId from '../../../../application/Shared/domain/modules/User/UserId';
import UserName from '../../../../application/User/domain/value-objects/UserName';
import UserType, { AllowedUserTypes } from '../../../../application/User/domain/value-objects/UserType';
import UserEmail from '../../../../application/User/domain/value-objects/UserEmail';
import UserPassword from '../../../../application/User/domain/value-objects/UserPassword';
import UserLastName from '../../../../application/User/domain/value-objects/UserLastName';
import UserDateOfBirth from '../../../../application/User/domain/value-objects/UserDateOfBirth';
//Shared domain
import Uuid from '../../../../application/Shared/domain/value-object/Uuid';


//For testing porpouses only, this is obviously not done in production
export const primaryUserPlainTextPassword = Uuid.random.toString().slice(0, 10);

export const primaryUser: User = new User(
    new UserId('johndoe@test.com'),
    new UserName('John'),
    new UserType(AllowedUserTypes.PRIMARY),
    new UserEmail('johndoe@test.com'),
    new UserPassword(primaryUserPlainTextPassword),
    new UserLastName('Doe'),
    new UserDateOfBirth(new Date())
);

export const secondaryUser: User = new User(
    new UserId(Uuid.random().toString()),
    new UserName('Jane'),
    new UserType(AllowedUserTypes.SECONDARY),
    new UserEmail('janedoe@test.com'),
    new UserPassword(Uuid.random.toString().slice(0, 10)),
    new UserLastName('Doe'),
    new UserDateOfBirth(new Date())
);

export const adminUser: User = new User(
    new UserId(Uuid.random().toString()),
    new UserName('Root'),
    new UserType(AllowedUserTypes.ADMINISTRATOR),
    new UserEmail('rootuser@test.com'),
    new UserPassword(Uuid.random.toString().slice(0, 10)),
    new UserLastName('User'),
    new UserDateOfBirth(new Date())
);