'use strict';
import { Request, Response, NextFunction } from 'express';

import {StatusService} from '../services';
import pkg from '../../package.json';

class StatusController {
    public static ping(req: Request, res: Response, next: NextFunction) {
        try {
            res.send({version: pkg.version});
        } catch (err) {
            next(err);
        }
    }

    public static getStatus(req: Request, res: Response, next: NextFunction) {
        try {
            res.send(StatusService.getStatus());
        } catch (err) {
            next(err);
        }
    }

    public static async getHealth(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await StatusService.getHealth();
            res.send(status);
        } catch (err) {
            next(err);
        }
    }
}

export default StatusController;
