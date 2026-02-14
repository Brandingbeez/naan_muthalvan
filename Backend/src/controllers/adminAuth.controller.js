const { adminLogin } = require('../services/auth.service');
const { writeAudit } = require('../services/audit.service');
const { asyncHandler } = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { token, admin } = await adminLogin(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: admin.id,
    action: 'login',
    req,
    requestBody: req.body,
    responseBody: { token },
    statusCode: 200,
    success: true,
  });
  res.json({ token, admin });
});

module.exports = { login };