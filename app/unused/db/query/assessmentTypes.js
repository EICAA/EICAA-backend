'use strict';

const getKnex = require('../config');
const { newAssessmentTypeSchema } = require('../../utils/validate/yupSchemas/assessmentType');

const findAssessmentType = async (name) => {
  const knex = getKnex();

  const assessmentType = await knex('assessment_types').select('*').where({
    query: {
      name,
    },
  });

  return assessmentType;
};

const createAssessmentType = async (assessmentTypeInfo) => {
  const knex = getKnex();

  const validatedAssessmentTypeInfo = newAssessmentTypeSchema.validate(assessmentTypeInfo, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('assessment_types').insert(validatedAssessmentTypeInfo);
};

module.exports = {
  findAssessmentType,
  createAssessmentType,
};
