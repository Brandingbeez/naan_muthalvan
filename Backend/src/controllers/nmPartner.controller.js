const nmPartnerService = require('../services/nmPartner.service');
const nmProgressService = require('../services/nmProgress.service');
const { writeAudit } = require('../services/audit.service');
const { asyncHandler } = require('../utils/asyncHandler');

const subscribe = asyncHandler(async (req, res) => {
  const result = await nmPartnerService.subscribeFromNm(req.body, { baseUrl: `${req.protocol}://${req.get('host')}` });
  await writeAudit({
    actorType: 'nm_partner',
    actorId: req.body.nmUserId,
    action: 'subscribe',
    entityType: 'subscription',
    entityId: req.body.courseCode,
    req,
    requestBody: req.body,
    responseBody: result,
    statusCode: 200,
    success: true,
  });
  res.json(result);
});

const access = asyncHandler(async (req, res) => {
  const result = await nmPartnerService.accessFromNm(req.body, { baseUrl: `${req.protocol}://${req.get('host')}` });
  await writeAudit({
    actorType: 'nm_partner',
    actorId: req.body.nmUserId,
    action: 'access',
    entityType: 'access',
    entityId: req.body.courseCode,
    req,
    requestBody: req.body,
    responseBody: result,
    statusCode: 200,
    success: true,
  });
  res.json(result);
});

const getProgress = asyncHandler(async (req, res) => {
  const result = await nmPartnerService.getProgressForNm(req.body);
  res.json(result);
});

module.exports = { subscribe, access, getProgress };