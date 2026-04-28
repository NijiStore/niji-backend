require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// ── APP ──
const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors({
  origin: ['https://nijistore.github.io'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.send('Niji API running');
});

// ── ROUTES ──
const protojournalRoutes = require('./routes/protojournal');
const authRoutes = require('./routes/auth');

// mount routes
app.use('/api/protojournal', protojournalRoutes);
app.use('/auth', authRoutes);

app.post('/auth/bootstrap', async (req, res) => {
  const { key, username, password } = req.body;

  if (key !== process.env.BOOTSTRAP_KEY) {
    return res.status(403).json({ error: 'Invalid bootstrap key' });
  }

  const bcrypt = require('bcrypt');

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
    [username, hash]
  );

  res.json({
    success: true,
    user: result.rows[0]
  });
});

// ── START ──
app.listen(PORT, () => {
  console.log(`Niji server running on port ${PORT}`);
});