/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Interface to keep the same structure over exception handler classes across the app.
 */
export default interface ExceptionHandler {
    //Methods
    handle(error: Error): void;
}