
import {Request, Response, NextFunction} from 'express';
import {split} from 'lodash';

import errors from '../../helpers/error';

/**
 * @todo
 *  Traer esto de heimdall y validar si el usuario esta habilitado.
 */
// const {User} = require('../../models');

export default async (req: Request, res: Response, next: NextFunction) => {
    const header = req.get('Authorization');
    if (!header) {
        return res.sendStatus(401);
    }
    const token = split(header, /\s+/).pop();
    if (!token) {
        return errors.sendError(res);
    }

    try {
        /**
         * @todo
         *  Traer esto de heimdall y validar si el usuario esta habilitado.
         */
        /*const checkUser = await User.findOne({_id: user._id}).lean().exec();
        if (!checkUser.disabled) {
            return next();
        }
        res.status(500).send({error: 'Not a valid user'});
        */
        return next();
    } catch (err) {
        next(err);
    }
};
