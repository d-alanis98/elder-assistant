import { Router } from 'express';
import glob from 'glob';
import httpStatus from 'http-status';

/**
 * Method to register all the existing routes in the routes/ directory, by importing
 * them as modules and invoking their register method, which requires de router instance
 * to register each route. At the end, we will handle non existant routes, sending a 404
 * status code.
 * @param {Router} router Express router.
 */
export const registerRoutes = (router: Router) => {
    //We get all the route definitions in this directory, that have the form *.route.(js|ts) (i.e: users.route.ts)
    const routes = glob.sync(`${__dirname}/**/*.route.*`); //Even if they are nested inside folders we can reach them
    //We register each route
    routes.map(route => register(route, router));
    //For non existant routes, we send a 404 status code.
    handleNonExistantRoutes(router);
}

/**
 * 
 * @param {string} routePath Route path.
 * @param {Router} router Express router.
 */
const register = (routePath: string, router: Router) => {
    //We get the route module exported
    const route = require(routePath);
    //We invoke the register method of the module, providing the router by injection
    route.register(router);
}

/**
 * Handler for non existant routes.
 * @param {Router} router Express router.
 */
const handleNonExistantRoutes = (router: Router) => {
    router.all('*', (req, res) => res.status(httpStatus.NOT_FOUND).send());
}


