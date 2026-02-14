const NmAccessToken = require('../models/NmAccessToken');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const redeemLaunchToken = async (token, reqMeta) => {
  const accessToken = await NmAccessToken.findOne({ token });
  if (!accessToken || accessToken.expiresAt < new Date() || accessToken.usedAt) {
    throw new Error('Invalid or expired token');
  }
  accessToken.usedAt = new Date();
  await accessToken.save();
  return { courseCode: accessToken.courseCode, nmUserId: accessToken.nmUserId };
};

const createSession = (nmUserId, courseCode, res) => {
  const sessionToken = jwt.sign({ nmUserId, courseCode }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('nm_session', sessionToken, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1h
};

module.exports = { redeemLaunchToken, createSession };