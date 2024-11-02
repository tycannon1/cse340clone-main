// config/db.js
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in your .env file
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;