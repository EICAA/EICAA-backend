'use strict';

const Express = require('express');
const cors = require('cors');

const { setAccessControlHeadersAndHandleOptions } = require('./middlewares/request');
const mountRouters = require('./routes/routes');

const app = Express();

app.enable('trust proxy');
app.use(cors());
app.use(Express.json()); // body-parser

app.all('*', setAccessControlHeadersAndHandleOptions);

mountRouters(app);

module.exports = app;
