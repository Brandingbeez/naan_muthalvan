const AuditLog = require('../models/AuditLog');
const { asyncHandler } = require('../utils/asyncHandler');

const getAuditLogs = asyncHandler(async (req, res) => {
  const { limit, actorType, action } = req.query;
  const query = {};
  if (actorType) query.actorType = actorType;
  if (action) query.action = action;
  const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit);
  res.json(logs);
});

module.exports = { getAuditLogs };