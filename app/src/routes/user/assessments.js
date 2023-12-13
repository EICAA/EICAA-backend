'use strict';

const express = require('express');
const formidable = require('formidable');

const {
  getAssessments,
  getAssessment,
  submitAssessment,
  modifyAssessment,
  getRecentAssessmentList,
  deleteAssessment,
} = require('../../controllers/user/assessments');
const {
  getAssessmentResults,
  getSelectedAssessmentResults,
  getSelectedAssessmentResultsAsExport,
  getRecentResultsInfo,
} = require('../../controllers/user/assessmentsResults');
const { importAssessmentData } = require('../../controllers/user/assessmentsResultsImport');
const { getUser } = require('../../controllers/user/users');
const { getResultsAsCsv, getHelpFile } = require('../../services/data-export/csv/serialize');
const {
  prepareValues,
  useResultsTemplate,
} = require('../../services/data-export/spreadsheets/spreadsheet');
const { MySQL } = require('../../utils/constants');
const { getPaginationMeta } = require('../../utils/conversions');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const { assessmentType, active, findMode, limit, start } = req.query;
    const { userId } = req.ctx;

    const { count, assessments } = await getAssessments(
      userId,
      assessmentType,
      findMode,
      active,
      limit,
      start,
    );

    res.status(200).json({
      data: assessments,
      meta: getPaginationMeta(count, limit, start),
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/help/:assessmentType', async (req, res, next) => {
  try {
    const { assessmentType } = req.params;

    const file = await getHelpFile(assessmentType);

    res.status(200).type('text/csv').send(file);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/recent', async (req, res, next) => {
  try {
    const { assessmentType, days = 90 } = req.query;
    const { userId } = req.ctx;

    const results = await getRecentAssessmentList(userId, assessmentType, days);

    res.status(200).json({
      data: results,
      meta: { count: results.length },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:assessmentId', async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { userId } = req.ctx;

    const assessment = await getAssessment(userId, assessmentId);

    res.status(200).json({
      data: assessment,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.patch('/:assessmentId', async (req, res, next) => {
  try {
    const assessmentUpdate = req.body;
    const { assessmentId } = req.params;
    const { userId } = req.ctx;

    await getAssessment(userId, assessmentId);

    await modifyAssessment(assessmentId, assessmentUpdate);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.delete('/:assessmentId', async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { userId } = req.ctx;

    const assessment = await deleteAssessment(userId, assessmentId);

    res.status(200).json({
      data: assessment,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:assessmentId/results', async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { limit, start, findMode, asXlsx, asCsv } = req.query;
    const { userId } = req.ctx;

    if (asXlsx || asCsv) {
      const { results, assessment } = await getAssessmentResults(userId, assessmentId, {
        limit: MySQL.Limits.MAX_INT4,
        start: 0,
      });

      if (asXlsx) {
        const values = prepareValues({ results, assessment });
        const xlsx = await useResultsTemplate(values, assessment);

        res
          .status(200)
          .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          .send(xlsx);
        return;
      }

      if (asCsv) {
        const user = await getUser(userId);
        const csv = await getResultsAsCsv(user, assessment, results);

        res.status(200).type('text/csv').send(csv);
        return;
      }
    }

    const { count, results } = await getAssessmentResults(userId, assessmentId, {
      limit,
      start,
      findMode,
    });

    res.status(200).json({
      data: results,
      meta: getPaginationMeta(count, limit, start),
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:assessmentId/results/recent', async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { days = 90 } = req.query;
    const { userId } = req.ctx;

    const results = await getRecentResultsInfo(userId, assessmentId, days);

    res.status(200).json({
      data: results,
      meta: { count: results.length },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const assessmentData = req.body;
    const { userId } = req.ctx;

    const assessment = await submitAssessment(userId, assessmentData);

    res.status(200).json({
      data: assessment,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/filtered', async (req, res, next) => {
  try {
    const { selectedAssessmentsResults } = req.body;
    const { userId } = req.ctx;

    const results = await getSelectedAssessmentResults(userId, selectedAssessmentsResults);

    const assessmentCount = Object.keys(results || {}).length;

    res.status(200).json({
      data: results,
      meta: { count: assessmentCount },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/filtered/:format', async (req, res, next) => {
  try {
    const { selectedAssessmentsResults } = req.body;
    const { format } = req.params;
    const { userId } = req.ctx;

    const file = await getSelectedAssessmentResultsAsExport(
      userId,
      selectedAssessmentsResults,
      format,
    );

    res.status(200).type('application/zip').send(file);
    return;
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/import', async (req, res, next) => {
  try {
    const { userId } = req.ctx;

    const form = formidable({ multiples: true });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err);
        }

        resolve([fields, files]);
      });
    });

    const { assessmentData } = fields;
    const { resultsFile } = files;

    await importAssessmentData(userId, JSON.parse(assessmentData), resultsFile.filepath);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
