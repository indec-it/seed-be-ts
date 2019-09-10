'use strict';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import Locals from './helpers/locals';
import Log from './helpers/logger';
import mongoose from './helpers/mongoose';
import Router from './routes';

const config = Locals.config();

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
    }

    private _onListening(): void {
        Log.info(`Started ${config.name} at port ${config.port} in ${config.NODE_ENV} environment`);
    }

    private _onError(err: any): void {
        Log.error(`App Crashed, Error: ${err.message}`);
    }

    private _configure(): void {
        mongoose.configure();
        this._middleWares();
        this._routes();
    }

    private _middleWares(): void {
        this.app.use(bodyParser.json({limit: config.BODY_LIMIT}));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieParser());
        if (config.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
            this.app.use(cors({
                credentials: true,
                origin: /^http:\/\/localhost/,
            }));
        } else {
            this.app.use(morgan('combined'));
            this.app.use(cors());
        }
    }

    private _routes(): void {
        Router.configure(this.app);
    }

    public init(): void {
        this._configure();
        this.app.listen(config.port, this._onListening);
        this.app.on('error', (err) => this._onError(err));
    }

    public loadQueue(): void {
        const isQueueMonitorEnabled: boolean = Locals.config().queueMonitor;
        const queueMonitorPort: number = Locals.config().queueMonitorHttpPort;

        if (isQueueMonitorEnabled) {
            Log.info(`Queue Monitor :: Running @ 'http://localhost:${queueMonitorPort}'`);
        }
    }

    public loadWorker(): void {
        Log.info('Worker :: Booting @ Master...');
    }
}

export default App;
