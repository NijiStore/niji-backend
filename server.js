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

// ── START ──
app.listen(PORT, () => {
  console.log(`Niji server running on port ${PORT}`);
});