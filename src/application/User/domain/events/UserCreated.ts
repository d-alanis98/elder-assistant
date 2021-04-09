//User domain
import User from '../User';
//Domain events
import DomainEvent from '../../../Shared/domain/events/DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 2.1.1
 * @description Event that is emitted when a user is created.
 */
export default class UserCreated extends DomainEvent {
    readonly user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    getAggregateId = () => this.user.id; 
}