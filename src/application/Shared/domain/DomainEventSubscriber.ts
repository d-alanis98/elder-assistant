import DomainEvent, { DomainEventClass } from './DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Representation of a domain event subscriber
 */
export default interface DomainEventSubscriber<T extends DomainEvent> {
    subscribedTo(): Array<DomainEventClass>;

    on(domainEvent: T): Promise<void>;
}
