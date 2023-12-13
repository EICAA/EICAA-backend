'use strict';

const { createUsersTableIfNotExists, dropUsersTableIfExists } = require('../db/schema/User');
const {
  createAssessmentsTableIfNotExists,
  dropAssessmentsTableIfExists,
} = require('../db/schema/Assessment');
const { createResultsTableIfNotExists, dropResultsTableIfExists } = require('../db/schema/Result');
const { createCdksTableIfNotExists, dropCdksTableIfExists } = require('../db/schema/Cdk');
const { createRatingsTableIfNotExists, dropRatingsTableIfExists } = require('../db/schema/Rating');

const initializeDatabase = async (assessmentTypesData, dry = false) => {
  try {
    console.log(`[app-startup] ${dry ? 'DRY ' : ''}db check/initialize started`);

    await createUsersTableIfNotExists(dry);
    await createAssessmentsTableIfNotExists(dry);

    const assessmentTypeNames = Object.keys(assessmentTypesData);

    for (let assessmentTypeName of assessmentTypeNames) {
      const assessmentTypeData = assessmentTypesData[assessmentTypeName];

      const questionColumnNames = Object.values(assessmentTypeData.columnsMapping);

      await createResultsTableIfNotExists(assessmentTypeName, questionColumnNames, dry);
    }

    await createCdksTableIfNotExists(dry);
    await createRatingsTableIfNotExists(dry);
  } catch (error) {
    console.log('Error during database initialization');
    console.log(error.stack);
  }
};

const resetDatabase = async (assessmentTypesData, dry = false) => {
  try {
    console.log(`[app-startup] ${dry ? 'DRY ' : ''}reset db started`);
    // TODO drop statements dry run

    await dropRatingsTableIfExists();
    await dropCdksTableIfExists();

    const assessmentTypeNames = Object.keys(assessmentTypesData);

    for (let assessmentTypeName of assessmentTypeNames) {
      await dropResultsTableIfExists(assessmentTypeName);
    }

    await dropAssessmentsTableIfExists();
    await dropUsersTableIfExists();
  } catch (error) {
    console.log('Error during database reset');
    console.log(error.stack);
  }
};

module.exports = {
  initializeDatabase,
  resetDatabase,
};
