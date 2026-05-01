const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../auth/authMiddleware');
const requirePermission = require('../auth/permissionMiddleware');

router.get('/', auth, requirePermission('admin:access'), async (req, res) => {
  const result = await pool.query('SELECT * FROM roles');
  res.json(result.rows);
});

router.post('/', auth, requirePermission('admin:access'), async (req, res) => {
  const { name, permissions } = req.body;

  const result = await pool.query(
    'INSERT INTO roles (name, permissions) VALUES ($1, $2) RETURNING *',
    [name, permissions]
  );

  res.json(result.rows[0]);
});

router.patch('/:id', auth, requirePermission('admin:access'), async (req, res) => {
  const { name, permissions } = req.body;

  const result = await pool.query(
    'UPDATE roles SET name = $1, permissions = $2 WHERE id = $3 RETURNING *',
    [name, permissions, req.params.id]
  );

  res.json(result.rows[0]);
});

router.delete('/:id', auth, requirePermission('admin:access'), async (req, res) => {
  await pool.query('DELETE FROM roles WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;