const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true },
  title: { type: String, required: true },
  description: { type: String },
  courseCode: { type: String, required: true, unique: true },
  courseCodeLower: { type: String, required: true, unique: true },
  language: { type: String },
  imageUrl: { type: String },
  courseType: { type: String, enum: ['online', 'offline'], default: 'online' },
  isActive: { type: Boolean, default: true },
  nmPublished: { type: Boolean, default: false },
  nmApproved: { type: Boolean, default: false },
  totalSubjects: { type: Number, default: 0 },
  objectives: [{ objective: { type: String, required: true } }],
}, { timestamps: true });

courseSchema.index({ courseCodeLower: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);