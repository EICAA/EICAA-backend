/* - Not using this entity, because this will be stored in-memory

const getKnex = require('../config');

const FK_ASSESSMENT_TYPE = 'fk_atd_assessment_type_to_assessment_type_name';
const IDX_ASSESSMENT_TYPE = 'idx_atd_assessment_type';
const IDX_LANGUAGE_VERSION = 'idx_language_version';

const TABLE_NAME = 'assessment_type_data';

const createAssessmentTypeDataTableIfNotExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.string('assessmentType').index(IDX_ASSESSMENT_TYPE);
    table.string('language');
    table.string('version');
    table.json('datafile');
    table.datetime('createdAt').defaultTo(knex.fn.now());
    // Questions are not stored in database - will be read from fs
  });

  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.foreign('assessmentType', FK_ASSESSMENT_TYPE).references('assessment_types.name'); // .onUpdate().onDelete()
    table.index(['language', 'version'], IDX_LANGUAGE_VERSION);
  });

  console.log(`Created table \`${TABLE_NAME}\``);
};

const dropAssessmentTypeDataTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createAssessmentTypeDataTableIfNotExists,
  dropAssessmentTypeDataTableIfExists,
}; */
