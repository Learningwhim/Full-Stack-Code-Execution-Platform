require('dotenv').config();
//console.log("DB URL:", process.env.DATABASE_URL);
module.exports = {
  development: {
    client: 'pg',
    connection: {
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
      port: 5432,
      user: 'postgres.rheqruzluqllbookhqkv',
      password: process.env.DB_PASSWORD,
      database: 'postgres',
  ssl: { require: true, rejectUnauthorized: false }
},
    pool: { min: 2, max: 15 },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' }
  }
};
