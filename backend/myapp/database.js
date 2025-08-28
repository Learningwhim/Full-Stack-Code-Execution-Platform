
const knex = require('knex');
const knex_config = require('./knexfile.js');
const db = knex(knex_config.development);

module.exports = db;
//hello