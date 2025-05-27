const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'plataforma_clases',
  password: 'w858504042828',
  port: 5432,
});

module.exports = pool;
