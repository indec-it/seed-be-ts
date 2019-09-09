'use strict';
import os from 'os';
import cluster from 'cluster';

import mainApp from './app';
import nativeEvent from './helpers/nativeEvent';
import dotenv from 'dotenv';
dotenv.config();

const app = new mainApp();

if (cluster.isMaster) {
	nativeEvent.process();
	const CPUS: any = os.cpus();
	CPUS.forEach(() => cluster.fork());
	nativeEvent.cluster(cluster);
	app.loadQueue();
} else {
	app.init();
}
