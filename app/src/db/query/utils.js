const getWhereFilter = (where, keysToExclude = []) => {
  const whereEntries = Object.entries(where);

  return whereEntries.reduce((acc, [key, value]) => {
    if (value !== undefined && !keysToExclude.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const applyComplexWhere = (query, where) => {
  let appliedQuery = query;

  const entries = Object.entries(where);

  for (let [key, value] of entries) {
    if (Array.isArray(value)) {
      appliedQuery = appliedQuery.andWhere(key, value[0], value[1]);
    } else {
      appliedQuery = appliedQuery.andWhere(key, '=', value);
    }
  }

  return appliedQuery;
};

const applyWhereInFields = (query, whereIn) => {
  let appliedQuery = query;

  const entries = Object.entries(whereIn);

  for (let idx = 0; idx < entries.length; idx++) {
    const [whereInField, whereInValues] = entries[idx];

    if (whereInValues) {
      appliedQuery = appliedQuery.andWhere(whereInField, 'in', whereInValues);
    }
  }

  return appliedQuery;
};

const applyOrderBy = (query, orderBy) => {
  let appliedQuery = query;

  if (orderBy) {
    const entries = Object.entries(orderBy);

    for (let [field, direction = null] of entries) {
      appliedQuery = appliedQuery.orderBy(field, direction || 'asc'); // 'last'
    }
  }

  return appliedQuery;
};

module.exports = {
  getWhereFilter,
  applyComplexWhere,
  applyWhereInFields,
  applyOrderBy,
};
