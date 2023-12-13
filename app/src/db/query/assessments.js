'use strict';

const getKnex = require('../config');
const { newAssessmentSchema } = require('../../utils/validate/yupSchemas/assessments');
const { getAssessmentTypesData } = require('../../services/assessmentTypesData');
const { applyWhereInFields } = require('./utils');

// TODO do this with Yup
const mapAssessment = (assessment) => {
  const mapped = {
    ...assessment,
  };

  if (assessment.availableLanguages) {
    mapped.availableLanguages = assessment.availableLanguages.join(',');
  }

  return mapped;
};

// TODO do this with Yup
const unmapAssessment = (assessment) => {
  const unmapped = {
    ...assessment,
  };

  if (assessment.availableLanguages) {
    unmapped.availableLanguages = assessment.availableLanguages.split(',');
  }

  return unmapped;
};

const setCalculatedAssessmentFields = (assessment) => {
  const assessmentMeta = {
    ...unmapAssessment(assessment),
  };

  if (!assessmentMeta.availableLanguages) {
    const { assessmentType } = assessment;

    const assessmentTypeData = getAssessmentTypesData()[assessmentType];

    if (assessmentTypeData) {
      assessmentMeta.availableLanguages = Object.keys(assessmentTypeData.assessmentTypeFiles);
    }
  }

  return assessmentMeta;
};

const findAssessments = async (where, options = {}) => {
  const knex = getKnex();

  const {
    active,
    findMode,
    count,
    limit = 100,
    offset = 0,
    now = new Date(),
    select = '*',
    orderBy = undefined,
  } = options;

  let query = knex('assessments').where(where);

  if (active == 'true') {
    query = query.andWhere((queryAnd0) => {
      queryAnd0
        .where('archived', false)
        .andWhere((queryAnd0And0) => {
          queryAnd0And0.where('activeFrom', '<=', now).orWhereNull('activeFrom');
        })
        .andWhere((queryAnd0And1) => {
          queryAnd0And1.where('activeTo', '>=', now).orWhereNull('activeTo');
        });
    });
  } else if (active == 'false') {
    query = query.andWhere((queryAnd0) => {
      queryAnd0
        .where('archived', true)
        .orWhere('activeFrom', '>', now)
        .orWhere('activeTo', '<', now);
    });
  }

  if (count) {
    query = query.count('id as count');
  } else {
    if (findMode === 'tuple') {
      query = query.select('id', 'name', 'assessmentType').offset(offset).limit(limit);
    } else {
      query = query.select(select).offset(offset).limit(limit);
    }

    if (orderBy) {
      query = query.orderBy(orderBy);
    }
  }

  return query;
};

/**
 * @param {*} where Has to be a single key object, will be used for querying by equality
 * @returns The queried Assessment
 */
const findAssessment = async (where) => {
  const knex = getKnex();

  const results = await knex('assessments').select('*').where(where);

  return results[0];
};

const findAssessmentsByLatestResult = async (options) => {
  const knex = getKnex();

  const { limitResultDate, tableName, whereIn } = options;

  let query = knex('assessments');
  query = applyWhereInFields(query, whereIn)
    .innerJoin(tableName, 'assessments.id', `${tableName}.assessmentId`)
    .select(['assessments.id', 'name'])
    .where(`${tableName}.requestedRemoval`, '=', false)
    .max(`${tableName}.createdAt as resultCreatedAt`)
    .groupBy('assessments.id')
    .having(`resultCreatedAt`, '>', limitResultDate)
    .orderBy('resultCreatedAt', 'desc');

  const results = await query;

  return results;
};

// WRITE

const createAssessment = async (assessmentInfo, schema = newAssessmentSchema) => {
  const knex = getKnex();

  const validatedAssessmentInfo = await schema.validate(assessmentInfo, {
    abortEarly: true,
    stripUnknown: true,
  });

  return knex('assessments').insert(validatedAssessmentInfo);
};

const updateAssessment = async (id, assessmentUpdate, schema) => {
  const knex = getKnex();

  const where = {
    id,
  };

  if (schema) {
    const validatedAssessmentUpdate = await schema.validate(assessmentUpdate, {
      abortEarly: true,
      stripUnknown: true,
    });

    return knex('assessments').where(where).update(validatedAssessmentUpdate);
  } else {
    return knex('assessments').where(where).update(assessmentUpdate);
  }
};

const incrementAssessmentParticipantNumber = async (assessmentId) => {
  const knex = getKnex();

  return knex('assessments').where('id', assessmentId).increment('participants', 1);
};

const disownAssessments = (userId, assessmentIds) => {
  const knex = getKnex();

  let query = knex('assessments').where({
    userId,
  });

  if (assessmentIds) {
    query = query.andWhere('id', 'in', assessmentIds);
  }

  return query.update({ userId: null, archived: true });
};

module.exports = {
  mapAssessment,
  unmapAssessment,
  setCalculatedAssessmentFields,
  findAssessments,
  findAssessment,
  findAssessmentsByLatestResult,
  createAssessment,
  updateAssessment,
  incrementAssessmentParticipantNumber,
  disownAssessments,
};
