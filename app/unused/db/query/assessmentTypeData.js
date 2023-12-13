'use strict';

const getKnex = require('../config');
const {
  newAssessmentTypeDataSchema,
} = require('../../utils/validate/yupSchemas/assessmentTypeData');

const findAssessmentTypeDataOf = async (name) => {
  const knex = getKnex();

  const assessmentTypeData = await knex('assessment_type_data')
    .select('*')
    .where({
      query: {
        assessmentType: name,
      },
    });

  return assessmentTypeData;
};

const createAssessmentTypeData = async (assessmentTypeDataInfo) => {
  const knex = getKnex();

  const validatedAssessmentTypeDataInfo = newAssessmentTypeDataSchema.validate(
    assessmentTypeDataInfo,
    {
      abortEarly: true,
      stripUnknown: true,
    },
  );

  return knex('assessment_type_data').insert(validatedAssessmentTypeDataInfo);
};

module.exports = {
  findAssessmentTypeDataOf,
  createAssessmentTypeData,
};
