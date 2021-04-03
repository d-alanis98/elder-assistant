import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
//Domain
import NotValidParameters from '../../application/Shared/domain/exceptions/NotValidParameters';
import InvalidArgumentError from '../../application/Shared/domain/exceptions/InvalidArgumentError';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.4
 * @description Base controller class, it contains an abstract method to implement the custom logic of the controller that
 * extends this class.
 * It also provides access to the validation of the request based on validation rules defined in middleware folder.
 */
export default abstract class Controller {

    /**
     * Entry point for the controller action.
     * @param request Express request.
     * @param response Express response.
     */
    abstract run(request: Request, response: Response): Promise<void>;
    
    /**
     * Performs the validation based on the validation rules retrieved from middleware.
     * @param request Express request.
     * @returns 
     */
    protected validateRequest = (request: Request): Boolean => {
        const errors = validationResult(request);
        const errorsArray: ValidationError[] = errors.array();
        //If there are errors in the array, we throw an exception
        if(errorsArray.length !== 0)
            throw new NotValidParameters(errorsArray);
        return true;
    }

    /**
     * Handler for the common domain exceptions, which could be thrown by any controller or use case.
     * @param {Error} error Exception.
     * @param {Response} response Express repsonse.
     */
    protected handleBaseExceptions = (error: Error, response: Response) => {
        if(error instanceof NotValidParameters || error instanceof InvalidArgumentError)
            response.status(httpStatus.BAD_REQUEST).send(
                error instanceof NotValidParameters
                    ? error.errors
                    : error.message
            );
        else response.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}