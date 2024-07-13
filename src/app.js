import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debug from 'debug';
import apiRouter from './backend/routes/payment-routes.js';
import frontendRouter from './frontend/pages-routes.js';
import http from 'http';
import dotenv from 'dotenv';
import config from './config.js';
import {Utils} from './backend/utils/utils.js';
// Initialize dotenv
dotenv.config();


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(Utils.getDirName(), '..', '..', '..', 'public'));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(Utils.getDirName(), '..', '..', '..', 'public')));

app.use('/api/v1', apiRouter);
app.use(frontendRouter);


const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Server started on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

