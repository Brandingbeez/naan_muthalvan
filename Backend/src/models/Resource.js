const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['youtube', 'file'], required: true },
  
  // YouTube-specific fields
  youtubeUrl: { type: String },
  
  // File-specific fields
  storageProvider: { type: String, enum: ['gcs', 'local'], default: 'gcs' },
  gcsBucket: { type: String },
  gcsObjectPath: { type: String },
  gcsUri: { type: String },
  publicUrl: { type: String }, // if bucket is public
  
  // File metadata
  originalFileName: { type: String },
  mimeType: { type: String },
  sizeBytes: { type: Number },
  fileExt: { type: String },
  category: { type: String, enum: ['pdf', 'ppt', 'video', 'docs', 'sheets'] },
  
  // Legacy fields (for backward compatibility)
  url: { type: String },
  fileName: { type: String },
  
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Indexes for efficient queries
resourceSchema.index({ sessionId: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ isActive: 1 });
resourceSchema.index({ sessionId: 1, isActive: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
