import { Request, Response } from 'express';
import httpStatus from 'http-status';
//User domain
import User from '../../../application/User/domain/User';
import UserNotFound from '../../../application/User/domain/exceptions/UserNotFound';
//Shared
import Controller from '../Controller';
import UserFinder from '../../../application/User/application/find/UserFinder';
//Dependency injection
import container from '../../dependency-injection';
import dependencies from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.3
 * @description Controller for the get user use case.
 */
export default class UserFinderController extends Controller {

    /**
     * Entry point for the controller action.
     * @param {Request} request 
     * @param {Response} response 
     */
    run = async (request: Request, response: Response) => {
        const id: string = request.params.id;
        try {
            const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
            const user: User = await userFinder.find(id);
            //We get the user without the password
            const userWithoutPassword: User = User.getUserWithoutPassword(user);
            //We send the response with the user data in JSON
            response.status(httpStatus.OK).json(userWithoutPassword.toPrimitives());
        } catch(error) {
            if(error instanceof UserNotFound)
                response.status(httpStatus.NOT_FOUND).send(error.message);
            else this.handleBaseExceptions(error, response);
        } 
    }

    /**
     * Method to get all the users by name and lastname match.
     * @param {Request} request Express request.
     * @param {Response} response Express response.
     */
    getAllUsers = async (request: Request, response: Response) => {
        try {
            //We get the data from the request
            const { name, limit, lastName, startingAt } = request.body;
            //We get and execute the use case
            const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
            const usersList = await userFinder.getAllUsers({
                name,
                limit,
                lastName,
                startingAt
            });
            //We send the response with the paginated data in primitive values
            response.status(httpStatus.OK).send({
                ...usersList,
                data: usersList.data.map(item => item.toPrimitives())
            });
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }
}
