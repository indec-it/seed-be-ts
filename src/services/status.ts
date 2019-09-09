'use strict';
import mongoose from 'mongoose';
import {
    every, concat,
} from 'lodash';

import pkg from '../../package.json';

/**
 * Creates the status object
 * @param {Array<{status}>} deps Required dependencies to work.
 * @param {Array<{status}>} optionalDeps Optional dependencies to work.
 * @returns {{name, status: string, deps}} Returns the status of this app.
 */
const generateStatus = (deps: any, optionalDeps: any = []) => ({
    deps: concat(deps, optionalDeps),
    name: pkg.name,
    status: every(deps, ({status: 'ok'}))
        ? every(optionalDeps, ({status: 'ok'})) ? 'ok' : 'degraded'
        : 'down',
});

class StatusService {
    public static getStatus() {
        return generateStatus([StatusService.getMongoDBStatus()]);
    }

    public static getHealth() {
        return StatusService.getMongoDBStatus();
    }

    public static getMongoDBStatus() {
        const connected = mongoose.connection.readyState === 1;
        return {
            name: 'MongoDB',
            status: connected ? 'ok' : 'down',
        };
    }
}

export default StatusService;
