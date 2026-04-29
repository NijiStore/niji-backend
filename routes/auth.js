const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const { createSession } = require('../auth/sessionStore');
const auth = require('../auth/authMiddleware');

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // ✅ FIXED: createSession returns ID directly
  const sessionId = await createSession(user.id);

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });

  res.json({ success: true });
});

router.post('/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    const { deleteSession } = require('../auth/sessionStore');
    await deleteSession(sessionId);
  }

  res.clearCookie('sessionId');
  res.json({ success: true });
});

// 👤 GET CURRENT USER
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;