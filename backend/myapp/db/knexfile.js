require('dotenv').config();
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,         // aws-1-ap-south-1.pooler.supabase.com
      port: process.env.DB_PORT,         // 5432
      user: process.env.DB_USER,         // postgres.sqlmlvqpcekvxlkjusle
      password: process.env.DB_PASSWORD, // *&r67.wKfsCQ4bk
      database: process.env.DB_DATABASE, // postgres
      ssl: { rejectUnauthorized: false } // needed for Supabase
    },
    pool: {
      min: 2,
      max: 15 // match your pooler size
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
