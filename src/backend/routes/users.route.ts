import { Router, Request, Response } from 'express';
import UserRegisterController from '../controllers/User/UserRegisterController';
import container from '../dependency-injection';
import UserValidation from '../middleware/User/UserValidation';

export const register = (router: Router) => {
    //const UserPutController = container.get('App.controllers.UserPutController');
    //router.put('/users/:id', (req: Request, res: Response) => userPutController.run(req, res));

    //const usersGetController = container.get('App.controllers.UsersGetController');
    //router.get('/users', (req: Request, res: Response) => usersGetController.run(req, res));

    const userRegisterController: UserRegisterController = container.get('Users.Controllers.UserRegisterController');
    router.post(
        '/register', 
        UserValidation.registerValidator(), 
        userRegisterController.run.bind(userRegisterController)
    );
};
