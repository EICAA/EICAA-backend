'use strict';

const express = require('express');

const assessmentRouter = require('./assessment');
const assessmentTypeRouter = require('./assessmentType');

const participantRouter = express.Router({ mergeParams: true });

participantRouter.use('/assessment', assessmentRouter);
participantRouter.use('/assessment-type', assessmentTypeRouter);

module.exports = participantRouter;
