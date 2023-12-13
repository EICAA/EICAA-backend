'use strict';

const express = require('express');

const {
  getAssessment,
  submitResult,
  submitFeedback,
  requestRemoval,
} = require('../../controllers/participant/assessment');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

router.get('/:idOrHash', async (req, res, next) => {
  try {
    const { idOrHash } = req.params;
    const assessment = await getAssessment(idOrHash);

    res.status(200).json({ data: assessment });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/:idOrHash/result', async (req, res, next) => {
  try {
    const { idOrHash } = req.params;
    const resultData = req.body;

    const resultToken = await submitResult(idOrHash, resultData);

    res.status(200).json({
      data: {
        resultToken,
      },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/:idOrHash/result/:resultToken/feedback', async (req, res, next) => {
  try {
    const { idOrHash, resultToken } = req.params;
    const feedbackData = req.body;

    await submitFeedback(idOrHash, resultToken, feedbackData);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.delete('/:idOrHash/result/:resultToken', async (req, res, next) => {
  try {
    const { idOrHash, resultToken } = req.params;

    await requestRemoval(idOrHash, resultToken);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
