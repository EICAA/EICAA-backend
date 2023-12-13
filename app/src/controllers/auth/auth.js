'use strict';

const {
  createUser,
  getUserByEmail,
  getUserByResetPasswordToken,
  updateUser,
} = require('../../db/query/user');
const { generateRandomText, passwordHash, jwtUserSign } = require('../../utils/crypto');
const { sendResetPasswordUrl } = require('../../utils/email/index');
const { API_ERRORS } = require('../../utils/errors');
const { getSanitizedUser } = require('../../utils/validate/yupSchemas/users');

const login = async (loginData) => {
  const { email, password } = loginData;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw API_ERRORS.BadRequest('auth.failed-to-auth');
  }

  if (existingUser.deleted) {
    throw API_ERRORS.Forbidden('auth.user-deleted');
  }

  const entered = passwordHash(password);

  if (entered === existingUser.password) {
    return {
      token: jwtUserSign(existingUser),
      user: getSanitizedUser(existingUser),
    };
  } else {
    throw API_ERRORS.BadRequest('auth.failed-to-auth');
  }
};

const register = async (registrationData) => {
  const { email, password } = registrationData;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw API_ERRORS.BadRequest('auth.user-already-exists');
  }

  const newUser = await createUser({
    ...registrationData,
    password: passwordHash(password), // TODO implement!
  });

  return newUser;
};

const forgottenPassword = async (email) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return true; // Silently fail to protect user information
  }

  if (existingUser.deleted) {
    throw API_ERRORS.Forbidden('auth.user-deleted');
  }

  const resetPasswordToken = generateRandomText(64);

  await updateUser(existingUser.id, {
    resetPasswordToken,
  });

  await sendResetPasswordUrl(existingUser, resetPasswordToken);

  return true;
};

const resetPassword = async (resetPasswordData) => {
  const { token, newPassword } = resetPasswordData;

  const existingUser = await getUserByResetPasswordToken(token);

  if (!existingUser) {
    throw API_ERRORS.BadRequest('auth.invalid-reset-password-token');
  }

  if (existingUser.deleted) {
    throw API_ERRORS.Forbidden('auth.user-deleted');
  }

  await updateUser(existingUser.id, {
    resetPasswordToken: null,
    password: passwordHash(newPassword),
  });

  return true;
};

module.exports = {
  login,
  register,
  forgottenPassword,
  resetPassword,
};
