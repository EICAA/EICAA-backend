'use strict';

const errorMessageKeys = require('./errorMessageKeys');
const Yup = require('yup');

class KnownLogicError extends Error {
  constructor({ message, messageKey /*, type*/ }) {
    super();
    this.message = message;
    this.messageKey = messageKey;
    // this.type = type;
  }
}

class ApiError extends Error {
  constructor({ status, message, messageKey }) {
    super();
    this.status = status;
    this.message = message;
    this.messageKey = messageKey;
  }
}

const API_ERRORS = {
  // 4xx
  BadRequest: (messageKey) => new ApiError({ status: 400, message: 'Bad Request', messageKey }),
  AuthenticationRequired: (messageKey) =>
    new ApiError({ status: 401, message: 'Authentication Required', messageKey }),
  Forbidden: (messageKey) => new ApiError({ status: 403, message: 'Forbidden', messageKey }),
  NotFound: (messageKey) => new ApiError({ status: 404, message: 'Not Found', messageKey }),
  // 5xx
  InternalServerError: (messageKey) =>
    new ApiError({ status: 500, message: 'Internal Server Error', messageKey }),
  NotImplemented: () => new ApiError({ status: 501, message: 'Not Implemented' }),
};

const sendErrorResponse = (res, error) => {
  let status = 500;
  let messageKey = 'internalServerError';
  let message = 'Internal server error';

  if (error instanceof ApiError) {
    const { status: errStatus, message: errMessage, messageKey: errMessageKey } = error;

    status = errStatus || status;
    message = errMessage || message;
    messageKey = errMessageKey || messageKey;
  } else if (error instanceof KnownLogicError) {
    const { message: errMessage, messageKey: errMessageKey } = error;

    status = 400;
    message = errMessage;
    messageKey = errMessageKey || errorMessageKeys.API[400];
  } else if (error instanceof Yup.ValidationError) {
    const { message: errMessage } = error;

    status = 400;
    message = 'Validation Error';
    messageKey = errMessage;
  } else {
    message = error.message || errorMessageKeys.API[500];
  }

  if (status === 500) {
    console.log(error.stack);
  }

  res.status(status);
  res.json({ message, messageKey });
};

module.exports = {
  KnownLogicError,
  ApiError,
  API_ERRORS,
  sendErrorResponse,
};
