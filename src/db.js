const { Pool } = require('pg');

// The pool manages a set of reusable DB connections instead of opening
// a new one for every request — this is what you'd tune (max connections, timeouts) in a real production app.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tasktracker',
});

module.exports = pool;