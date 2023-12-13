'use strict';

const getKnex = require('../config');

const FK_ASSESSMENT_ID = 'fk_rf_:assessmentType_assessment_id_to_assessments_id';
const IDX_ASSESSMENT_ID = 'idx_rf_:assessmentType_assessment_id';

const TABLE_NAME = 'results_for_:assessmentType';

const doesResultsTableExist = async (assessmentType) => {
  const tableName = TABLE_NAME.replace(':assessmentType', assessmentType);

  const knex = getKnex();
  const exists = await knex.schema.hasTable(tableName);

  return exists;
};

const createDemographyFieldsForEmployeeType = (table) => {
  table.string('country');
  table.string('educationLevel');
  table.string('workExperience');
  table.string('workField');
  table.string('organisationType');
  table.string('organisationSize');
  table.string('levelOfPosition');
  table.string('gender');
  table.string('ageGroup');
};

const createDemographyFieldsForStudentType = (table) => {
  table.string('country');
  table.string('educationLevel');
  table.string('majorField');
  table.string('hasWorkExperience');
  table.string('workExperience');
  table.string('employmentStatus');
  table.string('employmentType');
  table.string('gender');
  table.string('ageGroup');
};

const createResultsTableIfNotExists = async (assessmentType, questionColumnNames, dry) => {
  const tableName = TABLE_NAME.replace(':assessmentType', assessmentType);

  const knex = getKnex();
  const exists = await knex.schema.hasTable(tableName);

  if (!dry && exists) {
    console.log(`Found table \`${tableName}\``);
    return true;
  }

  console.log(`Creating table \`${tableName}\`...`);

  const fkName = FK_ASSESSMENT_ID.replace(':assessmentType', assessmentType);
  const idxName = IDX_ASSESSMENT_ID.replace(':assessmentType', assessmentType);

  const tableCreate = knex.schema.createTable(tableName, (table) => {
    table.increments('id');
    table.integer('assessmentId').unsigned().index(idxName);
    table.string('email');
    table.datetime('start').defaultTo(knex.fn.now()); // Participant starts taking quiz
    table.datetime('end').defaultTo(knex.fn.now()); // Participant ends taking quiz
    table.integer('durationSeconds').defaultTo(0);
    table.string('language');
    table.string('resultToken');
    table.tinyint('feedbackScore');
    table.text('feedbackText'); // TODO max length?
    table.boolean('requestedRemoval').defaultTo('false');
    table.boolean('consentGiven');
    table.datetime('createdAt').defaultTo(knex.fn.now());

    if (assessmentType === 'employee') {
      createDemographyFieldsForEmployeeType(table);
    }
    if (assessmentType === 'student') {
      createDemographyFieldsForStudentType(table);
    }

    for (let questionColumnName of questionColumnNames) {
      table.tinyint(questionColumnName);
    }
  });

  if (!dry) {
    await tableCreate;
  } else {
    console.log(tableCreate.toString());
  }

  const tableAlter = knex.schema.alterTable(tableName, (table) => {
    table.foreign('assessmentId', fkName).references('assessments.id'); // .onUpdate().onDelete()

    const nonNullableColumns = ['resultToken'];

    for (let nonNullableColumn of nonNullableColumns) {
      table.dropNullable(nonNullableColumn);
    }
  });

  if (!dry) {
    await tableAlter;
  } else {
    console.log(tableAlter.toString());
  }

  console.log(`Created table \`${tableName}\``);
};

const dropResultsTableIfExists = async (assessmentType) => {
  const tableName = TABLE_NAME.replace(':assessmentType', assessmentType);

  const knex = getKnex();
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) return true;

  console.log(`Dropping table \`${tableName}\`...`);

  await knex.schema.dropTable(tableName);
  console.log(`Dropped table \`${tableName}\``);
};

module.exports = {
  doesResultsTableExist,
  createResultsTableIfNotExists,
  dropResultsTableIfExists,
};
