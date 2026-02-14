const express = require('express');
const adminAuthRoutes = require('./adminAuth.routes');
const adminContentRoutes = require('./adminContent.routes');
const adminNmRoutes = require('./adminNm.routes');
const nmPartnerRoutes = require('./nmPartner.routes');
const publicRoutes = require('./public.routes');
const auditRoutes = require('./audit.routes');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

router.use('/admin/auth', adminAuthRoutes);
router.use('/admin', requireAdmin, adminContentRoutes);
router.use('/admin', requireAdmin, adminNmRoutes);
router.use('/admin', requireAdmin, auditRoutes);
router.use('/', publicRoutes);
router.use('/', nmPartnerRoutes);

module.exports = router;