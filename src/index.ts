'use strict'
import os from 'os';
import cluster from 'cluster';

import MainApp from './app';
import NativeEvent from './helpers/nativeEvent';
import dotenv from 'dotenv';
dotenv.config();

const App = new MainApp();

if (cluster.isMaster) {
	NativeEvent.process();
	const CPUS: any = os.cpus();
	CPUS.forEach(() => cluster.fork());
	NativeEvent.cluster(cluster);
	App.loadQueue();
} else {
	App.init();
}