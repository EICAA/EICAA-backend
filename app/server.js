'use strict';

require('dotenv').config();

var path = require('path');

const http = require('http');
// const https = require('https');

const app = require('./src/app');
const { initializeDatabase, resetDatabase } = require('./src/services/database');
const {
  processAssessmentTypes,
  getAssessmentTypesData,
} = require('./src/services/assessmentTypesData');
const { processCdkMetadataFiles } = require('./src/services/competenceDevelopmentKitData');
const { isTruthyEnv } = require('./src/utils/conversions');

global.appRoot = path.resolve(__dirname);

const startup = async () => {
  try {
    console.log('[app-startup] processing assessment types data');
    processAssessmentTypes();

    const assessmentTypesData = getAssessmentTypesData();

    if (isTruthyEnv(process.env.APP_RESET_DB_ON_STARTUP)) {
      await resetDatabase(assessmentTypesData);
    }

    await initializeDatabase(assessmentTypesData);

    console.log('[app-startup] processing competence development kit data');
    await processCdkMetadataFiles();

    //////////////////
    // start listening
    //////////////////

    const httpPort = process.env.HTTP_PORT || 3200;
    // const httpsPort = process.env.HTTPS_PORT || 3201;

    const httpServer = http.createServer(app);

    httpServer.listen(httpPort, () => {
      console.log(`[app-startup] App listening on port ${httpPort}`);
      console.log('Press Ctrl+C to quit.');
    });
  } catch (error) {
    console.log('FATAL: error during startup');
    console.log(error);
  }
};

startup();
