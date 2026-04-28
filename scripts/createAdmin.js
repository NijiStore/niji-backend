const pool = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
  const username = 'admin';
  const password = 'admin123'; // change later

  const hash = await bcrypt.hash(password, 10);

  const res = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
    [username, hash]
  );

  console.log('Admin created:', res.rows[0]);
}

createAdmin().then(() => process.exit());

