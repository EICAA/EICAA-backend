const { findCdks, findCdk, findCdkFilterValues } = require('../../db/query/cdks');
const {
  findRatingsSummary,
  createRating,
  findRating,
  updateRating,
} = require('../../db/query/ratings');
const { API_ERRORS } = require('../../utils/errors');

const getCdks = async (cdkType, queryFilters, limit, offset) => {
  const filters = { cdkType, ...queryFilters };

  const [{ count }] = await findCdks(filters, { count: true });
  let cdks = await findCdks(filters, {
    limit,
    offset,
  });

  return { count, cdks };
};

const getCdk = async (cdkType, jsonId) => {
  let cdk = await findCdk({ cdkType, jsonId });

  if (cdk) {
    return cdk;
  } else {
    throw API_ERRORS.NotFound('cdk.module.not-found');
  }
};

const getCdkFilterValues = async (cdkType, fieldName, area) => {
  const where = { cdkType, area };

  const result = await findCdkFilterValues(where, fieldName);

  return result.map((item) => item[fieldName]);
};

const getRatingsSummary = async (cdkType, jsonId) => {
  const cdk = await findCdk({ cdkType, jsonId });

  if (cdk) {
    return findRatingsSummary(cdk.id);
  } else {
    throw API_ERRORS.NotFound('participant.cdk.not-found');
  }
};

const getMyRating = async (userId, cdkType, jsonId) => {
  const cdk = await findCdk({ cdkType, jsonId });

  if (cdk) {
    return findRating(cdk.id, userId);
  }
};

const submitRating = async (userId, cdkType, jsonId, ratingData) => {
  const cdk = await findCdk({ cdkType, jsonId });

  if (cdk) {
    const existingRating = await findRating(cdk.id, userId);

    if (existingRating) {
      await updateRating(existingRating.id, ratingData);

      return [existingRating.id];
    } else {
      return createRating({ userId, cdkId: cdk.id, ...ratingData });
    }
  } else {
    throw API_ERRORS.NotFound('participant.cdk.not-found');
  }
};

module.exports = {
  getCdks,
  getCdk,
  getCdkFilterValues,
  getRatingsSummary,
  getMyRating,
  submitRating,
};
