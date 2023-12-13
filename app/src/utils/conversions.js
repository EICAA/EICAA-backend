const getPaginationMeta = (count, limit, start) => {
  return {
    count,
    limit: Number.parseInt(limit),
    start: Number.parseInt(start),
  };
};

const getResultsTableName = (assessmentType) => {
  return `results_for_${assessmentType}`;
};

const isTruthyEnv = (value) => {
  if (value && value.toLowerCase() !== 'false' && value.toLowerCase() !== '0') {
    return true;
  }

  return false;
};

module.exports = {
  getPaginationMeta,
  getResultsTableName,
  isTruthyEnv,
};
