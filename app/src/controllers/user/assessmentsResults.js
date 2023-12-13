'use strict';

const { findAssessment } = require('../../db/query/assessments');
const { findResults, findResultsIn } = require('../../db/query/results');
const { findUser } = require('../../db/query/user');
const { getResultsAsCsv } = require('../../services/data-export/csv/serialize');
const { createAssessmentResultsZipFile } = require('../../services/data-export/zip');
const { MySQL } = require('../../utils/constants');
const { getResultsTableName } = require('../../utils/conversions');
const { getEarlierDate } = require('../../utils/datetime');
const { API_ERRORS } = require('../../utils/errors');
const { getSanitizedResult, ResultFields } = require('../../utils/validate/yupSchemas/results');

const getSelectedAssessmentResultsSanitizeOmitKeys = [
  // ...ResultFields.DEMOGRAPHY_SENSITIVE,
  ...ResultFields.MISC,
];

const sanitize = (results) =>
  results.map((result) => getSanitizedResult(result, getSelectedAssessmentResultsSanitizeOmitKeys));

const getAssessmentResults = async (userId, id, { findMode, limit, offset }) => {
  const assessment = await findAssessment({ id, userId });

  if (!assessment) {
    throw API_ERRORS.NotFound('user.assessment.not-found');
  }

  const resultsTableName = getResultsTableName(assessment.assessmentType);

  const where = { assessmentId: id, requestedRemoval: false };

  const select =
    findMode === 'compact'
      ? [
          'id',
          'createdAt',
          ...ResultFields.DEMOGRAPHY_SENSITIVE,
          ...ResultFields.DEMOGRAPHY[assessment.assessmentType],
        ]
      : '*';

  const [{ count }] = await findResults(resultsTableName, where, { count: true });
  const results = await findResults(resultsTableName, where, {
    select,
    limit,
    offset,
  });

  return { count, results: sanitize(results), assessment };
};

const getSelectedAssessmentResultsByAssessment = async (userId, selectedAssessmentsResults) => {
  const resultsByAssessment = {};

  for (let selectedAssessmentResults of selectedAssessmentsResults) {
    const { id, resultIds } = selectedAssessmentResults;

    const assessment = await findAssessment({ id, userId });

    if (!assessment) {
      throw API_ERRORS.NotFound('user.assessment.not-found');
    }

    const resultsTableName = getResultsTableName(assessment.assessmentType);

    const where = { assessmentId: id, requestedRemoval: false };

    let results;

    if (resultIds) {
      results = await findResultsIn(
        resultsTableName,
        where,
        { id: resultIds },
        {
          select: '*',
        },
      );
    } else {
      results = await findResults(resultsTableName, where, {
        select: '*',
        limit: MySQL.Limits.MAX_INT4,
        offset: 0,
      });
    }

    resultsByAssessment[id] = {
      assessment,
      results: sanitize(results),
    };
  }

  return resultsByAssessment;
};

const redactAssessmentResults = (resultsByAssessment) => {
  const assessmentIds = Object.keys(resultsByAssessment);

  for (let assessmentId of assessmentIds) {
    const results = resultsByAssessment[assessmentId].results;

    resultsByAssessment[assessmentId].results = redactResults(results);
  }
};

const redactResults = (resultsByAssessment, keepIfGreater = 1) => {
  const resultsByGender = resultsByAssessment.reduce((acc, result) => {
    const gender = result.gender || 'unspecified';

    if (!acc[gender]) {
      acc[gender] = [];
    }

    acc[gender].push(result);

    return acc;
  }, {});

  const redactedResults = [];

  const genders = Object.keys(resultsByGender);

  for (let gender of genders) {
    if (resultsByGender[gender].length > keepIfGreater) {
      redactedResults.push(...resultsByGender[gender]);
    }
  }

  return redactedResults;
};

const getSelectedAssessmentResults = async (userId, selectedAssessmentsResults) => {
  const resultsByAssessment = await getSelectedAssessmentResultsByAssessment(
    userId,
    selectedAssessmentsResults,
  );
  redactAssessmentResults(resultsByAssessment);

  return resultsByAssessment;
};

const getSelectedAssessmentResultsAsExport = async (userId, selectedAssessmentsResults, format) => {
  const resultsByAssessment = await getSelectedAssessmentResultsByAssessment(
    userId,
    selectedAssessmentsResults,
  );
  redactAssessmentResults(resultsByAssessment);

  const user = await findUser({ id: userId });

  let exported;

  if (format === 'csv') {
    const files = [];

    const values = Object.values(resultsByAssessment);

    for (let item of values) {
      const { assessment, results } = item;
      const csvFile = await getResultsAsCsv(user, assessment, results);
      files.push({
        data: csvFile,
        name: `eicaa-assessment-${assessment.id}-results.csv`,
      });
    }

    exported = await createAssessmentResultsZipFile(files);
  }

  return exported;
};

const getRecentResultsInfo = async (userId, id, days) => {
  const assessment = await findAssessment({ id, userId });

  if (!assessment) {
    throw API_ERRORS.NotFound('user.assessment.not-found');
  }

  const resultsTableName = getResultsTableName(assessment.assessmentType);

  const limitResultDate = getEarlierDate(new Date(), days);

  const where = { assessmentId: id, createdAt: ['>', limitResultDate], requestedRemoval: false };

  const results = await findResults(resultsTableName, where, {
    select: ['createdAt'],
    limit: MySQL.Limits.MAX_INT4,
    orderBy: { createdAt: 'desc' },
  });

  return results;
};

// ADMIN

const getAssessmentResultsForAdmin = async (id) => {
  const assessment = await findAssessment({ id });

  if (!assessment) {
    throw API_ERRORS.NotFound('user.assessment.not-found');
  }

  const user = await findUser({ id: assessment.userId });

  const resultsTableName = getResultsTableName(assessment.assessmentType);

  const where = { assessmentId: id, requestedRemoval: false };

  const results = await findResults(resultsTableName, where, {
    select: '*',
    limit: MySQL.Limits.MAX_INT4,
    offset: 0,
  });

  return { assessment, results, user };
};

module.exports = {
  getAssessmentResults,
  getSelectedAssessmentResults,
  getSelectedAssessmentResultsAsExport,
  getRecentResultsInfo,
  getAssessmentResultsForAdmin,
};
