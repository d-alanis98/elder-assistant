import { Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
//Infrastructure
import { DataRepository } from '../../application/Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.0.1
 * @description Base controller class, it contains an abstract method to implement the custom logic of the controller that
 * extends this class.
 * It also provides access to the validation of the request based on validation rules defined in middleware folder.
 */
export default abstract class Controller<T> {
    protected dataRepository: DataRepository<T>;

    constructor(dataRepository: DataRepository<T>) {
        this.dataRepository = dataRepository;
    }

    /**
     * Performs the validation based on the validation rules retrieved from middleware.
     * @param request Express request.
     * @returns 
     */
    protected validateRequest = (request: Request): Array<ValidationError> => {
        const errors = validationResult(request);
        return errors.array();
    }

    /**
     * Entry point for the controller action.
     * @param request Express request.
     * @param response Express response.
     */
    abstract run(request: Request, response: Response): Promise<void>;
}