const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_SECRET } = require('../config/env');

const adminLogin = async ({ email, password }) => {
  const admin = await AdminUser.findOne({ email });
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  admin.lastLoginAt = new Date();
  await admin.save();
  const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
  return { token, admin: { id: admin._id, email: admin.email, role: admin.role } };
};

module.exports = { adminLogin };