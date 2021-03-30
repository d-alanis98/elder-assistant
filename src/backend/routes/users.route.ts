import { Router, Request, Response } from 'express';
//import container from '../dependency-injection';

export const register = (router: Router) => {
    //const UserPutController = container.get('App.controllers.UserPutController');
    //router.put('/users/:id', (req: Request, res: Response) => userPutController.run(req, res));

    //const usersGetController = container.get('App.controllers.UsersGetController');
    //router.get('/users', (req: Request, res: Response) => usersGetController.run(req, res));

    router.get('/hello', (req: Request, res: Response) => {
        res.send({ message: 'Hello world' });
    })
};
