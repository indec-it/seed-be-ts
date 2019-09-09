import mongoose from 'mongoose';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

class Mongoose {
    public static configure() {
        const {DATABASE_URL} = process.env;
        mongoose.Promise = Promise;
        mongoose.connect(DATABASE_URL, {
            poolSize: 20,
            useNewUrlParser: true,
            socketTimeoutMS: 0,
            connectTimeoutMS: 0,
            useCreateIndex: true,
        });
        mongoose.connection.once('open',
            () => logger.info(
                'Mongoose connected',
            ),
        );
        mongoose.connection.on('close', () => logger.info('connection closed'));
        mongoose.connection.on('error', (err) => logger.error(`connection error ${err}`));
    }
}

export default Mongoose;
