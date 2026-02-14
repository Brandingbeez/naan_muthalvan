const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  lastLoginAt: { type: Date },
}, { timestamps: true });

adminUserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);