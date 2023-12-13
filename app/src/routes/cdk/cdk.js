const express = require('express');

const {
  getCdks,
  getCdk,
  getCdkFilterValues,
  getRatingsSummary,
  getMyRating,
  submitRating,
} = require('../../controllers/cdk/cdks');
const { getPaginationMeta } = require('../../utils/conversions');
const { sendErrorResponse } = require('../../utils/errors');
const { verifyToken } = require('../../middlewares/request');

const router = express.Router({ mergeParams: true });

router.get('/:cdkType', async (req, res, next) => {
  try {
    const { cdkType } = req.params;
    const { limit, start, ...queryFilters } = req.query;

    const { count, cdks } = await getCdks(cdkType, queryFilters, limit, start);

    res.status(200).json({
      data: cdks,
      meta: getPaginationMeta(count, limit, start),
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:cdkType/:jsonId', async (req, res, next) => {
  try {
    const { cdkType, jsonId } = req.params;

    const cdk = await getCdk(cdkType, jsonId);

    res.status(200).json({
      data: cdk,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:cdkType/values/:fieldName', async (req, res, next) => {
  try {
    const { cdkType, fieldName } = req.params;
    const { area } = req.query;

    const values = await getCdkFilterValues(cdkType, fieldName, area);

    res.status(200).json({
      data: values,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:cdkType/:jsonId/ratings', async (req, res, next) => {
  try {
    const { cdkType, jsonId } = req.params;

    const ratingsSummary = await getRatingsSummary(cdkType, jsonId);

    res.status(200).json({
      data: ratingsSummary,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.get('/:cdkType/:jsonId/rating', verifyToken, async (req, res, next) => {
  try {
    const { cdkType, jsonId } = req.params;
    const { userId } = req.ctx;

    const myRating = await getMyRating(userId, cdkType, jsonId);

    res.status(200).json({
      data: myRating,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.post('/:cdkType/:jsonId/rating', verifyToken, async (req, res, next) => {
  try {
    const { cdkType, jsonId } = req.params;
    const ratingData = req.body;
    const { userId } = req.ctx;

    const [ratingId] = await submitRating(userId, cdkType, jsonId, ratingData);

    res.status(200).json({
      data: ratingId,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
