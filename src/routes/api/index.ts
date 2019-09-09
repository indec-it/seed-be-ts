import {Router} from 'express';
import requireDir from 'require-dir';
import {forEach} from 'lodash';

import logger from '../../helpers/logger';

export default (router: Router) => {
    forEach(
        requireDir('.', {recurse: true}),
        (module, name) => {
            logger.info(`Loading ${name} api...`);
            router.use(`/${name}`, module(Router()));
        },
    );

    return router;
};
