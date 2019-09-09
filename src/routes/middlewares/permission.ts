import {Response, NextFunction} from 'express'
import {every, includes, castArray} from 'lodash';
import {RequestWithUser} from '../../@types';

const permissionMiddleware = (roles: any  | [] ) =>
    (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (!roles || every(castArray(roles), permission => !includes(req.user.roles, permission))) {
            return res.status(403).send({message: 'You don\'t have permission to perform this action.'});
        }
        next();
    };

export default permissionMiddleware;
