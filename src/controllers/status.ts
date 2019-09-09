'use strict'
import { Request, Response, NextFunction } from 'express';

import {StatusService} from '../services';
import pkg from '../../package.json';

class StatusController {
    static ping(req: Request, res: Response, next: NextFunction) {
        try {
            res.send({version: pkg.version});
        } catch (err) {
            next(err);
        }
    }

    static getStatus(req: Request, res: Response, next: NextFunction) {
        try {
            res.send(StatusService.getStatus());
        } catch (err) {
            next(err);
        }
    }

    static async getHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await StatusService.getHealth();
            res.send(status);
        } catch (err) {
            next(err);
        }
    }
}

export default StatusController;
