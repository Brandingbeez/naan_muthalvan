const mongoose = require('mongoose');

const nmSubscriptionSchema = new mongoose.Schema({
  nmUserId: { type: String, required: true },
  courseCode: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });

nmSubscriptionSchema.index({ nmUserId: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model('NmSubscription', nmSubscriptionSchema);