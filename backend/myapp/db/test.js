const { Client } = require("pg");

const client = new Client({
  host: "aws-1-ap-south-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.sqlmlvqpcekvxlkjusle",
  password: "*&r67.wKfsCQ4bk",
  database: "postgres",
  ssl: { require: true, rejectUnauthorized: false }
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Supabase!");

    const res = await client.query("SELECT NOW()");
    console.log("⏱ DB Time:", res.rows[0]);

    await client.end();
    console.log("🔌 Connection closed gracefully");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
})();
