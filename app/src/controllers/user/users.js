'use strict';

const { disownAssessments } = require('../../db/query/assessments');
const { findUser, updateUser } = require('../../db/query/user');
const { passwordHash } = require('../../utils/crypto');
const { API_ERRORS } = require('../../utils/errors');
const {
  modifiedUserSchema,
  modifiedUserPasswordSchema,
  getSanitizedUser,
} = require('../../utils/validate/yupSchemas/users');

const getUserWithChecks = async (id) => {
  const existingUser = await findUser({ id });

  if (!existingUser) {
    throw API_ERRORS.BadRequest('user.not-exists');
  }

  if (existingUser.deleted) {
    throw API_ERRORS.BadRequest('auth.user-deleted');
  }

  return existingUser;
};

const getUser = async (id) => {
  return getSanitizedUser(await getUserWithChecks(id));
};

const modifyUser = async (id, userUpdate) => {
  await getUserWithChecks(id);

  await updateUser(id, userUpdate, modifiedUserSchema);

  return getSanitizedUser(await findUser({ id }));
};

const changePassword = async (id, changePasswordData) => {
  const { password, newPassword } = changePasswordData;

  const existingUser = await getUserWithChecks(id);

  if (!existingUser) {
    throw API_ERRORS.BadRequest('user.not-exists');
  }

  const entered = passwordHash(password);

  if (!(entered === existingUser.password)) {
    throw API_ERRORS.BadRequest('user.password-invalid');
  }

  return updateUser(id, { password: passwordHash(newPassword) }, modifiedUserPasswordSchema);
};

const deleteUser = async (id) => {
  await getUserWithChecks(id);

  await disownAssessments(id);

  return updateUser(id, { deleted: true });
};

module.exports = {
  getUser,
  modifyUser,
  changePassword,
  deleteUser,
};
