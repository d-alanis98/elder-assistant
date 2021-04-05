
//HTTP
import http from 'http';
import httpStatus from 'http-status';
//Express
import express, { Request, Response, Express, Router as ExpressRouter } from 'express';
import Router from 'express-promise-router';
//Middlewares
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


export default class Server {
    private express: Express;
    private port: number | string;
    private logger: Logger;
    private httpServer?: http.Server;

    constructor(port: number | string) {
        //Network parameters
        this.port = port;
        //Logger
        this.logger = container.get('Shared.Logger');
        //Express
        this.express = express();
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(compress());
        //Routes
        const router: ExpressRouter = Router();
        router.use(errorHandler());
        this.express.use(router);
        //We register the routes
        registerRoutes(router);
        //And we supply the error handling
        this.handleExceptions(router);
    }

    async listen(): Promise<void> {
        return new Promise(resolve => {
            this.httpServer = this.express.listen(this.port, () => {
                this.logger.info(
                    `${ app.name } is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
                );
                this.logger.info('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    getHTTPServer() {
        return this.httpServer;
    }

    handleExceptions = (router: ExpressRouter) => {
        router.use((error: Error, request: Request, response: Response, next: Function) => {
            if(error instanceof ErrorWithStatusCode)
                response.status(error.getStatusCode()).send(error.message);
            else { //Internal server error
                this.logger.error(error);
                response.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }

            return resolve();
        });
    }
}