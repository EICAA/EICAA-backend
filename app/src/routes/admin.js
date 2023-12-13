'use strict';

const express = require('express');

const { sendEmailLink, getData } = require('../controllers/admin/admin');
const { sendErrorResponse } = require('../utils/errors');

const router = express.Router({ mergeParams: true });

router.post('/request-email-link', async (req, res, next) => {
  try {
    const {
      body: { email },
    } = req;

    await sendEmailLink(email);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/get-data', async (req, res, next) => {
  try {
    const {
      body: { jwt },
    } = req;

    const file = await getData(jwt);

    res.status(200).type('application/zip').send(file);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
