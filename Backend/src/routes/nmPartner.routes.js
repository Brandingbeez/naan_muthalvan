const express = require('express');
const { subscribe, access, getProgress } = require('../controllers/nmPartner.controller');
const { validate } = require('../middleware/validate');
const { subscribeSchema, accessSchema, progressSchema } = require('../validators/nmPartner.schemas');
const { nmPartnerAuth } = require('../middleware/nmPartnerAuth');
const { redeemLaunchToken, createSession } = require('../services/nmLaunch.service');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/nm/course/subscribe', nmPartnerAuth, validate({ bodySchema: subscribeSchema }), subscribe);
router.post('/nm/course/access', nmPartnerAuth, validate({ bodySchema: accessSchema }), access);
router.post('/nm/student/progress', nmPartnerAuth, validate({ bodySchema: progressSchema }), getProgress);

const launch = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { courseCode, nmUserId } = await redeemLaunchToken(token, {});
  createSession(nmUserId, courseCode, res);
  res.redirect(`/courses/${courseCode}`);
});
router.get('/nm/launch', launch);

module.exports = router;