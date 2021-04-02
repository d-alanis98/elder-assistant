import { Request, Response } from 'express';
import httpStatus from 'http-status';
//User domain
import User from '../../../application/User/domain/User';
import UserId from '../../../application/Shared/domain/modules/User/UserId';
import UserNotFound from '../../../application/User/domain/exceptions/UserNotFound';
import UserRepository from '../../../application/User/domain/UserRepository';
//Shared
import Controller from '../Controller';
import { Nullable } from '../../../application/Shared/domain/Nullable';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Controller for the get user use case.
 */
export default class UserGetController extends Controller<User> {

    /**
     * Constructor of the controller, it must receive a data repository, of type DataRepository<T>, where T, in this case,
     * is the type User.
     * UserRepository is an interface defined in the domain of User component, that has the shape of DataRepository
     * with the User type instead of generic, thats why we can use it, also, with the benefit of being more semanthic.
     * @param {DataRepository<User>} dataRepository 
     */
    constructor(dataRepository: UserRepository) {
        super(dataRepository);
    }

    /**
     * Entry point for the controller action.
     * @param {Request} request 
     * @param {Response} response 
     */
    run = async (request: Request, response: Response) => {
        const id: string = request.params.id;
        let user: Nullable<User>;
        try {
            user = await this.dataRepository.search(new UserId(id));
            //If user is null we throw a user not found exception
            if(!user)
                throw new UserNotFound(id);
            //We send the response with the user data in JSON
            response.status(httpStatus.OK).json(user);
        } catch(error) {
            if(error instanceof UserNotFound)
                response.status(httpStatus.NOT_FOUND).send(error.message);
            else response.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
        } 
    }
}