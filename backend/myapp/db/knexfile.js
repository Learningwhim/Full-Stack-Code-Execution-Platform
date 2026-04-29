require('dotenv').config();
//console.log("DB URL:", process.env.DATABASE_URL);
module.exports = {
  development: {
    client: 'pg',
    connection: {
  host: 'db.rheqruzluqllbookhqkv.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  ssl: { require: true, rejectUnauthorized: false }
},
    pool: { min: 2, max: 15 },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' }
  }
};
