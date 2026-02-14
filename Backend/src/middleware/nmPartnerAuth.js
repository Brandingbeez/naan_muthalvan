const { NM_PARTNER_BEARER_TOKEN } = require('../config/env');

const nmPartnerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== NM_PARTNER_BEARER_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

module.exports = { nmPartnerAuth };