const getKnex = require('../config');

const IDX_JSON_ID = 'idx_cdks_json_id';
const IDX_CDK_TYPE = 'idx_cdks_cdk_type';

const TABLE_NAME = 'cdks';

const createCdksTableIfNotExists = async (dry) => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!dry && exists) {
    console.log(`Found table \`${TABLE_NAME}\``);
    return;
  }

  const tableCreate = knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('jsonId').index(IDX_JSON_ID);
    table.string('cdkType').index(IDX_CDK_TYPE);
    table.string('name');
    table.string('area');
    table.string('competence');
    table.string('difficulty');
    table.string('lastCreated');
  });

  if (!dry) {
    await tableCreate;
  } else {
    console.log(tableCreate.toString());
  }

  console.log(`Created table \`${TABLE_NAME}\``);
};

const dropCdksTableIfExists = async () => {
  const knex = getKnex();
  const exists = await knex.schema.hasTable(TABLE_NAME);

  if (!exists) return;

  await knex.schema.dropTable(TABLE_NAME);
  console.log(`Dropped table \`${TABLE_NAME}\``);
};

module.exports = {
  createCdksTableIfNotExists,
  dropCdksTableIfExists,
};
