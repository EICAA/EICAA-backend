'use strict';

const {
  findAssessments,
  findAssessment,
  createAssessment,
  updateAssessment,
  mapAssessment,
  setCalculatedAssessmentFields,
  findAssessmentsByLatestResult,
  disownAssessments,
} = require('../../db/query/assessments');
const { MySQL } = require('../../utils/constants');
const { getResultsTableName } = require('../../utils/conversions');
const { generateRandomText } = require('../../utils/crypto');
const { getEarlierDate } = require('../../utils/datetime');
const { API_ERRORS } = require('../../utils/errors');
const { assessmentUpdateSchema } = require('../../utils/validate/yupSchemas/assessments');

const getAssessments = async (userId, assessmentType, findMode, active, limit, offset) => {
  const where = { userId };

  if (assessmentType) {
    where.assessmentType = assessmentType;
  }

  const options = { active, findMode, now: new Date() };

  const [{ count }] = await findAssessments(where, { ...options, count: true });
  let assessments = await findAssessments(where, {
    ...options,
    limit,
    offset,
  });

  if (findMode !== 'tuple') {
    assessments.map(setCalculatedAssessmentFields);
  }

  return { count, assessments };
};

const getAssessment = async (userId, id) => {
  const assessment = await findAssessment({ id, userId });

  if (assessment) {
    return setCalculatedAssessmentFields(assessment);
  } else {
    throw API_ERRORS.NotFound('user.assessment.not-found');
  }
};

const getRecentAssessmentList = async (userId, assessmentType, days) => {
  const assessments = await findAssessments(
    { userId, assessmentType },
    {
      select: 'id',
      limit: MySQL.Limits.MAX_INT4,
    },
  );

  const assessmentIds = assessments.map((item) => item.id);

  const tableName = getResultsTableName(assessmentType);

  const limitResultDate = getEarlierDate(new Date(), days);

  const assessmentsFound = await findAssessmentsByLatestResult({
    limitResultDate,
    tableName,
    whereIn: { assessmentId: assessmentIds },
  });

  return assessmentsFound;
};

// WRITE

const submitAssessment = async (userId, assessmentData) => {
  let hash;
  let existingAssessment = {};

  while (existingAssessment) {
    hash = generateRandomText(16);

    existingAssessment = await findAssessment({ hash });
  }

  const assessmentInfo = mapAssessment({ ...assessmentData, hash, userId });

  const result = await createAssessment(assessmentInfo);

  const assessment = await findAssessment({ id: result[0], userId });

  if (assessment) {
    return setCalculatedAssessmentFields(assessment);
  } else {
    // should not happen
    throw API_ERRORS.NotFound('user.assessment.not-found');
  }
};

const modifyAssessment = async (id, assessmentUpdate) => {
  return updateAssessment(id, assessmentUpdate, assessmentUpdateSchema);
};

const deleteAssessment = async (userId, id) => {
  return disownAssessments(userId, [id]);
};

module.exports = {
  getAssessments,
  getAssessment,
  getRecentAssessmentList,
  submitAssessment,
  modifyAssessment,
  deleteAssessment,
};
