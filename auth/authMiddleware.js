const { getSession } = require('./sessionStore');
const pool = require('../db');

async function auth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  if (new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: 'Session expired' });
  }

  const userRes = await pool.query(`
    SELECT u.id, u.username, r.name AS role, r.permissions
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
  `, [session.user_id]);

  req.user = userRes.rows[0];

  next();
}

module.exports = auth;