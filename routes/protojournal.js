const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/protojournalController');

const auth = require('../auth/authMiddleware');
const requirePermission = require('../auth/permissionMiddleware');

router.get(
  '/prototypes',
  auth,
  requirePermission('protojournal:read'),
  ctrl.getAll
);

router.post(
  '/prototypes',
  auth,
  requirePermission('protojournal:write'),
  ctrl.create
);

router.patch(
  '/prototypes/:id',
  auth,
  requirePermission('protojournal:write'),
  ctrl.update
);

router.delete(
  '/prototypes/:id',
  auth,
  requirePermission('protojournal:write'),
  ctrl.remove
);

module.exports = router;