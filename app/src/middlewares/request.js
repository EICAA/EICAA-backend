'use strict';

const { jwtVerify, getToken } = require('../utils/crypto');
const { sendErrorResponse, API_ERRORS } = require('../utils/errors');

const setAccessControlHeadersAndHandleOptions = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);

  req.method === 'OPTIONS' ? res.sendStatus(200) : next();
};

const verifyToken = (req, res, next) => {
  const { headers } = req;

  try {
    const tokenData = jwtVerify(getToken(headers['authorization']));

    req.ctx = {
      userId: tokenData.userId,
    };

    next();
  } catch (error) {
    console.log(error);

    sendErrorResponse(res, API_ERRORS.AuthenticationRequired('auth.token-invalid'));
  }
};

module.exports = {
  setAccessControlHeadersAndHandleOptions,
  verifyToken,
};
