'use strict';

const express = require('express');

const { verifyToken } = require('../../middlewares/request');

const assessmentsRouter = require('./assessments');
const resultRouter = require('./results');
const usersRouter = require('./users');

const userRouter = express.Router({ mergeParams: true });

userRouter.use('/', verifyToken);

userRouter.use('/assessments', assessmentsRouter);
userRouter.use('/results', resultRouter);
userRouter.use('/users', usersRouter);

module.exports = userRouter;
