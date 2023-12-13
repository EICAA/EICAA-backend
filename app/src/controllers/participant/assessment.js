'use strict';

const {
  findResult,
  createEmployeeResult,
  createStudentResult,
  updateResult,
} = require('../../db/query/results');
const {
  findAssessment,
  incrementAssessmentParticipantNumber,
  setCalculatedAssessmentFields,
} = require('../../db/query/assessments');
const { mapAnswers } = require('../../services/assessmentTypesData');
const { getResultsTableName } = require('../../utils/conversions');
const { API_ERRORS } = require('../../utils/errors');
const { generateRandomText } = require('../../utils/crypto');

const findByIdOrHash = async (idOrHash) => {
  const where = idOrHash.length > 11 ? { hash: idOrHash } : { id: idOrHash, hash: null };

  return findAssessment(where);
};

const getAssessment = async (idOrHash) => {
  const assessment = await findByIdOrHash(idOrHash);

  if (assessment) {
    return setCalculatedAssessmentFields(assessment);
  } else {
    throw API_ERRORS.NotFound('participant.assessment.not-found');
  }
};

const submitResult = async (idOrHash, resultData) => {
  const assessment = await findByIdOrHash(idOrHash);

  if (assessment) {
    const {
      assessmentType,
      participants,
      maxParticipants,
      activeFrom,
      activeTo,
      archived,
      emailRequired,
    } = assessment;

    const resultsTableName = getResultsTableName(assessmentType);

    const now = Date.now();

    if (
      archived ||
      (activeFrom && now - activeFrom.getTime() < 0) ||
      (activeTo && now - activeTo.getTime() > 0)
    ) {
      throw API_ERRORS.BadRequest('participant.assessment.not-active');
    }

    // Now relying on the maintained participants field
    /*const { count } = await findResults(
      resultsTableName,
      {
        assessmentId: assessment.id,
      },
      { count: true },
    );*/

    if (maxParticipants > 0 && participants >= maxParticipants) {
      throw API_ERRORS.BadRequest('participant.assessment.max-participants-reached');
    }

    const { landingFormData, demographicsFormData, answers, metrics, language } = resultData;
    const { consentGiven, email } = landingFormData;
    const { start, end, durationSeconds } = metrics || {};

    if (emailRequired) {
      // Should not encounter, because default to false (as of 2022.11.04.)
      if (!email) {
        throw API_ERRORS.BadRequest('participant.assessment.email-required');
      }

      const resultByEmail = await findResult(resultsTableName, {
        assessmentId: assessment.id,
        email,
      });

      if (resultByEmail) {
        throw API_ERRORS.BadRequest('participant.assessment.already-submitted');
      }
    }

    let resultToken;

    while (!resultToken) {
      resultToken = generateRandomText(64);

      const existingResult = await findResult(resultsTableName, { resultToken });

      if (existingResult) {
        resultToken = undefined;
      }
    }

    const mappedAnswers = mapAnswers(answers);

    const resultRecordData = {
      assessmentId: assessment.id,
      consentGiven,
      email,
      ...demographicsFormData,
      ...mappedAnswers,
      resultToken,
      start,
      end,
      durationSeconds,
      language,
    };

    if (assessmentType === 'employee') {
      await createEmployeeResult(resultsTableName, resultRecordData);
    }

    if (assessmentType === 'student') {
      await createStudentResult(resultsTableName, resultRecordData);
    }

    await incrementAssessmentParticipantNumber(assessment.id);

    return resultToken;
  } else {
    throw API_ERRORS.NotFound('participant.assessment.not-found');
  }
};

const submitFeedback = async (idOrHash, resultToken, feedbackData) => {
  const assessment = await findByIdOrHash(idOrHash);

  if (assessment) {
    const resultsTableName = getResultsTableName(assessment.assessmentType);

    const result = await findResult(resultsTableName, { resultToken });

    if (result) {
      const { feedbackScore, feedbackText } = feedbackData;
      await updateResult(resultsTableName, result.id, { feedbackScore, feedbackText });
    } else {
      throw API_ERRORS.NotFound('participant.result.invalid-result-token');
    }
  } else {
    throw API_ERRORS.NotFound('participant.assessment.not-found');
  }
};

const requestRemoval = async (idOrHash, resultToken) => {
  const assessment = await findByIdOrHash(idOrHash);

  if (assessment) {
    const resultsTableName = getResultsTableName(assessment.assessmentType);

    const result = await findResult(resultsTableName, { resultToken });

    if (result) {
      await updateResult(resultsTableName, result.id, { requestedRemoval: true });
    } else {
      throw API_ERRORS.NotFound('participant.result.invalid-result-token');
    }
  } else {
    throw API_ERRORS.NotFound('participant.assessment.not-found');
  }
};

module.exports = {
  getAssessment,
  submitResult,
  submitFeedback,
  requestRemoval,
};
