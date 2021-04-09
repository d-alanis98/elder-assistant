//User
import UserId from '../../Shared/domain/modules/User/UserId';
import UserName from './value-objects/UserName';
import UserType from './value-objects/UserType';
import UserEmail from './value-objects/UserEmail';
import UserPassword from './value-objects/UserPassword';
import UserLastName from './value-objects/UserLastName';
import UserDateOfBirth from './value-objects/UserDateOfBirth';
//Shared
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';
//Dependency injection
import dependenciesReferences from '../../Shared/infrastructure/Constants/dependenciesReferences';


/**
 * @author Damián Alanís Ramírez
 * @version 3.5.7
 * @description User entity abstraction.
 */
export default class User extends AggregateRoot {
    readonly id: UserId;
    readonly name: UserName;
    readonly type: UserType;
    readonly email: UserEmail;
    readonly password: Nullable<UserPassword>;
    readonly lastName: UserLastName;
    readonly dateOfBirth: UserDateOfBirth;

    constructor(
        id: UserId,
        name: UserName,
        type: UserType,
        email: UserEmail,
        password: Nullable<UserPassword>,
        lastName: UserLastName,
        dateOfBirth: UserDateOfBirth
    ) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
    }

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
        User.getPasswordFromPrimitive(userPrimitives.password),
        new UserLastName(userPrimitives.lastName),
        new UserDateOfBirth(userPrimitives.dateOfBirth)
    );

    /**
     * Returns a primitive value object representation of the instance.
     * @returns {Object} Primitive values object.
     */
    toPrimitives = (): UserPrimitives => {
        let userPrimitives: UserPrimitives = {
            _id: this.id.toString(),
            name: this.name.toString(),
            type: this.type.value,
            email: this.email.toString(),
            lastName: this.lastName.toString(),
            dateOfBirth: this.dateOfBirth.toString()
        };
        //We add the password to the primitives only if it exists in the instance
        if(this.password)
            userPrimitives.password = this.password.toString();
        return userPrimitives;
    }

    //Facade

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
        password: Nullable<UserPassword>,
        lastName: UserLastName,
        dateOfBirth: UserDateOfBirth
    ): User => new User(
        id,
        name,
        type,
        email,
        password,
        lastName,
        dateOfBirth
    );


    /**
     * Method to get a user with the password data set to null, to not include in into the primitives.
     * @param {User} user The user with password data. 
     * @returns The user without password data.
     */
    static getUserWithoutPassword = (user: User) => new User(
        user.id,
        user.name,
        user.type,
        user.email,
        null,
        user.lastName,
        user.dateOfBirth,
    );

    //Helpers
    
    getAge = () => {
        const DateService = dependenciesReferences.DateService;
        const dateService = new DateService(this.dateOfBirth.toISOString());
        return dateService.getAge();
    }

    /**
     * Method to get the UserPassword instance of null, if the primitive password does not exist.
     * @param passwordPrimitive Password primitive, which can be non existant (undefined).
     * @returns 
     */
    static getPasswordFromPrimitive = (passwordPrimitive?: string): Nullable<UserPassword> => (
        passwordPrimitive
            ? new UserPassword(passwordPrimitive)
            : null
    );

    /**
     * Implementation of the abstract method to get the aggregate id.
     */
    public get aggregateId(): UserId {
        return this.id;
    }
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
    password?: string,
    dateOfBirth: string,
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
    dateOfBirth: string,
}