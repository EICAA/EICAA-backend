const Knex = require('knex'); // const { default: knex } =

const knexfile = require('./knexfile');

let knex;

const getKnex = () => {
  if (!knex) {
    try {
      knex = Knex(knexfile);

      console.log('App has been successfully connected to database.');
    } catch (error) {
      console.log('Failed to connect to database.');
      console.log(error);
    }
  }

  return knex;
};

module.exports = getKnex;
