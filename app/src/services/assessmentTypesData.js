// const ASSESSMENT_TYPES = ['employee', 'student'];
const student = require('../assessment_type_data/student');
const employee = require('../assessment_type_data/employee');

const assessmentTypesFiles = {
  student,
  employee,
};

const assessmentTypesData = {};

const getMappings = (assessmentTypeFile) => {
  const { items } = assessmentTypeFile || {};

  const columnsMapping = {};
  // const columnsReverseMapping = {};
  /*const groups = [];
  const groupsQuestions = {};*/

  if (items) {
    for (let item of items) {
      const { id /*, area, competence, question*/ } = item;

      columnsMapping[id] = `q${id}`;

      /* const group = `${area}_${competence}`;
      if (!groups.includes(group)) {
        groups.push(group);
        groupsQuestions[group] = [];
      }

      const groupQuestions = groupsQuestions[group];
      groupQuestions.push(question);

      const groupIdx = groups.indexOf(group);
      const questionIdx = groupQuestions.length - 1;
      const columnName = `${groupIdx}_${questionIdx}`;

      columnsMapping[id] = {
        columnName,
        groupIdx,
        questionIdx,
      };
      columnsReverseMapping[columnName] = id; */
    }
  } else {
    // throw a named error
  }

  return columnsMapping;
};

const getAreas = (assessmentTypeFile) => {
  const { items } = assessmentTypeFile || {};

  const areas = {};
  const areaList = [];

  if (items) {
    for (let item of items) {
      const { area, competence } = item;

      if (!areaList.includes(area)) {
        areaList.push(area);
        areas[areaList.length] = { name: area, competences: [] };
      }

      const currentAreaId = areaList.indexOf(area) + 1;
      const currentArea = areas[currentAreaId];

      if (currentArea) {
        const { competences } = currentArea;

        if (!competences.includes(competence)) {
          competences.push(competence);
        }
      }
    }
  } else {
    // throw a named error
  }

  return areas;
};

const processAssessmentTypeFiles = (assessmentTypeFiles) => {
  let defaultAssessmentTypeFile = assessmentTypeFiles['en'];

  if (!defaultAssessmentTypeFile) {
    defaultAssessmentTypeFile = assessmentTypeFiles.length ? assessmentTypeFiles[0] : null;
  }

  const areas = getAreas(defaultAssessmentTypeFile);
  const columnsMapping = getMappings(defaultAssessmentTypeFile);

  return {
    areas,
    columnsMapping,
    assessmentTypeFiles,
  };
};

const processAssessmentTypes = () => {
  const assessmentTypeNames = Object.keys(assessmentTypesFiles);

  for (let assessmentTypeName of assessmentTypeNames) {
    const assessmentTypeData = processAssessmentTypeFiles(assessmentTypesFiles[assessmentTypeName]);

    assessmentTypesData[assessmentTypeName] = assessmentTypeData;
  }
};

const getAssessmentTypesData = () => {
  if (!Object.keys(assessmentTypesData).length) {
    throw new Error('FATAL: No assessment type data found');
  }
  return assessmentTypesData;
};

const mapAnswers = (answersArray) => {
  const mappedAnswers = {};

  for (let answerItem of answersArray) {
    const { id, answer } = answerItem;

    const columnName = `q${id}`;
    mappedAnswers[columnName] = answer;
  }

  return mappedAnswers;
};

const unmapAnswers = (resultRecord) => {
  const unmappedAnswers = {};

  const resultEntries = Object.entries(resultRecord);

  for (let [key, value] of resultEntries) {
    if (key.lastIndexOf('q') === 0) {
      unmappedAnswers[key] = value;
    }
  }

  return unmappedAnswers;
};

module.exports = {
  processAssessmentTypes,
  getAssessmentTypesData,
  mapAnswers,
  unmapAnswers,
};
