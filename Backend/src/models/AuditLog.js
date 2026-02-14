const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorType: { type: String, required: true },
  actorId: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: String },
  requestId: { type: String },
  requestBody: { type: String },
  responseBody: { type: String },
  statusCode: { type: Number },
  success: { type: Boolean },
  errorMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);