import Uuid from './value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 */
export default abstract class DomainEvent {
  //Static members
  static EVENT_NAME: string;
  static fromPrimitives: (...args: any[]) => any;
  //Read only properties
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(eventName: string, aggregateId: string, eventId?: string, occurredOn?: Date) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || Uuid.random().value;
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
  }

  abstract toPrimitive(): Object;
}

export type DomainEventClass = { 
  EVENT_NAME: string, 
  fromPrimitives(...args: any[]): DomainEvent; 
};
