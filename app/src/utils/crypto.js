'use strict';

const { createHash, randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');

const JwtSignOptions = {
  algorithm: 'HS256', //'HS384',
  expiresIn: '28d',
};

const JwtVerifyOptions = {
  algorithms: ['HS256', 'HS384'],
};

// NOTICE
/*
  It can be beneficial to set and validate issuer and audience
*/

const generateRandomHexText = (length) => {
  return randomBytes(length).toString('hex');
};

const generateRandomText = (length) => {
  return randomBytes(length).toString('base64url');
};

const passwordHash = (raw) => {
  const hash = createHash('sha256');

  hash.update(`${raw}${process.env.PW_SALT}`);

  const hashed = hash.digest('base64url');

  return hashed;
};

const jwtUserSign = (userData) => {
  const { id } = userData;

  return jwt.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    JwtSignOptions,
  );
};

const jwtSign = (userData, overrideJwtOptions = {}) => {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    ...JwtSignOptions,
    ...overrideJwtOptions,
  });
};

const jwtVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, JwtVerifyOptions);
};

const getToken = (authHeader) => {
  if (authHeader && authHeader.length) {
    const parts = authHeader.split(/\s+/);

    if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
      return null;
    }

    return parts[1];
  }
};

module.exports = {
  generateRandomText,
  generateRandomHexText,
  passwordHash,
  jwtSign,
  jwtUserSign,
  jwtVerify,
  getToken,
};
