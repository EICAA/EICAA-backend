'use strict';

const { findResult, createEmployeeResult, createStudentResult } = require('../../db/query/results');
const { getResultObjects } = require('../../services/data-export/csv/deserialize');
const { getResultsTableName } = require('../../utils/conversions');
const { API_ERRORS } = require('../../utils/errors');
const { generateRandomText } = require('../../utils/crypto');
const { submitAssessment } = require('./assessments');

const createImportedResult = async (assessment, resultData) => {
  if (assessment) {
    const { assessmentType } = assessment;

    const resultsTableName = getResultsTableName(assessmentType);

    let resultToken;

    while (!resultToken) {
      resultToken = generateRandomText(64);

      const existingResult = await findResult(resultsTableName, { resultToken });

      if (existingResult) {
        resultToken = undefined;
      }
    }

    const resultRecordData = {
      assessmentId: assessment.id,
      consentGiven: true,
      ...resultData,
      resultToken,
    };

    if (assessmentType === 'employee') {
      await createEmployeeResult(resultsTableName, resultRecordData);
    }

    if (assessmentType === 'student') {
      await createStudentResult(resultsTableName, resultRecordData);
    }

    return resultToken;
  } else {
    throw API_ERRORS.NotFound('participant.assessment.not-found');
  }
};

const importAssessmentData = async (userId, assessmentData, resultsFile) => {
  const assessmentCreated = await submitAssessment(userId, {
    ...assessmentData,
    country: 'unknown',
  });

  const resultObjects = await getResultObjects(resultsFile);

  const resultsPrepared = resultObjects.map((item) => {
    const prep = {};

    const keys = Object.keys(item);

    for (let key of keys) {
      if (key.length < 3) {
        prep[`q${key}`] = item[key];
      } else {
        prep[key] = item[key];
      }
    }

    return prep;
  });

  for (let resultData of resultsPrepared) {
    await createImportedResult(assessmentCreated, resultData);
  }
};

module.exports = {
  importAssessmentData,
};
