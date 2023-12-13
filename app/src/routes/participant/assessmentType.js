'use strict';

const express = require('express');

const { getAssessmentTypeData } = require('../../controllers/participant/assessmentType');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

router.get('/:name/:language', async (req, res, next) => {
  try {
    const { name, language } = req.params;
    const assessmentTypeData = await getAssessmentTypeData(name, language);

    res.status(200).json({ data: assessmentTypeData });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
