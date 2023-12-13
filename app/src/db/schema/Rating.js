const getKnex = require('../config');

const FK_USER_ID = 'fk_ratings_user_id_to_users_id';
const FK_CDK_ID = 'fk_ratings_cdk_id_to_cdk_id';

const IDX_USER_ID = 'idx_ratings_user_id';
const IDX_CDK_ID = 'idx_ratings_cdk_id';

const TABLE_NAME = 'ratings';

const createRatingsTableIfNotExists = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!dry && exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  const tableCreate = knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('userId').unsigned().index(IDX_USER_ID);
    table.integer('cdkId').unsigned().index(IDX_CDK_ID);
    table.tinyint('helpfulness');
    table.tinyint('trainingResults');
    table.tinyint('easeOfUse');
    table.tinyint('interactivity');
  });

  if (!dry) {
    await tableCreate;
  } else {
    console.log(tableCreate.toString());
  }

  const tableAlter = knex.schema.alterTable(TABLE_NAME, (table) => {
    table.foreign('userId', FK_USER_ID).references('users.id'); // .onUpdate().onDelete()
    table.foreign('cdkId', FK_CDK_ID).references('cdks.id');
  });

  if (!dry) {
    await tableAlter;
  } else {
    console.log(tableAlter.toString());
  }

  console.log(`Created table \`${TABLE_NAME}\``);
};

const dropRatingsTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createRatingsTableIfNotExists,
  dropRatingsTableIfExists,
};
