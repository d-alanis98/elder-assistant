import ExceptionHandler from "./ExceptionHandler";

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Handler class for uncaught exceptions through the application 
 */
export default class UncaughtExceptionHandler implements ExceptionHandler {
    private error: Error;

    /**
     * @param {Error} error the error to handle
     */
    constructor(error: Error) {
        this.error = error;
    }

    /**
     * Method to handle exceptions in an uniform way across the app
     */
    public handle = () => {
        console.error(this.error);
        process.exit(1);
    }
}