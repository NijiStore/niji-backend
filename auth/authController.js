const pool = require('../db');
const bcrypt = require('bcryptjs');
const { createSession, deleteSession } = require('./sessionStore');

async function login(req, res) {
  const { username, password } = req.body;

  const userRes = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  const user = userRes.rows[0];

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = await createSession(user.id);

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });

  res.json({ success: true });
}

async function logout(req, res) {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  res.clearCookie('sessionId');
  res.json({ success: true });
}

module.exports = {
  login,
  logout
};