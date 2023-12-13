require('dotenv').config();

const {
  getAssessmentTypesData,
  processAssessmentTypes,
} = require('./src/services/assessmentTypesData');
const { initializeDatabase } = require('./src/services/database');

const logDDL = async () => {
  try {
    console.log('[app-init] processing assessment types data');
    processAssessmentTypes();

    const assessmentTypeData = getAssessmentTypesData();
    await initializeDatabase(assessmentTypeData, true);
  } catch (error) {
    console.log(error);
  }
};

logDDL();

// Use the logged result as JWT_SECRET

// console.log(require('crypto').randomBytes(64).toString('hex'));
