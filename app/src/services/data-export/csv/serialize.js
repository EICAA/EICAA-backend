const { stringify } = require('csv-stringify');

const { API_ERRORS } = require('../../../utils/errors');
const { getAssessmentTypesData } = require('../../assessmentTypesData');
const { ASSESSMENT_FIELDS, DEMOGRAPHICS_FIELDS, MISC_FIELDS } = require('../constants');

const getColumns = (firstRecord, assessment) => {
  const recordKeys = Object.keys(firstRecord);

  const questionColumns = recordKeys
    .filter((key) => key.indexOf('q') === 0)
    .sort((a, b) => {
      return a.substring(1) - 0 - (b.substring(1) - 0);
    });

  return [...questionColumns, ...MISC_FIELDS, ...DEMOGRAPHICS_FIELDS[assessment.assessmentType]];
};

const options = { delimiter: ';' };

const getMetadata = (user, assessment) => {
  const userPart = user
    ? `#user.name ${user.firstName} ${user.lastName},\n`
    : '#user.name ! Unknown/deleted !\n';
  const assessmentPart = assessment
    ? ASSESSMENT_FIELDS.reduce((acc, field) => {
        let value = assessment[field];
        if (value instanceof Date) {
          value = value.toISOString();
        }

        return acc + `#assessment.${field} ${value},\n`;
      }, '')
    : '';

  return userPart + assessmentPart;
};

const getResultsAsCsv = async (user, assessment, records) => {
  try {
    const metadata = getMetadata(user, assessment);
    let columns;
    let csvBody = '';

    if (Array.isArray(records) && records.length) {
      columns = getColumns(records[0], assessment);

      const optionsUsed = {
        ...options,
        columns,
        delimiter: ',',
        header: true,
      };

      /*const recordsMapped = records.map((record) => {
        return DEMOGRAPHICS_FIELDS_SENSITIVE.reduce(
          (mapped, fieldName) => {
            mapped[fieldName] = '<hidden>';
            return mapped;
          },
          {
            ...record,
          },
        );
      });*/

      csvBody = await new Promise((resolve, reject) => {
        stringify(records, optionsUsed, (err, output) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(output);
        });
      });
    }

    return metadata + csvBody;
  } catch (err) {
    console.log(err);
  }
};

const getHelpFile = async (assessmentType) => {
  const assessmentTypeData = getAssessmentTypesData()[assessmentType];

  if (!assessmentTypeData) throw API_ERRORS.NotFound('user.assessment-type.not-found');

  let helpFile = assessmentTypeData.help;

  if (!assessmentTypeData.help) {
    const rows = assessmentTypeData.assessmentTypeFiles['en'].items.map((item) => {
      const converted = {
        ...item,
        column: `q${item.id}`,
      };
      delete converted.id;

      return converted;
    });

    columns = ['column', 'area', 'competence', 'question'];

    const optionsUsed = {
      ...options,
      columns,
      delimiter: ',',
      header: true,
    };

    helpFile = await new Promise((resolve, reject) => {
      stringify(rows, optionsUsed, (err, output) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(output);
      });
    });

    assessmentTypeData.help = helpFile;
  }

  return helpFile;
};

module.exports = {
  getResultsAsCsv,
  getHelpFile,
};
