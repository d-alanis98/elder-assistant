//Aggregate root
import AggregateRoot from '../AggregateRoot';
//Domain events
import DomainEvent from './DomainEvent';
//Domain value objects
import StringValueObject from '../value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Class to dispatch and, eventually, invoke the handlers of domain events across the app.
 */
export default class DomainEventsHandler {
    private static handlersMap: any = {};
    private static markedAggregates: AggregateRoot[] = [];

    /**
     * Method to call all the handler for any domain events on this aggregate.
     * @param aggregate The aggregate root instance.
     */
    private static dispatchAggregateEvents = (aggregate: AggregateRoot): void => {
        aggregate.domainEvents.forEach((event: DomainEvent) => DomainEventsHandler.dispatch(event));
    }

    /**
     * Method to remove an aggregate root from the marked list.
     * @param aggregate The aggregate root instance to remove.
     */
    private static removeAggregateFromMarkedDispatchList = (aggregate: AggregateRoot): void => {
        DomainEventsHandler.markedAggregates = DomainEventsHandler.markedAggregates.filter((markedAggregate: AggregateRoot) => (
            markedAggregate.aggregateId !== aggregate.aggregateId
        ));
    }

    /**
     * Method to find an aggregate by it's ID within the list of marked aggregates.
     * @param {StringValueObject} aggregateId Id of the aggregate root. 
     * @returns 
     */
    private static findMarkedAggregateById = (
        aggregateId: StringValueObject
    ): AggregateRoot | undefined => {
        return DomainEventsHandler.markedAggregates.find(
            aggregate => aggregate.aggregateId === aggregateId
        );
    }

    /**
     * Invokes all of the subscribers to a particular domain event.
     * @param event Aggregate domain event
     * @returns 
     */
    private static dispatch = (event: DomainEvent): void => {
        //We get the name of the domain (which will be it's identifier on the handlers map)
        const eventClassName: string = event.constructor.name;
        //We execute the handlers, if they exist
        if (!DomainEventsHandler.handlersMap.hasOwnProperty(eventClassName))
            return;
        const handlers: any[] = DomainEventsHandler.handlersMap[eventClassName];
        //We execute all the handlers registered, providing the event instance to all of them.
        for (let handler of handlers)
            handler(event);
    }

    //FACADE

    /**
     * Method called by aggregate root objects that have created a domain event that needs to be dispatched.
     * @param {AggregateRoot} aggregate The aggregate instance to add to the marked aggregates. 
     * @returns 
     */
    public static markAggregateForDispatch = (aggregate: AggregateRoot): void => {
        const aggregateFound = DomainEventsHandler.findMarkedAggregateById(aggregate.aggregateId);
        //We validate that the aggregate does not exist already in the markedAggregates array
        if (aggregateFound)
            return;
        //We add it to the array
        DomainEventsHandler.markedAggregates.push(aggregate);
    }

    /**
     * Method to dispatch the events of the aggregate root when we know only the aggregate id.
     * @param {StringValueObject} id Aggregate root Id. 
     * @returns 
     */
    public static dispatchEventsForAggregate = (id: StringValueObject): void => {
        const aggregate = DomainEventsHandler.findMarkedAggregateById(id);
        //We validate that the aggregate exists
        if (!aggregate)
            return;
        //We disptach the aggregate root domain events
        DomainEventsHandler.dispatchAggregateEvents(aggregate);
        //We clear the events to be dispatched from the aggregate and from the local marked dispatch list
        aggregate.clearEvents();
        DomainEventsHandler.removeAggregateFromMarkedDispatchList(aggregate);
    }

    /**
     * Method to register a handler to a domain events.
     * @param {Function} callback Handler callback.
     * @param {string} eventClassName Class name of the domain event, its identifier in the map. 
     */
    public static registerDomainHandler = (
        eventClassName: string,
        callback: (event: any) => void,
    ): void => {
        //We get the name of the constructor DomainEvent (i.e: UserCreated) to act as the id in the map for all the handlers of this event.
        //We validate the existance of the record in the map, if it does not exist, we initialize it with an empty array
        if (!DomainEventsHandler.handlersMap.hasOwnProperty(eventClassName))
            DomainEventsHandler.handlersMap[eventClassName] = [];
        //We add the handler
        DomainEventsHandler.handlersMap[eventClassName].push(callback);
    }

    /**
     * Mehtod to clear the handlers map.
     */
    public static clearHandlers = (): void => {
        DomainEventsHandler.handlersMap = {};
    }

    /**
     * Method to clear the marked aggregates array.
     */
    public static clearMarkedAggregates = (): void => {
        DomainEventsHandler.markedAggregates = [];
    }

}