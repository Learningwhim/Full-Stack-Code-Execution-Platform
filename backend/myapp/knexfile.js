// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'db.sqlmlvqpcekvxlkjusle.supabase.co',   // copy from Supabase dashboard
      port: 5432,
      user: 'postgres',
      password: '*&r67.wKfsCQ4bk', // from settings
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  },

  
};
