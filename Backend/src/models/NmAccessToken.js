const mongoose = require('mongoose');

const nmAccessTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  nmUserId: { type: String, required: true },
  courseCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
}, { timestamps: true });

nmAccessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('NmAccessToken', nmAccessTokenSchema);