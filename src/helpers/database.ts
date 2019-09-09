import knex from 'knex';
import path from 'path';
import Logger from './logger';

const {
    DB_DRIVER,
    DB_CONFIG
} = process.env;

const basePath = `${path.normalize(`${__dirname}/../..`)}`;

const db = knex({
    client: DB_DRIVER,
    connection: JSON.parse(DB_CONFIG),
    pool: {
        min: 0,
        max: 20
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: `${basePath}/db/migrations`
    },
    seeds: {
        directory: `${basePath}/db/seeds`
    }
});

db.raw('SELECT \'test connection\';').then(() =>
    Logger.info('database connected...')
).catch(() => {
    Logger.error('database connection failed...');
});

export default db;
