
/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Interface that defines the main event listeners decorators of an ORM.
 */
export default interface ORMEvents {
    AfterInsert?(...args: any[]): Function;
    AfterUpdate?(...args: any[]): Function;
    AfterRemove?(...args: any[]): Function;
}