const fs = require('fs/promises');
const path = require('path');
const XlsxTemplate = require('xlsx-template');

const { unmapAnswers } = require('../../assessmentTypesData');
const {
  ASSESSMENT_FIELDS,
  DEMOGRAPHICS_FIELDS,
  DEMOGRAPHICS_FIELDS_SENSITIVE,
  MISC_FIELDS,
} = require('../constants');

const BASE_TEMPLATE_FILE = {
  employee: 'employee_assessment_results_template.xlsx',
  student: 'student_assessment_results_template.xlsx',
};

const prepareObjectValues = (item, keys, mapper) => {
  return keys.reduce((row, key) => {
    row[key] = mapper ? mapper(key, item[key]) : item[key];

    return row;
  }, {});
};

const prepareTableValues = (items, keys, mapper) => {
  return items.map((item) => prepareObjectValues(item, keys, mapper));
};

// rawDataValues.title = `Results of ${assessment.name} (#${assessment.id}) with ${results.length} results in total`;

const prepareValues = (data) => {
  const rawDataValues = {};

  const { assessment, results } = data;

  // rawDataValues.participant = results.map((result, idx) => ({ name: `Candidate ${idx + 1}` }));
  rawDataValues.answers = results.map((result) => unmapAnswers(result));
  rawDataValues.misc = prepareTableValues(results, MISC_FIELDS);
  rawDataValues.demographics = Object.assign(
    prepareTableValues(results, DEMOGRAPHICS_FIELDS_SENSITIVE, () => '<hidden>'),
    prepareTableValues(results, DEMOGRAPHICS_FIELDS[assessment.assessmentType] || []),
  );

  const assessmentMetadataValues = {
    assessment: prepareObjectValues(assessment, ASSESSMENT_FIELDS),
  };

  return {
    rawDataValues,
    assessmentMetadataValues,
  };
};

const useResultsTemplate = async ({ rawDataValues, assessmentMetadataValues }, assessment) => {
  let templateFile;
  const templatePath = BASE_TEMPLATE_FILE[assessment.assessmentType];

  try {
    templateFile = await fs.readFile(path.join(__dirname, templatePath));
  } catch (error) {
    console.log(`Could not find template: ${templatePath}`);
    throw error;
  }

  const template = new XlsxTemplate(templateFile);
  template.substitute('Raw Data ', rawDataValues);
  template.substitute('Assessment Metadata', assessmentMetadataValues);

  return template.generate({ type: 'nodebuffer' });
};

module.exports = {
  prepareValues,
  useResultsTemplate,
};
