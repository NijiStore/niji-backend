function requirePermission(permission) {
  return (req, res, next) => {
    const perms = req.user.permissions || [];

    if (!perms.includes(permission)) {
      return res.status(403).json({ error: 'No permission' });
    }

    next();
  };
}

module.exports = requirePermission;