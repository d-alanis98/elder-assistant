
/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Specification of a basic ORM's decorators.
 */
export default interface ORMProvider {
    //ORM base decorators
    Entity(...args: any[]): Function;
    Column(...args: any[]): Function;
    PrimaryColumn(...args: any[]): Function;
    //Main ORM mehtods
    connection?(): any;
    repository?(...args: any[]): any;
}