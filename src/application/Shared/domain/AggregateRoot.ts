//Domain events
import DomainEvent from './events/DomainEvent';
import DomainEventsHandler from './events/DomainEventsHandler';
//Value objects
import StringValueObject from './value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 2.3.3
 */
export default abstract class AggregateRoot {
    //Domain events
    private domainEventsToEmit: DomainEvent[] = [];

    /**
     * Getter nethod for the aggregate Id.
     */
    abstract get aggregateId(): StringValueObject;

    /**
     * Getter method for the domainEventsToEmit array.
     */
    get domainEvents(): DomainEvent[] {
        return this.domainEventsToEmit; 
    } 

    /**
     * Method to add the domain event to this aggregate's list of domain events, as well as registering this aggregate value
     * instance in the DomainEventsHandler.
     * @param {DomainEvent} domainEvent 
     */
    public addDomainEvent = (domainEvent: DomainEvent): void => {
        this.domainEventsToEmit.push(domainEvent);
        //We add this aggregate instance to the DomainEventsHandler list of aggregates
        DomainEventsHandler.markAggregateForDispatch(this);
    }

    /**
     * Method to clear the existing domain events.
     */
    public clearEvents = (): void => {
        this.domainEventsToEmit = [];
    }

    /**
     * Method to be implemented in the Aggregate extending this base class. Implies the transformation of value objects
     * to JS primitive values.
     */
    abstract toPrimitives(): any;
}
