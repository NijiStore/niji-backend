const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

async function createSession(userId) {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await pool.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  );

  return sessionId;
}

async function getSession(sessionId) {
  const res = await pool.query(
    'SELECT * FROM sessions WHERE id = $1',
    [sessionId]
  );

  return res.rows[0];
}

async function deleteSession(sessionId) {
  await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}

module.exports = {
  createSession,
  getSession,
  deleteSession
};