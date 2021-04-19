//Shared domain
import User from '../../../User/domain/User';
import { Nullable } from '../../../Shared/domain/Nullable';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Chat members value object.
 */
export default class ChatMembers {
    private _members: User[];

    constructor(members: Nullable<User[]>) {
        this._members = members || [];
    }

    /**
     * Getter for the members.
     */
    public get members() {
        return this._members;
    }

    /**
     * Method to add a user to the chat members collection.
     * @param {User} member User to add to the chat.
     */
    addMember = (member: User) => {
        this._members.push(member);
    }

    /**
     * Method to remove a user from the chat members collection.
     * @param {User} member User to remove from the chat.
     */
    removeMember = (member: User) => {
        this._members = this._members.filter((_member: User) => (
            _member.id.value !== member.id.value
        ));
    }

    /**
     * Method to get the users in the chat members collection on primitive values form.
     * @returns Object with chat members in primitive values.
     */
    toPrimitiveValues = () => (
        this._members.map((member: User) => member.toPrimitives())
    );
}