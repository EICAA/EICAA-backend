/* - Not using this entity, because this will be stored in-memory

const getKnex = require('../config');

const TABLE_NAME = 'assessment_types';

const createAssessmentTypesTableIfNotExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.string('name').primary();
    // table.boolean('resultsTableReady').defaultTo(false);
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable(TABLE_NAME, (table) => {
    const nonNullableColumns = ['name' /*, 'resultsTableReady'*-/];

    for (let nonNullableColumn of nonNullableColumns) {
      table.dropNullable(nonNullableColumn);
    }
  });

  console.log(`Created table \`${TABLE_NAME}\``);
};

const dropAssessmentTypesTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createAssessmentTypesTableIfNotExists,
  dropAssessmentTypesTableIfExists,
};*/
