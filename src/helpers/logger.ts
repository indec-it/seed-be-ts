'use strict';

import {transports, format, createLogger, LoggerOptions} from "winston";
import winston from 'winston';
import packageJson from '../../package.json';
import dotenv from 'dotenv';

dotenv.config();

const {
    combine,
    timestamp,
    printf,
    colorize,
    align
} = format;


const myCustomLevels = {
    levels: {
        error: 0,
        info: 2,
        debug: 1
    },
    colors: {
        error: 'red',
        info: 'green',
        debug: 'yellow'
    }
};

const customFormat = printf(info =>
    `[${info.level} ${new Date(info.timestamp).toLocaleString()}] ${info.message}`
);

winston.addColors(myCustomLevels.colors);

const formatter = combine(
    timestamp(),
    align(),
    colorize({ all: true }),
    customFormat
);

const getTransports = () => {
    let transportOpts;
    if (process.env.NODE_ENV === 'production') {
        transportOpts = [
            new transports.Console(),
            new transports.File({
                filename: `/tmp/${packageJson.name}-debug.log`,
                level: 'info',
                handleExceptions: true
            }),
            new transports.File({
                filename: `/tmp/${packageJson.name}-error.log`,
                level: 'error',
                handleExceptions: true
            })
        ];
    }

    return transportOpts;
};

const options: LoggerOptions = {
    format: formatter,
    levels: myCustomLevels.levels,
    transports: getTransports()
}

const logger = createLogger(options);

if (process.env.NODE_ENV === "development") {
    logger.add(new transports.Console());
}

export default logger;