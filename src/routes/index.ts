'use strict';
import {Router, Application} from 'express';

import {authenticateMiddleware} from './middlewares';

import {StatusController} from '../controllers';
import Errors from '../helpers/error';
import api from './api';
import publicApi from './public-api';

/**
 * @class Routes
 * links Routes of Application
 * @description
 * <b> /ping </b> returns current version of app </br>
 * <b> /ready </b> Check if everything is ok and running </br>
 * <b> /health </b> Check if external agents are ok </br>
 * <b> /public-api </b> Links publics for external and not logging request /br>
 * <b> /api </b> main link, this manage all functions of be </br>
 * <b> * </b> returns error page when not matching url can be found </br>
 */
class Routes {
    public static configure(app: Application) {
        app.get('/ping', StatusController.ping);
        app.get('/ready', StatusController.getStatus);
        app.get('/health', StatusController.getHealth);

        app.use('/api', authenticateMiddleware, api(Router()));
        app.use('/public-api', publicApi(Router()));

        app.get('/', (_, res) => Errors.send404(res));
        app.use('*', (_, res) => Errors.sendError(res));
    }
}

export default Routes;
