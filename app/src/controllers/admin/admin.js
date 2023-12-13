'use strict';

const { findAssessments } = require('../../db/query/assessments');
const { getResultsAsCsv } = require('../../services/data-export/csv/serialize');
const { createAssessmentResultsZipFile } = require('../../services/data-export/zip');
const { MySQL } = require('../../utils/constants');
const { jwtSign, jwtVerify } = require('../../utils/crypto');
const { sendAdminAccessInfo } = require('../../utils/email/index');
const { API_ERRORS } = require('../../utils/errors');
const { getAssessmentResultsForAdmin } = require('../user/assessmentsResults');

const ADMIN_WHITELIST = (process.env.ADMIN_WHITELIST || '').split(',');

const LINK_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours

const sendEmailLink = async (email) => {
  console.log(ADMIN_WHITELIST);
  console.log(`${email} is in whitelist: ${ADMIN_WHITELIST.includes(email)}`);
  if (!ADMIN_WHITELIST.includes(email)) {
    throw API_ERRORS.BadRequest('auth.failed-to-auth');
  }

  const signed = Date.now();
  const jwt = jwtSign({ email, signed });

  await sendAdminAccessInfo({ email, jwt });
};

const getData = async (jwt) => {
  const { email, signed } = jwtVerify(jwt);

  if (!ADMIN_WHITELIST.includes(email) || Date.now() - LINK_EXPIRY > signed) {
    console.log(Date.now() - LINK_EXPIRY, signed);
    throw API_ERRORS.BadRequest('auth.failed-to-auth');
  }

  // GET DATA

  const assessmentList = await findAssessments(
    {},
    {
      limit: MySQL.Limits.MAX_INT4,
      select: 'id',
      orderBy: [
        { column: 'userId', order: 'asc' },
        { column: 'id', order: 'asc' },
      ],
    },
  );

  const files = [];

  for (let assessmentItem of assessmentList) {
    const { assessment, results, user } = await getAssessmentResultsForAdmin(assessmentItem.id);

    const csvFile = await getResultsAsCsv(user, assessment, results);

    files.push({
      data: csvFile,
      name: `eicaa-assessment-u-${user ? user.id : 'unknown'}-a-${assessment.id}-results.csv`,
    });
  }

  const exported = await createAssessmentResultsZipFile(files);

  return exported;
};

module.exports = {
  sendEmailLink,
  getData,
};
