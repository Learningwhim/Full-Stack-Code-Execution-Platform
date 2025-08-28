
const knex = require('knex');
const knex_config = require('./knexfile.js');
export_devObj = knex(knex_config.development);
module.exports = export_devObj;