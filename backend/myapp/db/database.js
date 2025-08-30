// database.js
const knex = require('knex');
const knexConfig = require('./knexfile.js');

// Create a single, shared connection instance
const db = knex(knexConfig.development);

module.exports = db;