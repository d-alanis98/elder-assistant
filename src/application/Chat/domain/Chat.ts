//Value objects
import ChatId from './value-objects/ChatId';
import ChatName from './value-objects/ChatName';
import ChatMembers from './value-objects/ChatMembers';
import ChatCreationDate from './value-objects/ChatCreationDate';
//User domain
import User, { UserPrimitives } from '../../User/domain/User';
import UserId from '../../Shared/domain/modules/User/UserId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';


/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Chat entity.
 */
export default class Chat extends AggregateRoot {
    readonly id: ChatId;
    readonly name: ChatName;
    readonly ownedBy: UserId;
    readonly members: ChatMembers;
    readonly createdAt: ChatCreationDate;

    constructor(
        id: Nullable<ChatId>,
        name: ChatName,
        ownedBy: UserId,
        members: ChatMembers,
        createdAt?: Nullable<ChatCreationDate>
    ) {
        super();
        this.id = id || ChatId.random();
        this.name = name;
        this.ownedBy = ownedBy;
        this.members = members;
        this.createdAt = createdAt || ChatCreationDate.current();
    }

    /**
     * Method to return the instance data in primitive values.
     * @returns Object with the values in primitives.
     */
    toPrimitives = (): ChatPrimitives => ({
        _id: this.id.toString(),
        name: this.name.toString(),
        ownedBy: this.ownedBy.toString(),
        members: this.members.toPrimitiveValues(),
        createdAt: this.createdAt.toString()
    });

    /**
     * Method to get an instance of Chat entity with primitive values as an input.
     * @param {Nullable<string>} _id Id of the chat.
     * @param {string} name Name of the chat.
     * @param {string} ownedBy Id of the User that owns the chat.
     * @param {Nullable<UserPrimitives[]>} members Collection of users that are members of the chat. 
     * @param {Nullable<string>} createdAt Date of creation of the chat.
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        name,
        ownedBy,
        members,
        createdAt
    }: ChatPrimitives) => new Chat(
        _id ? new ChatId(_id) : null,
        new ChatName(name),
        new UserId(ownedBy),
        Chat.getChatMembersFromPrimitives(members),
        createdAt ? new ChatCreationDate(createdAt) : null
    );

    /**
     * Method to get the chat members (the full User entity) from the primitive values array.
     * @param {Nullable<UserPrimitives[]>} members Array of user primitives.
     * @returns 
     */
    static getChatMembersFromPrimitives = (members: Nullable<UserPrimitives[]>) => {
        let users: User[] = members && Array.isArray(members)
            ? members.map((userPrimitives: UserPrimitives) => User.fromPrimitives(userPrimitives))
            : []
        return new ChatMembers(users);
    };

    /**
     * Method to get the ID of the aggregate.
     */
    public get aggregateId(): ChatId { 
        return this.id;
    }
}

export interface ChatPrimitives extends ChatBaseRequestPrimitives {
    _id: Nullable<string>;
    members: Nullable<UserPrimitives[]>;
}

export interface ChatBaseRequestPrimitives {
    name: string;
    ownedBy: string;
    createdAt?: string;
}