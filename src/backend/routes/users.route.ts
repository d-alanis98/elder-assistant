import { Router } from 'express';
//Dependency injection
import container from '../dependency-injection';
import dependencies from '../../application/Shared/domain/constants/dependencies';
//Middlewares
import UserValidation from '../middleware/User/UserValidation';
//Controllers
import UserFinderController from '../controllers/User/UserFinderController';
import UserRegisterController from '../controllers/User/UserRegisterController';
import UserAuthenticationController from '../controllers/User/UserAuthenticationController';



export const register = (router: Router) => {
    //User login
    const userAuthenticationController: UserAuthenticationController = container.get(dependencies.UserAuthenticationController);
    router.post(
        '/login',
        UserValidation.loginValidator(),
        userAuthenticationController.run.bind(userAuthenticationController)
    );
    //Register user
    const userRegisterController: UserRegisterController = container.get(dependencies.UserRegisterController);
    router.post(
        '/register', 
        UserValidation.registerValidator(), 
        userRegisterController.run.bind(userRegisterController)
    );
    //Get user by id
    const userFinderController: UserFinderController = container.get(dependencies.UserFinderController);
    router.get(
        '/user/:id',
        userFinderController.run.bind(userFinderController)
    );
};
