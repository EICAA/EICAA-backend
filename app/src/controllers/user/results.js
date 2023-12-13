'use strict';

const { findAssessments } = require('../../db/query/assessments');
const { findResultsIn } = require('../../db/query/results');
const { MySQL } = require('../../utils/constants');
const { getResultsTableName } = require('../../utils/conversions');

/* const toIdMap = (collection) => {
  return collection.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});
}; */

// Deprecated, using getSelectedAssessmentResultsByAssessment instead
/* const getFilteredResults = async (userId, assessmentType, assessmentIds, resultIds) => {
  const resultsTableName = getResultsTableName(assessmentType);

  let usedAssessmentIds;
  let usedResultIds;

  const ownAssessmentIds = await findAssessments(
    { userId },
    { select: 'id', limit: MySQL.Limits.MAX_INT4 },
  );

  if (assessmentIds) {
    const ownAssessmentIdsMap = toIdMap(ownAssessmentIds);

    usedAssessmentIds = assessmentIds.filter((id) => ownAssessmentIdsMap[id]);
  }

  if (resultIds) {
    const ownResultIds = await findResultsIn(resultsTableName, undefined, {
      assessmentId: ownAssessmentIds,
    });

    const ownResultIdsMap = toIdMap(ownResultIds);

    usedResultIds = resultIds.filter((id) => ownResultIdsMap[id]);
  }

  const whereIn = {};

  if (usedResultIds && usedResultIds.length) {
    whereIn.id = usedResultIds;
  }

  if (usedAssessmentIds && usedAssessmentIds.length) {
    whereIn.assessmentId = usedAssessmentIds;
  }

  return findResultsIn(resultsTableName, undefined, whereIn);
};*/

module.exports = {
  // getFilteredResults,
};
