/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Methods that a DateService provider must implement.
 */
export default interface DateService<T> {
    toString(): string;

    fromISOString(isoString: string): T;
}