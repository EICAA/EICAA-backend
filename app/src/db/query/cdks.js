'use strict';

const getKnex = require('../config');
const { newCdkSchema } = require('../../utils/validate/yupSchemas/cdks');
const { getWhereFilter } = require('./utils');

const findCdks = async (filters, options = {}) => {
  const knex = getKnex();

  const where = getWhereFilter(filters, ['search']);

  const { count, limit = 100, offset = 0 } = options;

  let query = knex('cdks').where(where);

  if (filters.search) {
    query = query.whereILike('name', `%${filters.search}%`);
  }

  if (count) {
    query = query.count('id as count');
  } else {
    query = query.select('*').offset(offset).limit(limit);
  }

  return query;
};

const findCdkFilterValues = async (where, fieldName) => {
  const knex = getKnex();

  const query = knex('cdks').where(getWhereFilter(where)).distinct(fieldName);

  return query;
};

const findCdk = async (where) => {
  const knex = getKnex();

  const results = await knex('cdks').select('*').where(where);

  return results[0];
};

const createCdk = async (cdkInfo) => {
  const knex = getKnex();

  const validatedCdkInfo = await newCdkSchema.validate(cdkInfo, {
    abortEarly: false,
    stripUnknown: true,
  });

  return knex('cdks').insert(validatedCdkInfo);
};

const updateCdk = async (id, cdkInfo) => {
  const knex = getKnex();

  const validatedCdkInfo = await newCdkSchema.validate(cdkInfo, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('cdks').where({ id }).update(validatedCdkInfo);
};

module.exports = {
  findCdks,
  findCdkFilterValues,
  findCdk,
  createCdk,
  updateCdk,
};
