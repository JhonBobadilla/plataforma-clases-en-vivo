require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'plataforma_clases',
  password: process.env.DB_PASSWORD || 'w858504042828',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

module.exports = pool;

