'use strict';

const getKnex = require('../config');
const { newUserSchema } = require('../../utils/validate/yupSchemas/users');

const getUserByEmail = async (email) => {
  const knex = getKnex();

  const results = await knex('users').select('*').where({
    email,
  });

  return results[0];
};

const getUserByResetPasswordToken = async (resetPasswordToken) => {
  const knex = getKnex();

  const results = await knex('users').select('*').where({
    resetPasswordToken,
  });

  return results[0];
};

const findUser = async (where) => {
  const knex = getKnex();

  const results = await knex('users').select('*').where(where);

  return results[0];
};

const createUser = async (userData) => {
  const knex = getKnex();

  const validatedUserData = await newUserSchema.validate(userData, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('users').insert(validatedUserData);
};

const updateUser = async (id, userUpdate, schema) => {
  const knex = getKnex();

  if (schema) {
    const validatedUserUpdate = await schema.validate(userUpdate, {
      abortEarly: true,
      stripUnknown: true,
    });

    return knex('users').where('id', id).update(validatedUserUpdate);
  } else {
    return knex('users').where('id', id).update(userUpdate);
  }
};

module.exports = {
  getUserByEmail,
  getUserByResetPasswordToken,
  findUser,
  createUser,
  updateUser,
};
