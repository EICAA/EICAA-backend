'use strict';

const getKnex = require('../config');
const { newRatingSchema, ratingUpdateSchema } = require('../../utils/validate/yupSchemas/ratings');

const findRatingsSummary = async (cdkId) => {
  const knex = getKnex();

  const query = knex('ratings')
    .where({ cdkId })
    .avg({
      helpfulness: 'helpfulness',
      trainingResults: 'trainingResults',
      easeOfUse: 'easeOfUse',
      interactivity: 'interactivity',
    })
    .count({ count: 'id' });

  const results = await query;

  return results[0];
};

const findRating = async (cdkId, userId) => {
  const knex = getKnex();

  const results = await knex('ratings').where({ cdkId, userId });

  return results[0];
};

const createRating = async (ratingInfo) => {
  const knex = getKnex();

  const validatedRatingInfo = await newRatingSchema.validate(ratingInfo, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('ratings').insert(validatedRatingInfo);
};

const updateRating = async (id, ratingUpdate) => {
  const knex = getKnex();

  const where = {
    id,
  };

  const validatedRatingUpdate = await ratingUpdateSchema.validate(ratingUpdate, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('ratings').where(where).update(validatedRatingUpdate);
};

module.exports = {
  findRatingsSummary,
  findRating,
  createRating,
  updateRating,
};
