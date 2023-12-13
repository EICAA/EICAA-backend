'use strict';

const express = require('express');

const { getRecentResultsInfo } = require('../../controllers/user/assessmentsResults');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

/*router.post('/filtered', async (req, res, next) => {
  try {
    const { assessmentType, assessmentIds, resultIds } = req.body;
    const { userId } = req.ctx;

    const results = await getFilteredResults(userId, assessmentType, assessmentIds, resultIds);

    res.status(200).json({
      data: results,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});*/

router.post('/recent', async (req, res, next) => {
  try {
    const { assessmentIds, days = 90 } = req.body;
    const { userId } = req.ctx;

    const results = {};

    for (let assessmentId of assessmentIds) {
      const assessmentResults = await getRecentResultsInfo(userId, assessmentId, days);

      results[assessmentId] = assessmentResults;
    }

    res.status(200).json({
      data: results,
      // meta: { count: results.length },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
