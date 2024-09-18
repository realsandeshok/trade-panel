//config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trade-panel',
  password: '2113',
  port: 5432,
});

module.exports = pool;
