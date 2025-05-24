require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRESQL_NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

module.exports = pool;