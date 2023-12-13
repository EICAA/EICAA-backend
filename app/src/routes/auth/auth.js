'use strict';

const express = require('express');

const {
  register,
  login,
  forgottenPassword,
  resetPassword,
} = require('../../controllers/auth/auth');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

router.post('/register', async (req, res, next) => {
  try {
    const { body: registrationData } = req;

    const [userId] = await register(registrationData);

    res.status(200).json({
      data: userId,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { body: loginData } = req;

    const { user, token } = await login(loginData);

    res.status(200).json({
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/forgotten-password', async (req, res, next) => {
  try {
    const {
      body: { email },
    } = req;

    await forgottenPassword(email);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { body: resetPasswordData } = req;

    await resetPassword(resetPasswordData);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
