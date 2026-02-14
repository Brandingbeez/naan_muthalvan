const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String },
  sessionNumber: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

sessionSchema.index({ subjectId: 1, sessionNumber: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);