//User
import UserId from '../../Shared/domain/modules/User/UserId';
import UserName from './value-objects/UserName';
import UserType from './value-objects/UserType';
import UserEmail from './value-objects/UserEmail';
import UserPassword from './value-objects/UserPassword';
import UserLastName from './value-objects/UserLastName';
//Shared
import AggregateRoot from '../../Shared/domain/AggregateRoot';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.2
 * @description User entity abstraction.
 */
export default class User extends AggregateRoot {
    readonly id: UserId;
    readonly name: UserName;
    readonly type: UserType;
    readonly email: UserEmail;
    readonly password: UserPassword;
    readonly lastName: UserLastName;

    constructor(
        id: UserId,
        name: UserName,
        type: UserType,
        email: UserEmail,
        password: UserPassword,
        lastName: UserLastName
    ) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
    }

    /**
     * Facade method to create a user without using new operator
     * @param {UserId} id User ID
     * @param {UserName} name User name 
     * @param {UserType} type User type {PRIMARY|SECONDARY}
     * @param {UserLastName} lastName User last name
     * @returns 
     */
    static create = (
        id: UserId,
        name: UserName,
        type: UserType,
        email: UserEmail,
        password: UserPassword,
        lastName: UserLastName
    ): User => new User(
        id, 
        name, 
        type, 
        email,
        password,
        lastName
    );

    /**
     * Facade method to create a user from primitive types
     * @param {string} id User ID
     * @param {string} name User name
     * @param {string} type User type
     * @param {string} lastName User last name
     * @returns 
     */
    static fromPrimitives = (userPrimitives: UserPrimitives): User => new User(
        new UserId(userPrimitives._id),
        new UserName(userPrimitives.name),
        new UserType(userPrimitives.type),
        new UserEmail(userPrimitives.email),
        new UserPassword(userPrimitives.password),
        new UserLastName(userPrimitives.lastName)
    );

    /**
     * Returns a primitive value object representation of the instance
     * @returns {Object} primitive values object
     */
    toPrimitives = (): UserPrimitives => ({
        _id: this.id.toString(),
        name: this.name.toString(),
        type: this.type.value,
        email: this.email.toString(),
        lastName: this.lastName.toString(),
        password: this.password.toString()
    });
}

export interface UserParameters {
    id: UserId,
    name: UserName,
    type: UserType,
    email: UserEmail,
    password: UserPassword,
    lastName: UserLastName
};

export interface UserPrimitives {
    _id: string,
    name: string,
    type: string,
    email: string,
    lastName: string,
    password: string,
};

/**
 * Interface that defines the structure of the data received in a sign-in form, because it is for a new user that does not have
 * id yet this field is not included.
 */
export interface NewUserPrimitives {
    name: string,
    type: string,
    email: string,
    lastName: string,
    password: string,
}