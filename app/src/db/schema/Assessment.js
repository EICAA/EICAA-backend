'use strict';

const getKnex = require('../config');

const FK_USER_ID = 'fk_assessments_user_id_to_users_id';
// const FK_ASSESSMENT_TYPE = 'fk_assessments_at_to_assessment_type_name';
const IDX_USER_ID = 'idx_assessments_user_id';
const IDX_ASSESSMENT_TYPE = 'idx_assessments_assessment_type';
const IDX_HASH = 'idx_assessments_hash';

const TABLE_NAME = 'assessments';

const createAssessmentsTableIfNotExists = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!dry && exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  const tableCreate = knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('userId').unsigned().index(IDX_USER_ID);
    table.string('assessmentType').index(IDX_ASSESSMENT_TYPE);
    table.string('hash').index(IDX_HASH);
    table.string('name');
    table.string('country');
    table.string('availableLanguages');
    table.boolean('emailRequired').defaultTo(false);
    table.boolean('demographics').defaultTo(true);
    table.boolean('shareResults').defaultTo(false);
    table.boolean('archived').defaultTo(false);
    table.datetime('activeFrom');
    table.datetime('activeTo');
    table.integer('participants').defaultTo(0);
    table.integer('maxParticipants');
    table.datetime('createdAt').defaultTo(knex.fn.now());
  });

  if (!dry) {
    await tableCreate;
  } else {
    console.log(tableCreate.toString());
  }

  const tableAlter = knex.schema.alterTable(TABLE_NAME, (table) => {
    table.foreign('userId', FK_USER_ID).references('users.id'); // .onUpdate().onDelete()
    // table.foreign('assessmentType', FK_ASSESSMENT_TYPE).references('assessment_types.name');

    const nonNullableColumns = [
      'name',
      'assessmentType',
      'emailRequired',
      'demographics',
      'shareResults',
      'archived',
      'participants',
    ];

    for (let nonNullableColumn of nonNullableColumns) {
      table.dropNullable(nonNullableColumn);
    }
  });

  if (!dry) {
    await tableAlter;
  } else {
    console.log(tableAlter.toString());
  }

  console.log(`Created table \`${TABLE_NAME}\``);
};

const dropAssessmentsTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createAssessmentsTableIfNotExists,
  dropAssessmentsTableIfExists,
};
