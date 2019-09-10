'use strict';

import {Response, NextFunction} from 'express';
import {split} from 'lodash';

import errors from '../../helpers/error';
import {RequestWithUser} from '../../@types/index';

/**
 * @todo
 *  Traer esto de heimdall y validar si el usuario esta habilitado.
 */
// const {User} = require('../../models');

export default async (req: RequestWithUser, res: Response, next?: NextFunction) => {
    const header: string = req.get('Authorization');
    if (!header) {
        return res.sendStatus(401);
    }
    const token: string = split(header, /\s+/).pop();
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
