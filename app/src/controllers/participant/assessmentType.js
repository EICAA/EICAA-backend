'use strict';

const { getAssessmentTypesData } = require('../../services/assessmentTypesData');

/* const getAssessmentTypeWithData = async (name) => {
  const assessmentTypesData = getAssessmentTypesData();
  const assessmentTypeData = assessmentTypesData[name];

  if (assessmentTypeData) {
    return { assessmentType: assessmentTypeData };
  }
}; */

/* const getAssessmentTypeMeta = async (name) => {
  const assessmentTypesData = getAssessmentTypesData();
  const assessmentTypeData = assessmentTypesData[name];

  if (assessmentTypeData) {
    const { assessmentTypeFiles, questionColumnsMapping } = assessmentTypeData;

    return {
      availableLanguages: Object.keys(assessmentTypeFiles),
      questionColumnsMapping,
    };
  }
}; */

const getAssessmentTypeData = async (name, language) => {
  const assessmentTypesData = getAssessmentTypesData();
  const assessmentTypeData = assessmentTypesData[name];

  if (assessmentTypeData) {
    const { assessmentTypeFiles } = assessmentTypeData;

    return assessmentTypeFiles[language];
  }
};

module.exports = {
  getAssessmentTypeData,
};
