'use strict';

// const authMiddleware = require('../middlewares/auth');

const authRouter = require('./auth/auth');
const cdkRouter = require('./cdk/cdk');
const participantRouter = require('./participant/participant');
const userRouter = require('./user/user');
const publicRouter = require('./public');
const adminRouter = require('./admin');

const mountRouters = (app) => {
  app.use('/auth', authRouter);
  app.use('/cdk', cdkRouter);
  app.use('/participant', participantRouter);
  app.use('/user', userRouter);
  app.use('/public', publicRouter);
  app.use('/admin', adminRouter);
};

module.exports = mountRouters;
