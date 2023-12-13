'use strict';

const getKnex = require('../config');

const USERS_TABLE_NAME = 'users';

const alterUsersTable = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(USERS_TABLE_NAME);

  if (!exists) {
    console.log(`Table \`${USERS_TABLE_NAME}\` is missing!`);
    return;
  }

  const columnsExisting = {
    position: await knex.schema.hasColumn(USERS_TABLE_NAME, 'position'),
    role: await knex.schema.hasColumn(USERS_TABLE_NAME, 'role'),
  };

  const knexAlterUsers = knex.schema.alterTable(USERS_TABLE_NAME, (table) => {
    !columnsExisting.position && table.string('position');
    !columnsExisting.role && table.string('role');
  });

  if (dry) {
    const alterUsersDDL = await knexAlterUsers.generateDdlCommands();

    console.log(alterUsersDDL);
  } else {
    await knexAlterUsers;

    console.log(`Altered table \`${USERS_TABLE_NAME}\``);
  }
};

const ASSESSMENTS_TABLE_NAME = 'assessments';

const alterAssessmentsTable = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(ASSESSMENTS_TABLE_NAME);

  if (!exists) {
    console.log(`Table \`${ASSESSMENTS_TABLE_NAME}\` is missing!`);
    return;
  }

  const columnsExisting = {
    archived: await knex.schema.hasColumn(ASSESSMENTS_TABLE_NAME, 'archived'),
    participants: await knex.schema.hasColumn(ASSESSMENTS_TABLE_NAME, 'participants'),
  };

  const knexAlterAssessments = knex.schema.alterTable(ASSESSMENTS_TABLE_NAME, (table) => {
    !columnsExisting.archived && table.boolean('archived').defaultTo(false);
    !columnsExisting.participants && table.integer('participants').defaultTo(0);
  });

  if (dry) {
    const alterAssessmentsDDL = await knexAlterAssessments.generateDdlCommands();

    console.log(alterAssessmentsDDL);
  } else {
    await knexAlterAssessments;

    console.log(`Altered table \`${ASSESSMENTS_TABLE_NAME}\``);
  }
};

const up = async (dry = true) => {
  await alterUsersTable(dry);
  await alterAssessmentsTable(dry);
};

module.exports = {
  up,
};
