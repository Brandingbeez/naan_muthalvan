const mongoose = require('mongoose');

const nmProgressSchema = new mongoose.Schema({
  nmUserId: { type: String, required: true },
  courseCode: { type: String, required: true },
  progress: { type: mongoose.Schema.Types.Mixed },
  lastUpdatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

nmProgressSchema.index({ nmUserId: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model('NmProgress', nmProgressSchema);