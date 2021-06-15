
//HTTP
import http from 'http';
import httpStatus from 'http-status';
//Express
import express, { Request, Response, Express, Router as ExpressRouter } from 'express';
import Router from 'express-promise-router';
//Middlewares
import cors from 'cors';
import helmet from 'helmet';
import compress from 'compression';
import errorHandler from 'errorhandler';
//Domain
import Logger from '../application/Shared/domain/Logger';
import ErrorWithStatusCode from '../application/Shared/domain/exceptions/ErrorWithStatusCode';
//Dependency injection
import container from './dependency-injection';
//Routes
import { registerRoutes } from './routes';
//Configuration
import app from '../configuration/app';

/**
 * @author Damian Alanis Ramirez
 * @version 4.5.8
 * @description Server implementation with Express framework. This creates the server,
 * apply middlewares, register routes, register the error handler and starts the server 
 * that will attend requests in the specified port.
 */
export default class Server {
    private port: number | string;
    private logger: Logger;
    private router?: ExpressRouter; 
    private express?: Express;
    private httpServer?: http.Server;

    constructor(port: number | string) {
        //Network parameters
        this.port = port;
        //Logger
        this.logger = container.get('Shared.Logger');
        //Express
        this.setExpress();
        //Routes
        this.registerRoutes();
        //And we supply the error handling
        this.handleExceptions();
    }

    /**
     * Method to set the express instance and register middlewares.
     */
    private setExpress = (): void => {
        this.express = express();
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(compress());
        this.express.use(cors({
            origin: true, 
            credentials: true
        }));
        this.express.use(express.static('uploads'))
    }

    /**
     * Method to register the route sof the application.
     */
    private registerRoutes = () => {
        const router: ExpressRouter = Router();
        router.use(errorHandler());
        this.express?.use(router);
        //We register the routes
        registerRoutes(router);
        //We set the route rin the instance state
        this.router = router;
    }

    /**
     * Starts the server, which will be listening for requests in the specified port.
     * @returns 
     */
    async listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(!this.express)
                return reject();
            this.httpServer = this.express.listen(this.port, () => {
                this.logger.info(
                    `${ app.name } is running at http://localhost:${this.port} in ${this.express?.get('env')} mode`
                );
                this.logger.info('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    /**
     * Getter for the HTTP server instance.
     * @returns 
     */
    getHTTPServer = (): http.Server | undefined => this.httpServer;

    /**
     * Exception handler for Express errors (which may be thrown across requests or middlewares).
     */
    handleExceptions = (): void => {
        this.router?.use((error: Error, request: Request, response: Response, next: Function) => {
            if(error instanceof ErrorWithStatusCode)
                response.status(error.getStatusCode()).send(error.message);
            else { //Internal server error
                this.logger.error(error);
                response.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }

    /**
     * Method to stop listening to requests.
     * @returns {Promise<void>}
     */
    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.httpServer)
                this.httpServer.close(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            return resolve();
        });
    }
}