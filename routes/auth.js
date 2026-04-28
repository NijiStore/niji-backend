const pool = require('../db');

function requirePermission(permission) {
  return async (req, res, next) => {
    const userId = req.user.id;

    const resPerm = await pool.query(
      'SELECT * FROM permissions WHERE user_id = $1 AND permission = $2',
      [userId, permission]
    );

    if (resPerm.rows.length === 0) {
      return res.status(403).json({ error: 'No permission' });
    }

    next();
  };
}

module.exports = requirePermission;