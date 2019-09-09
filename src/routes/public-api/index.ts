import {Router} from 'express';
import requireDir from 'require-dir';
import {forEach, isFunction} from 'lodash';

import logger from '../../helpers/logger';

export default (router: Router) => {
    forEach(
        requireDir('.', {recurse: true}),
        (module, name) => {
            logger.info(`Loading ${name} api...`);
            if (!isFunction(module)) {
                router.use(`/${name}`, require(`./${name}`)(Router()));
            } else {
                router.use(`/${name}`, module(Router()));
            }
        }
    );

    return router;
};
