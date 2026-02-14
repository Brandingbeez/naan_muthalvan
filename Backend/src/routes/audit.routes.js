const express = require('express');
const { getAuditLogs } = require('../controllers/audit.controller');
const { validate } = require('../middleware/validate');
const { auditQuerySchema } = require('../validators/admin.schemas');

const router = express.Router();

router.get('/admin/audit', validate({ querySchema: auditQuerySchema }), getAuditLogs);

module.exports = router;