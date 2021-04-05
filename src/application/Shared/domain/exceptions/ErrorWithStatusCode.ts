/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @desciption Custom exception for errors that contains a certain status code.
 */
 export default class ErrorWithStatusCode extends Error {
    protected statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 500;
    }

    public getStatusCode = (): number => this.statusCode;
 }