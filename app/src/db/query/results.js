'use strict';

const getKnex = require('../config');
const {
  newEmployeeResultSchema,
  newStudentResultSchema,
  updateResultSchema,
} = require('../../utils/validate/yupSchemas/results');
const { applyWhereInFields, applyOrderBy, applyComplexWhere } = require('./utils');

const findResult = async (tableName, where) => {
  const knex = getKnex();

  const results = await knex(tableName).select('*').where(where);

  return results[0];
};

const findResults = async (tableName, where, options = {}) => {
  const knex = getKnex();

  const { count, select = '*', limit = 100, offset = 0, orderBy } = options;

  let query = knex(tableName);

  query = applyComplexWhere(query, where);

  if (count) {
    query = query.count('id as count');
  } else {
    query = query.select(select).offset(offset).limit(limit);

    if (orderBy) {
      query = applyOrderBy(query, orderBy);
    }
  }

  return query;
};

const findResultsIn = async (tableName, where, whereIn, options) => {
  const knex = getKnex();

  const { select = '*', orderBy } = options; // distinct ?

  let query = knex(tableName); // .where(where);

  if (where) {
    query = query.where(where);
  }

  if (whereIn) {
    query = applyWhereInFields(query, whereIn);
  }

  if (orderBy) {
    query = applyOrderBy(orderBy);
  }

  return query.select(select);
};

// Write

const createEmployeeResult = async (tableName, resultData) => {
  const knex = getKnex();

  const validatedResultData = await newEmployeeResultSchema.validate(resultData, {
    abortEarly: true,
    stripUnknown: false,
  });

  return knex(tableName).insert(validatedResultData);
};

const createStudentResult = async (tableName, resultData) => {
  const knex = getKnex();

  const validatedResultData = await newStudentResultSchema.validate(resultData, {
    abortEarly: true,
    stripUnknown: false,
  });

  return knex(tableName).insert(validatedResultData);
};

const updateResult = async (tableName, id, resultUpdate) => {
  const knex = getKnex();

  const validatedResultUpdate = await updateResultSchema.validate(resultUpdate, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex(tableName).where('id', id).update(validatedResultUpdate);
};

module.exports = {
  findResult,
  findResults,
  findResultsIn,
  createEmployeeResult,
  createStudentResult,
  updateResult,
};
