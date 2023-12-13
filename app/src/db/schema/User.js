'use strict';

const getKnex = require('../config');

const UNIQUE_EMAIL = 'idxu_users_email';
const IDX_PASSWORD = 'idx_password';
const IDX_RESET_PW_TOKEN = 'idx_reset_pw_token';

const TABLE_NAME = 'users';

const createUsersTableIfNotExists = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!dry && exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  const tableCreate = knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.string('email').unique({ indexName: UNIQUE_EMAIL }); // TODO ??
    table.string('lastName');
    table.string('firstName');
    table.string('password').index(IDX_PASSWORD); // TODO hash method to be implemented
    table.string('organization');
    table.string('position');
    table.string('role');
    table.string('country');
    table.string('languagePreference').defaultTo('en');
    table.string('resetPasswordToken').index(IDX_RESET_PW_TOKEN);
    table.boolean('consentGiven');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  if (!dry) {
    await tableCreate;
  } else {
    console.log(tableCreate.toString());
  }

  const tableAlter = knex.schema.alterTable(TABLE_NAME, (table) => {
    const nonNullableColumns = [
      'email',
      'lastName',
      'firstName',
      'organization',
      'position',
      'role',
      'country',
      'deleted',
      // 'password' - if no password, only forgotten/reset is possible to regain access
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

const dropUsersTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createUsersTableIfNotExists,
  dropUsersTableIfExists,
};
