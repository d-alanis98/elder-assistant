import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
//Domain
import NotValidParameters from '../../application/Shared/domain/exceptions/NotValidParameters';
import ErrorWithStatusCode from '../../application/Shared/domain/exceptions/ErrorWithStatusCode';
import InvalidArgumentError from '../../application/Shared/domain/exceptions/InvalidArgumentError';
import DomainEventsHandler from '../../application/Shared/domain/events/DomainEventsHandler';

/**
 * @author Damián Alanís Ramírez
 * @version 2.7.8
 * @description Base controller class, it contains an abstract method to implement the custom logic of the controller that
 * extends this class.
 * It also provides access to the validation of the request based on validation rules defined in middleware folder. As well
 * as exception handling and a way to register domain events handlers.
 */
export default abstract class Controller {

    constructor() {
        //If the registerEventHandlers method is implemented, we execute it.
        if(this.registerEventHandlers)
            this.registerEventHandlers();
    }
    /**
     * Entry point for the controller action.
     * @example
     *  run = async(request: Request, response: Response): Promise<void> => {
     *      try {
     *          //We validate the request if necessary (i.e: when registering a new user we wan't to make sure that all fields are provided)
     *          this.validateRequest(request);
     *          //We get the parameters from the request
     *          const { param1, param2, ..., paramN } = request;
     *          //We should get the use case from the dependencies container
     *          const useCase: UseCase = container.get(dependencies.UseCase);
     *          //We provide the parameters to the use case, it may return a result, or not.
     *          const result = await useCase.run({ param1, param2, ..., paramN }) 
     *          //We return the response
     *          response.status(...).send(result);
     *      } catch(exception) {
     *          if(exception instanceof <CustomException1>) { ... }
     *          else if(exception instanceof <CustomException2>) { ... }
     *          ...
     *          //We can also omit the custom exceptions if they are derived from the ErrorWithStatusCode class, since
     *          //that kind of exceptions are handled already in this.handleBaseExceptions();
     *          else this.handleBaseExceptions(exception, response);
     *      }
     *  }
     * @param request Express request.
     * @param response Express response.
     */
    abstract run(request: Request, response: Response): Promise<void>;
    
    /**
     * Performs the validation based on the validation rules retrieved from middleware.
     * @example
     *  //At the beginning of the try catch block:
     *  try {
     *      //We perform the validation
     *      this.validateRequest(request);
     *      ...
     *  } catch(e) { ... }
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
        //If an status code is provided, we handle it
        else if(error instanceof ErrorWithStatusCode)
            response.status(error.getStatusCode()).send(error.message);
        else response.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }

    /**
     * Method to register a domain event handler with the registerDomainHandler facade method of DomainEventsHandler.
     * This way, we don't need to include this dependency on every controller that needs to register a domain event 
     * handler, instead, we only provide the event name and the handler itself.
     * @example
     *  //With inline arrow function
     *  this.onDomainEvent('UserCreated', (event: UserCreated) => { ... });
     * 
     *  //With class property, receives one parameter, the (event) of <T extends DomainEvent>
     *  this.onDomainEvent('UserCreated', this.onUserCreated.bind(this));
     * @param {string} eventName Name of the event, ie: 'UserCreated', or with the className: UserCreated.name.
     * @param {Function} handler Handler to register for the event.
     */
    protected onDomainEvent = (
        eventName: string,
        handler: (event: any) => void
    ) => {
        DomainEventsHandler.registerDomainHandler(eventName, handler);
    }

    /**
     * Method to be implemented if it is required to act after certain events.
     * When implemented, the developer can use this.onDomainEvent, to avoid including DomainEventsHandler as an extra
     * dependency, also, it is more descriptive.
     * @example
     *  //With inline arrow function: 
     *  protected registerEventHandlers() {
     *      this.onDomainEvent('UserCreated', (event: UserCreated) => { ... });
     *  }
     *  //With class property, receives one parameter, the (event) of <T extends DomainEvent>
     *  protected registerEventHandlers() {
     *      this.onDomainEvent('UserCreated', this.onUserCreated.bind(this));
     *  }
     */
    protected registerEventHandlers?(): void;

}
